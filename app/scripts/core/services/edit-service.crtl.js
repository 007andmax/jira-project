'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.editServiceCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        if ($scope.service) {
          $scope.editService = $scope.service.staticCopy()
        } else {
          $scope.editService = {};
        }

        $scope.cancelEditService = function () {
          $scope.$emit('cancelEditService');
        };

        $scope.saveEditService = function () {
          console.log("save service");
          //$scope.showCreateService = true
        };

      }]);

}());
