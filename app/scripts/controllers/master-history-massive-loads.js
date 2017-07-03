'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:HistoryMassiveLoadsCtrl
 * @description
 * # HistoryMassiveLoadsCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('HistoryMassiveLoadsCtrl', function($scope, $log, $uibModal, NgTableParams, MassiveLoads) {

	$scope.page = {
		title: 'Historial de cargas masivas'
	};

	var data = [],
		dataIncluded = [],
		i = 0,
		j = 0;

	$scope.getMassiveLoads = function() {
		data = [];
		dataIncluded = [];

		MassiveLoads.query({
			include: 'user'
		}, function(success) {

			if (success.data) {

				for (i = 0; i < success.data.length; i++) {
					data.push({
						createdAt: success.data[i].attributes.created_at,
						uploadedResourceType: success.data[i].attributes.uploaded_resource_type,
						user_id: parseInt(success.data[i].relationships.user.data.id),
						user_name: '',
						uploadedFileUrl: success.data[i].attributes.uploaded_file_url,
						resultFileUrl: success.data[i].attributes.result_file_url
					});
				}

				for (i = 0; i < data.length; i++) {
					for (j = 0; j < success.included.length; j++) {
						if (success.included[j].type === 'users') {
							if (data[i].user_id === parseInt(success.included[j].id)) {
								data[i].user_name = success.included[j].attributes.full_name;
							}
						}
					}
				}

				$scope.tableParams = new NgTableParams({
					page: 1,
					count: data.length,
					sorting: {
						'createdAt': 'desc'
					}
				}, {
					counts: [],
					total: data.length,
					dataset: data
				});
			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status) {
				Utils.refreshToken($scope.getMassiveLoads);
			}
		});
	};

	$scope.getMassiveLoads();

});