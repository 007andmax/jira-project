'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.editUserCtrl',
    ['$scope', 'UsersService', 'CompaniesService', 'quicktech.common.services.PhoneFormats',
      function ($scope, UsersService, CompaniesService, PhoneFormats) {

      CompaniesService.getCompanyInfo($scope.editedUser.company.id, $scope, function (resp) {
        $scope.userCompanyCountryCode = resp.addresses[0].countryCode;
      });

      $scope.isShowingErrors = function (form, fieldName) {
        return form[fieldName] && (($scope.editedUser && $scope.editedUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
      };

      $scope.validateUserEmail = function (ngModelCtrl) {
        var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editedUser.id || '', function () {
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

          if (!lastPhone || lastPhone.trim().length === 0 ||
            (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

            phoneNumbers.splice(phoneNumbers.length - 1, 1);

            if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers[0].number = '';
            }
          } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
            phoneNumbers.shift();
          }

          editedUser.companyId = editedUser.company.id;

          UsersService.save(editedUser, function (resp) {
            $scope.savingInProcess = false;
            $scope.cancelEditing();
          })
        } else {
          $scope.triedToSave = true;
        }
      };

    }]);

}());
