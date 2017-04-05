'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope', 'DevicesService',
      'quicktech.common.services.PermissionsService', 'CompaniesService', 'TutorialsService', '$uibModal',
      function ($scope, SharedStateService, $state, $rootScope, DevicesService, PermissionsService, CompaniesService,
                TutorialsService, $uibModal) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession'),
          usersSharedState = SharedStateService.getSharedState('usersHeader'),
          companiesSharedState = SharedStateService.getSharedState('companiesHeader'),
          passwordSharedState = SharedStateService.getSharedState('passwordsHeader');

        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.usersSharedState = usersSharedState;
        $scope.companiesSharedState = companiesSharedState;
        $scope.passwordSharedState = passwordSharedState;
        $scope.qSHistoryExpanded = false;
        $scope.maxDate = Date.now();
        $scope.templates = [
          'OFFICE_365_ACCOUNT',
          'MICROSOFT_ACCOUNT',
          'EMAIL_ACCOUNT',
          'HOSTING',
          'DEVICE',
          'GENERIC',
          'AGENT',
          'LOCAL_USER_ACCOUNT'
        ];

        //for one time popover
        // $scope.changeCompanyStatusToActive = CompaniesService.changeCompanyStatusToActive;
        $scope.currentCompany = CompaniesService.getCurrentCompany();

        $scope.clientCompanies = CompaniesService.getClientCompanies;
        TutorialsService.getTypes(function (resp) {
          $scope.tutorialTypes = resp;
        });

        $scope.$state = $state;
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.qSHistory = DevicesService.getOneTimeHistory();
        DevicesService.getDevicesCount($scope, function (resp) {
          $scope.devices = [];
          for (var companyId in resp) {
            var devicesByCompany = resp[companyId];
            if (companyId !== 'staticCopy') {
              for (var i = 0; i < devicesByCompany.length; i++) {
                var device = devicesByCompany[i];
                device.companyId = companyId;
                $scope.devices.push(device);
              }
            }
          }
        });

        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });

        $scope.$watch(function () {
          return $state.current.url + ' ' + $state.current.name;
        }, function (value) {
          if (value && value !== '^ ') {
            $scope.openedCategory = getOpenedCategory(value);

            if ($scope.openedCategory) {
              document.title = $scope.userReadable($scope.openedCategory);
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

        $scope.onClickReports = function() {
          $rootScope.isLeftPanelHidden = true;
          $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
          document.title = 'Reports'
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

        $scope.openTutorial = function (type) {
          window.open('/tutorials/pdf/' + type + '.pdf');
        };

        $scope.onDateRangeChange = function (dates) {
          $scope.filterCompanies('dateRange', dates);
        };

        $scope.onExpireDateChange = function (dates) {
          $scope.filterPasswords('byExpireDate', dates[0]);
        };

        $scope.filterCompanies = function (filter, value) {
          var sharedFilter = companiesSharedState.filter;

          if ($state.includes('companyProfile') && (filter !== 'dateRange' || value && value.length)) {
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
              var endDate = value[1];
              if (endDate) {
                value[1] = new Date(endDate.setHours(23, 59, 59));
              }
              sharedFilter.dateRange = value;
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
              sharedFilter.companyId = '';
              break;
            case 'byCompany':
              sharedFilter.companyId = value;
              sharedFilter.industry = '';
              break;
            default:
              clearFilter(sharedFilter);
          }
        };

        $scope.filterPasswords = function (filter, value) {
          var sharedFilter = passwordSharedState.filter;

          switch (filter) {
            case 'byCompany':
              sharedFilter.companyId = value;
              break;
            case 'byDevice':
              sharedFilter.agentId = value;
              break;
            case 'byType':
              sharedFilter.template = value;
              break;
            case 'byExpireDate':
              sharedFilter.expiredDate = value;
              break;
            default:
              clearFilter(sharedFilter);
          }
        };

        $scope.toggleQSHistory = function ($event) {
          $scope.qSHistoryExpanded = !$scope.qSHistoryExpanded;
        };

        $scope.getCompanyName = function (companyId) {
          if (companyId) {
            var company = CompaniesService.getOneById(companyId);
            if (company) {
              return company.name;
            }
          }
        };

        $scope.getDeviceNameByAgentId = function (agentId) {
          var device = DevicesService.getOneByAgentId(agentId);
          return device ? device.hostName || device.ip : '';
        };

        $scope.$on('clearLeftPanelDateRange', function () {
          if ($scope.clearDateRange) {
            $scope.clearDateRange();
          }
        });

        $scope.openCreateCustomerReportModal = function () {
          $uibModal.open({
            templateUrl: '/html/scripts/core/left-panel/customer-ticket-report/create-report-modal.tpl.html',
            controller: 'quicktech.core.leftPanel.createReportCtrl',
            windowClass: 'modal-customer-report',
            animation: true
          });
        };

        $scope.userReadable = function (text) {
          if (!text) {
            return '';
          }

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
        };

        $scope.filterDevice = function (inputValue) {

          if (!$scope.passwordSharedState.filter.companyId && !inputValue)
            return noFilter;

          var keyword = inputValue.toLowerCase().trim();

          if (!$scope.passwordSharedState.filter.companyId &&
            (keyword.length === 0 || keyword === "[$empty$]" || keyword === "undefined"))
            return noFilter;

          return function (device) {

            if ($scope.passwordSharedState.filter.companyId
              && device.companyId != $scope.passwordSharedState.filter.companyId)
              return false;

            if(keyword.length === 0 || keyword === "[$empty$]" || keyword === "undefined")
              return true;

            return ((device.hostName && device.hostName.toLowerCase().indexOf(keyword) >= 0)
            || (device.ip && device.ip.toLowerCase().indexOf(keyword) >= 0));
          };

          function noFilter() {
            return true;
          }
        };

        $scope.getCompanyName = function(companyId){

          if(!companyId)
            return;

          var company = CompaniesService.getOneById(companyId);

          if(company)
            return company.name;
        };

        //for one time popover
        // $scope.initCompanyStatusWatch = function (hidePopoverFunc) {
        //   var unwatch = $scope.$watch('currentCompany.status', function (newValue, oldValue) {
        //     if (newValue === 'ACTIVE' && oldValue === 'SIGN_UP') {
        //       hidePopoverFunc && hidePopoverFunc();
        //       unwatch();
        //     }
        //   });
        //
        //   var unsubscribe = $scope.$on('$locationChangeStart', function () {
        //     if ($scope.currentCompany.status === 'SIGN_UP') {
        //       $scope.changeCompanyStatusToActive();
        //       hidePopoverFunc && hidePopoverFunc();
        //       unsubscribe();
        //     }
        //   })
        // };

        function clearFilter(sharedFilter) {
          for (var prop in sharedFilter) {
            sharedFilter[prop] = '';
          }

          if ($scope.clearDateRange) {
            $scope.clearDateRange();
          }

          SharedStateService.getSharedState('globalSearch').searchValue = '';
        }

        function getOpenedCategory(url) {
          if (url.indexOf('quickSupport') > -1) {
            return 'quick-support';
          } else if (url.indexOf('settings.') > -1) {
            return 'settings';
          } else if (url.indexOf('tickets') > -1) {
            return 'tickets';
          } else if (url.indexOf('drafts') > -1) {
            return 'inbox';
          } else if (url.indexOf('companies') > -1 || url.indexOf('companyProfile') > -1) {
            return 'companies';
          } else if (url.indexOf('users') > -1) {
            return 'users';
          } else if (url.indexOf('accounting') > -1) {
            return 'billing';
          } else if (url.indexOf('inventory') > -1) {
            return 'inventory';
          } else if (url.indexOf('password-manager') > -1) {
            return 'password-manager';
          } else if (url.indexOf('reports') > -1) {
            return 'reports';
          } else {
            return undefined;
          }
        }

      }]);

}());
