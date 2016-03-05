'use strict';

angular.module('myApp.node', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node', {
            templateUrl: 'node/node.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, ISSUES, MESSAGES, Node, User, TaxonomyTerm, DrupalState, Token, REST) {
        // TODO: DRY this code is used in node_nid.js too.
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        };

        // How to connect to Drupal
        $scope.auth = DrupalState.get('user').authMethod;

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

        // TODO: DRY this code is used in node_nid.js too.
        // Bind tags globally to be usable to print next to each node.
        $scope.tags = TaxonomyTerm.fetch({}, function (data) {
            // nope
        }, function () {
            $scope.messages.push(MESSAGES.termList);

        });

        $scope.breadcrumb = [
            {
                path: '#node',
                title: 'Home'
            }
        ];

        $scope.messages = [];

        // TODO: no need to push this message when using session based cookie + token
        //$scope.messages.push(MESSAGES.loginMethod);

        $scope.user = DrupalState.get('user');
        if (!$scope.user.token) {
            Token.fetch({}, function (item) {
                $scope.user.token = item.token;
            }, function () {
                $scope.messages.push(MESSAGES.tokenFail);
            });
        }

        $scope.userLogin = function () {
            if ($scope.user.username && $scope.user.password) {
                if ($scope.user.authMethod === 'BASIC_AUTH') {
                    $scope.messages.push(MESSAGES.loginBasicAuth);
                    $scope.user.authenticated = true;
                }
                else if ($scope.user.authMethod === 'COOKIE') {
                    User.login({}, function (result) {
                        $scope.messages.push({text: result.response, type: 'success'});
                        $scope.user.authenticated = true;
                    }, function (result) {
                        $scope.messages.push(MESSAGES.loginFail);
                    });
                }
            }
        };

        $scope.userLogout = function () {
            if ($scope.user.authenticated) {
                $scope.user.password = '';
                if ($scope.user.authMethod === 'BASIC_AUTH') {
                    $scope.user.authenticated = false;
                }
                else if ($scope.user.authMethod === 'COOKIE') {
                    User.logout({}, function (result) {
                        $scope.messages.push({text: result.response, type: 'success'});
                        $scope.user.authenticated = false;
                    }, function (result) {
                        $scope.messages.push(MESSAGES.logoutFail);
                    });
                }
            }
        };

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
                var uid = REST.getID('uid', $scope.nodes[i]);
                var nid = REST.getID('nid', $scope.nodes[i]);

                if (uid[0].target_id == 0) {
                    $scope.nodes[i].user = anonymousUser;
                } else {
                    $scope.nodes[i].user = User.fetch({uid: uid[0].target_id})
                }
                $scope.nodes[i].nid = nid;

            }
        }, function (result) {
            var message = {
                text: MESSAGES.listNodeFail.text + ' (' + result.status + ': ' + result.statusText + ')',
                type: MESSAGES.deleteNodeFail.type
            };
            $scope.messages.push(message);
        });
    });
