'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.defaultServicesCtrl',
    ['$scope', '$rootScope', 'CompaniesService', 'ServicesService',
      function ($scope, $rootScope, CompaniesService, ServicesService) {
        $scope.glNumbersList = [];
        $scope.showCheckboxes = true;

        $scope.$watch("servicesData.default.length", function (count) {
          if (count) {
            $scope.services = $scope.servicesData.default;
          }
        });
        ServicesService.getGlNumbers(function (data) {
          $scope.glNumbersList = data;
        })

        $scope.setGlNumber = function (glNumber, service) {


          var saveService = angular.copy(service);
          saveService.taxIds = saveService.taxes.map(function (tax) {
            return tax.id;
          });
          saveService.taxes = undefined;

          saveService.glNumber = {
            id: glNumber.id
          }

          ServicesService.save(saveService, function (resp) {
            console.log("resp", resp);
            var index = $scope.services.findIndex(item => item.versionedId.id === saveService.versionedId.id);
            if (index > -1) $scope.services[index].glNumber = glNumber;
            console.log("$scope.services[index]",$scope.services[index]);
            $rootScope.$broadcast('newServiceHasBeenCreated', resp.id);

          });


        };


        $scope.$on(CompaniesService.getCurrentCompany().id + '-showService', function (event, serviceId) {
          $scope.$broadcast('show-' + serviceId);
        });

      }]);

}());
