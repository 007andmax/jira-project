'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.invoiceEditModalCtrl',
    ['$scope', '$uibModalInstance', '$timeout', 'CompaniesService',
      function ($scope, $uibModalInstance, $timeout, CompaniesService) {
        $scope.closeWindow = function () {
          $uibModalInstance.dismiss();
        };

        // $scope.editCompany = Object.assign({}, CompaniesService.getCurrentCompany());
        // $scope.contact = $scope.editCompany.contacts[0];


      }]);

}());
