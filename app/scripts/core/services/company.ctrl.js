'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.companyCtrl',
    ['$scope', 'CompaniesService',
      function ($scope, CompaniesService) {

        $scope.company = CompaniesService.getOneById($scope.companyId);

      }]);

}());
