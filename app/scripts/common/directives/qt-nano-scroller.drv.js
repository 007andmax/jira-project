'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtNanoScroller',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          if (!attrs.qtNanoScroller) {
            $timeout(function () { initScroll(); });
          } else {
            scope.$on(attrs.qtNanoScroller, initScroll);
          }

          function initScroll() {
            element.addClass('nano');
            angular.element(element.children()[0]).addClass('nano-content');

            $timeout(function () {
              element.nanoScroller();
            });
          }
        }
      }
    }]);
})();
