'use strict';

/**
 * @ngdoc function
 * @name minovateApp.controller:MasterChecklistCtrl
 * @description
 * # MasterChecklistCtrl
 * Controller of the minovateApp
 */
angular.module('efindingAdminApp')

.controller('MasterRolesList', function($scope, $log, $uibModal, $filter, $state, NgTableParams, Roles, Utils) {

	$scope.page = {
		title: 'Roles'
	};

	var roles = [];

	$scope.getRoles = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		roles = [];

		Roles.query({
			idOrganization: Utils.getInStorage('organization')
		}, function(success) {

			if (success.data) {
				for (var i = 0; i < success.data.length; i++) {
					roles.push({
						name: success.data[i].attributes.name,
						id: success.data[i].id
					});
				}
			} else {
				$log.log('error al obtener los roles');
			}

			$scope.tableParams = new NgTableParams({
				page: 1, // show first page
				count: 25, // count per page
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: roles.length, // length of checklists
				dataset: roles
			});

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getChecklists);
			}
		});

	};

	$scope.goToEditRol = function(idRol) {
		$state.go('efinding.roles.editar-rol', {
			idRol: idRol
		});
	};

	$scope.getRoles({
		success: true,
		detail: 'OK'
	});

});