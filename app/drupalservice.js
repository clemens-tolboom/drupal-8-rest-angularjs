'use strict';

var mod = angular.module('drupalService', ['ngResource']);

mod.hal = {
    fromServer: function (hal) {
        var internals = hal._internals = {};

        // Inject the nid (last element from href
        var nid = hal._links.self.href.split(/\//).pop();
        internals.nid = [{value: nid, _drupal: 'https://www.drupal.org/node/2304849'}];

        // Transform _links into node fields
        angular.forEach(hal._links, function (value, key) {
            if (key === 'self') {
                return;
            }
            if (key === 'type') {
                return;
            }
            var id = key.split(/\//).pop();
            internals[id] = [];
            angular.forEach(value, function (val, index) {
                internals[id].push({target_id: val.href.split(/\//).pop()});
            });
        });

    },
    toServer: function (hal) {
        delete hal._internals;
    }
};

mod
    .factory('Node', ['SERVER', '$resource', 'DrupalState', function (SERVER, $resource, DrupalState) {
        return $resource('/node/:nid', {nid: '@nid'}, {

            query: {
                method: 'GET',
                url: SERVER.URL + '/node',
                isArray: true,
                transformRequest: function (data, headersGetter) {
                    headersGetter().Accept = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);
                    angular.forEach(json, function (node, index) {
                        mod.hal.fromServer(node);
                    });
                    return json;
                }
            },
            fetch: {
                method: 'GET',
                url: SERVER.URL + '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    headersGetter().Accept = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var node = angular.fromJson(data);
                    mod.hal.fromServer(node);
                    return node;
                }

            },

            patch: {
                method: 'PATCH',
                url: SERVER.URL + '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    console.log('transformRequest', data);
                    mod.hal.toServer(data);
                    headersGetter()['Content-Type'] = 'application/hal+json';
                    return angular.toJson(data);
                }
            },

            create: {
                method: 'POST',
                url: SERVER.URL + '/entity/node',
                transformRequest: function (data, headersGetter) {
                    mod.hal.toServer(data);
                    headersGetter()['Content-Type'] = 'application/hal+json';
                    headersGetter()['Accept'] = 'application/json';
                    var user = DrupalState.get('user');
                    console.log(user);
                    if (user.token) {
                        headersGetter()['X-CSRF-Token'] = user.token;
                    }
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    console.log('transformResponse', data);
                    if (data) {
                        return angular.fromJson(data);
                    }
                }
            }
        });
    }])

    .factory('NodeByTerm', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/taxonomy/term/:tid', {tid: '@tid'}, {});
    }])

    .factory('TaxonomyTerm', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/taxonomy/list/:tid', {tid: '@tid'}, {
            'fetch' : {
                method: 'GET',
                //transformRequest: function (data, headersGetter) {
                //    headersGetter().Accept = 'application/hal+json';
                //    headersGetter()['Content-Type'] = 'application/hal+json';
                //}
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);
                    var hash = {};
                    angular.forEach(json, function(item){
                        hash[item.tid] = item;
                    });
                    return hash;
                }
            }
        });
    }])

    .factory('User', ['SERVER', '$resource', 'DrupalState', function (SERVER, $resource, DrupalState) {
        return $resource(SERVER.URL + '/user/:uid', {uid: '@uid'}, {
            // User login: https://www.drupal.org/node/2403307
            login: {
                method: 'POST',
                url: '/user_login',
                transformRequest: function (data, headersGetter) {
                    headersGetter()['Content-Type'] = 'application/json';
                    headersGetter()['Accept'] = 'application/json';
                    var user = DrupalState.get('user');
                    data = {
                        op: 'login',
                        credentials: {
                            name: user.username,
                            pass: user.password
                        }
                    };
                    console.log(user, data);
                    if (user.token) {
                        headersGetter()['X-CSRF-Token'] = user.token;
                    }
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    // return raw token data
                    console.log(data);
                    return {response: data};
                }
            },
            logout: {
                method: 'POST',
                url: '/user_login',
                transformRequest: function (data, headersGetter) {
                    headersGetter()['Content-Type'] = 'application/json';
                    headersGetter()['Accept'] = 'application/json';
                    var user = DrupalState.get('user');
                    data = {
                        op: 'logout'
                    };
                    console.log(user, data);
                    if (user.token) {
                        headersGetter()['X-CSRF-Token'] = user.token;
                    }
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    // return raw token data
                    console.log(data);
                    return {response: data};
                }

            }
        });
    }])

    .factory('Comment', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/node/:nid/comments', {nid: '@nid'}, {
            'post': {
                method: 'POST',
                url: '/entity/comment',
                transformRequest: function (data, headersGetter) {
                    headersGetter().Accept = 'application/hal+json';
                    headersGetter()['Content-Type'] = 'application/hal+json';
                }
            }
        });
    }])

    .factory('Token', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/rest/session/token', {}, {
            fetch: {
                method: 'GET',
                transformResponse: function (data, headersGetter) {
                    // return raw token data
                    return {token: data};
                }
            }
        })
    }])

    .factory('DrupalState', function (CacheService) {
        var cache = {
            get: function (key) {
                var item = CacheService.get(key);

                if (item) {
                    return item;
                }

                return null;
            },
            set: function (key, value) {
                CacheService.put(key, value);
            },
            clear: function (key) {
                CacheService.put(key, '');
            }
        };
        cache.set('user', {username: null, password: null, authenticated: false});
        cache.set('X-CSRF-Token', null);

        return cache;
    })
;
