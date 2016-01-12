'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyNetworkDeviceCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        console.log($scope.device)

        $scope.isDeviceOnline = function(){
          if($scope.device.agentStatus && $scope.device.agentStatus !== 'unknown'){

            return $scope.device.agentStatus === 'managed';

          } else {

            return false;

          }
        };

      }]);

}());
