'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyCtrl',
    ['$scope', 'BillableService', 'CompaniesService',
      function ($scope, BillableService, CompaniesService) {

        $scope.toggleInvoices = function () {
          $scope.$emit('toggleBillableInvoices');
        };

        $scope.company = CompaniesService.getOneById($scope.billableCompany.company.id);

        $scope.companyBillableTickets = BillableService.getCompanyBillableTickets($scope.billableCompany.company.id, $scope);

        $scope.choseCheckbox = {
          value: false
        };

        $scope.changeCompanyCheckbox = function () {
          $scope.$broadcast('changeCompanyCheckbox', $scope.choseCheckbox.value);
        };

        $scope.chooseInvoice = [];

        $scope.$on('changeTicketCheckbox', function (e, data) {
          if ($scope.chooseInvoice.length !== $scope.companyBillableTickets.length) {
            $scope.chooseInvoice.push(data);
          }
          var ticketValueCount = 0;
          for (var i = 0; i < $scope.chooseInvoice.length; i++) {
            if (data.id === $scope.chooseInvoice[i].id) {
              $scope.chooseInvoice[i] = data;
            }
            if ($scope.chooseInvoice[i].value === true) {
              ticketValueCount++
            }
          }

          $scope.choseCheckbox.value = (ticketValueCount === $scope.chooseInvoice.length);

          if ($scope.chooseInvoice.length === $scope.companyBillableTickets.length) {
            $scope.$emit('ticketCheckbox', $scope.chooseInvoice);
          }

        });

      }]);

}());
