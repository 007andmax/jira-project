'use strict';

(function () {

  angular.module("quicktech.core.users").directive('trimmedTooltipChecker', function () {
    return {
      restrict: 'A',
      replace: true,
      template: '<p tooltip-enable="{{ isTrimmed() }}" > {{ value }} </p>',
      scope: {
        value: "=trimmedTooltipChecker"
      },
      link: function (scope, element, attrs) {
        scope.isTrimmed = function () {
          return element[0].offsetWidth < element[0].scrollWidth;
        }
      }
    }
  });
})();
