'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('userNotification',
    ['quicktech.common.services.UserNotificationService',
      function (UserNotificationService) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            element.hide();
            element.removeClass('hide');

            UserNotificationService.setHideListener(function () {
              element.fadeOut();
            });

            UserNotificationService.setShowListener(function (message) {
              element.text(message);
              element.show();
            });
          }
        }
      }]);
})();
