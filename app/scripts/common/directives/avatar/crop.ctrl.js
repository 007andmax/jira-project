'use strict';

(function () {

  angular.module('quicktech.common.directives').controller('quicktech.common.directives.avatar.cropCtrl',
    ['$scope', 'FilesService', '$modalInstance', 'isReposition', 'avatar',
      function ($scope, FilesService, $modalInstance, isReposition, avatar) {

        $scope.avatar = avatar;
        $scope.isReposition = isReposition;

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

        $scope.save = function () {
          $modalInstance.close();
        };

      }]);

}());
