'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoServicesCtrl',
    ['$scope', 'ServicesService', '$rootScope',
      function ($scope, ServicesService, $rootScope) {

        $scope.services = ServicesService.getServicesData($scope, true, function (resp) {
          if ($scope.currentCompany.status === "SIGN_UP" && $scope.services.length === 0) {
            var onsiteServices = {
              name: 'Onsite Service',
              rate: 75,
              billable: true
            };
            var remoteServices = {
              name: 'Remote Service',
              rate: 65,
              billable: true
            };

            $scope.services = [onsiteServices, remoteServices];
          }
        });

        $scope.showCreateServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateService = false;
        });

      }]);

}());
