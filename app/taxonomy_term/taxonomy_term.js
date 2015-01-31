'use strict';

angular.module('myApp.taxonomy_term', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/taxonomy/term/:tid', {
            templateUrl: 'taxonomy_term/taxonomy_term.html',
            controller: 'TermCtrl'
        });
    }])

    .controller('TermCtrl', function ($scope, $http, Node, User, TaxonomyTerm) {
        // Bind tags globally to be usable to print next to each node.
        $scope.tags = {};
        $scope.debug = 'TermCtrl';

    });
