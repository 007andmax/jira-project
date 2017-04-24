'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.permissionsManagementCtrl',
    ['$scope', 'CompaniesService', '$timeout', function ($scope, CompaniesService, $timeout) {
      var promise;
      var companiesRelatedPermissions = ['CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES',
        'NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'MODIFY_SETTINGS', 'VIEW_PASSWORD_SECTION',
        'CREATE_PASSWORD', 'EDIT_PASSWORD'];
      var userRelatedPermissions = ['CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'];
      var accountingRelatedPermissions = ['CREATE_INVOICE'];
      var productsRelatedPermissions = ['MANAGE_PRODUCTS'];
      var passwordsRelatedPermissions = ['VIEW_PASSWORD', 'CREATE_PASSWORD', 'EDIT_PASSWORD', 'DELETE_PASSWORD'];
      var viewPasswordsRelatedPermissions = ['CREATE_PASSWORD', 'EDIT_PASSWORD'];

      $scope.sections = {
        'Tickets Area': ['EDIT_TICKETS', 'DELETE_TICKETS', 'REOPEN_CLOSED_TICKETS'],
        'Company Area': ['VIEW_COMPANIES', 'CREATE_COMPANIES', 'EDIT_COMPANIES', 'ARCHIVE_COMPANIES', 'VIEW_USERS', 'CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'],
        'Accounting': ['VIEW_ACCOUNTING', 'CREATE_INVOICE', 'MANAGE_PRODUCTS', 'VIEW_PRODUCT_COST', 'MANAGE_SERVICES', 'VIEW_TICKET_AND_INVOICE'],
        'Devices': ['NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'MODIFY_SETTINGS'],
        'Passwords': ['VIEW_PASSWORD_SECTION', 'VIEW_PASSWORD', 'CREATE_PASSWORD', 'EDIT_PASSWORD', 'DELETE_PASSWORD'],
        'Quick Support': ['ALLOW_QUICK_CONNECT'],
        'Reports': ['Sales', 'Performance', 'Remote Access', 'Financial', 'Taxes']
      };

      CompaniesService.getPermissions(function (resp) {
        $scope.roles = resp;
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
        } else if (role.permissions.indexOf('VIEW_PRODUCT_COST') === -1 && productsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_PASSWORD_SECTION') === -1 && passwordsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else if (role.permissions.indexOf('VIEW_PASSWORD') === -1 && viewPasswordsRelatedPermissions.indexOf(permission) > -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.getRelatedPermission = function (permission) {
        if (companiesRelatedPermissions.indexOf(permission) > -1) {
          if (passwordsRelatedPermissions.indexOf(permission) > -1) {
            if (viewPasswordsRelatedPermissions.indexOf(permission) > -1) {
              return 'View Companies, View Passwords Section and View Passwords';
            }
            return 'View Companies and View Passwords Section';
          }
          return 'View Companies';
        } else if (userRelatedPermissions.indexOf(permission) > -1) {
          return 'View Users';
        } else if (accountingRelatedPermissions.indexOf(permission) > -1) {
          return 'View Accounting';
        } else if (productsRelatedPermissions.indexOf(permission) > -1) {
          return 'View Product Cost';
        } else if (passwordsRelatedPermissions.indexOf(permission) > -1) {
          return 'View Passwords Section';
        } else if (viewPasswordsRelatedPermissions.indexOf(permission) > -1) {
          return 'View Passwords';
        } else {
          return 'required permission';
        }
      };

      function addOrRemovePermission(permissions, permission) {
        var index = permissions.indexOf(permission),
          relatedPermissions;

        if (index > -1) {
          permissions.splice(index, 1);

          if (permission === 'VIEW_COMPANIES') {
            relatedPermissions = companiesRelatedPermissions.concat(['VIEW_PASSWORD']);
          } else if (permission === 'VIEW_USERS') {
            relatedPermissions = userRelatedPermissions;
          } else if (permission === 'VIEW_ACCOUNTING') {
            relatedPermissions = accountingRelatedPermissions;
          } else if (permission === 'VIEW_PRODUCT_COST') {
            relatedPermissions = productsRelatedPermissions;
          } else if (permission === 'VIEW_PASSWORD_SECTION') {
            relatedPermissions = passwordsRelatedPermissions;
          } else if (permission === 'VIEW_PASSWORD') {
            relatedPermissions = passwordsRelatedPermissions;
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
