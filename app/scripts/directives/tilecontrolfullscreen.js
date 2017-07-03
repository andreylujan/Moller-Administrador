'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:tileControlFullscreen
 * @description
 * # tileControlFullscreen
 */
angular.module('efindingAdminApp')
  .directive('tileControlFullscreen', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var dropdown = element.parents('.dropdown');

        element.on('click', function(){
          dropdown.trigger('click');
        });

      }
    };
  });
