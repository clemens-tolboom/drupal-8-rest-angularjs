angular.module('drupalService', ['ngResource'])

    .factory('Node', ['$resource', function ($resource) {
        return $resource('/node/:nid', {nid: '@nid'}, {

            query: {
                method: 'GET',
                url: '/node',
                isArray: true,
                transformRequest: function (data, headersGetter) {
                    headersGetter()['Accept'] = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var json = angular.fromJson(data);
                    for(var i=0 ; i< json.length; i++) {
                        var node = json[i];
                        var nid = node._links.self.href.split(/\//).pop();
                        node.nid = [{value: nid, _drupal : 'https://www.drupal.org/node/2304849' }];
                    }
                    // Inject the nid
                    return json;
                }
            },
            fetch: {
                method: 'GET',
                url: '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    headersGetter()['Accept'] = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    var node = angular.fromJson(data);
                    // Inject the nid
                    var nid = node._links.self.href.split(/\//).pop();
                    node.nid = [{value: nid, _drupal : 'https://www.drupal.org/node/2304849' }];
                    return node;
                }

            },

            patch: {
                method: 'PATCH',
                url: '/node/:nid',
                transformRequest: function (data, headersGetter) {
                    console.log("transformRequest", data);
                    headersGetter()['Content-Type'] = 'application/hal+json';
                    return angular.toJson(data);
                }
            },

            create: {
                method: 'POST',
                url: '/entity/node',
                transformRequest: function (data, headersGetter) {
                    headersGetter()['Content-Type'] = 'application/hal+json';
                    return angular.toJson(data);
                },
                transformResponse: function (data, headersGetter) {
                    console.log("transformResponse", data);
                }
            }
        });
    }])

    .factory('NodeByTerm', ['$resource', function ($resource) {
        return $resource('/taxonomy/term/:tid', {tid: '@tid'}, {});
    }])

    .factory('TaxonomyTerm', ['$resource', function ($resource) {
        return $resource('/taxonomy/list/:tid', {tid: '@tid'}, {});
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
                    headersGetter()['Accept'] = 'application/hal+json';
                    headersGetter()['Content-Type'] = 'application/hal+json';
                }
            }
        });
    }]);
