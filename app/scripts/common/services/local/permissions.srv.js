'use strict';

(function () {

  angular.module('quicktech.common.services').factory('quicktech.common.services.PermissionsService', function () {

    var FULL = ['USER', 'ADMIN', 'SUPER_TECH_ADMIN'],
      ADMIN = ['ADMIN', 'SUPER_TECH_ADMIN'],
      TECH = ['SUPER_TECH_ADMIN'];

    var PERMISSIONS = {
      QUICKSUPPORT: {
        C: FULL,
        R: FULL,
        U: FULL,
        D: TECH
      },
      TICKETS: {
        UNASSIGNED: {
          C: FULL,
          R: FULL,
          U: TECH,
          D: TECH
        },
        USER: {
          C: FULL,
          R: FULL,
          U: TECH,
          D: TECH
        },
        SHARED: {
          C: TECH,
          R: FULL,
          U: TECH,
          D: TECH
        },
        OPEN: {
          C: FULL,
          R: ADMIN,
          U: TECH,
          D: TECH
        },
        CLOSED: {
          C: TECH,
          R: ADMIN,
          U: TECH,
          D: TECH
        },
        TRASH: {
          C: TECH,
          R: ADMIN,
          U: TECH,
          D: TECH
        },
        SPAM: {
          C: TECH,
          R: FULL,
          U: TECH,
          D: TECH
        }
      },
      CLIENTS: {
        COMPANIES: {
          C: ADMIN,
          R: FULL,
          U: ADMIN,
          D: ADMIN
        },
        COMPANYPROFILE: {
          C: TECH,
          R: FULL,
          R_CHART: ADMIN,
          U: ADMIN,
          D: ADMIN,
          D_DEVICE: ADMIN,
          D_USER: ADMIN
        },
        USERS: {
          C: FULL,
          R: FULL,
          U: FULL,
          D: ADMIN,
          U_ACCOUNT_ENABLED: ADMIN
        },
        LEADS: {
          C: ADMIN,
          R: FULL,
          U: ADMIN,
          D: ADMIN
        }
      },
      ACCOUNTING: {
        C: TECH,
        R: TECH,
        U: TECH,
        D: TECH
      },
      INVENTRY: {
        VENDORS: {
          C: ADMIN,
          R: FULL,
          U: ADMIN,
          D: ADMIN
        },
        PRODUCTS: {
          C: ADMIN,
          R: FULL,
          U: ADMIN,
          D: ADMIN,
          R_COST: ADMIN
        },
        SERVICES: {
          C: ADMIN,
          R: ADMIN,
          U: ADMIN,
          D: ADMIN
        }
      },
      SETTINGS: {
        MY_PROFILE: FULL,
        TECH_USERS: TECH,
        COMPANY_INFO: TECH,
        EMAIL_TEMPLATES: ADMIN,
        DEACTIVATE_ACCOUNT: TECH
      },
      HEADER: {
        C_TICKET: FULL,
        C_USER: FULL,
        C_COMPANY: ADMIN,
        C_VENDOR: ADMIN,
        C_LEAD: FULL,
        C_AGENT: FULL
      },
      LEFT_PANEL: {
        UNASSIGNED_TICKETS: FULL,
        USER_TICKETS: FULL,
        SHARED_TICKETS: FULL,
        OPEN_TICKETS: ADMIN,
        CLOSED_TICKETS: ADMIN,
        TRASH_TICKETS: ADMIN,
        SPAM_TICKETS: FULL,
        CLIENT_COMPANIES: FULL,
        CLIENT_USERS: FULL,
        CLIENT_LEADS: FULL,
        ACCOUNTING: TECH,
        VENDORS_INVENTRY: FULL,
        PRODUCTS_INVENTRY: FULL,
        SERVICES_INVENTRY: ADMIN
      },
      RIGHT_PANEL: {
        D_USER: ADMIN,
        D_DEVICE: ADMIN
      }
    };

    function _getPermissionConfigByKeys(keys) {
      var config = PERMISSIONS;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (config[key]) {
          config = config[key];
        }
      }
      return config;
    }

    function isAllowed(page, role, actions) {
      if (!(page && role && actions)) {
        return false;
      }

      var uKeys = page.split('/').map(function (item) {
        return item.toUpperCase();
      });
      var uRole = role.toUpperCase();
      var uActions = actions.split(' ').map(function (item) {
        return item.toUpperCase();
      });

      for (var i = 0; i < uActions.length; i++) {
        var action = uActions[i],
          permissions = _getPermissionConfigByKeys(uKeys)[action];

        if (!permissions || permissions.indexOf(uRole) === -1) {
          return false
        }
      }

      return true;
    }

    return {
      isAllowed: isAllowed
    }

  });

})();



