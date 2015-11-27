'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('userNotification',
    ['quicktech.common.services.UserNotificationService',
      function (UserNotificationService) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {

            element.hide();

            scope.getMarginLeft = function(){
              return {
                'margin-left': Math.floor(-element.width()/2 + 25) + 'px'
              };
            };

            UserNotificationService.setHideListener(function () {
              element.fadeOut();
            });

            UserNotificationService.setShowListener(function (message) {
              scope.message = message;
              element.show();
            });
          }
        }
      }]);
})();
