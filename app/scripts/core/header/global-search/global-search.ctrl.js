'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.globalSearchCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'GlobalSearch', '$state', 'TicketsService',
      'DevicesService', 'quicktech.common.services.RemoteAccessService',
      function ($scope, SharedStateService, GlobalSearch, $state, TicketsService, DevicesService, RemoteAccessService) {

        $scope.categoryExpanded = [];
        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.$watch('searchValue', function (word) {
          if (word) {
            GlobalSearch.search(word, function (resp) {
              $scope.searchResult = resp;
              $scope.resultCount = resp.length;

              $scope.select = selectItem;
              $scope.$broadcast('refreshNavigationDirective');
            });
          } else {
            $scope.searchResult = {};
            $scope.resultCount = 0;
          }
          $scope.filterResultCount = 0;
        });

        $scope.expandCategory = function (index, value, event) {
          $scope.categoryExpanded[index] = value;
          event && event.stopPropagation();
        };

        $scope.getType = function (type) {
          return $scope.userReadable(type.slice(0, -1).replace(/ie$/i, 'y'));
        };

        $scope.closeFilters = function (event) {
          $scope.filterResult = undefined;
          $scope.filterResultCount = 0;

          $scope.select = selectItem;
          $scope.$broadcast('refreshNavigationDirective');
          event && event.stopPropagation();
        };

        $scope.remoteAccess = function (connectionType, item) {
          var deviceId = item.id,
            companyId = item.extraInfo;

          DevicesService.createRemoteSession(deviceId, companyId, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.filterByType = function (item, event) {
          $scope.selectedItem = item;
          GlobalSearch.filterByType(item.id, item.type, function (resp) {
            $scope.filterResult = resp;
            $scope.filterResultCount = resp.length;

            $scope.select = selectFilter;
            $scope.$broadcast('refreshNavigationDirective', true);
          });
          event && event.stopPropagation();
        };

        function selectItem(item) {
          $scope.globalSearch.isGlobalSearchOn = false;
          getFuncByItemType(item.type)(item.id, item.name, item.extraInfo);
        }

        function selectFilter(filterType) {
          $scope.globalSearch.isGlobalSearchOn = false;
          getFilterByItemType($scope.selectedItem)(filterType);
        }

        function getFuncByItemType(type) {
          switch (type) {
            case 'TICKETS':
              return function (id) {
                getTicketType(id, function (listType) {
                  $state.go('tickets', { listType: listType }).then(function () {
                    $state.go('tickets.details', { ticketId: id })
                  })
                });
              };
            case 'COMPANIES':
              return function (id) {
                $state.go('companyProfile', { companyId: id });
              };
            case 'USERS':
              return function (id) {
                $scope.globalSearch.userFilter = id;
                $state.go('users');
              };
            case 'TECH_USERS':
              return function (id) {
                $scope.globalSearch.techUserFilter = id;
                $state.go('settings.techUsers');
              };
            case 'VENDORS':
              return function (id) {
                $scope.globalSearch.vendorFilter = id;
                $state.go('vendors');
              };
            case 'DEVICES':
              return function (id, name, companyId) {
                $state.go('companyProfile', { companyId: companyId }).then(function () {
                  $scope.globalSearch.deviceFilter = id;
                  $state.go('companyProfile.tab', { tabName: 'devices' });
                });
              };
            case 'PRODUCTS':
              return function (id, name, categoryId) {
                $scope.globalSearch.productFilter = { id: id, name: name, category: categoryId };
                $state.go('products');
              };
            case 'SERVICES':
              return function (id, name) {
                $scope.globalSearch.serviceFilter = { id: id, name: name };
                $state.go('services');
              };
            default:
              return function () {
                console.error('Unknown item type!');
              }
          }
        }

        function getFilterByItemType(item) {
          switch (item.type) {
            case 'COMPANIES':
              return function (filterType) {
                switch (filterType) {
                  case 'TICKETS':
                    $scope.globalSearch.ticketsByCompanyFilter = item.id;
                    $state.go('tickets', { listType: 'all' });
                    break;
                  case 'USERS':
                    $scope.globalSearch.usersByCompanyFilter = item.id;
                    $state.go('users');
                    break;
                  case 'BILLABLE_TICKETS':
                    $scope.globalSearch.billableByCompanyFilter = item.id;
                    $state.go('accounting.billable');
                    break;
                  case 'RECURRING_ORDERS':
                    $scope.globalSearch.reccuringByCompanyFilter = item.id;
                    $state.go('accounting.recurring');
                    break;
                  case 'RECEIVABLE_INVOICES':
                    $scope.globalSearch.receivableByCompanyFilter = item.id;
                    $state.go('receivable', { mode: 'group-by-company' });
                    break;
                  case 'RECEIPT_ARCHIVE':
                    $scope.globalSearch.archivedByCompanyFilter = item.id;
                    $state.go('receipt-archive', { mode: 'group-by-company' });
                    break;
                  default:
                    console.error('Unknown item type!');
                }
              };
            case 'USERS':
              return function (filterType) {

              };
            case 'TECH_USERS':
              return function (filterType) {

              };
            case 'VENDORS':
              return function (filterType) {

              };
            default:
              return function () {
                console.error('Unknown item type!');
              }
          }
        }

        function getTicketType(ticketId, callback) {
          TicketsService.getOne(ticketId, 'ALL', $scope, false, function (resp) {
            if (resp.trash) {
              callback('trash');
            } else if (resp.spamMarker || resp.spamReporter) {
              callback('spam');
            } else if (resp.status === 'COMPLETED') {
              callback('closed');
            } else if (resp.assignedUser && resp.assignedUser.id === $scope.currentUser.id) {
              callback('user');
            } else if (resp.assignedUser) {
              callback('open');
            } else {
              callback('unassigned');
            }
          });
        }

      }]);

}());
