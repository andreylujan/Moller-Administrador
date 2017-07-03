'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:ReportsListCtrl
 * @description
 * # ReportsListCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')

.controller('ReportsListCtrl', function($scope, $log, $state, $filter, $window, $timeout, $uibModal, NgTableParams, Inspections, Utils) {

	$scope.page = {
		title: 'Lista de inspecciones',
		prevBtn: {
			disabled: true
		},
		nextBtn: {
			disabled: false
		}
	};

	$scope.role_id = Utils.getInStorage('role_id');

	$scope.pagination = {
		pages: {
			current: 1,
			total: 0,
			size: 25
		}
	};

	var data = [],
		activityTypes = [],
		users = [],
		reportsIncluded = [],
		inspecciones = []

	$scope.sort_direction = 'asc';

	var receiverName = null,
		equipmentId = null,
		activityTypeId = null,
		assignedUserId = null,
		state = '',
		i = 0,
		j = 0,
		k = 0,
		filterTimeout = null,
		filterTimeoutDuration = 1000;

	$scope.columns = _.where(Utils.getInStorage('report_columns'), {visible: true});
	$scope.filter = {};
	var included = Utils.getInStorage('menu');

	for (i = 0; i < $scope.columns.length; i++) {

		if ($scope.columns[i].relationshipName) {
			if (!_.contains($scope.columns[i].relationshipName, '.')) {
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'] = {};
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'].filter = '';
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'].field = $scope.columns[i].field;
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'].field_a = $scope.columns[i].field_a;
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'].name = $scope.columns[i].field;
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'].columnName = $scope.columns[i].title;
				$scope.filter['filter[' + $scope.columns[i].relationshipName + ']' + '[' + $scope.columns[i].field + ']'].relationshipName = $scope.columns[i].relationshipName;
			}
			else
			{
				var aux = $scope.columns[i].relationshipName.split('.');
				var texto = 'filter';
				for (var j = 0; j <= aux.length -1; j++) {
					texto = texto + '[' + aux[j] + ']';
				}
				texto = texto + '[' + $scope.columns[i].field + ']';
				$scope.filter[texto] = {};
				$scope.filter[texto].filter = '';
				$scope.filter[texto].field = $scope.columns[i].field;
				$scope.filter[texto].field_a = $scope.columns[i].field_a;
				$scope.filter[texto].name = $scope.columns[i].field;
				$scope.filter[texto].columnName = $scope.columns[i].title;
				$scope.filter[texto].relationshipName = $scope.columns[i].relationshipName;
			}

		} else {
			var res = $scope.columns[i].field.split(".");
			var auxiliar = 'filter';

			for (j = 0; j < res.length; j++) {
				auxiliar = auxiliar+'['+ res[j]+']';
			}
			$scope.filter[auxiliar] = {};
			$scope.filter[auxiliar].filter = '';
			$scope.filter[auxiliar].field = $scope.columns[i].field;
			$scope.filter[auxiliar].field_a = $scope.columns[i].field_a;
			$scope.filter[auxiliar].name = $scope.columns[i].name;
			$scope.filter[auxiliar].columnName = $scope.columns[i].title;
			$scope.filter[auxiliar].relationshipName = $scope.columns[i].relationshipName;
		}
		$scope.filter.include = _.findWhere(_.findWhere(included, { name: 'Inspecciones'}).items, { path: 'efinding.inspecciones.list'}).included;
		$scope.filter['page[number]'] = $scope.pagination.pages.current;
		$scope.filter['page[size]'] = $scope.pagination.pages.size;
	}

	$scope.columns2 = [];
	for (var attr in $scope.filter) {
		if (attr.indexOf('filter') !== -1) {

			$scope.columns2.push({
				visible: true,
				filter: attr,
				field: $scope.filter[attr].field,
				field_a: $scope.filter[attr].field_a,
				name: $scope.filter[attr].name,
				title: $scope.filter[attr].columnName,
				relationshipName: $scope.filter[attr].relationshipName
			});
		}
	}

	$scope.$watch('filter', function(newFilters) {
		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function() {
			$log.log(newFilters);

			$scope.getInspections({
				success: true,
				detail: 'OK'
			}, $scope.pagination.pages.current, $scope.filter);

		}, filterTimeoutDuration);
	}, true);

	$scope.getInspections = function(e, page, filters) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}
		data = [];
		var test = [];
		var filtersToSearch = {};
		for (var attr in filters) {
			if (attr.indexOf('filter') !== -1) {
				filtersToSearch[attr] = filters[attr].filter;
			} else {
				filtersToSearch[attr] = filters[attr];
			}
		}
		Inspections.query(filtersToSearch, function(success) {
			reportsIncluded = success.included;
			$scope.pagination.pages.total = success.meta.page_count;

			//$log.error(success.data);

			for (i = 0; i < success.data.length; i++) {
				test.push({});

				for (var j = 0; j < $scope.columns2.length; j++) {
					test[test.length - 1]['pdf'] 			= success.data[i].attributes.pdf;
					test[test.length - 1]['pdfUploaded'] 	= success.data[i].attributes.pdf_uploaded;
					test[test.length - 1]['state'] = success.data[i].attributes.state;
					test[test.length - 1]['id'] = success.data[i].id;
					//no tiene relacion o es un objeto de consulta directa al dato
					if (success.data[i].attributes[$scope.columns2[j].field]) {
						test[test.length - 1][$scope.columns2[j].field_a] = success.data[i].attributes[$scope.columns2[j].field];
						test[test.length - 1][$scope.columns2[j].name] = success.data[i].attributes[$scope.columns2[j].field];
					} 
					else
					{
						var res = $scope.columns2[j].field.split(".");

						if (res.length === 1)
						{
							if ($scope.columns2[j].relationshipName !== null) 
							{
								var relationships = $scope.columns2[j].relationshipName.split('.');
								//tiene relacion a solo un objeto
								if (relationships.length == 1) 
								{
									for (k = 0; k < success.included.length; k++) {
										if (success.data[i].relationships[$scope.columns2[j].relationshipName].data != null) 
										{
											if (success.data[i].relationships[$scope.columns2[j].relationshipName].data.id === success.included[k].id &&
											success.data[i].relationships[$scope.columns2[j].relationshipName].data.type === success.included[k].type) 
											{
				
												if (success.included[k].attributes[$scope.columns2[j].field] != null) 
												{
													test[test.length - 1][$scope.columns2[j].field_a] = success.included[k].attributes[$scope.columns2[j].field];
												}
												else
												{
													test[test.length - 1][$scope.columns2[j].field_a] = '-';
												}
												break;
											}
										}
										else
										{
											test[test.length - 1][$scope.columns2[j].field_a] = '-';
											break;
										}
									}
								}
								else
								{
									//Es una relacion dentro de otra.
									//se debe encontrar el relationship y buscar dentro de el todos los relationships, 
									//despues de eso se debe volver a buscar en includes para encontrar a los que estan asociados.
									var relacion = success.data[i].relationships[relationships[0]].data;
									var relaciones = {};

									for (k = 0; k < success.included.length; k++) {
										if (relacion.id === success.included[k].id &&
											relacion.type === success.included[k].type) {
											
											relaciones = success.included[k].relationships;
											break;
										}
									}
									if (relationships.length === 2) 
									{
										//Al ser solo una relacion doble, se busca el padre y luego al hijo
										for (k = 0; k < success.included.length; k++) {
											if (relaciones[relationships[1]].data != null) 
											{
												if ( relaciones[relationships[1]].data.id === success.included[k].id &&
												 relaciones[relationships[1]].data.type === success.included[k].type) 
												{
													if (success.included[k].attributes[$scope.columns2[j].field] != null) 
													{
														test[test.length - 1][$scope.columns2[j].field_a] = success.included[k].attributes[$scope.columns2[j].field];
													}
													else
													{
														test[test.length - 1][$scope.columns2[j].field_a] = '-';
													}
													break;
												}
											}
											else
											{
												test[test.length - 1][$scope.columns2[j].field_a] = '-';
											}
										}
									}
									else
									{
										//Al ser una relacion multiple, se busca el padre y todas sus relaciones, luego al hijo y sus relaciones
										//y asi segun el numero de relaciones, luego de encontrar la ultima relacion, 
										//se busca en el include a quien corresponde como el ultimo hijo
										for (k = 1; k < relationships.length-1; k++) {
											for (var l = 0; l < success.included.length; l++) {
												if ( relaciones[relationships[k]].data.id === success.included[l].id &&
												 relaciones[relationships[k]].data.type === success.included[l].type) 
												{
													relaciones = success.included[l].relationships;
													break;
												}
											}
										}
										for (k = 0; k < success.included.length; k++) {
											if ( relaciones[relationships[relationships.length-1]].data.id === success.included[k].id &&
											 relaciones[relationships[relationships.length-1]].data.type === success.included[k].type) 
											{
												if (success.included[k].attributes[$scope.columns2[j].field] != null) 
												{
													test[test.length - 1][$scope.columns2[j].field_a] = success.included[k].attributes[$scope.columns2[j].field];
												}
												else
												{
													test[test.length - 1][$scope.columns2[j].field_a] = '-';
												}
												break;
											}
										}
									}
								}
							}
							else
							{
								test[test.length - 1][$scope.columns2[j].name] = '-';
							}

						}
						else if (res.length > 2) 
						{
							//apunta a un dynamic attribute
							var aux = res;
							var flag = success.data[i].attributes.dynamic_attributes;

							//valida que existe el objeto dentro de los dynamic_attributes
							if (flag.hasOwnProperty(aux[1])) 
							{
								//Valida que exista el objeto text
								if (flag[aux[1]].hasOwnProperty('text')) 
								{
									//$log.error('2')
									//$log.error(flag[aux[1]]);
									test[test.length - 1][$scope.columns2[j].field_a] = flag[aux[1]].text;
									test[test.length - 1][$scope.columns2[j].name] = flag[aux[1]].text;
								}
								else
								{
									test[test.length - 1][$scope.columns2[j].field_a] = '-';
									test[test.length - 1][$scope.columns2[j].name] = '-';
								}
							}
							else
							{
								test[test.length - 1][$scope.columns2[j].field_a] = '-';
								test[test.length - 1][$scope.columns2[j].name] = '-';
							}
						}
						else
						{
							test[test.length - 1][$scope.columns2[j].field_a] = '';
							test[test.length - 1][$scope.columns2[j].name] = '';
						}
					}
				}
			}
			inspecciones = test;

			$scope.tableParams = new NgTableParams({
				page: 1, // show first page
				count: inspecciones.length // count per page
			}, {
				counts: [],
				total: inspecciones.length, // length of test
				dataset: inspecciones
			});

		}, function(error) {
			$log.error(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.getReports);
			}
		});
	};


	$scope.downloadPdf = function(event) {
		var pdf = angular.element(event.target).data('pdf');
		if (pdf) {
			$window.open(pdf, '_blank');
		}
	};

	$scope.openModalDownloadPdfs = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modalDownloadPdfs.html',
			controller: 'DownloadPdfsModalInstance',
			resolve: {}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	$scope.openModalDownloadPdfsByMonth = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: false,
			templateUrl: 'modalDownloadPdfsByMonth.html',
			controller: 'DownloadPdfsByMonthModalInstance',
			resolve: {}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	$scope.sortBy = function(field_a) {
		if ($scope.sort_direction === 'asc') 
		{
			var aux = _.sortBy(inspecciones, function(insp){ return insp[field_a].toLowerCase();});
			$scope.sort_direction = 'desc';
		}
		else
		{
			var aux = _.sortBy(inspecciones, function(insp){ return insp[field_a].toLowerCase();}).reverse();
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

	$scope.incrementPage = function() {
		if ($scope.pagination.pages.current <= $scope.pagination.pages.total - 1) {
			$scope.pagination.pages.current++;
			$scope.filter['page[number]'] = $scope.pagination.pages.current;
			$scope.getInspections({
				success: true
			}, $scope.pagination.pages.current, $scope.filter);
		}
	};

	$scope.decrementPage = function() {
		if ($scope.pagination.pages.current > 1) {
			$scope.pagination.pages.current--;
			$scope.filter['page[number]'] = $scope.pagination.pages.current;
			$scope.getInspections({
				success: true
			}, $scope.pagination.pages.current, $scope.filter);
		}
	};

	$scope.FirmaInspeccionInstance = function(idInspection) {

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'firmarInspeccion.html',
			controller: 'FirmaInspeccionInstance',
			resolve: {
				idInspection: function() {
					return idInspection;
				}
			}
		});

		modalInstance.result.then(function(datos) {
			if (datos.action === 'removeUser') {
				for (var i = 0; i < data.length; i++) {
					if (data[i].id === datos.idUser) {
						data.splice(i, 1);
					}
				}
			}
			if (datos.action === 'firma') {
				$scope.getInspections({
					success: true,
					detail: 'OK'
				}, $scope.pagination.pages.current, $scope.filter);
			}
			$scope.tableParams.reload();
		}, function() {});
	};

	$scope.openModalDownloadPdfsByMonth = function() {
		var modalInstance = $uibModal.open({
			animation: true,
			backdrop: false,
			templateUrl: 'modalDownloadPdfsByMonth.html',
			controller: 'DownloadPdfsByMonthModalInstance',
			resolve: {}
		});

		modalInstance.result.then(function() {}, function() {});
	};

	$scope.openModalRemoveInspection = function(idInspection) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'removeModal.html',
			controller: 'RemoveModalInstance',
			resolve: {
				idInspection: function() {
					return idInspection;
				}
			}
		});

		modalInstance.result.then(function() {
			/*$scope.getInspections({
				success: true,
				detail: 'OK'
			});*/
			$state.reload();
		}, function() {
			// getPromotions();
		});
	};

})

