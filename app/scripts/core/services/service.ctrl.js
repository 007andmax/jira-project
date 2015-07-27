'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.serviceCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        $scope.deleteCompanyService = function () {
          console.log("delete service");
        };

        $scope.editCompanyService = function () {
          $scope.showEditService = true;
        };

        $scope.cancelEditCompanyService = function () {
          $scope.showEditService = false;
        };

        $scope.saveEditCompanyService = function () {
          console.log("saveEdit");
        };

      }]);

}());
