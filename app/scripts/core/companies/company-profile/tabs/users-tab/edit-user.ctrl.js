'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.editUserCtrl',
    ['$scope', 'UsersService', 'CompaniesService', 'quicktech.common.services.PhoneFormats', '$rootScope',
      function ($scope, UsersService, CompaniesService, PhoneFormats, $rootScope) {
        var userSubscription = $scope.editedUser.subscription;

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.phoneNumberPattern = /^[\+\d\(\)\-\s]+$/;
        $scope.isPrefixValid = PhoneFormats.isPrefixValid;
        $scope.roles = {
          USER: 'User',
          ADMIN: 'Administrator'
        };
        $scope.isLastInvoiceSubsciption = userSubscription.invoice && $scope.users.filter(function (user) {
            return user.subscription.invoice;
          }).length <= 1;

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
              firstPhone = phoneNumbers[0].number,
              lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

            phoneNumbers[0].phoneType = phoneNumbers[0].phoneType || 'Office';

            if (firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers[0].number = '';
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
