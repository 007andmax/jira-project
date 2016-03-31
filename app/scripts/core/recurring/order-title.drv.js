'use strict';
'use strict';

(function () {

  angular.module("quicktech.core.recurring").directive("orderTitle",
    ['$compile', function ($compile) {
      return {
        restrict: 'A',
        scope: {
          orderTitle: '=orderTitle'
        },
        link: function (scope, element) {

          var titleIcon = $compile("<i class='icn-sm  icn-description' popover='{{ orderTitle }}' popover-placement='bottom' popover-trigger='mouseenter'></i>")(scope);
          var titleText = $compile("<span trimmed-popover trimmed-popover-content='orderTitle'>{{ orderTitle }}</span>")(scope);

          var isIconAppend = element.width() > 100;

          scope.$watch(function () {
            return element.width();
          }, function (val) {

            if (+val > 100 && isIconAppend) {
              element.html(titleText);
              isIconAppend = false;
            } else if (+val <= 100 && !isIconAppend) {
              element.html(titleIcon);
              isIconAppend = true;
            }

          });

        }
      };
    }]);
})();
