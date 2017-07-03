'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:NewChecklistCtrl
 * @description
 * # NewChecklistCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('NewChecklistCtrl', function($scope, $log, $uibModal, $filter, $state, $window, ChecklistActions, Utils) {

	var idChecklist = $state.params.idChecklist;

	$scope.page = {
		title: '',
		buttons: {
			oneMoreItem: {
				disabled: false
			}
		}
	};

	$scope.checklist = {
		id: idChecklist,
		name: '',
		items: []
	};

	$scope.checklistOptions = [];

	$scope.page.title = idChecklist ? 'Editar checklist' : 'Nuevo checklist';

	var i = 0,
		j = 0,
		k = 0,
		sections = [];

	$scope.getInfoChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		$scope.checklist.items = [];

		ChecklistActions.detail({
			idChecklist: idChecklist
		}, function(success) {
			if (success.data) {
				$scope.checklist.name = success.data.attributes.name;

				for (i = 0; i < success.data.attributes.sections.length; i++) {
					$scope.checklist.items.push({
						id: success.data.attributes.sections[i].id,
						name: success.data.attributes.sections[i].name,
						items: success.data.attributes.sections[i].items
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
			} else {
				$state.go('efinding.maestros-checklist', {
					idChecklist: idChecklist
				});
			}
		}, function() {
		});
	};

	$scope.removeItem = function(index) {
		$scope.checklist.items.splice(index, 1);
	};

	if (idChecklist) {
		$scope.getInfoChecklist({
			success: true,
			detail: 'OK'
		});

	}

	$scope.generateItem = function() {

		$scope.checklist.items.push({
			id: null,
			name: '',
			items: []
		});
	};

	$scope.updateOrCreateChecklist = function() {
		if (idChecklist) {
			updateChecklist({
				success: true,
				detail: 'OK'
			});
		}
		else 
		{
			$scope.createChecklist({
				success: true,
				detail: 'OK'
			});
		}
	};

	var prepareChecklistToSend = function() {
		sections = [];

		for (i = 0; i < $scope.checklist.items.length; i++) {
			if ($scope.checklist.items[i].id) {
				sections.push({
					id: $scope.checklist.items[i].id,
					name: $scope.checklist.items[i].name
				});
			} else {
				sections.push({
					id: null,
					name: $scope.checklist.items[i].name
				});
			}
		}

		// $log.log(children);
	};

	var updateChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		prepareChecklistToSend();

		var aux = {
			data: {
				type: 'checklists',
				id: idChecklist,
				attributes: {
					name: $scope.checklist.name,
					sections: $scope.checklist.items
				}
			}, idChecklist: idChecklist
		}

		ChecklistActions.update(aux, function(success) {
			if (success.data) {
				$log.log(success);
				$window.alert('Se actualizaron los datos');
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

	$scope.createChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		prepareChecklistToSend();

		var aux = {
			data: {
				type: 'checklists',
				attributes: {
					name: $scope.checklist.name,
					sections: $scope.checklist.items
				}
			}
		}

		ChecklistActions.save(aux, function(success) {
			$log.log(success);
			if (success.data) {
				$log.log(success);
				//$state.go('app.masters.checklist');
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
})

.controller('addItemOptionsModalInstance', function($scope, $log, $uibModalInstance, $window, idItem, itemName, checklistName, ChecklistActions, infoChecklist, Utils) {
	$scope.modal = {
		checklist: []
	};

	$scope.page = {
		title: '',
		buttons: {
			oneMoreItem: {
				disabled: false
			}
		}
	};

	var i = 0,
		j = 0,
		k = 0,
		infoItem = [],
		children = [];

	$scope.getInfoChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		for (i = 0; i < infoChecklist.items.length; i++) {
			if (infoChecklist.items[i].name === itemName) {
				$scope.modal.checklistItems = infoChecklist.items[i].items;
			}
		}
	};

	$scope.getInfoChecklist({
		success: true,
		detail: 'OK'
	});

	$scope.removeItem = function(index) {
		$scope.modal.checklistItems.splice(index, 1);
	};

	$scope.generateItem = function() {

		$scope.modal.checklistItems.push({
			id: null,
			name: ''
		});
	};

	$scope.createChecklistOrAssignItems = function(checklist) {

		for (i = 0; i < infoChecklist.items.length; i++) {
			if (infoChecklist.items[i].name === itemName) {
				infoChecklist.items[i].items = checklist;
			}
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

	var addChecklistOptions = function(idChecklist, e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		var aux = {
			data: {
				type: 'checklists',
				id: idChecklist,
				attributes: {
					name: infoChecklist.name,
					sections: infoChecklist.items
				}
			}, idChecklist: idChecklist
		}

		ChecklistActions.update(aux
		, function(success) {
			if (success.data) 
			{
				$uibModalInstance.close(idChecklist);
			} 
			else 
			{
				$window.alert('Error al asignar las opciones');
				$log.error(success);
			}
		}, function(error) {
			$window.alert('Error al asignar las opciones');
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken(addChecklistOptions);
			}
		});

	};

	var createChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		var aux = {
			data: {
				type: 'checklists',
				attributes: {
					name: infoChecklist.name,
					sections: infoChecklist.items
				}
			}
		}

		ChecklistActions.save(aux, function(success) {
			if (success.data) {
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

	$scope.ok = function() {
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

});