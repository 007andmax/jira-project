'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.servicesMovingCtrl',
    ['$scope', 'ServicesService', 'CompaniesService',
      function ($scope, ServicesService, CompaniesService) {

        var moveServicesMap,
          checkedDefaultServices;

        $scope.companies = CompaniesService.getClientCompanies();
        $scope.companyServices = ServicesService.getActualMapping($scope.servicesData);

        $scope.generateMovementData = function () {
          moveServicesMap = {};
          checkedDefaultServices = $scope.getCheckedDefaultServices();
          $scope.disableMoveButton = checkedDefaultServices.length === 0;

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

            ServicesService.move(moveServicesMap, function () {
              $scope.disableMoveButton = false;
              $scope.$emit('hideMovementDropdown');
            });
          }
        };

        function generateMovementStatesAndMap() {

          var actualMapping = ServicesService.getActualMapping($scope.servicesData);
          $scope.movementStates = {};

          $scope.companies.forEach(function (company) {

            var companyServices = actualMapping[company.id],
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

      }]);

}());
