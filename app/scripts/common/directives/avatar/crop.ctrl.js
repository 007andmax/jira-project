'use strict';

(function () {

  angular.module('quicktech.common.directives').controller('quicktech.common.directives.avatar.cropCtrl',
    ['$scope', 'FilesService', '$modalInstance', 'isReposition', 'avatar', 'cropInfo',
      function ($scope, FilesService, $modalInstance, isReposition, avatar, cropInfo) {

        $scope.avatar = avatar;
        $scope.isReposition = isReposition;
        $scope.cropInfo = cropInfo;

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
          $modalInstance.close();
        };

      }]);

}());
