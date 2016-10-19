'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.RemoteAccessService',
    ['ConstantsService', 'DevicesService', '$uibModal', '$interval', '$rootScope',
      function (ConstantsService, DevicesService, $uibModal, $interval, $rootScope) {

        var modalParams = {
          animation: true,
          backdrop: 'static',
          keyboard: false,
          size: 'custom-size-confirmation-pop-up',
          windowClass: 'modal-spam',
          templateUrl: '/html/scripts/common/services/local/remote-access-timer.tpl.html',
          controller: ['$scope', '$uibModalInstance', timerController]
        }, counter, message;

        function connectRemoteAccess(sessionId, conectionType, isOneTime) {

          if (!sessionId) {
            throw 'SessionId is required';
          }

          if (!conectionType) {
            throw 'conectionType is required';
          }

          if (isOneTime) {

            DevicesService.getSessionId(sessionId, conectionType, function (realSessionId) {
              if (!realSessionId || !realSessionId.sessionId || realSessionId.sessionId.length < 1) {
                throw "Not session Id"
              } else {
                createRemoteAccess(realSessionId.sessionId);
              }
            });

          } else {
            createRemoteAccess(sessionId);
          }

          function createRemoteAccess(realSessionId) {
            counter = 0;
            message = 'Wait until the connection is established... ';

            var remoteConnectPort = ConstantsService.getConstant('remote.connect.port', function (resp) {
                remoteConnectPort = resp;
              }),
              restServerAddress = ConstantsService.getConstant('rest.server.address', function (resp) {
                restServerAddress = resp;
              }),
              url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + realSessionId;

            var modalInstance = $uibModal.open(modalParams),
              promise = $interval(function () {
                counter++;
              }, 1000);

            modalInstance.result.then(angular.noop, function () {
              if (promise) {
                $interval.cancel(promise);
              }
            });

            DevicesService.subscribeToRemoteConnection(realSessionId, function () {
              if (modalInstance) {
                modalInstance.dismiss();
              }

              if (promise) {
                $interval.cancel(promise);
              }

              $rootScope.currentRemoteSessionId = realSessionId;
            });

            window.open(url, '_self');
          }

        }

        function timerController($scope, $uibModalInstance) {
          $scope.getCounter = getCounter;
          $scope.close = $uibModalInstance.dismiss;
          $scope.download = function () {
            window.location.href = '/data/connection-viewer';
            $scope.close();
          };
        }

        function getCounter() {
          return counter;
        }

        return {
          connectRemoteAccess: connectRemoteAccess
        }

      }]);

})(window, jQuery);


