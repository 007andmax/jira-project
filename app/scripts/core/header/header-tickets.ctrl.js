'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'ActionRightsService', 'TicketTagsService',
      '$stateParams', 'UsersService', 'CompaniesService', '$filter', 'TicketsService', '$state',
      function ($scope, SharedStateService, ActionRightsService, TicketTagsService, $stateParams, UsersService, CompaniesService, $filter, TicketsService, $state) {

        var users,
          companies = CompaniesService.getAllCompanies(),
          autocompleteModel,
          labels = {
            'unassigned': 'Unassigned Tickets',
            'user': 'My Tickets',
            'open': 'Open Tickets',
            'closed': 'Closed Tickets'
          },
          searchPriorityParamsMap = {
            0: 'LOW',
            1: 'MEDIUM',
            2: 'HIGH'
          },
          searchStatusParamsMap = {
            0: 'ON_HOLD',
            1: 'IN_PROGRESS',
            2: 'COMPLETED'
          };

        $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');

        $scope.search = function (value) {

          if (!isNaN(parseFloat(value)) && value.length > 2) {

            var paramsToSend = {
              filter: $stateParams.listType.toUpperCase(),
              keyword: value
            };

            if ($scope.searchParams.priority.enabled) {
              paramsToSend.priority = searchPriorityParamsMap[$scope.searchParams.priority.value];
            }

            if ($scope.searchParams.status.enabled) {
              paramsToSend.status = searchStatusParamsMap[$scope.searchParams.status.value];
            }

            return TicketsService.search(paramsToSend);

          } else if (isNaN(parseFloat(value))) {

            autocompleteModel = [];

            for (var i = 0; i < companies.length; i++) {
              autocompleteModel.push({
                label: companies[i].name,
                value: companies[i].id,
                type: 'COMPANY'
              })
            }

            for (var i = 0; i < users.length; i++) {
              autocompleteModel.push({
                label: users[i].firstName + ' ' + users[i].lastName,
                value: users[i].id,
                type: 'USER'
              })
            }

            return $filter('filter')(autocompleteModel, {label: value});

          }
        };

        $scope.$watch(function () {
          return $stateParams.listType;
        }, function (filter) {

          $scope.searchItem = undefined;
          setSearchParamsDefault();
          $scope.sharedState.searchFilter = {};

          if ($stateParams.listType === 'unassigned' || $stateParams.listType === 'user') {
            users = UsersService.getClientUsers();
          } else {
            users = UsersService.getAllUsers();
          }

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

        $scope.searchByParams = function () {

          if ($scope.searchParams.priority.enabled) {
            $scope.sharedState.searchFilter.priority = searchPriorityParamsMap[$scope.searchParams.priority.value];
          } else {
            delete $scope.sharedState.searchFilter.priority;
          }

          if ($scope.searchParams.status.enabled) {
            $scope.sharedState.searchFilter.status = searchStatusParamsMap[$scope.searchParams.status.value];
          } else {
            delete $scope.sharedState.searchFilter.status;
          }

          $scope.searchByParamsDropdown.isOpen = false;
        };

        $scope.selectItem = function (item) {

          if (item.type === 'USER') {

            $scope.sharedState.searchFilter.userId = item.value;

          } else if (item.type === 'COMPANY') {

            $scope.sharedState.searchFilter.companyId = item.value;

          } else {

            $state.go('tickets.details', {ticketId: item.value});

          }
        };

        $scope.cancelSearch = function () {
          $scope.searchItem = undefined;

          if ($scope.sharedState.searchFilter.userId) {

            delete $scope.sharedState.searchFilter.userId;

          } else if ($scope.sharedState.searchFilter.companyId) {

            delete $scope.sharedState.searchFilter.companyId;

          }
        };

        function setSearchParamsDefault() {
          $scope.searchParams = {
            priority: {value: 1},
            status: {value: 1}
          };
        };

      }]);

}());
