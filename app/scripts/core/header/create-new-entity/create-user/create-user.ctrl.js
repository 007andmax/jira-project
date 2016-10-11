'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createUserCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state', '$rootScope',
      '$timeout', 'quicktech.common.services.PhoneFormats',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state, $rootScope,
                $timeout, PhoneFormats) {

        var curentUsersCompany = CompaniesService.getCurrentCompany($scope.currentUser.company.id),
          action;

        var savedState = $scope.getLastSavedState('user');
        if (savedState.type === 'user' && savedState.item) {
          $scope.editUser = angular.copy(savedState.item);
          $timeout(function () {
            if ($scope.editUser.company) {
              $scope.editUser.companyId = $scope.editUser.company.id;
            }
          });
        }

        if ($scope.resolvedCompanyId) {
          $timeout(function () {
            $scope.editUser.companyId = $scope.resolvedCompanyId;
          });
        }

        $scope.clientCompanies = CompaniesService.getClientCompanies();

        $scope.getUsersByCompany = UsersService.getAllByCompanyId;

        if (!$scope.clientCompanies || $scope.clientCompanies.length < 1) {
          alert('Create at list one company before adding users');
          $scope.openedTab = 'company';
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
          $scope.editUser = $scope.editUser || {
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

          action = 'CREATE_USERS';
        } else {
          $scope.isResetPassCollapsed = true;
          action = 'EDIT_USERS';
        }

        CompaniesService.getClientCompaniesInfo($scope, function (resp) {
          $scope.clientCompaniesInfo = resp;
          if ($scope.editUser.companyId) {
            var address = resp[$scope.editUser.companyId].addresses[0];
            if (address) {
              $scope.userCompanyCountryCode = address.countryCode;
            }
          }
        });

        $scope.$watch('currentUser.permissions', function (permissions) {
          if (permissions && !$scope.PermissionsService.isAllowed(action)) {
            $scope.closeWindow();
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

        $scope.getUserCompanyName = function () {
          if ($scope.editUser.companyId) {
            var company = CompaniesService.getOneById($scope.editUser.companyId);
            return company.isDefault ? '' : company.name;
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
              $scope.disablePreventingLocationChange = true;

              $timeout(function () {
                $rootScope.$broadcast('newUserHasBeenCreated', resp.id);
                if (!$scope.savedState.items.length) {
                  $scope.closeWindow();
                }
                $rootScope.$broadcast('show-after-save-' + userId);
              });
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

        $scope.isLastUserWithInvoiceSubscription = function (targetUser) {
          var users = UsersService.getAllByCompanyId(targetUser.company.id);

          for (var id in users) {
            var user = users[id];
            if (user.id === targetUser.id) {
              continue;
            }

            if (user.subscription.invoice) {
              return false;
            }
          }
          return true;
        };

        $scope.$on('createNewEntity', function (event, type) {
          $scope.savedState.types.unshift('user');
          $scope.editUser.company = { id: $scope.editUser.companyId };
          $scope.savedState.items.unshift($scope.editUser);
          $scope.setOpenedTab(type);
        });

      }]);

}());
