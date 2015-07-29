'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesMovingCtrl',
    ['$scope', 'ServicesService', 'CompaniesService',
      function ($scope, ServicesService, CompaniesService) {

        var moveServicesMap,
          checkedDefaultServices;

        $scope.companies = CompaniesService.getClientCompanies();

        $scope.generateMovementData = function () {
          checkedDefaultServices = $scope.getCheckedDefaultServices();
          $scope.disableMoveButton = checkedDefaultServices.length === 0;

          generateServicesMap();
          generateMovementStatesAndMap();
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

            moveServicesMap['hardMoveServiceIds'] = checkedDefaultServices;

            ServicesService.move(moveServicesMap, function () {
              $scope.disableMoveButton = false;
              $scope.$emit('hideMovementDropdown');
            });
          }
        };

        function generateMovementStatesAndMap() {
          $scope.movementStates = {};

          $scope.companies.forEach(function (company) {

            var companyServices = moveServicesMap[company.id],
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
          moveServicesMap = {};

          $scope.companies.forEach(function (company) {
            var services = $scope.servicesData[company.id],
              serviceIds = [];

            if (services) {
              services.forEach(function (service) {
                serviceIds.push(service.originService.versionedId.id);
              })
            }

            moveServicesMap[company.id] = serviceIds;
          });

        }

      }]);

}());
