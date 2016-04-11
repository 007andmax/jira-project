'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.userTabCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, SubscriptionsService, UserConfirmationsService) {

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
          var user = UsersService.getOneById($scope.user.id);
          var confirmMesage = 'Do you want to archive ' + $scope.getUserName(user);
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            UsersService.deleteOrArchiveUser($scope.user.id, true, function () {
              if (delete $scope.selectedUsers[$scope.user.id]) {
                $scope.changeSelectedUsers();
              }
            })
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
