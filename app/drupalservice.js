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
    .factory('Node', ['SERVER', '$resource', function (SERVER, $resource) {
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
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    console.log('transformResponse', data);
                }
            }
        });
    }])

    .factory('NodeByTerm', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/taxonomy/term/:tid', {tid: '@tid'}, {});
    }])

    .factory('TaxonomyTerm', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/taxonomy/list/:tid', {tid: '@tid'}, {});
    }])

    .factory('User', ['SERVER', '$resource', function (SERVER, $resource) {
        return $resource(SERVER.URL + '/user/:uid', {uid: '@uid'}, {});
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

    .factory('DrupalState', function (CacheService) {
        var cache =       {
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
