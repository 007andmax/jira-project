'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.companyCtrl',
    ['$scope', 'CompaniesService',
      function ($scope) {

        var showServices = false,
          hasServices = false;

        $scope.companyService = true;

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
