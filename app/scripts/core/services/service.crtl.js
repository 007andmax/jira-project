'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.serviceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        $scope.deleteService = function () {
          ServicesService.deleteService($scope.service.versionedId.id);
        };

        $scope.showEditServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.isEditService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.isEditService = false;
        })

      }]);

}());
