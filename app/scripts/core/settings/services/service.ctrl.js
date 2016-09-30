'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.serviceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        $scope.$watch('service.billable', function (value) {
          $scope.isBillable = value;
        });

        $scope.deleteService = function () {
          ServicesService.deleteService($scope.service.versionedId.id);
        };

        $scope.showEditServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.isEditService = true;
        };

        $scope.onChangeBillable = function () {
          $scope.disabledCheckbox = true;
          ServicesService.changeBillableStatus($scope.service.versionedId.id, !$scope.isBillable, function () {
            $scope.disabledCheckbox = false;
          })
        };

        $scope.$on('cancelEditForm', function () {
          $scope.isEditService = false;
        })

      }]);

}());
