'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.headerTicketTagsCtrl',
    ['$scope', 'TicketTagsService',
      function ($scope, TicketTagsService) {

        var bulkTicketsTagsToSend = {};
        $scope.bulkTicketsTags = {};

        $scope.createTagsMatrix = function () {

          var countTags = {};
          $scope.bulkTicketsTags = {};

          for (var i = 0; i < $scope.tags.length; i++) {
            countTags[$scope.tags[i].id] = 0;
            $scope.bulkTicketsTags[$scope.tags[i].id] = {val: false, isHalf: false};
          }

          for (var ticketId in $scope.sharedState.ticketTags) {
            bulkTicketsTagsToSend[ticketId] = [];

            var ticketTags = $scope.sharedState.ticketTags[ticketId];
            for (var i = 0; i < ticketTags.length; i++) {
              var tagId = ticketTags[i].id;

              bulkTicketsTagsToSend[ticketId].push(tagId);
              countTags[tagId]++;
              $scope.bulkTicketsTags[tagId].val = true;
            }
          }

          var ticketsCount = Object.keys($scope.sharedState.ticketTags).length;

          for (var tagId in $scope.bulkTicketsTags) {
            var isHalf = (countTags[tagId] !== ticketsCount) && countTags[tagId] > 0;
            $scope.bulkTicketsTags[tagId].isHalf = isHalf;
          }

        };

        $scope.changeTagCheckbox = function (tagId, val) {

          $scope.bulkTicketsTags[tagId].isHalf = false;

          for (var ticketId in bulkTicketsTagsToSend) {

            if (val) {
              bulkTicketsTagsToSend[ticketId].push(tagId);
            } else {

              var index = bulkTicketsTagsToSend[ticketId].indexOf(tagId);

              if (index > -1) {
                bulkTicketsTagsToSend[ticketId].splice(index, 1);
              }
            }
          }

        };

        $scope.bulkApplyTagsToTicket = function () {
          TicketTagsService.link(bulkTicketsTagsToSend, function () {
            $scope.uncheckAllTickets();
          })
        };

      }]);
}());
