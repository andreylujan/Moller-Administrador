'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')
.controller('HeaderCtrl', function($scope, $log, $state, $auth, Utils) {

	$scope.page = {
		user: {
			fullName: Utils.getInStorage('fullName'),
			image: Utils.getInStorage('image')
		}
	};

	$scope.logout = function() {
		$auth.logout()
			.then(function() {
				Utils.clearAllStorage();
			});
	};
});