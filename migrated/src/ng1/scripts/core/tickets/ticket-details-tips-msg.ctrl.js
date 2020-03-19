'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsTipsMsgCtrl',
    ['$scope', 'TicketsService', '$state', '$stateParams', 'UsersService', '$rootScope',
      'quicktech.common.services.UserNotificationService', 'quicktech.common.services.TicketsPermissionsService',
      function ($scope, TicketsService, $state, $stateParams, UsersService, $rootScope, UserNotificationService,
                TicketsPermissionsService) {

        $scope.TicketsPermissionsService = TicketsPermissionsService;

        calculateDays();

        $scope.markAsOpen = function () {
          TicketsService.changeStatus($scope.ticketDetails.id, 'IN_PROGRESS', function (resp) {
            if (resp.code == 403) {
              var user = UsersService.getOneById(resp.message);
              alert($scope.getUserName(user) + ' locked this ticket to create invoice!');
              return;
            }
            $rootScope.$broadcast('getCountsTickets', null);
            UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as open', true);
            $scope.uncheckTicket($scope.ticketDetails.id);
          });
        };

        $scope.getCorrectUserName = function (userId) {

          if (!userId) {
            return;
          }

          if (userId === $scope.currentUser.id) {
            return 'You';
          } else {
            var userName = $scope.getUserName($scope.getUserById(userId));
            return userName;
          }

        };

        $scope.getSpamMessages = function (userId, option) {
          var isCanMarkAsSpam = $scope.currentUser.isOwner && !$scope.ticketDetails.spamMarker;

          if ($scope.currentUser.id === userId) {
            if (option === 'MARK') {
              return 'marked this ticket as spam, but you can ' +
                (TicketsPermissionsService.isActionVisible('delete_forever', $scope.ticketDetails) ? 'either delete the ticket forever or ' : '') +
                'restore the ticket status anytime, using the respective option.';
            } else {
              return 'reported this ticket as spam, but you can ' +
                (TicketsPermissionsService.isActionVisible('delete_forever', $scope.ticketDetails) ? 'either delete the ticket forever or ' : '') +
                'restore the ticket status anytime, using the respective option.';
            }
          } else {
            if (option === 'MARK') {
              if (TicketsPermissionsService.isActionVisible('delete_forever', $scope.ticketDetails)) {
                return 'has marked it as spam. You can either delete the ticket forever or restore the ticket status anytime, using the respective option.';
              } else {
                return 'has marked it as spam. You can restore the ticket status anytime, using the respective option.';
              }
            } else {
              if (TicketsPermissionsService.isActionVisible('delete_forever', $scope.ticketDetails)) {
                return 'has reported it as spam. You can either ' +
                  (isCanMarkAsSpam ? 'mark it as spam or ' : '') +
                  'delete the ticket forever or restore the ticket status anytime, using the respective option.';
              } else {
                return 'has reported it as spam. You can ' +
                  (isCanMarkAsSpam ? 'mark it as spam or ' : '') +
                  'restore the ticket status anytime, using the respective option.';
              }
            }
          }
        };

        function calculateDays() {
          var now = new Date(),
            msToDaysCof = 86400000;

          var isWithinThirtyDays = (now - $scope.ticketDetails.closedAt) / msToDaysCof;

          $scope.daysLeftToOpen = Math.ceil(30 - isWithinThirtyDays);
        }

      }]);

}());
