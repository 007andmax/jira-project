'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('userNotification',
    ['quicktech.common.services.UserNotificationService', '$timeout',
      function (UserNotificationService, $timeout) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            element.hide();
            element.removeClass('hide');

            UserNotificationService.setHideListener(function () {
              element.fadeOut();
              $timeout(function () {
                element.html('');
              }, 400);
            });

            UserNotificationService.setShowListener(function (message) {
              element.text(message);
              element.show();
            });
          }
        }
      }]);
})();
