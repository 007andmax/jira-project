'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService', 'Utils', 'CompaniesService',
      function ($scope, ServicesService, Utils, CompaniesService) {

        $scope.loadingInProgress = true;
        $scope.checkedServices = {};
        $scope.companies = CompaniesService.getClientCompanies().filter(function (item) {
          if (!item.isDefault) return item;
        });

        $scope.servicesData = ServicesService.getServicesData($scope, false);

        $scope.orderServices = {
          field: 'name',
          reverse: false
        };

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
        }, true);

        $scope.setOrderForServices = function (option) {
          if (option === $scope.orderServices.field) {
            $scope.orderServices.reverse = !$scope.orderServices.reverse;
          } else {
            $scope.orderServices.field = option;
            $scope.orderServices.reverse = false;
          }
        };

        $scope.orderByForServices = function (item) {
          if ($scope.orderServices.field === 'name') {
            return item.name;
          } else if ($scope.orderServices.field === 'billable') {
            return item.billable;
          } else if ($scope.orderServices.field === 'rate') {
            return item.rate;
          }

        };

        $scope.setLoadingInProgress = function (trigger) {
          $scope.loadingInProgress = trigger;
        };

      }]);

}());
