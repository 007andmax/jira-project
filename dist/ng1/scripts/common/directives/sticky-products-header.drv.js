'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('stickyProductsHeader', ['$compile', function ($compile) {
    return {
      restrict: 'A',

      link: function (scope, $element, attrs) {
        var parentElement = $element.parent();
        var isHeaderSticky = false;

        window.addEventListener('scroll', onScroll);

        scope.$on('$destroy', function() {
          window.removeEventListener('scroll', onScroll);
        })

        function onScroll() {
          var el = isHeaderSticky ? parentElement : $element;
          var headerHeight = 78;
          var elPosition = el[0].getBoundingClientRect();
          var position = elPosition.top - headerHeight;

          if (position <= 0) {
            isHeaderSticky = true;
            $element.addClass('sticky');
            $element.css('top', Math.abs(position) + 'px');
          } else {
            isHeaderSticky = false;
            $element.removeClass('sticky');
          }
        }
      }
    }
  }]);
})();
