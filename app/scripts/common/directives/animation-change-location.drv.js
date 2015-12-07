'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('animationChangeLocation',
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          location: '=ngModel',
          locationIndex: '=locationIndex'
        },
        link: function ($scope, element) {

          var elem = element.find('[animation-change-location]'),
            location = $(elem.context);

          $scope.$watch('locationIndex', function () {
            location.fadeOut(300, function () {
              location.fadeIn(300, function () {
              })
            });
          }, true);
        }
      }
    }]);
})();
