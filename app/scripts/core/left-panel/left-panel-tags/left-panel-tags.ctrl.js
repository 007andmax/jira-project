'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelTagsCtrl',
    ['$scope', 'TicketTagsService',
      function ($scope, TicketTagsService) {

        $scope.tags = TicketTagsService.getList($scope);

        $scope.openEditTagForm = function (tagId) {
          $scope.editTagId = tagId;
        };

        $scope.tagsCount = TicketTagsService.getTicketsCounts($scope);

      }]);
}());
