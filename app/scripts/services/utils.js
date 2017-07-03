'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:Utils
 * @description
 * # Utils
 * Controller of the efindingAdminApp
 */

angular.module('efindingAdminApp')

.service('Utils', function($state, $log, $auth, $location, $anchorScroll, localStorageService, RefreshToken) {

	this.setInStorage = function(key, val) {
		return localStorageService.set(key, val);
	};

	this.getInStorage = function(key) {
		return localStorageService.get(key);
	};

	this.removeInStorage = function(key) {
		return localStorageService.remove(key);
	};

	this.clearAllStorage = function() {
		return localStorageService.clearAll();
	};
	this.getStorageType = function() {
		return localStorageService.getStorageType();
	};

	this.gotoPage = function(page) {
		$state.go(page);
	};

	// El flag debe ser el id del algún tag
	this.gotoAnyPartOfPage = function(flag) {
		$location.hash(flag);
		$anchorScroll();
	};

	this.escapeRegExp = function(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	};

	this.replaceAll = function(str, find, replace) {
		return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
	};

	this.refreshToken = function(functionToCall) {

		if (!_.isFunction(functionToCall)) {
			var detail = 'Parametro ' + functionToCall + ' no es función';
			$log.log(detail);
			return;
		}

		var that = this.setInStorage;
		var that2 = this.getInStorage;

		RefreshToken.save({
			refresh_token: that2('refresh_t'),
			grant_type: 'refresh_token'
		}, function(success) {

			$auth.setToken(success.data.attributes.access_token);
			that('refresh_t', success.data.attributes.refresh_token);

			functionToCall({
				success: true,
				detail: success
			});

		}, function(error) {

			functionToCall({
				success: false,
				detail: error
			});
			$log.error(error);
			// $state.go('core.login');
		});
	};

	this.formatRut = function(rut) {

		if (rut.indexOf('.') !== -1 || rut.indexOf('-') !== -1 || rut.indexOf(',') !== -1) {
			rut = this.replaceAll(rut, ',', '');
			rut = this.replaceAll(rut, '.', '');
			rut = this.replaceAll(rut, '-', '');
		}

		var sRut1 = rut; //contador de para saber cuando insertar el . o la -
		var nPos = 0; //Guarda el rut invertido con los puntos y el guión agregado
		var sInvertido = ""; //Guarda el resultado final del rut como debe ser
		var sRut = "";

		for (var i = sRut1.length - 1; i >= 0; i--) {
			sInvertido += sRut1.charAt(i);

			if (i === sRut1.length - 1) {
				sInvertido += "-";
			} else if (nPos === 3) {
				sInvertido += ".";
				nPos = 0;
			}
			nPos++;
		}

		for (var j = sInvertido.length - 1; j >= 0; j--) {
			if (sInvertido.charAt(sInvertido.length - 1) !== ".") {
				sRut += sInvertido.charAt(j);
			} else if (j !== sInvertido.length - 1) {
				sRut += sInvertido.charAt(j);
			}
		}
		//Pasamos al campo el valor formateado
		rut = sRut.toUpperCase();
		return rut;
	};

	this.setChartConfig = function(type, height, plotOptions, yAxisData, xAxisData, series) {
		// if (!type) {
		// 	type = 'column';
		// }
		if (!height) {
			height = 250;
		}
		return {
			options: {
				title: {
					text: null
				},
				navigation: {
					buttonOptions: {
						enabled: false
					}
				},
				colors: ['#F69022', '#119848', '#EF3200'],
				tooltip: {
					style: {
						padding: 10,
						fontWeight: 'bold'
					}
				},
				chart: {
					type: type,
					height: height
				},
				plotOptions: plotOptions,
				credits: {
					enabled: false
				}
			},
			yAxis: yAxisData,
			xAxis: xAxisData,
			series: series
		};
	};

	this.setChartConfigPublicDashboard = function(type, height, width, plotOptions, yAxisData, xAxisData, series) {
		// if (!type) {
		// 	type = 'column';
		// }
		if (!height) {
			height = 250;
		}
		if (!width) {
			width = 250;
		}
		return {
			options: {
				title: {
					text: null
				},
				navigation: {
					buttonOptions: {
						enabled: false
					}
				},
				colors: ['#F69022', '#119848', '#EF3200'],
				tooltip: {
					style: {
						padding: 10,
						fontWeight: 'bold'
					}
				},
				chart: {
					type: type,
					height: height,
					width: width
				},
				plotOptions: plotOptions,
				credits: {
					enabled: false
				}
			},
			yAxis: yAxisData,
			xAxis: xAxisData,
			series: series
		};
	};
});