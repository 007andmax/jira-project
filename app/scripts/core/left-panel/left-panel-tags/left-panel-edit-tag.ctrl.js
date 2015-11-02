'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelEditTagCtrl',
    ['$scope', '$timeout', 'TicketTagsService', 'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, $timeout, TicketTagsService, UserConfirmationsService, UserNotificationService) {

        var tryToSaveTag = false;
        $scope.tagColors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        if ($scope.tag && $scope.tag.id) {
          $scope.editTag = $scope.tag.staticCopy();
        } else {
          $scope.editTag = {color: 0};
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (tryToSaveTag || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.saveTag = function (form) {
          if (form.$valid) {
            TicketTagsService.save($scope.editTag, function () {

              $scope.openEditTagForm();

              if (!$scope.editTag.id) {
                UserNotificationService.show('New Label "' + $scope.editTag.name + '" has been created', true);
              } else if ($scope.tag.name !== $scope.editTag.name) {
                UserNotificationService.show('The label “' + $scope.tag.name + '” has been modified to “' + $scope.editTag.name + '”', true);
              }
            })
          } else {
            tryToSaveTag = true
          }
        };

        $scope.deleteTag = function () {
          if ($scope.editTag.id && $scope.tagsCount[$scope.editTag.id]) {

            var confirmMesage = 'The label “Device” is associated with ' + $scope.tagsCount[$scope.editTag.id] + ' Ticket(s). Continue with deletion?',
              confirmButton = 'Delete';

            UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
              TicketTagsService.deleteTag($scope.editTag.id, function () {
                $scope.openEditTagForm();
                UserNotificationService.show('The label “' + $scope.editTag.name + '” has been deleted', true);
              })
            });

          } else {

            TicketTagsService.deleteTag($scope.editTag.id, function () {
              $scope.openEditTagForm();
              UserNotificationService.show('The label “' + $scope.editTag.name + '” has been deleted', true);
            })

          }
        };

        $scope.validateTagName = function (ngModelCtrl) {

          for (var i = 0; i < $scope.tags.length; i++) {
            if (ngModelCtrl.$viewValue.toLowerCase() === $scope.tags[i].name.toLowerCase()) {

              if ($scope.tags[i].id === $scope.editTag.id) {
                ngModelCtrl.$setValidity('unique', true);
              } else {
                ngModelCtrl.$setValidity('unique', false);
                return;
              }

            } else {
              ngModelCtrl.$setValidity('unique', true);
            }
          }
        };

      }]);

}());
