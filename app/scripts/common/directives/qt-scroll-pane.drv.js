'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtScrollPane',
    [function (UserNotificationService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          if (!attrs.qtspCreateEvent) {
            initScroll();
          } else {
            scope.$on(attrs.qtspCreateEvent, initScroll);
          }

          function initScroll() {
            element.jScrollPane({
              autoReinitialise: true,
              verticalDragMinHeight: 54,
              verticalDragMaxHeight: 54
            });
          }
        }
      }
    }]);
})();
