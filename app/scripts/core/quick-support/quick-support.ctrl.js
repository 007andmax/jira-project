'use strict';

(function () {

  angular.module('quicktech.core.quickSupport').controller('quicktech.core.quickSupport.quickSupportCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.RemoteAccessService',
      'DevicesService',
      function ($scope, SharedStateService, RemoteAccessService, DevicesService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.showAllSession = false;
        $scope.statusMap = {
          'URL_GENERATED': 'Url has been generated',
          'URL_OPENED': 'Url has been opened',
          'DOWNLOADED': 'Agent has been download',
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
            RemoteAccessService.connectRemoteAccess(sessionId, conectionType);
          }
        };

        $scope.deleteRemoteSession = function (sessionId) {
          DevicesService.deleteRemoteSession(sessionId)
        }

      }]);

}());
