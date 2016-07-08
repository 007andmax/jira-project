'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.globalSearchCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', 'GlobalSearch', '$state', 'TicketsService',
      'DevicesService', 'quicktech.common.services.RemoteAccessService', 'Utils', '$rootScope', '$filter',
      'UsersService', 'CompaniesService', '$timeout',
      function ($scope, SharedStateService, GlobalSearch, $state, TicketsService,
                DevicesService, RemoteAccessService, Utils, $rootScope, $filter,
                UsersService, CompaniesService, $timeout) {

        var allUsers = [],
          clientUsers = [],
          clientCompanies = [],
          preventSearch = false;

        $scope.preventDropDownOpening = false;
        $scope.categoryExpanded = {};
        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.$watch('globalSearch.searchValue', function (word) {
          if (preventSearch) {
            preventSearch = false;
            $scope.searchResult = {};
            $scope.localSearchResult = [];
            $scope.resultCount = 0;
            $scope.filterResultCount = 0;
            return;
          }

          $scope.clearLocalFilter && $scope.clearLocalFilter();

          if (!allUsers.length) {
            allUsers = UsersService.getAllUsers().filter(function (user) {
              return !user.isDefault;
            }).map(function (user) {
              return {
                label: user.firstName + ' ' + user.lastName,
                value: user.id,
                itemType: 'USER'
              };
            });
          }

          if (!clientUsers.length) {
            clientUsers = UsersService.getClientUsers().filter(function (user) {
              return !user.isDefault;
            }).map(function (user) {
              return {
                label: user.firstName + ' ' + user.lastName,
                value: user.id,
                itemType: 'USER'
              };
            });
          }

          if (!clientCompanies.length) {
            clientCompanies = CompaniesService.getClientCompanies().filter(function (company) {
              return !company.isDefault;
            }).map(function (item) {
              return {
                label: item.name,
                value: item.id,
                itemType: 'COMPANY'
              };
            });
          }

          if (word) {
            $scope.localSearchResult = getLocalSearchFunc(word);
            $scope.resultCount = $scope.localSearchResult.length;

            GlobalSearch.search(word, function (resp) {
              $scope.searchResult = resp;
              $scope.resultCount += resp.length;

              $scope.select = selectItem;
              $scope.$broadcast('refreshNavigationDirective');
            });
          } else {
            $scope.searchResult = {};
            $scope.resultCount = 0;
          }
          $scope.filterResultCount = 0;
        });

        $scope.dropDownRendered = function (eventName) {
          $scope.$broadcast(eventName);
        };

        $scope.expandCategory = function (index, value, event) {
          $scope.categoryExpanded[index] = value;
          $timeout($scope.$broadcast.bind($scope, 'adjustDropDownHeight'));
          event && event.stopPropagation();
        };

        $scope.getTicketsListName = function () {
          return $state.params.listType;
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

        $scope.getDeviceById = function (id, companyId) {
          var devices = DevicesService.getByCompanyId(companyId);
          return Utils.findById(devices, id) || {};
        };

        function selectItem(item) {
          if (item.type) {
            getFuncByItemType(item.type)(item.id, item.name, item.extraInfo);
            $scope.globalSearch.searchValue = item.name;
            preventSearch = true;
          } else {
            $scope.localSearchResultHandler(item);
          }
          $scope.preventDropDownOpening = true;
        }

        function selectFilter(filter) {
          getFilterByItemType($scope.selectedItem)(filter);
        }

        function getFuncByItemType(type) {
          switch (type) {
            case 'TICKETS':
              return function (id) {
                $state.go('tickets', { listType: 'all' }).then(function () {
                  $state.go('tickets.details', { ticketId: id })
                });
              };
            case 'COMPANIES':
              return function (id) {
                $state.go('companyProfile', { companyId: id });
              };
            case 'USERS':
              return function (id, name) {
                $scope.sharedState = SharedStateService.getSharedState('usersHeader');
                $scope.sharedState.filter.userId = id;
                $scope.clearLocalFilter = clearLocalFilter;
                $state.go('users');
              };
            case 'TECH_USERS':
              return function (id) {
                $scope.globalSearch.techUserFilter = id;
                $state.go('settings.techUsers');
              };
            case 'VENDORS':
              return function (id, name) {
                $scope.sharedState = SharedStateService.getSharedState('vendorsHeader');
                $scope.sharedState.filter.vendorId = id;
                $scope.clearLocalFilter = clearLocalFilter;
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
                if ($state.includes('products', { tabName: 'category' }) || $state.includes('products', { tabName: 'list' })) {
                  $rootScope.$broadcast(categoryId + '-showProduct', id);
                } else {
                  $scope.globalSearch.productFilter = { id: id, category: categoryId };
                  $state.go('products', { tabName: 'category' });
                }
              };
            case 'SERVICES':
              return function (id, name, companyId) {
                if ($state.includes('services')) {
                  $rootScope.$broadcast(companyId + '-showService', id);
                } else {
                  $scope.globalSearch.serviceFilter = { id: id, name: name, company: companyId };
                  $state.go('services');
                }
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
              return function (filter) {
                switch (filter.type) {
                  case 'TICKETS':
                    $state.go('tickets', { listType: 'all' }).then(function () {
                      $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');
                      $scope.sharedState.searchFilter.companyId = item.id;
                      $scope.sharedState.searchFilter.userId = '';
                      $scope.globalSearch.searchValue = item.name;
                      preventSearch = true;

                      $scope.clearLocalFilter = function () {
                        if ($scope.sharedState) {
                          $scope.sharedState.searchFilter = {};
                        }
                        $scope.clearLocalFilter = undefined;
                      };
                    });
                    break;
                  case 'USERS':
                    $state.go('users').then(function () {
                      $scope.sharedState = SharedStateService.getSharedState('usersHeader');
                      $scope.sharedState.filter.companyId = item.id;
                      $scope.globalSearch.searchValue = item.name;
                      preventSearch = true;
                      $scope.clearLocalFilter = clearLocalFilter;
                    });
                    break;
                  case 'BILLABLE_TICKETS':
                    $state.go('accounting.billable').then(function () {
                      $scope.sharedState = SharedStateService.getSharedState('billableHeader');
                      $scope.sharedState.filter.companyId = item.id;
                      $scope.globalSearch.searchValue = item.name;
                      preventSearch = true;
                      $scope.clearLocalFilter = clearLocalFilter;
                    });
                    break;
                  case 'RECURRING_ORDERS':
                    $state.go('accounting.recurring').then(function () {
                      $scope.sharedState = SharedStateService.getSharedState('recurringHeader');
                      $scope.sharedState.filter.companyId = item.id;
                      $scope.globalSearch.searchValue = item.name;
                      preventSearch = true;
                      $scope.clearLocalFilter = clearLocalFilter;
                    });
                    break;
                  case 'RECEIVABLE_INVOICES':
                    $state.go('receivable', { mode: 'group-by-company' }).then(function () {
                      $scope.sharedState = SharedStateService.getSharedState('receivableHeader');
                      $scope.sharedState.filter.companyId = item.id;
                      $scope.globalSearch.searchValue = item.name;
                      preventSearch = true;
                      $scope.clearLocalFilter = clearLocalFilter;
                    });
                    break;
                  case 'RECEIPT_ARCHIVE':
                    $state.go('receipt-archive', { mode: 'group-by-company' }).then(function () {
                      $scope.sharedState = SharedStateService.getSharedState('receiptArchiveHeader');
                      $scope.sharedState.filter.companyId = item.id;
                      $scope.globalSearch.searchValue = item.name;
                      preventSearch = true;
                      $scope.clearLocalFilter = clearLocalFilter;
                    });
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

        function getLocalSearchFunc(word) {
          $scope.localSearchResultHandler = undefined;
          $scope.clearLocalFilter = undefined;

          if ($state.includes("tickets")) {
            $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');

            $scope.localSearchResultHandler = function (item) {
              if (item.itemType === 'USER') {
                $scope.sharedState.searchFilter.userId = item.value;
                $scope.sharedState.searchFilter.companyId = '';
              } else if (item.itemType === 'COMPANY') {
                $scope.sharedState.searchFilter.companyId = item.value;
                $scope.sharedState.searchFilter.userId = '';
              }
              $scope.globalSearch.searchValue = item.label;
              $scope.preventDropDownOpening = true;
              preventSearch = true;
            };

            $scope.clearLocalFilter = function () {
              if ($scope.sharedState) {
                $scope.sharedState.searchFilter = {};
              }
              $scope.clearLocalFilter = undefined;
            };

            return $filter('filter')(allUsers.concat(clientCompanies), { label: word });
          } else if ($state.includes("users")) {
            return setLocalFilterByCompany(word, 'usersHeader');
          } else if ($state.includes("services")) {
            return setLocalFilterByCompany(word, 'servicesHeader');
          } else if ($state.includes("accounting.billable")) {
            return setLocalFilterByCompany(word, 'billableHeader');
          } else if ($state.includes("accounting.recurring")) {
            return setLocalFilterByCompany(word, 'recurringHeader');
          } else if ($state.includes("receivable")) {
            return setLocalFilterByCompany(word, 'receivableHeader');
          } else if ($state.includes("receipt-archive")) {
            return setLocalFilterByCompany(word, 'receiptArchiveHeader');
          } else {
            return [];
          }
        }

        function setLocalFilterByCompany(word, sharedStateName) {
          $scope.sharedState = SharedStateService.getSharedState(sharedStateName);

          $scope.localSearchResultHandler = function (item) {
            $scope.sharedState.filter.companyId = item.value;
            $scope.globalSearch.searchValue = item.label;
            $scope.preventDropDownOpening = true;
            preventSearch = true;
          };

          $scope.clearLocalFilter = clearLocalFilter;

          return $filter('filter')(clientCompanies, { label: word });
        }

        function clearLocalFilter() {
          if ($scope.sharedState) {
            $scope.sharedState.filter = {};
          }
          $scope.clearLocalFilter = undefined;
        }

      }]);

}());
