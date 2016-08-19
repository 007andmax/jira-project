'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.editUserCtrl',
    ['$scope', 'UsersService', 'CompaniesService', 'quicktech.common.services.PhoneFormats', '$rootScope',
      function ($scope, UsersService, CompaniesService, PhoneFormats, $rootScope) {
        var userSubscription = $scope.editedUser.subscription,
          action = $scope.editedUser.newUser ? 'CREATE_USERS' : 'EDIT_USERS',
          companyId = $scope.editedUser.company.id;

        CompaniesService.getCompanyData($scope, companyId, function (resp) {
          $scope.companyAddress = resp.addresses[0];
        });
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.phoneNumberPattern = /^[\+\d\(\)\-\s]+$/;
        $scope.isPrefixValid = PhoneFormats.isPrefixValid;
        $scope.roles = {
          USER: 'User',
          ADMIN: 'Administrator'
        };
        $scope.isLastInvoiceSubsciption = userSubscription.invoice && UsersService.getAllByCompanyId(companyId).filter(function (user) {
            return user.subscription.invoice;
          }).length <= 1;

        $scope.$watch('currentUser.permissions', function (permissions) {
          if (permissions && !$scope.PermissionsService.isAllowed(action)) {
            $scope.cancelEditing();
          }
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSave || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.validateUserEmail = function (ngModelCtrl) {
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editedUser.id || '', false, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.cancelEditing = function () {
          $scope.setEditedUser({});
        };

        $scope.saveUser = function (form) {
          if (form.$valid) {

            var editedUser = angular.copy($scope.editedUser);

            $scope.savingInProcess = true;

            var phoneNumbers = editedUser.phoneNumbers,
              firstPhone = phoneNumbers[0].number;

            phoneNumbers[0].typeNumber = phoneNumbers[0].typeNumber || 'OFFICE';

            if (firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers[0].number = '';
            }

            if (!phoneNumbers[0].number) {
              editedUser.phoneNumbers.shift();
            }

            editedUser.companyId = editedUser.company.id;

            UsersService.save(editedUser, function (resp) {
              $scope.savingInProcess = false;
              $scope.cancelEditing();
              $rootScope.$broadcast('show-user-on-save-' + resp.id);
            })
          } else {
            $scope.triedToSave = true;
          }
        };

      }]);

}());
