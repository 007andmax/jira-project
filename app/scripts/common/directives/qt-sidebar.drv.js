'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtSidebar',
    [function (UserNotificationService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.hover(function () {
            $('body').addClass('opened-sidebar');
          }, function () {
            $('body').removeClass('opened-sidebar');
          })
        }
      }
    }]);
})();
