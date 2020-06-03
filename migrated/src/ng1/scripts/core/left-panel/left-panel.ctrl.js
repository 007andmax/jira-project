'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope', 'DevicesService',
      'quicktech.common.services.PermissionsService',
      'CompaniesService', 'TutorialsService', '$uibModal',
      'TicketsService', 'ColorsService', 'TagsService', 'CustomStorageService', 'UsersService',
      '$timeout', '$location', 'ReceivableService', 'TaxesService', 'PaymentsService', 'ProductsService',
      'quicktech.common.services.UserConfirmationsService', '$stateParams',
      function ($scope, SharedStateService, $state, $rootScope, DevicesService, PermissionsService, CompaniesService,
        TutorialsService, $uibModal, TicketsService, ColorsService, TagsService,
        CustomStorageService, UsersService, $timeout, $location, ReceivableService, TaxesService, PaymentsService,
        ProductsService, UserConfirmationsService, $stateParams) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession'),
          usersSharedState = SharedStateService.getSharedState('usersHeader'),
          companiesSharedState = SharedStateService.getSharedState('companiesHeader'),
          passwordSharedState = SharedStateService.getSharedState('passwordsHeader'),
          ticketsSharedState = SharedStateService.getSharedState('ticketsHeader'),
          companyProfileSharedState = SharedStateService.getSharedState('companyProfile');

        var $win = $(window);

        $scope.newAngular = $location.url().startsWith('/ng2') ? true : false;

        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.usersSharedState = usersSharedState;
        $scope.companiesSharedState = companiesSharedState;
        $scope.passwordSharedState = passwordSharedState;
        $scope.ticketsSharedState = ticketsSharedState;
        $scope.companyProfileSharedState = companyProfileSharedState;
        $scope.clientCompanies = CompaniesService.getClientCompanies;
        $scope.allUsers = UsersService.getAllUsers;
        $scope.clientUsers = UsersService.getClientUsers;
        $scope.techUsers = UsersService.getTechUsers;
        $scope.qSHistoryExpanded = false;
        $scope.maxDate = Date.now();
        $scope.disableCreateCategory = false;
        $scope.currentCategoryState = $stateParams.category;
        $scope.$watchCollection(function () {
          return $state.params;
        }, function () {
          return $scope.currentCategoryState = $stateParams.category;
        });
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

        $scope.test = [];

        //categories start
        $scope.countOfCategories = 10;
        $scope.inventoryCategoryList = ProductsService.getCategories($scope);
         
        var company_id = localStorage.getItem('company_id') || null;
        $scope.checkDublicateCategory = function () {
          var duplicateCategory = $scope.inventoryCategoryList.filter(function (item) {
            return item.name.toLowerCase() === $scope.newCategory.toLowerCase();
          });
          if (duplicateCategory && duplicateCategory[0]) {
            return $scope.disableCreateCategory = true;
          } else {
            return $scope.disableCreateCategory = false;
          }
        };
        $rootScope.$on('hiddenLeftPanel', function (event, toState, toParams, fromState) {
          $scope.isLeftPanelHidden = true;
          $scope.isRightPanelHidden = true;
        });
        $scope.clearCategory = function() {
          $scope.newCategory = '';
        };

        $scope.changeShowAllCategories = function () {
          if ($scope.countOfCategories === 10) {
            $scope.countOfCategories = $scope.inventoryCategoryList.length;
          } else {
            $scope.countOfCategories = 10;
          }
        };

        $scope.getAllProductsCount = function () {
          var count = 0;
          $scope.inventoryCategoryList.map(function (item) {
            count += item.productsAmount;
          });
          return count;
        };

        $scope.deleteCategory = function (categoryId) {
          var confirmMesage = 'Do you want to delete category?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            ProductsService.deleteCategory(categoryId);
          });

        };

        $scope.addCategory = function (category) {
          ProductsService.saveCategory({
            name: category
          });
          $scope.newCategory = ''
        };

        $scope.newCategory = '';
        //categories end

        $scope.listOfMobileTitles = ["areUsersOpened", 'areCompaniesOpened', "areTicketsOpened"];

        $scope.currentUser = UsersService.getCurrentUser();

        $scope.$state = $state;
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.ticketsCounter;
        $scope.ticketsCounterByCompany;

        $scope.dropdownByCompanyTicketPage = false;
        $scope.dropdownByUserTicketPage = false;
        $scope.dropdownByTechUserTicketPage = false;
        $scope.dropdownByIndustryCompanyPage = false;
        $scope.dropdownByIndustryUserPage = false;
        $scope.dropdownByCompanyUserPage = false;
        $scope.dropdownSearchByDeviceCompanyPasswordManager = false;
        $scope.dropdownSearchByUserCompanyPasswordManager = false;

        $scope.dropdownByTechUserCompanyProfilePage = false;
        $scope.dropdownByUserCompanyProfilePage = false;

        $scope.CompanyProfileTicketsPage = false;
        $scope.CompanyProfileUsersPage = false;
        $scope.CompanyProfileDevicesPage = false;
        $scope.CompanyProfilePasswordManagerPage = false;
        $scope.CompanyProfileProductsPage = false;
        $scope.CompanyProfileInvoicesPage = false;
        $scope.ticketFilterTags = [];

        $scope.companyCounters = {};

        $scope.salesPerson = '';

        $scope.$watch(function () {
          return $rootScope.companyCounters
        }, function (val) {
          $scope.companyCounters = val;
        }, true)

        $scope.getFullName = function (client) {
          if (client) {
            var isAllSpaces = client.lastName === "    ";
            if (client.lastName && !isAllSpaces) {
              return client.firstName + ' ' + client.lastName;
            } else {
              return client.firstName;
            }
          }
        };

        $scope.getUserByID = function (userId) {
          if (!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if (user) {
            if (user.lastName === '    ') {
              return user.firstName
            } else {
              return user.firstName + ' ' + user.lastName;
            }
          }
        };

        $scope.toggleClickedStatus = function (state) {


          $scope.isSalesPersonClicked = state;
        }


        $scope.activeTechUsers = function () {

          return UsersService.getTechUsers().filter(function (el) {
            return el.userEnabled && !el.deletedAt;;
          })
        }

        $scope.$watch(function () {
          return $scope.salesPerson
        }, function (val) {

          if (window.innerWidth <= 414) {
            $scope.companiesSharedState.filter.salesPerson = val;

            if (val && $scope.checkSalesValueMatched(val)) {

              sendNewFilterToStorage("companiesPageFilterBySalesHistory", $scope.salesFilterHistoryCompaniesPage, $scope.getUserByID(val))
            }
          } else {
            $timeout(function () {
              if (!val && $scope.isSalesPersonClicked) {
                $scope.toggleClickedStatus(false);
                return;
              }
              if (val === ' ') return;
              $scope.companiesSharedState.filter.salesPerson = val;

              if (val && $scope.checkSalesValueMatched(val)) {

                sendNewFilterToStorage("companiesPageFilterBySalesHistory", $scope.salesFilterHistoryCompaniesPage, $scope.getUserByID(val))
              }



            }, 100)
          }
        });

        $scope.currentCompany = CompaniesService.getCurrentCompany();

        $scope.tagColors = TagsService.getColors();

        $rootScope.ticketsTagsColors = {
          unassigned: 1,
          completed: 2,
          inProgress: 0,
          onHold: 7
        };

        $scope.companyFilterTags = [];
        $scope.mobileFilterTags = [];


        $scope.toggleMobileLeftPanel = function (state) {
          $rootScope.isLeftPanelOpened = state;
        };

        $scope.toggleMobileMenu = function (menu) {
          TicketsService.getAllCounts(function (resp) {
            resp && ($scope.ticketsCounter = resp);
            return $scope.test;
          });
          $scope.listOfMobileTitles.forEach(function (title) {
            $scope[title] = false;
          });

          $scope[menu] = true;
        };

        $scope.$watch('companyFilterTags', function (val) {
          if (val.length) {
            TagsService.filterCompanies(val, function (res) {
              $rootScope.filteredCompanies = res.data;
            })
          } else {
            $rootScope.filteredCompanies = false;
          }
        }, true);

        TicketsService.getAllCounts(function (resp) {
          resp && ($scope.ticketsCounter = resp);
          return $scope.test;
        });

        $scope.$watch('ticketsCounter', function (newValue, oldValue) {
          $scope.ticketsCounter = newValue;
          return $scope.ticketsCounter;

        });

        $scope.$watch(function () {
          return $rootScope.exampleCompanyDeleted;
        }, function (val) {
          if (val) {
           
            TicketsService.getAllCounts(function (resp) {
              $scope.ticketsCounter = resp;
            });
          }
        });

        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });

        function deactivateAllCompanyProfileTabs() {
          $scope.CompanyProfileTicketsPage = false;
          $scope.CompanyProfileUsersPage = false;
          $scope.CompanyProfileDevicesPage = false;
          $scope.CompanyProfilePasswordManagerPage = false;
          $scope.CompanyProfileProductsPage = false;
          $scope.CompanyProfileInvoicesPage = false;
        }

        $scope.activateCompanyProfileTab = function (tabToActivate) {

          if (tabToActivate == 'CompanyProfilePasswordManagerPage') {
            $scope.goToTab(`#/ng2/company-password-manager`);
            return;
          }
          if (tabToActivate == 'CompanyProfileUsersPage') {
            $scope.goToTab(`#/ng2/company-user`);
            return;
          }

          if (tabToActivate == 'CompanyProfileProductsPage') {
            $scope.goToTab(`#/ng2/company-products`);
            return;
          }

          if (tabToActivate == 'CompanyProfileTicketsPage') {
            $scope.goToTab(`#/ng2/company-tickets`);
            return;
          }
         
          var tab = $scope[tabToActivate];
          deactivateAllCompanyProfileTabs();
          if (tab === false) {
            $scope[tabToActivate] = true;
          }


        };
        $scope.goToTab = function (url) {
          let body = document.querySelector('.left-panel__category-wrap');
          var link = document.createElement('a');
          body.appendChild(link);
          link.href = url;
          var e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
        }

        $scope.goToTab = function (url) {
          let body = document.querySelector('.left-panel__category-wrap');
          var link = document.createElement('a');
          body.appendChild(link);
          link.href = url;
          var e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
        }

        $scope.companyIconClick = function () {
          $scope.isLeftPanelHidden = !$scope.isLeftPanelHidden
        };

        $scope.isCompanyProfile = function () {
          return $state.includes('companyProfile')
        };

        CustomStorageService.getUserCustomStorageValue('companiesPageFilterByIndustryHistory', function (resp) {
          $scope.industryFilterHistoryCompaniesPage = resp;
        });



        CustomStorageService.getUserCustomStorageValue('companiesPageFilterBySalesHistory', function (resp) {
          $scope.salesFilterHistoryCompaniesPage = resp;
        });


        CustomStorageService.getUserCustomStorageValue('userPageFilterByIndustryHistory', function (resp) {
          $scope.industriesFilterHistoryUserPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('userPageFilterByCompanyHistory', function (resp) {
          $scope.companiesFilterHistoryUserPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketPageFilterByCompanyHistory', function (resp) {
          $scope.companiesFilterHistoryTicketsPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketPageFilterByClientUsersHistory', function (resp) {
          $scope.clientUsersFilterHistoryTicketsPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketPageFilterByTechUsersHistory', function (resp) {
          $scope.techUsersFilterHistoryTicketsPage = resp;
        });

        CustomStorageService.getUserCustomStorageValue('PasswordFilterByDevice', function (resp) {
          $scope.PasswordFiltersDyDevice = resp;
        });

        CustomStorageService.getUserCustomStorageValue('PasswordFilterByUser', function (resp) {
          $scope.PasswordFiltersDyUser = resp;
        });

        CustomStorageService.getUserCustomStorageValue('ticketsTagsColors', function (resp) {
          if (resp) {
            $rootScope.ticketsTagsColors = resp;
          }
        });

        $scope.stateMobileGo = function () {
          $scope.lastSavedStatus = arguments;
        }

        $scope.applyMobileFilters = function () {
          $scope.companiesSharedState.filter.industry = $scope.mobileIndustryFilter;
          $scope.salesPerson = $scope.mobileSalesPerson;
          $scope.companyFilterTags = $scope.mobileFilterTags.slice();

          $scope.toggleMobileCompanyFilters(false);
        }

        $scope.closeAndResetMobileFilters = function () {
          $scope.mobileIndustryFilter = $scope.companiesSharedState.filter.industry;
          $scope.mobileSalesPerson = $scope.companiesSharedState.filter.salesPerson;
          $scope.mobileFilterTags = $scope.companyFilterTags.slice();


          $scope.toggleMobileCompanyFilters(false);
        }

        $scope.applyMobileUsersFilters = function () {
          $scope.filterDesignation = $scope.mobileFilterDesignation;
          $scope.userPageCompanyIdFilter = $scope.mobileUserPageCompanyIdFilter
          $scope.filterUsers('title', $scope.filterDesignation);

          $scope.usersSharedState.filter.industry = $scope.mobileFilterUsersIndustry;

          $scope.toggleMobileUsersFilters(false);
        }

        $scope.closeAndResetMobileUsersFilters = function () {
          $scope.mobileFilterDesignation = $scope.filterDesignation;
          $scope.mobileUserPageCompanyIdFilter = $scope.userPageCompanyIdFilter;
          $scope.mobileFilterUsersIndustry = $scope.usersSharedState.filter.industry;

          $scope.toggleMobileUsersFilters(false);


        }

        $scope.closeAndResetMobileTicketsFilters = function () {

          $scope.toggleMobileTicketsFilters(false);
        }

        $scope.ticketsSharedState.filter.tags = [];

        function sendNewFilterToStorage(customerKey, recentArray, item) {
          var newHistoryItemArray = [];
          var ifItemAlreadyInTheList = false;
          if (recentArray) {
            ifItemAlreadyInTheList = recentArray.some(function (s) {
              return s === item;
            });
          }

          if (ifItemAlreadyInTheList) {
            newHistoryItemArray = recentArray;
          } else {
            newHistoryItemArray.push(item);
            if (recentArray.length && recentArray.length > 0) {
              newHistoryItemArray.push(recentArray[0]);
              newHistoryItemArray.push(recentArray[1]);
            }
          }

          var jsonArray = JSON.stringify(newHistoryItemArray);
          var itemToSend = {
            customKey: customerKey,
            value: jsonArray
          };

          CustomStorageService.saveUserCustomStorageItem(itemToSend, function (resp) {
            if (recentArray === $scope.industryFilterHistoryCompaniesPage) {
              $scope.industryFilterHistoryCompaniesPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.industriesFilterHistoryUserPage) {
              $scope.industriesFilterHistoryUserPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.companiesFilterHistoryUserPage) {
              $scope.companiesFilterHistoryUserPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.companiesFilterHistoryTicketsPage) {
              $scope.companiesFilterHistoryTicketsPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.clientUsersFilterHistoryTicketsPage) {
              $scope.clientUsersFilterHistoryTicketsPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.techUsersFilterHistoryTicketsPage) {
              $scope.techUsersFilterHistoryTicketsPage = JSON.parse(resp.value);
            } else if (recentArray === $scope.PasswordFiltersDyDevice) {
              $scope.PasswordFiltersDyDevice = JSON.parse(resp.value);
            } else if (recentArray === $scope.PasswordFiltersDyUser) {
              $scope.PasswordFiltersDyUser = JSON.parse(resp.value);
            } else if (recentArray === $scope.salesFilterHistoryCompaniesPage) {
              $scope.salesFilterHistoryCompaniesPage = JSON.parse(resp.value);
            }
          })
        }

        function getCompanyNameById(id) {
          //var company = $scope.clientCompanies().find((c) => c.id === id);
          var company = $scope.clientCompanies().find(function (c) {
            return c.id === id;
          });
          return company ? company.name : '';
        }

        $scope.getCompanyById = function (id) {
          return CompaniesService.getOneById(id)
        };

        $scope.isShowContractsTabOnCompanyPage = function () {
          if ($scope.$state.params.companyId) {
            var c = $scope.getCompanyById($scope.$state.params.companyId)
            if (c) {
              return c.clientType !== 'VENDOR';
            } else {
              return true;
            }
          } else {
            return true;
          }
        };


        function getCompanyIdByCompanyName(name) {
          //var company = $scope.clientCompanies().find((c) => c.name === name);
          var company = $scope.clientCompanies().find(function (c) {
            return c.name === name;
          });
          return company ? company.id : '';
        }

        function getUserIdByUserFullName(name) {
          var user = $scope.allUsers.find(function (user) {
            var fullName = user.lastName ? user.firstName + ' ' + user.lastName : user.firstName;
            return name === fullName;
          });
          return user.id;
        }

        function getUserObjByUserFullName(name) {
          var user = $scope.allUsers.find(function (user) {
            var fullName = user.lastName ? user.firstName + ' ' + user.lastName : user.firstName;
            return name === fullName;
          });
          return user;
        }



        $scope.companyModelObj = {
          companyModel: ''
        }

        $scope.ticketsFilterTags = [];


        $rootScope.toggleMobileTicketsFilters = function (state) {
          $rootScope.areMobileTicketsFiltersOpened = state;

        }


        $scope.closeAndResetMobileTicketsFilters = function () {
          $scope.toggleMobileTicketsFilters(false);

          $scope.ticketsFilterTags = $scope.appliedTicketsTags.slice();

          if ($scope.techUserModel !== $scope.ticketsSharedState.filter.techUserId) {
            $scope.techUserModel = $scope.ticketsSharedState.filter.techUserId;
          }

          if ($scope.clientUserModel !== $scope.ticketsSharedState.filter.clientUserId) {
            $scope.clientUserModel = $scope.ticketsSharedState.filter.clientUserId;
          }

          if ($scope.companyModelObj.companyModel !== $scope.ticketsSharedState.filter.companyId) {
            $scope.companyModelObj.companyModel = $scope.ticketsSharedState.filter.companyId;
          }

          $scope.lastSavedStatus = null;
        }

        $scope.applyMobileTicketsFilters = function () {
          $scope.toggleMobileTicketsFilters(false);
          $scope.appliedTicketsTags = $scope.ticketsFilterTags.slice();


          if ($scope.ticketsSharedState.filter.techUserId !== $scope.techUserModel) {
            $scope.ticketsSharedState.filter.techUserId = $scope.techUserModel;
          }

          if ($scope.ticketsSharedState.filter.clientUserId !== $scope.clientUserModel) {
            $scope.ticketsSharedState.filter.clientUserId = $scope.clientUserModel;
          }
          if ($scope.ticketsSharedState.filter.companyId !== $scope.companyModelObj.companyModel) {
            $scope.ticketsSharedState.filter.companyId = $scope.companyModelObj.companyModel;
          }


          if ($scope.lastSavedStatus) {

            $timeout(function () {
              $scope.stateGo.apply(this, $scope.lastSavedStatus);

            }, 100)

          }
        }



        $scope.appliedTicketsTags = [];

        var counter = true;

        $scope.$watch('appliedTicketsTags', function (val) {
          if (counter) {
            counter = false;
            return;
          }


          $scope.ticketsSharedState.filter.tags = val;
          ticketsSharedState.filter.tags = val;


          if ($state.includes('tickets')) {
            $scope.stateGo(null, 'tickets', {
              listType: getTicketsListType()
            });
          }
        }, true)


        $scope.mobileApplyUser = function (value) {
          $scope.techUserModel = getUserIdByUserFullName(value);

          $rootScope.selectedIndustryItem = value;

        };

        $scope.mobileApplyClientUser = function (value) {
          $rootScope.selectedIndustryItem = value;

          // HERERERE
          $scope.clientUserModel = getUserIdByUserFullName(value);
          var user = getUserObjByUserFullName(value);
          if ($scope.companyModelObj.companyModel) {
            if (user.company.id !== $scope.companyModelObj.companyModel) {
              $scope.companyModelObj.companyModel = user.company.id
            }
          } else {
            $scope.companyModelObj.companyModel = user.company.id;
          }
        };

        $scope.mobileApplyCompany = function (value) {

          $scope.companyModelObj.companyModel = getCompanyIdByCompanyName(value);

          // $rootScope.selectedIndustryItem = value;

        };


        $scope.$watch('companiesSharedState.filter.industry', function (value) {
          if (value !== "" && value !== " ") {
            if (value && $scope.checkIndustriesMatched(value)) {
              sendNewFilterToStorage("companiesPageFilterByIndustryHistory", $scope.industryFilterHistoryCompaniesPage, value)
            }

          }
        });

        $scope.$watch('usersSharedState.filter.industry', function (value) {
          if (value !== "" && value !== " ") {
            if (value && $scope.checkIndustriesMatched(value)) {
              sendNewFilterToStorage("userPageFilterByIndustryHistory", $scope.industriesFilterHistoryUserPage, value)
            }

          }
        });

        $scope.$watch('userPageCompanyIdFilter', function (value) {
          if (value !== "" && value !== " ") {
            usersSharedState.filter.companyId = value;
            if (value && $scope.checkCompanieValueMatched(value)) {
              sendNewFilterToStorage("userPageFilterByCompanyHistory", $scope.companiesFilterHistoryUserPage, getCompanyNameById(value))
            }

          } else if (value === undefined) {
            usersSharedState.filter.companyId = ''
          }
        });

        $scope.isTicketCompanyIdFieldEmpty = true;

        $scope.$watch('ticketFilterTags', function (val) {
          $scope.ticketsSharedState.filter.tags = val;
          ticketsSharedState.filter.tags = val;

          if ($state.includes('tickets')) {
            $scope.stateGo(null, 'tickets', {
              listType: getTicketsListType()
            });
          }
        }, true)

        $scope.$watch('ticketsSharedState.filter.companyId', function (value) {
          if (value !== undefined && value !== "" && value !== " ") {
            if (value && $scope.checkCompanieValueMatched(value)) {
              $scope.isTicketCompanyIdFieldEmpty = false;
              sendNewFilterToStorage("ticketPageFilterByCompanyHistory", $scope.companiesFilterHistoryTicketsPage, getCompanyNameById(value));

            }
            ticketsSharedState.filter.completed = false;
            ticketsSharedState.filter.inProgress = false;
            ticketsSharedState.filter.onHold = false;
            ticketsSharedState.filter.onHoldTag = false;
            ticketsSharedState.filter.clientUserId = '';
            $scope.clientsUsersByCompany = $scope.clientUsers().filter(function (user) {
              return user.company.id === value;
            });
            if ($state.includes('tickets')) {
              $scope.stateGo(null, 'tickets', {
                listType: getTicketsListType()
              });
            }

          } else if (value === undefined) {
            $scope.isTicketCompanyIdFieldEmpty = true;
            if ($state.includes('tickets')) {
              // clearFilter(ticketsSharedState.filter);

              // LEO!!!
              $scope.stateGo(null, 'tickets', {
                listType: getTicketsListType()
              });
            }
          }
        });

        $scope.$watch('ticketFilterTags', function (value) {
         

          // var data = value.map(function(el) {
          //   return el.id;
          // })
          //
          // TicketsService.ticketSearch(data, function(resp) {
          
          // })
          // if (value !== "" && value !== " " && value.length > 0) {
          //   ticketsSharedState.filter.completed = false;
          //   ticketsSharedState.filter.inProgress = false;
          //   ticketsSharedState.filter.onHold = false;
          //   ticketsSharedState.filter.onHoldTag = false;
          //   ticketsSharedState.filter.clientUserId = '';
          //
          //
          // } else if (value === undefined) {
          //   if ($state.includes('tickets')) {
          //     clearFilter(ticketsSharedState.filter);
          //     $scope.stateGo(null, 'tickets', {listType: 'all'});
          //   }
          // }
        }, true);


        function getTicketsListType() {
          return location.href.split('/').slice(-1)[0];
        }

        $scope.$watch('ticketsSharedState.filter.clientUserId', function (value) {
          if (value !== undefined && value !== "" && value !== " ") {
            ticketsSharedState.filter.completed = false;
            ticketsSharedState.filter.inProgress = false;
            ticketsSharedState.filter.onHold = false;
            ticketsSharedState.filter.onHoldTag = false;
            if (value && $scope.checkClientValueMatched(value)) {
              sendNewFilterToStorage("ticketPageFilterByClientUsersHistory", $scope.clientUsersFilterHistoryTicketsPage, $scope.getUserByID(value));
            }
            if ($state.includes('tickets')) {
              $scope.stateGo(null, 'tickets', {
                listType: getTicketsListType()
              });
            }
            if ($state.includes('companyProfile') && $location.search().tabName !== 'tickets-all') {
              $scope.stateGo(null, 'companyProfile', {
                tabName: 'tickets-all'
              });
            } else if ($state.includes('companyProfile') && $location.search().tabName === 'tickets-all') {
              $rootScope.runTicketListUploader = true;
            }
          } else if (value === undefined) {
            if ($state.includes('tickets')) {
              if (ticketsSharedState.filter.companyId) {
                $scope.stateGo(null, 'tickets', {
                  listType: getTicketsListType()
                });
              } else {
                // LEO!!!
                $scope.stateGo(null, 'tickets', {
                  listType: getTicketsListType()
                });
              }
              ticketsSharedState.filter.clientUserId = '';
            }
          }
        });
        // $scope.stateBack(null, 'tickets', {
        //   listType: getTicketsListType()
        // });
        

        $scope.$watch('ticketsSharedState.filter.techUserId', function (value) {


          if (value !== undefined && value !== "" && value !== " ") {
            ticketsSharedState.filter.completed = false;
            ticketsSharedState.filter.inProgress = false;
            ticketsSharedState.filter.onHold = false;
            ticketsSharedState.filter.onHoldTag = false;
            if (value && $scope.checkTechClientValueMatched(value)) {
              sendNewFilterToStorage("ticketPageFilterByTechUsersHistory", $scope.techUsersFilterHistoryTicketsPage, $scope.getUserByID(value));
            }
            if ($state.includes('tickets')) {
              $scope.stateGo(null, 'tickets', {
                listType: getTicketsListType()
              });
            }
            if ($state.includes('companyProfile') && $location.search().tabName !== 'tickets-all') {
              $scope.stateGo(null, 'companyProfile', {
                tabName: 'tickets-all'
              });
            } else if ($state.includes('companyProfile') && $location.search().tabName === 'tickets-all') {

              $rootScope.runTicketListUploader = true;
            }
          } else if (value === undefined) {
            if ($state.includes('tickets')) {
              if (ticketsSharedState.filter.companyId) {
                $scope.stateGo(null, 'tickets', {
                  listType: getTicketsListType()
                });
              } else {

                // LEO!!!
                $scope.stateGo(null, 'tickets', {
                  listType: getTicketsListType()
                });
              }
              ticketsSharedState.filter.techUserId = '';
            }
          }
        });


        $scope.checkCompanieValueMatched = function (inputValue) {
          if (inputValue) {
            return $scope.clientCompanies().some(function (item) {
              return item.id.toLowerCase() === inputValue.toLowerCase()
            })
          } else {
            return false
          }
        };


        $scope.checkSalesValueMatched = function (inputValue) {
          if (inputValue) {
            return $scope.activeTechUsers().some(function (item) {
              return item.id === inputValue;
            })
          } else {
            return false;
          }
        }

        $scope.checkClientValueMatched = function (inputValue) {
          if (inputValue) {
            return $scope.clientsUsersByCompany.some(function (item) {
              return item.id.toLowerCase() === inputValue.toLowerCase()
            })
          } else {
            return false
          }
        };

        $scope.checkIndustriesMatched = function (inputValue) {
          if (inputValue) {
            return $scope.industries.some(function (item) {
              return item.toLowerCase() === inputValue.toLowerCase()
            })
          } else {
            return false
          }
        };

        $scope.checkTechClientValueMatched = function (inputValue) {
          if (inputValue) {
            return $scope.techUsers().some(function (item) {
              return item.id.toLowerCase() === inputValue.toLowerCase()
            })
          } else {
            return false
          }
        };

        $scope.$watch('passwordSharedStateFilterCompanyId', function (value) {
          if (value !== '' && value !== ' ') {
            passwordSharedState.filter.companyId = value;
          }
        });

        $scope.$watch('passwordSharedStateFilterDeviceId', function (value) {
          if (value !== '' && value !== ' ') {
            passwordSharedState.filter.deviceId = value;
          }
        });

        $scope.companyProfilePasswordsFilter = {};

        $scope.$watch(function () {
          return $scope.companyProfilePasswordsFilter.deviceId
        }, function (value) {
          if (value !== '' && value !== ' ') {
            if (value) {
              sendNewFilterToStorage("PasswordFilterByDevice", $scope.PasswordFiltersDyDevice, value);
            }

            passwordSharedState.filter.deviceId = value;
          }
        });

        $scope.clearAllFilters = function () {
          $scope.passwordSharedStateFilterCompanyId = undefined;
          $scope.passwordSharedStateFilterDeviceId = undefined;
          $scope.passwordSharedStateFilterTemplate = undefined;
          // $scope.clearDateRange();
        };

        $scope.getDeviceNameById = function (id) {
          for (var i = 0; i < $scope.devices.length; i++) {
            if ($scope.devices[i].id === id) {
              return $scope.devices[i].hostName;
            }
          }
        };

        $scope.$watch(function () {
          return $scope.companyProfilePasswordsFilter.userId
        }, function (value) {
          if (value !== '' && value !== ' ') {
            if (value) {
              sendNewFilterToStorage("PasswordFilterByUser", $scope.PasswordFiltersDyUser, $scope.getUserByID(value));
            }
            passwordSharedState.filter.userId = value;
          }
        });

        $scope.$watch('passwordSharedStateFilterTemplate', function (value) {
          if (value !== '' && value !== ' ') {
            passwordSharedState.filter.template = value;
          }
        });

        $scope.applyIndustryFilterFromHistoryListCompanyPage = function (value) {
          companiesSharedState.filter.industry = value;

        };

        $scope.applySalesFilterFromHistoryListCompanyPage = function (value) {
          var user = $scope.activeTechUsers().find(function (el) {
            return el.firstName + ' ' + el.lastName === value;
          })

          $scope.salesPerson = user.id;

        };

        $scope.mobileApplySalesFilterFromHistoryListCompanyPage = function (value) {
          var user = $scope.activeTechUsers().find(function (el) {
            return el.firstName + ' ' + el.lastName === value;
          })

          $scope.mobileSalesPerson = user.id;

        };

        $scope.mobileApplyIndustryFilter = function (value) {
          $scope.mobileIndustryFilter = value;
          $rootScope.selectedIndustryItem = value;
        }

        $scope.applyIndustryFilterFromHistoryListUserPage = function (value) {
          usersSharedState.filter.industry = value;
        };

        $scope.mobileApplyIndustryFilterFromHistoryListUserPage = function (value) {
          $scope.mobileFilterUsersIndustry = value;
          $rootScope.selectedIndustryItem = value;

        };

        $scope.applyCompanyFilterFromHistoryListUserPage = function (value) {
          usersSharedState.filter.companyId = getCompanyIdByCompanyName(value);

          $scope.usersSharedState.filter.companyId = getCompanyIdByCompanyName(value);
          $scope.userPageCompanyIdFilter = getCompanyIdByCompanyName(value);
        };

        $scope.mobileApplyCompanyFilterFromHistoryListUserPage = function (value) {
          $scope.mobileUserPageCompanyIdFilter = getCompanyIdByCompanyName(value);
        }

        $scope.applyCompanyFilterFromHistoryListTicketPage = function (value) {
          ticketsSharedState.filter.companyId = getCompanyIdByCompanyName(value);
        };

        $scope.applyClientUserFilterFromHistoryListTicketPage = function (value) {
          ticketsSharedState.filter.clientUserId = getUserIdByUserFullName(value);
          var user = getUserObjByUserFullName(value);
          if (ticketsSharedState.filter.companyId) {
            if (user.company.id !== ticketsSharedState.filter.companyId) {
              ticketsSharedState.filter.companyId = user.company.id
            }
          } else {
            ticketsSharedState.filter.companyId = user.company.id;
          }
        };

        $scope.applyTechUserFilterFromHistoryListTicketPage = function (value) {
          ticketsSharedState.filter.techUserId = getUserIdByUserFullName(value);
        };

        $scope.applyDeviceFilterForPasswordManagerInCompanyProfile = function (value) {
          $scope.companyProfilePasswordsFilter.deviceId = value
        };

        $scope.applyUserFilterForPasswordManagerInCompanyProfile = function (value) {
          $scope.companyProfilePasswordsFilter.userId = getUserIdByUserFullName(value)
        };

        TutorialsService.getTypes(function (resp) {
          $scope.tutorialTypes = resp;
        });


        $scope.changeTicketsTagColor = function (type, colorCode) {
          $scope.ticketsTagsColors[type] = colorCode;

          var jsonObj = JSON.stringify($rootScope.ticketsTagsColors);
          var itemToSend = {
            customKey: 'ticketsTagsColors',
            value: jsonObj
          };
          CustomStorageService.saveUserCustomStorageItem(itemToSend, function (resp) {
            
          })
        };

        $scope.changeCompanyColor = function (type, colorCode) {
          var dataToSend = {
            type: type,
            colorCode: colorCode
          };
          ColorsService.putCompaniesColors(dataToSend, function (resp) {
          
          })
        };

        ColorsService.getCompaniesColors($scope, function (resp) {
          $scope.companiesColors = resp;
        });

        $scope.changeUserColor = function (type, colorCode) {
         
          var dataToSend = {
            type: type,
            colorCode: colorCode
          };
          ColorsService.putUsersColors(dataToSend, function (resp) {
            
          })
        };

        ColorsService.getUserColors($scope, function (resp) {
          $scope.usersColors = resp;
        });

        $scope.showReportsPage = function () {
          return PermissionsService.isAllowed('VIEW_SALES_REPORT') ||
            PermissionsService.isAllowed('VIEW_FINANCIAL_REPORT') ||
            PermissionsService.isAllowed('VIEW_PERFORMANCE_REPORT') ||
            PermissionsService.isAllowed('VIEW_REMOTE_ACCESS_REPORT') ||
            PermissionsService.isAllowed('VIEW_TAXES_REPORT')
        };

        DevicesService.getDevicesCount($scope, function (resp) {
          $scope.devices = [];
          for (var companyId in resp) {
            var devicesByCompany = resp[companyId];
            if (companyId !== 'staticCopy') {
              if (devicesByCompany && devicesByCompany.length) {
                for (var i = 0; i < devicesByCompany.length; i++) {
                  var device = devicesByCompany[i];
                  device.companyId = companyId;
                  $scope.devices.push(device);
                }
              }
            }
          }
        });


        $scope.$watch(function () {
          return $state.current.url + ' ' + $state.current.name;
        }, function (value) {
          if (value && value !== '^ ') {

            if (!$rootScope.uploadedReceivable || !$rootScope.uploadedReceivable.list) {
              uploadReceivable();
            }

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

        $scope.toggleLeftPanel = function (section, ifIconPart) {
        
          $scope.clearAllFilters()

          if (section === 'billing') {
            uploadReceivable();
          }

          if (ifIconPart) {
            deactivateAllCompanyProfileTabs();
            $scope.openedCategory = section;
            $rootScope.isLeftPanelHidden = false;
          } else {
            if ($scope.openedCategory === section && !$rootScope.isLeftPanelHidden) {
              $rootScope.isLeftPanelHidden = true;
              $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
            } else {
              $scope.openedCategory = section;
              $rootScope.isLeftPanelHidden = false;
            }
          }
        //  $scope.globalSearch.openedItemName = section;
        };



        function uploadReceivable() {
          ReceivableService.getReceivableInvoicesData($scope, function (resp) {
            $rootScope.uploadedReceivable = resp;
          })
        }

        $scope.$watch(function () {
          return $rootScope.shouldUpdateReceivable;
        }, function (val) {
          if (val) {
            $rootScope.shouldUpdateReceivable = false;
            uploadReceivable();
          }
        })

        $scope.showLeftArrowToggleLeftPanel = function () {
          return window.outerWidth <= 1024
        };

        $rootScope.toggleLeftPanel = function (ifIconPart) {
          $rootScope.isLeftPanelHidden = !$rootScope.isLeftPanelHidden
        };

        $scope.onClickSettings = function () {
          if ($state.is('settings')) {
            $rootScope.isLeftPanelHidden = true;
          }
          $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
          document.title = 'Settings';
        };

        $scope.onClickReports = function () {
          $rootScope.isLeftPanelHidden = true;
       
          $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
          document.title = 'Reports'
        };

        $scope.disabledQuickSupportButton = false;

        function initQuickSUpportButtonDissabled() {
          $scope.disabledQuickSupportButton = true;
          $timeout(function () {
            $scope.disabledQuickSupportButton = false;
          }, 1000);
        }

        $scope.addQuickSession = function () {
          initQuickSUpportButtonDissabled();
          sharedQuickSession.isCreateNew = true;
        };

        $scope.isOnHoldTag = false;

        $scope.stateGo = function (event, state, stateParams, isTag) {
          if (isTag) {
            $scope.isOnHoldTag = true;
          } else {
            $scope.isOnHoldTag = false;
          }
          if (event && event.button > 0) {
            var url = $state.href(state, stateParams, {
              absolute: true
            });

            window.open(url, '_blank');
          } else {

            $state.go(state, {
              listType: 'trash'
            });

            setTimeout(function () {
              $state.go(state, stateParams);

            }, 0)
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

        $scope.showArchivedCompanies = function () {
          $rootScope.showArchivedCompanies = true;
        };

        $scope.isArchivedCompaniesToShow = function () {
          return $rootScope.showArchivedCompanies;
        };

        $scope.ifTicketFilterEnable = function () {
          return ticketsSharedState.filter.completed ||
            ticketsSharedState.filter.inProgress ||
            ticketsSharedState.filter.onHold ||
            ticketsSharedState.filter.onHoldTag;
        };

        $scope.clearTicketsFilters = function () {
          clearFilter(ticketsSharedState.filter);
        };
 
        $scope.clearCompaniesFilters = function () {
          clearFilter(companiesSharedState.filter);
          $rootScope.showArchivedCompanies = false;
        };

        $scope.filterCompanies = function (filter, value) {
          var sharedFilter = companiesSharedState.filter;

          if ($state.includes('companyProfile') && (filter !== 'dateRange' || value && value.length)) {
            $rootScope.showArchivedCompanies = false;
            $state.go('companies');
          }

          switch (filter) {
            case 'clients':
              if ($rootScope.showArchivedCompanies) return;
              clearFilter(sharedFilter);
              sharedFilter.isClient = true;
              break;
            case 'leads':
              if ($rootScope.showArchivedCompanies) return;
              clearFilter(sharedFilter);
              sharedFilter.isLead = true;
              break;
            case 'vendors':
              if ($rootScope.showArchivedCompanies) return;
              clearFilter(sharedFilter);
              sharedFilter.isVendor = true;
              break;
            case 'byIndustry':
              sharedFilter.industry = value;
              break;
            case 'salesPerson':
              sharedFilter.salesPerson = value;
              break;
            case 'dateRange':
              var endDate = value[1];
              if (endDate) {
                value[1] = new Date(endDate.setHours(23, 59, 59));
              }
              sharedFilter.dateRange = value;
              break;
            case 'archived':

              $scope.showArchivedCompanies();
              clearFilter(sharedFilter);
              break;
            default:
              $rootScope.showArchivedCompanies = false;
              clearFilter(sharedFilter);
          }
        };

        $scope.showArchivedUsers = function () {
          var sharedFilter = usersSharedState.filter;
          clearFilter(sharedFilter);
          $rootScope.showArchivedUsers = true;
        };

        $scope.isArchivedUsersToShow = function () {
          return $rootScope.showArchivedUsers;
        };

        $scope.clearUsersFilters = function () {
          $rootScope.showArchivedUsers = false;
          clearFilter(usersSharedState.filter);
        };

        $scope.allUsers = UsersService.getAllUsers();

        $scope.allTitles = $scope.allUsers
          .map(function (user) {
            return user.designation;
          })
          .reduce(function (acc, title) {
            var index = acc.findIndex(function (el) {
              return (el || '').toLowerCase() === (title || '').toLowerCase();
            })

            if (index === -1 && title) {
              acc.push(title);
            }

            return acc;
          }, []);


        $scope.isTitleFilterTyped = true

        $scope.$watch('filterDesignation', function (val) {

        });


        $scope.filterUsers = function (filter, value) {
          var sharedFilter = usersSharedState.filter

          $scope.sharedFilter = sharedFilter;

          switch (filter) {
            case 'title':
              sharedFilter.designation = value;

              break;
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
              clearFilter(sharedFilter, true);
              sharedFilter.isLead = true;
              break;
            case 'clients':
              $rootScope.showArchivedUsers = false;
              clearFilter(sharedFilter, true);
              sharedFilter.isClient = true;
              break;
            case 'archived':
              clearFilter(sharedFilter, true);
              sharedFilter.isArchived = true;
              break;
            case 'byIndustry':
              sharedFilter.industry = value;
              // sharedFilter.companyId = '';
              break;
            case 'byCompany':
              sharedFilter.companyId = value;
              // sharedFilter.industry = '';
              break;
            default:
              $rootScope.showArchivedUsers = false;
              clearFilter(sharedFilter, true);
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

          if (!$scope.passwordSharedState.filter.companyId && !inputValue) {
            return noFilter;
          }

          var keyword = inputValue.toLowerCase().trim();

          if (!$scope.passwordSharedState.filter.companyId &&
            (keyword.length === 0 || keyword === "[$empty$]" || keyword === "undefined")) {
            return noFilter;
          }

          return function (device) {

            if ($scope.passwordSharedState.filter.companyId &&
              device.companyId != $scope.passwordSharedState.filter.companyId) {
              return false;
            }

            if (keyword.length === 0 || keyword === "[$empty$]" || keyword === "undefined") {
              return true;
            }

            return ((device.hostName && device.hostName.toLowerCase().indexOf(keyword) >= 0) ||
              (device.ip && device.ip.toLowerCase().indexOf(keyword) >= 0));
          };

          function noFilter() {
            return true;
          }
        };

        $scope.getCompanyName = function (companyId) {

          if (!companyId) {
            return;
          }

          var company = CompaniesService.getOneById(companyId);

          if (company) {
            return company.name;
          }
        };

        $scope.getUserByID = function (userId) {
          if (!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if (user) {
            if (user.lastName === '    ') {
              return user.firstName
            } else {
              return user.firstName + ' ' + user.lastName;
            }
          }
        };

        $scope.getFullName = function (client) {

          var isAllSpaces = client.lastName === "    ";
          if (client.lastName && !isAllSpaces) {
            return client.firstName + ' ' + client.lastName;
          } else {
            return client.firstName;
          }
        };

        $scope.getUserObjByID = function (userId) {
          if (!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if (user) {
            return user;
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

        function clearFilter(sharedFilter, user) {
          for (var prop in sharedFilter) {
            sharedFilter[prop] = '';
          }

          if (user) {
            $scope.userPageCompanyIdFilter = '';
            $scope.usersSharedState.filter.industry = '';
            $scope.filterDesignation = '';
            $rootScope.clearIndustryFilter(); // crutch for resetting by industry filter. im sorry for this(((

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
          } else if (url.indexOf('companies') > -1) {
            return 'companies';
          } else if (url.indexOf('companyProfile') > -1 || url.indexOf('company-password-manager') > -1 || url.indexOf('company-user') > -1 || url.indexOf('company-products') > -1) {
            return 'companyProfile';
          } else if (url.indexOf('users') > -1) {
            return 'users';
          } else if (url.indexOf('accounting') > -1) {
            return 'billing';
          } else if (url.indexOf('inventory') > -1) {
            return 'inventory';
          } else if (url.indexOf('password-manager') > -1) {
            return 'password-manager';
          } else if (url.indexOf('ng2/setting') > -1) {
            return 'ng2-setting';
          } else if (url.indexOf('reports') > -1) {
            return 'reports';
          } else if (url.indexOf('quotes') > -1) {
            return 'billing';
          } else {
            return undefined;
          }
        }

        $scope.getOpenedUsersTab = function () {
          return $location.search().tabName
        };


        $scope.$watch(function () {
          return companyProfileSharedState.companyId;
        }, function (companyId) {
          if (companyId) {
            $scope.companyProfilePageUsersList = UsersService.getAllByCompanyIdNonArchived(companyId);
            TicketsService.getAllCountsByCompanyId($scope, companyId, ticketCounterCallback);
            $scope.companyForCompanyProfile = CompaniesService.getOneById(companyId);
            $scope.companyDevices = $scope.devices.filter(function (device) {
              return device.companyId === companyId;
            })
          }
        })

        $scope.$watch(function () {
          return $rootScope.changeTicketCompany;
        }, function (val) {
          if (val) {
            var id = companyProfileSharedState.companyId
            if (id === val.oldCompanyId || id === val.companyId) {
              TicketsService.getAllCountsByCompanyId($scope, id, ticketCounterCallback);
            }
          }
        })

        function ticketCounterCallback(resp) {
          $scope.ticketsCounterByCompany = resp;
          companyProfileSharedState.ticketsCounts = resp;
        }


    
        $rootScope.$on('onInitConpaiesList', function(){
          if (company_id) {
             $scope.companyProfilePageUsersList = UsersService.getAllByCompanyIdNonArchived(company_id);
              $scope.companyForCompanyProfile = CompaniesService.getOneById(company_id);
           }
           $scope.$apply();
        });
      }]);

}());
