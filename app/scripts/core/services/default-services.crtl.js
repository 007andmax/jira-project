'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.defaultServicesCtrl',
    ['$scope', '$rootScope', 'CompaniesService',
      function ($scope, $rootScope, CompaniesService) {

        $scope.showCheckboxes = true;

        $scope.$watch("servicesData.default.length", function (count) {
          if (count) {
            $scope.services = $scope.servicesData.default;
          }
        });

        $scope.$on(CompaniesService.getCurrentCompany().id + '-showService', function (event, serviceId) {
          $scope.$broadcast('show-' + serviceId);
        });

      }]);

}());
