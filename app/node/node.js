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
        $scope.tags = TaxonomyTerm.query();
        $scope.breadcrumb = [
            {
                path: '#node',
                title: 'Home'
            }
        ];

        /**
         * Get the term.name from $scope.tags
         *
         * This requires /taxonomy/list view installed.
         *
         * @param tag
         * @returns {boolean}
         */
        $scope.filterByTag = function (tag) {
            var found = false;
            angular.forEach($scope.tags, function (item, index) {
                if (tag.target_id == item.tid) {
                    found = true;
                }
            });
            return found;
        };

        $scope.nodes = Node.query({}, function (nodes) {
            for (var i = 0; i < $scope.nodes.length; i++) {
                if ($scope.nodes[i]._internals.uid[0].target_id == 0) {
                    $scope.nodes[i].user = anonymousUser;
                } else {
                    $scope.nodes[i].user = User.get({uid: $scope.nodes[i]._internals.uid[0].target_id})
                }
            }
        });
    });
