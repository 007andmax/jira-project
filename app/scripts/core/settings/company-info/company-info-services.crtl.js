'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.companyInfoServicesCtrl',
    ['$scope', 'ServicesService', '$rootScope',
      function ($scope, ServicesService, $rootScope) {

        var services;

        initDefaultServices();
        function initDefaultServices() {
          ServicesService.getServicesData($scope, true, function (resp) {
            $scope.services = [];

            for (var i = 0; i < resp.length; i++) {
              $scope.services[i] = {
                id: resp[i].versionedId.id,
                name: resp[i].name,
                rate: resp[i].rate,
                timeBlock: resp[i].timeBlock,
                billable: resp[i].billable,
                taxable: true,
                isDefault: true
              }
            }

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

            services = angular.copy($scope.services);

            $scope.isServicesChange = function () {
              return angular.equals($scope.services, services);
            }
          });
        }

        $scope.showCreateServiceForm = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateService = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateService = false;
        });

        $scope.saveMethods.push(function () {

          return {
            services: $scope.services,
            callback: function (form) {
              initDefaultServices();
              $rootScope.$broadcast('cancelEditForm');
              if (form && form.$setPristine) {
                form.$setPristine();
              }
            },
            formName: 'editServiceForm'
          };

        });

      }]);

}());
