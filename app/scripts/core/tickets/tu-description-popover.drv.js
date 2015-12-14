'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('tuDescriptionPopover',
    function () {
      return {
        restrict: 'A',
        link: function (scope, element) {

          scope.$watch(function () {
            return element[0].offsetWidth;
          }, initPopover);

          function initPopover() {

            if (element[0].offsetWidth < element[0].scrollWidth) {

              if (scope.product) {
                var description = scope.product.description;
              } else if (scope.service) {
                var description = scope.service.description;
              }

              element.addClass('description');

              element.popover({
                content: description,
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
