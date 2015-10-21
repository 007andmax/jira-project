'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.headerCtrl',
    ['$scope', '$state',
      function ($scope, $state) {

        $scope.getTemplateNameByState = function () {
          if ($state.includes("tickets")) {
            return 'tickets';
          } else if ($state.includes("users")) {
            return 'users';
          } else if ($state.includes("companies") || $state.includes("createCompany")) {
            return 'companies';
          } else if ($state.includes("ps.products")) {
            return 'products';
          } else if ($state.includes("ps.services")) {
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
          }
        }

      }]);

}());
