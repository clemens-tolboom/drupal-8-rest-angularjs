'use strict';

angular.module('drupalService', ['ngResource'])

    .factory('Node', ['$resource', function ($resource) {
        return $resource('/node/:nid', {nid: '@nid'}, {

            query: {
                method: 'GET',
                url: '/node',
                isArray: true,
                transformRequest: function (data, headersGetter) {
                    headersGetter().Accept = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);
                    angular.forEach(json, function (node, index) {
                        // TODO: DRY aka move 'internals' into function/factory
                        var internals = node._internals = {};

                        // Inject the nid (last element from href
                        var nid = node._links.self.href.split(/\//).pop();
                        internals.nid = [{value: nid, _drupal: 'https://www.drupal.org/node/2304849'}];

                        // Transform _links into node fields
                        angular.forEach(node._links, function (value, key) {
                            if (key === 'self') {
                              return;
                            }
                            if (key === 'type') {
                              return;
                            }
                            var id = key.split(/\//).pop();
                            internals[id] = [];
                            angular.forEach(value, function (val, index) {
                                internals[id].push({ target_id: val.href.split(/\//).pop()});
                            });
                        });
                    });
                    return json;
                }
            },
            fetch: {
                method: 'GET',
                url: '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    headersGetter().Accept = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var node = angular.fromJson(data);
                    // TODO: DRY aka move 'internals' into function/factory
                    var internals = node._internals = {};

                    // Inject the nid (last element from href
                    var nid = node._links.self.href.split(/\//).pop();
                    internals.nid = [{value: nid, _drupal: 'https://www.drupal.org/node/2304849'}];

                    // Transform _links into node fields
                    angular.forEach(node._links, function (value, key) {
                        if (key === 'self') {
                          return;
                        }
                        if (key === 'type') {
                          return;
                        }
                        var id = key.split(/\//).pop();
                        internals[id] = [];
                        angular.forEach(value, function (val, index) {
                            internals[id].push({ target_id: val.href.split(/\//).pop()});
                        });
                    });
                    return node;
                }

            },

            patch: {
                method: 'PATCH',
                url: '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    console.log('transformRequest', data);
                    delete data._internals;
                    headersGetter()['Content-Type'] = 'application/hal+json';
                    return angular.toJson(data);
                }
            },

            create: {
                method: 'POST',
                url: '/entity/node',
                transformRequest: function (data, headersGetter) {
                    delete data._internals;
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

    .factory('NodeByTerm', ['$resource', function ($resource) {
        return $resource('/taxonomy/term/:tid', {tid: '@tid'}, {});
    }])

    .factory('TaxonomyTerm', ['$resource', function ($resource) {
        return $resource('/taxonomy/list', {}, {});
    }])

    .factory('User', ['$resource', function ($resource) {
        return $resource('/user/:uid', {uid: '@uid'}, {});
    }])

    .factory('Comment', ['$resource', function ($resource) {
        return $resource('/node/:nid/comments', {nid: '@nid'}, {
            'post': {
                method: 'POST',
                url: '/entity/comment',
                transformRequest: function (data, headersGetter) {
                    headersGetter().Accept = 'application/json';
                    headersGetter()['Content-Type'] = 'application/hal+json';
                    return angular.toJson(data);
                }
            }
        });
    }]);
