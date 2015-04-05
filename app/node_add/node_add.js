'use strict';

angular.module('myApp.node_add', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/add', {
            templateUrl: 'node_add/node_add.html',
            controller: 'NodeAddCtrl'
        });
    }])

    .controller('NodeAddCtrl', function ($scope, $routeParams, $location, MESSAGES, Node, User, TaxonomyTerm, Comment, DrupalState) {
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
            _links: {
                type: {
                    href: DrupalState.getType('node', 'article')
                }
            }
        };

        $scope.postNode = function () {
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