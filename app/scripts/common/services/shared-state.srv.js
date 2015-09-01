'use strict';

/* Services */

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.SharedStateService',
    [function () {

      var defaultStates = {
        ticketsHeader: {
          searchFilter: {},
          allTags: [],
          count: 0
        },
        usersHeader: {
          count: 0,
          filter: {keyword: ''}
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

