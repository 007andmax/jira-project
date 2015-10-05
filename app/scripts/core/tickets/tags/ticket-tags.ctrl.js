'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketTagsCtrl',
    ['$scope', 'TicketTagsService',
      function ($scope, TicketTagsService) {

        $scope.applyTagsToTicket = function(){

          if(!$scope.ticketId){
            throw 'Error initialization ticketId!!!'
          }

          var tagsToSend = {},
            tagsId = [];

          for(var tagId in $scope.ticketTags){
            if($scope.ticketTags[tagId]){
              tagsId.push(tagId)
            }
          }

          tagsToSend[$scope.ticketId] = tagsId;

          TicketTagsService.link(tagsToSend)

        }

      }]);
}());
