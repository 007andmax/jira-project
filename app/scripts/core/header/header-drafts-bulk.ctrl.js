'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.draftsBulkCtrl',
    ['$scope', 'DraftsService', '$rootScope', 'quicktech.common.services.UserConfirmationsService',
      'quicktech.common.services.UserNotificationService',
      function ($scope, DraftsService, $rootScope, UserConfirmationsService, UserNotificationService) {

        $scope.deleteForever = function () {
          var confirmMesage = 'The selected ' + $scope.draftsSharedState.selectedIds.length + ' inbox will become inaccessible. Continue with permanent deletion?',
            confirmButton = 'Delete';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            DraftsService.deleteForever($scope.draftsSharedState.selectedIds, function () {

              UserNotificationService.show('The selected ' + $scope.draftsSharedState.selectedIds.length + ' inbox have been deleted', true);
              $rootScope.$broadcast('uncheckAllDrafts', true);
            });
          });
        };

      }]);

}());
