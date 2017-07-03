'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')
  .controller('MainCtrl', function($scope) {

    $scope.main = {
      title: 'eFinding',
      settings: {
        navbarHeaderColor: 'scheme-default',
        sidebarColor: 'scheme-default',
        brandingColor: 'scheme-default',
        activeColor: 'default-scheme-color'
      }
    };

  });