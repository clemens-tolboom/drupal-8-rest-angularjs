angular.module('drupalService', ['ngResource'])

    .factory('Node', ['$resource', function ($resource) {
        return $resource('/node/:nid', {nid: '@nid'}, {
            query: {
                method: 'GET',
                url: '/node',
                isArray: true,
                transformRequest: function (data, headersGetter) {
                    // TODO: do we really want HAL?
                    // headersGetter()['Accept'] = 'application/hal+json';
                }
            },
            // We post to HAL
            create: {
                method: 'POST',
                url: '/entity/node',
                headers: {'Content-Type': 'application/hal+json'},
                transformRequest: function (data, headersGetter) {
                    console.log(data);
                    headersGetter()['Content-Type'] = 'application/hal+json';
                },
                transformResponse: function (data, headersGetter) {
                    console.log(data);
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
            },
        });
    }]);
