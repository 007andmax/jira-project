'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesCtrl',
    ['$scope', 'ServicesService', 'Utils', 'CompaniesService', 'quicktech.common.services.SharedStateService', '$timeout',
      function ($scope, ServicesService, Utils, CompaniesService, SharedStateService, $timeout) {
        var globalSearch = SharedStateService.getSharedState('globalSearch'), promise;

        $scope.headerSharedState = SharedStateService.getSharedState('servicesHeader');
        $scope.loadingInProgress = {
          all: true,
          default: true,
          companies: true
        };
        $scope.checkedServices = {};
        $scope.companies = CompaniesService.getClientCompanies().filter(function (item) {
          if (!item.isDefault) return item;
        });

        if ($scope.companies && !$scope.companies.length) {
          $scope.loadingFinished('companies');
        }

        $scope.servicesData = ServicesService.getServicesData($scope, false, function (data) {
          $scope.loadingFinished('default');
        });

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

        $scope.loadingFinished = function (list) {
          $scope.loadingInProgress[list] = false;
          if (!$scope.loadingInProgress.default && !$scope.loadingInProgress.companies) {
            $scope.loadingInProgress.all = false;

            if (globalSearch.serviceFilter) {
              if (promise) {
                $timeout.cancel(promise);
              }

              promise = $timeout(function () {
                $scope.$broadcast(globalSearch.serviceFilter.company + '-showService', globalSearch.serviceFilter.id);
                globalSearch.serviceFilter = undefined;
                $timeout.cancel(promise);
              });
            }
          }
        };

      }]);

}());
