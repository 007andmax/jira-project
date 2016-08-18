'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companiesCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state',
      'quicktech.common.services.SharedStateService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state,
                SharedStateService, DevicesService, PermissionsService) {

        var globalSearch = SharedStateService.getSharedState('globalSearch');

        if (!PermissionsService.isAllowed('VIEW_COMPANIES')) {
          $state.go('tickets');
        }

        $scope.PermissionsService = PermissionsService;
        $scope.isCollapsed = true;
        $scope.companies = CompaniesService.getClientCompanies();
        $scope.companiesInfo = CompaniesService.getClientCompaniesInfo($scope);
        $scope.devicesCount = DevicesService.getDevicesCount($scope);

        $scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany(CompaniesService.getCurrentCompany().id, $scope);

        $scope.topCompaniesByResolvedTickets = StatisticsService.getTopCompaniesByResolvedTickets(10, $scope, function () {
          $scope.mostTicketsResolved = 0;

          for (var companyId in $scope.topCompaniesByResolvedTickets) {
            if (companyId === 'staticCopy') {
              continue;
            }
            $scope.mostTicketsResolved += $scope.topCompaniesByResolvedTickets[companyId];
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
          }
        });

        $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany(CompaniesService.getCurrentCompany().id, $scope);

        $scope.$watch('companies.length', function (companiesCount) {
          globalSearch.count = companiesCount == 0 ? companiesCount : (companiesCount - 1);
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


        //
        //$scope.getUserName = function (user) {
        //  return user.firstName + ' ' + user.lastName;
        //};
        //
        //$scope.setEditUserId = function (userId) {
        //  $scope.editUserId = userId;
        //};

        //$scope.changeUserRole = function (userId, userRole) {
        //  UsersService.changeUserRole(userId, userRole);
        //};
        //
        //$scope.subscribeUser = function (userId, nameSubscription) {
        //  var newSubscription = $scope.subscriptions[userId].staticCopy();
        //  newSubscription[nameSubscription] = !newSubscription[nameSubscription];
        //  SubscriptionsService.saveUserSubscription(newSubscription);
        //};

        $scope.toggleCollapsed = function () {
          $scope.isCollapsed = !$scope.isCollapsed;
        }

      }]);

}());
