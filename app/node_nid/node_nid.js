'use strict';

angular.module('myApp.node_nid', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/:nid', {
            templateUrl: 'node_nid/node_nid.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, $http, $routeParams) {
        $scope.nid = $routeParams.nid;
        $scope.node = {};
        $scope.taxonomy = {};

        $http.get('/node/' + $scope.nid).success(function (data) {
            $scope.node = data;
        });

        $scope.$watch('node.field_tags', function (newValue, oldValue) {
            if ($scope.node.field_tags != undefined) {


                $scope.node.field_tags.forEach(function (element, index, array) {
                    if ($scope.taxonomy[element.target_id] == undefined) {
                        $http.get('/taxonomy_term/' + element.target_id).success(function (data) {
                            $scope.taxonomy[element.target_id] = data;
                        });
                    }
                });
            }
        }, true);
    });