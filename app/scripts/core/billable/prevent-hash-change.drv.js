'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("preventHashChange", ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
          $timeout(function () {
            window.onhashchange = preventHashChange;
          });

          $scope.$on('$destroy', function () {
            window.onhashchange = undefined;
          });

          function preventHashChange() {
            $scope.$apply($attrs.preventHashChange);
          }
        }
      }
    }]);
})();
