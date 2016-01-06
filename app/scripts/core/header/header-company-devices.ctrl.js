'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyDevicesCtrl',
    ['$scope', 'CompaniesService', '$stateParams',
      function ($scope, CompaniesService, $stateParams) {

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

      }]);

}());
