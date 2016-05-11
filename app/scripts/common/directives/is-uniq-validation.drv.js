'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("isUniqValidation",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          validationFunc: '=validationFunc',
          modelId: '=modelId'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

          var timeoutId;

          validate();

          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, validate);

          function validate() {
            if (timeoutId) {
              $timeout.cancel(timeoutId);
            }
            timeoutId = setValidationTimeout();
          }

          function setValidationTimeout() {
            return $timeout(function () {
              if (ngModelCtrl.$viewValue && (ngModelCtrl.$valid || ngModelCtrl.$error.unique) && scope.validationFunc) {
                scope.validationFunc(ngModelCtrl, scope.modelId);
              }
            }, 500);
          }
        }
      }
    }]);
})();
