'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService', 'AddressesService', 'EmailSettingsService', 'ConstantsService', '$timeout',
      function ($scope, $state, $stateParams, $location, CompaniesService, AddressesService, EmailSettingsService, ConstantsService, $timeout) {

        $scope.saveMethods = [];
        $scope.formNames = ['basicInfoForm', 'addressesWrapForm', 'invoiceAndTicketForm'];

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.emailNamePattern = /^[a-z0-9]+$/i;
        $scope.currentCompany = CompaniesService.getCurrentCompany();
        $scope.editCompany = $scope.currentCompany.staticCopy();
        $scope.timeRangeAllDays = {};
        $scope.currentAddressIndex = 0;
        AddressesService.getLocales(true, function (response) {
          $scope.timeZones = response;
        });
        $scope.currentHost = ConstantsService.getConstant('mandrill.domain.suffix');
        $scope.currentHostInbox = ConstantsService.getConstant('mandrill.inbox') + '.' + $scope.currentHost;

        $scope.emailNotifications = EmailSettingsService.getCompanyEmailNotification(function () {
          $scope.emailNotifications = $scope.emailNotifications.staticCopy();
        });

        $scope.companyForSettingPage = CompaniesService.getCompanyForSettingPage(function () {

          $scope.companyForSettingPage = $scope.companyForSettingPage.staticCopy();

          for (var i = 0; i < $scope.companyForSettingPage.addresses.length; i++) {
            if ($scope.companyForSettingPage.addresses[i].phoneNumbers.length === 0) {
              $scope.companyForSettingPage.addresses[i].phoneNumbers.push({typeNumber: 'OFFICE'});
            }
          }

          $scope.timeRangeAllDays = angular.copy($scope.companyForSettingPage.timeRange);

          $scope.companyForSettingLoad = true;
        });

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && (form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.saveBusinessDaysHours = function (form) {
          $scope.savingDaysHoursInProcess = true;
          CompaniesService.saveForCompanyProfile($scope.timeRangeAllDays, 'time', function (a) {
            form.$setPristine();
            $scope.savingDaysHoursInProcess = false;
          })
        };

        $scope.saveNotificationDaysHours = function (form) {
          CompaniesService.saveForCompanyProfile($scope.emailNotifications, 'email', function () {
            form.$setPristine();
          })
        };

        $scope.saveCompanyInfo = function () {

          $scope.isTryToSave = true;

          for (var index in $scope.formNames) {
            var form = $scope.companyInfoForm[$scope.formNames[index]];
            if (form.$invalid) {
              form.addressForm && form.addressForm.address && form.addressForm.address.$setDirty();
              form.companyTimezone && form.companyTimezone.$setDirty();
              $timeout(function () {
                $scope.$broadcast('scrollToErrorFild');
              }, 50);
              return;
            }
          }

          $scope.savingCompanyInfo = true;

          var settings = {},
            callbacks = [],
            formNames = [];

          $scope.saveMethods.forEach(function (func) {
            var obj = func(),
              key;

            if (obj) {
              key = Object.keys(obj)[0];
              if (obj.callback) {
                callbacks.push(obj.callback);
                formNames.push(obj.formName);
              }
              settings[key] = obj[key];
            }
          });

          CompaniesService.saveCompanySettingsDto(settings, function (resp) {
            for (var index in callbacks) {
              callbacks[index]($scope.companyInfoForm[formNames[index]], resp);
            }
            $scope.savingCompanyInfo = false;
            if($scope.currentCompany.status === "SIGN_UP"){
              var startPage = $scope.getUserDefaultPage();
              startPage.split("/");
              $state.go('tickets', {listType: startPage[1] || 'unassigned'});
            }
          });
        };

      }]);

}());
