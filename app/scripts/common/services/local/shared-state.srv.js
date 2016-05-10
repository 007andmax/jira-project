'use strict';

/* Services */

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.SharedStateService',
    [function () {

      var defaultStates = {
        ticketsHeader: {
          searchFilter: {},
          count: 0
        },
        usersHeader: {
          count: 0,
          filter: {
            keyword: '',
            company: {}
          }
        },
        companiesHeader: {
          count: 0,
          filter: {keyword: ''}
        },
        billableClientsHeader: {
          companies: []
        },
        receiptArchiveInvoicesHeader: {
          invoices: []
        },
        vendorsHeader: {
          count: 0,
          filter: {keyword: ''}
        },
        rightPanel: {
          companyId: undefined
        },
        devicesHeader: {
          checkedDevicesId: []
        },
        quickSession: {
          showAllSession: true,
          isCreateNew: false
        }
      };

      var sharedStates = angular.extend({}, defaultStates);

      return {
        getSharedState: function (name) {
          return sharedStates[name];
        },
        updateState: function (name, state) {

          if (!sharedStates[name]) {
            throw 'attempt t update unexisting state!';
          }

          if (!state) {
            throw 'Require target state!';
          }

          angular.extend(sharedStates[name], state);
        },
        clearState: function (name) {
          sharedStates[name] = angular.extend({}, defaultStates[name]);
        }
      }

    }]);

})(window, jQuery);

