'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:anchorScroll
 * @description
 * # anchorScroll
 */
angular.module('efindingAdminApp')
  .directive('anchorScroll', ['$location', '$anchorScroll', function($location, $anchorScroll) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        el.on('click', function(e) {
          $location.hash(attr.anchorScroll);
          $anchorScroll();
        });
      }
    };
  }]);
