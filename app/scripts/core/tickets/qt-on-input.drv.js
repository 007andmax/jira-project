'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("qtOnInput", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        element.on('input', function () {
          scope.validLink = {
            required: !ctrl.$viewValue,
            pattern: !ctrl.$viewValue.match(scope.linkPattern)
          };
        });
      }
    };
  });
})();
