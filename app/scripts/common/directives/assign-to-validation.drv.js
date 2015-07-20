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
            ngModelCtrl.$setValidity('choose', (ngModelCtrl.$viewValue === "[$empty$]" || ngModelCtrl.$viewValue === '' || ngModelCtrl.$viewValue === undefined));
            if ((ngModelCtrl.$viewValue === "[$empty$]" || ngModelCtrl.$viewValue === '' || ngModelCtrl.$viewValue === undefined)) {
              ngModelCtrl.$valid = true;
            }
          });
        }
      }
    }]);
})();
