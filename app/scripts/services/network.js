'use strict';

var API_URL = 'https://efinding.moller.cl/api/v1';		//Producción
var URL_SERVER = 'https://efinding.moller.cl/';		//Producción
// var API_URL = 'https://efinding.moller.cl/efinding-staging/api/v1';		//Desarrollo
// var URL_SERVER = 'https://efinding.moller.cl/efinding-staging/';		//Desarrollo
//var API_URL = 'http://192.168.0.2:3000/api/v1';						//Local
//var URL_SERVER = 'http://192.168.0.2:3000/';							//Local

angular.module('efindingAdminApp')

// LOGIN
.factory('Login', function($resource) {

	return $resource(API_URL + '/index.php/:action', {
		action: '@action'
	}, {
		refresh: {
			method: 'POST',
			'Content-Type': 'application/json'
		}
	});

})

// REFRESH
.factory('RefreshToken', function($resource) {

	return $resource(URL_SERVER + 'oauth/token', {}, {
		save: {
			method: 'POST',
			'Content-Type': 'application/json'
		}
	});

})

// REPORTES
.factory('Reports', function($resource) {

	return $resource(API_URL + '/reports', {
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				fieldsUsers: '@fieldsUsers',
				fieldsReports: '@fieldsReports',
				fieldsEquipments: '@fieldsEquipments',
				all: 'true'
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// REPORTES
.factory('ReportsMine', function($resource) {

	return $resource(API_URL + '/reports/mine', {
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				fieldsUsers: '@fieldsUsers',
				fieldsReports: '@fieldsReports',
				fieldsEquipments: '@fieldsEquipments',
				all: 'true'
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// REPORTES
.factory('ReportsTask', function($resource) {

	return $resource(API_URL + '/reports/tasks', {
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				fieldsUsers: '@fieldsUsers',
				fieldsReports: '@fieldsReports',
				fieldsEquipments: '@fieldsEquipments',
				all: 'true'
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// REPORTES
.factory('ReportsManflas', function($resource) {

	return $resource(API_URL + '/reports?:filtro', {
		filtro: '@filtro',
		include: '@include',
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

.factory('InspectionsByMonth', function($auth) {
	return {
		getFile: function(elem, fileName, month, year) {
			var downloadLink = angular.element(elem);
			downloadLink.attr('href', API_URL + '/inspections.xlsx?access_token=' + $auth.getToken() + '&month=' + month + '&year=' + year);
			downloadLink.attr('download', fileName + '.xlsx');
		}
	};
})

// INSPECCIONES
.factory('Inspections', function($resource) {

	return $resource(API_URL + '/inspections/:idInspection', {
		idInspection: '@idInspection'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				fieldsUsers: '@fieldsUsers',
				fieldsReports: '@fieldsReports',
				fieldsEquipments: '@fieldsEquipments'
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		detail: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: 'construction.company,creator',
			}
		}
	});

})

// INSPECCIONES REMOVE
.factory('InspectionsRemove', function($resource) {

	return $resource(API_URL + '/inspections/:idInspection', {
		idInspection: '@idInspection'
	}, {
		delete: {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// ROLES
.factory('Roles', function($resource) {

	return $resource(API_URL + '/organizations/:idOrganization/roles', {
		idOrganization: '@idOrganization'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// Invitaciones
.factory('Invitations', function($resource) {

	return $resource(API_URL + '/invitations', {}, {
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}

	});

})

// InviteLink
.factory('InviteLink', function($resource, $state) {

	return $resource(API_URL + '/invitations/:id', {
		id: '@id'
	}, {
		update: {
			method: 'PUT',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
			params: {
				confirmation_token: '@confirmation_token'
			}
		}

	});

})

//Firmar
.factory('Firmar', function($resource) {

	return $resource(API_URL + '/inspections/:idInspection/transition?transition_name=sign', {
		idInspection: '@idInspection'
	}, {
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});
})

// TableColumns
.factory('TableColumns', function($resource) {

	return $resource(API_URL + '/table_columns?filter[collection_name]=:type', {
		type: '@type'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// Cuarteles
.factory('Cuarteles', function($resource) {

	return $resource(API_URL + '/manflas/stations?fields[stations]=id,name,variety,num_reports,coordinates', {
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// USERS
.factory('Users', function($resource) {

	return $resource(API_URL + '/users/:idUser', {
		idUser: '@idUser'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: '@fields'
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		},
		sendEmailWithToken: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		verifyPassToken: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				email: '@email',
				reset_password_token: '@reset_password_token'
			}
		}
	});

})

// CHANGE PASSWORD
.factory('ChangePassword', function($resource) {
	return $resource(API_URL + '/users/:idUser/password', {
		idUser: '@idUser'
	}, {
		save: {
			method: 'PUT',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
			params: {
				password: '@password',
				password_confirmation: '@password_confirmation',
				reset_password_token: '@reset_password_token'
			}
		}
	});
})


// Comapnies
.factory('Companies', function($resource) {

	return $resource(API_URL + '/companies/:idCompany', {
		idCompany: '@idCompany'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: '@include'
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
		}
	});
})

/// Constructions
.factory('Constructions', function($resource) {

	return $resource(API_URL + '/constructions/:constructionId', {
		constructionId: '@constructionId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				'filter[company_id]': '@constructionId',
				'fields[constructions': 'name,company_id,administrator,expert,construction_personnel,code'
			}
		},
		detail: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// Personnel
.factory('Personnel', function($resource) {

	return $resource(API_URL + '/personnel/:idPersonnel', {
		idPersonnel: '@idPersonnel'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				'include': 'personnel_types,constructions',
				'fields[constructions]': 'name,code'
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			},
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

.factory('UserContruction', function($resource) {

	return $resource(API_URL + '/userconstruction/:idContruction', {
		idContruction: '@idContruction'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: '@fields'
		}
	});

})

// Type Personnel
.factory('PersonnelTypes', function($resource) {

	return $resource(API_URL + '/personnel_types/', {
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

/// DASHBOARD
.factory('Dashboard', function($resource) {

	return $resource(API_URL + '/dashboard', {
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include',
				fieldsReports: '@fieldsReports',
			}
		}
	});

})

/// COLLECTIONS
.factory('Collection', function($resource) {

	return $resource(API_URL + '/collections/:idCollection', {
		idCollection: '@idCollection'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: 'collection_items',
				'fields[collection_items]': 'parent_item_id,collection_id,name'
			}
		},
		detail: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: 'parent_item',
			}
		}
	});

})


//COLLECTION ITEM
.factory('Collection_Item', function($resource) {

	return $resource(API_URL + '/collection_items/:idCollection', {
		idCollection: '@idCollection'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: 'parent_item,resource_owner'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json',
				'include': 'collection_items'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				Accept: 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// Checklists
.factory('Checklists', function($resource) {

	return $resource(API_URL + '/checklist_reports', {
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: 'construction.company,creator,users',
				'fields[users]': 'full_name',
				'fields[constructions]': 'name,company',
				'fields[companies]': 'name',
				'fields[checklist_reports]': 'formatted_created_at,pdf,pdf_uploaded,code,user_names,total_indicator,users,construction,creator'

			}
		}
	});

})

// ChecklistActions
.factory('ChecklistActions', function($resource) {

	return $resource(API_URL + '/checklists/:idChecklist', {
		idChecklist: '@idChecklist'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				'fields[checklists]': 'name,formatted_created_at'
			}
		},
		detail: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
	});

})

// MassiveLoads
.factory('MassiveLoads', function($resource) {

	return $resource(API_URL + '/batch_uploads', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		}
	});

})

// menu_sections
.factory('MenuSections', function($resource) {

	return $resource(API_URL + '/menu_sections', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		}
	});

})

.factory('ExcelCollection', function($auth) {
	return {
		getFile: function(elem, idCollection, fileName) {
			var downloadLink = angular.element(elem);
			downloadLink.attr('href', API_URL + '/collections/' + idCollection + '.csv?access_token=' + $auth.getToken());
			downloadLink.attr('download', fileName + '.csv');
		}
	};

})

.factory('ExcelConstruction', function($auth) {
	return {
		getFile: function(elem, fileName) {
			var downloadLink = angular.element(elem);
			downloadLink.attr('href', API_URL + '/constructions/construction_personnel.csv?access_token=' + $auth.getToken());
			downloadLink.attr('download', fileName + '.csv');
		}
	};

})


// CSV
.service('Csv', function($resource, $http, $log) {
	var fd = new FormData();
	return {
		upload: function(form) {

			for (var i = 0; i < form.length; i++) {
				fd.append(form[i].field, form[i].value);
			}

			return $http.put(API_URL + '/collections/' + form[0].id + '.csv', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			});
		}
	};

})

// CSV
.service('CsvContructions', function($resource, $http, $log) {
	var fd = new FormData();
	return {
		upload: function(form) {

			for (var i = 0; i < form.length; i++) {
				fd.append(form[i].field, form[i].value);
			}

			return $http.post(API_URL + '/constructions/construction_personnel.csv', fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			});
		}
	};

});