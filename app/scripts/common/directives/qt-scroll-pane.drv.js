'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtScrollPane',
    [function (UserNotificationService) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.jScrollPane({
            autoReinitialise: true,
            verticalDragMinHeight: 54,
            verticalDragMaxHeight: 54,
          });
        }
      }
    }]);
})();
