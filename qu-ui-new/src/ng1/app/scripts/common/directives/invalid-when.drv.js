'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('invalidWhen', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {

        scope.$watch(attr.invalidWhen, function (invalid) {
          ctrl.$setValidity('invalidwhen', !invalid);
        })

      }
    };
  })
})();
