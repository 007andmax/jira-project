'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'ActionRightsService', 'TicketTagsService', '$stateParams',
      function ($scope, SharedStateService, ActionRightsService, TicketTagsService, $stateParams) {

        var labels = {
          'unassigned': 'Unassigned Tickets'
          },
          saerchPriorityParamsMap = {
            0: 'LOW',
            1: 'MEDIUM',
            2: 'HIGH'
          },
          saerchStatusParamsMap = {
            0: 'ON_HOLD',
            1: 'IN_PROGRESS',
            2: 'COMPLETED'
          };

        $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');
        $scope.searchParams = {
          priority: {value: 1},
          status: {value: 1}
        };

        $scope.$watch(function () {
          return $stateParams.listType;
        }, function (filter) {

          if (filter) {
            filter = filter.toLowerCase()
          }
          $scope.listType = filter;
          $scope.headerLabel = labels[filter];

        });

        //TODO Review!!!
        $scope.ActionRightsService = ActionRightsService;

        //var tags = TicketTagsService.getList($scope, function () {
        //  SharedStateService.getSharedState('ticketsHeader').allTags = tags.staticCopy();
        //});

        $scope.searchByParams = function(){

          if($scope.searchParams.priority.enabled){
            $scope.sharedState.searchFilter.priority = saerchPriorityParamsMap[$scope.searchParams.priority.value];
          } else {
            delete $scope.sharedState.searchFilter.priority;
          }

          if($scope.searchParams.status.enabled){
            $scope.sharedState.searchFilter.status = saerchStatusParamsMap[$scope.searchParams.status.value];
          } else {
            delete $scope.sharedState.searchFilter.status;
          }

          $scope.searchByParamsDropdown.isOpen = false;
        }

      }]);

}());
