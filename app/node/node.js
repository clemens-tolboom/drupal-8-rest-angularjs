'use strict';

angular.module('myApp.node', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node', {
            templateUrl: 'node/node.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, ISSUES, $http, Node, User, TaxonomyTerm, DrupalState, Token) {
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        };

        $scope.issues = {
            'title': 'Front page',
            'items': [
                ISSUES.site.nameSloganLogo,
                ISSUES.views.noPager,
                ISSUES.user.login,
                ISSUES.taxonomy.termList,
                ISSUES.taxonomy.termNotDisplayed
            ]
        };

        // Bind tags globally to be usable to print next to each node.
        $scope.tags = TaxonomyTerm.fetch();
        $scope.breadcrumb = [
            {
                path: '#node',
                title: 'Home'
            }
        ];

        $scope.user = DrupalState.get('user');
        if (!$scope.user.token) {
            Token.fetch({}, function (item) {
                $scope.user.token = item.token;
            });
        }

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
