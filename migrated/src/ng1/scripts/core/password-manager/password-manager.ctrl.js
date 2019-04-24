'use strict';

(function () {

  angular.module('quicktech.core.passwordManager').controller('quicktech.core.passwordManager.passwordManagerCtrl',
    [
      '$scope', 'PasswordManagerService', 'CompaniesService', 'UsersService', 'DevicesService', '$rootScope',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService',
      function ($scope, PasswordManagerService, CompaniesService, UsersService, DevicesService, $rootScope,
                UserConfirmationsService, UserNotificationService, SharedStateService, PermissionsService) {
        var headerSharedState = SharedStateService.getSharedState('passwordsHeader');

        $scope.passwords = [];
        $scope.companyProfilePasswords = [];
        $scope.orderPasswords = {
          field: 'company',
          reverse: false
        };

        // PasswordManagerService.getRecords(function (resp) {
        //   $scope.passwords = angular.copy(resp);
        //   if($scope.company && $scope.company.id) {
        //     $scope.companyProfilePasswords = $scope.passwords.filter(function(pass) {
        //       return pass.companyId === $scope.company.id
        //     })
        //   }
        // });
        DevicesService.getGadgets(function (resp) {
          $scope.gadgets = resp;
        });

        $scope.PermissionsService = PermissionsService;
        $scope.getCompanyById = CompaniesService.getOneById;
        $scope.getUserById = UsersService.getOneById;
        $scope.getDeviceById = DevicesService.getOneById;
        $scope.parseDate = Date.parse.bind(Date);

        $scope.deletePassword = function (password) {
          if (PermissionsService.isAllowed('DELETE_PASSWORD')) {
            var message = 'Are you sure you want to delete this password?';
            UserConfirmationsService.show(message, 'Yes').then(function () {
              PasswordManagerService.deletePassword(password.id, function () {
                UserNotificationService.show('Password was deleted successfully.', true);
              })
            });
          }
        };

        $scope.getLinkName = function (link, companyId) {
          if (!link) {
            return '';
          }

          if (link.userId) {
            var user = UsersService.getOneById(link.userId);
            if (user) {
              return $scope.getUserName(user);
            }
          } else if (link.deviceId) {
            var device = DevicesService.getOneByDeviceId(link.deviceId, companyId);
            if (device) {
              return getDeviceName(device);
            }
          } else if (link.gadgetId) {
            var gadgets = $scope.gadgets;
            if (gadgets) {
              for (var i = 0; i < gadgets.length; i++) {
                var gadget = gadgets[i];
                if (gadget.id === link.gadgetId) {
                  return gadget.name;
                }
              }
            } else {
              return '';
            }
          }
        };

        $scope.isPasswordExpired = function (password) {
          var expiredDate = new Date(password.expiredDate);
          if (expiredDate.getTime()) {
            return Date.now() >= expiredDate.getTime();
          }
        };

        $scope.userReadable = function (text) {
          if (!text) {
            return '';
          }

          var words = text.split('_'),
            result = '';

          for (var i = 0, len = words.length; i < len; i++) {
            var word = words[i];
            result += word[0].toUpperCase() + word.slice(1).toLowerCase();

            if (i !== len - 1) {
              result += ' ';
            }
          }

          return result;
        };

        $scope.filterPasswords = function (value) {
          var filter = headerSharedState.filter;
          var result = true;

          if (filter.companyId) {
            result = result && filter.companyId === value.companyId;
          }

          if (filter.deviceId) {
            var isDeviceFound = false;
            for (var i = 0; i < value.links.length; i++) {
              var link = value.links[i];
              if (link.deviceId === filter.deviceId) {
                isDeviceFound = true;
                break;
              }
            }
            result = result && isDeviceFound;
          }

          if (filter.userId) {
            var isUserFound = false;
            for (var i = 0; i < value.links.length; i++) {
              var link = value.links[i];
              if (link.userId === filter.userId) {
                isUserFound = true;
                break;
              }
            }
            result = result && isUserFound;
          }

          if (filter.template) {
            result = result && filter.template === value.template;
          }

          if (filter.expiredDate) {
            result = result && formatDate(filter.expiredDate) === formatDate(new Date(value.expiredDate));
          }

          var keys = Object.keys(filter);
          var isFilter = false;
          for (var i = 0; i < keys.length; i++) {
            if (filter[keys[i]]) {
              isFilter = true;
              break;
            }
          }

          if (!isFilter && !$scope.companyProfilePasswords.length) {
            return false;
          }

          return result;
        };

        $scope.setOrderForPasswords = function (option) {
          if (option === $scope.orderPasswords.field) {
            $scope.orderPasswords.reverse = !$scope.orderPasswords.reverse;
          } else {
            $scope.orderPasswords.field = option;
            $scope.orderPasswords.reverse = false;
          }
        };

        $scope.orderByForPasswords = function (item) {
          if ($scope.orderPasswords.field === 'company') {
            return CompaniesService.getOneById(item.companyId).name;
          } else if ($scope.orderPasswords.field === 'type') {
            return $scope.userReadable(item.template);
          } else if ($scope.orderPasswords.field === 'description') {
            return item.description;
          } else if ($scope.orderPasswords.field === 'link') {
            return $scope.getLinkName(item.links[0]);
          }
        };

        $scope.$on('$destroy', function () {
          headerSharedState.filter = {};
          $rootScope.$broadcast('clearLeftPanelDateRange');
        });

        function getDeviceName(device) {
          return device.hostName || device.ip || device.ipAddress;
        }

        function formatDate(date) {
          return date ? date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() : null;
        }

      }
    ]);

}());
