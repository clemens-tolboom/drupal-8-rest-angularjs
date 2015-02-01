'use strict';

angular.module('myApp.node_add', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/add', {
            templateUrl: 'node_add/node_add.html',
            controller: 'NodeAddCtrl'
        });
    }])

    .controller('NodeAddCtrl', function ($scope, $routeParams, Node, User, TaxonomyTerm, Comment) {
        $scope.breadcrumb = [
            {
                path: '',
                title: 'Home'
            }, {
                path: '#node',
                title: 'Node'
            }, {
                path: '#node/add',
                title: 'Add'
            }
        ];

        $scope.node = {
            title: "Title field",
            body: {
                summary: "Body Summary",
                value: "Body full"
            }
        };

        $scope.postNode = function () {
            var node = {
                "title": [
                    "Title: iyBci1TVidlk X7iei0p"
                ],
                "body": {
                    "value": "Body: 1xGwZX RXxfd3QqlSge8tzsttALHTM4UgKodFo1AWgNZ4ahWrv1V2ulw24bVQfN4"
                },
                "_links": {
                    "http:\/\/drupal.d8\/rest\/relation\/node\/article\/uid": [
                        {
                            "href": "http:\/\/drupal.d8\/user\/0"
                        }
                    ],
                    "type": {
                        "href": "http:\/\/drupal.d8\/rest\/type\/node\/article"
                    }
                }
            };
            Node.create({}, node);
//            Node.create({}, $scope.node);
        }
    });