'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.invoiceEditModalCtrl',
    ['$scope', '$uibModalInstance', '$timeout', 'CompaniesService', '$rootScope',
      function ($scope, $uibModalInstance, $timeout, CompaniesService, $rootScope) {
        $scope.closeWindow = function () {
          $uibModalInstance.dismiss();
        };

        $scope.$watch(function() {
          return $rootScope.closeEditModal
        }, function(val) {
          if (val) {
            $rootScope.closeEditModal = false;

            $scope.closeWindow();
          }
        })

        // $scope.editCompany = Object.assign({}, CompaniesService.getCurrentCompany());
        // $scope.contact = $scope.editCompany.contacts[0];


      }]);

}());
