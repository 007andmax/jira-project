'use strict';

/* Services */

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.UserNotificationService',
    [function () {

      var showMessageListener;
      var hideMessageListener;

      return {
        show: function (message) {
          if (showMessageListener) {
            showMessageListener(message);
          }
        },
        hide: function () {
          if (hideMessageListener) {
            hideMessageListener();
          }
        },
        setShowListener: function (listener) {
          showMessageListener = listener;
        },
        setHideListener: function (listener) {
          hideMessageListener = listener;
        }
      }

    }]);

})(window, jQuery);

