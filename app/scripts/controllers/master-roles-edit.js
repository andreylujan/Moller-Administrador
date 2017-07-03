'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MasterRolesEdit
 * @description
 * # MasterRolesEdit
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('MasterRolesEdit', function($scope, $log, $uibModal, $filter, $state, $window, Checklists, ChecklistActions, Utils) {
	var idChecklist = $state.params.idChecklist;

	$scope.page = {
		title: 'Editar permisos'
	};

	/*$scope.checklist = {
		id: idChecklist,
		name: '',
		items: [],
		option: null
	};

	$scope.checklistOptions = [];

	var i = 0,
		j = 0,
		k = 0,
		children = [];

	var getChecklistOptions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
	};

	$scope.getInfoChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.checklist.items = [];

		Checklists.query({
			idChecklist: idChecklist
		}, function(success) {
			if (success.data) {
				$scope.checklist.name = success.data.attributes.name;

				for (i = 0; i < success.data.attributes.children.length; i++) {
					$scope.checklist.items.push({
						id: success.data.attributes.children[i].id,
						name: success.data.attributes.children[i].name,
						position: parseInt(success.data.attributes.children[i].position),
						options: success.data.attributes.children[i].data.options,
						option: null,
						required: success.data.attributes.children[i].required
					});
				}

			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getInfoChecklist);
			}
		});
	};

	$scope.generateItem = function() {

		$scope.checklist.items.push({
			id: null,
			name: '',
			required: false,
			position: 0,
			data: {
				options: []
			},
			options: [],
			option: null
		});

		$scope.page.buttons.oneMoreItem.disabled = true;
	};

	var prepareChecklistToSend = function() {
		children = [];

		for (i = 0; i < $scope.checklist.items.length; i++) {
			if ($scope.checklist.items[i].id) {
				children.push({
					id: $scope.checklist.items[i].id,
					name: $scope.checklist.items[i].name,
					required: $scope.checklist.items[i].required,
					position: $scope.checklist.items[i].position
				});
			} else {
				children.push({
					id: null,
					name: $scope.checklist.items[i].name,
					required: $scope.checklist.items[i].required,
					position: $scope.checklist.items[i].position,
					data: {
						options: []
							// option_ids: []
							// option_ids: [$scope.checklist.items[i].option.id]
					}
				});
			}
		}

		// $log.log(children);
	};

	$scope.createChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		prepareChecklistToSend();

		ChecklistActions.save({
			data: {
				type: 'checklists',
				attributes: {
					name: $scope.checklist.name,
					children: children
				}
			}
		}, function(success) {
			$log.log(success);
			if (success.data) {
				$log.error(success);
				$state.go('app.masters.checklist');
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.createChecklist);
			}
		});
	};

	$scope.openModalAddOptions = function(idItem, itemName, checklistName) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'addItemOptionsModal.html',
			controller: 'addItemOptionsModalInstance',
			resolve: {
				checklistName: function() {
					return checklistName;
				},
				idItem: function() {
					return idItem;
				},
				itemName: function() {
					return itemName;
				},
				infoChecklist: function() {
					return $scope.checklist;
				}
			}
		});

		modalInstance.result.then(function(idChecklist) {
			if ($state.params.idChecklist) {
				$scope.getInfoChecklist({
					success: true,
					detail: 'OK'
				});
				$scope.page.buttons.oneMoreItem.disabled = false;
			} else {
				$state.go('app.masters.new-checklist', {
					idChecklist: idChecklist
				});
			}
		}, function() {
		});
	};

	var updateChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		prepareChecklistToSend();

		ChecklistActions.update({
			idChecklist: idChecklist,
			data: {
				type: 'checklists',
				id: idChecklist,
				attributes: {
					name: $scope.checklist.name,
					children: children
				}
			}
		}, function(success) {
			if (success.data) {
				$log.log(success);
				$state.go('app.masters.checklist');
			} else {
				$window.alert('Error al actualizar el checklist');
				$log.error(success);
			}
		}, function(error) {
			$window.alert('Error al actualizar el checklist');
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(updateChecklist);
			}
		});
	};

	$scope.updateOrCreateChecklist = function() {
		if (idChecklist) {
			updateChecklist({
				success: true,
				detail: 'OK'
			});
		} else {
			$scope.createChecklist({
				success: true,
				detail: 'OK'
			});
		}
	};

	$scope.removeItem = function(index) {
		$scope.checklist.items.splice(index, 1);
	};

	if (idChecklist) {
		$scope.getInfoChecklist({
			success: true,
			detail: 'OK'
		});

	}*/

});

