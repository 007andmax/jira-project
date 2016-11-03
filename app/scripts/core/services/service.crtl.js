'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.serviceCtrl',
    ['$scope', '$rootScope', 'ServicesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, $rootScope, ServicesService, UserConfirmationsService) {

        $scope.deleteService = function () {
          var confirmMesage = 'Do you want to delete ' + $scope.service.name + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            ServicesService.deleteService($scope.service.versionedId.id);
          });
        };

        $scope.onChangeBillable = function () {
          $scope.disabledCheckbox = true;
          ServicesService.changeBillableStatus($scope.service.versionedId.id, !$scope.service.billable, function () {
            $scope.disabledCheckbox = false;
          })
        };

      }]);

}());
