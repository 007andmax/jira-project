'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companiesCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', '$timeout',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, SharedStateService, $timeout) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');
        var isChartHasOpen = false;

        $scope.isCollapsed = true;
        $scope.companies = CompaniesService.getClientCompanies();
        $scope.companiesInfo = CompaniesService.getClientCompaniesInfo($scope);

        $scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany(CompaniesService.getCurrentCompany().id, $scope, function () {
          if (($scope.ticketsResolution.quick > 0 || $scope.ticketsResolution.delayed > 0) && !isChartHasOpen) {
            $scope.isCollapsed = false;
            isChartHasOpen = true;
          }
        });

        $scope.topCompaniesByResolvedTickets = StatisticsService.getTopCompaniesByResolvedTickets(10, $scope, function () {
          $scope.mostTicketsResolved = 0;

          for (var companyId in $scope.topCompaniesByResolvedTickets) {
            if (companyId === 'staticCopy') {
              continue;
            }
            $scope.mostTicketsResolved += $scope.topCompaniesByResolvedTickets[companyId];
          }

          if (($scope.mostTicketsResolved > 0) && !isChartHasOpen) {
            $scope.isCollapsed = false;
            isChartHasOpen = true;
          }

        });
        $scope.contributedToEarningTopCompanies = StatisticsService.getContributedToEarningTopCompanies(10, $scope, function () {
          $scope.contributedToEarnings = 0;

          for (var companyId in $scope.contributedToEarningTopCompanies) {
            if (companyId === 'staticCopy') {
              continue;
            }
            $scope.contributedToEarnings += $scope.contributedToEarningTopCompanies[companyId];
          }

          if ($scope.contributedToEarnings) {
            $scope.contributedToEarnings = $scope.contributedToEarnings.toFixed(2);
            if (!isChartHasOpen) {
              $scope.isCollapsed = false;
              isChartHasOpen = true;
            }
          }
        });

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

        $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany(CompaniesService.getCurrentCompany().id, $scope, function () {
          if ($scope.timeBilledByCompany.value > 0 && !isChartHasOpen) {
            $scope.isCollapsed = false;
            isChartHasOpen = true;
          }
        });

        $scope.toggleCollapsed = function () {
          $scope.isCollapsed = !$scope.isCollapsed;
          isChartHasOpen = true;
        }

      }]);

}());
