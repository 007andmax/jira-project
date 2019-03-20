'use strict';

(function () {

  angular.module("quicktech.core.products").directive('moveProduct',
    ['$timeout',
      function ($timeout) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var scrollContent;
            var dropdownMenu = element.find('.dropdown-menu');

            scope.selectCategory = {};

            dropdownMenu.parent().on('shown.bs.dropdown', initNanoscrollt);

            scope.$watch('searchCategory', initNanoscrollt);

            function initNanoscrollt() {
              $timeout(function () {
                if (!scrollContent) {
                  scrollContent = element.find('.nano')
                }
                scrollContent.nanoScroller();
              })
            }

          }
        }
      }]);
})();
