'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companiesCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', '$state', '$rootScope',
      'quicktech.common.services.SharedStateService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      'localStorageService', 'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService', 'ColorsService', 'TagsService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, $state, $rootScope,
                SharedStateService, DevicesService, PermissionsService, localStorageService, UserConfirmationsService,
                UserNotificationService, ColorsService, TagsService) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var availableViews = ['list', 'grid'];

        if (!PermissionsService.isAllowed('VIEW_COMPANIES')) {
          $state.go('tickets');
        }

        $scope.headerSharedState = headerSharedState;

        $scope.companiesView = localStorageService.get('companies-view') || 'grid';
        $scope.PermissionsService = PermissionsService;

        $scope.companies = CompaniesService.getAllCompanies();
        $scope.archivedCompanies = CompaniesService.getArchivedCompanies();
        $scope.companiesInfo = CompaniesService.getClientCompaniesInfo($scope);
        $scope.devicesCount = DevicesService.getDevicesCount($scope);
        $scope.user = $scope.currentUser;

        $scope.tagColors = TagsService.getColors();

        ColorsService.getCompaniesColors($scope, function(resp) {
          $scope.companiesColors = resp;
        });

        $scope.companiesCtrl = {};

        $scope.orderCompanies = {
          field: 'name',
          reverse: false
        };

        $scope.changeView = function (view) {
          if (availableViews.indexOf(view) !== -1) {
            $scope.companiesView = view;
            localStorageService.set('companies-view', view);
          }
        };

        $scope.$watch('companiesCtrl.shownCompanies.length', function (value) {
          globalSearch.count = value;
        });

        $scope.openCompany = function (company, tabName) {
          if (!company.deletedAt) {
            $state.go('companyProfile', { companyId: company.id, tabName: tabName });
          }
        };

        $scope.filterCompanies = function (value) {
          var filter = headerSharedState.filter;
          var clientType = value.clientType;
          var result = !value.deletedAt && !$rootScope.showArchivedCompanies || $rootScope.showArchivedCompanies && value.deletedAt;

          if (value.isDefault || value.default) {
            return false;
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
