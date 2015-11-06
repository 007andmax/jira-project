'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.myProfileEditLabelCtrl',
    ['$scope', '$state', '$stateParams', '$location', 'UsersService', 'TicketTagsService',
      'quicktech.common.services.UserNotificationService',
      function ($scope, $state, $stateParams, $location, UsersService, TicketTagsService, UserNotificationService) {

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
            $scope.disabledSaveEditTag = true;
            TicketTagsService.save($scope.editTag, function () {

              $scope.openEditTagForm();
              $scope.disabledSaveEditTag = false;

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
