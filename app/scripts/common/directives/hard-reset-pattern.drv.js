'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('hardResetPattern', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {

        var pattern = scope.$eval(attr.hardResetPattern),
          value = ctrl.$viewValue || '',
          isRequired = attr.hardResetRequired,
          isPhoneNumber = attr.isPhoneNumber,
          secondPattern = scope.$eval(attr.ngPattern);

        element.on('input', checkAndFix);
        element.on('change', checkAndFix);

        scope.$watch(function () {
          return ctrl.$viewValue
        }, checkAndFix);

        function checkAndFix(e) {

          var newValue = element.val().trim();

          if (isPhoneNumber) {
            if (newValue && secondPattern.test(newValue)) {
              value = newValue.replace(pattern, "($1) $2-$3");
              ctrl.$setViewValue(value);
              element.val(value);
            } else if(newValue) {
              ctrl.$setViewValue(value);
              element.val(value);
            } else {
              value = newValue;
            }

          } else {
            if (newValue && !pattern.test(newValue)) {
              ctrl.$setViewValue(value);
              element.val(value);
            } else {
              value = newValue;
            }
          }

          if(isRequired){
            ctrl.$setValidity("required", !!(value && value.length > 0));
          }
        }
      }
    };
  })
})();
