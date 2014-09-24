'use strict';

angular.module('myApp.node', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node', {
            templateUrl: 'node/node.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, $http) {
        $scope.nodes = {};
        $scope.taxonomy = {};

        $http.get('/node').success(function (data) {
            $scope.nodes = data;
        });

    });