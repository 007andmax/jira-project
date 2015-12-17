'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoContactInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService',
      function ($scope, $state, $stateParams, $location, CompaniesService) {

        $scope.currentAddressIndex = 0;
        $scope.maximalAmountOfPhones = 3;
        $scope.maximalAmountOfAddresses = 3;
        $scope.phoneNumberPattern = /^\+?[0-9\s\-]{0,19}$/;
        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        $scope.addPhoneNumber = function (address) {
          address.phoneNumbers.unshift({
            typeNumber: 'OFFICE'
          });
        };

        $scope.removePhoneNumber = function (address, index, form) {
          address.phoneNumbers.splice(index, 1);
          form.$setDirty();
        };

        $scope.addLocations = function(){
          $scope.companyForSettingPage.addresses.push({
            phoneNumbers: [{ typeNumber: 'OFFICE'}]
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

        $scope.saveContactInfo = function(form){

          var copyAddress = angular.copy($scope.companyForSettingPage.addresses);

          for(var i = 0; i < copyAddress.length; i++){
            if(!copyAddress[i].phoneNumbers[copyAddress[i].phoneNumbers.length - 1].number){
              copyAddress[i].phoneNumbers.splice([copyAddress[i].phoneNumbers.length - 1], 1);
            }
          };

          $scope.savingContactInProcess = true;
          CompaniesService.saveForCompanyProfile(copyAddress, 'addresses', function(){
            form.$setPristine();
            $scope.savingContactInProcess = false;
          });
        };

        if($scope.companyForSettingPage.addresses.length === 0){
          $scope.companyForSettingPage.addresses.push({
            isPrimary: true,
            phoneNumbers: [{ typeNumber: 'OFFICE'}]
          });
        }

      }]);

}());
