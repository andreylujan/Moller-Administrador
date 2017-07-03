'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:ChecklistCtrl
 * @description
 * # ChecklistCtrl
 * Controller of the minovateApp
 */
angular.module('efindingAdminApp')

.controller('MasterChecklistCtrl', function($scope, $log, $uibModal, $filter, $state, NgTableParams, ChecklistActions, Utils) {

	$scope.page = {
		title: 'Checklists'
	};

	var checklists = [];

	$scope.getChecklists = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		checklists = [];

		ChecklistActions.query({
		}, function(success) {
			for (var i = 0; i < success.data.length; i++) {
				checklists.push({
					id: success.data[i].id,
					name: success.data[i].attributes.name
				});
			}

			$scope.tableParams = new NgTableParams({
				page: 1, // show first page
				count: 25, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: checklists.length, // length of checklists
				dataset: checklists
			});

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getChecklists);
			}
		});

	};

	$scope.openModalDeleteChecklist = function(idChecklist) {

		// var idChecklist = idChecklist;

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'messageListChecklist.html',
			controller: 'MessageListChecklistModalInstance',
			resolve: {
				idChecklist: function() {
					return idChecklist;
				}
			}
		});

		modalInstance.result.then(function() {
			$scope.getChecklists({
				success: true,
				detail: 'OK'
			});
		}, function() {});
	};

	$scope.gotoNewChecklist = function(idChecklist) {
		$state.go('efinding.obras.new-checklist', {
			idChecklist: idChecklist
		});
	};

	$scope.getChecklists({
		success: true,
		detail: 'OK'
	});

})

.controller('MessageListChecklistModalInstance', function($scope, $log, $uibModalInstance, idChecklist, ChecklistActions, Validators, Utils) {

	$scope.modal = {
		title: {
			text: null
		},
		subtitle: {
			text: null
		},
		alert: {
			color: '',
			show: false,
			title: '',
			text: null
		},
		buttons: {
			delete: {
				border: false,
				show: true,
				text: 'Eliminar'
			}
		}
	};

	$scope.deleteChecklist = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		ChecklistActions.delete({
			idChecklist: idChecklist
		}, function(success) {
			$log.log(success);
			$uibModalInstance.close();
		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.deleteChecklist);
			}
		});

	};

	$scope.ok = function() {
		// $uibModalInstance.close($scope.selected.item);
		$uibModalInstance.close();
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.removeAlert = function() {
		$scope.modal.alert.color = '';
		$scope.modal.alert.title = '';
		$scope.modal.alert.text = '';
		$scope.modal.alert.show = false;
	};

});