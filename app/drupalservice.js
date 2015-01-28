angular.module('drupalService', ['ngResource'])

    .factory('Node', ['$resource', function ($resource) {
        return $resource('/node/:nid', {nid: '@nid'}, {
            query: {
                method: 'GET',
                url: '/node',
                isArray: true
            },
            post: {
                method: 'POST',
                url: '/entity/node'
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
                url: '/entity/comment'
            }
        });
    }])
