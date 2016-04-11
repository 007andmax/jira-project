'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.editCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state', '$rootScope',
      '$timeout',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state, $rootScope, $timeout) {

        var curentUsersCompany = CompaniesService.getCurrentCompany($scope.currentUser.company.id);

        $scope.clientCompanies = CompaniesService.getClientCompanies().filter(function (item) {
          if (item.name !== 'Unassigned') {
            return item;
          }
        });

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

        $scope.$watch('editUser.companyId', function (companyId) {
          $scope.userCompany = CompaniesService.getOneById(companyId);
          if ($scope.userCompany.isDefault) {
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
              lastPhone = phoneNumbers[phoneNumbers.length - 1];

            if (!lastPhone.number || lastPhone.number.trim().length === 0) {
              phoneNumbers.splice(phoneNumbers.length - 1, 1);
            }

            if (editUser.avatar && !editUser.avatar.id && !editUser.avatar.origin && !editUser.avatar.cropped) {
              editUser.avatar = undefined;
            }

            if (editUser.password) {
              editUser.password = hex_md5(editUser.password);
            }

            UsersService.save(editUser, function () {
              $scope.savingInProcess = false;
              $timeout(function () {
                $rootScope.$broadcast('show-after-save-' + editUser.id.toString());
              });
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
          var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', function () {
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
