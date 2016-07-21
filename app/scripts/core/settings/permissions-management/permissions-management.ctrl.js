'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.permissionsManagement',
    ['$scope', 'CompaniesService', '$timeout', function ($scope, CompaniesService, $timeout) {
      var promise;

      $scope.sections = {
        'Tickets Area': ['DELETE_TICKETS', 'REOPEN_CLOSED_TICKETS'],
        'Company Area': ['VIEW_COMPANIES', 'CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES', 'VIEW_USERS', 'CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'],
        'Accounting': ['VIEW_ACCOUNTING', 'CREATE_INVOICE', 'VOID_INVOICE', 'MANAGE_PRODUCTS', 'MANAGE_SERVICES'],
        'Devices': ['NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'VIEW_PASSWORDS', 'MODIFY_SETTINGS'],
        'Quick Support': ['ALLOW_QUICK_CONNECT']
      };

      CompaniesService.getPermissions(function (resp) {
        $scope.roles = resp.sort(function (role1, role2) {
          return role1.name < role2.name;
        });
      });

      $scope.togglePermission = function (role, permission) {
        var permissions = role.permissions,
          index = permissions.indexOf(permission);
        if (index > -1) {
          permissions.splice(index, 1);
        } else {
          permissions.push(permission);
        }

        if (promise) {
          $timeout.cancel(promise);
        }

        promise = $timeout(function () {
          CompaniesService.savePermissions(role);
        }, 500);
      };

      $scope.userReadable = function (str) {
        return str.split('_').map(function (word) {
          return word[0] + word.slice(1).toLowerCase();
        }).join(' ');
      };
    }]);

}());
