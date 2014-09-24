'use strict';

angular.module('myApp.node', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node', {
            templateUrl: 'node/node.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, $http, Node, User) {
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        }
        $scope.nodes = Node.query({}, function (nodes) {
            for (var i = 0; i < $scope.nodes.length; i++) {
                if($scope.nodes[i].uid[0].target_id == 0){
                    $scope.nodes[i].user = anonymousUser;
                }else {
                    $scope.nodes[i].user = User.get({uid: $scope.nodes[i].uid[0].target_id})
                }
            }
        });
    });