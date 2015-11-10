'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("controlMarginContent",
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element) {

          setMarginLeft();

          $(window).resize(setMarginLeft);

          function setMarginLeft() {
            var wrapper_width = $(".content-wrapper").width(),
              req_margin = parseInt((wrapper_width - 740) / 2);

            element.css("margin-left", req_margin);
          }

          scope.$on('$destroy', function () {
            $(window).off('resize');
          });
        }
      }
    }]);
})();
