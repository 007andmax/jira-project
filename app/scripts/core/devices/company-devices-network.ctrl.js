'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyNetworkDeviceCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        console.log($scope.device)

        $scope.isDeviceOnline = function(){
          if($scope.device.agentStatus && $scope.device.agentStatus !== 'unknown'){

            var spliceIndex = $scope.device.agentStatus.lastIndexOf('_') + 1;
            var status = ($scope.device.agentStatus).slice(spliceIndex);

            return status === 'online';

          } else {

            return false;

          }
        };

      }]);

}());
