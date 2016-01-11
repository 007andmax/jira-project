'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.companyDevicesDeviceCtrl',
    ['$scope', '$sce', 'DevicesService',
      function ($scope, $sce, DevicesService) {

        //var passwordAgent = "PassWord";
        //
        //$scope.deviceDescription = $scope.agent.description && $scope.agent.description !== 'unknown' ? $scope.agent.description : '';
        //
        //$scope.keyTooltip = $sce.trustAsHtml("<span class='text-muted'>PASSWORD</span><span class='password-txt'>" + passwordAgent + "</span>");

        //$scope.closeDropdown = function(){
        //  $scope.dropdownStatus.isopen = false;
        //  $scope.deviceDescription = $scope.device.description && $scope.device.description !== 'unknown' ? $scope.device.description : '';
        //};

        $scope.remoteAccess = function(){
          console.log('remoteAccess - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.sendAlert = function(){
          console.log('sendAlert - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.specReport = function(){
          console.log('specReport - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.transferFile = function(){
          console.log('transferFile - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.restart = function(){
          console.log('restart - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.shutdown = function(){
          console.log('shutdown - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.remove = function(){
          console.log('remove - ' + $scope.agent.agentId);
          //DevicesService
        }

      }]);

}());
