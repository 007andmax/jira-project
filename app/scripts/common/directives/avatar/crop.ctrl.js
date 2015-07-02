'use strict';

(function () {

  angular.module('quicktech.common.directives').controller('quicktech.common.directives.avatar.cropCtrl',
    ['$scope', 'FilesService', '$modalInstance', 'image', 'avatar',
      function ($scope, FilesService, $modalInstance, image, avatar) {

        var step = 1,
          reduceScaleInterval,
          increaseScaleInterval;

        $scope.avatar = avatar;
        $scope.image = image;

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
          $modalInstance.close($scope.getCroppedDataUrl());
        };

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
          var scale = ($scope.avatar.scale * 1) + val;

          if (scale < 0) {
            clearInterval(reduceScaleInterval);
          } else if (scale > 100) {
            clearInterval(increaseScaleInterval);
          }

          scale = Math.max(scale, 0);
          scale = Math.min(scale, 100);

          $scope.$apply(function () {
            $scope.avatar.scale = scale;
          })
        }

      }]);

}());
