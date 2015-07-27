'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.serviceCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        $scope.deleteService = function () {
          console.log("delete service");
        };

        $scope.showEditServiceForm = function () {
          $scope.isEditService = true;
        };

        $scope.$on('cancelEditService', function () {
          $scope.isEditService = false;
        })

      }]);

}());
