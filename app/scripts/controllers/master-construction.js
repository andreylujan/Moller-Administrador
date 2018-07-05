'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:MastersConstructionCtrl
 * @description
 * # MastersConstructionCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('MastersConstructionCtrl', function($scope, $log, $timeout, $state, $uibModal, NgTableParams, $filter, Utils, Constructions, ExcelConstruction) {

	$scope.page = {
		title: 'Obras'
	};
	var data = [];

	var auxiliar = {};

	$scope.getConstructions = function(e) {

 		Constructions.query({
 		}, function(success) {
 			if (success.data) {
				data = [];
				for (var i = 0; i < success.data.length; i++) {
					data.push({
						// AQUI VAN LOS CAMPOS DEL JSON
						name: success.data[i].attributes.name,
						code: success.data[i].attributes.code,
						fullname: success.data[i].attributes.code + ' - ' + success.data[i].attributes.name,
						id: success.data[i].id,
						company: success.data[i].attributes.company_id
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
 				Utils.refreshToken($scope.getConstructions);
 			}
 		});
 	};

 	$scope.openModalObjectDetails = function(idObject, idCompany) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'constructionDetails.html',
			controller: 'constructionDetailsInstance',
			resolve: {
				idObject: function() {
					return idObject;
				},
				idCompany: function() {
					return idCompany;
				},
			}
		});

		modalInstance.result.then(function(datos) {
			if (datos.action === 'showRoles') {
				var modalInstanceRoles = $uibModal.open({
					animation: true,
					templateUrl: 'roleDetails.html',
					controller: 'RoleDetailsInstanceRole',
					resolve: {
						idObject: function() {
							return idObject;
						},
						idCompany: function() {
							return idCompany;
						},
					}
				});
			}
			$scope.tableParams.reload();
		}, function() {});
	};

 	$scope.getConstructions();

	$scope.getExcel = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		ExcelConstruction.getFile('#downloadExcel', 'construction_personel');
		$timeout(function() {
		}, 3000);
	};

	$scope.openModalNewGeneric = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: false,
			templateUrl: 'newGenericConstructionMasive.html',
			controller: 'newGenericConstructionMasive',
			resolve: {
			}
		});

		modalInstance.result.then(function() {
			$scope.getConstructions();
		}, function() {});
	};
})
.controller('constructionDetailsInstance', function($scope, $log, $uibModalInstance, idObject, 
	idCompany, Validators, Utils, Constructions, Users, Personnel) {
	
	$scope.construction = {
		id: null,
		name: {
			text: '',
			disabled: true
		},
		contractors: {},
		administrator: {},
		experts: [],
		jTerreno: {},
		visitador: {},
		supervisor: {}
	};

	$scope.experts = [];
	$scope.jefesTerreno = [];
	$scope.expersCount = 0;

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

	$scope.getConstruction = function(idObject) {

 		Constructions.detail({
 			constructionId: idObject,
 			include: 'administrator,supervisor,expert,construction_personnel.personnel,construction_personnel.personnel_type'
 		}, function(success) {
 			if (success.data) {
 				//Cambiar por la lista que viene de servicios
 				$scope.expersCount = success.data.attributes.experts.length;
 				var experts_array = success.data.attributes.experts
 				var administrador 	= success.data.relationships.administrator.data,
 				    experto 		= success.data.relationships.expert.data,
 				  	personal 		= success.data.relationships.construction_personnel.data,
 				  	supervisor 		= success.data.relationships.supervisor.data;

 				$scope.construction.id = success.data.id;
 				$scope.construction.name.text = success.data.attributes.name;
 				$scope.construction.code = success.data.attributes.code;

				var contratistas = [];

				for (var i = 0; i < success.data.attributes.contractors.length; i++) {
					contratistas.push({
						name: success.data.attributes.contractors[i].name,
						rut: success.data.attributes.contractors[i].rut,
						id: success.data.attributes.contractors[i].id
					});
				}

				contratistas.length>0? $scope.construction.contractors = contratistas : $scope.construction.contractors = null;


				if (_.has(success, "included")) 
				{
					if (experto == null) 
					{
						experto = {id: null, type:null};
					}
					if (administrador == null) 
					{
						administrador = {id: null, type:null};
					}
					if (supervisor == null) 
					{
						supervisor = {id: null, type:null};
					}

					for (var i = 0; i < success.included.length; i++) {
						if (success.included[i].id === administrador.id && success.included[i].type === administrador.type) 
						{
							$scope.construction.administrator = success.included[i];
						}
						if (success.included[i].id === supervisor.id && success.included[i].type === supervisor.type) 
						{
							$scope.construction.supervisor = success.included[i];
						}
						/*if (success.included[i].id === experto.id && success.included[i].type === experto.type) 
						{
							$scope.construction.expert = success.included[i];
						}*/
					}
				}

				for (var i = 0; i < personal.length; i++) {
					for (var j = 0; j < success.included.length; j++) {
						if (success.included[j].id === personal[i].id && success.included[j].type === personal[i].type) 
						{
							//$log.error(personal[i]);
							var aux = success.included[j];
						 	for (var k = 0; k < success.included.length; k++) {
						 		//$log.error(success.included[j]);
								if (success.included[k].id === aux.relationships.personnel.data.id 
									&& success.included[k].type === aux.relationships.personnel.data.type
									&& aux.relationships.personnel_type.data.id === "1") 
								{
									$scope.construction.jTerreno = success.included[k];
								}
								else if (success.included[k].id === aux.relationships.personnel.data.id 
									&& success.included[k].type === aux.relationships.personnel.data.type
									&& aux.relationships.personnel_type.data.id === "2") 
								{
									$scope.construction.visitador = success.included[k];
								}
							}
						}
					}
				}
				$scope.construction.experts = _.map(experts_array, function(u){ return {id: u.id, fullName: u.name }; });
				$scope.getPersonnelJefeTerreno();
				$scope.getUsersExpert();

			} else {
				$log.error(success);
			}
 		}, function(error) {
 			$log.error(error);
 			if (error.status === 401) {
 				Utils.refreshToken($scope.getConstruction);
 			}
 		});
 	};

 	$scope.getPersonnelJefeTerreno = function() {

		Personnel.query({
		}, function(success) {
			if (success.data) {
				var data = [];
				for (var i = 0; i < success.data.length; i++) {
					data.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name,
						rut: success.data[i].attributes.rut
					});

					if ($scope.construction.jTerreno.id === success.data[i].id) 
					{
						$scope.construction.selectedJefeTerreno = { name: success.data[i].attributes.name, id: success.data[i].id };
					}
				}
				$scope.jefesTerreno = data;
				
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getUsers);
			}
		});
	};

 	$scope.getUsersExpert = function() {

		Users.query({
			idUser: ''
		}, function(success) {
			if (success.data) {
				var data = [];
				for (var i = 0; i < success.data.length; i++) {
					data.push({
						id: success.data[i].id,
						firstName: success.data[i].attributes.first_name,
						lastName: success.data[i].attributes.last_name,
						email: success.data[i].attributes.email,
						roleName: success.data[i].attributes.role_name,
						roleId: success.data[i].attributes.role_id,
						active: success.data[i].attributes.active,
						fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
					});

					/*if ($scope.construction.expert.id === success.data[i].id) 
					{
						$scope.construction.selectedExpert = {fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name, id: success.data[i].id };
					}*/
				}

				$scope.experts = _.reject(data, function(object){ return object.id === ""; });
				//$scope.experts = _.where(data, {roleId: 3});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getUsers);
			}
		});
	};

 	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

 	$scope.getConstruction(idObject);

 	$scope.editGeneric = function(idObject) {
		if ($scope.elements.buttons.editUser.text === 'Editar') {
			$scope.elements.buttons.editUser.text = 'Guardar';
			$scope.elements.buttons.editUser.border = '';
		} else {
			$scope.elements.buttons.editUser.text = 'Editar';
			$scope.elements.buttons.editUser.border = 'btn-border';

			var usuarios = []
			angular.forEach($scope.construction.experts, function(value, key)
			{
				usuarios.push({id: value.id, name: value.fullName});	
			});

			var aux = { 
					data: { 
						type: 'constructions', 
						id: idObject, 
						attributes: { 
							name: $scope.construction.name.text,
							construction_personnel_attributes: [
								{ personnel_type_id: "1", personnel_id: $scope.construction.selectedJefeTerreno.id },
								{ personnel_type_id: "2", personnel_id: $scope.construction.visitador.id }
							],
							experts: usuarios
						}
					} , constructionId: idObject };

			Constructions.update(aux, 
				function(success) {
					if (success.data) {
						$scope.elements.alert.title = 'Se han actualizado los datos de la obra';
						$scope.elements.alert.text = '';
						$scope.elements.alert.color = 'success';
						$scope.elements.alert.show = true;
						$scope.getConstruction(idObject);

						$uibModalInstance.close({
							action: 'editGeneric',
							success: success
						});

					} else {
						$log.log(success);
					}
				}, function(error) {
					$log.log(error);
					if (error.status === 401) {
						Utils.refreshToken($scope.editGeneric);
					}
				}
			);
		}
	};

	$scope.hideAlert = function() {
		$scope.elements.alert.show = false;
		$scope.elements.alert.title = '';
		$scope.elements.alert.text = '';
		$scope.elements.alert.color = '';
	};

	$scope.showRoles = function() {
		$uibModalInstance.close({
			action: 'showRoles'
		});
	};
})

