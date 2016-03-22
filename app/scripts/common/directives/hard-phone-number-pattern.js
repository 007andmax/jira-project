'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('hardPhoneNumberPattern', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {

        if (!attr.pattern && !attr.ngPattern) throw 'Error: ngPattern required by hardPhoneNumberPattern directive!';

        var pattern = scope.$eval(attr.hardPhoneNumberPattern),
          value = ngModel.$viewValue || '',
          isRequired = attr.hardResetRequired,
          softPattern = attr.ngPattern ? scope.$eval(attr.ngPattern) : new RegExp(attr.pattern);

        element.on('input', checkAndFix);
        element.on('change', checkAndFix);

        scope.$watch(function () {
          return ngModel.$viewValue
        }, checkAndFix);

        function checkAndFix(e) {

          var newValue = element.val().trim();

          if (newValue && softPattern.test(newValue)) {
            if (pattern.test(newValue)) value = newValue.replace(pattern, "($1) $2-$3");
            else value = newValue;
            ngModel.$setViewValue(value);
            element.val(value);
          } else if (newValue) {
            ngModel.$setViewValue(value);
            element.val(value);
          } else {
            value = newValue;
          }

          if (isRequired) {
            ngModel.$setValidity("required", !!(value && value.length > 0));
          }
        }
      }
    };
  })
})();
