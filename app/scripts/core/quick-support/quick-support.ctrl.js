'use strict';

(function () {

  angular.module('quicktech.core.quickSupport').controller('quicktech.core.quickSupport.quickSupportCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.RemoteAccessService',
      'DevicesService', 'ConstantsService',
      function ($scope, SharedStateService, RemoteAccessService, DevicesService, ConstantsService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.host = ConstantsService.getConstant('server.url');
        $scope.showHost = $scope.host.replace(/.*?:\/\//g, "")
        $scope.statusMap = {
          'URL_GENERATED': 'URL has been generated',
          'URL_OPENED': 'URL has been opened',
          'DOWNLOADED': 'Agent has been downloaded',
          'INSTALLED': 'Agent has been installed',
          'UNINSTALLED': 'Agent has been uninstalled',
          'CONNECTED': 'Agent has been connected',
          'ENDED': 'Agent finished connected'
        };

        $scope.remoteSessions = DevicesService.getRemoteSessions($scope, function () {
          $scope.$watch(function () {
            return sharedQuickSession.isCreateNew
          }, function (val) {
            if (val) {
              sharedQuickSession.isCreateNew = false;
              DevicesService.createOneTimeRemoteSession()
            }
          });
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
          DevicesService.deleteRemoteSession(sessionId)
        };

        $scope.isUserOnline = function (session) {
          return (session.status === 'INSTALLED' || session.status === 'CONNECTED' || session.status === 'ENDED') && session.online;
        }

      }]);

}());
