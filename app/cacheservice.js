angular.module('CacheService', ['ng'])
    .factory('CacheService', function($cacheFactory) {
          return $cacheFactory('CacheService');
    });
