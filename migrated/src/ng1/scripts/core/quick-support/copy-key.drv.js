'use strict';

(function () {

  angular.module("quicktech.core.quickSupport").directive('copyKey',
    ['ConstantsService', 'quicktech.common.services.UserNotificationService',
      function (ConstantsService, UserNotificationService) {
        return {
          restrict: 'A',
          scope: {
            copyKey: '='
          },
          link: function (scope, element) {

            element.click(function () {

              var textArea = document.createElement("textarea");
              textArea.style.opacity = 0;
              textArea.value = scope.copyKey;

              document.body.appendChild(textArea);

              textArea.select();

              try {
                var successful = document.execCommand('copy');
                if (successful) {
                  UserNotificationService.show('Copied successfully', true);
                } else {
                  UserNotificationService.show('Copy failed', true);
                }
              } catch (err) {
                UserNotificationService.show('Copy failed', true);
              }

              document.body.removeChild(textArea);

            })

          }
        }
      }]);
})();
