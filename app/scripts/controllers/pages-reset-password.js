'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:PagesForgotPasswordCtrl
 * @description
 * # PagesForgotPasswordCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')
	.controller('ResetPasswordCtrl', function($scope, $log, $stateParams, Users, ResetPassword, Validators) {

		$scope.user = {
			token: {
				text: '',
				disabled: false
			},
			password: {
				text: '',
				disabled: false
			},
			passwordConfirmation: {
				text: '',
				disabled: false
			}
		};

		$scope.page = {
			msg: {
				color: '',
				text: '',
				show: false
			},
			anchor: {
				color: '',
				text: '',
				show: false
			},
			reestablishBtn: {
				disabled: false
			}
		};

		var passLength = 8;

		$scope.validateToken = function() {

			if (!Validators.validateStringLength($scope.user.password.text, passLength)) {
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = 'Las debe tener ' + passLength + ' caracteres como mínimo';
				$scope.page.msg.show = true;
				return;
			}

			if (!Validators.comparePasswords($scope.user.password.text, $scope.user.passwordConfirmation.text)) {
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = 'Las contraseñas no coinciden';
				$scope.page.msg.show = true;
				return;
			}

			Users.verifyPassToken({
				idUser: 'verify',
				email: $stateParams.email,
				reset_password_token: $scope.user.token.text
			}, function(success) {
				$log.log(success);

				if (success.data) {
					resetPass(success.data.id);
				} else {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				}

			}, function(error) {
				$log.log(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.data.errors[0].detail;
				$scope.page.msg.show = true;
			});

		};

		var resetPass = function(idUser) {

			ResetPassword.update({
				idOrganization: idUser,
				password: $scope.user.password.text,
				password_confirmation: $scope.user.passwordConfirmation.text,
				reset_password_token: $scope.user.token.text
			}, function(success) {

				$scope.page.msg.color = 'greensea';
				$scope.page.msg.text = 'Se ha reestablecido tu contraseña';
				$scope.page.msg.show = true;

				$scope.page.anchor.color = 'orange-ps';
				$scope.page.anchor.text = 'Ir a login';
				$scope.page.anchor.show = true;

				$scope.user.token.disabled = true;
				$scope.user.password.disabled = true;
				$scope.user.passwordConfirmation.disabled = true;
				$scope.page.reestablishBtn.disabled = true;

			}, function(error) {
				$log.log(error);

				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.data.errors[0].detail;
				$scope.page.msg.show = true;
			});

		};

		$scope.resetPassword = function() {

			ResetPassword.save({
				email: $scope.user.email.text
			}, function(success) {
				// $log.log(success);

				if (success.errors) {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				} else {
					$scope.page.msg.color = 'greensea';
					$scope.page.msg.text = 'Te hemos enviado un correo con instrucciones, si el correo no aparece en tu bandeja principal revisa tu carpeta de spam';
					$scope.page.msg.show = true;
				}

			}, function(error) {
				$log.log(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.errors[0].detail;
				$scope.page.msg.show = true;
			});
		};

		$scope.removeMsg = function() {
			$scope.page.msg.color = '';
			$scope.page.msg.text = '';
			$scope.page.msg.show = false;

			$scope.page.anchor.color = '';
			$scope.page.anchor.text = '';
			$scope.page.anchor.show = false;
		};

	});