/*.controller('addItemOptionsModalInstance', function($scope, $log, $uibModalInstance, $window, idItem, itemName, checklistName, Checklists, ChecklistActions, infoChecklist, Utils) {

	$scope.modal = {
		checklistOptions: [],
		selectedOption: null,
		options: []
	};

	var i = 0,
		j = 0,
		k = 0,
		infoItem = [],
		children = [];

	var getChecklistOptions = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Checklists.query({
			'filter[type]': 'ChecklistOption'
		}, function(success) {
			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					$scope.modal.checklistOptions.push({
						id: success.data[i].id,
						name: success.data[i].attributes.name,
						appVisibility: false,
						detail: false,
						data: null
					});
				}
				$scope.getInfoChecklist({
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(getChecklistOptions);
			}
		});
	};

	$scope.getInfoChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		if (infoChecklist.id) {

			Checklists.query({
				idChecklist: infoChecklist.id,
			}, function(success) {
				if (success.data) {
					for (i = 0; i < success.data.attributes.children.length; i++) {
						if (success.data.attributes.children[i].id === idItem) {
							infoItem.id = success.data.attributes.children[i].id;
							infoItem.name = success.data.attributes.children[i].name;
							infoItem.data = success.data.attributes.children[i].data;
						}
					}

					for (i = 0; i < success.data.attributes.children.length; i++) {
						if (success.data.attributes.children[i].id === idItem) {
							for (j = 0; j < success.data.attributes.children[i].data.options.length; j++) {
								$scope.modal.options.push({
									id: success.data.attributes.children[i].data.options[j].id,
									detail: success.data.attributes.children[i].data.options[j].has_detail,
									selected: null,
									data: success.data.attributes.children[i].data.options[j].data
								});
								
								var llaves = _.keys($scope.modal.options[j].data);
								for (k = 0; k < llaves.length; k++) {
									if(_.propertyOf($scope.modal.options[j].data)(llaves[k]).id === undefined){
										//$log.error($scope.modal.options[i].data[llaves[k]].visibility);
										var jsonCant = {id: 185, type: "Comment", name: "Cantidad", required: true, max_length: 4,
								        			multiline: false, field_type: "number", visibility: $scope.modal.options[j].data[llaves[k]].visibility},
											jsonObs  = {id: 184, type: "Comment", name: "Observación", required: true, max_length: 2048,
								        			multiline: true, field_type: "text", visibility: $scope.modal.options[j].data[llaves[k]].visibility},
											jsonFoto = {id: 26, type: "Gallery", name: "Fotos", icon: "/images/fotos.png", required: true,
								        			max_images: 0, visibility: $scope.modal.options[j].data[llaves[k]].visibility},
											jsonCual = {id: 24, type: "Comment", name: "Cuál", required: true, max_length: 140,
								        			multiline: true, field_type: "text", visibility: $scope.modal.options[j].data[llaves[k]].visibility};
										$scope.modal.options[j].data = {cant: jsonCant, observacion: jsonObs, foto: jsonFoto, cual: jsonCual};
									}
								}
							}
						}
					}
					//Al crear todos los objetos de nuevo, al app piensa que son distintos, si se usaran unos globales, sabe que son los mismos y mueren los checkbox
					// $scope.modal.checklistOptions -> todas las opciones q existen y q salen en el modal
					for (i = 0; i < $scope.modal.checklistOptions.length; i++) {
						// $scope.modal.options -> todas las opciones disponibles
						for (j = 0; j < $scope.modal.options.length; j++) {
							if (parseInt($scope.modal.checklistOptions[i].id) === parseInt($scope.modal.options[j].id)) {						
								$scope.modal.checklistOptions[i].appVisibility = true;
								if ($scope.modal.options[j].detail) {
									$scope.modal.checklistOptions[i].detail = true;
								}
								var llaves = _.keys($scope.modal.options[j].data);
								if ($scope.modal.options[j].data === null || llaves.length === 0) {
									var jsonCant = {id: 185, type: "Comment", name: "Cantidad", required: true, max_length: 4,
								        			multiline: false, field_type: "number", visibility: false},
										jsonObs  = {id: 184, type: "Comment", name: "Observación", required: true, max_length: 2048,
								        			multiline: true, field_type: "text", visibility: false},
										jsonFoto = {id: 26, type: "Gallery", name: "Fotos", icon: "/images/fotos.png", required: true,
								        			max_images: 0, visibility: false},
										jsonCual = {id: 24, type: "Comment", name: "Cuál", required: true, max_length: 140,
								        			multiline: true, field_type: "text", visibility: false};
									$scope.modal.checklistOptions[i].data = {cant: jsonCant, observacion: jsonObs, foto: jsonFoto, cual: jsonCual};
								}
								else
								{
									$scope.modal.checklistOptions[i].data = $scope.modal.options[j].data;
								}
								break;
							}
						}
					}
					for (i = 0; i < $scope.modal.checklistOptions.length; i++) {
						if ($scope.modal.checklistOptions[i].data === null) 
						{
							var jsonCant = {id: 185, type: "Comment", name: "Cantidad", required: true, max_length: 4,
								            multiline: false, field_type: "number", visibility: false},
								jsonObs  = {id: 184, type: "Comment", name: "Observación", required: true, max_length: 2048,
								            multiline: true, field_type: "text", visibility: false},
								jsonFoto = {id: 26, type: "Gallery", name: "Fotos", icon: "/images/fotos.png", required: true,
								            max_images: 0, visibility: false},
								jsonCual = {id: 24, type: "Comment", name: "Cuál", required: true, max_length: 140,
								            multiline: true, field_type: "text", visibility: false};
							$scope.modal.checklistOptions[i].data = {cant: jsonCant, observacion: jsonObs, foto: jsonFoto, cual: jsonCual};
						}
					}

				} else {
					$log.error(success);
				}

			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken($scope.getInfoChecklist);
				}
			});
		}
	};

	$scope.createChecklistOrAssignItems = function() {

		children = [];
		var optionIds = [];
		var ordererIds = [];

		// Se al arreglo de ids sólo los id de items q tienen visibilidad
		for (i = 0; i < $scope.modal.checklistOptions.length; i++) {
			//$log.error($scope.modal.checklistOptions[i].data);
			if ($scope.modal.checklistOptions[i].appVisibility) {
				if ($scope.modal.checklistOptions[i].detail) {
					optionIds.push({
						id: $scope.modal.checklistOptions[i].id,
						has_detail: true,
						data: $scope.modal.checklistOptions[i].data
					});
				} else {
					optionIds.push({
						id: $scope.modal.checklistOptions[i].id,
						has_detail: false,
						data: $scope.modal.checklistOptions[i].data
					});
				}
			}
		}

		// se agrega al children los id's q se seleccionaron con visibilidad
		children.push({
			id: idItem,
			name: itemName,
			data: {
				options: optionIds
					// option_ids: optionIds
			}
		});

		//$log.error(children);

		// se agrega al children los items que no estan siendo editados
		for (i = 0; i < infoChecklist.items.length; i++) {
			if (infoChecklist.items[i].id !== idItem) {
				children.push({
					id: infoChecklist.items[i].id,
					name: infoChecklist.items[i].name,
					data: {
						options: infoChecklist.items[i].options
							// option_ids: infoChecklist.items[i].options
					}
				});
			}
		}

		// se ordenan los id's ascendiente
		for (i = 0; i < children.length; i++) {
			ordererIds = _.sortBy(children[i].data.options, 'id');
			children[i].data.options = ordererIds;
		}

		if (infoChecklist.id) {
			addChecklistOptions(infoChecklist.id, {
				success: true,
				detail: 'OK'
			});
		} else {
			createChecklist({
				success: true,
				detail: 'OK'
			});
		}

	};

	var createChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ChecklistActions.save({
			data: {
				type: 'checklists',
				attributes: {
					name: checklistName,
					children: []
				}
			}
		}, function(success) {
			if (success.data) {
				// $log.log(success);
				addChecklistOptions(success.data.id, {
					success: true,
					detail: 'OK'
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(createChecklist);
			}
		});
	};

	var addChecklistOptions = function(idChecklist, e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ChecklistActions.update({
			idChecklist: idChecklist,
			data: {
				type: 'checklists',
				id: idChecklist,
				attributes: {
					name: infoChecklist.name,
					children: children
				}
			}
		}, function(success) {
			if (success.data) {
				// $log.log(success);
				$uibModalInstance.close(idChecklist);
			} else {
				$window.alert('Error al asiginar las opciones');
				$log.error(success);
			}
		}, function(error) {
			$window.alert('Error al asiginar las opciones');
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(addChecklistOptions);
			}
		});

	};

	$scope.ok = function() {
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

	getChecklistOptions({
		success: true,
		detail: 'OK'
	});

	if (idItem) {

	} else {
		// $scope.generateOption();
	}

});*/