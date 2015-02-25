'use strict';

angular.module('myApp.node_add', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/add', {
            templateUrl: 'node_add/node_add.html',
            controller: 'NodeAddCtrl'
        });
    }])

    .controller('NodeAddCtrl', function ($scope, $routeParams, $location, MESSAGES, Node, User, TaxonomyTerm, Comment) {
        $scope.breadcrumb = [
            {
                path: '',
                title: 'Home'
            }, {
                path: '#node/add',
                title: 'Add content'
            }
        ];

        $scope.messages = [];

        $scope.node = {
            title: [
                {
                    value: "Title field"
                }
            ],
            body: [
                {
                    summary: "Summary",
                    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
            ],
            "_links": {
                "http:\/\/drupal.d8\/rest\/relation\/node\/article\/uid": [
                    {
                        "href": "http:\/\/drupal.d8\/user\/1"
                    }
                ],
                "type": {
                    "href": "http:\/\/drupal.d8\/rest\/type\/node\/article"
                }
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
            Node.create({}, $scope.node, function (result) {
                $location.path('/node');
            }, function (result) {
                console.log(arguments);
                console.log(result);
                if (result.data && result.data.error) {
                    result.statusText += ": " + result.data.error;
                }
                var message = {
                    text: MESSAGES.createNodeFail.text + " (" + result.status + ": " + result.statusText + ")",
                    type: MESSAGES.createNodeFail.type
                };
                $scope.messages.push(message);
            });
        }
    });