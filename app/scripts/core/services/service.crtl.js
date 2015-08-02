'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.serviceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        $scope.deleteService = function () {
          ServicesService.deleteService($scope.service.versionedId.id);
        };

        $scope.showEditServiceForm = function () {
          $rootScope.$emit('cancelEditForm');
          $scope.isEditService = true;
        };

        $rootScope.$on('cancelEditForm', function () {
          $scope.isEditService = false;
        })

      }]);

}());
