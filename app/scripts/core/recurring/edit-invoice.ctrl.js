'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceCtrl',
    ['$scope', 'RecurringService', 'BillableService', 'CompaniesService', 'ServicesService', '$filter',
      function ($scope, RecurringService, BillableService, CompaniesService, ServicesService, $filter) {

        var day = 1000 * 60 * 60 * 24;

        $scope.searchCompany = '';
        $scope.paymentsTerms = '';
        $scope.repeatingInvoice = '';

        if($scope.invoice && $scope.invoice.id){
          $scope.editInvoice = $scope.invoice.staticCopy()
        } else {

          $scope.actualInvoiceNumber = BillableService.getActualInvoiceNumber($scope, function (value) {
            $scope.actualInvoiceNumber = value;
          });

          $scope.editInvoice = {
            isRecurring: true,
            expenses: []
          };
        }

        $scope.companies = CompaniesService.getClientCompanies();
        //$scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id); TODO
        $scope.minSentOnDate =  $filter('date')(new Date(Date.now() + day), 'd MMM yyyy');

        $scope.frequency = {
          sevenDays: '7 days',
          fifteenDays: '15 days',
          thirtyDays: '30 days',
          MONTHLY: 'Monthly',
          YEARLY: 'Yearly'
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveInvoice || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.chooseCompany = function(company){
          $scope.searchCompany = company.name;

          $scope.editInvoice.company = {
            id: company.id
          }
        };

        $scope.setPaymentTerms = function(value){
          $scope.paymentsTerms = value;
        };

        $scope.setRepeatingInvoice = function(value){
          $scope.repeatingInvoice = value;
        };

        $scope.addProduct = function(){
          $scope.editInvoice.expenses.push({type: 'product'})
        };

        $scope.addService = function(){
          $scope.editInvoice.expenses.push({type: 'service'})
        };

        $scope.saveInvoice = function (form) {
          if (form.$valid) {
            //$scope.disabledCreateButton = true;
            //
            //var dateSentOn = new Date($scope.createInvoice.sentOn);
            //
            //dateSentOn.setHours(0);
            //dateSentOn.setMinutes(0);
            //dateSentOn.setSeconds(0);
            //dateSentOn.setMilliseconds(0);

            console.log($scope.editInvoice);

            //RecurringService.createRecurringInvoice({
            //  products: [],
            //  services: [],
            //  sentOn: dateSentOn.getTime(),
            //  frequency: $scope.createInvoice.frequency
            //}, $scope.recurringCompany.company.id, function () {
            //  $scope.$emit('cancelEditForm');
            //  $scope.disabledCreateButton = false;
            //})
          } else {
            $scope.triedToSaveInvoice = true;
          }
        };

      }]);

}());
