'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:UsersListCtrl
 * @description
 * # UsersListCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('UsersInviteCtrl', function($scope, $log, $filter, $window, $uibModal, Roles, Users, Invitations, Csv, Utils) {

	$scope.page = {
		title: 'Invitar usuarios',
		formGroups: {
			invite: [{
				faIcon: 'plus',
				email: '',
				index: 0,
				roleId: null,
				showIcon: false
			}]
		},
		csvFile: null,
		msg: {
			show: false,
			text: '',
			color: ''
		}
	};
	$scope.roles = [];
	$scope.responseInvitations = [];

	var getRoles = function(e) {
		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.roles = [];

		Roles.query({
			idOrganization: Utils.getInStorage('organization')
		}, function(success) {
			// $log.log(success);

			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.roles.push({
						name: success.data[i].attributes.name,
						id: success.data[i].id,
						index: i
					});
				}
			} else {
				$log.log('error al obtener los roles');
			}

		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getRoles);
			}
		});

	};

	getRoles({
		success: true,
		detail: 'OK'
	});

	$scope.validateMailAndRol = function(index) {

		if ($scope.page.formGroups.invite[index].email) {
			$scope.page.formGroups.invite[index].showIcon = true;
		}
	};

	$scope.invite = function() {

		if ($scope.page.csvFile) {
			uploadCsvInvitation();
		} else {
			sendInvitations();
		}

	};

	var uploadCsvInvitation = function() {

		// $log.log($scope.page.csvFile);

		var form = [{
			field: 'type',
			value: 'invitations'
		}, {
			field: 'csv',
			value: $scope.page.csvFile
		}];

		var csvFile = $scope.page.csvFile;

		Csv.upload(form)
			.success(function(success) {
				$log.log(success);
				openModalSummary(success);
			}).error(function(error) {
				$log.error(error);
				$scope.page.msg.color = 'danger';
				$scope.page.msg.show = true;
				$scope.page.msg.text = 'Error '+ error.errors[0].status + ' - ' + error.errors[0].detail;
				//openModalSummary(error);
			});

	};

	$scope.sendInvitations = function() {

		$scope.responseInvitations = [];
		$scope.page.msg.color = 'orange-ps';
		$scope.page.msg.show = true;
		$scope.page.msg.text = 'Se han enviado las invitaciones a:';
		/* jshint ignore:start */
		for (var i = 0; i < $scope.page.formGroups.invite.length; i++) {
			//$log.error($scope.page.formGroups.invite[i].roleId);
			Invitations.save({
				"data": {
					"type": "invitations",
					"attributes": {
						"role_id": $scope.page.formGroups.invite[i].roleId,
						"email": $scope.page.formGroups.invite[i].email
					}
				}
			}, function(success) {
				$log.log(success);

				if (success.data) {
					$scope.responseInvitations.push({
						color: 'greensea',
						icon: 'check',
						email: success.data.attributes.email
					});
				} else {
					$scope.responseInvitations.push({
						color: 'danger',
						icon: 'times',
						// email: success.data.attributes.email
						email: success.errors[0].title
					});
				}

			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.sendInvitations);
				}

				$scope.responseInvitations.push({
					color: 'danger',
					icon: 'times',
					email: error.data.errors[0].detail
				});

			});
		}
		/* jshint ignore:end */

		clearFormGroups();
	};

	$scope.openModalLoad = function() {

		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: false,
			templateUrl: 'loadCategories.html',
			controller: 'LoadCategoriesModalInstance',
			resolve: {}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	var clearFormGroups = function() {
		$scope.page.formGroups.invite = [];
		$scope.page.formGroups.invite.push({
			faIcon: 'plus',
			email: '',
			index: 0,
			roleId: null,
			showIcon: false
		});

	};

	var openModalSummary = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'summary.html',
			controller: 'SummaryModalInstance',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {
			// $scope.getUsers();
		});
	};

})

.controller('LoadCategoriesModalInstance', function($scope, $log, $uibModalInstance, $uibModal, Activities, Csv) {

	$scope.modal = {
		csvFile: null,
		buttons: {
			load: {
				disabled: false,
				text: 'Cargar'
			}
		}
	};

	$scope.loadCategories = function() {
		if ($scope.modal.csvFile) {
			uploadCategories();
		}
	};

	var uploadCategories = function() {

		var form = [{
			field: 'type',
			value: 'categories'
		}, {
			field: 'csv',
			value: $scope.modal.csvFile
		}, {
			field: 'namespace',
			value: 'pausa'
		}];

		$scope.modal.buttons.load.disabled = true;
		$scope.modal.buttons.load.text = 'Subiendo...';

		Csv.upload(form)
			.success(function(success) {
				$uibModalInstance.close();
				openModalSummaryLoad(success);
			}).error(function(error) {
				$log.error(error);
			});

	};

	var openModalSummaryLoad = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'summaryLoad.html',
			controller: 'SummaryLoadCategoriesModalInstance',
			resolve: {
				data: function() {
					return data;
				}
			}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

})

.controller('SummaryModalInstance', function($scope, $log, $uibModalInstance, data) {

	$scope.modal = {
		errors: [],
		successes: []
	};
	var i = 0,
		email = null;

	for (i = 0; i < data.data.length; i++) {

		if (data.data[i].meta.errors) {
			$scope.modal.errors.push({
				email: data.data[i].meta.row_data.email,
				rowNumber: data.data[i].meta.row_number,
				field: Object.keys(data.data[i].meta.errors)[0]
			});
		} else {
			$scope.modal.successes.push({
				email: data.data[i].meta.row_data.email
			});
		}

	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};



});