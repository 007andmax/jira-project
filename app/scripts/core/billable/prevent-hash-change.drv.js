'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("preventHashChange", ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
          var promise = $timeout(function () {
            window.onhashchange = preventHashChange;
            $timeout.cancel(promise);
          }, 100);

          var unbind = $scope.$on('$destroy', function () {
            window.onhashchange = undefined;
            unbind();
          });

          function preventHashChange() {
            $scope.$apply($attrs.preventHashChange);
          }
        }
      }
    }]);
})();
