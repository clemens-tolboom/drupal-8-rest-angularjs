'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'drupalService',
    'myApp.node_add',
    'myApp.node_nid',
    'myApp.node',
    'myApp.taxonomy_term'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/node'});
}]);
