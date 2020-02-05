'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('fixedBlockTop', ['$document', function ($document) {
    return {
      restrict: 'A',
      scope: {
        offsetTop: '@?',
        disableStick: '=?',
        backgroundColor: '@?'
      },
      link: function (scope, element, attrs) {

        if (!scope.disableStick) {
          var elementWithScroll = $document.find(attrs.fixedBlockTop);

          if (!elementWithScroll.length) {
            elementWithScroll = $(window);
          }

          elementWithScroll.on('scroll', onScroll);
          scope.$on('$destroy', function () {
            elementWithScroll.off('scroll', onScroll);
          });
        }

        function onScroll() {
          var etsSlider = element.closest('[ets-slider]');
          if (element.css('display') !== 'none' && (!etsSlider.length || etsSlider.css('display') !== 'none')) {
            var elementScreenTop = element[0].getBoundingClientRect().top - (scope.offsetTop || 78), //78 - header height
              elementCssTop = parseInt(element.css('top')),
              top = 0;

            if (elementScreenTop !== 0 && elementCssTop >= 0) {
              top = elementCssTop - elementScreenTop;
            }

            //todo: allow to adjust styles
            if (top > 0) {
              element.css({
                'z-index': 999
              });
            } else {
              element.css({
                'z-index': 'initial'
              });
            }

            element.css('top', (top > 0 ? top : 0) + 'px');
          }
        }

      }
    }
  }]);
})();
