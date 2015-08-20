'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("zoomSlider", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      templateUrl: '/html/scripts/common/directives/zoom-slider/zoom-slider.tpl.html',
      scope: {
        scale: '=ngModel'
      },
      link: function ($scope, element, attrs, ngModelCtrl) {

        var step = 1,
          reduceScaleInterval,
          increaseScaleInterval;

        $scope.startReduceScale = function () {
          reduceScaleInterval = setInterval(function () {
            addToScale(-step);
          }, 10);
        };

        $scope.stopReduceScale = function () {
          clearInterval(reduceScaleInterval);
        };

        $scope.startIncreaseScale = function () {
          increaseScaleInterval = setInterval(function () {
            addToScale(step);
          }, 10);
        };

        $scope.stopIncreaseScale = function () {
          clearInterval(increaseScaleInterval);
        };

        function addToScale(val) {
          var scale = (ngModelCtrl.$viewValue * 1) + val;

          if (scale < 0) {
            clearInterval(reduceScaleInterval);
          } else if (scale > 100) {
            clearInterval(increaseScaleInterval);
          }

          scale = Math.max(scale, 0);
          scale = Math.min(scale, 100);

          ngModelCtrl.$setViewValue(scale);
        }
      }
    }
  });
})();
