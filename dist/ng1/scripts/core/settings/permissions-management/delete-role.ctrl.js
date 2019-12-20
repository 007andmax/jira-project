'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('deleteRoleCtrl', [
        '$scope', '$uibModalInstance', '$rootScope',
        function($scope, $uibModalInstance, $rootScope) {
          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

        }
      ]);

}());
