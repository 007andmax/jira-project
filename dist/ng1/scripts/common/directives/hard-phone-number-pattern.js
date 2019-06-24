'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('hardPhoneNumberPattern',
    ['quicktech.common.services.PhoneFormats', function (PhoneFormats) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {

          if (!attr.pattern && !attr.ngPattern) {
            throw 'Error: ngPattern required by hardPhoneNumberPattern directive!';
          }

          var value = ngModel.$viewValue || '',
            isRequired = attr.hardResetRequired,
            softPattern = attr.ngPattern ? scope.$eval(attr.ngPattern) : new RegExp(attr.pattern);

          element.on('input', checkAndFix);
          element.on('change', checkAndFix);

          scope.$watch(function () {
            return ngModel.$viewValue
          }, checkAndFix);

          attr.$observe('country', function (country) {
            if (!ngModel.$viewValue || (ngModel.$viewValue.split(' ').length === 1 && PhoneFormats.isPrefixValid(value))) {
              setPrefix(country);
            } else {
              checkAndFix(false);
            }
          });

          function checkAndFix(valueChanged) {

            var newValue = element.val().trim();

            if (valueChanged && newValue && value && newValue.length <= value.length) {
              value = newValue;
              ngModel.$setViewValue(value);
              element.val(value);
            } else {
              if (softPattern.test(newValue)) {
                value = PhoneFormats.getFormattedPhone(attr.country, newValue);
                ngModel.$setViewValue(value);
                element.val(value);
              } else {
                value = newValue;
              }
            }

            if (isRequired) {
              ngModel.$setValidity("required", !!(value && value.length > 0));
            }
          }

          function setPrefix(country) {
            if (country) {
              var format = PhoneFormats.getCountryFormats(country);
              if (format) {
                value = format.prefix;
                ngModel.$setViewValue(value);
                element.val(value);
              }
            }
          }
        }
      };
    }])
})();
