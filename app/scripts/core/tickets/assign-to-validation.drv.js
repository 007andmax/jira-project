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
          }, function () {
            if ((ngModelCtrl.$viewValue === "[$empty$]" || ngModelCtrl.$viewValue === '' || ngModelCtrl.$viewValue === undefined)) {
              ngModelCtrl.$valid = true;
            }
          });
        }
      }
    }]);
})();
