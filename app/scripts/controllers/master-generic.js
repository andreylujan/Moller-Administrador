'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:MastersGenericCtrl
 * @description
 * # MastersGenericCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('MastersGenericCtrl', function($scope, $log, $timeout, $state, $uibModal, NgTableParams, $filter, Utils, Collection, ExcelCollection) {

	$scope.page = {
		title: ''
	};
	var data = [];

	var id_collection = $state.params.type;
	var auxiliar = {};


	$scope.getCollection = function() {
		data = [];

		Collection.query({
			idCollection: id_collection
		}, function(success) {
			if (success.data) {
				$scope.page.title = success.data.attributes.name;
				data = [];
				for (var i = 0; i < success.included.length; i++) {
					data.push({
						// AQUI VAN LOS CAMPOS DEL JSON
						name: success.included[i].attributes.name,
						id: success.included[i].id,
						padre: success.included[i].attributes.parent_item_id
					});
				}
				auxiliar = data[0];

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
			if (error.status) {
				Utils.refreshToken($scope.getCollection);
			}
		});
	};

	$scope.openModalObjectDetails = function(idObject, idParent) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'genericDetails.html',
			controller: 'genericDetailsInstance',
			resolve: {
				idObject: function() {
					return idObject;
				},
				idParent: function() {
					return idParent;
				},
			}
		});

		modalInstance.result.then(function(datos) {
			if (datos.action === 'removeGeneric') {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id === datos.idCollection) {
						data.splice(i, 1);
					}
				}
			}
			else if (datos.action === 'editGeneric') {				
				for (var j = 0; j < data.length; j++) {
					if (data[j].id === datos.success.data.id) {
						data[j].name = datos.success.data.attributes.name;
						break;
					}
				}
			}
			$scope.tableParams.reload();
		}, function() {});
	};

	$scope.openModalNewCollectionItem = function() {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'newCollectionItem.html',
			controller: 'NewCollectionItemModalInstance',
			resolve: {
				CollectionObject: function() {
					return auxiliar;
				},
				idCollection: function() {
					return id_collection;
				}
			}
		});

		modalInstance.result.then(function(datos) {
			if (datos.action === 'save') {
				data.push({
					name: datos.success.data.attributes.name,
					id: datos.success.data.id
				});
			}
			$scope.tableParams.reload();
		}, function() {});
	};

	$scope.openModalNewGeneric = function() {

		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: false,
			templateUrl: 'newGenericMasive.html',
			controller: 'newGenericMasive',
			resolve: {
				idCollection: function() {
					return id_collection;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getCollection();
		}, function() {});
	};

	$scope.getExcel = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		ExcelCollection.getFile('#downloadExcel', id_collection, $scope.page.title);
		$timeout(function() {
			//$scope.page.buttons.getExcel.disabled = false;
			//$scope.page.loader.show = false;
		}, 3000);
	};


	$scope.getCollection();

})

.controller('newGenericMasive', function($scope, $log, $uibModalInstance, $uibModal, Csv, idCollection) {
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
			field: 'type',
			value: 'collections',
			id: idCollection
		}, {
			field: 'csv',
			value: $scope.modal.csvFile
		}];

		$scope.modal.overlay.show = true;

		Csv.upload(form)
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

})

