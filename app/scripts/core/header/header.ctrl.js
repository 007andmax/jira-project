'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.headerCtrl',
    ['$scope', '$state', 'CompaniesService', 'UsersService', 'quicktech.common.services.PermissionsService',
      function ($scope, $state, CompaniesService, UsersService, PermissionsService) {

        $scope.clientCompanies = CompaniesService.getClientCompanies();
        $scope.PermissionsService = PermissionsService;

        $scope.$watch('clientCompanies.length', function (count) {
          if (count) {
            $scope.clientCompanies = $scope.clientCompanies.filter(function (company) {
              return !company.isDefault;
            });
          }
        });

        UsersService._addInitListener(function () {
          $scope.currentUser = UsersService.getCurrentUser();
        });

        $scope.getTemplateNameByState = function () {
          if ($state.includes("tickets")) {
            return 'tickets';
          } else if ($state.includes("users")) {
            return 'users';
          } else if ($state.includes("companies")) {
            return 'companies';
          } else if ($state.includes("createCompany") || $state.includes("editCompany")) {
            return 'company-edit';
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
            return 'company-profile';
          } else if ($state.includes("vendors")) {
            return 'vendors';
          } else if ($state.includes("settings")) {
            return 'settings';
          } else if ($state.includes("devices")) {
            return 'devices';
          } else if ($state.includes("companyDevices")) {
            return 'company-devices';
          } else if ($state.includes("quickSupport")) {
            return 'quick-support';
          } else if ($state.includes("taxRates")) {
            return 'tax-rates';
          }
        };

      }]);

}());
