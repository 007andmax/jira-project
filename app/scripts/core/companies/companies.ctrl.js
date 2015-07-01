'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.companies.companiesCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');

        $scope.companies = CompaniesService.getClientCompanies();
        $scope.companiesInfo = CompaniesService.getClientCompaniesInfo($scope);

        $scope.$watch('companies.length', function (companiesCount) {
          headerSharedState.count = companiesCount;
        });

        ////TODO fix data loading
        //UsersService._addInitListener(function () {
        //  $scope.subscriptions = SubscriptionsService.getAllClientUserSubscriptions($scope);
        //  $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany(CompaniesService.getCurrentCompany().id, $scope)
        //
        //  $scope.getUserCompanyName = function (user) {
        //    return CompaniesService.getOneById(user.company.id).legalName;
        //  };
        //});
        //


        $scope.companiesFilter = function (value) {
          if (headerSharedState.filter.keyword && headerSharedState.filter.keyword.length > 0) {
            return value.name.toLowerCase().indexOf(headerSharedState.filter.keyword.toLowerCase()) > -1;
          }
          return true;
        };


        //
        //$scope.getUserName = function (user) {
        //  return user.firstName + ' ' + user.lastName;
        //};
        //
        //$scope.setEditUserId = function (userId) {
        //  $scope.editUserId = userId;
        //};

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('companiesHeader');
        });

        //$scope.changeUserRole = function (userId, userRole) {
        //  UsersService.changeUserRole(userId, userRole);
        //};
        //
        //$scope.subscribeUser = function (userId, nameSubscription) {
        //  var newSubscription = $scope.subscriptions[userId].staticCopy();
        //  newSubscription[nameSubscription] = !newSubscription[nameSubscription];
        //  SubscriptionsService.saveUserSubscription(newSubscription);
        //};

        UsersService._addInitListener(function () {
          $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany(CompaniesService.getCurrentCompany().id, $scope);
        });

      }]);

}());
