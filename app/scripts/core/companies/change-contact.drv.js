'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("animationChangeContact",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          contacts: '=ngModel'
        },
        link: function ($scope, element) {

          var elem = element.find('[animation-change-contact]'),
            user = $(elem.context);

          $scope.$watch('contacts', function () {
            user.fadeOut(0, function () {
              user.fadeIn(300, function () {
              })
            });
          }, true);
        }
      }
    }]);
})();
