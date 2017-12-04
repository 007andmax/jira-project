'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.userCtrl',
    ['$scope', 'UsersService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, $timeout, UserConfirmationsService) {

        $scope.checkEditUserId = function (index, usersInLine) {

          if (!$scope.editUser || !$scope.editUser.id) {
            return false;
          }

          usersInLine *= 1;


          var isLastInArray = (index + 1) === $scope.usersCtrl.shownUsers.length,
            isLastInLine = index > 0 && !(index % usersInLine);

          if (isLastInLine || isLastInArray) {
            if ($scope.editUser.id === $scope.user.id) {
              return isLastInArray;
            }

            if (isLastInArray && !isLastInLine) {
              var shownUsersCount = $scope.usersCtrl.shownUsers.length - 1;
              var fullRows = Math.floor(shownUsersCount / usersInLine);
              usersInLine = shownUsersCount - fullRows * usersInLine;
            }

            for (var i = 1; i <= usersInLine; i++) {
              if ($scope.editUser.id === $scope.usersCtrl.shownUsers[index - i].id) {
                return true;
              }
            }
          }
        };

        $scope.getUserSubscribeClass = function () {
          if (!$scope.user.subscription) {
            return;
          }

          if ($scope.user.subscription.ticket && $scope.user.subscription.invoice) {
            return 'badge-invoice-and-ticket-updates badge-updates';
          } else if ($scope.user.subscription.ticket && !$scope.user.subscription.invoice) {
            return 'badge-ticket-updates badge-updates';
          } else if (!$scope.user.subscription.ticket && $scope.user.subscription.invoice) {
            return 'badge-invoice-updates badge-updates';
          }
        };

        $scope.getPriorityNumberInfo = function (option) {

          if (!$scope.user.phoneNumbers || ($scope.user.phoneNumbers.length < 1)) {
            return;
          }

          var priorityIndex,
            phoneInfo;

          for (var i = 0; i < $scope.user.phoneNumbers.length; i++) {
            if (priorityIndex === undefined || $scope.user.phoneNumbers[i].priority < priorityIndex) {
              priorityIndex = $scope.user.phoneNumbers[i].priority;
              phoneInfo = $scope.user.phoneNumbers[i].staticCopy();
            }
          }

          if(!phoneInfo){
            return;
          }

          if (option === 'NUMBER') {
            return phoneInfo.number;
          } else {
            switch (phoneInfo.typeNumber) {
              case ('MOBILE'):
                return 'icn-iphone';
              case ('FAX'):
                return 'icn-user-fax';
              case ('OFFICE'):
                return 'icn-user-phone';
            }
          }
        };

        $scope.archiveUser = function () {
          var confirmMesage = 'Do you want to archive ' + $scope.user.firstName + ' ' + $scope.user.lastName + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            try {
              UsersService.archiveUser($scope.user.id);
            } catch (err) {
              confirmButton = 'Ok';
              UserConfirmationsService.show(err, confirmButton, true);
            }
          });
        };

        $scope.dearchiveUser = function (user) {
          var confirmMesage = 'Do you want to restore ' + user.firstName + ' ' + user.lastName + '?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            UsersService.dearchiveUser(user.id);
          });
        };

      }]);

}());
