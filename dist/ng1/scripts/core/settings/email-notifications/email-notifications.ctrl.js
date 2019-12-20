'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.emailNotificationsCtrl',
    ['$scope', 'UsersService',
      function ($scope, UsersService) {

        $scope.emailNotifications = UsersService.getUserEmailNotifications(function () {
          $scope.emailNotifications = $scope.emailNotifications.staticCopy();
        });

        $scope.saveEmailNotifications = function (form) {
          if (form.$valid) {

            var emailObjToSend = {
              newDevice: $scope.emailNotifications.newDevice,
              ticketCreated: $scope.emailNotifications.ticketCreated,
              myTicketUpdated: $scope.emailNotifications.myTicketUpdated,
              ticketCloseNotifications: $scope.emailNotifications.ticketCloseNotifications || false
            };

            UsersService.saveForUserProfile(emailObjToSend, 'email', function () {
              form.$setPristine();
            });
          }
        };

        $scope.ticketCloseNotification = function(form) {
          var data = $scope.ticketClosed || false;
          UsersService.saveForUserProfile(data, 'ticketCloseNotifications', function () {

          });
        }

        // settings/userProfile/ticketCloseNotifications

      }]);

}());
