'use strict';

// Declare app level module which depends on views, and components
angular
    .module('myApp', [
        'ngRoute',
        'drupalService',
        'myApp.node_add',
        'myApp.node_nid',
        'myApp.node',
        'myApp.taxonomy_term',
        'myApp.node_lifecycle'
    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/node'});
    }])
    // http://stackoverflow.com/questions/17893708/angularjs-textarea-bind-to-json-object-shows-object-object
    .directive('jsonText', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                function into(input) {
                    return JSON.parse(input);
                }

                function out(data) {
                    return JSON.stringify(data, null, 2);
                }

                ngModel.$parsers.push(into);
                ngModel.$formatters.push(out);
                scope.$watch(attr.ngModel, function (newValue) {
                    element[0].value = out(newValue);
                }, true);
            }
        };
    });
