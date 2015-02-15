'use strict';


// Declare app level module which depends on views, and components
angular
    .module('myApp', [
        'ngRoute',
        'CacheService',
        'drupalService',
        'myApp.node_add',
        'myApp.node_nid',
        'myApp.node',
        'myApp.taxonomy_term',
        'myApp.node_lifecycle'
    ])
    .constant({
        'SERVER': {
            // Use with default install beneath Drupal root/app
            'URL': ''
            // Use with CORS configured server
            //'URL': 'http://drupal.d8'
            // TODO: fix for inline nid?
            //'URL': 'https://www.drupal.org/api-d7/node/1.json'
        },
        'ISSUES': {
            site: {
                nameSloganLogo: {
                    title: 'We need site name, slogan and logo.',
                    description: "The site name and slogan probably won't differ from the web version. The logo is theme based and ReST is not. The logo is probably different but should it?"
                }
            },
            node: {},
            comment: {},
            block: {},
            menu: [
                {
                    title: 'No menus to GET',
                    description: "Menu's are Config Entities sort of.",
                    urls: [{
                        url: 'https://www.drupal.org/node/2100637',
                        title: 'Add special handling for collections in REST'
                    }]

                }
            ],
            views: {
                noPager: {
                    title: 'No pager',
                    description: 'The collection does not add pager yet. It should be available in hal+json',
                    urls: [{
                        url: 'https://www.drupal.org/node/2100637',
                        title: 'Add special handling for collections in REST'
                    }]
                }
            },
            taxonomy: {
                termNotDisplayed: {
                    title: 'taxonomy/term/% does not give term name',
                    description: 'The view on taxonomy/term/% gives list of nodes with given term. Not the term title. This needs a new view'
                },
                termList: {
                    title: 'Add view on taxonomy/list',
                    description: 'This view is a list of terms with their vocabulary added.'
                }
            },
            user: {
                login: {
                    title: 'User login',
                    description: 'Should we use basic auth on every call or use cookie and get token?'
                }
            }
        },
        MESSAGES: {
            termList: {text: "Unable to fetch list of terms. Have you added view taxonomy/list ?", type: "danger"},
            loginFail: {text: "Cannot login.", type: 'warning'},
            tokenFail: {text: "Unable to fetch token.", type: "warning"}
        }
    })

    .config(['$routeProvider', function ($routeProvider) {
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
    })
;
