'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('fixedBlockTop', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          $(window).scroll(function () {
            var elementScreenTop = element[0].getBoundingClientRect().top - 78,
              elementCssTop = parseInt(element.css('top')),
              top = 0;

            if (elementScreenTop !== 0 && elementCssTop >= 0) {
              top = elementCssTop - elementScreenTop;
            }

            //todo: allow to set styles
            if (top > 0) {
              element.css({
                'background-color': 'rgba(255, 255, 255, 0.87)',
                'z-index': 999
              });
            } else {
              element.css({
                'background-color': 'transparent',
                'z-index': 1
              });
            }

            element.css('top', (top > 0 ? top : 0) + 'px');
          });

        }
      }
    });
})();
