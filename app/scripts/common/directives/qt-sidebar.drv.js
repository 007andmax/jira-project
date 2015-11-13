'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtSidebar',
    [function (UserNotificationService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.hover(function () {
            element.addClass('opened');
            element.find('.qt-sidebar-scroll').nanoScroller();
          }, function () {
            element.removeClass('opened');
          })
        }
      }
    }]);
})();
