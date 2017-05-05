'use strict';

(function () {

  angular.module('quicktech.common.services').service('quicktech.common.services.PermissionsService',
    ['$rootScope', '$state', function ($rootScope, $state) {

      this.isAllowed = function (action) {
        var currentUser = $rootScope.currentUser;
        return currentUser && (currentUser.isOwner || currentUser.permissions.indexOf(action) > -1);
      };

      $rootScope.$watch('currentUser.permissions', function (permissions) {
        if (permissions && isPermissionConflict(permissions)) {
          $state.go('tickets');
        }
      });

      function isPermissionConflict(permissions) {
        return $state.includes("users") && permissions.indexOf('VIEW_USERS') === -1 ||
          $state.includes("companies") && permissions.indexOf('VIEW_COMPANIES') === -1 ||
          $state.includes("companyProfile") && permissions.indexOf('VIEW_COMPANIES') === -1 ||
          $state.includes("companyProfile", { tabName: 'users' }) && permissions.indexOf('VIEW_USERS') === -1 ||
          $state.includes("companyProfile", { tabName: 'network-scan' }) && permissions.indexOf('NETWORK_SCAN_CLIENTS') === -1 ||
          ($state.current.url + ' ' + $state.current.name).indexOf("accounting") > -1 && permissions.indexOf('VIEW_ACCOUNTING') === -1 ||
          $state.includes("quickSupport") && permissions.indexOf('ALLOW_QUICK_CONNECT') === -1 ||
          $state.includes("permission-management") && permissions.indexOf('VIEW_PASSWORD_SECTION') === -1 ||
          $state.includes("settings.tickets") && permissions.indexOf('VIEW_TICKET_AND_INVOICE_SETTINGS') === -1;
      }



    }]);

})();



