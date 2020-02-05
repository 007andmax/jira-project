'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.headerCtrl',
    ['$scope', '$state', 'CompaniesService', 'UsersService', 'quicktech.common.services.PermissionsService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$rootScope',
      'quicktech.common.services.TicketsPermissionsService', 'localStorageService', '$timeout', '$location', 'quicktech.common.services.ticketMobileSettings',
      function ($scope, $state, CompaniesService, UsersService, PermissionsService, SharedStateService,
                $stateParams, $rootScope, TicketsPermissionsService, localStorageService, $timeout, $location, ticketMobileSettings) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.TicketsPermissionsService = TicketsPermissionsService;
        $scope.PermissionsService = PermissionsService;
        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.draftsSharedState = SharedStateService.getSharedState('draftsHeader');
        $scope.companyProfileSharedState = SharedStateService.getSharedState('companyProfile');
        $scope.ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');
        $scope.showCounter = location.hash.includes('receivable/list');


        $rootScope.$on('$locationChangeStart', function(event, next, current) {
          $scope.showCounter = location.hash.includes('receivable');
        });
        $scope.usersCurrentCompany = UsersService.getAllByCompanyIdNonArchived(CompaniesService.getCurrentCompany().id);


        $scope.ticketMobileSettings = ticketMobileSettings;


        // $scope.$watch('ticketMobileSettings', function(val) {
      
        // }, true)

        $scope.currentCompany = CompaniesService.getCurrentCompany();
 
        $scope.addQuickSession = function () {
          sharedQuickSession.isCreateNew = true;
        };


        $scope.$watch(function() {
          return $rootScope.isTicketOpened;
        }, function(val) {
          $scope.isTicketOpened = val;
        })

        $scope.$watch(function() {
          return $rootScope.isTicketEditOpened;
        }, function(val) {
          $scope.isTicketEditOpened = val;
        })

        $scope.closeEditTicket = function() {
          $rootScope.isMobileUpdateShown = false;
        }

        $scope.toggleLeftPanel = function(state) {
          $rootScope.isLeftPanelOpened = state;
          $rootScope.isLeftPanelHidden = !$rootScope.isLeftPanelHidden;
        }

        $scope.getAssignUserId = function (ticket) {
          if (ticket) {
            if (ticket.assignedUser && ticket.assignedUser.id && ticket.assignedUser.id.length) {
              return ticket.assignedUser.id;
            } else {
              return ticket.assignedUserId;
            }
          }
        };

        $scope.getClientCompanies = function () {
          var clientCompanies = CompaniesService.getClientCompanies();

          if (clientCompanies.length) {
            clientCompanies = clientCompanies.filter(function (company) {
              return !company.isDefault;
            });
          }

          return clientCompanies;
        };

        $scope.userReadable = function (text) {
          if (text) {
            var words = text.split(/[\-_]/),
              result = '';

            for (var i = 0, len = words.length; i < len; i++) {
              var word = words[i];
              result += word[0].toUpperCase() + word.slice(1).toLowerCase();

              if (i !== len - 1) {
                result += ' ';
              }
            }

            return result;
          }
        };

        $scope.getPageNameByState = function () {
          if ($state.includes("tickets")) {
            return 'tickets';
          } else if ($state.includes("drafts")) {
            return 'inbox';
          } else if ($state.includes("users")) {
            return 'users';
          } else if ($state.includes("companies")) {
            return 'companies';
          } else if ($state.includes("products")) {
            return 'products';
          } else if ($state.includes("services")) {
            return 'services';
          } else if ($state.includes("password-manager")) {
            return 'password-manager';
          } else if ($state.includes("accounting.billable")) {
            return 'billable';
          } else if ($state.includes("receivable")) {
            return 'receivable';
          } else if ($state.includes("payments")) {
            return 'payments';
          } else if ($state.includes("receipt-archive")) {
            return 'receipt-archive';
          } else if ($state.includes("service-agreements")) {
            return 'contracts';
          } else if ($state.includes("settings")) {
            if ($state.is("settings")) {
              return 'Account Settings';
            } else {
              return $state.current.name.split('.').pop()
                .replace(/([A-Z])/g, '-$1');
            }
          } else if ($state.includes("devices")) {
            return 'devices';
          } else if ($state.includes("companyDevices")) {
            return 'company-devices';
          } else if ($state.includes("quickSupport")) {
            return 'quick-support';
          } else if ($state.current.url.indexOf('dashboard') > -1) {
            return 'Dashboard';
          }
          else if ($state.current.url.indexOf('reports') > -1) {
            return 'Reports';
          }
        };

        $scope.$watch(function () {
          return $stateParams.listType;
        }, function (value) {
          $scope.listType = value;
          if (value) {
            $scope.ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');
          } else {
            $scope.ticketsSharedState = undefined;
          }
        });

        $scope.isShowTicketsBulkAction = function () {
          return $scope.ticketsSharedState && $scope.ticketsSharedState.checkedTicketsIds.length;
        };

        $scope.isShowDraftsBulkAction = function () {
          return $scope.draftsSharedState && $scope.draftsSharedState.selectedIds.length;
        };

        $scope.companyProfileTabsMap = {
          'tickets-all': 'ALL',
          'tickets-unassigned': 'UNASSIGNED',
          'tickets-closed': 'CLOSED',
          'tickets-inProgress': 'IN_PROGRESS',
          'tickets-onHold': 'ON_HOLD',
          'tickets-completed': 'COMPLETED'
        };

        $scope.isCompanyProfileTicketPageIsOpen = function () {
          return $state.includes('companyProfile')
        };

        $scope.getOpenedUsersTab = function () {
          return $location.search().tabName
        };

        $scope.isToggleLeftPanelButtonAvailable = function() {
          return ($state.includes('settings') || $state.includes('reports') )
        };

        $scope.tooltipForLeftPanelToggleIcon = function() {
          return window.outerWidth <= 1024 ? '' : 'Toggle left panel'
        }


      }]);

}());
