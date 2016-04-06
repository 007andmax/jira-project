'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.techUsersCtrl',
    ['$scope', 'UsersService', 'CompaniesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, CompaniesService, UserConfirmationsService) {

        $scope.users = UsersService.getTechUsers();
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.roles = {
          USER: 'User',
          ADMIN: 'Administrator'
        };

        $scope.openEditUser = function (user) {
          if (user === 'new_user') {
            $scope.editUser = {role: "USER"};
            $scope.editUserId = 'new_user';
          } else if (user) {
            $scope.editUserId = user.id;
            $scope.editUser = user.staticCopy();
          } else {
            $scope.editUserId = '';
            $scope.editUser = null;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.validateUserEmail = function (ngModelCtrl) {
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.save = function (form) {
          if (form.$valid) {
            $scope.savingInProcess = true;

            $scope.editUser.companyId = CompaniesService.getCurrentCompany().id;
            $scope.editUser.subscription = {};

            UsersService.save($scope.editUser, function () {
              $scope.savingInProcess = false;
              $scope.openEditUser();
              form.$setPristine();
            })
          }
        };

        $scope.archiveUser = function (user) {
          var confirmMesage = 'Do you want to archive ' + user.firstName + ' ' + user.lastName + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            UsersService.deleteOrArchiveUser(user.id, false);
          });
        }

      }]);

}());
