'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("isUniqValidation",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          validationFunc: '=validationFunc',
          modelId: '=modelId',
          isEmptyValid: '=isEmptyValid'
        },
        link: function (scope, element, attrs, ngModelCtrl) {

          var timeoutId;

          validate();

          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, validate);

          scope.$watch(function() {
            return scope.$parent.userCompany && scope.$parent.userCompany.id;
          }, function() {
            validate(ngModelCtrl.$vievValue, ngModelCtrl.$vievValue, true);
          })

          function validate(newValue, prevValue, forceValidation) {
            if (newValue !== prevValue || forceValidation) {
              if (timeoutId) {
                $timeout.cancel(timeoutId);
              }
              timeoutId = setValidationTimeout();
            }
          }

          function setValidationTimeout() {
            ngModelCtrl.$$parentForm.$setValidity('pending', false);
            return $timeout(function () {
              if (!ngModelCtrl.$viewValue && scope.isEmptyValid) {
                ngModelCtrl.$$parentForm.$setValidity('pending', true);
              }

              if (ngModelCtrl.$viewValue && (ngModelCtrl.$valid || ngModelCtrl.$error.unique) && scope.validationFunc) {
                scope.validationFunc(ngModelCtrl, scope.modelId, function () {
                  ngModelCtrl.$$parentForm.$setValidity('pending', true);
                });
              }
            }, 500);
          }
        }
      }
    }]);
})();
