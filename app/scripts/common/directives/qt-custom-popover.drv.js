'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtCustomPopover',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var shown;

          element.on('mouseenter', function () {
            if (!shown && !element.is(":focus")) {
              element.trigger('qtCustomPopover');
              shown = true;
            }
          });

          element.on('mouseleave', function () {
            if (shown) {
              element.trigger('qtCustomPopover');
              shown = false;
            }
          });

          element.on('focus', function () {
            if (shown) {
              element.trigger('qtCustomPopover');
              shown = false;
            }
          });
        }
      }
    }]);
})();
