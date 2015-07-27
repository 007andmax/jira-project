'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {
        $scope.servicesData = ServicesService.getServicesData($scope);
      }]);

}());
