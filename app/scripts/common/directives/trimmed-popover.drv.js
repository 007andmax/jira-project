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

          scope.$watch(function () {
            return element[0].offsetWidth;
          }, initPopover);

          function initPopover() {

            if (element[0].offsetWidth < element[0].scrollWidth) {


              element.addClass('description');

              element.popover({
                content: scope.description,
                placement: "bottom",
                trigger: "hover"
              })


            } else {

              element.removeClass('description');

            }

          }


        }
      };
    });

})();
