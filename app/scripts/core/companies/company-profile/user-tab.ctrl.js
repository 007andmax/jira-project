'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.userTabCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService',
      function ($scope, UsersService, SubscriptionsService) {

        $scope.changeUserRole = function (role) {
          UsersService.changeUserRole($scope.user.id, role)
        };

        $scope.changeUserSubscription = function (nameSubscription) {

          var subscription = $scope.userSubscriptionsByCompanyId[$scope.user.id];

          if (subscription) {
            subscription = subscription.staticCopy();
          } else {
            subscription = {
              user: {id: $scope.user.id}
            }
          }

          subscription[nameSubscription] = !subscription[nameSubscription];

          SubscriptionsService.saveUserSubscription(subscription);
        };

        $scope.archiveUser = function () {
          UsersService.deleteOrArchiveUser($scope.user.id, true, function () {
            if (delete $scope.selectedUsers[$scope.user.id]) {
              $scope.changeSelectedUsers();
            }
          })
        };

        $scope.sendMail = function () {
          console.log('send mail ' + $scope.user.id);
        };

        $scope.startChat = function () {
          console.log('start chat ' + $scope.user.id);
        };

      }]);

}());
