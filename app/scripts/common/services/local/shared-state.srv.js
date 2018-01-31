'use strict';

/* Services */

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.SharedStateService',
    [function () {

      var defaultStates = {
        globalSearch: {
          goBack: {}
        },
        ticketsHeader: {
          searchFilter: {},
          checkedTicketsIds: [],
          count: 0,
          filter: {},
          openTicketId: ''
        },
        draftsHeader: {
          selectedIds: []
        },
        companiesHeader: {
          filter: {}
        },
        companyProfile: {
          tabName: '',
          companyId: '',
          ticketsCounts: {}
        },
        usersHeader: {
          filter: {
            companyId: ''
          }
        },
        billableHeader: {
          filter: {
            companyId: ''
          }
        },
        receivableHeader: {
          filter: {
            companyId: ''
          }
        },
        receiptArchiveHeader: {
          filter: {
            companyId: ''
          }
        },
        servicesHeader: {
          filter: {
            companyId: ''
          }
        },
        passwordsHeader: {
          filter: {
            companyId: ''
          }
        },
        rightPanel: {
          companyId: undefined
        },
        quickSession: {
          showAllSession: true,
          isCreateNew: false
        }
      };

      var sharedStates = angular.copy(defaultStates);

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
        },
        clearAllExceptGlobalSearch: function () {
          for (var name in sharedStates) {
            if (name === 'globalSearch' || name === 'quickSession') {
              continue;
            }

            sharedStates[name].filter = angular.copy(defaultStates[name].filter);
          }
        }
      }

    }]);

})(window, jQuery);

