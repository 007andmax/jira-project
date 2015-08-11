'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.billableCtrl',
    ['$scope', '$rootScope', 'CompaniesService', 'BillableService', 'quicktech.common.services.SharedStateService',
      function ($scope, $rootScope, CompaniesService, BillableService, SharedStateService) {

        $scope.searchCompany = CompaniesService.searchByAllCompanies;

        $scope.searchTicket = BillableService.search;

        $scope.showItem = function (item) {
          if (item.name === undefined) {
            $rootScope.$broadcast(item.company.id + '-showTicket', item.id)
          } else {
            $rootScope.$broadcast(item.id + '-showCompany', item.id)
          }
        }

      }]);

}());
