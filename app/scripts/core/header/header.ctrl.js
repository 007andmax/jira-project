'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.headerCtrl',
    ['$scope', '$state', 'CompaniesService', 'UsersService', 'quicktech.common.services.PermissionsService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$rootScope',
      'quicktech.common.services.TicketsPermissionsService',
      function ($scope, $state, CompaniesService, UsersService, PermissionsService, SharedStateService,
                $stateParams, $rootScope, TicketsPermissionsService) {

        $scope.clientCompanies = CompaniesService.getClientCompanies();
        $scope.PermissionsService = PermissionsService;
        $scope.globalSearch = SharedStateService.getSharedState('globalSearch');
        $scope.goBack = {};

        $scope.$watch('clientCompanies.length', function (count) {
          if (count) {
            $scope.clientCompanies = $scope.clientCompanies.filter(function (company) {
              return !company.isDefault;
            });
          }
        });

        $scope.$watch('globalSearch.isGlobalSearchOn', function (newValue) {
          if (newValue === false) {
            SharedStateService.clearAllExceptGlobalSearch();
          }
        });

        $scope.changeSearchStatus = function () {
          $scope.globalSearch.isGlobalSearchOn = !$scope.globalSearch.isGlobalSearchOn;
        };

        $scope.userReadable = function (text) {
          var words = text.split(/[-_]/),
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

        $scope.getCurrentCount = function () {
          var counts = $scope.globalSearch.counts,
            result = 0;

          for (var i = 0; i < counts.length; i++) {
            result += counts[i].count;
          }

          return result;
        };

        UsersService._addInitListener(function () {
          $scope.currentUser = UsersService.getCurrentUser();
        });

        $scope.getTemplateNameByState = function () {
          $scope.goBack.isEnabled = false;
          if ($state.includes("tickets")) {
            if ($scope.globalSearch.selectedItemsCount) {
              $scope.goBack.isEnabled = true;
              $scope.goBack.func = $rootScope.$broadcast.bind($rootScope, 'uncheckAllTickets');
              $scope.goBack.tooltip = 'reset selected items';
            }
            return 'tickets';
          } else if ($state.includes("users")) {
            return 'users';
          } else if ($state.includes("companies")) {
            return 'companies';
          } else if ($state.includes("createCompany")) {
            $scope.goBack.isEnabled = true;
            $scope.goBack.func = $state.go.bind($state, 'companies');
            $scope.goBack.tooltip = 'back to companies';
          } else if ($state.includes("editCompany")) {
            $scope.goBack.isEnabled = true;
            $scope.goBack.func = $state.go.bind($state, 'companyProfile', { companyId: $stateParams.companyId });
            $scope.goBack.tooltip = 'back to company profile';
          } else if ($state.includes("products")) {
            return 'products';
          } else if ($state.includes("services")) {
            return 'services';
          } else if ($state.includes("accounting.billable")) {
            return 'billable';
          } else if ($state.includes("accounting.recurring")) {
            return 'recurring';
          } else if ($state.includes("receivable")) {
            return 'receivable';
          } else if ($state.includes("receipt-archive")) {
            return 'receipt-archive';
          } else if ($state.includes("companyProfile")) {
            $scope.goBack.isEnabled = true;
            $scope.goBack.func = $state.go.bind($state, 'companies');
            $scope.goBack.tooltip = 'back to companies';
          } else if ($state.includes("vendors")) {
            return 'vendors';
          } else if ($state.includes("createVendor") || $state.includes("editVendor")) {
            $scope.goBack.isEnabled = true;
            $scope.goBack.func = $state.go.bind($state, 'vendors');
            $scope.goBack.tooltip = 'back to vendors';
          } else if ($state.includes("settings")) {
            $scope.globalSearch.openedItemName = 'Account Settings';
          } else if ($state.includes("devices")) {
            return 'devices';
          } else if ($state.includes("companyDevices")) {
            return 'company-devices';
          } else if ($state.includes("quickSupport")) {
            return 'quick-support';
          } else if ($state.includes("taxRates")) {
            $scope.globalSearch.openedItemName = 'Tax Rates';
          }
        };

        $scope.$watch(function () {
          return $stateParams.listType;
        }, function (value) {
          $scope.listType = value;
          if (value) {
            $scope.ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');
          }
        });

        $scope.$watch('ticketsSharedState.checkedTicketsIds', function (data) {
          $scope.isShowBulkAction = data && data.length > 0;
        });

      }]);

}());
