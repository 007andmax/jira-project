'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileMapModalCtrl',
    ['$scope','$uibModalInstance', 'companyInfo',
      function ($scope, $uibModalInstance, companyInfo) {

        $scope.companyInfo = companyInfo;

        $scope.closeModal = function () {
          $uibModalInstance.close();
        };

      }]);

}());



