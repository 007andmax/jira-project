'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.editCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state) {

        $scope.roles = [
          'USER',
          'ADMIN'
        ];

        $scope.tmplPhone = {};

        if (!$scope.user) {
          $scope.isCreation = true;
          $scope.user = {
            role: 'USER',
            phoneNumbers: [],
            userSubscription: {}
          };
        } else {
          $scope.user = {
            id: $scope.user.id,
            firstName: $scope.user.firstName,
            lastName: $scope.user.lastName,
            designation: $scope.user.designation,
            role: $scope.user.role,
            primaryEmail: $scope.user.primaryEmail,
            phoneNumbers: $scope.user.phoneNumbers.staticCopy(),
            companyId: $scope.user.company.id,
            userSubscription: $scope.subscriptions[user.id].staticCopy()
          }
        }

        $scope.addPhoneNumber = function () {
          $scope.user.phoneNumbers.push($scope.tmplPhone);
          $scope.tmplPhone = {};
        }

        $scope.removePhoneNumber = function (index) {
          $scope.user.phoneNumbers.splice(index, 1);
        }

        $scope.cancelEdit = function () {
          $state.go('users');
        }

      }]);

}());
