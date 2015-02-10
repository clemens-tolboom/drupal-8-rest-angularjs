'use strict';

angular.module('myApp.node_nid', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/:nid', {
            templateUrl: 'node_nid/node_nid.html',
            controller: 'NodeNidCtrl'
        });
    }])

    .controller('NodeNidCtrl', function ($scope, $routeParams, Node, User, TaxonomyTerm, Comment) {
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        };

        $scope.tags = TaxonomyTerm.query();
        // Fetch node entity for current nid
        $scope.node = Node.fetch({nid: $routeParams.nid}, function (node) {
            $scope.breadcrumb = [
                {
                    path: '#node',
                    title: 'Home'
                }, {
                    path: '#node/1',
                    title: $scope.node.title[0].value
                }
            ];

            // If the node isn't anonymous then fetch the user entity
            if ($scope.node._internals.uid[0].target_id == 0) {
                $scope.node.user = anonymousUser;
            } else {
                $scope.node.user = User.get({uid: $scope.node._internals.uid[0].target_id})
            }
        });


        // Fetch the comments for this node (Using a special view in Drupal)
        $scope.comments = Comment.query({
            nid: $routeParams.nid
        });

        $scope.postComment = function () {
            // Post new comment to this node. $scope.newComment contains the http payload
            $scope.newComment.entity_type = 'node';
            $scope.newComment.field_name = 'comment';
            $scope.newComment.entity_id = [{"target_id": $routeParams.nid}];
            Comment.post({}, $scope.newComment, function (response) {
                // Comment posted, refresh the comment list
                $scope.comments = Comment.query({nid: $routeParams.nid});
            });
        };

    });
