'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:offcanvasSidebar
 * @description
 * # offcanvasSidebar
 */
angular.module('efindingAdminApp')
  .directive('offcanvasSidebar', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {

        var app = angular.element('#repoImagenes'),
            $window = angular.element(window),
            width = $window.width();

        element.on('click', function(e) {
          if (app.hasClass('offcanvas-opened')) {
            app.removeClass('offcanvas-opened');
          } else {
            app.addClass('offcanvas-opened');
          }
          e.preventDefault();
        });

      }
    };
  });
