'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('rightPanel',
    ['$rootScope', '$document', function ($rootScope, $document) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          $document.on('click', collapse);

          function collapse(e) {
            var isClickedInside = angular.element(e.target).closest(element).length;
            if (!$rootScope.insidePopover && !isClickedInside) {
              element.addClass('collapsed');
            }
          }

          scope.$on('$destroy', function () {
            $document.off('click', collapse);
          });

        }
      }
    }]);
})();