.controller('RoleDetailsInstanceRole', function($scope, $log, $uibModalInstance, idObject, 
	idCompany, UserContruction, Roles, Validators, Utils) {
	
	$scope.elements = {
		title: 'Roles',
		alert: {
			show: false,
			title: '',
			text: '',
			color: '',
		}
	}
	$scope.user = {}

	$scope.modal = {
		constructions: []
	}

	$scope.getRolesDetail = function(idObject) {
		UserContruction.query({
			idContruction: idObject
		}, function(success) {
			if (success.data) {
				$scope.modal.constructions = success.data
			} else {
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status) {
				Utils.refreshToken($scope.getRolesDetail);
			}
		});

	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel')
	}

	$scope.getRolesDetail(idObject)
})

.controller('newGenericConstructionMasive', function($scope, Utils, $log, $uibModalInstance, $uibModal, CsvContructions) {
	$scope.modal = {
		csvFile: null,
		btns: {
			chargeSave: {
				disabled: false
			}
		},
		overlay: {
			show: false
		},
		alert: {
			color: '',
			show: false,
			title: '',
			subtitle: '',
			text: ''
		}
	};

	$scope.save = function() {

		$scope.modal.btns.chargeSave.disabled = true;

		if ($scope.modal.csvFile) {
			uploadCsv();
		} else {

		}

	};

	var uploadCsv = function() {
		var form = [{
			field: 'csv',
			value: $scope.modal.csvFile
		}];

		$scope.modal.overlay.show = true;

		CsvContructions.upload(form)
			.success(function(success) {
				$scope.modal.overlay.show = false;
				$uibModalInstance.close();
				openModalSummary(success);
			}).error(function(error) {
				$log.error(error);
				$scope.modal.overlay.show = false;
				$scope.modal.alert.show = true;
				$scope.modal.alert.title = 'Error '+error.errors[0].status;
				$scope.modal.alert.text = error.errors[0].detail;
				$scope.modal.alert.color = 'danger';
			});

	};

	var openModalSummary = function(data) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'summary.html',
			controller: 'SummaryLoadModalInstance',
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

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.ok = function() {
		$uibModalInstance.close();
	};
})

.controller('SummaryLoadModalInstance', function($scope, $log, $uibModalInstance, data) {

	$scope.modal = {
		countErrors: 0,
		countSuccesses: 0,
		countCreated: 0,
		countChanged: 0,
		errors: [],
		successes: []
	};
	var i = 0;

	for (i = 0; i < data.data.length; i++) {

		if (!data.data[i].meta.success) {
			$scope.modal.countErrors++;
		} else if (data.data[i].meta.created) {
			$scope.modal.countCreated++;
		} else if (data.data[i].meta.changed) {
			$scope.modal.countChanged++;
		}

		if (data.data[i].meta.errors) {
			$scope.modal.errors.push({
				rowNumber: data.data[i].meta.row_number,
				field: Object.keys(data.data[i].meta.errors)[0]
			});
		}

	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});