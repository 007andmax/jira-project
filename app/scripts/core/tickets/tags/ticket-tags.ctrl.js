'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketTagsCtrl',
    ['$scope', 'TicketTagsService', 'quicktech.common.services.UserNotificationService',
      function ($scope, TicketTagsService, UserNotificationService) {

        $scope.applyTagsToTicket = function () {

          if (!$scope.ticketId) {
            throw 'Error initialization ticketId!!!'
          }

          var tagsToSend = {},
            tagsId = [];

          for (var tagId in $scope.ticketTags) {
            if ($scope.ticketTags[tagId]) {
              tagsId.push(tagId)
            }
          }

          tagsToSend[$scope.ticketId] = tagsId;

          TicketTagsService.link(tagsToSend, function () {
//TODO messages
            UserNotificationService.show('TODO messages', true);

          })

        };

        $scope.$watch('ticketTags', function () {
          var count = 0;
          for (var tagId in $scope.ticketTags) {
            if ($scope.ticketTags[tagId]) {
              count++;
            }
          }

          if (count > 2) {
            $scope.disabledTags = true;
          } else {
            $scope.disabledTags = false;
          }
        }, true);

        $scope.showNotificationMessage = function(){
          UserNotificationService.show('More than 3 labels cannot be applied', true);
        }

      }]);
}());
