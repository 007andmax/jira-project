'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileContactInfoCtrl',
    ['$scope', 'quicktech.common.services.PhoneFormats', 'UsersService',
      function ($scope, PhoneFormats, UsersService) {

        $scope.maximalAmountOfPhones = 3;
        $scope.phoneNumberPattern = /^\+?[0-9\s\-]{0,19}$/;
        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        $scope.$watch('userProfile.address.phoneNumbers.length', function (count) {
          if (count === 0) {
            $scope.addPhoneNumber();
          }
        });

        $scope.addPhoneNumber = function () {
          $scope.userProfile.address.phoneNumbers.unshift({
            typeNumber: 'MOBILE'
          });
        };

        $scope.removePhoneNumber = function (index, form) {
          $scope.userProfile.address.phoneNumbers.splice(index, 1);
          form.$setDirty();
        };

        $scope.saveContactInfo = function (form) {

          if (form && form.$valid || $scope.phoneNumbersForm.$valid) {
            var copyAddress = angular.copy($scope.userProfile.address),
              phoneNumbers = copyAddress.phoneNumbers,
              firstPhone = phoneNumbers[0].number,
              lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

            if (!lastPhone || lastPhone.trim().length === 0 ||
              (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

              phoneNumbers.splice(phoneNumbers.length - 1, 1);

              if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                phoneNumbers.pop();
              }
            } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers.shift();
            }

            UsersService.saveForUserProfile(copyAddress, 'contact', function () {
              if (form) {
                form.$setPristine();
              } else {
                $scope.phoneNumbersForm.$setPristine();
              }
            });
          }
        }

      }]);

}());
