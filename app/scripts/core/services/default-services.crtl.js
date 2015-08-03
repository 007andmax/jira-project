'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.defaultServicesCtrl',
    ['$scope', '$rootScope', 'CompaniesService',
      function ($scope, $rootScope, CompaniesService) {

        $scope.showCheckboxes = true;

        $scope.showCreateServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateService = false;
        });

        $scope.$watch("servicesData['default']", function (services) {
          $scope.services = services;
        });

        $scope.$on(CompaniesService.getCurrentCompany().id + '-showService', function (event, serviceId) {
          $scope.$broadcast('show-' + serviceId);
        });

      }]);

}());
