'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.editCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state', '$rootScope',
      '$timeout', 'quicktech.common.services.PhoneFormats',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state, $rootScope,
                $timeout, PhoneFormats) {

        var curentUsersCompany = CompaniesService.getCurrentCompany($scope.currentUser.company.id);

        $scope.clientCompanies = CompaniesService.getClientCompanies().filter(function (company) {
          return !company.isDefault;
        });

        $scope.getUsersByCompany = UsersService.getAllByCompanyId;

        CompaniesService.getClientCompaniesInfo($scope, function (resp) {
          $scope.clientCompaniesInfo = resp;
          if ($scope.editUser.companyId) {
            var address = resp[$scope.editUser.companyId].addresses[0];
            if (address) {
              $scope.userCompanyCountryCode = address.countryCode;
            }
          }
        });

        if (!$scope.clientCompanies || $scope.clientCompanies.length < 1) {
          alert('Create at list one company before adding users');

          if ($scope.editUser && $scope.editUser.id) {
            $scope.setEditUserId();
          } else {
            $state.go('users');
          }

          return;
        }

        $scope.typePasswordInput = $scope.typeConfPasswordInput = 'password';
        $scope.roles = {
          USER: 'User',
          ADMIN: 'Administrator'
        };

        if (curentUsersCompany.accountType === 'ROOT') {
          $scope.isTechUser = true;
          $scope.roles.SUPER_TECH_ADMIN = 'Super Admin'
        }

        if (!$scope.editUser || !$scope.editUser.id) {
          $scope.isCreation = true;
          $scope.editUser = {
            role: 'USER',
            phoneNumbers: [],
            subscription: {},
            welcomeEmail: true,
            avatar: {
              scale: 50
            }
          };

          $scope.$watch('userCompany', function (userCompany) {
            $scope.editUser.companyId = userCompany ? userCompany.id : undefined;
          });
        } else {
          $scope.isResetPassCollapsed = true;
        }

        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

        $scope.$watch('currentUser.permissions', function (permissions) {
          if (permissions && permissions.indexOf('EDIT_USERS') === -1) {
            $scope.cancelEdit();
          }
        });

        $scope.$watch('editUser.companyId', function (companyId) {
          $scope.userCompany = CompaniesService.getOneById(companyId);
          if ($scope.userCompany && $scope.userCompany.isDefault) {
            $scope.userCompany = '';
          }
          if ($scope.editUser.companyId && $scope.clientCompaniesInfo) {
            $scope.userCompanyCountryCode = $scope.clientCompaniesInfo[$scope.editUser.companyId].addresses[0].countryCode;
          }
        });

        $scope.cancelEdit = function () {
          if ($scope.editUser && $scope.editUser.id) {
            $scope.setEditUserId();
          } else {
            $state.go('users');
          }
        };

        $scope.getUserCompanyName = function () {
          if ($scope.editUser.companyId) {
            var company = CompaniesService.getOneById($scope.editUser.companyId);
            return company.name;
          }
        };

        $scope.save = function (form) {
          if (form.$valid) {

            var editUser = angular.copy($scope.editUser);

            delete editUser.confPassword;

            $scope.savingInProcess = true;

            var phoneNumbers = editUser.phoneNumbers,
              firstPhone = phoneNumbers[0].number,
              lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

            if (!lastPhone || lastPhone.trim().length === 0 ||
              (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

              phoneNumbers.splice(phoneNumbers.length - 1, 1);

              if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                phoneNumbers[0].number = '';
              }
            } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers.shift();
            }

            if (editUser.avatar && !editUser.avatar.id && !editUser.avatar.origin && !editUser.avatar.cropped) {
              editUser.avatar = undefined;
            }

            if (editUser.password) {
              editUser.password = hex_md5(editUser.password);
            }

            UsersService.save(editUser, function (resp) {
              var userId = resp.id;
              $scope.savingInProcess = false;
              $timeout(function () {
                $rootScope.$broadcast('show-after-save-' + userId);
              }, 0);
              $scope.cancelEdit();
            })
          } else {
            $scope.triedToSave = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.validateUserEmail = function (ngModelCtrl) {
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', false, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.changeConfirmPass = function (form) {

          if (!$scope.editUser.password) {
            $scope.isConfirmPassError = false;
            form.$setValidity('password', true);
            return;
          }

          if ($scope.editUser.confPassword !== $scope.editUser.password) {
            $scope.isConfirmPassError = true;
            form.$setValidity('password', false)
          } else {
            $scope.isConfirmPassError = false;
            form.$setValidity('password', true)
          }
        };

        $scope.resetPassword = function () {
          $scope.isResetPassCollapsed = !$scope.isResetPassCollapsed;
          $scope.editUser.password = $scope.editUser.confPassword = '';
        };

        $scope.changeAccountEnabled = function () {
          $scope.isResetPassCollapsed = true;
        };

      }]);

}());
