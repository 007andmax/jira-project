'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.companyCtrl',
    ['$scope', 'ServicesService',
      function ($scope, ServicesService) {

        var showServices = false,
          hasServices = false;

        $scope.companyService = true;
        $scope.addServiceDropdown = {
          isOpen: false,
          serviceMap: {}
        };

        $scope.initAddServiceDropdown = function () {
          var serviceMap = $scope.addServiceDropdown.serviceMap = {};

          if ($scope.services && $scope.services.length > 0) {
            for (var i = 0, len = $scope.services.length; i < len; i++) {
              serviceMap[$scope.services[i].originService.versionedId.id] = true;
            }
          }
        };

        $scope.addServices = function () {
          $scope.disableAddButton = true;

          var serviceMap = $scope.addServiceDropdown.serviceMap;
          var servicesArr = [];

          for (var serviceId in serviceMap) {
            if (serviceMap[serviceId]) {
              servicesArr.push(serviceId)
            }
          }

          ServicesService.saveList(servicesArr, $scope.company.id, function () {
            $scope.addServiceDropdown.isOpen = false;
            $scope.disableAddButton = false;
          });
        };

        $scope.toggleServices = function () {

          if (!hasServices && !showServices) {
            return;
          }

          $scope.$emit('toggleServices');
          showServices = !showServices;
        };

        $scope.$watch('services.length > 0', function (val) {

          hasServices = val;

          if (showServices && !hasServices) {
            $scope.toggleServices();
          }
        });

        $scope.$watch("servicesData[company.id]", function (services) {
          $scope.services = services;
        });

        $scope.$on($scope.company.id + '-showService', function (event, serviceId) {
          if (!showServices) {
            $scope.toggleServices();
          }

          $scope.$broadcast('show-' + serviceId);
        });


      }]);

}());
