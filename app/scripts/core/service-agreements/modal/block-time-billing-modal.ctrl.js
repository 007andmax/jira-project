'use strict';



console.log(Messages.errorMessage);

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('blockTimeBillingCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      'UsersService', '$filter', '$timeout', '$q',
      'quicktech.common.services.UserConfirmationsService', 'TaxesService',
      function ($scope, AgreementsService, CompaniesService, ServicesService,
                UsersService, $filter, $timeout, $q, UserConfirmationsService, TaxesService) {

        $scope.intervals = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days', '1 day'];

        $scope.parseDate = Date.parse.bind(Date);

        var preSettupServiceList = [
          {name: 'On site block time service'},
          {name: 'Remote block time service'}
        ];
        $scope.taxes = TaxesService.getAll();


        $scope.defaultServices = [];
        $scope.blockTimeServices = [];
        $scope.services = [];

        $scope.reInitEndDate = true;
        $scope.reInitServiceForm = true;

        $scope.ticketSharedUsersList = [];


        $scope.newContractService = {
          name: '',
          rate: null,
          billable: false,
          taxes: []
        };

        $scope.showBlockTimeContractCreateMessageError = false;
        $scope.BlockTimeContractCreateMessage = '';

        $scope.showNewBlockTimeServiceError = false;
        $scope.showNewServiceError = false;
        $scope.newBlockTimeServiceErrorMessage = '';
        $scope.newServiceErrorMessage = '';

        var day = 1000 * 60 * 60 * 24;
        var month = 30 * day;


        if ($scope.editMode) {
          $scope.blockTimeContract = {
            minStartDate: Date.now(),
            includedHours: null,
            blockRate: null,
            interval: "MONTHLY",
            blockTimeServices: preSettupServiceList,
            services: [],
            taxIds: [],
            taxes: $scope.addDefaultTaxes(),
            period: 'Month'
          };
        } else {
          $scope.blockTimeContract = angular.copy($scope.editContract);
          //$scope.blockTimeContract.description = $scope.blockTimeContract.description + ' COPY';
          $scope.blockTimeContract.minStartDate = Date.now();
          $scope.blockTimeContract.taxes = [];

          for (var i = 0; i < $scope.blockTimeContract.taxIds.length; i++) {
            for (var j = 0; j < $scope.taxes.length; j++) {
              if ($scope.blockTimeContract.taxIds[i] === $scope.taxes[j].id) {
                $scope.blockTimeContract.taxes.push($scope.taxes[j]);
              }
            }
          }
        }

        $scope.newContractService = {
          name: '',
          rate: 0,
          billable: false,
          taxes: $scope.addDefaultTaxes()
        };


        // $scope.blockTimeContract.minEndDate = $scope.blockTimeContract.minStartDate + month;
        // $scope.blockTimeContract.endDate = $scope.blockTimeContract.minStartDate + month;
        if($scope.blockTimeContract.startDate) {
          changeMinEndDate($scope.blockTimeContract.period);
        }



        $scope.blockTimeContract.period = $scope.blockTimeContract.interval === 'MONTHLY' ? 'Month' : 'Year';

        $scope.clients = [];
        $scope.getClients = function () {
          var companyId = returnCompanyId();
          $scope.clients = UsersService.getAllByCompanyId(companyId);

        };


        function changeStartDate() {
          // var date = $scope.blockTimeContract.startDate;
          // var endDate = new Date(date);
          // //endDate.setMonth(endDate.getMonth() + 1);
          // $scope.blockTimeContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          // $scope.blockTimeContract.minEndDate = $filter('date')(endDate, 'dd MMM yyyy');
          // reInitEndDate()
          changeMinEndDate($scope.blockTimeContract.period);
        }

        function changeMinEndDate(period) {
          var date = $scope.blockTimeContract.startDate;
          var endDate = new Date(date);
          switch(period) {
            case('Month'):
              endDate.setMonth(endDate.getMonth() + 1);
              break;
            case('Year'):
              endDate.setFullYear(endDate.getFullYear()+1);
              break;
            default:
              endDate.setTime(endDate.getTime()+ day*period);
          }


          $scope.blockTimeContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          $scope.blockTimeContract.minEndDate = $filter('date')(endDate, 'dd MMM yyyy');
          reInitEndDate()
        }

        function reInitEndDate() {
          $scope.reInitEndDate = false;
          $timeout(function () {
            $scope.reInitEndDate = true;
          }, 0);
        }

        function reInitServiceForm() {
          $scope.reInitServiceForm = false;
          $timeout(function () {
            $scope.reInitServiceForm = true;
          }, 0);
        }

        $scope.$watch(function () {
          return $scope.blockTimeContract.interval;
        }, function (interval) {
          if (interval === 'MONTHLY') {
            $scope.blockTimeContract.period = 'Month';
            $scope.blockTimeContract.interval = 'Month';
            $scope.blockTimeContract.customInterval = null;
          } else if (interval === 'YEARLY') {
            $scope.blockTimeContract.period = 'Year';
            $scope.blockTimeContract.interval = 'Year';
            $scope.blockTimeContract.customInterval = null;
          } else if (interval === '30 days') {
            $scope.blockTimeContract.period = 30;
            $scope.blockTimeContract.customInterval = 30;
          } else if (interval === '15 days') {
            $scope.blockTimeContract.period = 15;
            $scope.blockTimeContract.customInterval = 15;
          } else if (interval === '7 days') {
            $scope.blockTimeContract.period = 7;
            $scope.blockTimeContract.customInterval = 7;
          } else if(interval === '1 day') {
            $scope.blockTimeContract.period = 1;
            $scope.blockTimeContract.customInterval = 1;

          }
          changeMinEndDate($scope.blockTimeContract.period);
          reInitEndDate()
        });

        $scope.$watch(function () {
          return $scope.blockTimeContract.startDate;
        }, function () {
          changeStartDate()
        });


        ServicesService.getServicesData($scope, function (data) {
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


        $scope.calculateTotalAmount = function () {
          if ($scope.blockTimeContract.includedHours && $scope.blockTimeContract.blockRate) {
            return $scope.blockTimeContract.includedHours * $scope.blockTimeContract.blockRate;
          } else {
            return null;
          }
        };

        function pickDefaultService(service) {
          for (var i = 0; i < $scope.defaultServices.length; i++) {
            if (service.name === $scope.defaultServices[i].name) {
              $scope.defaultServices[i].picked = true;
              break;
            }
          }
        }

        function unpickDefaultService(service) {
          for (var i = 0; i < $scope.defaultServices.length; i++) {
            if (service.name === $scope.defaultServices[i].name) {
              $scope.defaultServices[i].picked = false;
              break;
            }
          }
        }

        function checkUniqueServiceName(serviceList, service) {
          if (serviceList && service) {
            var unique = true;
            for (var i = 0; i < serviceList.length; i++) {
              if (serviceList[i].name === service.name) {
                unique = false;
                break;
              }
            }
            return unique;
          } else {
            return true;
          }
        }

        $scope.isNameUnique = function (service) {
          if (service) {
            if (service.name && service.name.name) {
              return true;
            }
            var name = service;
            if (service.name
              && service.name !== "undefined"
              && service.name.name
              && service.name.name.length) {

              name = service.name;
            }
            var unDefServ = checkUniqueServiceName($scope.defaultServices, name);
            var unBlockTimeServ = checkUniqueServiceName($scope.blockTimeContract.blockTimeServices, name);
            var unContractServ = checkUniqueServiceName($scope.blockTimeContract.services, name);
            var check = unDefServ && unBlockTimeServ && unContractServ;

            return check;
          }
        };

        $scope.toggleAllShared = function (isNotifyAll) {
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
          $scope.showNewBlockTimeServiceError = false;
          console.log('showNewBlockTimeServiceError', $scope.showNewBlockTimeServiceError)
          if (form.$valid) {
            if (!service.name) {
              $scope.showNewBlockTimeServiceError = true;
              $scope.newBlockTimeServiceErrorMessage = 'Please enter the service name';
            } else {
              if (!$scope.blockTimeContract.startDate || !$scope.blockTimeContract.endDate) {
                $scope.showNewBlockTimeServiceError = true;
                $scope.newBlockTimeServiceErrorMessage = 'Please enter start and end date to check service name';
              } else {
                validateNewServiceName(service, 'block').then(function (resp) {
                  if (resp) {
                    if (service.name.name && service.name.name.length) {
                      var ns = {
                        name: service.name.name
                      };
                      $scope.blockTimeContract.blockTimeServices.push(ns);
                      pickDefaultService(ns);
                      $scope.newBlockTimeService = {};
                    } else {

                      $scope.blockTimeContract.blockTimeServices.push(service);
                      pickDefaultService(service);
                      $scope.newBlockTimeService = {};
                    }
                  }
                })
              }
            }


          } else {
            if (!service || service == undefined) {
              $scope.showNewBlockTimeServiceError = true;
              $scope.newBlockTimeServiceErrorMessage = 'Please enter the service name';
            }
          }
        };

        // function preSettupBlockTimeService(preSettupServiceList) {
        //   if (preSettupServiceList && preSettupServiceList.length) {
        //     for (var i = 0; i < preSettupServiceList.length; i++) {
        //       var setService = {
        //         name: preSettupServiceList[i].name
        //       };
        //       pickDefaultService(setService);
        //       $scope.blockTimeContract.blockTimeServices.push(setService);
        //     }
        //   }
        // }

        $scope.deleteBlockTimeService = function (blockTimeService) {
          for (var i = 0; i < $scope.blockTimeContract.blockTimeServices.length; i++) {
            if ($scope.blockTimeContract.blockTimeServices[i].name === blockTimeService.name) {
              $scope.blockTimeContract.blockTimeServices.splice(i, 1);
              unpickDefaultService(blockTimeService);
            }
          }
        };


        $scope.addContractService = function (form, service) {
          $scope.showNewServiceError = false;
          if (form.$valid) {
            if (!service.name) {
              $scope.showNewServiceError = true;
              $scope.newServiceErrorMessage = 'Please enter the service name';
            } else {
              if (!$scope.blockTimeContract.startDate || !$scope.blockTimeContract.endDate) {
                $scope.showNewServiceError = true;
                $scope.newServiceErrorMessage = 'Please enter start and end date to check service name';
              } else {
                validateNewServiceName(service, 'service').then(function (resp) {
                  if (resp) {
                    if (service.name.name && service.name.name.length) {
                      var ns = {
                        name: service.name.name,
                        rate: service.rate,
                        billable: service.billable,
                        taxes: service.taxes
                      };
                      $scope.blockTimeContract.services.push(ns);
                      pickDefaultService(ns);
                      $scope.newContractService = {
                        name: '',
                        rate: 0,
                        billable: false,
                        taxes: $scope.addDefaultTaxes()
                      };
                      reInitServiceForm()
                    } else {

                      $scope.blockTimeContract.services.push(service);
                      pickDefaultService(service);
                      $scope.newContractService = {
                        name: '',
                        rate: 0,
                        billable: false,
                        taxes: $scope.addDefaultTaxes()
                      };
                      reInitServiceForm()

                    }
                  }
                })
              }
            }


          }
        };

        $scope.deleteContractService = function (contractService) {
          for (var i = 0; i < $scope.blockTimeContract.services.length; i++) {
            if ($scope.blockTimeContract.services[i].name === contractService.name) {
              $scope.blockTimeContract.services.splice(i, 1);
              unpickDefaultService(contractService);
            }
          }
        };

        function checkBlockTimeContractServicesNameLengths(){
          var check = true;
          for(var i=0; i<$scope.blockTimeContract.blockTimeServices.length; i++) {
            if($scope.blockTimeContract.blockTimeServices[i].name == undefined) {
              check = false;
            }
          }
          for(var t=0; t<$scope.blockTimeContract.services.length; t++) {
            if($scope.blockTimeContract.services[t].name == undefined || $scope.blockTimeContract.services[t].name.length == 0) {
              check = false;
            }
          }
          if(!check) {
            $scope.showBlockTimeContractCreateMessageError = true;
            $scope.BlockTimeContractCreateMessage = 'You have an empty services names';
          } else {
            $scope.showBlockTimeContractCreateMessageError = false;
          }
          return check;
        }

        $scope.disableBloctCreateButton = function () {
          if ($scope.blockTimeContract.description &&
            $scope.blockTimeContract.startDate &&
            $scope.blockTimeContract.endDate &&
            $scope.blockTimeContract.rateExceeding &&
            $scope.blockTimeContract.blockTimeServices.length > 0 &&
            $scope.blockTimeContract.includedHours &&
            $scope.blockTimeContract.blockRate &&
            checkBlockTimeContractServicesNameLengths()) {
            return false
          } else {
            return true
          }
        };

        function checkForExistingNameDuplicates(name) {
          var duplicate = false;
          var names = [];
          for(var i=0; i<$scope.blockTimeContract.blockTimeServices.length; i++) {
            names.push($scope.blockTimeContract.blockTimeServices[i].name)
          }
          for(var j=0; j<$scope.blockTimeContract.services.length; j++) {
            names.push($scope.blockTimeContract.services[j].name)
          }
          var sortedNames = names.slice().sort();
          for(var t=0; t<sortedNames.length-1; t++) {
            if(sortedNames[t+1] == sortedNames[t] && sortedNames[t] == name) {
              duplicate = true;
            }
          }
          if(duplicate) {
            $scope.showBlockTimeContractCreateMessageError = true;
            $scope.BlockTimeContractCreateMessage = 'You have duplicates services name';
          } else {
            $scope.showBlockTimeContractCreateMessageError = false;
          }
          return duplicate;
        }

        $scope.checkBlockTimeServiceErrorForm = function(service) {
          if(service.name && !checkForExistingNameDuplicates(service.name)) {
            return false;
          } else {
            return true;
          }
        };

        function returnCompanyId() {
          var id;
          if ($scope.blockTimeContract.companyId) {
            id = $scope.blockTimeContract.companyId
          } else if ($scope.contractCompany && $scope.contractCompany.id) {
            id = $scope.contractCompany.id
          } else {
            id = $scope.companyId;
          }
          return id;
        }

        function checkForDuplicateServiceNames(serviceList) {

          var deferred = $q.defer();
          var startDate = $filter('date')($scope.blockTimeContract.startDate, 'dd MMM yyyy');
          var endDate = $filter('date')($scope.blockTimeContract.endDate, 'dd MMM yyyy');

          var companyId = returnCompanyId();
          var serviceNamesList = [];
          for (var i = 0; i < serviceList.length; i++) {
            // if (serviceList[i].name == null) {
            //   $scope.showBlockTimeContractCreateMessageError = true;
            //   $scope.BlockTimeContractCreateMessage = 'Service name is required';
            //   break;
            // } else {
            //   serviceNamesList.push(serviceList[i].name);
            // }
            serviceNamesList.push(serviceList[i].name);
          }

          ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, serviceNamesList, function (resp) {
            if (Object.keys(resp).length === 0) {
              deferred.resolve(resp);
            } else {
              $scope.showBlockTimeContractCreateMessageError = true;
              $scope.BlockTimeContractCreateMessage = 'Duplicates in services list';
              deferred.reject();

            }
          });
          return deferred.promise;
        }

        function validateNewServiceName(newService, serviceType) {

          var deferred = $q.defer();
          if (newService && newService.name) {
            $scope.showNewBlockTimeServiceError = false;
            $scope.showNewServiceError = false;
            console.log('showNewBlockTimeServiceError', $scope.showNewBlockTimeServiceError)

            var companyId = returnCompanyId();
            var name = [];
            name.push(newService.name);

            var startDate = $filter('date')($scope.blockTimeContract.startDate, 'yyyy/MM/dd');
            var endDate = $filter('date')($scope.blockTimeContract.endDate, 'yyyy/MM/dd');
            ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, name, function (resp) {
              if (Object.keys(resp).length === 0) {
                deferred.resolve(resp);
              } else {
                deferred.reject();
                if (serviceType === 'block') {
                  $scope.showNewBlockTimeServiceError = true;
                  $scope.newBlockTimeServiceErrorMessage = 'Service name is duplicate';
                } else {
                  $scope.showNewServiceError = true;
                  $scope.newServiceErrorMessage = 'Service name is duplicate';
                }
              }
            });
          }
          return deferred.promise;
        }


        function createBlockTimeContract(contractData) {
          if (contractData) {

            var blockContract = {
              id: null,
              description: contractData.description,
              type: 'BLOCK_TIME',
              customInterval: contractData.customInterval,
              billType: null,
              includedHours: contractData.includedHours,
              totalHours: contractData.totalHours,
              blockRate: contractData.blockRate,
              rateExceeding: contractData.rateExceeding,
              companyId: returnCompanyId(),
              services: [],
              blockTimeServices: [],
              enableTimeRollover: contractData.enableTimeRollover || false,
              maxRolloverHours: contractData.maxRolloverHours,
              shares: [],
              taxIds: []
            };
            if(contractData.interval == 'Month' || contractData.interval == 'Year') {
              blockContract.interval = contractData.interval;
            } else {
              blockContract.interval = null;
            }

            var sd = new Date(contractData.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            blockContract.startDate = sd.getTime();

            var ed = new Date(contractData.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            blockContract.endDate = ed.getTime();

            for (var i = 0; i < $scope.blockTimeContract.blockTimeServices.length; i++) {
              var bs = {
                name: $scope.blockTimeContract.blockTimeServices[i].name,
                rate: contractData.rateExceeding,
              };
              blockContract.blockTimeServices.push(bs);
            }

            for (var m = 0; m < $scope.blockTimeContract.services.length; m++) {
              var cs = {
                name: $scope.blockTimeContract.services[m].name,
                rate: $scope.blockTimeContract.services[m].rate,
                billable: $scope.blockTimeContract.services[m].billable,
                taxIds: []
              };
              if ($scope.blockTimeContract.services[m].taxes.length) {
                for (var n = 0; n < $scope.blockTimeContract.services[m].taxes.length; n++) {
                  cs.taxIds.push($scope.blockTimeContract.services[m].taxes[n].id)
                }
              }
              blockContract.services.push(cs);
            }

            for (var u = 0; u < $scope.ticketSharedUsersList.length; u++) {
              if ($scope.ticketSharedUsersList[u].notify) {
                var user = {
                  userId: $scope.ticketSharedUsersList[u].user.id,
                  date: null,
                  itemOrder: 0
                };
                blockContract.shares.push(user)
              }
            }
            if ($scope.blockTimeContract.taxes && $scope.blockTimeContract.taxes.length) {
              for (var r = 0; r < $scope.blockTimeContract.taxes.length; r++) {
                blockContract.taxIds.push($scope.blockTimeContract.taxes[r].id);
              }
            }

            AgreementsService.createContract(blockContract, function (resp) {
              console.log(resp);
              if (resp.message === 'Validation failed') {
                $scope.showBlockTimeContractCreateMessageError = true;
                $scope.BlockTimeContractCreateMessage = 'Something went wrong, please try again later and contact administrator';
              } else {
                $scope.closeModal();
              }
            })
          }
        }

        $scope.validateAndCreteBlockTimeContract = function (blockTimeContract, newBlockTimeService, newService) {
          var emptyServices = true;
          if ((newBlockTimeService && newBlockTimeService.name && newBlockTimeService.name.length) || (newService && newService.name && newService.name.length)) {
            emptyServices = false;
            var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
            var confirmButton = 'Yes, create';
            UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
              emptyServices = true;
              validateAndCreate(blockTimeContract);
            });
          } else {
            validateAndCreate(blockTimeContract);
          }

          function validateAndCreate(blockTimeContract) {
            checkForDuplicateServiceNames(blockTimeContract.blockTimeServices).then(function (resp) {
              if (resp) {
                if (blockTimeContract.services && blockTimeContract.services.length) {
                  checkForDuplicateServiceNames(blockTimeContract.services).then(function (resp) {
                    if (resp) {
                      createBlockTimeContract(blockTimeContract)
                    }
                  })
                } else {
                  createBlockTimeContract(blockTimeContract)
                }

              }
            })
          }

        }

      }])

}());
