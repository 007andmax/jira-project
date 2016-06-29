'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.servicesCtrl',
    ['$scope', '$rootScope', 'ServicesService', 'quicktech.common.services.SharedStateService', '$timeout',
      function ($scope, $rootScope, ServicesService, SharedStateService, $timeout) {
        var globalSearch = SharedStateService.getSharedState('globalSearch'),
          globalFilter = globalSearch.serviceFilter;

        if (globalFilter) {
          $scope.service = globalFilter.name;
          $timeout(function () {
            $rootScope.$broadcast($scope.currentUser.company.id + '-showService', globalFilter.id);
          });
          globalSearch.serviceFilter = undefined;
        }

        $scope.searchServices = ServicesService.search;

        $scope.showService = function (service) {
          $rootScope.$broadcast(service.company.id + '-showService', service.versionedId.id)
        }

      }]);

}());