.controller('genericDetailsInstance', function($scope, $log, $uibModalInstance, idObject, idParent, Validators, Utils, Collection, Collection_Item) {
	$scope.collection = {
		id: null,
		name: {
			text: '',
			disabled: true
		},
		parent_item_id: null
	};

	$scope.parentCollection = {
		visible: false,
		data: []
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

	$scope.selectedParent = null;

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.getCollectionItem = function(idObject) {
		Collection_Item.query({
			idCollection: idObject
		}, function(success) {
			if (success.data) {
				$scope.collection.id 		= success.data.id;
				$scope.collection.name 		= success.data.attributes.name;
				$scope.collection.parent_item_id = success.data.attributes.parent_item_id;
				if ($scope.collection.parent_item_id != null) 
				{
					$scope.getCollection(success.included[0].attributes.collection_id);
				}


			} else {
				$log.log(success);
			}

		}, function(error) {
			$log.error(error);
			if (error.status) {
				Utils.refreshToken($scope.getCollectionItem);
			}
		});
	};

	$scope.getCollection = function(idParent) {
		Collection.query({
			idCollection: idParent
		}, function(success) {
			if (success.data) {
				$scope.parentCollection.visible = true;

				for (var i = 0; i < success.included.length; i++) {
					$scope.parentCollection.data.push({
						name: success.included[i].attributes.name,
						id: success.included[i].id
					});
					if ($scope.collection.parent_item_id === success.included[i].id) 
					{
						$scope.collection.selectedParent = {name: success.included[i].attributes.name, id: success.included[i].id};
					}
				}

			} else {
				$log.log(success);
			}

		}, function(error) {
			$log.error(error);
			if (error.status) {
				Utils.refreshToken($scope.getCollection);
			}

		});
	};

	$scope.getCollectionItem(idObject);

	$scope.editGeneric = function(idObject) {

		if ($scope.elements.buttons.editUser.text === 'Editar') {
			$scope.elements.buttons.editUser.text = 'Guardar';
			$scope.elements.buttons.editUser.border = '';
		} else {
			if (!Validators.validateRequiredField($scope.collection.name)) {
				$scope.elements.alert.title = 'Faltan datos por rellenar';
				$scope.elements.alert.text = '';
				$scope.elements.alert.color = 'danger';
				$scope.elements.alert.show = true;
				return;
			}

			$scope.elements.buttons.editUser.text = 'Editar';
			$scope.elements.buttons.editUser.border = 'btn-border';
			var aux = {};
			if ($scope.collection.selectedParent === undefined) 
			{
				aux = { data: { type: 'collection_items', id: idObject, 
								attributes: { name: $scope.collection.name } }, idCollection: idObject };
			}
			else
			{
				aux = { data: { type: 'collection_items', id: idObject, 
								attributes: { name: $scope.collection.name }, 
								relationships: { parent_item: { data: { type: "collection_items", 
										id: $scope.collection.selectedParent.id } } } } , idCollection: idObject };
			}

			Collection_Item.update(aux, 
				function(success) {
					if (success.data) {
						$scope.elements.alert.title = 'Se han actualizado los datos de la actividad';
						$scope.elements.alert.text = '';
						$scope.elements.alert.color = 'success';
						$scope.elements.alert.show = true;
						$scope.getCollectionItem(idObject);

						$uibModalInstance.close({
							action: 'editGeneric',
							success: success
						});

					} else {
						$log.log(success);
					}
				}, function(error) {
					$log.log(error);
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
			$scope.elements.alert.title = '¿Seguro que desea eliminar la actividad?';
			$scope.elements.alert.text = 'Para eliminarla, vuelva a presionar el botón';
			$scope.elements.alert.color = 'danger';

		} else {
			$scope.elements.buttons.removeUser.text = 'Eliminar';

			Collection_Item.delete({
				idCollection: idObject
			}, function(success) {

				$uibModalInstance.close({
					action: 'removeGeneric',
					idCollection: idObject
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

.controller('NewCollectionItemModalInstance', function($scope, $log, $state, $uibModalInstance, Csv, Utils, Collection_Item, CollectionObject, Collection, idCollection) {

	$scope.modal = {
		csvFile: null
	};

	$scope.collection = {
		visible: false,
		data: []
	};

	$scope.collection_item = {
		name: '',
		id: '',
		code: ''
	};

	if (CollectionObject.padre != null) 
	{
		Collection_Item.query({
			idCollection: CollectionObject.padre
			}, function(success) {
				if (success.data) {
					getCollection(success.data.attributes.collection_id);
				} else {
					$log.log(success);
				}

			}, function(error) {
				$log.error(error);

			});

		var getCollection = function(idParent) {
			Collection.query({
				idCollection: idParent
			}, function(success) {
				if (success.data) {
					$scope.collection.visible = true;
					for (var i = 0; i < success.included.length; i++) {
						$scope.collection.data.push({
							name: success.included[i].attributes.name,
							id: success.included[i].id
						});
					}

					$scope.collection.selectedParent = $scope.collection.data[0];

				} else {
					$log.log(success);
				}

			}, function(error) {
				$log.error(error);

			});
		};
	}

	$scope.saveCollectionItem = function() {

		if ($scope.modal.csvFile) {
			//uploadCsvActivity();
		} else 
		{
			var aux = {};
			if ($scope.collection.selectedParent === undefined) 
			{
				aux = { 
					data: { type: 'collection_items', attributes: { name: $scope.collection_item.name, 
																	code: $scope.collection_item.code },
							relationships: { collection: {data: {type: 'collections', id: idCollection}}}}};
			}
			else
			{
				aux = { data: { type: 'collection_items', attributes: { name: $scope.collection_item.name,
																		code: $scope.collection_item.code }, 
								relationships: { collection: {data: {type: 'collections', id: idCollection}},
										parent_item: { data: { type: "collection_items", 
										id: $scope.collection.selectedParent.id }}}}};
			}
			Collection_Item.save(aux, 
				function(success) {
					if (success.data) {

						$uibModalInstance.close({
							action: 'save',
							success: success
						});
					} 
					else 
					{
						$log.error(success);
						$scope.modal.alert.title = 'Error al Guardar';
						$scope.modal.alert.text = '';
						$scope.modal.alert.color = 'danger';
						$scope.modal.alert.show = true;
						return;
					}
				}, function(error) {
					$log.error(error);
					if (error.status === 401) {
						Utils.refreshToken($scope.saveCollectionItem);
					}
					$scope.modal.alert.title = 'Error al Guardar';
					$scope.modal.alert.text = '';
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