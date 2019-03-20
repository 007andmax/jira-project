'use strict';
(function (window, $, undefined) {
  angular.module('quicktech.common.services').factory('quicktech.common.services.RemoteAccessService',
    ['ConstantsService', 'DevicesService', '$uibModal', '$interval', '$rootScope',
      function (ConstantsService, DevicesService, $uibModal, $interval, $rootScope) {
        var modalParams = {
          animation: true,
          backdrop: 'static',
          keyboard: false,
          size: 'custom-size-confirmation-pop',
          windowClass: 'modal-remote',
          templateUrl: '/html/scripts/common/services/local/remote-access-timer.tpl.html',
          controller: ['$scope', '$uibModalInstance', '$rootScope', timerController]
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
            var modalInstance = $uibModal.open(modalParams);
            var promise;
            var remoteConnectPort;
            var restServerAddress;
            var url;



            $rootScope.launchRemoteApp = function() {
              promise = $interval(function () {
                counter++;
              }, 1000);
              remoteConnectPort = ConstantsService.getConstant('remote.connect.port', function (resp) {
                  remoteConnectPort = resp;
                }),
                restServerAddress = ConstantsService.getConstant('rest.server.address', function (resp) {
                  restServerAddress = resp;
                }),
                url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + realSessionId;
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
            // var remoteConnectPort = ConstantsService.getConstant('remote.connect.port', function (resp) {
            //     remoteConnectPort = resp;
            //   }),
            //   restServerAddress = ConstantsService.getConstant('rest.server.address', function (resp) {
            //     restServerAddress = resp;
            //   }),
            //   url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + realSessionId;
            // // var modalInstance = $uibModal.open(modalParams),
            // //   promise = $interval(function () {
            // //     counter++;
            // //   }, 1000);
            // modalInstance.result.then(angular.noop, function () {
            //   if (promise) {
            //     $interval.cancel(promise);
            //   }
            // });
            // DevicesService.subscribeToRemoteConnection(realSessionId, function () {
            //   if (modalInstance) {
            //     modalInstance.dismiss();
            //   }
            //   if (promise) {
            //     $interval.cancel(promise);
            //   }
            //   $rootScope.currentRemoteSessionId = realSessionId;
            // });
            // window.open(url, '_self');
          }
        }
        function timerController($scope, $uibModalInstance, $rootScope) {
          $scope.launchApp = $rootScope.launchRemoteApp;
          $scope.getCounter = getCounter;
          $scope.close = $uibModalInstance.dismiss;
          $scope.download = function () {
            window.location.href = '/data/connection-viewer';
            $scope.close();
          };

          var modal

          var interval = setInterval(function() {
            modal = document.querySelector('[uib-modal-window=modal-window]');

            if (!modal) return;

            modal.style.height = '550px';

            if (modal) clearInterval(interval);


          }, 50)

          $scope.$on('$destroy', function() {
            modal.style.height = 'auto';
          })


        }
        function getCounter() {
          return counter;
        }
        return {
          connectRemoteAccess: connectRemoteAccess
        }
      }]);
})(window, jQuery);
