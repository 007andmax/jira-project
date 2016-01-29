'use strict';

(function () {

  angular.module('quicktech.core.quickSupport').controller('quicktech.core.quickSupport.quickSupportCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'quicktech.common.services.RemoteAccessService',
      function ($scope, SharedStateService, RemoteAccessService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.$watch(function () {
          return sharedQuickSession.isCreateNew
        }, function (val) {
          if (val) {
            console.log('must create new session');
            sharedQuickSession.isCreateNew = false;
          }
        });

        $scope.$watch(function () {
          return sharedQuickSession.showAllSession
        }, function (val) {
          if (val) {
            console.log('show all sessions');
          } else {
            console.log('show my sessions');
          }
        });

        $scope.connectRemoteAccess = function () {
          RemoteAccessService.connectRemoteAccess('XXXX-xxxx-xxxx-xxxxxx')
        }

      }]);

}());
