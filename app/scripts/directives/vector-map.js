'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:vectorMap
 * @description
 * # vectorMap
 */
angular.module('efindingAdminApp')
  .directive('vectorMap', function () {
    return {
      restrict: 'AE',
      scope: {
        options: '='
      },
      link: function postLink(scope, element) {
        var options = scope.options;
        element.vectorMap(options);
      }
    };
  });
