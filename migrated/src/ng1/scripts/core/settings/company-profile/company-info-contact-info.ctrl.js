'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoContactInfoCtrl',
    ['$scope', 'quicktech.common.services.PhoneFormats', 'CompaniesService', 'UsersService', '$rootScope',
      function ($scope, PhoneFormats, CompaniesService, UsersService, $rootScope) {

        $scope.currentAddressIndex = 0;
        $scope.maximalAmountOfPhones = 3;
        $scope.maximalAmountOfAddresses = 3;
        $scope.phoneNumberPattern = /^\+?[0-9\s\-]{0,19}$/;
        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        if ($scope.companyForSettingPage.addresses.length === 0) {
          $scope.companyForSettingPage.addresses.push({
            isPrimary: true,
            phoneNumbers: [{ typeNumber: 'OFFICE' }]
          });
        }

        $scope.addPhoneNumber = function (address) {
          address.phoneNumbers.unshift({
            typeNumber: 'OFFICE'
          });
        };

        $scope.removePhoneNumber = function (address, index, form) {
          address.phoneNumbers.splice(index, 1);
          form.$setDirty();
        };

        $scope.addLocations = function () {
          $scope.companyForSettingPage.addresses.push({
            phoneNumbers: [{ typeNumber: 'OFFICE' }]
          });
        };

        $scope.removeLocation = function (index, form) {
          if ($scope.companyForSettingPage.addresses[index].isPrimary) {
            $scope.companyForSettingPage.addresses[$scope.companyForSettingPage.addresses.length - 1].isPrimary = true;
          }
          $scope.companyForSettingPage.addresses.splice(index, 1);
          form.$setDirty();
        };


        $scope.changePrimaryAddress = function (location) {
          angular.forEach($scope.companyForSettingPage.addresses, function (address) {
            address.isPrimary = false;
          });
          location.isPrimary = true;
        };

        $scope.$watch(function() {
          return $rootScope.updateTech;
        }, function(val) {
          if (val) {
            $scope.saveContactInfo(val);
          }
        })

        $scope.saveContactInfo = function (form) {

          var address = $scope.companyForSettingPage.addresses[0];
          if ($scope.addressesWrapForm.$valid && address.address && address.timeZone && address.locale === address.timeZone.name) {
            var copyAddress = angular.copy($scope.companyForSettingPage.addresses);

            for (var i = 0; i < copyAddress.length; i++) {
              var phoneNumbers = copyAddress[i].phoneNumbers,
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
            }

            copyAddress[0].isPrimary = true;

            if (copyAddress[0].phoneNumbers && copyAddress[0].phoneNumbers[0] && copyAddress[0].phoneNumbers[0].number) {
              UsersService.updateWelcomeWizard('companyProfile');
            }

            
            $rootScope.updatedInCurrentWindow = true;
            CompaniesService.saveForCompanyProfile(copyAddress, 'addresses', function () {
              if (form) {
                form.$setPristine();
              } else {
                $scope.addressesWrapForm.$setPristine();
              }


            });
          }
        };

      }]);

}());
