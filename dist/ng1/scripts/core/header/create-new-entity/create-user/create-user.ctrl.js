'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createUserCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', '$state', '$rootScope',
      '$timeout', 'quicktech.common.services.PhoneFormats',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, $state, $rootScope,
                $timeout, PhoneFormats) {

        var currentUsersCompany = CompaniesService.getCurrentCompany($scope.currentUser.company.id),
          action;

        $scope.namePattern = /^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,255}$/;

        var savedState = $scope.getLastSavedState('user');
        var origin = savedState.item;
        if (savedState.type === 'user' && origin) {
          $scope.editUser = angular.copy(origin);

          if ($scope.editUser.phoneNumbers.length == 0) {
            $scope.editUser.phoneNumbers.push({
              typeNumber: 'OFFICE'
            });
          }

          $scope.editUserOrigin = angular.copy($scope.editUser);
          $timeout(function () {
            if ($scope.editUser.company && !$scope.editUser.company.isDefault) {
              var companyId = $scope.editUser.company.id;
              $scope.userCompany = CompaniesService.getOneById(companyId);
            }
          });
        }

        // $scope.$watch('editUser', function(val) {
       
        // }, true)

        $scope.allUsers = UsersService.getAllUsers();

        $scope.allTitles = $scope.allUsers
          .map(function(user) {
            return user.designation;
          })
          .reduce(function(acc, title) {
            var index = acc.findIndex(function(el) {
              return (el || '').toLowerCase() === (title || '').toLowerCase();
            })

            if (index === -1 && title) {
              acc.push(title);
            }

            return acc;
          }, []);

        $scope.showError = function() {
          $scope.isErrorShown = true;
        }

        $scope.saveTitle = function() {
          $scope.isErrorShown = false;
        }





        if ($scope.resolvedCompanyId) {
          $timeout(function () {
            var company = CompaniesService.getOneById($scope.resolvedCompanyId);
            if (company && !company.isDefault) {
              $scope.userCompany = company;
            }
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
          USER: 'Standard user',
          ADMIN: 'Manager'
        };

        if (currentUsersCompany.accountType === 'ROOT') {
          $scope.isTechUser = true;
          $scope.roles.SUPER_TECH_ADMIN = 'Super Admin'
        }

        if (!$scope.editUser || !$scope.editUser.id) {
          $scope.isCreation = true;
          $scope.editUser = $scope.editUser || {
            role: 'USER',
            phoneNumbers: [{
              typeNumber: 'OFFICE'
            }],
            subscription: { ticket: true },
            welcomeEmail: true,
            avatar: {
              scale: 50
            }
          };

          if ($scope.editUser.phoneNumbers.length == 0)
            $scope.editUser.phoneNumbers.push({
              typeNumber: 'OFFICE'
            });

          $scope.editUserOrigin = angular.copy($scope.editUser);

          action = 'CREATE_USERS';
        } else {
          $scope.isResetPassCollapsed = true;
          action = 'EDIT_USERS';
        }

        CompaniesService.getClientCompaniesInfo($scope, function (resp) {
          $scope.clientCompaniesInfo = resp;
          if ($scope.userCompany && $scope.userCompany.id) {
            var address = resp[$scope.userCompany.id].addresses[0];
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

        $scope.$watch('userCompany.id', function (companyId) {
          if ($scope.userCompany && $scope.userCompany.isDefault) {
            $scope.userCompany = '';
          }

          if (companyId && $scope.clientCompaniesInfo &&
            $scope.clientCompaniesInfo[companyId] &&
            $scope.clientCompaniesInfo[companyId].addresses &&
            $scope.clientCompaniesInfo[companyId].addresses.length
          ) {
            $scope.userCompanyCountryCode = $scope.clientCompaniesInfo[companyId].addresses[0].countryCode;
          }
        });

        $scope.save = function (form) {
          $scope.isSaveFailed = false;
          if (form.$valid) {

            var editUser = angular.copy($scope.editUser);

            delete editUser.confPassword;

            $scope.savingInProcess = true;

            if ($scope.userCompany) {
              editUser.companyId = $scope.userCompany.id;
            }

            var phoneNumbers = editUser.phoneNumbers,
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

            if (editUser.avatar && !editUser.avatar.id && !editUser.avatar.origin && !editUser.avatar.cropped) {
              editUser.avatar = undefined;
            }

            if (editUser.password) {
              editUser.password = hex_md5(editUser.password);
            }

            UsersService.save(editUser, function (resp) {
              $scope.savingInProcess = false;
              if (!resp.code || resp.code === 200) {
                var userId = resp.id;
                $scope.disablePreventingLocationChange = true;

                $timeout(function () {
                  $rootScope.$broadcast('newUserHasBeenCreated', resp.id);
                  if (!$scope.savedState.items.length) {
                    $scope.closeWindow();
                  }
                  $rootScope.$broadcast('show-after-save-' + userId);
                });
              } else {
                $scope.isSaveFailed = true;
              }
            });
            unsubscribeClosingEvent();
          } else {
            $scope.triedToSave = true;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return $scope.triedToSave && form[fieldName] && (($scope.editUser && $scope.editUser.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.validateUserEmail = function (ngModelCtrl, modelId, afterValidationCallback) {
          if ($scope.userCompany && $scope.userCompany.id) {
            var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editUser.id || '', false, $scope.userCompany.id, function () {
              ngModelCtrl.$setValidity('unique', validationResult.value);
              afterValidationCallback();
            });
          }

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
          if ($scope.userCompany && $scope.userCompany.id) {
            $scope.editUser.company = { id: $scope.userCompany.id };
          }
          $scope.savedState.items.unshift($scope.editUser);
          $scope.setOpenedTab(type);
        });

        var unsubscribeClosingEvent = $scope.$on('createNewWindowClosing', createNewWindowClosing);

        function createNewWindowClosing() {
          var user = $scope.editUser;
          var isUserChanged = false;

          if (origin) {
            var originCompany = origin.company && CompaniesService.getOneById(origin.company.id);
            isUserChanged = user.firstName !== origin.firstName
              || user.lastName !== origin.lastName
              || !angular.equals($scope.userCompany, originCompany)
              || user.primaryEmail !== origin.primaryEmail
              || user.designation !== origin.designation
              || !angular.equals($scope.editUser.avatar.cropped, origin.avatar.cropped);
          } else {
            isUserChanged = user.firstName || user.lastName || $scope.userCompany || user.primaryEmail ||
              user.designation || $scope.editUser.avatar.cropped;
          }

          if (isUserChanged) {
            $scope.savedState.types.unshift('user');
            $scope.savedState.items.unshift($scope.editUser);
          }
        }

      }]);

}());
