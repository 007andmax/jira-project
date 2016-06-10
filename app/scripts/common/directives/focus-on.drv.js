'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("focusOn",
    [function () {
      return {
        restrict: 'A',
        scope: {
          enabled: '=focusOn'
        },
        link: function ($scope, element, attrs) {
          if ($scope.enabled === undefined || $scope.enabled) {
            element.focus();
          }
        }
      }
    }]);

})();
