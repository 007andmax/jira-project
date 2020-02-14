'use strict';


(function () {

  angular.module('quicktech.core.serviceAgreements').controller('blockTimeBillingCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      'UsersService', '$filter', '$timeout', '$q',
      'quicktech.common.services.UserConfirmationsService', 'TaxesService', 'Utils','$rootScope',
      function ($scope, AgreementsService, CompaniesService, ServicesService,
                UsersService, $filter, $timeout, $q, UserConfirmationsService, TaxesService, Utils,$rootScope) {

        $scope.intervals = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
        $scope.currentCompany = CompaniesService.getCurrentCompany();
        $scope.parseDate = Date.parse.bind(Date);
        $scope.allUsers = UsersService.getAllUsers();
 
        var preSettupServiceList = [
          {name: 'On site block time service'},
          {name: 'Remote block time service'}
        ];
        $scope.taxes = TaxesService.getAll();
        $scope.numOfIntervals = 1;
        $scope.defaultServices = [];
        $scope.defaultServicesForDropdown = [];

        $scope.blockTimeServices = [];
        $scope.services = [];

        $scope.reInitStartDate = true;
        $scope.reInitEndDate = true;
        $scope.reInitServiceForm = true;

        $scope.ticketSharedUsersList = [];


        $scope.newContractService = {
          name: '',
          rate: null,
          billable: true,
          taxes: [],
          nameValue: ''
        };

        $scope.notAddedBlockTimeServiceError = false;
        $scope.notAddedBlockAdditionalServiceError = false;

        $scope.showAddButtonNewBlockServices = true;
        $scope.showAddButtonNewService = true;

        $scope.showBlockTimeContractCreateMessageError = false;
        $scope.BlockTimeContractCreateMessage = '';

        $scope.showDuplicatesErrorMessage = false;
        $scope.showValidationFailMessage = false;
        $scope.showUniqueServiceNameError = false;

        $scope.showUniqueNameBlockError = false;
        $scope.showUniqueNameServiceError = false;

        $scope.showNewBlockTimeServiceError = false;
        $scope.showNewServiceError = false;
        $scope.newBlockTimeServiceErrorMessage = '';
        $scope.newServiceErrorMessage = '';

        $scope.showCreateHourlyContractValidationError = false;
        $scope.errorMessageCreateHourlyDuplicate = 'The current company has a working hourly agreement for these dates';

        var day = 1000 * 60 * 60 * 24;
        var month = 30 * day;
         
        $rootScope.$on('terminateAndCopy', function (evt, val) {
           
          $scope.action = 'COPY';
           
          var end_date = angular.copy($scope.editContract.endDate);
          var endDateTechCompany = CompaniesService.parseDateTechCompany(end_date); 
          $scope.blockTimeContract.endDate = $filter('date')(endDateTechCompany, 'dd MMM yyyy');//$filter('date')(new Date($scope.serviceContract.endDate), 'dd MMM yyyy');
          $scope.blockTimeContract.endDatePreview = $scope.blockTimeContract.endDate;
           
          $scope.blockTimeContract.startDatePreview = $scope.blockTimeContract.startDate;
          $scope.blockTimeContract.startDate = $filter('date')($scope.editContract.startDate, 'dd MMM yyyy');

          $scope.blockTimeContract.minStartDate = Date.now();
          $timeout(function () {
            chnageNumOFIntervals($scope.blockTimeContract.startDatePreview, $scope.blockTimeContract.endDatePreview, true);
          }, 50);
        });

        if ($scope.editMode) {
          $scope.blockTimeContract = {
            minStartDate: Date.now(),
            includedHours: null,
            blockRate: null,
            interval: "MONTHLY",
            blockTimeServices: preSettupServiceList,
            services: [],
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          if ($scope.isEditContract) {
            var end_date = angular.copy($scope.editContract.endDate);
            $scope.blockTimeContract = angular.copy($scope.editContract);
            var endDateTechCompany = CompaniesService.parseDateTechCompany(end_date); 
            $scope.blockTimeContract.endDate = $filter('date')(endDateTechCompany, 'dd MMM yyyy');//$filter('date')(new Date($scope.serviceContract.endDate), 'dd MMM yyyy');
           // $scope.blockTimeContract.startDatePreview = $scope.blockTimeContract.startDate;
            $scope.blockTimeContract.startDate =  $filter('date')($scope.blockTimeContract.startDate, 'dd MMM yyyy');
         
            $scope.blockTimeContract.minStartDate = Date.now();
            $scope.blockTimeContract.taxes = [];
         //   $scope.blockTimeContract.billForAdditionalService = false;
      
            $scope.blockTimeContract.notifyBlockTimeUsed = $scope.blockTimeContract.shares.length>0;
            $timeout(function () {
              chnageNumOFIntervals($scope.blockTimeContract.startDatePreview, $scope.blockTimeContract.endDatePreview, true);
            }, 50);
  
            if($scope.blockTimeContract.interval == null) {
              $scope.blockTimeContract.interval = $scope.blockTimeContract.customInterval + ' days';
            }
  
  
            AgreementsService.getServiceAgreementById($scope.editContract.id, function(data){
               
              $scope.contractStatus = data.status;
            });
  
            for (var i = 0; i < $scope.blockTimeContract.taxIds.length; i++) {
              for (var j = 0; j < $scope.taxes.length; j++) {
                if ($scope.blockTimeContract.taxIds[i] === $scope.taxes[j].id) {
                  $scope.blockTimeContract.taxes.push($scope.taxes[j]);
                }
              }
            }
            $scope.blockTimeContract.services.forEach(item => {
              item.taxes= [];
              for (var j = 0; j < $scope.taxes.length; j++) {
                item.taxIds.forEach(tax => {
                  if (tax === $scope.taxes[j].id) {
                    item.taxes.push($scope.taxes[j]);
                  }
                })
               
              }
            }
              )
            if($scope.blockTimeContract.services.length > 0) {
              $scope.blockTimeContract.billForAdditionalService = true;
  
            }
            fillNotifyUsersList();
          }
        } else {
          $scope.blockTimeContract = angular.copy($scope.editContract);
          var end_date = angular.copy($scope.editContract.endDate);
          //$scope.blockTimeContract.description = $scope.blockTimeContract.description + ' COPY';
          var endDateTechCompany = CompaniesService.parseDateTechCompany(end_date); 
          $scope.blockTimeContract.endDatePreview = $filter('date')(endDateTechCompany, 'dd MMM yyyy');
          $scope.blockTimeContract.endDate = '';
          $scope.blockTimeContract.startDatePreview = $scope.blockTimeContract.startDate;
          $scope.blockTimeContract.startDate = '';
          $scope.blockTimeContract.numOfIntervalsPreview;
          $scope.blockTimeContract.minStartDate = Date.now();
          $scope.blockTimeContract.taxes = [];
          $scope.blockTimeContract.billForAdditionalService = false;
          $scope.blockTimeContract.notifyBlockTimeUsed = $scope.blockTimeContract.shares.length>0;
          $timeout(function () {
            chnageNumOFIntervals($scope.blockTimeContract.startDatePreview, $scope.blockTimeContract.endDatePreview, true);
          }, 50);

          if($scope.blockTimeContract.interval == null) {
            $scope.blockTimeContract.interval = $scope.blockTimeContract.customInterval + ' days';
          }


          AgreementsService.getServiceAgreementById($scope.editContract.id, function(data){
             
            $scope.contractStatus = data.status;
          });

          for (var i = 0; i < $scope.blockTimeContract.taxIds.length; i++) {
            for (var j = 0; j < $scope.taxes.length; j++) {
              if ($scope.blockTimeContract.taxIds[i] === $scope.taxes[j].id) {
                $scope.blockTimeContract.taxes.push($scope.taxes[j]);
              }
            }
          }
         
         
          if($scope.blockTimeContract.services.length > 0) {
            $scope.blockTimeContract.billForAdditionalService = true;

          }
          fillNotifyUsersList();
           
        }

        if ($scope.blockTimeContract && $scope.blockTimeContract.services) {
          $scope.blockTimeContract.services = $scope.blockTimeContract.services.map(function(service) {
            if (!service.nameValue) {
              service.nameValue = service.name;
            }

            return service;
          })
        }
        $scope.$on("$destroy", function() {
         
      });

        ServicesService.getServicesDataWithoutRealTime($scope, function(resp){
          if(resp) {
            for(var i=0; i<resp.length; i++) {
              var s = {
                name: resp[i].name,
                picked: false,
                taxes: resp[i].taxes,
                rate: resp[i].rate,
                versionedId: resp[i].versionedId,
                commissionRate: resp[i].commissionRate
              };


             
              $scope.defaultServices.push(s);
              $scope.defaultServicesForDropdown.push(s);
            }
            unpickExistingServices()
          }
        });

        function pickService(serviceName) {
          for(var i=0; i<$scope.defaultServicesForDropdown.length; i++) {
            if(getNameAsObject($scope.defaultServicesForDropdown[i].name) === serviceName) {
              $scope.defaultServicesForDropdown.splice(i, 1);
              break;
            }
          }
        }
        function unpickExistingServices() {
          for(var s=0; s<$scope.blockTimeContract.services.length; s++) {
            for(var d=0; d< $scope.defaultServicesForDropdown.length; d++) {
              if(getNameAsObject($scope.defaultServicesForDropdown[d].name) === getNameAsObject($scope.blockTimeContract.services[s].name)) {
                $scope.defaultServicesForDropdown.splice(d, 1);
              }
            }
          }
        }

        function unpickService(serviceName) {
          for(var i=0; i<$scope.defaultServices.length; i++) {
            if(getNameAsObject($scope.defaultServices[i].name) === serviceName) {
              $scope.defaultServicesForDropdown.push($scope.defaultServices[i]);
              break;
            }
          }
        }

        function getNameAsObject(name) {
          if (name.name) return name.name;
          return name;
        }

        $scope.newContractService = {
          name: '',
          rate: 0,
          billable: true,
          taxes: $scope.addDefaultTaxes(),
          nameValue: ''
        };

        if($scope.blockTimeContract.startDate) {
          changeMinEndDate($scope.blockTimeContract.period);
        }
        presettupPeriod();
     
        function presettupPeriod() {
          if($scope.blockTimeContract.interval === 'MONTHLY') {
            $scope.blockTimeContract.period = 'Month';
          } else if($scope.blockTimeContract.interval === 'YEARLY') {
            $scope.blockTimeContract.period = 'Year';
          }  else {
            $scope.blockTimeContract.period = $scope.blockTimeContract.customInterval;
          }
        }

        function fillNotifyUsersList() {
          for(var i=0; i<$scope.blockTimeContract.shares.length; i++) {
            for(var u=0; u<$scope.allUsers.length; u++) {
              if($scope.blockTimeContract.shares[i].userId === $scope.allUsers[u].id ) {
                $scope.ticketSharedUsersList.push({ user: $scope.allUsers[u], notify: true });
              }
            }
          }
        }

        $scope.previewInterval = function() {
          if($scope.blockTimeContract.customInterval) {
            return $scope.blockTimeContract.customInterval + ' days';
          } else {
            return $scope.blockTimeContract.interval;
          }
        };


        $scope.clients = [];
        $scope.getClients = function () {
          var companyId = returnCompanyId();
          $scope.clients = UsersService.getAllByCompanyId(companyId);

        };

        $scope.changeEnableTimeRollover = function () {
          if (!$scope.blockTimeContract.enableTimeRollover)  $scope.blockTimeContract.maxRolloverHours = null;
        }

        $scope.showAdditionalServiceColumn = function() {
          var show = false;
          for(var i=0; i<$scope.blockTimeContract.services.length; i++) {
            if($scope.blockTimeContract.services[i].billable) {
              show = true;
              break;
            }
          }
          return show;
        };

        $scope.changeStartDate = function() {
           
          var intervals = parseInt($scope.numOfIntervals);
          changeMinEndDate($scope.blockTimeContract.period, intervals);
        };


        function changeMinEndDate(period, numOfIntervals) {
          var date = $scope.blockTimeContract.startDate;
          var minEndDate = new Date(date);
          switch(period) {
            case('Month'):
              minEndDate = Utils.addNumberOfMonth(minEndDate, 1);
              break;
            case('Year'):
              minEndDate = Utils.addNumberOfMonth(minEndDate, 12);
              break;
            default:
              minEndDate = Utils.calculateDateWithTimeZoneAndPeriod(minEndDate, period);
          }
          minEndDate = Utils.minusDays(minEndDate, 1);
          $scope.blockTimeContract.minEndDate = $filter('date')(minEndDate, 'dd MMM yyyy');
           
          reInitEndDate();

          $timeout(function () {
            changeEndDate(period, numOfIntervals);
          }, 50);
        }

        function changeEndDate(period, numOfIntervals) {
          if(numOfIntervals) {
            var date = $scope.blockTimeContract.startDate;
            var endDate = new Date(date);
            switch(period) {
              case('Month'):
               
                endDate = Utils.addNumberOfMonth(endDate, 1*numOfIntervals);
                break;
              case('Year'):
                endDate = Utils.addNumberOfMonth(endDate, 12*numOfIntervals);
                break;
              default:
                endDate = Utils.calculateDateWithTimeZoneAndPeriod(endDate, period, numOfIntervals);
            }
            endDate = Utils.minusDays(endDate, 1);
            $scope.blockTimeContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          }

        }



        $scope.$watch(function() {
          return $scope.blockTimeContract.endDate;
        }, function(oldEndDate) {
          chnageNumOFIntervals($scope.blockTimeContract.startDate, oldEndDate);
        });


   

        function chnageNumOFIntervals(startDatee, endDatee, ifForIntervals) {
          if(startDatee && endDatee) {
            var startDate = new Date(startDatee);
            var endDate = new Date(endDatee);
             
            var interval = 1 ;
            switch($scope.blockTimeContract.period) {
              case('Month'):
                for(var i=1; i<10000; i++) {
                  var s = startDate;
                  s = Utils.addNumberOfMonth(startDate, i);
                  s = Utils.minusDays(s, 1);
                  if(s.getTime() == endDate.getTime()) {
                    interval = i;
                    break;
                  }
                }
                break;
              case('Year'):
                for(var y=1; y<10000; y++) {
                  var sd = startDate;
                  sd = Utils.addNumberOfMonth(startDate, 12*y);
                  sd = Utils.minusDays(sd, 1);
                  if(sd.getTime() == endDate.getTime()) {
                    interval = y;
                    break;
                  }
                }
                break;
              default:
                for(var d=1; d<10000; d++) {
                  startDate.setHours(0, 0, 0, 0);
                  startDate.setSeconds(0);
                  startDate.setMilliseconds(0);
                  var sd = startDate;
                  sd = Utils.calculateDateWithTimeZoneAndPeriod(sd, $scope.blockTimeContract.period, 1);
                  sd = Utils.minusDays(sd, 1);
                  var nt = sd;
                  nt.setHours(0, 0, 0, 0);
                  nt.setSeconds(0);
                  nt.setMilliseconds(0);
                  if(nt.getTime() == endDate.getTime()) {
                    interval = d;
                    break;
                  }
                }
            }
             
            if(ifForIntervals) {
              $scope.blockTimeContract.numOfIntervalsPreview = interval
            } else {
              $scope.numOfIntervals = interval;
            }
          }
        }
$scope.onChangeService = function (data) {
 
}
        $scope.changeEndDateByNumToGenerate = function() {
          var intervals = parseInt($scope.numOfIntervals);
          changeEndDate($scope.blockTimeContract.period, intervals);
        };

        function reInitStartDate() {
          $scope.reInitStartDate = false;
          $timeout(function () {
            $scope.reInitStartDate = true;
          }, 0);
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
          var newMinStartDate;
          var now = Date.now();
          var n = new Date(now);
          if (interval === 'MONTHLY') {
            $scope.blockTimeContract.period = 'Month';
            $scope.blockTimeContract.interval = 'MONTHLY';
            $scope.blockTimeContract.customInterval = null;
            n.setMonth(n.getMonth() - 1);
            newMinStartDate = n.getTime() + day;

          } else if (interval === 'YEARLY') {
            $scope.blockTimeContract.period = 'Year';
            $scope.blockTimeContract.interval = 'YEARLY';
            $scope.blockTimeContract.customInterval = null;
            n.setFullYear(n.getFullYear() - 1);
            newMinStartDate = n.getTime() + day;

          } else if (interval === '30 days') {
            $scope.blockTimeContract.period = 30;
            $scope.blockTimeContract.customInterval = 30;
            newMinStartDate = now - (29*day);

          } else if (interval === '15 days') {
            $scope.blockTimeContract.period = 15;
            $scope.blockTimeContract.customInterval = 15;
            newMinStartDate = now - (14*day);

          } else if (interval === '7 days') {
            $scope.blockTimeContract.period = 7;
            $scope.blockTimeContract.customInterval = 7;
            newMinStartDate = now - (6*day);

          } else if(interval === '1 day') {
            $scope.blockTimeContract.period = 1;
            $scope.blockTimeContract.customInterval = 1;
          }
          $scope.blockTimeContract.minStartDate = newMinStartDate;
          
          $scope.changeStartDate();
          reInitStartDate();
         
        });

        $scope.$watch(function () {
          return $scope.blockTimeContract.startDate;
        }, function () {
          $scope.changeStartDate()
        });



        $scope.calculateTotalAmount = function () {
          var sum = null;
          if ($scope.blockTimeContract.includedHours && $scope.blockTimeContract.blockRate) {
            sum =  $scope.blockTimeContract.includedHours * $scope.blockTimeContract.blockRate;
          } else {
            sum =  null;
          }
          return sum;
        };

        $scope.returnTotal = function() {
          if($scope.blockTimeContract.total && $scope.blockTimeContract.total !== null) {
            return $scope.blockTimeContract.total;
          } else {
            return 0;
          }
        };


        function checkUniqueServiceName(serviceList, service) {
          if (serviceList && service) {
            var unique = true;
            for (var i = 0; i < serviceList.length; i++) {
              if (getNameAsObject(serviceList[i].name) === service.name) {
                unique = false;
                break;
              }
            }
            return unique;
          } else {
            return true;
          }
        }


        $scope.isNameUnique = function (service, isBlockTimeService) {
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
            var unBlockTimeServ = checkUniqueServiceName($scope.blockTimeContract.blockTimeServices, name);
            var unContractServ = checkUniqueServiceName($scope.blockTimeContract.services, name);
            var check =  unBlockTimeServ && unContractServ;

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


        $scope.$watch(function() {
          return $scope.blockTimeContract.services
        }, function(val) {
         


          for (var i = 0; i < val.length; i++) {
            var serv = val[i];

            if (typeof serv.name === 'object') {
              serv = Object.assign({}, serv);

            

              var ns = {
                name: serv.nameValue,
                rate: serv.name.rate,
                billable: true,
                taxes: serv.name.taxes,
                nameValue: serv.nameValue,
                basedOnDefault: true
              };

             

              (function() {
                var id = i;
                
                var serv = ns;

                validateNewServiceName(serv.nameValue).then(function (resp) {
                  if (resp) {
                    
                    $scope.blockTimeContract.services.splice(id, 1, ns);
                  }
                }, function() {
                  showErrorNewServiceContractValidation();

                })
              }())


            }
          }
        }, true)

        $scope.getUserById = function (userId) {
          return UsersService.getOneById(userId);
        };

        $scope.showNewBlockTimeServiceValidationError = false;
        function showErrorNewBlockTimeServiceValidation() {
          $scope.showNewBlockTimeServiceValidationError = true;
          $timeout(function () {
            $scope.showNewBlockTimeServiceValidationError = false;
          }, 4000);
        }

        $scope.addNewBlockTimeService = function (form, service) {
          $scope.showNewBlockTimeServiceError = false;
          $scope.showAddButtonNewBlockServices = false;
          if (form.$valid) {
            if (!service.name) {
              $scope.showNewBlockTimeServiceError = true;
              $scope.newBlockTimeServiceErrorMessage = 'Please enter the service name';
              $scope.showAddButtonNewBlockServices = true;
            } else {
              if (!$scope.blockTimeContract.startDate || !$scope.blockTimeContract.endDate) {
                $scope.showNewBlockTimeServiceError = true;
                $scope.newBlockTimeServiceErrorMessage = 'Please enter start and end date to check service name';
                $scope.showAddButtonNewBlockServices = true;
              } else {
                validateNewServiceName(getNameAsObject(service.name), 'block').then(function (resp) {
                  $scope.showAddButtonNewBlockServices = true;
                  if (resp) {
                    if (service.name.name && service.name.name.length) {
                      var ns = {
                        name: service.name.name
                      };
                      $scope.blockTimeContract.blockTimeServices.push(ns);
                      $scope.newBlockTimeService = {};
                    } else {

                      $scope.blockTimeContract.blockTimeServices.push(service);
                      $scope.newBlockTimeService = {};
                    }
                  }
                }, function() {
                  $scope.showAddButtonNewBlockServices = true;
                  showErrorNewBlockTimeServiceValidation();
                })
              }
            }


          } else {
            $scope.showAddButtonNewBlockServices = true;
            if (!service || service == undefined) {
              $scope.showNewBlockTimeServiceError = true;
              $scope.newBlockTimeServiceErrorMessage = 'Please enter the service name';
            }
          }
        };

        $scope.deleteBlockTimeService = function (blockTimeService) {
          for (var i = 0; i < $scope.blockTimeContract.blockTimeServices.length; i++) {
            if ($scope.blockTimeContract.blockTimeServices[i].name === blockTimeService.name) {
              $scope.blockTimeContract.blockTimeServices.splice(i, 1);
            }
          }
        };

        $scope.showNewContractServiceValidationError = false;
        function showErrorNewServiceContractValidation() {
          $scope.showNewContractServiceValidationError = true;
          $timeout(function () {
            $scope.showNewContractServiceValidationError = false;
          }, 4000);
        }

       
        function showNewServiceNameError() {
          $scope.showNewServiceError = true;
          $timeout(function () {
            $scope.showNewServiceError = false;
          }, 4000);
        }

        $scope.addContractService = function (form, service) {
          $scope.showAddButtonNewService = false;
          if (form.$valid) {
            if (!service.name.name) {
              showNewServiceNameError();
              $scope.showAddButtonNewService = true;
            } else {
              if (!$scope.blockTimeContract.startDate || !$scope.blockTimeContract.endDate) {
                showNewServiceNameError();
                $scope.newServiceErrorMessage = 'Please enter start and end date to check service name';
                $scope.showAddButtonNewService = true;
              } else {
                validateNewServiceName(service.name.name, 'service').then(function (resp) {
                  if (resp) {

                      var ns = {
                        name: service.name.name,
                        rate: service.name.rate,
                        billable: service.billable,
                        taxes: service.taxes,
                        nameValue: service.name.name,
                        id: service.name.versionedId,
                        commissionRate: service.name.commissionRate

                      };




                      $scope.blockTimeContract.services.push(ns);
                      $scope.newContractService = {
                        name: '',
                        rate: 0,
                        billable: true,
                        taxes: $scope.addDefaultTaxes(),
                        nameValue: ''
                      };
                      pickService(service.name.name);
                      $scope.showAddButtonNewService = true;
                      reInitServiceForm()

                  }
                }, function() {
                  $scope.showAddButtonNewService = true;
                  showErrorNewServiceContractValidation();
                })
              }
            }
          } else {
            $scope.showAddButtonNewService = true;
          }
        };



        $scope.deleteContractService = function (contractService) {
          for (var i = 0; i < $scope.blockTimeContract.services.length; i++) {
            if ($scope.blockTimeContract.services[i].name === contractService.name) {
              $scope.blockTimeContract.services.splice(i, 1);
              unpickService(contractService.name)
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

        $scope.showBlockFieldsError = false;

        function checkForInvalidFields() {
          if (!$scope.blockTimeContract.description ||
            !$scope.blockTimeContract.startDate ||
            !$scope.blockTimeContract.endDate ||
            !$scope.blockTimeContract.rateExceeding ||
            !$scope.blockTimeContract.blockTimeServices.length > 0 ||
            !$scope.blockTimeContract.includedHours ||
            !$scope.blockTimeContract.blockRate ||
            !checkBlockTimeContractServicesNameLengths() ||
            !(($scope.blockTimeContract.enableTimeRollover && $scope.blockTimeContract.maxRolloverHours) || (!$scope.blockTimeContract.enableTimeRollover && !$scope.blockTimeContract.maxRolloverHours))) {
            $scope.showBlockFieldsError = true;
            return true
          } else {
            $scope.showBlockFieldsError = false;
            return false;
          }
        }

        $scope.isShowingErrorsBlock = function (form, fieldName) {
          return form && form[fieldName] && (form[fieldName].$dirty || $scope.showBlockFieldsError) && !form[fieldName].$valid;
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

        $scope.returnCompanyId = returnCompanyId();

        function returnCompanyId() {
          var id;
         
          if ($scope.blockTimeContract.companyId) {
            id = $scope.blockTimeContract.companyId;
          } else if ($scope.contractCompany && $scope.contractCompany.id) {
            id = $scope.contractCompany.id
          } else {
            id = $scope.companyId;
          }
          if (id.id) {
            return id.id;
          }
          return id;
        }

        function showDuplicatesErrorMessageTimeout() {
          $scope.showDuplicatesErrorMessage = true;
          $timeout(function () {
            $scope.showDuplicatesErrorMessage = false;
          }, 4000);
        }
        function checkForDuplicateServiceNames(serviceList) {
          var deferred = $q.defer();
          var startDate = $filter('date')($scope.blockTimeContract.startDate, 'dd MMM yyyy');
          var endDate = $filter('date')($scope.blockTimeContract.endDate, 'dd MMM yyyy');

          var companyId = returnCompanyId();
          var serviceNamesList = [];
          for (var i = 0; i < serviceList.length; i++) {
            serviceNamesList.push(getNameAsObject(serviceList[i].name));
          }

          ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, serviceNamesList,($scope.isEditContract) ?  $scope.blockTimeContract.id : null, function (resp) {
            if (Object.keys(resp).length === 0) {
              deferred.resolve(resp);
            } else {
              showDuplicatesErrorMessageTimeout()
              deferred.reject();
            }
          });
          return deferred.promise;
        }

        function validateNewServiceName(newService, serviceType) {

          var deferred = $q.defer();
          if (newService ) {
            $scope.showNewBlockTimeServiceError = false;
            $scope.showNewServiceError = false;

            var companyId = returnCompanyId();
            var name = [];
            name.push(getNameAsObject(newService));

            var startDate = $filter('date')($scope.blockTimeContract.startDate, 'yyyy/MM/dd');
            var endDate = $filter('date')($scope.blockTimeContract.endDate, 'yyyy/MM/dd');
            ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, name,($scope.isEditContract) ?  $scope.blockTimeContract.id : null, function (resp) {
              if (Object.keys(resp).length === 0) {
                deferred.resolve(resp);
              } else {
                deferred.reject();
                if (serviceType === 'block') {
                  $scope.showNewBlockTimeServiceError = true;
                  $scope.newBlockTimeServiceErrorMessage = 'Service name is duplicate';
                }
               
              }
            });
          }
          return deferred.promise;
        }



        $scope.showNotAddedBlockTimeServiceError = function(service) {
          if(service) {
            return (service.name && service.name.length && $scope.notAddedBlockTimeServiceError)
          }
        };
        $scope.showNotAddedBlockAdditionalServiceError = function(service) {
          if($scope.blockTimeContract.billForAdditionalService && service) {
            return (service.name && service.name.name && service.name.name.length && $scope.notAddedBlockAdditionalServiceError)
          }
        };

        $scope.refreshNotAddedError = function(serviceType) {
          switch(serviceType) {
            case 'blockTime':
              $scope.notAddedBlockTimeServiceError = false;
              break;
            case 'additional':
              $scope.notAddedBlockAdditionalServiceError = false;
              break;
            default:
             
          }
        };
        function activateNotAddedServiceErrors() {
          $scope.notAddedBlockTimeServiceError = true;
          if($scope.blockTimeContract.billForAdditionalService) {
            $scope.notAddedBlockAdditionalServiceError = true;
          }
        }

        function updateBlockTimeContract(contractData) {
           
        
          if (contractData) {

            var blockContract = {
              id: contractData.id,
              description: contractData.description,
              type: 'BLOCK_TIME',
              includedHours: contractData.includedHours,
              companyId: returnCompanyId(),
              customInterval: contractData.customInterval,
              billType: null,
             
              totalHours: contractData.totalHours,
              blockRate: contractData.blockRate,
              rateExceeding: contractData.rateExceeding,
              companyId: returnCompanyId(),
              services: [],
              blockTimeServices: [],
              enableTimeRollover: contractData.enableTimeRollover || false,
              maxRolloverHours: !(contractData.enableTimeRollover || false) ? null : contractData.maxRolloverHours,
              shares: [],
              taxIds: []
            };
            
            if($scope.blockTimeContract.interval === 'MONTHLY' || $scope.blockTimeContract.interval === 'YEARLY') {
              blockContract.interval = contractData.interval;
            } else {
              blockContract.interval = null;
            }

            var sd = new Date(contractData.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            blockContract.startDate = $filter('date')(sd, 'yyyy/MM/dd');

            var ed = new Date(contractData.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            blockContract.endDate = $filter('date')(ed, 'yyyy/MM/dd');

            for (var i = 0; i < $scope.blockTimeContract.blockTimeServices.length; i++) {
              var bs = {
                name: $scope.blockTimeContract.blockTimeServices[i].name.name || $scope.blockTimeContract.blockTimeServices[i].name,
                rate: $scope.blockTimeContract.blockTimeServices[i].rate || 0,
                id: ($scope.blockTimeContract.blockTimeServices[i].id) ? $scope.blockTimeContract.blockTimeServices[i].id : uuidv4(),
                
                billable: $scope.blockTimeContract.blockTimeServices[i].billable,
                basedOnDefault: $scope.blockTimeContract.blockTimeServices[i].basedOnDefault,
                commissionRate: $scope.blockTimeContract.blockTimeServices[i].commissionRate,
                taxIds: $scope.blockTimeContract.blockTimeServices[i].taxIds,
              };
              blockContract.blockTimeServices.push(bs);
            }

            if ($scope.blockTimeContract.billForAdditionalService) {
              for (var m = 0; m < $scope.blockTimeContract.services.length; m++) {
                var cs = {
                  name: $scope.blockTimeContract.services[m].name.name || $scope.blockTimeContract.services[m].nameValue || $scope.blockTimeContract.services[m].name,
                  billable: $scope.blockTimeContract.services[m].billable,
                  taxIds: [],
                  rate: 0,
                  basedOnDefault: true,
                  id: (typeof $scope.blockTimeContract.services[m].id === 'string') ? $scope.blockTimeContract.services[m].id : $scope.blockTimeContract.services[m].id.id,
                  commissionRate: $scope.blockTimeContract.services[m].commissionRate
                };
  
                if($scope.blockTimeContract.services[m].billable) {
                  cs.rate = +$scope.blockTimeContract.services[m].name.rate || +$scope.blockTimeContract.services[m].rate
                  if ($scope.blockTimeContract.services[m].taxes.length) {
                    for (var n = 0; n < $scope.blockTimeContract.services[m].taxes.length; n++) {
                      cs.taxIds.push($scope.blockTimeContract.services[m].taxes[n].id)
                    }
                  }
                }
  
                blockContract.services.push(cs);
              }
            }
          

            for (var u = 0; u < $scope.ticketSharedUsersList.length; u++) {
              if ($scope.ticketSharedUsersList[u].notify) {
                var user = {
                  userId: $scope.ticketSharedUsersList[u].user.id,
                  date: null,
                  itemOrder: 0,
                
                };
              
                blockContract.shares.push(user)
              }
            }
            if ($scope.blockTimeContract.taxes && $scope.blockTimeContract.taxes.length) {
              for (var r = 0; r < $scope.blockTimeContract.taxes.length; r++) {
                blockContract.taxIds.push($scope.blockTimeContract.taxes[r].id);
              }
            }

         
            sendContractCreateRequest(blockContract)
          }
          function askCreateBillableItemNow(blockContract) {
            var answer = false;
            var confirmMessage = 'Do we need to create the billable item now? ';
            var confirmButton = 'Yes, update';
            UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not update').then(function(){
              answer = true;
              sendContractCreateRequest(blockContract, true);
            }, function() {
              sendContractCreateRequest(blockContract, false)
            })
          }
          function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });
          }
          function sendContractCreateRequest(blockContract) {
            AgreementsService.updateContract(blockContract, function (resp) {
              if (resp.message === 'Validation failed') {
                $scope.showValidationFailMessage = true;
                $scope.BlockTimeContractCreateMessage = 'Something went wrong, please try again later and contact administrator';
              } else {
                $scope.closeModal();
              }
            })
          }
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
            if($scope.blockTimeContract.interval === 'MONTHLY' || $scope.blockTimeContract.interval === 'YEARLY') {
              blockContract.interval = contractData.interval;
            } else {
              blockContract.interval = null;
            }

            var sd = new Date(contractData.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            blockContract.startDate = $filter('date')(sd, 'yyyy/MM/dd');

            var ed = new Date(contractData.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            blockContract.endDate = $filter('date')(ed, 'yyyy/MM/dd');

            for (var i = 0; i < $scope.blockTimeContract.blockTimeServices.length; i++) {
              var bs = {
                name: $scope.blockTimeContract.blockTimeServices[i].name.name || $scope.blockTimeContract.blockTimeServices[i].name,
                rate: contractData.rateExceeding
              };
              blockContract.blockTimeServices.push(bs);
            }

            for (var m = 0; m < $scope.blockTimeContract.services.length; m++) {
              var cs = {
                name: $scope.blockTimeContract.services[m].name.name || $scope.blockTimeContract.services[m].nameValue || $scope.blockTimeContract.services[m].name,
                billable: $scope.blockTimeContract.services[m].billable,
                taxIds: [],
                rate: 0,
                basedOnDefault: true,
                id: $scope.blockTimeContract.services[m].id.id,
                commissionRate: $scope.blockTimeContract.services[m].commissionRate
              };

              if($scope.blockTimeContract.services[m].billable) {
                cs.rate = +$scope.blockTimeContract.services[m].name.rate || +$scope.blockTimeContract.services[m].rate
                if ($scope.blockTimeContract.services[m].taxes.length) {
                  for (var n = 0; n < $scope.blockTimeContract.services[m].taxes.length; n++) {
                    cs.taxIds.push($scope.blockTimeContract.services[m].taxes[n].id)
                  }
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

            if(Utils.compareDateNowWithDate(blockContract.startDate)) {
              askCreateBillableItemNow(blockContract)
            } else{
              sendContractCreateRequest(blockContract, false)
            }
          }
          function askCreateBillableItemNow(blockContract) {
            var answer = false;
            var confirmMessage = 'Do we need to create the billable item now? ';
            var confirmButton = 'Yes, create';
            UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function(){
              answer = true;
              sendContractCreateRequest(blockContract, true);
            }, function() {
              sendContractCreateRequest(blockContract, false)
            })
          }

          function sendContractCreateRequest(blockContract, createBillableItem) {
            AgreementsService.createContract(blockContract, createBillableItem, function (resp) {
              if (resp.message === 'Validation failed') {
                $scope.showValidationFailMessage = true;
                $scope.BlockTimeContractCreateMessage = 'Something went wrong, please try again later and contact administrator';
              } else {
                $scope.closeModal();
              }
            })
          }
        }
        $scope.copy = function () {
          $scope.closeModal();
            
            
          $rootScope.$broadcast('copyContract', $scope.editContract);
        }
        $scope.validateAndUpdateBlockTimeContract = function (blockTimeContract, newBlockTimeService, newService) {
           
          if(!checkForInvalidFields()) {
             
            var emptyServices = true;
            if ((newBlockTimeService && newBlockTimeService.name && newBlockTimeService.name.length) || (newService && newService.name && newService.name.name.length)) {
              activateNotAddedServiceErrors();
              emptyServices = false;
              var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
              var confirmButton = 'Yes, create';
              UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function () {
                emptyServices = true;
                validateAndUpdate(blockTimeContract);
              });
            } else {
              validateAndUpdate(blockTimeContract);
            }
          }


          function validateAndUpdate(blockTimeContract) {
            checkForDuplicateServiceNames(blockTimeContract.blockTimeServices).then(function (resp) {
              if (resp) {
                if (blockTimeContract.services && blockTimeContract.services.length) {
                  checkForDuplicateServiceNames(blockTimeContract.services).then(function (resp) {
                    if (resp) {
                      updateBlockTimeContract(blockTimeContract)
                    }
                  })
                } else {
                  updateBlockTimeContract(blockTimeContract)
                }

              }
            })
       
          }

        };
       
        $scope.validateAndCreteBlockTimeContract = function (blockTimeContract, newBlockTimeService, newService) {
          if(!checkForInvalidFields()) {
            var emptyServices = true;
            if ((newBlockTimeService && newBlockTimeService.name && newBlockTimeService.name.length) || (newService && newService.name && newService.name.name.length)) {
              activateNotAddedServiceErrors();
              emptyServices = false;
              var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
              var confirmButton = 'Yes, create';
              UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function () {
                emptyServices = true;
                validateAndCreate(blockTimeContract);
              });
            } else {
              validateAndCreate(blockTimeContract);
            }
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

        };

        $scope.terminateAndCopyBlockTime = function () {
          $scope.terminateAndCopy();
        };

      }])

}());
