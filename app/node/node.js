'use strict';

angular.module('myApp.node', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/:nid', {
            templateUrl: 'node/node.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, $http, $routeParams) {
        $scope.nid = $routeParams.nid;
        $scope.node = {}
        $http.get('/node/'+$scope.nid).success(function (data) {
            $scope.node = data;
        });
    });