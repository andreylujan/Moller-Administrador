'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:PagesForgotPasswordCtrl
 * @description
 * # PagesForgotPasswordCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')
.controller('ChangePasswordCtrl', function($scope, $log, $state, Utils, Users, ChangePassword) {

	$scope.page = {
		title: 'Cambiar contraseña',
		msg: {
			color: '',
			text: '',
			show: false
		},
		sendBtn: {
			disabled: false
		}
	};

	$scope.user = {
		pass: {
			passOld: '',
			pass1:'',
			pass2:'',
			disabled: true
		},
		id: Utils.getInStorage('idUser')
	};

	$scope.changePassword = function() {

		if ($scope.user.pass.pass1 != $scope.user.pass.pass2) 
		{
			$scope.page.msg.color = 'danger';
			$scope.page.msg.text = 'Las contraseñas nuevas deben ser identicas.';
			$scope.page.msg.show = true;
			return;
		}

		ChangePassword.save({
			password: $scope.user.pass.pass1,
			password_confirmation: $scope.user.pass.pass2,
			old_password: $scope.user.pass.passOld,
			idUser: $scope.user.id
		}, function(success) {
			if (success.errors) {
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = success.errors[0].detail;
				$scope.page.msg.show = true;
			} else {
				$scope.page.msg.color = 'orange';
				$scope.page.msg.text = 'Tu contraseña ha sido modificada con exito.';
				$scope.page.msg.show = true;
				$scope.page.sendBtn.disabled = false;
			}

		}, function(error) {
			$log.error(error);
			$scope.page.msg.color = 'danger';
			$scope.page.msg.text = error.data.errors[0].detail;
			$scope.page.msg.show = true;
		});
	};

});