'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.userCtrl',
    ['$scope',
      function ($scope) {

        $scope.checkEditUserId = function (index) {

          if (index % 2) {
            return $scope.editUserId === $scope.user.id
              || $scope.editUserId === $scope.shownUsers[index - 1].id;
          } else {
            return $scope.editUserId === $scope.user.id && (index + 1) === $scope.shownUsers.length;
          }

        };

      }]);

}());
