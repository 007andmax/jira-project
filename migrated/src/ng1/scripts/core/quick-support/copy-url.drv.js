'use strict';

(function () {

  angular.module("quicktech.core.quickSupport").directive('copyUrl',
    ['ConstantsService', 'quicktech.common.services.UserNotificationService',
      function (ConstantsService, UserNotificationService) {
        return {
          restrict: 'A',
          scope: {
            copySessionId: '=copyUrl'
          },
          link: function (scope, element) {

            var host = ConstantsService.getConstant('server.url', function (resp) {
              host = resp;
            });

            element.click(function () {

              var textArea = document.createElement("textarea");
              textArea.style.opacity = 0;
              textArea.value = host + 'remote?key=' + scope.copySessionId;

              document.body.appendChild(textArea);

              textArea.select();

              try {
                var successful = document.execCommand('copy');
                if (successful) {
                  UserNotificationService.show('The support url has been copy', true);
                }
              } catch (err) {
                UserNotificationService.show('The support url has not been copy', true);
                
              }

              document.body.removeChild(textArea);

            })

          }
        }
      }]);
})();
