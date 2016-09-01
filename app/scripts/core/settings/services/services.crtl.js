'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.servicesCtrl',
    ['$scope', 'ServicesService', '$rootScope',
      function ($scope, ServicesService, $rootScope) {

        $scope.services = ServicesService.getServicesData($scope, true);

        $scope.showCreateServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateService = false;
        });

      }]);

}());
