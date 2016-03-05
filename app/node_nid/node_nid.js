'use strict';

angular.module('myApp.node_nid', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node/:nid', {
            templateUrl: 'node_nid/node_nid.html',
            controller: 'NodeNidCtrl'
        });
    }])

    .controller('NodeNidCtrl', function ($scope, $routeParams, $location, MESSAGES, Node, User, TaxonomyTerm, Comment, DrupalState, REST) {
        $scope.messages = [];
        // TODO: DRY this code is used in node.js too.
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        };

        $scope.nid = $routeParams.nid;

        // TODO: DRY this code is used in node.js too.
        $scope.tags = TaxonomyTerm.fetch({}, function (data) {
            // nope
        }, function () {
            $scope.messages.push(MESSAGES.termList);

        });

        // Fetch node entity for current nid
        $scope.node = Node.fetch({nid: $scope.nid}, function (node) {
            $scope.breadcrumb = [
                {
                    path: '#node',
                    title: 'Home'
                }, {
                    path: '#node/1',
                    title: $scope.node.title[0].value
                }
            ];
            var uid = REST.getID('uid', $scope.node);

            // If the node isn't anonymous then fetch the user entity
            if (uid[0].target_id == 0) {
                $scope.node.user = anonymousUser;
            } else {
                $scope.node.user = User.get({uid: uid[0].target_id})
            }
        }, function(result) {
            var message = {
                text: MESSAGES.readNodeFail.text + ' (' + result.status + ': ' + result.statusText + ')',
                type: MESSAGES.readNodeFail.type
            };
            $scope.messages.push(message);

        });


        // Fetch the comments for this node (Using a special view in Drupal)
        $scope.comments = Comment.query({
            nid: $routeParams.nid
        }, function (response) {
            console.log($scope.comments[0]);
        }, function (result) {
            var message = {
                text: MESSAGES.readCommentFail.text + ' (' + result.status + ': ' + result.statusText + ')',
                type: MESSAGES.readCommentFail.type
            };
            $scope.messages.push(message);

        });

        $scope.deleteNode = function () {
            Node.remove({nid: $scope.nid}, function () {
                $location.path('/node');
            }, function (result) {
                var message = {
                    text: MESSAGES.deleteNodeFail.text + ' (' + result.status + ': ' + result.statusText + ')',
                    type: MESSAGES.deleteNodeFail.type
                };
                $scope.messages.push(message);
            });
            $scope.node = {};
        };

        $scope.newComment = {
            subject: [{
                value: "Title"
            }],
            comment_body: [{
                value: "Body"
            }],
            "entity_type": [{
                value: "node"
            }],
            comment_type: [{
                target_id: "comment"
            }],
            field_name: [{
               value: 'comment'
            }],
            _links: {
                type: {
                    href: DrupalState.getType('comment', 'comment')
                }

            }
        };
        $scope.newComment._links[DrupalState.getRelation('node', 'article')] = [{href: DrupalState.getURL() + '/node/' + $routeParams.nid}];

        $scope.postComment = function () {
            console.log($scope.newComment);
            // Post new comment to this node. $scope.newComment contains the http payload
            Comment.post({}, $scope.newComment, function (response) {
                console.log(response);
                // Comment posted, refresh the comment list
                $scope.comments = Comment.query({nid: $routeParams.nid});
                // TODO redirect
            }, function (result) {
                var message = {
                    text: MESSAGES.createCommentFail.text + ' (' + result.status + ': ' + result.statusText + ')',
                    type: MESSAGES.deleteNodeFail.type
                };
                $scope.messages.push(message);
            });
        };

    });
