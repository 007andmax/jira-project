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
          if (element.css('display') !== 'none') {
            var elementScreenTop = element[0].getBoundingClientRect().top - (scope.offsetTop || 78), //78 - header height
              elementCssTop = parseInt(element.css('top')),
              top = 0;

            if (elementScreenTop !== 0 && elementCssTop >= 0) {
              top = elementCssTop - elementScreenTop;
            }

            //todo: allow to adjust styles
            if (top > 0) {
              element.css({
                'background-color': scope.backgroundColor || 'rgba(255, 255, 255, 0.87)',
                'z-index': 999
              });
            } else {
              element.css({
                'background-color': scope.backgroundColor || 'transparent',
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
