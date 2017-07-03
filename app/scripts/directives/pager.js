'use strict';

/**
 * @ngdoc directive
 * @name minovateApp.directive:pager
 * @description
 * # pager
 */
angular.module('efindingAdminApp')
  .directive('pager', function($log) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        'prev': '&',
        'next': '&',
        'changePage': '&',
        'current': '=',
        'total': '='
      },
      template: '<form class="form-horizontal">'+
                  '<div class="form-group m-0">'+
                    '<button class="btn btn-orange-ps col-md-3 col-sm-2 col-xs-2" ng-click="prev({page: currentPage})">«</button>'+
                    '<div class="col-md-3 col-sm-2 col-xs-3">'+
                      '<input type="number" class="form-control" ng-model="current" ng-blur="changePage({page: currentPage})" min="1" max="{{total}}" ng-minlength="1" />'+
                    '</div>'+
                    '<p class="col-md-1 col-xs-1 control-label" style="text-align:center;">de</p><p class="col-md-1 col-xs-1 control-label" style="text-align:center;">{{total}}</p>'+
                    '<button class="btn btn-orange-ps col-md-3 col-sm-2 col-xs-2" ng-click="next({page: currentPage})">»</button>'+
                  '</div>'+
                '</form>',
      link: function(scope, el, attrs) {

      }
    };
  });