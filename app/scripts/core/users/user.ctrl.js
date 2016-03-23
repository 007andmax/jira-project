'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.userCtrl',
    ['$scope', 'UsersService',
      function ($scope, UsersService) {

        $scope.checkEditUserId = function (index, usersInLine) {

          if (!$scope.editUser || !$scope.editUser.id) {
            return false;
          }

          usersInLine *= 1;

          var isLastInArray = (index + 1) === $scope.shownUsers.length,
            isLastInLine = index > 0 && !(index % usersInLine);

          if (isLastInLine || isLastInArray) {
            if ($scope.editUser.id === $scope.user.id) {
              return isLastInArray;
            }

            if (isLastInArray && !isLastInLine) {
              var shownUsersCount = $scope.shownUsers.length - 1;
              var fullRows = Math.floor(shownUsersCount / usersInLine);
              usersInLine = shownUsersCount - fullRows * usersInLine;
            }

            for (var i = 1; i <= usersInLine; i++) {
              if ($scope.editUser.id === $scope.shownUsers[index - i].id) {
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

        $scope.getUserSubscribeTooltip = function () {
          if (!$scope.user.subscription) {
            return;
          }

          if ($scope.user.subscription.ticket && $scope.user.subscription.invoice) {
            return 'subscriber invoice and ticket updates';
          } else if ($scope.user.subscription.ticket && !$scope.user.subscription.invoice) {
            return 'subscriber ticket updates';
          } else if (!$scope.user.subscription.ticket && $scope.user.subscription.invoice) {
            return 'subscriber invoice updates';
          }
        };

        $scope.getPriorityNumberInfo = function (option) {

          if (!$scope.user.phoneNumbers && ($scope.user.phoneNumbers.length < 1)) {
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

        $scope.archiveUsers = function () {
          UsersService.deleteOrArchiveUser($scope.user.id, true);
        };

      }]);

}());
