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
          $scope.glNumbersList = data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
          1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
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
            console.log("$scope.services[index]", $scope.services[index]);
            $rootScope.$broadcast('newServiceHasBeenCreated', resp.id);

          });


        };
        $scope.resetGlNumber = function (service) {
          var saveService = angular.copy(service);
          saveService.taxIds = saveService.taxes.map(function (tax) {
            return tax.id;
          });
          saveService.taxes = undefined;

          saveService.glNumber = null;

          ServicesService.save(saveService, function (resp) {
            console.log("resp", resp);
            var index = $scope.services.findIndex(item => item.versionedId.id === saveService.versionedId.id);
            if (index > -1) $scope.services[index].glNumber = null;
          
            $rootScope.$broadcast('newServiceHasBeenCreated', resp.id);

          });
        }
        $scope.checkClearContract = function (contractType) {
          var index = $scope.glNumbersList.findIndex(item => item[contractType] === true);
          if (index > -1) return true;
          return false;
        }
        $scope.resetContract = function (contractType) {
          var id;
          var index = $scope.glNumbersList.findIndex(item => item[contractType] === true);
          if (index > -1) id = $scope.glNumbersList[index].id;
          ServicesService.resetContractGlNumber(id, contractType, function (data) {
            console.log("data", data);
            $scope.glNumbersList[index][contractType] = false;
            //updateGlNumberContract(data,contractType,true);

          })
        }
        $scope.setGlNumberContract = function (id, contractType) {
          ServicesService.setContractGlNumber(id, contractType, function (data) {
            console.log("data", data);
            updateGlNumberContract(data, contractType, true);

          })
        }

        function updateGlNumberContract(data, contractType, value) {
          $scope.glNumbersList.forEach(element => {
            if (element.id === data.id) {
              element[contractType] = true;
            } else {
              element[contractType] = false;
            }

          });

        }

        $scope.getContracts = function (field) {
          var glNumber = "Select GL number";
          $scope.glNumbersList.forEach(element => {
            if (element[field]) glNumber = element.glNumber;

          });
          return glNumber;
        }




        $scope.$on(CompaniesService.getCurrentCompany().id + '-showService', function (event, serviceId) {
          $scope.$broadcast('show-' + serviceId);
        });

      }]);

}());