.controller('RemoveModalInstance', function($scope, $filter, $log, $uibModalInstance, idInspection, Utils, Inspections, InspectionsRemove) {

	$scope.modal = {
		inspection: {
			title: ''
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	var getInfoInspection = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		Inspections.query({
			idInspection: idInspection
		}, function(success) {
			$log.error(success);
			if (success.data) {
				//$scope.modal.inspection.title = success.data.attributes.title;
			} else {
				$log.error('no se pudo obtener el titulo');
				$log.error(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getInfoInspection);
			}
		});
	};

	$scope.removeInspection = function(e) {
		if (!e.success) {
			$log.error(e.detail);
			return;
		}

		InspectionsRemove.delete({
			idInspection: idInspection
		}, function(success) {
			if (!success.errors) {
				$uibModalInstance.close();
			} else {
				$log.log('no se puso borrar');
				$log.log(success);
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken($scope.InspectionsRemove);
			}
		});
	};

	getInfoInspection({
		success: true,
		detail: 'OK'
	});

})

.controller('DownloadPdfsByMonthModalInstance', function($scope, $log, $timeout, $moment, $uibModalInstance, Utils, InspectionsByMonth) {
	$scope.modal = {
		alert: {
			color: null,
			show: null,
			title: null,
			text: null
		},
		month: {
			date: new Date()
		},
		datepicker: {
			opened: false
		},
		buttons: {
			download: {
				disabled: false,
				text: ''
			}
		}
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.removeMessage = function() {
		$scope.modal.alert.show = false;
	};

	$scope.openDatePicker = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.modal.datepicker.opened = !$scope.modal.datepicker.opened;
	};

	$scope.downloadReports = function() {
		var month = $scope.modal.month.date.getMonth() + 1;
		var year = $scope.modal.month.date.getFullYear();

		$scope.modal.buttons.download.disabled = true;
		$scope.modal.buttons.download.text = 'Descargando...';

		InspectionsByMonth.getFile('#downloadReportsByMonth', 'reportes_' + month + '_' + year, month, year);

		$timeout(function() {
			$scope.modal.buttons.download.disabled = false;
			$scope.modal.buttons.download.text = '';
		}, 3500);
	};

})

.controller('FirmaInspeccionInstance', function($scope, $log, $uibModalInstance, Firmar, idInspection, Inspections, Validators, Utils) {

	$scope.inspection = {
		id: null,
		empresa: {
			text: ''
		},
		obra: {
			text: ''
		},
		creador: {
			text: ''
		},
		fecha_creacion: {
			text: ''
		},
		fecha_resolucion: {
			text: ''
		},
		id: {
			id: ''
		}
		,
		pdf: ''
	};
	$scope.elements = {
		buttons: {
			firmar: {
				text: 'Firmar',
				border: 'btn-border',
				disabled: true
			},
			ver: {
				text: 'Ver Inspección',
				border: 'btn-border',
				disabled: true
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

	$scope.ok = function() {
		$uibModalInstance.close();
	};

	$scope.validaFirma = function(check) 
	{
		if ($scope.elements.buttons.firmar.disabled == true) 
		{
			$scope.elements.buttons.firmar.disabled = false
		}
		else
		{
			$scope.elements.buttons.firmar.disabled = true
		}
	};

	$scope.getInspectionDetail = function(idInspection) {
		Inspections.detail({
			idInspection: idInspection
		}, function(success) {
			if (success.data) {
				var datos = _.groupBy(success.included, function(objeto){ return objeto.type; });
				$scope.inspection.empresa.text = datos.companies[0].attributes.name;
				$scope.inspection.obra.text = datos.constructions[0].attributes.name;
				$scope.inspection.creador.text = datos.users[0].attributes.full_name;
				$scope.inspection.fecha_creacion.text = success.data.attributes.formatted_created_at;
				$scope.inspection.id.id = success.data.id;
				$scope.inspection.pdf = success.data.attributes.pdf;

			} else {
				$log.error(success);
			}
		}, function(error) {
			$log.error(error);
			if (error.status == 401) 
			{
				Utils.refreshToken(getInspectionDetail);
			}
		});

	};

	$scope.getInspectionDetail(idInspection);

	$scope.firmar = function(idInspection) {
		if ($scope.elements.buttons.firmar.disabled === false) {
			Firmar.save({
				idInspection: idInspection
			}, function(success) {
				if (success.data) {
					$scope.elements.alert.title = 'Se ha firmado el documento';
					$scope.elements.alert.text = '';
					$scope.elements.alert.color = 'success';
					$scope.elements.alert.show = true;
					$uibModalInstance.close({
						action: 'firma',
						success: success
					});

				} else {
					$log.log(success);
				}
			}, function(error) {
				$log.error(error);
				if (error.status == 401) 
				{
					Utils.refreshToken(firmar);
				}
			 	$scope.elements.alert.color = 'danger';
			 	Utils.gotoAnyPartOfPage('pageHeader');
			 	$scope.elements.alert.title = 'Error al firmar el documento: ';
			 	$scope.elements.alert.text = error.statusText;
			 	$scope.elements.alert.show = true;
			});
		}
	};

	$scope.hideAlert = function() {
		$scope.elements.alert.show = false;
		$scope.elements.alert.title = '';
		$scope.elements.alert.text = '';
		$scope.elements.alert.color = '';
	};

});