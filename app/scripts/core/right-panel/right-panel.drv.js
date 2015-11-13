'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('rightPanel',
    ['$rootScope', '$timeout', function ($rootScope, $timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          rightPanelMode();

          $(window).resize(rightPanelMode);

          element.on('mouseleave', function () {
            $timeout(function () {
              if ($(window).width() <= 1320 && !$rootScope.insidePopover) {
                element.addClass('collapsed');
              }
            }, 100)
          });

          scope.$on('closeRightPanel', function () {
            $timeout(function () {
              if (!element.is(":hover") && $(window).width() <= 1320){
                element.addClass('collapsed');
              }
            }, 100)
          });

          function rightPanelMode() {

            if ($(window).width() > 1320) {
              element.removeClass('collapsed');
            } else {
              element.addClass('collapsed');
            }
          }

        }
      }
    }]);
})();
