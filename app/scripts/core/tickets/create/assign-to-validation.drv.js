'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("assignToValidation",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {

          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, function (value) {

            var valid = ngModelCtrl.$modelValue || (value === "[$empty$]" || value === '' || value === undefined);

            ngModelCtrl.$setValidity('choose', valid);

            // reset default typeahead validation
            ngModelCtrl.$setValidity('editable', true);
            ngModelCtrl.$setValidity('parse', true);
          });
        }
      }
    }]);
})();
