'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyProfileCtrl',
    ['$scope', 'CompaniesService', '$stateParams',
      function ($scope, CompaniesService, $stateParams) {

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

      }]);

}());
