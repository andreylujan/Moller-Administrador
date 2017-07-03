'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:ChecklistCtrl
 * @description
 * # ChecklistCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('ChecklistCtrl', function($scope, $log, $timeout, $window, $uibModal, $filter, $state, NgTableParams, Checklists, Utils) {

	$scope.page = {
		title: 'Lista de checklist'
	};

	$scope.pagination = {
		pages: {
			current: 1,
			total: 0,
			size: 25
		}
	};

	$scope.filter = {};

	var filterTimeout = null,
	filterTimeoutDuration = 1000,
	checklists = [];

	$scope.sort_direction = 'asc';

	$scope.columns = [];
	$scope.columns.push({title: 'Empresa', field_a:'company', filter: 'filter[construction][company][name]'});
	$scope.columns.push({title: 'Código de checklist', field_a:'code', filter: 'filter[code]'});
	$scope.columns.push({title: 'Obra', field_a:'construction', filter: 'filter[construction][name]'});
	$scope.columns.push({title: 'Usuarios asociados', field_a:'userNames', filter: 'filter[user_names]'});
	$scope.columns.push({title: 'Fecha de creación', field_a:'fechaCreacion', filter: 'filter[formatted_created_at]'});
	$scope.columns.push({title: 'Indicador total', field_a:'indicator', filter: 'filter[total_indicator]'});


	$scope.filter['page[number]'] = $scope.pagination.pages.current;
	$scope.filter['page[size]'] = $scope.pagination.pages.size;

	$scope.filter['filter[construction][name]'] = {};
	$scope.filter['filter[construction][name]'].filter = '';

	$scope.filter['filter[construction][company][name]'] = {};
	$scope.filter['filter[construction][company][name]'].filter = '';

	$scope.filter['filter[code]'] = {};
	$scope.filter['filter[code]'].filter = '';

	$scope.filter['filter[user_names]'] = {};
	$scope.filter['filter[user_names]'].filter = '';

	$scope.filter['filter[formatted_created_at]'] = {};
	$scope.filter['filter[formatted_created_at]'].filter = '';

	$scope.filter['filter[total_indicator]'] = {};
	$scope.filter['filter[total_indicator]'].filter = '';


	$scope.$watch('filter', function(newFilters) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$scope.getChecklists({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pages.current, $scope.filter);

		}, $scope.filter);
	}, true);

	$scope.getChecklists = function(e, page, filters) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		var filtersToSearch = {};
		for (var attr in filters) {
			if (attr.indexOf('filter') !== -1) {
				filtersToSearch[attr] = filters[attr].filter;
			} else {
				filtersToSearch[attr] = filters[attr];
			}
		}

		Checklists.query(filtersToSearch, function(success) {
			$scope.pagination.pages.total = success.meta.page_count;

			for (var i = 0; i < success.data.length; i++) {

				var aux = {};

				aux.id = success.data[i].id;
				aux.pdf = success.data[i].attributes.pdf;
				aux.pdfUploaded = success.data[i].attributes.pdf_uploaded;
				aux.code = success.data[i].attributes.code.toString();
				aux.userNames = success.data[i].attributes.user_names;
				aux.indicator = success.data[i].attributes.total_indicator;
				aux.fechaCreacion = success.data[i].attributes.formatted_created_at;
				aux.company = '-';
				aux.construction = '-';
				
				for (var j = 0; j < success.included.length; j++) {
					if (success.data[i].relationships['construction'].data.type === success.included[j].type &&
						success.data[i].relationships['construction'].data.id === success.included[j].id) 
					{
						aux.construction = success.included[j].attributes.name;

						for (var k = 0; k < success.included.length; k++) {
							if (success.included[j].relationships.company.data.type === success.included[k].type &&
								success.included[j].relationships.company.data.id === success.included[k].id)
							{
								aux.company = success.included[k].attributes.name;
								break;
							}
						}
						break;
					}
				}
				checklists.push(aux);
			}

			$scope.tableParams = new NgTableParams({
				page: 1, // show first page
				count: checklists.length // count per page
			}, {
				counts: [],
				total: checklists.length, // length of test
				dataset: checklists
			});

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getChecklists);
			}
		});

	};
	$scope.downloadPdf = function(event) {
		var pdf = angular.element(event.target).data('pdf');
		if (pdf) {
			$window.open(pdf, '_blank');
		}
	};

	$scope.incrementPage = function() {
		if ($scope.pagination.pages.current <= $scope.pagination.pages.total - 1) {
			$scope.pagination.pages.current++;
			$scope.filter['page[number]'] = $scope.pagination.pages.current;
			$scope.getChecklists({
				success: true
			}, $scope.pagination.pages.current, $scope.filter);
		}
	};

	$scope.decrementPage = function() {
		if ($scope.pagination.pages.current > 1) {
			$scope.pagination.pages.current--;
			$scope.filter['page[number]'] = $scope.pagination.pages.current;
			$scope.getChecklists({
				success: true
			}, $scope.pagination.pages.current, $scope.filter);
		}
	};

	$scope.sortBy = function(field_a) {

		if ($scope.sort_direction === 'asc') 
		{
			var aux = _.sortBy(checklists, function(insp){ return insp[field_a].toLowerCase();});
			$scope.sort_direction = 'desc';
		}
		else
		{
			var aux = _.sortBy(checklists, function(insp){ return insp[field_a].toLowerCase();}).reverse();
			$scope.sort_direction = 'asc';
		}
		$scope.tableParams = new NgTableParams({
			page: 1, // show first page
			count: 25 // count per page
		}, {
			counts: [],
			total: aux.length, // length of test
			dataset: aux
		});
	};

});