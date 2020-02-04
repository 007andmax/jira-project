'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('hardResetPattern', function ($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {

        var pattern = new RegExp(),
          value = ctrl.$viewValue || '',
          isRequired = attr.hardResetRequired;

        element.on('input', checkAndFix);
        element.on('change', checkAndFix);

        scope.$watch(function () {
          return ctrl.$viewValue
        }, checkAndFix);

        attr.$observe('hardResetPattern', function(newValue) {
          if (newValue) {
            pattern = scope.$eval(newValue);
          }
        });

        function checkAndFix(e) {

          var newValue = element.val();

          if (newValue && !newValue.match(pattern)) {
            ctrl.$setViewValue(value);
            element.val(value);
          } else {
            value = newValue;
          }

          if(isRequired){
            ctrl.$setValidity("required", !!(value && value.length > 0));
          }
        }
      }
    };
  })
})();
