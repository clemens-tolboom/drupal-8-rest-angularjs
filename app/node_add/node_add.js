'use strict';

angular.module('myApp.node_add', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/add', {
            templateUrl: 'node_add/node_add.html',
            controller: 'NodeAddCtrl'
        });
    }])

    .controller('NodeAddCtrl', function ($scope, $routeParams, Node, User, TaxonomyTerm, Comment) {
        $scope.node = {}
        $scope.postNode = function () {
            $scope.node.entity_type = 'node';
            Node.post({}, $scope.node);
        }
    });