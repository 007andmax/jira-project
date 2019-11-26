'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.confirmModalCtrl',
    ['$scope', 'DevicesService', '$uibModalInstance', 'action', 'devices', 'companyId',
      function ($scope, DevicesService, $uibModalInstance, action, devices, companyId) {
        $scope.closeWindow = $uibModalInstance.dismiss;
        $scope.action = action;
        $scope.devices = devices;

        var strEnd;


        if (typeof devices === 'string' || devices.length === 1) {
          strEnd = '';
        } else if (devices.length > 1) {
          strEnd = 's'
        }

        $scope.strEnd = strEnd;
        $scope.method = function() {
          DevicesService.sendPowerAction(companyId, devices, action);
         
          $scope.closeWindow()
        }
      }]);

}());
