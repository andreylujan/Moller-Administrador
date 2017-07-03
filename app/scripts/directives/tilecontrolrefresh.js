'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:tileControlRefresh
 * @description
 * # tileControlRefresh
 */
angular.module('efindingAdminApp')
  .directive('tileControlRefresh', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');
        var dropdown = element.parents('.dropdown');

        element.on('click', function(){
          tile.addClass('refreshing');
          dropdown.trigger('click');
        });
      }
    };
  });
