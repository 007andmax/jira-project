'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.permissionsManagement',
    ['$scope', 'CompaniesService', '$timeout', function ($scope, CompaniesService, $timeout) {
      var promise;
      var companiesRelatedPermissions = ['CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES'];
      var userRelatedPermissions = ['CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'];
      var accountingRelatedPermissions = ['CREATE_INVOICE'];
      var productsRelatedPermissions = ['VIEW_PRODUCT_COST'];

      $scope.sections = {
        'Tickets Area': ['DELETE_TICKETS', 'REOPEN_CLOSED_TICKETS'],
        'Company Area': ['VIEW_COMPANIES', 'CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES', 'VIEW_USERS', 'CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'],
        'Accounting': ['VIEW_ACCOUNTING', 'CREATE_INVOICE', /*'VOID_INVOICE',*/ 'MANAGE_PRODUCTS', 'VIEW_PRODUCT_COST', 'MANAGE_SERVICES'],
        'Devices': ['NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'VIEW_PASSWORDS', 'MODIFY_SETTINGS'],
        'Quick Support': ['ALLOW_QUICK_CONNECT']
      };

      CompaniesService.getPermissions(function (resp) {
        $scope.roles = resp.sort(function (role1, role2) {
          return role1.name < role2.name;
        });
      });

      $scope.togglePermission = function (role, permission) {
        addOrRemovePermission(role.permissions, permission);

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

      $scope.isPermissionDisabled = function (permission, role) {

        if (role.permissions.indexOf('VIEW_COMPANIES') === -1 && companiesRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_USERS') === -1 && userRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_ACCOUNTING') === -1 && accountingRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('MANAGE_PRODUCTS') === -1 && productsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else {
          return false;
        }
      };

      function addOrRemovePermission(permissions, permission) {
        var index = permissions.indexOf(permission),
          relatedPermissions;

        if (index > -1) {
          permissions.splice(index, 1);

          if (permission === 'VIEW_COMPANIES') {
            relatedPermissions = companiesRelatedPermissions;
          } else if (permission === 'VIEW_USERS') {
            relatedPermissions = userRelatedPermissions;
          } else if (permission === 'VIEW_ACCOUNTING') {
            relatedPermissions = accountingRelatedPermissions;
          } else if (permission === 'MANAGE_PRODUCTS') {
            relatedPermissions = productsRelatedPermissions;
          }

          if (relatedPermissions) {
            for (var i = 0; i < relatedPermissions.length; i++) {
              var relatedIndex = permissions.indexOf(relatedPermissions[i]);

              if (relatedIndex > -1) {
                permissions.splice(relatedIndex, 1);
              }
            }
          }

        } else {
          permissions.push(permission);
        }
      }

    }]);

}());
