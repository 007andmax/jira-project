'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("changeContact",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          contacts: '=ngModel'
        },
        link: function ($scope, element) {

          var user = $(element.context);

          $scope.$watch('contacts', function () {
            user.fadeOut(0, function () {
              user.fadeIn(600, function () {
              })
            });
          }, true);
        }
      }
    }]);
})();
