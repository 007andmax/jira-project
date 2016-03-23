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
                  UserNotificationService.show('The KEY has been copied', true);
                }
              } catch (err) {
                UserNotificationService.show('The KEY has not been copied', true);
                console.log('Oops, unable to copy');
              }

              document.body.removeChild(textArea);

            })

          }
        }
      }]);
})();
