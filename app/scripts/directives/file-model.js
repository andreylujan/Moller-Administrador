'use strict';

/**
 * @ngdoc directive
 * @name efindingAdminApp.directive:activateButton
 * @description
 * # activateButton
 */
angular.module('efindingAdminApp')
  .directive('fileModel', ['$parse', '$log', function($parse, $log) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function() {
          scope.$apply(function() {
            if (attrs.multiple) {
              modelSetter(scope, element[0].files);
            } else {
              modelSetter(scope, element[0].files[0]);
            }
          });
        });

      }
    };
  }]);