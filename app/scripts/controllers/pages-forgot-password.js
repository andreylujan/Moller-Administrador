'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:PagesForgotPasswordCtrl
 * @description
 * # PagesForgotPasswordCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')
	.controller('ForgotPasswordCtrl', function($scope, $log, $state, Users,ChangePassword) {
		$scope.user = {
			email: {
				text:'',
				disabled: false
			},
			codigo: {
				text:'',
				disabled: true
			},
			pass: {
				text1:'',
				text2:'',
				disabled: true
			},
			id: ''
		};

		$scope.page = {
			msg: {
				color: '',
				text: '',
				show: false
			},
			sendBtn: {
				disabled: false
			}
		};

		$scope.sendPassToken = function() {

			Users.sendEmailWithToken({
				idUser: 'reset_password_token',
				email: $scope.user.email.text
			}, function(success) {
				// Si el servicio se ejecuta (200) pero lanza un error de validacion
				if (success.errors) {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				} else {
					$scope.page.msg.color = 'orange';
					$scope.page.msg.text = 'Te hemos enviado un correo con instrucciones, si el correo no aparece por favor revisa tu carpeta de spam.';
					$scope.page.msg.show = true;
					$scope.user.email.disabled = true;
					$scope.user.codigo.disabled = false;
				}

			}, function(error) {
				$log.log(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.errors[0].detail;
				$scope.page.msg.show = true;
			});

		};

		$scope.validacodigo = function() {
			Users.verifyPassToken({
				email: $scope.user.email.text,
				reset_password_token: $scope.user.codigo.text,
				idUser: 'verify'
			}, function(success) {
				// Si el servicio se ejecuta (200) pero lanza un error de validacion
				if (success.errors) {
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = success.errors[0].detail;
					$scope.page.msg.show = true;
				} else {
					//$log.error(success.data);
					$scope.user.id = success.data.id;

					if ($scope.user.id != '') 
					{
						$scope.user.codigo.disabled = true;
						$scope.user.pass.disabled = false;
					}
					else
					{
						$scope.page.msg.color = 'danger';
						$scope.page.msg.text = 'El mail ingresado no existe, favor intente nuevamente.';
						$scope.page.msg.show = true;
					}
				}

			}, function(error) {
				$log.error(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = error.data.errors[0].detail
				$scope.page.msg.show = true;
			});

		};

		$scope.cambiaContrasena = function() {
			if ($scope.user.pass.text1 != $scope.user.pass.text2) 
			{
				$scope.page.msg.color = 'danger';
				$scope.page.msg.text = "Las contraseñas deben ser iguales.";
				$scope.page.msg.show = true;
			}
			else
			{
				if ($scope.user.pass.text1.length < 8) 
				{
					$scope.page.msg.color = 'danger';
					$scope.page.msg.text = "La contraseña debe tener un minimo de 8 caracteres.";
					$scope.page.msg.show = true;
				}
				else
				{
					ChangePassword.save({
						password: $scope.user.pass.text1,
						password_confirmation: $scope.user.pass.text2,
						reset_password_token: $scope.user.codigo.text,
						idUser: $scope.user.id
					}, function(success) {
						if (success.data) {
							$scope.page.msg.color = 'greensea';
							$scope.page.msg.text = 'Se han actualizado los datos del usuario';
							$scope.page.msg.show = true;

							$state.go('login');

						} else {
							$log.log(success);
							$scope.page.msg.color = 'danger';
							$scope.page.msg.text = 'No se logro actualizar. Intente nuevamente';
							$scope.page.msg.show = true;
						}
					}, function(error) {
						$log.error(error);
					});
				}
			}
		};

		$scope.removeMsg = function() {
			$scope.page.msg.color = '';
			$scope.page.msg.text = '';
			$scope.page.msg.show = false;
		};

	});