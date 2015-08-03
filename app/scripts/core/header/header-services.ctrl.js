'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.servicesCtrl',
    ['$scope', '$rootScope', 'ServicesService',
      function ($scope, $rootScope, ServicesService) {

        $scope.searchServices = ServicesService.search;

        $scope.showService = function (service) {
          $rootScope.$broadcast(service.company.id + '-showService', service.versionedId.id)
        }

      }]);

}());
