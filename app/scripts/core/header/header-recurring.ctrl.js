'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.recurringCtrl',
    ['$scope', '$rootScope', 'RecurringService', 'CompaniesService',
      function ($scope, $rootScope, RecurringService, CompaniesService) {

        $scope.companies = CompaniesService.getAllCompanies();

        $scope.$watch('company', function(val){
          $rootScope.$broadcast('showInvoice', val && val.id)
        });

        //$scope.searchInvoice = RecurringService.search;
        //
        //$scope.showInvoice = function (invoice) {
        //  $rootScope.$broadcast(invoice.company.id + '-showInvoice', invoice.id)
        //}

      }]);

}());
