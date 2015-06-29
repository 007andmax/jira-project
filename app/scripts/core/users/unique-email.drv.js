'use strict';

(function () {

    angular.module("quicktech.core.users").directive('uniqueUserEmail',
        ['UsersService',
            function (UsersService) {
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function (scope, element, attrs, ngModelCtrl) {

                        var email = (ngModelCtrl.$viewValue).toString();

                        console.log("isUnique");
                        var validationResult = UsersService.isEmailUnique(email, function () {
                            ngModelCtrl.$setValidity('unique', validationResult.value);
                        });

                        scope.$watch(function () {
                            return ngModelCtrl.$viewValue
                        }, function () {
                            var validationResult = UsersService.isEmailUnique(email, function () {
                                ngModelCtrl.$setValidity('unique', validationResult.value);
                            });
                        });
                    }
                }
            }]);
})();
