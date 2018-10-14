'use strict';

/**
 * @ngdoc function
 * @name efindingAdminApp.controller:UsersPasswordsCtrl
 * @description
 * # UsersPasswordsCtrl
 * Controller of the efindingAdminApp
 */
angular.module('efindingAdminApp')
.controller('UsersPasswordsCtrl', function($log, $scope, Utils, Users, ManagePasswords, NgTableParams) {

	$scope.page = {
		title: 'Administrar Contraseñas',
    msg: {
			color: '',
			text: '',
			show: false
		}
	};

  var data = [];

	$scope.getUsers = function() {

		data = [];

		Users.query({
			idUser: ''
		}, function(success) {
			if (success.data) {
				data = [];
        let id;
				for (var i = 0; i < success.data.length; i++) {
          id = success.data[i].id;
          if(id == "") { continue; }
					data.push({
						id: id,
						firstName: success.data[i].attributes.first_name || '',
						lastName: success.data[i].attributes.last_name || '',
						email: success.data[i].attributes.email,
            password: ""
					});
				}

				$scope.tableParams = new NgTableParams({
					page: 1, // show first page
					count: 50, // count per page
					sorting: {
						firstName: 'asc' // initial sorting
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
			if (error.status === 401) {
				Utils.refreshToken($scope.getUsers);
			}
		});

	};

	$scope.getUsers();

	$scope.changePassword = function(user) {
    $scope.page.msg.show = false;

    if(!user.password || user.password.length < 8){
      $scope.page.msg.color = 'danger';
      $scope.page.msg.text = "El password debe contener al menos 8 caracteres";
      $scope.page.msg.show = true;
      return;
    }

    ManagePasswords.update({
      password: user.password,
      passwordConfirmation: user.password,
      userId: user.id
    }, function(success) {
      $scope.page.msg.color = 'green';
			$scope.page.msg.text = `La contraseña para ${user.firstName} ha sido modificada`;
			$scope.page.msg.show = true;

    }, function(error) {
      $log.error(error);
      $scope.page.msg.color = 'danger';
			$scope.page.msg.text = error.data.errors[0].detail;
			$scope.page.msg.show = true;
    });
	};

});
