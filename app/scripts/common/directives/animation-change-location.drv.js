'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('animationChangeLocation',
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          location: '=ngModel'
        },
        link: function ($scope, element, attrs, ctrl) {

          var elem = element.find('[animation-change-location]'),
            location = $(elem.context);

          $scope.$watch('location', function () {
            location.fadeOut(0, function () {
              location.fadeIn(600, function () {
              })
            });
          }, true);
        }
      }
    }]);
})();
