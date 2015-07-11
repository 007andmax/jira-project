'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("isUniqValidation",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          validationFunc: '=validationFunc',
          modelId: '=modelId'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

          validate();

          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, validate);

          function validate() {
            if (ngModelCtrl.$viewValue && (ngModelCtrl.$valid || ngModelCtrl.$error.unique)) {
              scope.validationFunc(ngModelCtrl, scope.modelId);
            }
          }
        }
      }
    }]);
})();
