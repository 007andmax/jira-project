'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('blockTimeBillingCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService', 'UsersService', '$filter',
      function ($scope, AgreementsService, CompaniesService, ServicesService, UsersService, $filter) {

        $scope.intervals = ['YEARLY', 'MONTHLY'];

        $scope.defaultServices = [];
        $scope.blockTimeServices = [];
        $scope.contractServices = [];

        $scope.ticketSharedUsersList = [];

        $scope.newContractService = {
          name: '',
          rate: null,
          billable: false,
          taxes: []
        };

        var day = 1000 * 60 * 60 * 24;
        var month = 30*day;

        $scope.blockTimeContract = {
          minStartDate: Date.now(),
          includedHours: null,
          blockRate: null,
          interval: "MONTHLY"
        };

        $scope.blockTimeContract.minEndDate = Date.now() + month;
        $scope.blockTimeContract.endDate = Date.now() + month;


        $scope.blockTimeContract.period = $scope.blockTimeContract.interval === 'MONTHLY' ? 'Month' : 'Year';

        $scope.clients = [];
        $scope.getClients = function() {
          var companyId = $scope.companyId || $scope.contractCompany.id;
          $scope.clients = UsersService.getAllByCompanyId(companyId);

        };

        function changeStartDate(){
          var date = $scope.blockTimeContract.startDate;
          var endDate = new Date(date);
          console.log('endDate.getMonth() ', date.getMonth());
          endDate.setDate(date.getMonth() + 1);

          console.log(date);

          $scope.blockTimeContract.endDate = $filter('date')(date, 'dd MMM yyyy');
          $scope.blockTimeContract.minEndDate = $filter('date')(date, 'dd MMM yyyy');
        }

        $scope.$watch(function (){
          return $scope.blockTimeContract.interval;
        }, function(interval){
          $scope.blockTimeContract.period = interval === 'MONTHLY' ? 'Month' : 'Year';
        });

        $scope.$watch(function () {
          return $scope.blockTimeContract.startDate;
        }, function(){
          changeStartDate()
        });



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



        $scope.calculateTotalAmount = function() {
          if($scope.blockTimeContract.includedHours && $scope.blockTimeContract.blockRate ) {
            return $scope.blockTimeContract.includedHours * $scope.blockTimeContract.blockRate;
          } else {
            return null;
          }
        };

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

        $scope.toggleAllShared = function(isNotifyAll) {
          var sharesWithoutSubscription = [];
          for (var i = 0, len = $scope.ticketSharedUsersList.length; i < len; i++) {
            var share = $scope.ticketSharedUsersList[i];
            if (!isNotifyAll) {
              share.notify = isNotifyAll;
            } else {
              if ((share.user.subscription && share.user.subscription.ticket) || share.user.accountType === 'TECH') {
                share.notify = isNotifyAll;
              } else {
                sharesWithoutSubscription.push(share);
              }
            }
          }
        };

        $scope.getUserById = function (userId) {
          return UsersService.getOneById(userId);
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

            var blockContract = {
              id: null,
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
              maxRolloverHours: null,
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

            for(var u=0; u<$scope.ticketSharedUsersList.length; u++) {
              if($scope.ticketSharedUsersList[u].notify) {
                var user = {
                  userId: $scope.ticketSharedUsersList[u].user.id,
                  date: null,
                  itemOrder: 0
                };
                blockContract.shares.push(user)
              }
            }

            AgreementsService.createContract(blockContract, function(resp) {
              console.log(resp);
              $scope.closeModal();
            })
          }
        }

      }])

}());
