'use strict';

(function () {

  angular.module("quicktech.core.billable").directive("preventHashChange", function () {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        var initialized = false;
        window.onhashchange = preventHashChange;

        var unbind = $scope.$on('$destroy', function (info) {
          if (info.targetScope && info.targetScope.$id === $scope.$id) {
            window.onhashchange = undefined;
            unbind();
          }
        });

        function preventHashChange() {
          if (!initialized) {
            return initialized = true;
          }
          $scope.$apply($attrs.preventHashChange);
        }
      }
    }
  });
})();
