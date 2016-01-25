'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService', 'Utils', 'CompaniesService',
      function ($scope, ServicesService, Utils, CompaniesService) {

        $scope.checkedServices = {};
        $scope.companies = CompaniesService.getClientCompanies();
        $scope.servicesData = ServicesService.getServicesData($scope, false);

        $scope.getCheckedDefaultServices = function () {
          var checkedDefaultServices = [];

          //for the case when checked service had been deleted
          var defaultServices = $scope.servicesData['default'];

          for (var serviceId in $scope.checkedServices) {
            if ($scope.checkedServices[serviceId] && Utils.findById(defaultServices, serviceId)) {
              checkedDefaultServices.push(serviceId)
            }
          }

          return checkedDefaultServices;
        };

        $scope.onChangeCheckbox = fillHasDefaultServicesChecked;

        $scope.$watch('servicesData["default"].length', fillHasDefaultServicesChecked);

        function fillHasDefaultServicesChecked() {
          $scope.hasDefaultServicesChecked = false;

          var defaultServices = $scope.servicesData['default'];

          for (var serviceId in $scope.checkedServices) {
            if ($scope.checkedServices[serviceId] && Utils.findById(defaultServices, serviceId)) {
              $scope.hasDefaultServicesChecked = true;
            }

            if ($scope.hasDefaultServicesChecked) {
              return;
            }
          }
        }

        $scope.$watch('checkedServices', function () {
          $scope.checkedDefaultServices = 0;
          for (var serviceId in $scope.checkedServices) {
            if ($scope.checkedServices[serviceId]) {
              $scope.checkedDefaultServices++
            }
          }
        }, true)

      }]);

}());
