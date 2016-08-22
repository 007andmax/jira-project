'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companiesCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', '$state',
      'quicktech.common.services.SharedStateService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, $state,
                SharedStateService, DevicesService, PermissionsService) {

        var globalSearch = SharedStateService.getSharedState('globalSearch'),
          availableViews = ['list', 'grid'];

        if (!PermissionsService.isAllowed('VIEW_COMPANIES')) {
          $state.go('tickets');
        }

        $scope.companiesView = $state.params.view || 'grid';
        $scope.PermissionsService = PermissionsService;
        $scope.isCollapsed = true;
        $scope.companies = CompaniesService.getClientCompanies().filter(function (company) {
          return !company.default;
        });
        $scope.companiesInfo = CompaniesService.getClientCompaniesInfo($scope);
        $scope.devicesCount = DevicesService.getDevicesCount($scope);

        $scope.orderCompanies = {
          field: 'name',
          reverse: false
        };

        $scope.$watch(function () {
          return $state.params.view;
        }, function (value) {
          if (availableViews.indexOf(value) !== -1) {
            $scope.companiesView = value;
          }
        });

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

        $scope.setOrderByCompanies = function (option) {
          if (option === $scope.orderCompanies.field) {
            $scope.orderCompanies.reverse = !$scope.orderCompanies.reverse;
          } else {
            $scope.orderCompanies.field = option;
            $scope.orderCompanies.reverse = false;
          }
        };

        $scope.orderByForCompanies = function (item) {
          if ($scope.orderCompanies.field === 'name') {
            return item.name;
          } else if ($scope.orderCompanies.field === 'phone') {
            var phoneNumbers = $scope.companiesInfo[item.id].addresses[0].phoneNumbers;
            if (phoneNumbers && phoneNumbers.length) {
              return phoneNumbers[0].number || '';
            }
          } else if ($scope.orderCompanies.field === 'email') {
            return $scope.companiesInfo[item.id].contacts[0].primaryEmail || '';
          } else if ($scope.orderCompanies.field === 'contact') {
            return $scope.getUserName($scope.companiesInfo[item.id].contacts[0]);
          } else if ($scope.orderCompanies.field === 'tickets') {
            return item.companyStatistic.ticketsSubmitted;
          } else if ($scope.orderCompanies.field === 'devices') {
            return $scope.devicesCount[item.id] ? $scope.devicesCount[item.id].all : 0;
          } else if ($scope.orderCompanies.field === 'users') {
            return UsersService.getAllByCompanyId(item.id).length;
          }

        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.createUser = function (companyId) {
          if (PermissionsService.isAllowed('CREATE_USERS')) {
            //todo: implement user creation on modal window
          }
        };

      }]);

}());
