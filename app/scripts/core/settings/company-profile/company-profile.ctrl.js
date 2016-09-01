'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService', 'AddressesService', 'EmailSettingsService', 'ConstantsService',
      function ($scope, $state, $stateParams, $location, CompaniesService, AddressesService, EmailSettingsService, ConstantsService) {

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.emailNamePattern = /^[a-z0-9]+$/i;
        $scope.currentCompany = CompaniesService.getCurrentCompany();
        $scope.editCompany = $scope.currentCompany.staticCopy();
        $scope.timeRangeAllDays = {};
        $scope.currentAddressIndex = 0;
        AddressesService.getLocales(true, function (response) {
          $scope.timeZones = response;
        });
        $scope.currentUrl = ConstantsService.getConstant('website.dns');
        $scope.isAddressFocused = $stateParams.isAddressFocused || $scope.currentCompany.status === 'SIGN_UP';
        $scope.isAddressRequired = true;

        $scope.companyForSettingPage = CompaniesService.getCompanyForSettingPage(function () {

          $scope.companyForSettingPage = $scope.companyForSettingPage.staticCopy();

          for (var i = 0; i < $scope.companyForSettingPage.addresses.length; i++) {
            if ($scope.companyForSettingPage.addresses[i].phoneNumbers.length === 0) {
              $scope.companyForSettingPage.addresses[i].phoneNumbers.push({ typeNumber: 'OFFICE' });
            }
          }

          $scope.timeRangeAllDays = angular.copy($scope.companyForSettingPage.timeRange);

          $scope.companyForSettingLoad = true;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

        $scope.saveBusinessDaysHours = function (form) {
          $scope.savingDaysHoursInProcess = true;
          CompaniesService.saveForCompanyProfile($scope.timeRangeAllDays, 'time', function (a) {
            form.$setPristine();
            $scope.savingDaysHoursInProcess = false;
          })
        };

      }]);

}());
