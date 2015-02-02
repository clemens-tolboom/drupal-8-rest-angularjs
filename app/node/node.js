'use strict';

angular.module('myApp.node', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node', {
            templateUrl: 'node/node.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, $http, Node, User, TaxonomyTerm) {
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        };

        // Bind tags globally to be usable to print next to each node.
        $scope.tags = {};
        $scope.breadcrumb = [
            {
                path: '#node',
                title: 'Node'
            }
        ];

        $scope.deleteNode = function (nid) {
            Node.delete({nid: nid[0].value}, $scope.newComment, function (response) {
                // Comment posted, refresh the comment list
                $scope.nodes = Node.query({});
            });
        };

        $scope.nodes = Node.query({}, function (nodes) {
            for (var i = 0; i < $scope.nodes.length; i++) {
                console.log($scope.nodes[i]);
                if ($scope.nodes[i]._internals.uid[0].target_id == 0) {
                    $scope.nodes[i].user = anonymousUser;
                } else {
                    $scope.nodes[i].user = User.get({uid: $scope.nodes[i]._internals.uid[0].target_id})
                }

                $scope.nodes[i].field_tags.forEach(function (element, index, array) {
                    if ($scope.tags[element.target_id] == undefined) {
                        $scope.tags[element.target_id] = TaxonomyTerm.get({tid: element.target_id});
                    }
                });
            }
        });
    });
