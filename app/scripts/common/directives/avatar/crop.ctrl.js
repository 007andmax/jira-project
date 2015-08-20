'use strict';

(function () {

  angular.module('quicktech.common.directives').controller('quicktech.common.directives.avatar.cropCtrl',
    ['$scope', 'FilesService', '$modalInstance', 'image', 'avatar',
      function ($scope, FilesService, $modalInstance, image, avatar) {

        $scope.avatar = avatar;
        $scope.image = image;

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
          $modalInstance.close($scope.getCroppedDataUrl());
        };

      }]);

}());
