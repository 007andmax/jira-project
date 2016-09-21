'use strict';

(function () {

  angular.module('quicktech.common.directives').controller('quicktech.common.directives.avatar.cropCtrl',
    ['$scope', 'FilesService', '$uibModalInstance', 'isReposition', 'avatar', 'cropInfo',
      function ($scope, FilesService, $uibModalInstance, isReposition, avatar, cropInfo) {

        $scope.avatar = avatar;
        $scope.isReposition = isReposition;
        $scope.cropInfo = cropInfo;

        $scope.close = function () {
          $uibModalInstance.dismiss('cancel');
        };

        $scope.save = function () {
          $uibModalInstance.close();
        };

      }]);

}());
