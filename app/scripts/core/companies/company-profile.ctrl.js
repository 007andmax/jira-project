'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'StatisticsService', 'UsersService', 'TicketsService',
      'SubscriptionsService', 'VendorsService',
      function ($scope, $state, $stateParams, CompaniesService, StatisticsService, UsersService, TicketsService,
                SubscriptionsService, VendorsService) {

        var availableMods = ['activity', 'user', 'device', 'vendors'];

        $scope.locationIndex = 0;
        $scope.contactIndex = 0;
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;
        $scope.company = CompaniesService.getOneById($stateParams.companyId);
        $scope.companyData = CompaniesService.getCompanyData($stateParams.companyId, function () {
          $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
          $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];
        });
        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany($stateParams.companyId, $scope);
        $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany($stateParams.companyId, $scope);
        $scope.users = UsersService.getAllByCompanyId($stateParams.companyId);
        $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($stateParams.companyId, $scope);
        $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany($stateParams.companyId, $scope);
        $scope.vendors = VendorsService.getAllForCompanyProfile($scope);

        $scope.changeCurrentLocation = function (index) {
          if (0 <= index && index < $scope.companyData.addresses.length) {
            $scope.locationIndex = index;
            $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
          }
        };

        $scope.changeCurrentContact = function (index) {
          if (0 <= index && index < $scope.companyData.contacts.length) {
            $scope.contactIndex = index;
            $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];
          }
        };

        $scope.archiveCompany = function () {
          CompaniesService.archive($scope.company.id);
        };

        $scope.$watch(function () {
          return $stateParams.mode;
        }, function (mode) {
          if (availableMods.indexOf(mode) < 0) {
            $state.go('companyProfile', {
              mode: availableMods[0]
            });
          } else {
            $scope.mode = mode;
          }
        });

        $scope.getPriorityNumber = function (object) {
          var priority;
          var index;
          for (var i = 0; i < object.phoneNumbers.length; i++) {
            if (priority === undefined || object.phoneNumbers[i].priority < priority) {
              priority = object.phoneNumbers[i].priority;
              index = i;
            }
          }
          return object.phoneNumbers[index].number;
        };

      }]);

}());
