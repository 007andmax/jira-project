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

        $scope.remoteAccess = function () {

          console.log('remoteAccess - ' + $scope.agent.agentId);

          //console.log($scope.agent);
          //
          //var url;
          //
          //var remoteConnectPort = ConstantsService.getConstant('remote.connect.port');
          //var restServerAddress = ConstantsService.getConstant('rest.server.address');
          //var proxyServerPort = ConstantsService.getConstant('proxy.server.port');
          //var stunPort = ConstantsService.getConstant('stun.port');
          //
          //console.log(remoteConnectPort, restServerAddress, proxyServerPort, stunPort);
          //
          //if ($scope.agent.type === 'printer') {
          //  url = 'quicktech://connect?agentID=' + device.onlineAgentId + '&proxyDeviceIP=' + device.ip + '&serverIP=' +
          //    $rootScope.restServerAddress + '&port=' + $rootScope.proxyServerPort + '&userID=' + $scope.currentUser.id + '&connectionType=PROXY';
          //} else {
          //
          //  console.log('not printer')
          //
          //  url = 'quicktech://connect?agentID=' + $scope.agent.agentId + '&serverIP=' + restServerAddress +
          //    '&port=' + remoteConnectPort + '&stunPort=' + stunPort + '&userID=' +
          //    $scope.currentUser.id + '&connectionType=VNC';
          //}
          //
          //url += ('&hostName=' + (!!device.hostName ? device.hostName : device.ip));
          //
          //console.log(url)

          //UrlScheme.checkAndOpen(url, function () {
          //
          //  if (confirm("Cannot share screen, probably you have not installed viewer. Would you like to download it?")) {
          //
          //    DataService.get({action: 'getLinkToViewer'}, function (resp) {
          //
          //      if (resp.link) {
          //        Downloader.downloadByUrl(resp.link);
          //      } else {
          //        alert("Cannot receive link to viewer, please contact your server administrator.");
          //      }
          //    });
          //  }
          //});
          //
          //DevicesService
        };

        $scope.sendAlert = function () {
          console.log('sendAlert - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.specReport = function () {
          console.log('specReport - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.transferFile = function () {
          console.log('transferFile - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.restart = function () {
          console.log('restart - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.shutdown = function () {
          console.log('shutdown - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.remove = function () {
          console.log('remove - ' + $scope.agent.agentId);
          //DevicesService
        }

      }]);

}());
