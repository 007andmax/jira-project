'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.usersTabCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, SubscriptionsService, UserConfirmationsService) {

        $scope.changeUserRole = function (role) {
          UsersService.changeUserRole($scope.user.id, role)
        };

        $scope.changeUserSubscription = function (nameSubscription) {
          if ($scope.users.length === 1 || $scope.isLastUserWithInvoiceSubscription($scope.user.id)) {
            return;
          }

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
          var user = UsersService.getOneById($scope.user.id);
          var confirmMessage = 'Do you want to archive ' + $scope.getUserName(user);
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
            try {
              UsersService.archiveUser($scope.user.id, function () {
                if (delete $scope.selectedUsers[$scope.user.id]) {
                  $scope.changeSelectedUsers();
                }
              });
            } catch (err) {
              confirmButton = 'Ok';
              UserConfirmationsService.show(err, confirmButton, true);
            }
          });
        };

        $scope.startChat = function () {
          console.log('start chat ' + $scope.user.id);
        };

        $scope.isLastUserWithInvoiceSubscription = function (userId) {
          var users = $scope.userSubscriptionsByCompanyId;

          for (var id in users) {
            if (id === userId) {
              continue;
            }

            var user = users[id];

            if (user.invoice) {
              return false;
            }
          }
          return true;
        }

      }]);

}());
