'use strict';

(function () {

  angular.module('quicktech.core.services').controller('quicktech.core.services.defaultServicesCtrl',
    ['$scope', '$rootScope', 'CompaniesService', 'ServicesService',
      function ($scope, $rootScope, CompaniesService, ServicesService) {
        $scope.glNumbersList = [];
        $scope.showCheckboxes = true;
        $rootScope.$on('setRealTimeGLNumbers', function (event, newInvoice) {
          console.log('newInvoice', newInvoice);
          $scope.glNumbersList = newInvoice;
        });
        $scope.$watch("servicesData.default.length", function (count) {
          if (count) {
            $scope.services = $scope.servicesData.default;
          }
        });
        $scope.glNumbersList = CompaniesService.getGlNumbers();
        $scope.getContracts = function (field) {
          var glNumber = null;
          $scope.glNumbersList.forEach(element => {
            if (element[field]) glNumber = element;

          });
          return glNumber;
        }
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
        $scope.getGlNumberName = function (glNumber) {
          if (glNumber) {
            var find = $scope.glNumbersList.find(function (c) {
              return c.id === glNumber.id;
            });
            return find ? find.glNumber : '';
          }
        };
        $scope.resetGlNumber = function (service) {
          var saveService = angular.copy(service);
          saveService.taxIds = saveService.taxes.map(function (tax) {
            return tax.id;
          });
          saveService.taxes = undefined;
          saveService.glNumber = null;
          ServicesService.save(saveService, function (resp) {
            var index = $scope.services.findIndex(item => item.versionedId.id === saveService.versionedId.id);
            if (index > -1) $scope.services[index].glNumber = null;
            $rootScope.$broadcast('newServiceHasBeenCreated', resp.id);
          });
        }
        $scope.checkGlNumberValueMatched = function (inputValue) {
          if (inputValue) {
            return $scope.glNumbersList.some(function (item) {
              return item.id === inputValue.id
            })
          } else {
            return false
          }
        };
        $scope.checkClearContract = function (contractType) {
          var index = $scope.glNumbersList.findIndex(item => item[contractType] === true);
          if (index > -1) return true;
          return false;
        }
        $scope.setGlNumberContract = function (id, contractType) {
          ServicesService.setContractGlNumber(id, contractType, function (data) {
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
        $scope.$on(CompaniesService.getCurrentCompany().id + '-showService', function (event, serviceId) {
          $scope.$broadcast('show-' + serviceId);
        });
      }]);

}());
