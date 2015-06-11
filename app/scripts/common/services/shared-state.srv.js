'use strict';

/* Services */

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.SharedStateService',
    [function () {

      var sharedStates = {
        header: {
          searchFilter: {},
          allTags: []
        }
      };

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
        }
      }

    }]);

})(window, jQuery);

