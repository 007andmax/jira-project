'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesMovingCtrl',
    ['$scope', 'ServicesService', 'CompaniesService',
      function ($scope, ServicesService, CompaniesService) {

        var actualServicesMap,
          moveServicesMap,
          checkedDefaultServices;

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.generateMovementData = function () {
          moveServicesMap = {};
          checkedDefaultServices = $scope.getCheckedDefaultServices();

          generateServicesMap();
          generateMovementStates();
        };

        $scope.updateMovementState = function (companyId) {
          $scope.movementStates[companyId].hasPartOfSelectedServices = false;

          if ($scope.movementStates[companyId].checked) {
            moveServicesMap[companyId] = checkedDefaultServices;
          } else {
            delete moveServicesMap[companyId];
          }
        };

        $scope.moveServices = function () {

          if ($.isEmptyObject(moveServicesMap)) {
            $scope.$emit('hideMovementDropdown');
          } else {

            $scope.disableMoveButton = true;

            ServicesService.move(moveServicesMap, function () {
              $scope.disableMoveButton = false;
              $scope.$emit('hideMovementDropdown');
            });
          }
        };

        function generateMovementStates() {
          $scope.movementStates = {};

          $scope.companies.forEach(function (company) {

            var companyServices = actualServicesMap[company.id],
              servicesCount = 0;

            if (companyServices) {
              for (var i = 0; i < checkedDefaultServices.length; i++) {
                if (companyServices.indexOf(checkedDefaultServices[i]) > -1) {
                  servicesCount++;
                }
              }
            }

            $scope.movementStates[company.id] = {
              checked: servicesCount > 0,
              hasPartOfSelectedServices: (servicesCount > 0 && servicesCount < checkedDefaultServices.length)
            };
          });

        }

        function generateServicesMap() {
          actualServicesMap = {};

          $scope.companies.forEach(function (company) {
            var services = $scope.servicesData[company.id],
              serviceIds = [];

            if (services) {
              services.forEach(function (service) {
                serviceIds.push(service.originService.versionedId.id);
              })
            }

            actualServicesMap[company.id] = serviceIds;
          });

        }

      }]);

}());
