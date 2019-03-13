'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('onlyNumbersInput',
    ['$timeout', function ($timeout) {
      return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
          function fromUser(text) {

            var transformedInput = text.replace(/^\d{1,10}(\.\d{0,2}){0,1}$/, '');

            if (transformedInput !== text) {
              ngModelCtrl.$setViewValue(transformedInput);
              ngModelCtrl.$render();
            }
            return transformedInput;
          }
          ngModelCtrl.$parsers.push(fromUser);
        }
      };
    }]);
})();
