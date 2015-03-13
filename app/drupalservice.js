'use strict';

// TODO: refactor this out of global scope as it breaks when minifying
var mod = angular.module('drupalService', ['ngResource']);

mod.drupal = {
    hal: {
        fromServer: function (hal) {
            var internals = hal._internals = {};

            if (angular.isObject(hal._links)) {
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
            }
        },
        toServer: function (hal) {
            delete hal._internals;
        }
    },
    mode: 'hal+json',
    setMode: function (mode) {
        if (mod.drupal.mode !== mode) {
            if (mode === 'json' || mode === 'hal+json') {
                mod.drupal.mode = mode;
            }
        }
    },
    addToken: function (DrupalState, headersGetter) {
        var user = DrupalState.get('user');
        if (user.token) {
            headersGetter()['X-CSRF-Token'] = user.token;
        }
        else {
            console.log('No token found yet.');
        }
    },
    addBasicAuth: function (DrupalState, headersGetter) {
        var user = DrupalState.get('user');
        if (user.authenticated && user.username && user.password) {
            headersGetter()['PHP_AUTH_USER'] = user.username;
            headersGetter()['PHP_AUTH_PW'] = user.password;
        }
        else {
            console.log('Unable to use BASIC_AUTH');
        }
    },
    setHeaders: function (method, DrupalState, headersGetter) {
        var addContentType = false;
        if (method === 'POST' || method === 'PATCH') {
            addContentType = true;
        }
        if (mod.drupal.mode === 'hal+json') {
            headersGetter().Accept = 'application/hal+json';
            if (addContentType === true) {
                headersGetter()['Content-Type'] = 'application/hal+json';
            }
        } else if (mod.drupal.mode === 'json') {
            headersGetter().Accept = 'application/json';
            if (addContentType === true) {
                headersGetter()['Content-Type'] = 'application/json';
            }
        }

        if (DrupalState.get('user').authMethod === 'COOKIE') {
            mod.drupal.addToken(DrupalState, headersGetter);
        }
        else if (DrupalState.get('user').authMethod === 'BASIC_AUTH') {
            mod.drupal.addBasicAuth(DrupalState, headersGetter);
        }
    },
    collection : function(json) {
        if (mod.drupal.mode ==='hal+json') {
            angular.forEach(json, function (node, index) {
                mod.drupal.hal.fromServer(node);
            });
        }
    }
};

