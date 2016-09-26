'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope', 'DevicesService',
      'quicktech.common.services.PermissionsService', 'CompaniesService',
      function ($scope, SharedStateService, $state, $rootScope, DevicesService, PermissionsService, CompaniesService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession'),
          usersSharedState = SharedStateService.getSharedState('usersHeader'),
          companiesSharedState = SharedStateService.getSharedState('companiesHeader');

        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.usersSharedState = usersSharedState;
        $scope.companiesSharedState = companiesSharedState;
        $scope.qSHistoryExpanded = false;

        //for one time popover
        $scope.changeCompanyStatusToActive = CompaniesService.changeCompanyStatusToActive;
        $scope.currentCompany = CompaniesService.getCurrentCompany();

        $scope.clientCompanies = CompaniesService.getClientCompanies;

        $scope.$state = $state;
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.qSHistory = DevicesService.getOneTimeHistory();

        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });

        $scope.$watch(function () {
          return $state.current.url + ' ' + $state.current.name;
        }, function (value) {
          if (value && value !== '^ ') {
            $scope.openedCategory = getOpenedCategory(value);

            if ($scope.openedCategory) {
              document.title = $scope.openedCategory.charAt(0).toUpperCase() + $scope.openedCategory.slice(1);
            } else if (value.indexOf('settings') > -1) {
              document.title = 'Settings';
            }

            if (!$scope.openedCategory) {
              $rootScope.isLeftPanelHidden = true;
            } else if ($scope.openedCategory === 'settings') {
              $rootScope.isLeftPanelHidden = false;
            }
          }
        });

        $scope.$on('leftPanelClosedFromQTSidebar', function () {
          $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
        });

        $scope.toggleLeftPanel = function (section) {
          if ($scope.openedCategory === section && !$rootScope.isLeftPanelHidden) {
            $rootScope.isLeftPanelHidden = true;
            $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
          } else {
            $scope.openedCategory = section;
            $rootScope.isLeftPanelHidden = false;
          }
        };

        $scope.onClickSettings = function () {
          if ($state.is('settings')) {
            $rootScope.isLeftPanelHidden = true;
          }
          $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
          document.title = 'Settings';
        };

        $scope.addQuickSession = function () {
          sharedQuickSession.isCreateNew = true;
        };

        $scope.stateGo = function (event, state, stateParams) {
          if (event.button > 0) {
            var url = $state.href(state, stateParams, { absolute: true });
            window.open(url, '_blank');
          } else {
            $state.go(state, stateParams);
          }

        };

        $scope.filterCompanies = function (filter, value) {
          var sharedFilter = companiesSharedState.filter;

          var isInCompanies = $state.includes('companyProfile') || $state.includes('editCompany') || $state.includes('createCompany');
          if (isInCompanies && (filter !== 'dateRange' || value && value.length)) {
            $state.go('companies');
          }

          switch (filter) {
            case 'clients':
              clearFilter(sharedFilter);
              sharedFilter.isClient = true;
              break;
            case 'leads':
              clearFilter(sharedFilter);
              sharedFilter.isLead = true;
              break;
            case 'vendors':
              clearFilter(sharedFilter);
              sharedFilter.isVendor = true;
              break;
            case 'byIndustry':
              sharedFilter.industry = value;
              break;
            case 'dateRange':
              if (!value && $scope.clearDateRange) {
                $scope.clearDateRange();
              } else {
                var endDate = value[1];
                if (endDate) {
                  value[1] = new Date(endDate.setHours(23, 59, 59));
                }
                sharedFilter.dateRange = value;
              }
              break;
            default:
              clearFilter(sharedFilter);
          }
        };

        $scope.filterUsers = function (filter, value) {
          var sharedFilter = usersSharedState.filter;

          switch (filter) {
            case 'managers':
              clearFilter(sharedFilter);
              sharedFilter.isContact = true;
              break;
            case 'leads':
              clearFilter(sharedFilter);
              sharedFilter.isLead = true;
              break;
            case 'clients':
              clearFilter(sharedFilter);
              sharedFilter.isClient = true;
              break;
            case 'byIndustry':
              sharedFilter.industry = value;
              sharedFilter.companyId = false;
              break;
            case 'byCompany':
              sharedFilter.companyId = value;
              sharedFilter.industry = false;
              break;
            default:
              clearFilter(sharedFilter);
          }
        };

        $scope.toggleQSHistory = function ($event) {
          $scope.qSHistoryExpanded = !$scope.qSHistoryExpanded;
        };

        $scope.getCompanyName = function (companyId) {
          var company = CompaniesService.getOneById(companyId);
          if (company) {
            return company.name;
          }
        };

        $scope.$on('clearCompaniesDateRange', function () {
          if ($scope.clearDateRange) {
            $scope.clearDateRange();
          }
        });

        //for one time popover
        $scope.initCompanyStatusWatch = function (hidePopoverFunc) {
          var unwatch = $scope.$watch('currentCompany.status', function (newValue, oldValue) {
            if (newValue === 'ACTIVE' && oldValue === 'SIGN_UP') {
              hidePopoverFunc && hidePopoverFunc();
              unwatch();
            }
          });

          var unsubscribe = $scope.$on('$locationChangeStart', function () {
            if ($scope.currentCompany.status === 'SIGN_UP') {
              $scope.changeCompanyStatusToActive();
              unsubscribe();
            }
          })
        };

        function clearFilter(sharedFilter) {
          for (var prop in sharedFilter) {
            sharedFilter[prop] = false;
          }

          if ($scope.clearDateRange) {
            $scope.clearDateRange();
          }

          SharedStateService.getSharedState('globalSearch').searchValue = '';
        }

        function getOpenedCategory(url) {
          if (url.indexOf('quickSupport') > -1) {
            return 'dashboard';
          } else if (url.indexOf('settings.') > -1) {
            return 'settings';
          } else if (url.indexOf('tickets') > -1) {
            return 'tickets';
          } else if (url.indexOf('companies') > -1 || url.indexOf('companyProfile') > -1) {
            return 'companies';
          } else if (url.indexOf('users') > -1) {
            return 'users';
          } else if (url.indexOf('accounting') > -1) {
            return 'billing';
          } else if (url.indexOf('inventory') > -1) {
            return 'inventory';
          } else {
            return undefined;
          }
        }

      }]);

}());
