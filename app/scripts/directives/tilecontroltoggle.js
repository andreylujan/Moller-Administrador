'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:tileControlToggle
 * @description
 * # tileControlToggle
 */
angular.module('efindingAdminApp')
  .directive('tileControlToggle', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');

        element.on('click', function(){
          tile.toggleClass('collapsed');
          tile.children().not('.tile-header').slideToggle(150);
        });
      }
    };
  });
