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
          //if (!$scope.isServicesChange()) {
          //$scope.disabledSaveButton = true;
          //services = angular.copy($scope.services);

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

          //ServicesService.saveList($scope.services, $scope.companyForSettingPage.id, function () {
          //  initDefaultServices();
          //  $scope.disabledSaveButton = false;
          //  $rootScope.$broadcast('cancelEditForm');
          //})
          //} else {
          //  $scope.triedToSaveService = true;
          //}
        });

      }]);

}());
