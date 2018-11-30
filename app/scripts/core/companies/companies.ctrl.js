'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companiesCtrl',
    ['$scope',
      'UsersService',
      'SubscriptionsService',
      'CompaniesService',
      '$state',
      '$rootScope',
      'quicktech.common.services.SharedStateService',
      'DevicesService',
      'quicktech.common.services.PermissionsService',
      'localStorageService',
      'quicktech.common.services.UserConfirmationsService',
      'quicktech.common.services.UserNotificationService',
      'ColorsService',
      'TagsService',
      'TicketsService',
      '$uibModal',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, $state, $rootScope,
                SharedStateService, DevicesService, PermissionsService, localStorageService, UserConfirmationsService,
                UserNotificationService, ColorsService, TagsService, TicketsService, $uibModal) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var availableViews = ['list', 'grid'];
        var companyProfileSharedState = SharedStateService.getSharedState('companyProfile');

        if (!PermissionsService.isAllowed('VIEW_COMPANIES')) {
          $state.go('tickets');
        }

        TicketsService.getList('EXAMPLE', null, null, function (resp) {
          var ticket = resp[0];
          if (!ticket) {
            return;
          }
          $scope.exampleCompanyId = ticket.companyId;
        })

        $scope.headerSharedState = headerSharedState;

        $scope.currentUser = UsersService.getCurrentUser();

        // $scope.companiesView = $scope.currentUser.companiesGridPresentation
        //   ? $scope.currentUser.companiesGridPresentation === 'LIST'
        //                          ? 'list'
        //                          : 'grid'
        //   : 'grid';

        $scope.companiesView = 'list';


        $scope.PermissionsService = PermissionsService;


        $scope.allCompanies = CompaniesService.getAllCompanies();
        $scope.allArchivedCompanies = CompaniesService.getArchivedCompanies();

        $scope.companies = CompaniesService.getAllCompanies();
        $scope.archivedCompanies = CompaniesService.getArchivedCompanies();
        $scope.companiesInfo = CompaniesService.getClientCompaniesInfo($scope);
        $scope.devicesCount = DevicesService.getDevicesCount($scope);
        $scope.user = $scope.currentUser;

        $scope.$watch(function () {
          return $rootScope.filteredCompanies;
        }, function (val) {
          if (val) {

            $scope.companies = val;
            $scope.archivedCompanies = [];
          } else if (val === false) {
            $scope.companies = $scope.allCompanies;
            $scope.archivedCompanies = $scope.allArchivedCompanies;
          }

          $rootScope.filterCompanies = null;
        })

        $scope.$watch('companies.length', function(val) {
          var counters = {
            VENDOR: 0,
            LEAD: 0,
            CLIENT: 0
          }

          // console.log($scope.companies.filter(function() {}), "FILTEREEEEEEEd")

          $scope.companies.filter(function(el) {
            return $scope.filterCompanies(el, true);
          }).forEach(function(el) {
            counters[el.clientType]++;
          })


          $rootScope.companyCounters = counters;
        })

        $scope.openMapModal = function (companyId) {
          CompaniesService.getCompanyData($scope, companyId, function(res) {
            // var lat = res.addresses[0].locationLat;
            // var lon = res.addresses[0].locationLng;
            //
            // if (window.innerWidth <= 414) {
            //
            //     if ((navigator.platform.indexOf("iPhone") != -1) ||
            //         (navigator.platform.indexOf("iPad") != -1) ||
            //         (navigator.platform.indexOf("iPod") != -1)) {
            //           // window.open("maps:daddr=" + lat +   "," + lon + "&amp;ll=");
            //           $uibModal.open({
            //             templateUrl: '/html/scripts/core/companies/company-profile/tabs/dashboard/map-modal.tpl.html',
            //             animation: true,
            //             backdrop: true,
            //             size: 'md',
            //             controller: 'quicktech.core.companies.companyProfileMapModalCtrl',
            //             windowClass: 'create-popup margin-top-modal-dialog',
            //             resolve: {
            //               companyInfo: res
            //             }
            //           });
            //
            //
            //           // window.open("https://maps.google.com/maps?daddr=" + lat +   "," + lon + "&amp;ll=");
            //         } else {
            //           window.open("https://maps.google.com/maps?daddr=" + lat +   "," + lon + "&amp;ll=");
            //
            //           console.log('WE ARE HERE', "https://maps.google.com/maps?daddr=" + lat +   "," + lon + "&amp;ll=")
            //         }
            //
            //
            // } else {
            //   $uibModal.open({
            //     templateUrl: '/html/scripts/core/companies/company-profile/tabs/dashboard/map-modal.tpl.html',
            //     animation: true,
            //     backdrop: true,
            //     size: 'md',
            //     controller: 'quicktech.core.companies.companyProfileMapModalCtrl',
            //     windowClass: 'create-popup margin-top-modal-dialog',
            //     resolve: {
            //       companyInfo: res
            //     }
            //   });
            // }

            $uibModal.open({
              templateUrl: '/html/scripts/core/companies/company-profile/tabs/dashboard/map-modal.tpl.html',
              animation: true,
              backdrop: true,
              size: 'md',
              controller: 'quicktech.core.companies.companyProfileMapModalCtrl',
              windowClass: 'create-popup margin-top-modal-dialog',
              resolve: {
                companyInfo: res
              }
            });

          })



        }

        $scope.tagColors = TagsService.getColors();

        ColorsService.getCompaniesColors($scope, function (resp) {
          $scope.companiesColors = resp;
        });

        $scope.companiesCtrl = {};

        $scope.orderCompanies = {
          field: 'name',
          reverse: false
        };

        $scope.downloadAgent = function (e, company) {

          if (e) {
            e.stopPropagation();
          }


          var modalParams = {
            animation: true,
            backdrop: 'static',
            keyboard: false,
            size: 'custom-size-confirmation-pop',
            windowClass: 'modal-remote-agent',
            templateUrl: '/html/scripts/core/companies/download-agent.tpl.html',
            controller: 'quicktech.core.companies.downloadAgentModal'
          }

          $rootScope.companyForDownload = company;

          $uibModal.open(modalParams);
        }

        $scope.$watch(function () {
          return $rootScope.agentToDownload;
        }, function (val) {

          if (val) {
            $rootScope.agentToDownload = manually
            $scope.downloadAgent();
          }
        })

        if ($rootScope.exampleCompanyDeleted) {
          $scope.companies = $scope.companies.filter(function (company) {
            return company.id !== $rootScope.exampleCompanyDeleted
          })
        }


        $scope.confirmRemoval = function (e) {
          e.stopPropagation();
          $uibModal.open({
            templateUrl: '/html/scripts/core/companies/example-removal.tpl.html',
            animation: true,
            backdrop: true,
            size: 'sm',
            controller: 'quicktech.core.companies.confirmModal',
            resolve: {
              action: function () {
                return $scope.removeExampleCompany
              }
            }

          });


        }

        $scope.removeExampleCompany = function (callback) {
          CompaniesService.deleteExample(function (resp) {
            $rootScope.exampleCompanyDeleted = $scope.exampleCompanyId;
            $scope.companies = $scope.companies.filter(function (company) {
              return company.id !== $scope.exampleCompanyId
            })

            if (callback) {
              callback();
            }
            // CompaniesService.reinitCompanies(function() {
            //   $scope.companies = CompaniesService.getAllCompanies();
            // });


          })
        }

        $scope.changeView = function (view) {
          if (availableViews.indexOf(view) !== -1) {
            $scope.companiesView = view;
            UsersService.setGridPresentation({companies: view});
            // localStorageService.set('companies-view', view);
          }
        };

        $scope.mobileOpenCompany = function(element) {
          element.parent().toggleClass('opened');
        }

        $scope.toggleMobileCompanyFilters = function(state) {
          $scope.areMobileFiltersOpened = state;
        }



        $scope.$watch('companiesCtrl.shownCompanies.length', function (value) {
          globalSearch.count = value;
        });

        $scope.$watch(function () {
          return globalSearch.count;
        }, function (val) {
          if (val !== $scope.companiesCtrl.shownCompanies.length) {
            globalSearch.count = $scope.companiesCtrl.shownCompanies.length;
          }
        })

        $scope.openCompany = function (company, tabName) {
          if (!company.deletedAt) {
            $state.go('companyProfile', {companyId: company.id, tabName: 'dashboadr'});
            companyProfileSharedState.tabName = 'dashboard';
          }
        };

        $scope.filterCompanies = function (value, noFilters) {
          var filter = headerSharedState.filter;
          var clientType = value.clientType;
          var result = !value.deletedAt && !$rootScope.showArchivedCompanies || $rootScope.showArchivedCompanies && value.deletedAt;

          if (value.isDefault || value.default) {
            return false;
          }

          if (noFilters === true) {
            return result;
          }

          if (filter.companyId) {
            return filter.companyId === value.id;
          }

          if (filter.isVendor) {
            result = result && clientType && clientType.toLowerCase() === 'vendor';
          }

          if (filter.isClient) {
            result = result && clientType && clientType.toLowerCase() === 'client';
          }

          if (filter.isLead) {
            result = result && clientType && clientType.toLowerCase() === 'lead';
          }

          if (filter.industry) {
            var industryName = value.clientIndustry ? (value.clientIndustry.name || '') : '';
            result = result && industryName.toLowerCase() === filter.industry.toLowerCase();
          }

          if (filter.dateRange) {
            var start = filter.dateRange[0],
              end = filter.dateRange[1];

            if (start) {
              result = result && value.createdAt >= (new Date(start)).getTime();
            }

            if (end) {
              result = result && value.createdAt <= (new Date(end)).getTime();
            }
          }

          // console.log(result, "RSUT")
          return result;

        };

        $scope.setOrderByCompanies = function (option) {
          if (option === $scope.orderCompanies.field) {
            $scope.orderCompanies.reverse = !$scope.orderCompanies.reverse;
          } else {
            $scope.orderCompanies.field = option;
            $scope.orderCompanies.reverse = false;
          }
        };

        $scope.orderByForCompanies = function (item) {
          if ($scope.orderCompanies.field === 'name') {
            return item.name;
          } else if ($scope.orderCompanies.field === 'phone') {
            var phoneNumbers = $scope.companiesInfo[item.id].addresses[0].phoneNumbers;
            if (phoneNumbers && phoneNumbers.length) {
              return phoneNumbers[0].number || '';
            }
          } else if ($scope.orderCompanies.field === 'email') {
            return $scope.companiesInfo[item.id].contacts[0].primaryEmail || '';
          } else if ($scope.orderCompanies.field === 'contact') {
            return $scope.getUserName($scope.companiesInfo[item.id].contacts[0]);
          } else if ($scope.orderCompanies.field === 'tickets') {
            return item.companyStatistic.ticketsSubmitted;
          } else if ($scope.orderCompanies.field === 'devices') {
            return $scope.devicesCount[item.id] ? $scope.devicesCount[item.id].all : 0;
          } else if ($scope.orderCompanies.field === 'users') {
            return UsersService.getAllByCompanyId(item.id).length;
          }

        };

        $scope.dearchiveCompany = function (company) {
          var name = company.name;
          var confirmMesage = 'Do you want to restore ' + name + '?';
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            CompaniesService.dearchive(company.id, function (resp) {
              UserNotificationService.show('The company ' + name + ' has successfully restored.', true);
            });
          });
        };

        $scope.filterArchived = function (users, company) {
          return users.filter(function (user) {
            var isArchived = user.deletedAt || company.deletedAt;
            return !isArchived && !$rootScope.showArchivedCompanies || $rootScope.showArchivedCompanies && isArchived;
          })
        };

        $scope.attachEvents = function (element) {
          $('.popover').on('mouseenter', function () {
            $rootScope.insidePopover = true;
          });
          $('.popover').on('mouseleave', function () {
            $rootScope.insidePopover = false;
            $(element).popover('hide');
          });
        };

        $scope.$on('$destroy', function () {
          headerSharedState.filter = {};
          $rootScope.$broadcast('clearLeftPanelDateRange');
        });

      }]);
}());
