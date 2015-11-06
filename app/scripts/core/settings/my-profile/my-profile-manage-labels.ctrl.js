'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileManageLabelsCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService', 'TicketTagsService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, $state, $stateParams, $location, UsersService, TicketTagsService, UserConfirmationsService, UserNotificationService) {

        $scope.tags = TicketTagsService.getList($scope);
        $scope.tagsCount = TicketTagsService.getTicketsCounts($scope);

        $scope.openEditTagForm = function (tagId) {
          $scope.editTagId = tagId;
        };

        $scope.deleteTag = function (tagId, tagName) {
          if (tagId && $scope.tagsCount[tagId]) {

            var confirmMesage = 'The label “Device” is associated with ' + $scope.tagsCount[tagId] + ' Ticket(s). Continue with deletion?',
              confirmButton = 'Delete';

            UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
              TicketTagsService.deleteTag(tagId, function () {
                $scope.openEditTagForm();
                UserNotificationService.show('The label “' + tagName + '” has been deleted', true);
              })
            });

          } else {

            TicketTagsService.deleteTag(tagId, function () {
              $scope.openEditTagForm();
              UserNotificationService.show('The label “' + tagName + '” has been deleted', true);
            })

          }
        };

      }]);

}());
