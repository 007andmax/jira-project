'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileContactInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService',
      function ($scope, $state, $stateParams, $location, UsersService) {

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

        $scope.saveMethods.push(function (form) {

          //$scope.savingInProcess = true;

          var copyAddress = angular.copy($scope.userProfile.address),
            phoneNumbers = copyAddress.phoneNumbers;

          if (!phoneNumbers[phoneNumbers.length - 1].number || phoneNumbers[phoneNumbers.length - 1].number < 3) {
            phoneNumbers.splice((phoneNumbers.length - 1), 1)
          }

          return {
            contact: copyAddress,
            callback: function (form) {
              form.$setPristine();
            },
            formName: 'phoneNumbersForm'
          };

          //UsersService.saveForUserProfile(copyAddress, 'contact', function () {
          //  $scope.savingInProcess = false;
          //  form.$setPristine();
          //});
        });

      }]);

}());
