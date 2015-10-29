'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'StatisticsService', 'UsersService', 'TicketsService',
      'SubscriptionsService', 'VendorsService', 'quicktech.common.services.SharedStateService',
      function ($scope, $state, $stateParams, CompaniesService, StatisticsService, UsersService, TicketsService,
                SubscriptionsService, VendorsService, SharedStateService) {

        var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');

        $scope.locationIndex = 0;
        $scope.contactIndex = 0;
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;
        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        rightPanelSharedState.companyId = $scope.company.id;

        $scope.companyData = CompaniesService.getCompanyData($scope, $stateParams.companyId, function () {
          $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
          $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];
        });
        $scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany($stateParams.companyId, $scope);
        $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany($stateParams.companyId, $scope);
        $scope.users = UsersService.getAllByCompanyId($stateParams.companyId);
        $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($stateParams.companyId, $scope);
        $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany($stateParams.companyId, $scope);

        $scope.countsTicketsCompany = TicketsService.getCountsByTypesAndCompany($scope, $stateParams.companyId, ['UNASSIGNED', 'OPEN'], function(){

          $scope.$watch('countsTicketsCompany', function(){
            $scope.countsByTypesAndCompany = [{
              label: 'Unassigned',
              value: $scope.countsTicketsCompany['UNASSIGNED'],
              color: "#00ACC1"
            }, {
              label: 'Open',
              value: $scope.countsTicketsCompany['OPEN'],
              color: "#FFA726"
            }];
          })

        });

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

        $scope.showEditCover = function () {

          $scope.editCover = $scope.company.cover ? $scope.company.cover.staticCopy() : {};
          $scope.$broadcast('initializeCoverCropper');
        };

        $scope.cancelEditCover = closeEditCover;

        $scope.restoreDefaultCover = function () {
          CompaniesService.deleteCover($scope.company.id, function () {
            closeEditCover();
          });
        };

        $scope.saveEditCover = function (editCover) {
          CompaniesService.saveCover(editCover, $scope.company.id, function () {
            closeEditCover();
          });
        };

        $scope.$on('showEditCover', function () {
          $scope.isShowEditCover = true;
        });

        function closeEditCover() {
          $scope.editCover = undefined;
          $scope.isShowEditCover = false;
        }

        $scope.$on('$destroy', function () {
          rightPanelSharedState.companyId = undefined;
        });

      }]);

}());
