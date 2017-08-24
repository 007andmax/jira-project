'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('blockTimeBillingCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService', 'UsersService',
      function ($scope, AgreementsService, CompaniesService, ServicesService, UsersService) {

        $scope.intervals = ['YEARLY', 'MONTHLY'];

        $scope.defaultServices = [];
        $scope.blockTimeServices = [];
        $scope.contractServices = [];

        $scope.newContractService = {
          name: '',
          rate: null,
          billable: false,
          taxes: []
        };

        $scope.clients = [];
        $scope.getClients = function() {
          if($scope.companyId) {
            $scope.clients = UsersService.getAllByCompanyId($scope.companyId);
          } else if($scope.contractCompany.id) {
            $scope.clients = UsersService.getAllByCompanyId($scope.contractCompany.id);
          }
        };



        ServicesService.getServicesData($scope, false, function (data) {
          for (var i = 0; i < data.length; i++) {
            var serv = {
              name: data[i].name,
              rate: data[i].rate,
              billable: data[i].billable,
              taxes: data[i].taxes || [],
              taxIds: data[i].taxIds || [],
              picked: false
            };
            if (data[i].taxIds && data[i].taxIds.length) {
              for (var m = 0; m < data[i].taxIds.length; m++) {
                serv.taxIds.push(data[i].taxes[m].id)
              }
            }
            $scope.defaultServices.push(serv);
          }
        });

        function pickDefaultService(service) {
          for (var i = 0; i < $scope.defaultServices.length; i++) {
            if (service.name === $scope.defaultServices[i].name) {
              $scope.defaultServices[i].picked = true;
            }
          }
        }

        function unpickDefaultService(service) {
          for (var i = 0; i < $scope.defaultServices.length; i++) {
            if (service.name === $scope.defaultServices[i].name) {
              $scope.defaultServices[i].picked = false;
            }
          }
        }

        function checkUniqueServiceName(serviceList, service) {
          if(serviceList && service) {
            var unique = true;
            for (var i = 0; i < serviceList.length; i++) {
              if (serviceList[i].name === service.name) {
                unique = false;
                break;
              }
            }
            return unique;
          }
        }

        $scope.isNameUnique = function (service) {
          if(service) {
            if(service.name && service.name.name) {
              return true;
            }
            var name = service;
            if(service.name
              && service.name !== "undefined"
              && service.name.name
              && service.name.name.length) {
              name = service.name;
            }
            return (checkUniqueServiceName($scope.defaultServices, name) &&
            checkUniqueServiceName($scope.blockTimeServices, name) &&
            checkUniqueServiceName($scope.contractServices, name))
          }
        };


        $scope.addNewBlockTimeService = function (form, service) {
          if (form.$valid && service.name) {
            if (service.name.name && service.name.name.length) {
              var ns = {
                name: service.name.name
              };
              $scope.blockTimeServices.push(ns);
              pickDefaultService(ns);
              $scope.newBlockTimeService = {};
            } else {

              $scope.blockTimeServices.push(service);
              pickDefaultService(service);
              $scope.newBlockTimeService = {};

            }

          }
        };

        $scope.deleteBlockTimeService = function (blockTimeService) {
          for (var i = 0; i < $scope.blockTimeServices.length; i++) {
            if ($scope.blockTimeServices[i].name === blockTimeService.name) {
              $scope.blockTimeServices.splice(i, 1);
              unpickDefaultService(blockTimeService);
            }
          }
        };


        $scope.addContractService = function (form, service) {
            if(form.$valid && service.name) {
              if (service.name.name && service.name.name.length) {
                var ns = {
                  name: service.name.name,
                  rate: service.rate,
                  billable: service.billable,
                  taxes: service.taxes
                };
                $scope.contractServices.push(ns);
                pickDefaultService(ns);
                $scope.newContractService = {
                  name: '',
                  rate: null,
                  billable: false,
                  taxes: []
                };
              } else {

                $scope.contractServices.push(service);
                pickDefaultService(service);
                $scope.newContractService = {
                  name: '',
                  rate: null,
                  billable: false,
                  taxes: []
                };

              }
            }
        };

        $scope.deleteContractService = function (contractService) {
          for (var i = 0; i < $scope.contractServices.length; i++) {
            if ($scope.contractServices[i].name === contractService.name) {
              $scope.contractServices.splice(i, 1);
              unpickDefaultService(contractService);
            }
          }
        };


        $scope.createBlockTimeContract = function (form, contractData) {
          if(form.$valid) {
            //console.log(contractData);

            var blockContract = {
              description: contractData.description,
              type: 'BLOCK_TIME',
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              interval: contractData.interval ,
              customInterval: null,
              billType: null,
              includedHours: contractData.includedHours,
              totalHours: contractData.totalHours,
              blockRate: contractData.blockRate,
              rateExceeding: contractData.rateExceeding,
              companyId: $scope.companyId || $scope.contractCompany.id,
              services: [],
              blockTimeServices: [],
              enableTimeRollover: contractData.enableTimeRollover || false,
              shares: [],
              taxIds: []
            };

            for(var i=0; i<$scope.blockTimeServices.length; i++) {
              var bs = {
                name: $scope.blockTimeServices[i].name,
                rate: contractData.ratePerHour
              };
              blockContract.blockTimeServices.push(bs);
            }

            for(var m=0; m<$scope.contractServices.length; m++) {
              var cs = {
                name: $scope.contractServices[m].name,
                rate: $scope.contractServices[m].rate,
                billable: $scope.contractServices[m].billable,
                taxIds: []
              };
              if($scope.contractServices[m].taxes.length) {
                for(var n=0; n<$scope.contractServices[m].taxes.length; n++) {
                  cs.taxIds.push($scope.contractServices[m].taxes[n].id)
                }
              }
              blockContract.services.push(cs);
            }

            AgreementsService.createContract(blockContract, function(resp) {
              console.log(resp);
              $scope.closeModal();
            })



          }
        }

      }])

}());
