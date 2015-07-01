'use strict';

(function () {

  angular.module("quicktech.core.users").directive('uniqueUserEmail',
    ['UsersService',
      function (UsersService) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            userId: '=userId'
          },
          link: function (scope, element, attrs, ngModelCtrl) {

            validate();

            scope.$watch(function () {
              return ngModelCtrl.$viewValue;
            }, validate);

            function validate() {
              if (ngModelCtrl.$viewValue && (ngModelCtrl.$valid || ngModelCtrl.$error.unique)) {
                var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, scope.userId, function () {
                  ngModelCtrl.$setValidity('unique', validationResult.value);
                });
              }
            }
          }
        }
      }]);
})();
