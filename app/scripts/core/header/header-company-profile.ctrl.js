'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companyProfileCtrl',
    ['$scope', 'CompaniesService', '$stateParams', 'quicktech.common.services.SharedStateService',
      function ($scope, CompaniesService, $stateParams, SharedStateService) {

        var companyProfileHeader = SharedStateService.getSharedState('companyProfileHeader');

        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        $scope.$watch(function () {
          return companyProfileHeader;
        }, function (val) {

          if (val.selectUsersIds.length > 0) {

            $scope.bulkOptionMode = 'USERS';
            $scope.selectUsersIds = val.selectUsersIds;

          } else if (val.selectDevicesIds.length > 0) {

            $scope.bulkOptionMode = 'DEVICES';
            $scope.selectDevicesIds = val.selectDevicesIds;

          } else {
            $scope.bulkOptionMode = false;
            $scope.selectUsersIds = [];
            $scope.selectDevicesIds = [];
          }

        }, true);

      }]);

}());
