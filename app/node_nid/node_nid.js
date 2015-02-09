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

        $scope.tags = {};
        // Fetch node entity for current nid
        $scope.node = Node.fetch({nid: $routeParams.nid}, function (node) {
            $scope.breadcrumb = [
                {
                    path: '#node',
                    title: 'Home'
                }, {
                    path: '#node/' + $routeParams.nid,
                    title: $scope.node.title[0].value
                }
            ];
            // If the node isn't anonymous then fetch the user entity
            if ($scope.node._internals.uid[0].target_id == 0) {
                $scope.node.user = anonymousUser;
            } else {
                $scope.node.user = User.get({uid: $scope.node._internals.uid[0].target_id})
            }

            if ($scope.node._internals.field_tags) {
                // Fetch the entity for every tag in this node.
                $scope.node._internals.field_tags.forEach(function (element, index, array) {
                    if ($scope.tags[element.target_id] == undefined) {
                        $scope.tags[element.target_id] = TaxonomyTerm.query({tid: element.target_id});
                    }
                });
            }
        }, function(response) {
            $scope.messages.push("Error");
            console.log("ERROR?", response);
        });


        // Fetch the comments for this node (Using a special view in Drupal)
        $scope.comments = Comment.query({
            nid: $routeParams.nid
        });

        $scope.newComment = {
            "subject": [
                {
                    "value": "Comment subject for Article 1"
                }
            ],
            "_links": {
                "type": {
                    "href": "http://drupal.d8/rest/type/comment/comment"
                },
                "http://drupal.d8/rest/relation/comment/comment/entity_id": [
                    {
                        "href": "http://drupal.d8/node/" + $routeParams.nid
                    }
                ]
            },
            "comment_body" : [
                {
                    "value" : "<p>Comment body for Article 1</p>\r\n"
                }
            ]
        };

        $scope.postComment = function () {
            // Post new comment to this node. $scope.newComment contains the http payload
            Comment.post({}, $scope.newComment, function (response) {
                // Comment posted, refresh the comment list
                $scope.comments = Comment.query({nid: $routeParams.nid});
            });
        };

    });
