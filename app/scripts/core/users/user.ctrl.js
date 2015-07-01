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
            isLastInLine = index > 0 && !((index + 1 ) % usersInLine);

          if (isLastInLine || isLastInArray) {
            if ($scope.editUser.id === $scope.user.id) {
              return true;
            }

            if (isLastInArray && !isLastInLine) {
              var fullRows = Math.floor($scope.shownUsers.length / usersInLine);
              usersInLine = $scope.shownUsers.length - fullRows * usersInLine;
            }

            for (var i = 1; i < usersInLine; i++) {
              if ($scope.editUser.id === $scope.shownUsers[index - i].id) {
                return true;
              }
            }
          }
        };

      }]);

}());
