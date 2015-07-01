'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('hardResetPattern', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {

        var pattern = scope.$eval(attr.hardResetPattern),
          value = ctrl.$viewValue || '';

        element.on('input', function (e) {

          var newValue = element.val();

          if (newValue && !newValue.match(pattern)) {
            ctrl.$setViewValue(value);
            element.val(value);
          } else {
            value = newValue || ''
          }
        });
      }
    };
  })
})();