mod
    .factory('Node', ['$resource', 'DrupalState', function ($resource, DrupalState) {
        return $resource('/node/:nid', {nid: '@nid'}, {

            query: {
                method: 'GET',
                url: DrupalState.getURL() + '/node',
                isArray: true,
                transformRequest: function (data, headersGetter) {
                    mod.drupal.setHeaders('GET', DrupalState, headersGetter);

                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var json;
                    if (angular.isString(data)) {
                        if (data.indexOf('<') === 0) {
                            // we received HTML
                            // TODO: raise an exception somehow
                        }
                        else {
                            // TODO: refactor this into mod.drupal section
                            // TODO: this is not a HAL collection yet: https://www.drupal.org/node/2100637
                            json = angular.fromJson(data);
                            mod.drupal.collection(json);
                        }
                    }
                    return json;
                }
            },
            fetch: {
                method: 'GET',
                url: DrupalState.getURL() + '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    mod.drupal.setHeaders('GET', DrupalState, headersGetter);

                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var node = angular.fromJson(data);
                    mod.drupal.hal.fromServer(node);
                    return node;
                }

            },

            patch: {
                method: 'PATCH',
                url: DrupalState.getURL() + '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    mod.drupal.hal.toServer(data);

                    mod.drupal.setHeaders('PATCH', DrupalState, headersGetter);

                    return angular.toJson(data);
                }
            },

            remove: {
                method: 'DELETE',
                url: DrupalState.getURL() + '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    mod.drupal.setHeaders('DELETE', DrupalState, headersGetter);

                    return angular.toJson(data);
                }
            },

            create: {
                method: 'POST',
                url: DrupalState.getURL() + '/entity/node',
                transformRequest: function (data, headersGetter) {
                    mod.drupal.hal.toServer(data);

                    mod.drupal.setHeaders('POST', DrupalState, headersGetter);

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

    .factory('NodeByTerm', ['$resource', 'DrupalState', function ($resource, DrupalState) {
        return $resource(DrupalState.getURL() + '/taxonomy/term/:tid', {tid: '@tid'}, {});
    }])

    .factory('TaxonomyTerm', ['$resource', 'DrupalState', function ($resource, DrupalState) {
        return $resource(DrupalState.getURL() + '/taxonomy/list/:tid', {tid: '@tid'}, {
            'fetch': {
                method: 'GET',
                transformRequest: function (data, headersGetter) {
                    // TODO: respect mod.drupal.mode
                    // TODO: we currently send default headers (application/json)
                //    headersGetter().Accept = 'application/hal+json';
                //    headersGetter()['Content-Type'] = 'application/hal+json';
                },
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);
                    var hash = {};
                    angular.forEach(json, function (item) {
                        hash[item.tid] = item;
                    });
                    return hash;
                }
            }
        });
    }])

    .factory('User', ['$resource', 'DrupalState', function ($resource, DrupalState) {
        return $resource(DrupalState.getURL() + '/user/:uid', {uid: '@uid'}, {
            fetch: {
                method: 'GET',
                url: DrupalState.getURL() + '/user/:uid',
                transformRequest: function (data, headersGetter) {
                    mod.drupal.setHeaders('GET', DrupalState, headersGetter);

                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var node = angular.fromJson(data);
                    mod.drupal.hal.fromServer(node);
                    return node;
                }

            },
            // User login: https://www.drupal.org/node/2403307
            login: {
                method: 'POST',
                url: DrupalState.getURL() + '/user_login',
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
                url: DrupalState.getURL() + '/user_login',
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

    .factory('Comment', ['$resource', 'DrupalState', function ($resource, DrupalState) {
        return $resource(DrupalState.getURL() + '/node/:nid/comments', {nid: '@nid'}, {
            query: {
                method: 'GET',
                url: DrupalState.getURL() + '/node/:nid/comments',
                isArray: true,
                transformRequest: function (data, headersGetter) {
                    mod.drupal.setHeaders('GET', DrupalState, headersGetter);

                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);
                    // TODO: this is not a HAL collection yet: https://www.drupal.org/node/2100637
                    angular.forEach(json, function (node, index) {
                        mod.drupal.hal.fromServer(node);
                    });
                    return json;
                }
            },

            'post': {
                method: 'POST',
                url: DrupalState.getURL() + '/entity/comment',
                transformRequest: function (data, headersGetter) {
                    mod.drupal.hal.toServer(data);

                    mod.drupal.setHeaders('POST', DrupalState, headersGetter);

                    return angular.toJson(data);
                }
            }
        });
    }])

    .factory('Token', ['$resource', 'DrupalState', function ($resource, DrupalState) {
        return $resource(DrupalState.getURL() + '/rest/session/token', {}, {
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
        var state = {
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
            },
            login: function () {

            },
            logout: function () {

            },
            getURL: function () {
                var config = state.get('SERVER');
                var url = config.scheme + '://' + config.host;
                if (config.user !== '') {
                    url += config.user + ':' + config.pass;
                }
                if (config.port !== '80') {
                    url += ':' + config.port;
                }
                if (config.path !== '') {
                    url += ':' + config.path;
                }
                return url;
            },
            getType: function (type, bundle) {
                // rest/type/node/article
                return state.getURL() + '/rest/type/' + type + '/' + bundle;

            },
            getRelation: function (type, bundle) {
                // rest/type/node/article
                return state.getURL() + '/rest/relation/' + type + '/' + bundle + '/entity_id';

            }
        };
        var user = {username: null, password: null, authenticated: false, authMethod: 'COOKIE'};
        state.set('user', user);

        // TODO: is using document.config evil?
        // http://stackoverflow.com/questions/22825706/angularjs-load-config-on-app-start
        var config = document.config;

        // Required
        state.set('SERVER', config.SERVER);

        if (angular.isDefined(config.USER)) {
            //console.log("Setting config.USER");
            if (angular.isDefined(config.USER.username)) {
                user.username = config.USER.username;
            }
            if (angular.isDefined(config.USER.password)) {
                user.password = config.USER.password;
            }
            if (angular.isDefined(config.USER.authMethod)) {
                user.authMethod = config.USER.authMethod;
            }
        }


        state.set('X-CSRF-Token', null);

        return state;
    })
;
