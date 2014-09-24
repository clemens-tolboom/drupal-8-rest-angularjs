angular.module('drupalService', ['ngResource'])

    .factory('Node', ['$resource', function ($resource) {
        return $resource('/node/:nid', {nid: '@nid'}, {
            query: {
                method: 'GET',
                url: '/node',
                isArray: true
            }
        });
    }])

    .factory('TaxonomyTerm', ['$resource', function ($resource) {
        return $resource('/taxonomy/term/:tid', {tid: '@tid'}, {});
    }])

    .factory('User', ['$resource', function ($resource) {
        return $resource('/user/:uid', {uid: '@uid'}, {});
    }])