'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService', 'AddressesService', 'EmailSettingsService', 'ConstantsService',
      function ($scope, $state, $stateParams, $location, CompaniesService, AddressesService, EmailSettingsService, ConstantsService) {

        var weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
          defaultWorkingDay = {
            dayOfWeek: 'MONDAY',
            startTime: 28800,
            endTime: 61200,
            isSelected: false
          };

        $scope.currentCompany = CompaniesService.getCurrentCompany();

        $scope.companyPaymentInfo = CompaniesService.getCompanyPaymentInfo();

        $scope.editCompany = $scope.currentCompany.staticCopy();
        $scope.currentAddressIndex = 0;
        AddressesService.getLocales(true, function (response) {
          $scope.timeZones = response;
        });
        $scope.currentUrl = ConstantsService.getConstant('website.dns', function (resp) {
          $scope.currentUrl = resp;
        });
        $scope.isAddressFocused = $stateParams.isAddressFocused;
        $scope.isAddressRequired = true;

        if ($stateParams.fromWelcomeWizard) {
          $scope.isTryToSave = true;
          $scope.isFromWelcomeWizard = $stateParams.fromWelcomeWizard;
        }

        $scope.changeCompanyPaymentInfo = function() {
          CompaniesService.saveCompanyPaymentInfo($scope.companyPaymentInfo, function(resp) {
            console.log(resp);
          })
        };

        $scope.companyForSettingPage = CompaniesService.getCompanyForSettingPage(function () {

          $scope.companyForSettingPage = $scope.companyForSettingPage.staticCopy();

          for (var i = 0; i < $scope.companyForSettingPage.addresses.length; i++) {
            if ($scope.companyForSettingPage.addresses[i].phoneNumbers.length === 0) {
              $scope.companyForSettingPage.addresses[i].phoneNumbers.push({ typeNumber: 'OFFICE' });
            }
          }

          $scope.outliersTime = Math.round($scope.companyForSettingPage.responseTimeSettings.outliersSeconds / 3600);

          var workingDays = $scope.companyForSettingPage.responseTimeSettings.workingDays;
          for (var i = 0; i < weekDays.length; i++) {
            var day = workingDays[i],
              name = weekDays[i];

            if (!day || day.dayOfWeek !== name) {
              defaultWorkingDay.dayOfWeek = name;
              workingDays.splice(i, 0, angular.copy(defaultWorkingDay));
            } else {
              day.isSelected = true;
            }
          }

          $scope.companyForSettingLoad = true;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

      }]);

}());
