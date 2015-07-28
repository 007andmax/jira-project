'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.defaultServicesCtrl',
    ['$scope', 'ServicesService',
      function ($scope) {

        $scope.showCheckboxes = true;

        $scope.showCreateServiceForm = function () {
          $scope.showCreateService = true;
        };

        $scope.$on('cancelEditService', function () {
          $scope.showCreateService = false;
        });

        $scope.$watch("servicesData['default']", function (services) {
          $scope.services = services;
        });

      }]);

}());
