'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.invoiceCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);

      }]);

}());
