'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.companyServiceCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        $scope.deleteService = function () {
          console.log("delete service");
        };

        $scope.editService = function () {
          $scope.showEditService = true;
        };

        $scope.cancelEditService = function () {
          $scope.showEditService = false;
        };

        $scope.saveEditService = function () {
          console.log("save service");
          $scope.showCreateService = true
        };

      }]);

}());
