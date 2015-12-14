'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('trimmedPopover',
    function () {
      return {
        restrict: 'A',
        scope: {
          description: '=trimmedPopoverContent'
        },
        link: function (scope, element) {

          element.hover(initPopover);

          function initPopover() {

            if (element[0].offsetWidth < element[0].scrollWidth) {

              element.addClass('description');

              element.popover({
                content: scope.description,
                placement: "bottom",
                trigger: "hover"
              });

              element.popover("show")

            } else {
              element.removeClass('description');
            }

          }

        }
      };
    });

})();
