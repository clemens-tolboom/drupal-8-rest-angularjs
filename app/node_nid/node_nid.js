'use strict';

angular.module('myApp.node_nid', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/:nid', {
            templateUrl: 'node_nid/node_nid.html',
            controller: 'NodeNidCtrl'
        });
    }])

    .controller('NodeNidCtrl', function ($scope, $routeParams, Node, User, TaxonomyTerm) {
        $scope.tags = {}
        $scope.node = Node.get({nid: $routeParams.nid}, function (node) {
            if ($scope.node.uid[0].target_id == 0) {
                $scope.node.user = anonymousUser;
            } else {
                $scope.node.user = User.get({uid: $scope.node.uid[0].target_id})
            }

            $scope.node.field_tags.forEach(function (element, index, array) {
                if ($scope.tags[element.target_id] == undefined) {
                    $scope.tags[element.target_id] = TaxonomyTerm.get({tid: element.target_id});
                }
            });
        });
    });