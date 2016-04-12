'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.ticketsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      '$stateParams', 'UsersService', 'CompaniesService', '$filter', 'TicketsService', '$state',
      function ($scope, SharedStateService, $stateParams, UsersService, CompaniesService, $filter, TicketsService, $state) {

        var users,
          companies = CompaniesService.getAllCompanies(),
          autocompleteModel,
          labels = {
            'unassigned': 'Unassigned',
            'user': 'My Tickets',
            'open': 'Open',
            'closed': 'Closed',
            'trash': 'Trash',
            'shared': 'Shared',
            'spam': 'Spam'
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

        $scope.showPriorityParamsMap = {
          0: 'Low',
          1: 'Medium',
          2: 'High'
        };
        $scope.showStatusParamsMap = {
          0: 'On Hold',
          1: 'In Progress',
          2: 'Completed'
        };

        $scope.filter = {
          searchItem: ''
        };

        $scope.search = function (value) {

          if (!isNaN(parseInt(value)) && value.length > 2) {

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

          } else if (isNaN(parseInt(value))) {

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

          $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');

          $scope.filter.searchItem = undefined;
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

        $scope.$watch('filter.searchItem', function (value) {
          if (!value) {
            $scope.cancelSearch();
          }
        });

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

        };

        $scope.selectItem = function (item) {

          if (item.type === 'USER') {

            $scope.sharedState.searchFilter.userId = item.value;
            $scope.sharedState.searchFilter.companyId = '';

          } else if (item.type === 'COMPANY') {

            $scope.sharedState.searchFilter.companyId = item.value;
            $scope.sharedState.searchFilter.userId = '';

          } else {

            $state.go('tickets.details', {ticketId: item.value});

          }
        };

        $scope.cancelSearch = function () {
          $scope.filter.searchItem = '';

          if ($scope.sharedState.searchFilter.userId) {

            delete $scope.sharedState.searchFilter.userId;

          } else if ($scope.sharedState.searchFilter.companyId) {

            delete $scope.sharedState.searchFilter.companyId;

          } else if ($scope.sharedState.searchFilter.number) {

            delete $scope.sharedState.searchFilter.number;

          }
        };

        function setSearchParamsDefault() {
          $scope.searchParams = {
            priority: {value: 0},
            status: {value: 0}
          };
        }

        $scope.$watch('sharedState.checkedTicketsIds', function (data) {
          $scope.isShowBulkAction = data && data.length > 0;
        })

      }]);

}());
