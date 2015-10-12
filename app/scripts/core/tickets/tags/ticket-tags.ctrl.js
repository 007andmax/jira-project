'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketTagsCtrl',
    ['$scope', 'TicketTagsService', 'quicktech.common.services.UserNotificationService', 'Utils',
      function ($scope, TicketTagsService, UserNotificationService, Utils) {

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

            var applyLabels = [],
              removeLebels = [],
              infoObj = {},
              notifyMessage;

            for(var i = 0; i < tagsId.length; i++){
              infoObj[tagsId[i]] = 'apply';
              for(var j = 0; j < $scope.ticketTagsUntilApply.length; j++){
                if(tagsId[i] === $scope.ticketTagsUntilApply[j].id){
                  delete infoObj[tagsId[i]];
                }
              }
              if(infoObj[tagsId[i]] === 'apply'){
                applyLabels.push(' ' + Utils.findById($scope.tags, tagsId[i]).name)
              }
            }

            for(var j = 0; j < $scope.ticketTagsUntilApply.length; j++){
              var countLabels = 0;
              for(var i = 0; i < tagsId.length; i++){
                if(tagsId[i] == $scope.ticketTagsUntilApply[j].id){
                  countLabels++
                }
              }
              if(countLabels === 0){
                infoObj[$scope.ticketTagsUntilApply[j].id] = 'delete';
                removeLebels.push(' ' + $scope.ticketTagsUntilApply[j].name)
              }
            }

            if(applyLabels.length === 1){
              notifyMessage = 'The label "' + applyLabels[0] + '" has been applied to ' + $scope.ticketNumber;
            } else if (applyLabels.length > 1){
              notifyMessage = 'The labels ' + applyLabels + ' have been applied to ' + $scope.ticketNumber;
            }

            if(removeLebels.length === 1){

              if(notifyMessage){
                notifyMessage += '. The label "' + removeLebels[0] + '" has been removed from ' + $scope.ticketNumber;
              } else {
                notifyMessage = 'The label "' + removeLebels[0] + '" has been removed from ' + $scope.ticketNumber;
              }

            } else if (removeLebels.length > 1){

              if(notifyMessage){
                notifyMessage += '. The labels ' + removeLebels + ' have been removed from ' + $scope.ticketNumber;
              } else {
                notifyMessage = 'The labels ' + removeLebels + ' have been removed from ' + $scope.ticketNumber;
              }
            }

            UserNotificationService.show(notifyMessage, true);

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
