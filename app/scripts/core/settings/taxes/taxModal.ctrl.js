'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('taxModalCtrl', [
        '$scope', '$uibModalInstance', '$rootScope',
        function($scope, $uibModalInstance, $rootScope) {
          $scope.closeModal = function () {
            $uibModalInstance.close();
            // if (!$state.includes('service-agreements')) {
            //   $state.go('service-agreements');
            // }
          };

          $scope.$watch(function() {
            return $rootScope.newTaxIsSaved;
          }, function(val) {
            if (val) {
              $rootScope.newTaxFromModal = val;
              $rootScope.newTaxIsSaved = null;
              $scope.closeModal();

            }
          })
        }
      ]);

}());
