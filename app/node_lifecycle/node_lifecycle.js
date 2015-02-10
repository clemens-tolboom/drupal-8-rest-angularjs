'use strict';

angular.module('myApp.node_lifecycle', ['ngRoute', 'drupalService'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/node-lifecycle', {
            templateUrl: 'node_lifecycle/node_lifecycle.html',
            controller: 'NodeLifeCycleCtrl'
        });
    }])

    .controller('NodeLifeCycleCtrl', function ($scope, $routeParams, Node, User, TaxonomyTerm, Comment) {
        // TODO: DRY alert
        var anonymousUser = {
            name: [
                {
                    value: "Anonymous"
                }
            ]
        };

        $scope.breadcrumb = [
            {
                path: '',
                title: 'Home'
            }, {
                path: '#node-lifecycle',
                title: 'Node life cycle'
            }
        ];


        $scope.node = {};

        $scope.nodes = Node.query({}, function (nodes) {
            for (var i = 0; i < $scope.nodes.length; i++) {
                console.log($scope.nodes[i]);
                if ($scope.nodes[i]._internals.uid[0].target_id == 0) {
                    $scope.nodes[i].user = anonymousUser;
                } else {
                    $scope.nodes[i].user = User.get({uid: $scope.nodes[i]._internals.uid[0].target_id})
                }
            }
        });

        $scope.fetchNode = function () {
            $scope.node = Node.fetch({nid: $scope.node._internals.nid[0].value});
        };

        $scope.updateNode = function () {
            Node.patch({nid: $scope.node._internals.nid[0].value}, $scope.node);
        };

        $scope.deleteNode = function () {
            Node.delete({nid: $scope.nid});
            $scope.node = {};
        };

        $scope.postNode = function () {
            var node = $scope.node;
            console.log(node);
            // As we are CREATING a node make sure we do not have:
            // - nid
            // - uuid
            // - ?
            delete node.nid;
            delete node.uuid;

            // If post fails see https://www.drupal.org/node/2417915
            // Workaround: set permission for path alias for intended role
//            Node.create({}, node);
            $scope.node = Node.create({}, $scope.node);
        }
    });
