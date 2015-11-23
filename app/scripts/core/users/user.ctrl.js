'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.userCtrl',
    ['$scope',
      function ($scope) {

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

        $scope.getUserSubscribleClass = function () {
          if (!$scope.subscriptions[$scope.user.id]) {
            return;
          }

          if ($scope.subscriptions[$scope.user.id].ticket && $scope.subscriptions[$scope.user.id].invoice) {
            return 'badge-invoice-and-ticket-updates badge-updates';
          } else if ($scope.subscriptions[$scope.user.id].ticket && !$scope.subscriptions[$scope.user.id].invoice) {
            return 'badge-ticket-updates badge-updates';
          } else if (!$scope.subscriptions[$scope.user.id].ticket && $scope.subscriptions[$scope.user.id].invoice) {
            return 'badge-invoice-updates badge-updates';
          }
        };

        $scope.getUserSubscribleTooltip = function () {
          if (!$scope.subscriptions[$scope.user.id]) {
            return;
          }

          if ($scope.subscriptions[$scope.user.id].ticket && $scope.subscriptions[$scope.user.id].invoice) {
            return 'subscriber invoice and ticket updates';
          } else if ($scope.subscriptions[$scope.user.id].ticket && !$scope.subscriptions[$scope.user.id].invoice) {
            return 'subscriber ticket updates';
          } else if (!$scope.subscriptions[$scope.user.id].ticket && $scope.subscriptions[$scope.user.id].invoice) {
            return 'subscriber invoice updates';
          }
        };

      }]);

}());
