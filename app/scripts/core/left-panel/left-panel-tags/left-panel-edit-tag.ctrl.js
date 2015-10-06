'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelEditTagCtrl',
    ['$scope', 'TicketTagsService',
      function ($scope, TicketTagsService) {

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
            })
          } else {
            tryToSaveTag = true
          }
        };

        $scope.deleteTag = function () {
          TicketTagsService.deleteTag($scope.editTag.id, function () {
            $scope.openEditTagForm();
          })
        };

        $scope.validateTagName = function (ngModelCtrl) {

          for (var i = 0; i < $scope.tags.length; i++) {
            if (ngModelCtrl.$viewValue.toLowerCase() === $scope.tags[i].name.toLowerCase()) {
              ngModelCtrl.$setValidity('unique', false);
              return;
            } else {
              ngModelCtrl.$setValidity('unique', true);
            }
          }
        };

      }]);

}());
