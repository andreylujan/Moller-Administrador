'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:MastersConstructionCtrl
 * @description
 * # MastersConstructionCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('MastersPersonnelCtrl', function($scope, $log, $timeout, $state, $uibModal, NgTableParams, $filter, Utils, Personnel) {
	$scope.page = {
		title: 'Personal'
	};
	var data = [];

	var auxiliar = {};

	$scope.getPersonnel = function(e) {

 		Personnel.query({
 		}, function(success) {
 			if (success.data) {

				data = [];
				for (var i = 0; i < success.data.length; i++) {
					data.push({
						name: success.data[i].attributes.name,
						rut: success.data[i].attributes.rut,
						id: success.data[i].id
					});
				}

				$scope.tableParams = new NgTableParams({
					page: 1, // show first page
					count: 50, // count per page
					sorting: {
						name: 'asc' // initial sorting
					}
				}, {
					total: data.length, // length of data
					dataset: data
				});

			} else {
				$log.error(success);
			}
 		}, function(error) {
 			$log.error(error);
 			if (error.status === 401) {
 				Utils.refreshToken($scope.getPersonnel);
 			}
 		});
 	};

 	$scope.openModalObjectDetails = function(idObject) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'personnelDetails.html',
			controller: 'personnelDetailsInstance',
			resolve: {
				idObject: function() {
					return idObject;
				}
			}
		});

		modalInstance.result.then(function(datos) {
			if (datos.action === 'remove') {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id === datos.idPersonnel) {
						data.splice(i, 1);
					}
				}
			}
			else if (datos.action === 'edit') {				
				for (var j = 0; j < data.length; j++) {
					if (data[j].id === datos.success.data.id) {
						data[j].name = datos.success.data.attributes.name;
						data[j].rut = datos.success.data.attributes.rut;
						break;
					}
				}
			}
			$scope.tableParams.reload();
		}, function() {});
	};

 	$scope.getPersonnel();


	
	$scope.openModalNewPersonnel = function() {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'newPersonnel.html',
			controller: 'NewPersonnelModalInstance',
			resolve: {
			}
		});

		modalInstance.result.then(function(datos) {
			if (datos.action === 'save') {
				data.push({
					name: datos.success.data.attributes.name,
					rut: datos.success.data.attributes.rut,
					id: datos.success.data.id
				});
			}
			$scope.tableParams.reload();
		}, function() {});
	};
})

.controller('personnelDetailsInstance', function($scope, $log, $uibModalInstance, idObject, Validators, Utils, Personnel) {
	$scope.personnel = {
		id: null,
		name: {
			text: '',
			disabled: true
		},
		rut: {
			text: '',
			disabled: true
		},
		construction: {}
	};

	$scope.elements = {
		buttons: {
			editUser: {
				text: 'Editar',
				border: 'btn-border'
			},
			removeUser: {
				text: 'Eliminar',
				border: 'btn-border'
			}
		},
		title: '',
		alert: {
			show: false,
			title: '',
			text: '',
			color: '',
		}
	};

	$scope.getPersonnel = function(idObject) {

 		Personnel.query({
 			idPersonnel: idObject
 		}, function(success) {
 			if (success.data) {
 				$scope.elements.title = success.data.attributes.name;

 				$scope.personnel.name.text = success.data.attributes.name;
 				$scope.personnel.rut.text = success.data.attributes.rut;
 				$scope.personnel.id = success.data.id;

			} else {
				$log.error(success);
			}
 		}, function(error) {
 			$log.error(error);
 			if (error.status === 401) {
 				Utils.refreshToken($scope.getPersonnel(idObject));
 			}
 		});
 	};

 	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

 	$scope.getPersonnel(idObject);
	
	$scope.editGeneric = function(idObject) {

		if ($scope.elements.buttons.editUser.text === 'Editar') {
			$scope.elements.buttons.editUser.text = 'Guardar';
			$scope.elements.buttons.editUser.border = '';
		} else {
			if (!Validators.validateRequiredField($scope.personnel.name)) {
				$scope.elements.alert.title = 'Faltan datos por rellenar';
				$scope.elements.alert.text = '';
				$scope.elements.alert.color = 'danger';
				$scope.elements.alert.show = true;
				return;
			}

			$scope.elements.buttons.editUser.text = 'Editar';
			$scope.elements.buttons.editUser.border = 'btn-border';
			var aux = { data: { type: 'personnel', id: idObject, 
							attributes: { name: $scope.personnel.name.text, rut: $scope.personnel.rut.text } }, 
								idPersonnel: idObject };

			Personnel.update(aux, 
				function(success) {
					if (success.data) {
						$scope.elements.alert.title = 'Se han actualizado los datos de la actividad';
						$scope.elements.alert.text = '';
						$scope.elements.alert.color = 'success';
						$scope.elements.alert.show = true;
						$scope.getPersonnel(idObject);

						$uibModalInstance.close({
							action: 'edit',
							success: success
						});

					} else {
						$log.error(success);
					}
				}, function(error) {
					$log.error(error);
					if (error.status) {
						Utils.refreshToken($scope.editGeneric);
					}
				}
			);
		}
	};

	$scope.removeGeneric = function(idObject) {

		if ($scope.elements.buttons.removeUser.text === 'Eliminar') {
			$scope.elements.buttons.removeUser.text = 'Si, eliminar';

			$scope.elements.buttons.removeUser.border = '';
			$scope.elements.alert.show = true;
			$scope.elements.alert.title = '¿Seguro que desea eliminar esta persona?';
			$scope.elements.alert.text = 'Para eliminarla, vuelva a presionar el botón';
			$scope.elements.alert.color = 'danger';

		} else {
			$scope.elements.buttons.removeUser.text = 'Eliminar';

			Personnel.delete({
				idPersonnel: idObject
			}, function(success) {

				$uibModalInstance.close({
					action: 'remove',
					idPersonnel: idObject
				});

			}, function(error) {
				$log.log(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.removeGeneric);
				}
			});
		}

	};

	$scope.hideAlert = function() {
		$scope.elements.alert.show = false;
		$scope.elements.alert.title = '';
		$scope.elements.alert.text = '';
		$scope.elements.alert.color = '';
	};

})


.controller('NewPersonnelModalInstance', function($scope, $log, $state, $uibModalInstance, Csv, Utils, Personnel) {

	$scope.modal = {
		csvFile: null
	};

	$scope.personnel = {
		name: '',
		id: '',
		rut: ''
	};

	$scope.modal = {
		title: '',
		alert: {
			show: false,
			title: '',
			text: '',
			color: '',
		}
	};

	$scope.savePersonnel = function() {

		if ($scope.modal.csvFile) {
			//uploadCsvActivity();
		} else 
		{
			var aux = { data: { type: 'personnel', 
							attributes: { name: $scope.personnel.name, rut: $scope.personnel.rut } }};
			Personnel.save(aux, 
				function(success) {
					if (success.data) {

						$uibModalInstance.close({
							action: 'save',
							success: success
						});
					} 
					else {
						$scope.modal.alert.title = 'Error al Guardar';
						$scope.modal.alert.text = '';
						$scope.modal.alert.color = 'danger';
						$scope.modal.alert.show = true;
						return;
					}
				}, function(error) {
					$log.error(error);
					if (error.status === 401) {
						Utils.refreshToken($scope.savePersonnel);
					}
					$scope.modal.alert.title = 'Error al Guardar';
					$scope.modal.alert.text = error.data.errors[0].detail;
					$scope.modal.alert.color = 'danger';
					$scope.modal.alert.show = true;
					return;
				}
			);
		}

	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

});