'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'CompaniesService', 'AddressesService', 'EmailSettingsService', 'ConstantsService', '$rootScope', 'UsersService', 'quicktech.common.services.PhoneFormats',
      function ($scope, $state, $stateParams, $location, CompaniesService, AddressesService, EmailSettingsService, ConstantsService, $rootScope, UsersService, PhoneFormats) {

        var weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
          defaultWorkingDay = {
            dayOfWeek: 'MONDAY',
            startTime: 28800,
            endTime: 61200,
            isSelected: false
          };

        $scope.currentCompany = CompaniesService.getCurrentCompany();
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

        $scope.$watch(function() {
          return $rootScope.techCompanyChanged;
        }, function(val) {

          // console.log($rootScope.updatedInCurrentWindow, "UPDATED HEREEEEEEEE")
          if (val && !$rootScope.updatedInCurrentWindow) {
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

            CompaniesService.reloadCurrentCompany(function(resp) {
              $scope.currentCompany = resp;
              $scope.editCompany = Object.assign({}, resp);
            })


          } else if ($rootScope.updatedInCurrentWindow) {
            $rootScope.updatedInCurrentWindow = false;
          }
        })

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


        $scope.updateTechCompany = function(form) {
          $scope.savingInProcess = true;
          $scope.saveRequests = 2;


          $rootScope.updateTech = form;

          $scope.saveContactInfo(form);
          $scope.saveBasicInfo(form);
        }

        $scope.saveContactInfo = function (form) {

          var address = $scope.companyForSettingPage.addresses[0];
          if (form.$valid && address.timeZone && address.locale === address.timeZone.name) {
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

            CompaniesService.saveForCompanyProfile(copyAddress, 'addresses', function () {
              if (form) {
                form.$setPristine();
                $scope.saveRequests--;

                if (!$scope.saveRequests) {
                  $scope.savingInProcess = false;
                  $rootScope.closeEditModal = true;
                }
              } else {
                $scope.addressesWrapForm.$setPristine();
              }
            });
          }
        };

        $scope.saveBasicInfo = function (form) {

          if (form.$valid) {
            var basicInfo = {
              logo: $scope.editCompany.logo,
              name: $scope.editCompany.name,
              description: $scope.editCompany.description
            };

            CompaniesService.saveForCompanyProfile(basicInfo, 'basic', function () {
              form.$setPristine();

              $scope.saveRequests--;

              if (!$scope.saveRequests) {
                $scope.savingInProcess = false;
                $rootScope.closeEditModal = true;
              }
            });
          }
        };

        $scope.validateCompanyName = function (ngModelCtrl, modelId, afterValidationCallback) {

          if ($scope.currentUser.accountType === "ROOT") {
            ngModelCtrl.$setValidity('unique', true);
            return
          }

          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

      }]);

}());
