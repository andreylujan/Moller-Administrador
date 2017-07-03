'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:Validators
 * @description
 * # Validators
 * Controller of the efindingAdminApp
 */

angular.module('efindingAdminApp')

.service('Validators', function($log, Utils) {

	var valid = false;

	this.comparePasswords = function(pass1, pass2) {
		valid = false;

		if (pass1 === pass2) {
			valid = true;
		}

		return valid;
	};

	this.validateRequiredField = function(field) {
		valid = false;
		if (field) {
			valid = true;
		}

		return valid;
	};

	this.validateStringLength = function(field, length) {
		valid = false;

		if ((typeof(field) === 'string') && (typeof(length) === 'number')) {
			if (field.length >= length) {
				valid = true;
			}
		}

		return valid;
	};

	this.validateRutCheckDigit = function(rut) {

		if (!rut) {
			return false;
		}

		if (rut.indexOf('.') !== -1 || rut.indexOf('-') !== -1 || rut.indexOf(',') !== -1) {
			rut = Utils.replaceAll(rut, ',', '');
			rut = Utils.replaceAll(rut, '.', '');
			rut = Utils.replaceAll(rut, '-', '');
		}

		var RUT = rut.substring(0, rut.length - 1);
		var elRut = RUT.split('');
		var factor = 2;
		var suma = 0;
		var dv;
		for (var i = (elRut.length - 1); i >= 0; i--) {
			factor = factor > 7 ? 2 : factor;
			suma += parseInt(elRut[i]) * parseInt(factor++);
		}
		dv = 11 - (suma % 11);
		if (dv === 11) {
			dv = 0;
		} else if (dv === 10) {
			dv = "k";
		}

		/* jshint ignore:start */
		if (dv == rut.substring(rut.length, rut.length - 1).toLowerCase()) {
			// alert("El rut es válido!!");
			return true;
		} else {
			// alert("El rut es incorrecto");
			return false;
		}
		/* jshint ignore:end */
		
	};

});