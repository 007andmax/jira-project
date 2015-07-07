'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("isUniqValidation",
    ['UsersService', 'CompaniesService', 'ContactsService',
      function (UsersService, CompaniesService, ContactsService) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            valid: '=validType'
          },
          link: function (scope, element, attrs, ngModelCtrl) {

            validate();

            scope.$watch(function () {
              return ngModelCtrl.$viewValue;
            }, validate);

            function validate() {
              if (ngModelCtrl.$viewValue && (ngModelCtrl.$valid || ngModelCtrl.$error.unique)) {
                scope.valid(ngModelCtrl, UsersService, CompaniesService, ContactsService);
              }
            }
          }
        }
      }]);
})();
