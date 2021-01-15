'use strict';

(function () {

  angular.module('quicktech.core.quickSupport').controller('quicktech.core.quickSupport.quickSupportCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.RemoteAccessService',
      'DevicesService', 'ConstantsService', 'quicktech.common.services.UserNotificationService', '$timeout', '$rootScope',
      function ($scope, SharedStateService, RemoteAccessService, DevicesService,
        ConstantsService, UserNotificationService, $timeout, $rootScope) {

        UserNotificationService.show('Loading...');

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.createOneTimeRemoteSession = function () {
          initQuickSUpportButtonDissabled();
          DevicesService.createOneTimeRemoteSession();
        };

        $scope.createOneTimeRemoteSessionButtonDisable = false;
        function initQuickSUpportButtonDissabled() {
          $scope.createOneTimeRemoteSessionButtonDisable = true;
          $timeout(function () {
            $scope.createOneTimeRemoteSessionButtonDisable = false;
          }, 4000);
        }

        $scope.host = ConstantsService.getConstant('server.url', function (resp) {
          $scope.host = resp;
          $scope.showHost = $scope.host.replace(/.*?:\/\//g, "");
        });
        $scope.statusMap = {
          'URL_GENERATED': 'URL has been generated',
          'URL_OPENED': 'URL has been opened',
          'DOWNLOADED': 'Agent has been downloaded',
          'INSTALLED': 'Agent has been installed',
          'UNINSTALLED': 'Agent has been uninstalled',
          'CONNECTED': 'Agent has been connected',
          'ENDED': 'Agent finished connected'
        };

        $scope.loadingInProgress = true;

        $scope.remoteSessions = DevicesService.getRemoteSessions($scope, function () {
          $scope.$watch(function () {
            return sharedQuickSession.isCreateNew
          }, function (val) {
            if (val) {
              sharedQuickSession.isCreateNew = false;
              DevicesService.createOneTimeRemoteSession()
            }
            UserNotificationService.hide();
          });
          $scope.loadingInProgress = false;
        });

        $scope.$watch(function () {
          return sharedQuickSession.showAllSession
        }, function (val) {
          $scope.showAllSession = val;
        });

        $scope.connectRemoteAccess = function (sessionId, conectionType) {
          if (sessionId && conectionType) {
            RemoteAccessService.connectRemoteAccess(sessionId, conectionType, true);
          }
        };

        $scope.deleteRemoteSession = function (sessionId) {
          $scope.lastDeletedId = sessionId;
          DevicesService.deleteRemoteSession(sessionId);
        };

        $scope.isUserOnline = function (session) {
          return (session.status === 'INSTALLED' || session.status === 'CONNECTED' || session.status === 'ENDED') && session.online;
        }

      }]);

}());
