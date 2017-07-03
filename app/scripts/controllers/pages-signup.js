'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:PagesSignupCtrl
 * @description
 * # PagesSignupCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('SignupCtrl', function($scope, $log, $state, $filter, InviteLink, Users, Validators, Utils) {

	$scope.page = {
		elements: {
			saveBtn: {
				disabled: true
			},
			message: {
				color: '',
				text: '',
				show: false
			},
			submessage: {
				color: '',
				text: '',
				show: false
			},
			newUser: {
				email: {
					text: null,
					disabled: false
				},
				rut: {
					text: null,
					disabled: false
				},
				firstName: {
					text: null,
					disabled: false
				},
				lastName: {
					text: null,
					disabled: false
				},
				phoneNumber: {
					text: null,
					disabled: false
				},
				password: {
					text: null,
					disabled: false
				},
				passwordConfirmation: {
					text: null,
					disabled: false
				},
				image: {
					text: null,
					disabled: false
				}
			}
		}
	};

	var acceptInvitation = false;

	$scope.acceptInvitation = function() {
		$log.log($state.params.confirmation_token);
		if ($state.params.id) {

			// $log.log($state.params.id);
			// $log.log($state.params.confirmation_token);

			InviteLink.update({
				id: $state.params.id,
				confirmation_token: $state.params.confirmation_token,
				data: {
					type: 'invitations',
					id: ($state.params.id).toString(),
					attributes: {
						accepted: true
					}
				}
			}, function(success) {

				$log.error(success);

				if (success.data) {

					$scope.page.elements.newUser.email.text = success.data.attributes.email;
					$scope.page.elements.newUser.firstName.text = success.data.attributes.first_name;
					$scope.page.elements.newUser.lastName.text = success.data.attributes.last_name;

					acceptInvitation = true;
				} else {
					$log.error(success);
					$scope.page.elements.message.color = 'danger';
					$scope.page.elements.message.text = success.
					$scope.page.elements.message.text = 'La invitación ya no existe, solicite una nueva invitación';
					$scope.page.elements.message.show = true;
					acceptInvitation = false;
				}

			}, function(error) {
				$log.error(error);

				if (error.data.errors[0].status === '422') {
					$state.go('core.page404');
					acceptInvitation = false;
				} else {
					$scope.page.elements.message.color = 'danger';
					$scope.page.elements.message.text = error.data.errors[0].title;
					$scope.page.elements.message.show = true;
					acceptInvitation = false;
				}
			});
		}

	};

	$scope.acceptInvitation();

	$scope.saveAccount = function() {

		var rutUnformatted = Utils.replaceAll($scope.page.elements.newUser.rut.text, '.', '');

		 if (!Validators.validateRutCheckDigit(rutUnformatted)) {
		 	$scope.page.elements.message.color = 'danger';
		 	$scope.page.elements.message.text = 'Rut no válido';
		 	$scope.page.elements.message.show = true;
		 	return;
		 }

		if (!Validators.validateRequiredField($scope.page.elements.newUser.email.text) || !Validators.validateRequiredField($scope.page.elements.newUser.firstName.text) || !Validators.validateRequiredField($scope.page.elements.newUser.lastName.text) || !Validators.validateRequiredField($scope.page.elements.newUser.password.text) || !Validators.validateRequiredField($scope.page.elements.newUser.passwordConfirmation.text)) {
			$scope.page.elements.message.color = 'danger';
			$scope.page.elements.message.text = 'Faltan datos por rellenar';
			$scope.page.elements.message.show = true;
			return;
		}

		if (!Validators.comparePasswords($scope.page.elements.newUser.password.text, $scope.page.elements.newUser.passwordConfirmation.text)) {
			$scope.page.elements.message.color = 'danger';
			$scope.page.elements.message.text = 'Las contraseñas no coinciden';
			$scope.page.elements.message.show = true;
			return;
		}

		if (!Validators.validateStringLength($scope.page.elements.newUser.password.text, 8)) {
			$scope.page.elements.message.color = 'danger';
			$scope.page.elements.message.text = 'La contraseña debe tener un largo mínimo de 8 caracteres';
			$scope.page.elements.message.show = true;
			return;
		}

		if (acceptInvitation) {
			$scope.page.elements.saveBtn.disabled = true;

			Users.save({
				confirmation_token: $state.params.confirmation_token,
				data: {
					type: 'users',
					attributes: {
						email: $scope.page.elements.newUser.email.text,
						first_name: $filter('capitalize')($scope.page.elements.newUser.firstName.text, true),
						last_name: $filter('capitalize')($scope.page.elements.newUser.lastName.text, true),
						rut: $scope.page.elements.newUser.rut.text,
						password: $scope.page.elements.newUser.password.text,
						password_confirmation: $scope.page.elements.newUser.passwordConfirmation.text,
						phone_number: $scope.page.elements.newUser.phoneNumber.text,
						image: null
					}
				}
			}, function(success) {
				// $log.log(success);
				if (success.data) {
					disableForm();
					$scope.page.elements.message.color = 'greensea';
					$scope.page.elements.message.text = 'Usuario creado exitosamente';
					$scope.page.elements.message.show = true;

					$scope.page.elements.submessage.color = 'default';
					$scope.page.elements.submessage.text = 'puede cerrar esta página';
					$scope.page.elements.submessage.show = true;
					$state.go('login');
				} else {
					$scope.page.elements.saveBtn.disabled = false;
					$scope.page.elements.message.color = 'danger';
					$scope.page.elements.message.text = success.errors[0].detail;
					$scope.page.elements.message.show = true;
				}

			}, function(error) {
				$scope.page.elements.saveBtn.disabled = false;
				$log.log(error);
				$scope.page.elements.message.color = 'danger';
				$scope.page.elements.message.text = 'No se ha podido crear el usuario';
				$scope.page.elements.message.show = true;
			});
		}

	};

	$scope.removeMsg = function() {
		$scope.page.elements.message.color = '';
		$scope.page.elements.message.text = '';
		$scope.page.elements.message.show = false;

		$scope.page.elements.submessage.color = '';
		$scope.page.elements.submessage.text = '';
		$scope.page.elements.submessage.show = false;
	};

	$scope.enableCreateAccountBtn = function() {
		$scope.page.elements.saveBtn.disabled = false;
	};

	var disableForm = function() {

		$scope.page.elements.newUser.email.disabled = true;
		$scope.page.elements.newUser.firstName.disabled = true;
		$scope.page.elements.newUser.lastName.disabled = true;
		$scope.page.elements.newUser.rut.disabled = true;
		$scope.page.elements.newUser.password.disabled = true;
		$scope.page.elements.newUser.passwordConfirmation.disabled = true;
		$scope.page.elements.newUser.phoneNumber.disabled = true;

	};

	$scope.enableForm = function() {

		$scope.page.elements.newUser.email.disabled = true;
		$scope.page.elements.newUser.firstName.disabled = true;
		$scope.page.elements.newUser.lastName.disabled = true;
		$scope.page.elements.newUser.rut.disabled = true;
		$scope.page.elements.newUser.password.disabled = true;
		$scope.page.elements.newUser.passwordConfirmation.disabled = true;
		$scope.page.elements.newUser.phoneNumber.disabled = true;
	};

	$scope.formatRut = function(rut) {

		if (Validators.validateRutCheckDigit(rut)) {
			$scope.page.elements.newUser.rut.text = Utils.formatRut(rut);
			$scope.page.elements.saveBtn.disabled = false;
			$scope.page.elements.newUser.firstName.disabled = false;
			$scope.page.elements.newUser.lastName.disabled = false;
			$scope.page.elements.newUser.password.disabled = false;
			$scope.page.elements.newUser.passwordConfirmation.disabled = false;
		} else {
			$scope.page.elements.message.color = 'danger';
		 	$scope.page.elements.message.text = 'Rut no válido';
		 	$scope.page.elements.message.show = true;
		 	$scope.page.elements.saveBtn.disabled = true;
		 	$scope.page.elements.newUser.firstName.disabled = true;
			$scope.page.elements.newUser.lastName.disabled = true;
			$scope.page.elements.newUser.password.disabled = true;
			$scope.page.elements.newUser.passwordConfirmation.disabled = true;
		}

	};
});