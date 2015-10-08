'use strict';

/* Services */

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.UserNotificationService',
    ['$timeout',
      function ($timeout) {

        var showMessageListener;
        var hideMessageListener;

        return {
          show: function (message, close) {
            if (showMessageListener) {
              showMessageListener(message);
            }
            if (close) {
              $timeout(hideMessageListener, 3000);
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

