'use strict';

(function () {

  angular.module("quicktech.core.quickSupport").directive('copyValue',
    ['ConstantsService', 'quicktech.common.services.UserNotificationService',
      function (ConstantsService, UserNotificationService) {
        return {
          restrict: 'A',
          scope: {
            copyValue: '='
          },
          link: function (scope, element) {

            var host = ConstantsService.getConstant('server.url');

            element.click(function () {

              var textArea = document.createElement("textarea");
              textArea.style.opacity = 0;
              textArea.value = host + 'oneTimeRemoteSession?remoteSessionId=' + scope.copyValue;

              document.body.appendChild(textArea);

              textArea.select();

              try {
                var successful = document.execCommand('copy');
                if (successful) {
                  UserNotificationService.show('The support url has been copy', true);
                }
              } catch (err) {
                UserNotificationService.show('The support url has not been copy', true);
                console.log('Oops, unable to copy');
              }

              document.body.removeChild(textArea);

            })

          }
        }
      }]);
})();
