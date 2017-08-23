'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('blockTimeBillingCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      function ($scope, AgreementsService, CompaniesService, ServicesService) {

        $scope.intervals = ['COD', '7 days', '15 days', '30 days'];

        $scope.defaultServices = [];
        $scope.blockTimeServices = [];
        $scope.contractServices = [];

        ServicesService.getServicesData($scope, false, function (data) {
          for (var i = 0; i < data.length; i++) {
            var serv = {
              name: data[i].name,
              rate: data[i].rate,
              billable: data[i].billable,
              taxes: data[i].taxes || [],
              taxIds: data[i].taxIds || []
            };
            if(data[i].taxIds && data[i].taxIds.length) {
              for(var m=0; m<data[i].taxIds.length; m++) {
                serv.taxIds.push(data[i].taxes[m].id)
              }
            }
            $scope.defaultServices.push(serv);
          }
        });

        $scope.addNewBlockTimeService = function(form, service) {
          if(form.$valid) {
            $scope.blockTimeServices.push(service);
            $scope.newBlockTimeService = {};
          }
        };

        $scope.deleteBlockTimeService = function(blockTimeService) {
          for(var i=0; i<$scope.blockTimeServices.length; i++) {
            if($scope.blockTimeServices[i].name === blockTimeService.name) {
              $scope.blockTimeServices.splice(i, 1);
            }
          }
        };


        $scope.addContractService = function(form, service) {

        };

        $scope.deleteContractService = function(service) {

        };


        $scope.createBlockTimeContract = function(form) {
          console.log(form)
        }

      }])

}());
