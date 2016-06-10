'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoServiceCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        $scope.deleteService = function () {
          ServicesService.deleteService($scope.service.versionedId.id);
        };

        $scope.showEditServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.isEditService = true;
        };

        $scope.onChangeBillable = function () {
          $scope.disabledCheckbox = true;
          var service = angular.copy($scope.service);
          ServicesService.changeBillableStatus(service.versionedId.id, service.billable, function () {
            $scope.disabledCheckbox = false;
          })
        };

        $scope.$on('cancelEditForm', function () {
          $scope.isEditService = false;
        })

      }]);

}());
