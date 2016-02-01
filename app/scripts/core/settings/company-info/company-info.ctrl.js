'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService', 'AddressesService', 'EmailSettingsService', 'ConstantsService',
      function ($scope, $state, $stateParams, $location, CompaniesService, AddressesService, EmailSettingsService, ConstantsService) {

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.currentCompany = CompaniesService.getCurrentCompany();
        $scope.editCompany = $scope.currentCompany.staticCopy();
        $scope.timeRangeAllDays = {};
        $scope.currentAddressIndex = 0;
        $scope.timezones = AddressesService.getAllLocales();
        $scope.currentHost = ConstantsService.getConstant('rest.server.address');

        $scope.emailNotifications = EmailSettingsService.getCompanyEmailNotification(function(){
          $scope.emailNotifications = $scope.emailNotifications.staticCopy();
        });

        $scope.companyForSettingPage = CompaniesService.getCompanyForSettingPage(function () {

          $scope.companyForSettingPage = $scope.companyForSettingPage.staticCopy();

          for(var i = 0; i < $scope.companyForSettingPage.addresses.length; i++){
            if($scope.companyForSettingPage.addresses[i].phoneNumbers.length === 0){
              $scope.companyForSettingPage.addresses[i].phoneNumbers.push({typeNumber: 'OFFICE'});
            }
          }

          $scope.timeRangeAllDays = angular.copy($scope.companyForSettingPage.timeRange);

          $scope.companyForSettingLoad = true;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && (form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.saveBusinessDaysHours = function(form){
          $scope.savingDaysHoursInProcess = true;
          CompaniesService.saveForCompanyProfile($scope.timeRangeAllDays, 'time', function(a){
            form.$setPristine();
            $scope.savingDaysHoursInProcess = false;
          })
        };

        $scope.saveNotificationDaysHours = function(form){
          CompaniesService.saveForCompanyProfile($scope.emailNotifications, 'email', function (){
            form.$setPristine();
          })
        };

      }]);

}());
