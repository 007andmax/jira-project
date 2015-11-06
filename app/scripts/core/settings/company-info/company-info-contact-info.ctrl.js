'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoContactInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService',
      function ($scope, $state, $stateParams, $location, CompaniesService) {

        $scope.maximalAmountOfPhones = 3;
        $scope.phoneNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.phoneNumberTypes = {
          MOBILE: 'Mobile',
          OFFICE: 'Office',
          FAX: 'Fax'
        };

        $scope.addPhoneNumber = function (address) {
          address.phoneNumbers.unshift({
            typeNumber: 'MOBILE'
          });
        };

        $scope.removePhoneNumber = function (address, index) {
          address.phoneNumbers.splice(index, 1);
        };

        $scope.addLocations = function(){
          $scope.companyForSettingPage.addresses.push({
            phoneNumbers: [{ typeNumber: 'MOBILE'}]
          });
        };

        $scope.removeLocation = function (index) {
          if ($scope.companyForSettingPage.addresses[index].isPrimary) {
            $scope.companyForSettingPage.addresses[$scope.editCompany.addresses.length - 1].isPrimary = true;
          }
          $scope.companyForSettingPage.addresses.splice(index, 1);
        };


        $scope.changePrimaryAddress = function (location) {
          angular.forEach($scope.companyForSettingPage.addresses, function (address) {
            address.isPrimary = false;
          });
          location.isPrimary = true;
        };

        $scope.saveContactInfo = function(form){

          $scope.savingContactInProcess = true;
          CompaniesService.saveForCompanyProfile($scope.companyForSettingPage.addresses, 'addresses', function(){
            form.$setPristine();
            $scope.savingContactInProcess = false;
          });
        };

        if($scope.companyForSettingPage.addresses.length === 0){
          $scope.companyForSettingPage.addresses.push({
            isPrimary: true,
            phoneNumbers: [{ typeNumber: 'MOBILE'}]
          });
        }

      }]);

}());
