'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope', 'DevicesService',
      'quicktech.common.services.PermissionsService',
      'CompaniesService', 'TutorialsService', '$uibModal',
      'TicketsService', 'ColorsService', 'TagsService', 'CustomStorageService', 'UsersService',
      function ($scope, SharedStateService, $state, $rootScope, DevicesService, PermissionsService, CompaniesService,
                TutorialsService, $uibModal, TicketsService, ColorsService,TagsService, CustomStorageService, UsersService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession'),
          usersSharedState = SharedStateService.getSharedState('usersHeader'),
          companiesSharedState = SharedStateService.getSharedState('companiesHeader'),
          passwordSharedState = SharedStateService.getSharedState('passwordsHeader'),
          ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');

        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.usersSharedState = usersSharedState;
        $scope.companiesSharedState = companiesSharedState;
        $scope.passwordSharedState = passwordSharedState;
        $scope.ticketsSharedState = ticketsSharedState;
        $scope.clientCompanies = CompaniesService.getClientCompanies;
        $scope.allUsers = UsersService.getAllUsers;
        $scope.clientUsers = UsersService.getClientUsers;
        $scope.techUsers = UsersService.getTechUsers;
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

        $scope.$state = $state;
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.ticketsCounter;

        //for one time popover
        // $scope.changeCompanyStatusToActive = CompaniesService.changeCompanyStatusToActive;
        $scope.currentCompany = CompaniesService.getCurrentCompany();

        $scope.tagColors = TagsService.getColors();

        $rootScope.ticketsTagsColors = {
          unassigned: 0,
          completed: 1,
          inProgress: 2,
          onHold: 9
        };

        CustomStorageService.getUserCustomStorageValue('companiesPageFilterByIndustryHistory', function(resp) {
          $scope.industryFilterHistoryCompaniesPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('userPageFilterByIndustryHistory', function(resp) {
          $scope.industriesFilterHistoryUserPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('userPageFilterByCompanyHistory', function(resp) {
          $scope.companiesFilterHistoryUserPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketPageFilterByCompanyHistory', function(resp) {
          $scope.companiesFilterHistoryTicketsPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketPageFilterByClientUsersHistory', function(resp) {
          $scope.clientUsersFilterHistoryTicketsPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketPageFilterByTechUsersHistory', function(resp) {
          $scope.techUsersFilterHistoryTicketsPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketsTagsColors', function(resp) {
          if(resp) {
            $rootScope.ticketsTagsColors = resp;
          }
        });


        function sendNewFilterToStorage(customerKey, recentArray, item) {
          var newHistoryItemArray = [];
          var ifItemAlreadyInTheList = false;
          if(recentArray) {
            //ifItemAlreadyInTheList = recentArray.some((s) => s === item);
            ifItemAlreadyInTheList = recentArray.some(function(s) {
              return s === item;
            });
          }

          if(ifItemAlreadyInTheList) {
            newHistoryItemArray = recentArray;
          } else {
            newHistoryItemArray.push(item);
            if(recentArray.length && recentArray.length>0) {
              newHistoryItemArray.push(recentArray[0]);
              newHistoryItemArray.push(recentArray[1]);
            }
          }

          var jsonArray = JSON.stringify(newHistoryItemArray);
          var itemToSend = {
            customKey: customerKey,
            value: jsonArray
          };

          CustomStorageService.saveUserCustomStorageItem(itemToSend, function(resp) {
            if(recentArray === $scope.industryFilterHistoryCompaniesPage) {
              $scope.industryFilterHistoryCompaniesPage = JSON.parse(resp.value);
            } else if(recentArray === $scope.industriesFilterHistoryUserPage) {
              $scope.industriesFilterHistoryUserPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.companiesFilterHistoryUserPage) {
              $scope.companiesFilterHistoryUserPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.companiesFilterHistoryTicketsPage) {
              $scope.companiesFilterHistoryTicketsPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.clientUsersFilterHistoryTicketsPage) {
              $scope.clientUsersFilterHistoryTicketsPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.techUsersFilterHistoryTicketsPage) {
              $scope.techUsersFilterHistoryTicketsPage = JSON.parse(resp.value);
            }
          })
        }

        function getCompanyNameById(id) {
          //var company = $scope.clientCompanies().find((c) => c.id === id);
          var company = $scope.clientCompanies().find(function(c) {
            return c.id === id;
          });
          return company ? company.name : '';
        }

        function getCompanyIdByCompanyName(name) {
          //var company = $scope.clientCompanies().find((c) => c.name === name);
          var company = $scope.clientCompanies().find(function(c) {
            return c.name === name;
          });
          return company ? company.id : '';
        }

        function getUserIdByUserFullName(name) {
          // var user =  $scope.allUsers().find((user) => {
          //   var fullName = user.firstName+' '+user.lastName;
          //   return name === fullName;
          // });
          var user =  $scope.allUsers().find(function(user) {
            var fullName = user.firstName+' '+user.lastName;
            return name === fullName;
          });
          return user.id;
        }


        $scope.$watch('companiesSharedState.filter.industry', function (value) {
          if (value ) {
            sendNewFilterToStorage("companiesPageFilterByIndustryHistory", $scope.industryFilterHistoryCompaniesPage, value)
          }
        });

        $scope.$watch('usersSharedState.filter.industry', function (value) {
          if (value ) {
            sendNewFilterToStorage("userPageFilterByIndustryHistory", $scope.industriesFilterHistoryUserPage, value)
          }
        });

        $scope.$watch('usersSharedState.filter.companyId', function (value) {
          if (value ) {
            sendNewFilterToStorage("userPageFilterByCompanyHistory", $scope.companiesFilterHistoryUserPage, getCompanyNameById(value))
          }
        });

        $scope.$watch('ticketsSharedState.filter.companyId', function (value) {
          if (value ) {
            sendNewFilterToStorage("ticketPageFilterByCompanyHistory", $scope.companiesFilterHistoryTicketsPage, getCompanyNameById(value));
            ticketsSharedState.filter.completed = false;
            ticketsSharedState.filter.inProgress = false;
            ticketsSharedState.filter.onHold = false;
            ticketsSharedState.filter.onHoldTag = false;
            $scope.globalSearch.count = '';
            $scope.clientsUsersByCompany = $scope.clientUsers().filter((user) => user.company.id === value);
            $scope.techUsersByCompany = $scope.techUsers().filter((user) => user.company.id === value);
          } else if (value === undefined) {
            //var sharedFilter = ticketsSharedState.filter;
            clearFilter(ticketsSharedState.filter);
          }
        });

        $scope.$watch('ticketsSharedState.filter.clientUserId', function (value) {
          if (value ) {
            ticketsSharedState.filter.completed = false;
            ticketsSharedState.filter.inProgress = false;
            ticketsSharedState.filter.onHold = false;
            ticketsSharedState.filter.onHoldTag = false;
            $scope.globalSearch.count = '';
            sendNewFilterToStorage("ticketPageFilterByClientUsersHistory", $scope.clientUsersFilterHistoryTicketsPage, $scope.getUserByID(value))
          } else if(value === undefined) {
            ticketsSharedState.filter.clientUserId = '';
          }
        });

        $scope.$watch('ticketsSharedState.filter.techUserId', function (value) {
          if (value ) {
            ticketsSharedState.filter.completed = false;
            ticketsSharedState.filter.inProgress = false;
            ticketsSharedState.filter.onHold = false;
            ticketsSharedState.filter.onHoldTag = false;
            $scope.globalSearch.count = '';
            sendNewFilterToStorage("ticketPageFilterByTechUsersHistory", $scope.techUsersFilterHistoryTicketsPage, $scope.getUserByID(value))
          } else if(value === undefined) {
            ticketsSharedState.filter.techUserId = '';
          }
        });

        $scope.applyIndustryFilterFromHistoryListCompanyPage = function(value) {
          companiesSharedState.filter.industry = value;
        };

        $scope.applyIndustryFilterFromHistoryListUserPage = function(value) {
          usersSharedState.filter.industry = value;
        };

        $scope.applyCompanyFilterFromHistoryListUserPage = function(value) {
          usersSharedState.filter.companyId = getCompanyIdByCompanyName(value);
        };

        $scope.applyCompanyFilterFromHistoryListTicketPage = function(value) {
          ticketsSharedState.filter.companyId = getCompanyIdByCompanyName(value);
        };

        $scope.applyClientUserFilterFromHistoryListTicketPage = function(value) {
          ticketsSharedState.filter.clientUserId = getUserIdByUserFullName(value);
        };

        $scope.applyTechUserFilterFromHistoryListTicketPage = function(value) {
          ticketsSharedState.filter.techUserId = getUserIdByUserFullName(value);
        };

        TutorialsService.getTypes(function (resp) {
          $scope.tutorialTypes = resp;
        });


        $scope.changeTicketsTagColor = function(type, colorCode) {
          $scope.ticketsTagsColors[type] = colorCode;

          var jsonObj = JSON.stringify($rootScope.ticketsTagsColors);
          var itemToSend = {
            customKey: 'ticketsTagsColors',
            value: jsonObj
          };
          CustomStorageService.saveUserCustomStorageItem(itemToSend, function(resp) {
            console.log(resp);
          })
        };

        $scope.changeCompanyColor = function(type, colorCode) {
          var dataToSend = {
            type: type,
            colorCode: colorCode
          };
          ColorsService.putCompaniesColors(dataToSend, function(resp) {
            console.log(resp);
          })
        };

        ColorsService.getCompaniesColors($scope, function(resp) {
          $scope.companiesColors = resp;
        });

        $scope.changeUserColor = function(type, colorCode) {
          console.log("colorCode: ", colorCode);
          console.log("type: ", type);
          var dataToSend = {
            type: type,
            colorCode: colorCode
          };
          ColorsService.putUsersColors(dataToSend, function(resp) {
            console.log(resp);
          })
        };

        ColorsService.getUserColors($scope, function(resp) {
          $scope.usersColors = resp;
        });

        $scope.showReportsPage = function() {
          return PermissionsService.isAllowed('VIEW_SALES_REPORT') ||
            PermissionsService.isAllowed('VIEW_FINANCIAL_REPORT') ||
            PermissionsService.isAllowed('VIEW_PERFORMANCE_REPORT') ||
            PermissionsService.isAllowed('VIEW_REMOTE_ACCESS_REPORT') ||
            PermissionsService.isAllowed('VIEW_TAXES_REPORT')
        };

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

        TicketsService.getAllCounts( function(resp) {
          $scope.ticketsCounter = resp;

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

            if (!$scope.openedCategory || $scope.openedCategory === 'reports') {
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
          clearFilter(ticketsSharedState.filter);
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

        $scope.showArchivedCompanies = function() {
          $rootScope.showArchivedCompanies = true;
        };

        $scope.isArchivedCompaniesToShow = function() {
          return $rootScope.showArchivedCompanies;
        };

        $scope.ifTicketFilterEnable = function () {
          return ticketsSharedState.filter.completed ||
            ticketsSharedState.filter.inProgress ||
            ticketsSharedState.filter.onHold ||
            ticketsSharedState.filter.onHoldTag;
        };

        $scope.filterTickets = function(filter, value) {
          $state.go('tickets', {listType: 'all'});
          var sharedFilter = ticketsSharedState.filter;
          switch(filter) {
            case 'completed':
              clearFilter(sharedFilter);
              sharedFilter.completed = true;
              $scope.globalSearch.count = $scope.ticketsCounter.COMPLETED;
              break;
            case 'inProgress':
              clearFilter(sharedFilter);
              sharedFilter.inProgress = true;
              $scope.globalSearch.count = $scope.ticketsCounter.IN_PROGRESS;
              break;
            case 'onHold':
              clearFilter(sharedFilter);
              sharedFilter.onHold = true;
              $scope.globalSearch.count = $scope.ticketsCounter.ON_HOLD;
              break;
            case 'onHoldTag':
              clearFilter(sharedFilter);
              sharedFilter.onHoldTag = true;
              $scope.globalSearch.count = $scope.ticketsCounter.ON_HOLD;
              break;
            default:
              clearFilter(sharedFilter);
          }
        };

        $scope.filterCompanies = function (filter, value) {
          var sharedFilter = companiesSharedState.filter;
          $rootScope.showArchivedCompanies = false;

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

        $scope.showArchivedUsers = function() {
          var sharedFilter = usersSharedState.filter;
          clearFilter(sharedFilter);
          $rootScope.showArchivedUsers = true;
        };

        $scope.isArchivedUsersToShow = function() {
          return $rootScope.showArchivedUsers;
        };

        $scope.filterUsers = function (filter, value) {
          var sharedFilter = usersSharedState.filter;

          switch (filter) {
            case 'managers':
              sharedFilter.isStandard = '';
              sharedFilter.isContact = true;
              break;
            case 'standard':
              sharedFilter.isContact = '';
              sharedFilter.isStandard = true;
              break;
            case 'leads':
              $rootScope.showArchivedUsers = false;
              clearFilter(sharedFilter);
              sharedFilter.isLead = true;
              break;
            case 'clients':
              $rootScope.showArchivedUsers = false;
              clearFilter(sharedFilter);
              sharedFilter.isClient = true;
              break;
            case 'archived':
              clearFilter(sharedFilter);
              sharedFilter.isArchived = true;
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
              $rootScope.showArchivedUsers = false;
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
              sharedFilter.deviceId = value;
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

        $scope.getDeviceNameById = function (deviceId) {
          var device = DevicesService.getOneByDeviceId(deviceId);
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

        $scope.getUserByID = function(userId) {
          if(!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if(user) {
            return user.firstName+' '+user.lastName;
          }
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
