'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      'ProductsService', '$filter', '$timeout', 'TaxesService', '$q',
      'quicktech.common.services.UserConfirmationsService', 'Utils','$rootScope',
      function ($scope, AgreementsService, CompaniesService, ServicesService,
                ProductsService, $filter, $timeout, TaxesService, $q, UserConfirmationsService, Utils,$rootScope) {
console.log('ffffffffffffffffffffff');
console.log('action',$scope.action);
        $scope.intervals = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
        $scope.serviceContractType = {
          DEVICE: 'By Device',
          USER: 'By Users',
      //    OTHER: 'Other'
        };
        $scope.currentCompany = CompaniesService.getCurrentCompany();
        $scope.defaultServicesAdditional = [];
        $scope.defaultServicesAdditionalForDropDown = [];

        $scope.numOfIntervals = 1;

        $scope.taxes = TaxesService.getAll();

        $scope.dissableCreateButton = false;
        $scope.showAddButtonNewService = true;
        $scope.showAddButtonNewSCSTT = true;

        $scope.reInitStartDate = true;
        $scope.reInitEndDate = true;
        $scope.reInitServiceContractServicesForm = true;
        $scope.reInitServiceForm = true;
        $scope.reInitPrpductsExpenseNameField = false;
        $scope.reInitNewServiceExpenseForm = true;

        $scope.showRequiredFieldError = false;
        $scope.showServiceLengthCheckError = false;

        $scope.showRequiredFieldErrorSCS = false;
        $scope.showRequiredFieldErrorService = false;
        $scope.showRequiredFieldErrorServiceExpense = false;
        $scope.showRequiredFieldErrorSCSTT = false;

        $scope.notAddedAdditionalServiceError = false;
        $scope.notAddedSCSError = false;
        $scope.notAddedSCSTTError = false;
        $scope.notAddedServiceExpenseError = false;
        $scope.notAddedProductExpenseError = false;

        $scope.showNewSCSTTValidationError = false;
        $scope.showNewServiceContractServiceValidationError = false;
        $scope.showNewServiceValidationError = false;
        $scope.showServiceExpenseError = false;
        $scope.showProductExpenseError = false;
        $scope.showValidationFailMessage = false;
        $scope.validationServiceError = 'There are existing service name on another contract with the same dates. Please change service name or dates';
        $scope.createValidationFailedMessage = 'Something went wrong, please try again later and contact administrator';

        $scope.defaultServices = [];
        $scope.defaultProducts = [];

        $scope.openedTab = 'product';

        $rootScope.$on('terminateAndCopy', function (evt, val) {
          console.log('terminateAndCopy');
          $scope.action = 'COPY';
          console.log('$scope.terminateAndCopy', $scope.serviceContract);
          var end_date = angular.copy($scope.editContract.endDate);
          $scope.serviceContract.endDate = $filter('date')(new Date(end_date - $scope.currentCompany.addresses[0].timeZone.timeOffset), 'dd MMM yyyy');//$filter('date')(new Date($scope.serviceContract.endDate), 'dd MMM yyyy');
          $scope.serviceContract.endDatePreview = $scope.serviceContract.endDate;
          console.log('$scope.serviceContract.endDate',$scope.serviceContract.endDate);
          $scope.serviceContract.startDatePreview = $scope.serviceContract.startDate;
          $scope.serviceContract.startDate = $filter('date')($scope.editContract.startDate, 'dd MMM yyyy');
         
          $scope.serviceContract.minStartDate = Date.now();
          $timeout(function () {
            changeNumOfIntervals($scope.serviceContract.startDate, $scope.serviceContract.endDate, false);
          }, 500);
        });

        var day = 1000 * 60 * 60 * 24;
        var month = 30 * day;

        $scope.totsl = 0;
        $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);


        if ($scope.editMode) {
          console.log('-----------------');
          $scope.serviceContract = {
            billType: null,
            minStartDate: Date.now(),
            isAdditionalServices: false,
            includedHours: null,
            blockRate: null,
            interval: "MONTHLY",
            serviceContractServices: [],
            services: [],
            serviceExpenses: [],
            productExpenses: [],
            serviceContractServicesToTrack: [],
            taxes: $scope.addDefaultTaxes(),
            taxIds: []
          };
          $scope.reInitPrpductsExpenseNameField = true;
          preCreateFirstServicesEntities();
          createDefaultServices();
          createDefaultServiceContractServicesToTrack();
          console.log('$scope.serviceContract.serviceExpenses',$scope.serviceContract.serviceExpenses);
         console.log('editContract',$scope.editContract);
          if ($scope.isEditContract) {
            var end_date = angular.copy($scope.editContract.endDate);
          $scope.serviceContract = angular.copy($scope.editContract);
          $scope.reInitPrpductsExpenseNameField = false;
        
          $scope.serviceContract.endDate = $filter('date')(new Date(end_date - $scope.currentCompany.addresses[0].timeZone.timeOffset), 'dd MMM yyyy');//$filter('date')(new Date($scope.serviceContract.endDate), 'dd MMM yyyy');
          $scope.serviceContract.endDatePreview = $scope.serviceContract.endDate;
          console.log('$scope.serviceContract.endDate',$scope.serviceContract.endDate);
          $scope.serviceContract.startDatePreview = $scope.serviceContract.startDate;
          $scope.serviceContract.startDate = $filter('date')($scope.editContract.startDate, 'dd MMM yyyy');
          $scope.serviceContract.numOfIntervalsPreview;
          $scope.serviceContract.isAdditionalServices = $scope.serviceContract.services.length > 0;
          $scope.serviceContract.minStartDate = Date.now();
          $timeout(function () {
            changeNumOfIntervals($scope.serviceContract.startDate, $scope.serviceContract.endDate, false);
          }, 500);
          if($scope.serviceContract.blockTimeServices.length > 0) {
            $scope.serviceContract.contractWithBlockTime = true;
            $scope.serviceContract.serviceContractServicesToTrack = $scope.serviceContract.blockTimeServices
          }

          AgreementsService.getServiceAgreementById($scope.editContract.id, function(data){
            $scope.contractStatus = data.status;
          });

          if($scope.serviceContract.interval === null) {
            $scope.serviceContract.interval = $scope.serviceContract.customInterval + ' days';
          }

          if($scope.serviceContract.taxIds && $scope.serviceContract.taxIds.length > 0) {
            $scope.serviceContract.taxes = [];
            for (var i = 0; i < $scope.serviceContract.taxIds.length; i++) {
              for (var j = 0; j < $scope.taxes.length; j++) {
                if ($scope.serviceContract.taxIds[i] === $scope.taxes[j].id) {
                  $scope.serviceContract.taxes.push($scope.taxes[j]);
                }
              }
            }
          }

          for (var i = 0; i < $scope.serviceContract.serviceContractServices.length; i++) {
            $scope.serviceContract.serviceContractServices[i].taxes = [];
            if ($scope.serviceContract.serviceContractServices[i].taxIds.length > 0) {
              for (var j = 0; j < $scope.serviceContract.serviceContractServices[i].taxIds.length; j++) {
                for (var n = 0; n < $scope.taxes.length; n++) {
                  if ($scope.serviceContract.serviceContractServices[i].taxIds[j] === $scope.taxes[n].id) {
                    $scope.serviceContract.serviceContractServices[i].taxes.push($scope.taxes[n]);
                    break;
                  }
                }
              }
            }
          }

          for (var i = 0; i < $scope.serviceContract.services.length; i++) {
            $scope.serviceContract.services[i].taxes = [];
            if ($scope.serviceContract.services[i].taxIds.length > 0) {
              for (var j = 0; j < $scope.serviceContract.services[i].taxIds.length; j++) {
                for (var n = 0; n < $scope.taxes.length; n++) {
                  if ($scope.serviceContract.services[i].taxIds[j] === $scope.taxes[n].id) {
                    $scope.serviceContract.services[i].taxes.push($scope.taxes[n]);
                    break;
                  }
                }
              }
            }
          }

      /*    for(var g=0; g<$scope.serviceContract.serviceExpenses.length; g++) {
            $scope.serviceContract.serviceExpenses[g].quantity = $scope.serviceContract.serviceExpenses[g].quantity * 60;
          }
*/
          ProductsService.getFullListForAutocomplete($scope, function(resp) {
            console.log('ggggggggggggggggggg');
            var productsData = resp;
            if($scope.serviceContract.productExpenses.length>0) {
              for(var p=0; p<$scope.serviceContract.productExpenses.length; p++) {
                for(var w=0; w<productsData.length; w++) {
                  for(var v=0; v<productsData[w].products.length; v++) {
                    if(productsData[w].products[v].versionedId.id ===  $scope.serviceContract.productExpenses[p].productId) {
                      $scope.serviceContract.productExpenses[p].name = {};
                      $scope.serviceContract.productExpenses[p].name.description = productsData[w].products[v].description;
                      // $scope.serviceContract.productExpenses[p].name.name = productsData[w].products[v].description;
                      $scope.serviceContract.productExpenses[p].name.sale = productsData[w].products[v].sale;
                      break;
                    }
                  }
                }
              }
            }
            $scope.reInitPrpductsExpenseNameField = true;
          });

          $scope.total = $scope.serviceContract.amount;
          preCreateFirstServicesEntities();
          console.log(' $scope.serviceContract', $scope.serviceContract);
          console.log('serviceContractType',$scope.serviceContractType);
          console.log('serviceContractType[serviceContract.billType],',$scope.serviceContractType[$scope.serviceContract.billType]);
          }
        } else {
          console.log('+++++++++++++++++++++++++++++');
          var end_date = angular.copy($scope.editContract.endDate);
          $scope.serviceContract = angular.copy($scope.editContract);
          $scope.reInitPrpductsExpenseNameField = false;
          $scope.serviceContract.endDatePreview = $filter('date')(end_date -$scope.currentCompany.addresses[0].timeZone.timeOffset , 'dd MMM yyyy');
          console.log('$scope.serviceContract.endDate',$scope.serviceContract.endDate);
          $scope.serviceContract.endDate = '';
          $scope.serviceContract.startDatePreview = $scope.serviceContract.startDate;
          $scope.serviceContract.startDate = '';
          $scope.serviceContract.numOfIntervalsPreview;
          $scope.serviceContract.isAdditionalServices = $scope.serviceContract.services.length > 0;
          $scope.serviceContract.minStartDate = Date.now();
          $timeout(function () {
            changeNumOfIntervals($scope.serviceContract.startDatePreview, $scope.serviceContract.endDatePreview, true);
          }, 500);
          if($scope.serviceContract.blockTimeServices.length > 0) {
            $scope.serviceContract.contractWithBlockTime = true;
            $scope.serviceContract.serviceContractServicesToTrack = $scope.serviceContract.blockTimeServices
          }

          AgreementsService.getServiceAgreementById($scope.editContract.id, function(data){
            $scope.contractStatus = data.status;
          });

          if($scope.serviceContract.interval === null) {
            $scope.serviceContract.interval = $scope.serviceContract.customInterval + ' days';
          }

          if($scope.serviceContract.taxIds && $scope.serviceContract.taxIds.length > 0) {
            $scope.serviceContract.taxes = [];
            for (var i = 0; i < $scope.serviceContract.taxIds.length; i++) {
              for (var j = 0; j < $scope.taxes.length; j++) {
                if ($scope.serviceContract.taxIds[i] === $scope.taxes[j].id) {
                  $scope.serviceContract.taxes.push($scope.taxes[j]);
                }
              }
            }
          }

          for (var i = 0; i < $scope.serviceContract.serviceContractServices.length; i++) {
            $scope.serviceContract.serviceContractServices[i].taxes = [];
            if ($scope.serviceContract.serviceContractServices[i].taxIds.length > 0) {
              for (var j = 0; j < $scope.serviceContract.serviceContractServices[i].taxIds.length; j++) {
                for (var n = 0; n < $scope.taxes.length; n++) {
                  if ($scope.serviceContract.serviceContractServices[i].taxIds[j] === $scope.taxes[n].id) {
                    $scope.serviceContract.serviceContractServices[i].taxes.push($scope.taxes[n]);
                    break;
                  }
                }
              }
            }
          }

          for (var i = 0; i < $scope.serviceContract.services.length; i++) {
            $scope.serviceContract.services[i].taxes = [];
            if ($scope.serviceContract.services[i].taxIds.length > 0) {
              for (var j = 0; j < $scope.serviceContract.services[i].taxIds.length; j++) {
                for (var n = 0; n < $scope.taxes.length; n++) {
                  if ($scope.serviceContract.services[i].taxIds[j] === $scope.taxes[n].id) {
                    $scope.serviceContract.services[i].taxes.push($scope.taxes[n]);
                    break;
                  }
                }
              }
            }
          }

      /*    for(var g=0; g<$scope.serviceContract.serviceExpenses.length; g++) {
            $scope.serviceContract.serviceExpenses[g].quantity = $scope.serviceContract.serviceExpenses[g].quantity * 60;
          }
*/
          ProductsService.getFullListForAutocompleteWithOutRealTime($scope, function(resp) {
            console.log('getFullListForAutocompleteWithOutRealTime');
            var productsData = resp;
            if($scope.serviceContract.productExpenses.length>0) {
              for(var p=0; p<$scope.serviceContract.productExpenses.length; p++) {
                for(var w=0; w<productsData.length; w++) {
                  for(var v=0; v<productsData[w].products.length; v++) {
                    if(productsData[w].products[v].versionedId.id ===  $scope.serviceContract.productExpenses[p].productId) {
                      $scope.serviceContract.productExpenses[p].name = {};
                      $scope.serviceContract.productExpenses[p].name.description = productsData[w].products[v].description;
                      // $scope.serviceContract.productExpenses[p].name.name = productsData[w].products[v].description;
                      $scope.serviceContract.productExpenses[p].name.sale = productsData[w].products[v].sale;
                      break;
                    }
                  }
                }
              }
            }
            $scope.reInitPrpductsExpenseNameField = true;
          });

          $scope.total = $scope.serviceContract.amount;
          preCreateFirstServicesEntities();
        }


        if ($scope.serviceContract && $scope.serviceContract.services) {
          $scope.serviceContract.services = $scope.serviceContract.services.map(function(service) {
            if (!service.nameValue) {
              service.nameValue = service.name;
            }

            return service;
          })
        }

        ServicesService.getServicesDataWithoutRealTime($scope, function(resp){
          if(resp) {
            console.log('getServicesData 1');
            for(var i=0; i<resp.length; i++) {
              var s = {
                name: resp[i].name,
                picked: false,
                taxes: resp[i].taxes,
                rate: resp[i].rate,
                id: resp[i].versionedId,
                commissionRate: resp[i].commissionRate
              };
              $scope.defaultServicesAdditional.push(s);
              $scope.defaultServicesAdditionalForDropDown.push(s);
            }
            unpickExistingServices()

var data = resp;
            for (var i = 0; i < data.length; i++) {
              var serv = {
                serviceId: data[i].versionedId.id,
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
  
  
  
            if ($scope.serviceContract.serviceExpenses.length > 0) {
              for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
                for (var j = 0; j < $scope.defaultServices.length; j++) {
                  if ($scope.serviceContract.serviceExpenses[i].serviceId === $scope.defaultServices[j].serviceId) {
                    $scope.serviceContract.serviceExpenses[i].name = $scope.defaultServices[j];
                    $scope.defaultServices[j].picked = true;
                    break;
                  }
                }
              }
            }
          }
        });

        function pickService(serviceName) {
          for(var i=0; i<$scope.defaultServicesAdditionalForDropDown.length; i++) {
            if($scope.defaultServicesAdditionalForDropDown[i].name === serviceName) {
              $scope.defaultServicesAdditionalForDropDown.splice(i, 1);
              break;
            }
          }
        }
        function unpickExistingServices() {
          for(var s=0; s<$scope.serviceContract.services.length; s++) {
            for(var d=0; d< $scope.defaultServicesAdditionalForDropDown.length; d++) {
              if($scope.defaultServicesAdditionalForDropDown[d].name === $scope.serviceContract.services[s].name) {
                $scope.defaultServicesAdditionalForDropDown.splice(d, 1);
              }
            }
          }
        }

        function unpickService(serviceName) {
          for(var i=0; i<$scope.defaultServicesAdditional.length; i++) {
            if($scope.defaultServicesAdditional[i].name === serviceName) {
              $scope.defaultServicesAdditionalForDropDown.push($scope.defaultServicesAdditional[i]);
              break;
            }
          }
        }



        function createDefaultServices(){
          var managedUsers = {
            name: 'Managed users',
            count: 0,
            rate: 0,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          $scope.presettupUsersServices.push(managedUsers);
          var managedWorkstation = {
            name: 'Managed workstations',
            count: 0,
            rate: 0,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          var managedServers = {
            name: 'Managed servers',
            count: 0,
            rate: 0,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          $scope.presettupDeviceServices.push(managedWorkstation);
          $scope.presettupDeviceServices.push(managedServers);
        }


        function preCreateFirstServicesEntities() {

          $scope.presettupUsersServices = [];

          $scope.presettupDeviceServices = [];

          $scope.NewServiceContractServices = {
            name: null,
            count: null,
            rate: null,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };

          $scope.newProductExpense = {
            name: null,
            quantity: null,
            salePrice: null
          };

          $scope.newServiceExpense = {
            name: null,
            quantity: null,
            description: null,
            date: null
          };

          $scope.newService = {
            name: '',
            rate: 0,
            billable: true,
            taxIds: [],
            taxes: $scope.addDefaultTaxes(),
            nameValue: ''
          };

          $scope.newServiceContractServicesToTrack = {
            name: ''
          }
        }

        function createDefaultServiceContractServicesToTrack() {
          var scstt1 = {
            name: 'Managed Services Onsite'
          };
          var scstt2 = {
            name: 'Managed Services Remote'
          };
          $scope.serviceContract.serviceContractServicesToTrack.push(scstt1);
          $scope.serviceContract.serviceContractServicesToTrack.push(scstt2);
        }

        $scope.showAdditionalServiceColumn = function() {
          //var show =  $scope.serviceContract.serviceContractServices.some((s) => s.billable);
          var show =  $scope.serviceContract.serviceContractServices.some(function(s) {
            return s.billable;
          });
          return show;
        };


        $scope.formattingDateForServiceExpenses = function (date) {
          var d = new Date(date);
          return d;
        };

        if (!$scope.isEditContract) {
          $scope.serviceContract.minEndDate = $scope.serviceContract.minStartDate + month;
          $scope.serviceContract.endDate = $scope.serviceContract.minStartDate + month;
        }
      
console.log('$scope.serviceContract.endDate',$scope.serviceContract.endDate);

        $scope.defaultDareForServiceExpense = Date.now() + day;

        presettupPeriod();

        function presettupPeriod() {
          if ($scope.serviceContract.interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
          } else if ($scope.serviceContract.interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
          } else {
            $scope.serviceContract.period = $scope.serviceContract.customInterval;
          }
        }

        $scope.previewInterval = function () {
          if($scope.serviceContract.customInterval) {
            return $scope.serviceContract.customInterval + ' days';
          } else {
            return $scope.serviceContract.interval;
          }
        };

        function changeStartDate() {
          var intervals = parseInt($scope.numOfIntervals);
          changeMinEndDate($scope.serviceContract.period, intervals);
        }

        function changeDefaultDateForServices() {
          var servicePickDate = new Date($scope.newServiceExpense.date);
          var startDate = new Date($scope.serviceContract.startDate);
          var pickedDate = new Date($scope.newServiceExpense.date);
          if(servicePickDate.getTime() < startDate.getTime()) {
            $scope.newServiceExpense.date = $scope.serviceContract.startDate;
            $scope.defaultDareForServiceExpense = startDate.getTime();
          } else {
            $scope.defaultDareForServiceExpense = pickedDate.getTime();
          }
          for(var i=0; i<$scope.serviceContract.serviceExpenses.length; i++) {
            var setDate = new Date($scope.serviceContract.serviceExpenses[i].date);
            if(setDate.getTime() < startDate.getTime()) {
              $scope.serviceContract.serviceExpenses[i].date = $scope.serviceContract.startDate;
            }
          }
        }

        function changeMinEndDate(period, numOfIntervals) {
          var date = $scope.serviceContract.startDate;
          var endDate = new Date(date);
          switch (period) {
            case('Month'):
              endDate = Utils.addNumberOfMonth(endDate, 1);
              break;
            case('Year'):
              endDate = Utils.addNumberOfMonth(endDate, 12);
              break;
            default:
              endDate = Utils.calculateDateWithTimeZoneAndPeriod(endDate, period);

          }
          endDate = Utils.minusDays(endDate, 1);
          //$scope.serviceContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          $scope.serviceContract.minEndDate = $filter('date')(endDate, 'dd MMM yyyy');
          changeDefaultDateForServices();
          reInitEndDate();
          $timeout(function () {
            changeEndDate(period, numOfIntervals);
          }, 50);
        }

        function changeEndDate(period, numOfIntervals) {
          if(numOfIntervals) {
            var date = $scope.serviceContract.startDate;
            var endDate = new Date(date);
            switch(period) {
              case('Month'):
                //endDate.setMonth(endDate.getMonth() + 1);
                endDate = Utils.addNumberOfMonth(endDate, 1*numOfIntervals);
                break;
              case('Year'):
                endDate = Utils.addNumberOfMonth(endDate, 12*numOfIntervals);
                break;
              default:
                endDate = Utils.calculateDateWithTimeZoneAndPeriod(endDate, period, numOfIntervals);
            }
            endDate = Utils.minusDays(endDate, 1);
            $scope.serviceContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
            console.log('$scope.serviceContract.endDate',$scope.serviceContract.endDate);
          }

        }

        $scope.$watch(function() {
          return $scope.serviceContract.endDate;
        }, function(oldEndDate) {
          console.log('gegegegegegege',   oldEndDate);
          console.log('gegegegegegege', typeof oldEndDate);
          if (typeof oldEndDate === "string" && typeof $scope.serviceContract.startDate === "string" || typeof oldEndDate === "object" && typeof $scope.serviceContract.startDate === "string") {
     
          changeNumOfIntervals($scope.serviceContract.startDate, oldEndDate)
          }
        });

        function changeNumOfIntervals(startDatee, endDatee, ifForIntervals ) {
          if(startDatee && endDatee) {
            var startDate = new Date(startDatee);
            var endDate = new Date(endDatee);
            var interval = 1 ;
            switch($scope.serviceContract.period) {
              case('Month'):
                for(var i=1; i<10000; i++) {
                  var s = startDate;
                  s = Utils.addNumberOfMonth(startDate, i);
                  s = Utils.minusDays(s, 1);
                  if(s.getTime() === endDate.getTime()) {
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
                  if(sd.getTime() === endDate.getTime()) {
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
                  sd = Utils.calculateDateWithTimeZoneAndPeriod(sd, $scope.serviceContract.period, 1);
                  sd = Utils.minusDays(sd, 1);
                  var nt = sd;
                  nt.setHours(0, 0, 0, 0);
                  nt.setSeconds(0);
                  nt.setMilliseconds(0);
                  if(nt.getTime() === endDate.getTime()) {
                    interval = d;
                    break;
                  }
                }
            }
            if(ifForIntervals) {
              $scope.serviceContract.numOfIntervalsPreview = interval
            } else {
              $scope.numOfIntervals = interval;
            }
          }
        }

        $scope.changeEndDateByNumToGenerate = function() {
          var intervals = parseInt($scope.numOfIntervals);
          changeEndDate($scope.serviceContract.period, intervals);
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

        function reInitNewServiceExpenseForm() {
          $scope.reInitNewServiceExpenseForm = false;
          $timeout(function () {
            $scope.reInitNewServiceExpenseForm = true;
          }, 0);
        }

        $scope.$watch(function () {
          return $scope.serviceContract.interval;
        }, function (interval) {
          var newMinStartDate;
          var now = Date.now();
          var n = new Date(now);
          if (interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
            $scope.serviceContract.interval = 'MONTHLY';
            $scope.serviceContract.customInterval = null;
            n.setMonth(n.getMonth() - 1);
            newMinStartDate = n.getTime() + day;

          } else if (interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
            $scope.serviceContract.interval = 'YEARLY';
            $scope.serviceContract.customInterval = null;
            n.setFullYear(n.getFullYear() - 1);
            newMinStartDate = n.getTime() + day;

          } else if (interval === '30 days') {
            $scope.serviceContract.period = 30;
            $scope.serviceContract.customInterval = 30;
            newMinStartDate = now - (29*day);

          } else if (interval === '15 days') {
            $scope.serviceContract.period = 15;
            $scope.serviceContract.customInterval = 15;
            newMinStartDate = now - (14*day);

          } else if (interval === '7 days') {
            $scope.serviceContract.period = 7;
            $scope.serviceContract.customInterval = 7;
            newMinStartDate = now - (6*day);

          } else if (interval === '1 day') {
            $scope.serviceContract.period = 1;
            $scope.serviceContract.customInterval = 1;
          }
          $scope.serviceContract.minStartDate = newMinStartDate;
          //changeMinEndDate($scope.serviceContract.period);
          changeStartDate();
          reInitStartDate();
          //reInitEndDate();
        });

        $scope.$watch(function () {
          return $scope.serviceContract.startDate;
        }, function () {
          changeStartDate()
        });



     /*   ServicesService.getServicesData($scope, function (data) {
          console.log('getServicesData 2');
          for (var i = 0; i < data.length; i++) {
            var serv = {
              serviceId: data[i].versionedId.id,
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



          if ($scope.serviceContract.serviceExpenses.length > 0) {
            for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
              for (var j = 0; j < $scope.defaultServices.length; j++) {
                if ($scope.serviceContract.serviceExpenses[i].serviceId === $scope.defaultServices[j].serviceId) {
                  $scope.serviceContract.serviceExpenses[i].name = $scope.defaultServices[j];
                  $scope.defaultServices[j].picked = true;
                  break;
                }
              }
            }
          }
        });*/


        $scope.changeContractType = function (type) {
          $scope.serviceContract.billType = type;
        };

        function showErrorNewSCSFieldsTimeOut() {
          $scope.showRequiredFieldErrorSCS = true;
          $timeout(function () {
            $scope.showRequiredFieldErrorSCS = false;
          }, 4000);
        }

        $scope.console = function(val) {
        }

        function showErrorNewSCSValidationTimeOut() {
          $scope.showNewServiceContractServiceValidationError = true;
          $timeout(function () {
            $scope.showNewServiceContractServiceValidationError = false;
          }, 4000);
        }
        $scope.showAddButtonNewSCS = true;

        $scope.createNewServiceContractServices = function (form, NewServiceContractServices) {
          $scope.showRequiredFieldErrorSCS =  false;
          $scope.showAddButtonNewSCS = false;
          if (form.$valid) {
            validateNewServiceName(NewServiceContractServices.name).then(function (resp) {
              if (resp) {
                var serviceContractServices = {
                  name: NewServiceContractServices.name,
                  count: NewServiceContractServices.count,
                  rate: NewServiceContractServices.rate,
                  taxIds: [],
                  taxes: NewServiceContractServices.taxes
                };
                $scope.serviceContract.serviceContractServices.push(serviceContractServices);
                $scope.NewServiceContractServices = {
                  name: null,
                  count: null,
                  rate: null,
                  taxIds: [],
                  taxes: $scope.addDefaultTaxes()
                };
                $scope.showAddButtonNewSCS = true;
                reInitServiceContractServicesForm();
                $scope.calculateTotalAmount();
              }
            }, function() {
              showErrorNewSCSValidationTimeOut();
              $scope.showAddButtonNewSCS = true;
            });
          } else {
            showErrorNewSCSFieldsTimeOut();
            $scope.showAddButtonNewSCS = true;
          }
        };

        function reInitServiceContractServicesForm() {
          $scope.reInitServiceContractServicesForm = false;
          $timeout(function () {
            $scope.reInitServiceContractServicesForm = true;
          }, 0);
        }

        function reInitServiceForm() {
          $scope.reInitServiceForm = false;
          $timeout(function () {
            $scope.reInitServiceForm = true;
          }, 0);
        }

        $scope.deleteServiceContractService = function (service) {
          for (var i = 0; i < $scope.serviceContract.serviceContractServices.length; i++) {
            if ($scope.serviceContract.serviceContractServices[i] === service) {
              $scope.serviceContract.serviceContractServices.splice(i, 1);
              break;
            }
          }
          $scope.calculateTotalAmount();
        };


        $scope.setOpenedTab = function (tab) {
          $scope.openedTab = tab;
        };

        $scope.isTabOpened = function (tab) {
          return $scope.openedTab === tab
        };

        $scope.deletePresettupDeviceService = function(service) {
          for (var i = 0; i < $scope.presettupDeviceServices.length; i++) {
            if ($scope.presettupDeviceServices[i] === service) {
              $scope.presettupDeviceServices.splice(i, 1);
              break;
            }
          }
          $scope.calculateTotalAmount();
        };

        $scope.deletePresettupUserService = function(service) {
          for (var i = 0; i < $scope.presettupUsersServices.length; i++) {
            if ($scope.presettupUsersServices[i] === service) {
              $scope.presettupUsersServices.splice(i, 1);
              break;
            }
          }
          $scope.calculateTotalAmount();
        };




        $scope.addServiceExpense = function (form, serviceExpense) {
          $scope.showRequiredFieldErrorServiceExpense = false;

          if (form.$valid) {
            var newServiceExpense = {
              name: serviceExpense.name,
              quantity: serviceExpense.quantity,
              description: serviceExpense.description,
              date: serviceExpense.date
            };
            $scope.serviceContract.serviceExpenses.push(newServiceExpense);
            for (var i = 0; i < $scope.defaultServices.length; i++) {
              if ($scope.defaultServices[i] === serviceExpense.name) {
                $scope.defaultServices[i].picked = true;
              }
            }
            $scope.newServiceExpense = {
              name: null,
              quantity: null,
              description: null,
              date: $filter('date')($scope.defaultDareForServiceExpense, 'dd MMM yyyy')
            };
            reInitNewServiceExpenseForm();
            $scope.calculateTotalAmount();
          } else {
            $scope.showRequiredFieldErrorServiceExpense = true;
          }
        };


        $scope.deleteServiceExpense = function (service) {
          for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
            if ($scope.serviceContract.serviceExpenses[i] === service) {
              $scope.serviceContract.serviceExpenses.splice(i, 1);

              for (var j = 0; j < $scope.defaultServices.length; j++) {
                if ($scope.defaultServices[j] === service.name) {
                  $scope.defaultServices[j].picked = false;
                }
              }

              break;
            }
          }
          $scope.calculateTotalAmount();
        };

        $scope.showAddButtonNewService = true;

        function showErrorNewServiceFieldsTimeOut() {
          $scope.showRequiredFieldErrorService = true;
          $timeout(function () {
            $scope.showRequiredFieldErrorService = false;
          }, 4000);
        }

        function showErrorNewServiceValidationTimeOut() {
          $scope.showNewServiceValidationError = true;
          $timeout(function () {
            $scope.showNewServiceValidationError = false;
          }, 4000);
        }

        $scope.showNewServiceNameError = false;
        function showErrorNewServiceNameTimeOut() {
          $scope.showNewServiceNameError = true;
          $timeout(function () {
            $scope.showNewServiceNameError = false;
          }, 4000);
        }
        $scope.addNewService = function (form, service) {
          
          $scope.notAddedAdditionalServiceError = false;
          $scope.showAddButtonNewService = false;
          $scope.showNewServiceError = false;
          if (form.$valid) {
            if( !service.name ) {
              
              showErrorNewServiceNameTimeOut();
              $scope.showAddButtonNewService = true;
            } else {
              validateNewServiceName(service.name.name).then(function (resp) {
                if (resp) {
                  var ns = {
                    name: service.name.name,
                    rate: service.name.rate,
                    billable: service.billable,
                    taxes: service.name.taxes,
                    nameValue: service.name.name,
                    id: service.name.id,
                    commissionRate: service.name.commissionRate
                  };
                  $scope.serviceContract.services.push(ns);
                  $scope.newService = {
                    name: '',
                    rate: 0,
                    billable: true,
                    taxes: $scope.addDefaultTaxes(),
                    taxIds: [],
                    nameValue: ''
                  };
                  reInitServiceForm();
                  $scope.showAddButtonNewService = true;
                  pickService(service.nameValue);
                }
              }, function() {
                showErrorNewServiceValidationTimeOut();
                $scope.showAddButtonNewService = true;
              })
            }



          } else {
            showErrorNewServiceFieldsTimeOut();
            $scope.showAddButtonNewService = true;
          }
        };

        $scope.deleteService = function (service) {
          for (var i = 0; i < $scope.serviceContract.services.length; i++) {
            if ($scope.serviceContract.services[i] === service) {
              $scope.serviceContract.services.splice(i, 1);
              unpickService(service.name);
              break;
            }
          }
        };

        function errorSCSTTNameRequiredTimeOut() {
          $scope.showRequiredFieldErrorServiceExpense = true;
          $timeout(function () {
            $scope.showRequiredFieldErrorServiceExpense = false;
          }, 4000);
        }

        function errorSCSTTValidationErrorTimeOut() {
          $scope.showNewSCSTTValidationError = true;
          $timeout(function () {
            $scope.showNewSCSTTValidationError = false;
          }, 4000);
        }



        $scope.addServiceContractServicesToTrack = function(form, service) {
          $scope.showAddButtonNewSCSTT = false;
          if(form.$valid) {
            validateNewServiceName(service.name).then(function(resp) {
              if(resp) {

                $scope.serviceContract.serviceContractServicesToTrack.push(service);
                $scope.newServiceContractServicesToTrack = {
                  name: ''
                };
                $scope.showAddButtonNewSCSTT = true;
              }
            }, function() {
              $scope.showAddButtonNewSCSTT = true;
              errorSCSTTValidationErrorTimeOut();
            })
          } else {
            errorSCSTTNameRequiredTimeOut();
            $scope.showAddButtonNewSCSTT = true;
          }
        };

        $scope.deleteServiceContractServicesToTrack = function(service) {
          for (var i = 0; i < $scope.serviceContract.serviceContractServicesToTrack.length; i++) {
            if ($scope.serviceContract.serviceContractServicesToTrack[i] === service) {
              $scope.serviceContract.serviceContractServicesToTrack.splice(i, 1);
              break;
            }
          }
        };

        $scope.isAdditionalServiceNameUnique = function (name) {
          var check = true;
          if (typeof name === 'object') {
            name = name.name;
          }
          if (name) {
            if ($scope.serviceContract.billType === 'OTHER') {
              if ($scope.serviceContract.serviceExpenses.length > 0) {
                for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
                  if ($scope.serviceContract.serviceExpenses[i].name.name === name) {
                    check = false;
                    break;
                  }
                }
              }
              if ($scope.serviceContract.productExpenses.length > 0) {
                for (var j = 0; j < $scope.serviceContract.productExpenses.length; j++) {
                  if ($scope.serviceContract.productExpenses[j].name.name === name) {
                    check = false;
                    break;
                  }
                }
              }
            } else {
              if ($scope.serviceContract.serviceContractServices.length > 0) {
                for (var n = 0; n < $scope.serviceContract.serviceContractServices.length; n++) {
                  if (checkNameForObject($scope.serviceContract.serviceContractServices[n].name) === name) {
                    check = false;
                    break;
                  }
                }
              }
              if($scope.serviceContract.billType === 'DEVICE') {
                if ($scope.presettupDeviceServices.length > 0) {
                  for (var d = 0; d < $scope.presettupDeviceServices.length; d++) {
                    if ($scope.presettupDeviceServices[d].name === name) {
                      check = false;
                      break;
                    }
                  }
                }
              } else if($scope.serviceContract.billType === 'USER') {
                if ($scope.presettupUsersServices.length > 0) {
                  for (var u = 0; u < $scope.presettupUsersServices.length; u++) {
                    if ($scope.presettupUsersServices[u].name === name) {
                      check = false;
                      break;
                    }
                  }
                }
              }
            }
          }
          if ($scope.serviceContract.services.length > 0) {
            for (var h = 0; h < $scope.serviceContract.services.length; h++) {
              if (checkNameForObject($scope.serviceContract.services[h].name) === name) {
                check = false;
                break;
              }
            }
          }
          if ($scope.serviceContract.serviceContractServicesToTrack.length > 0) {
            for (var m = 0; m < $scope.serviceContract.serviceContractServicesToTrack.length; m++) {
              if ($scope.serviceContract.serviceContractServicesToTrack[m].name === name) {
                check = false;
                break;
              }
            }
          }
          return check;
        };

        $scope.isNewServiceContractServiceNameUnique = function (name) {
          var check = true;
          if (name) {
            if ($scope.serviceContract.services.length > 0) {
              for (var i = 0; i < $scope.serviceContract.services.length; i++) {
                if ($scope.serviceContract.services[i].name === name) {
                  check = false;
                  break;
                }
              }
            }
            if ($scope.serviceContract.serviceContractServices.length > 0) {
              for (var j = 0; j < $scope.serviceContract.serviceContractServices.length; j++) {
                if ($scope.serviceContract.serviceContractServices[j].name === name) {
                  check = false;
                  break;
                }
              }
            }
            if ($scope.serviceContract.serviceContractServicesToTrack.length > 0) {
              for (var m = 0; m < $scope.serviceContract.serviceContractServicesToTrack.length; m++) {
                if ($scope.serviceContract.serviceContractServicesToTrack[m].name === name) {
                  check = false;
                  break;
                }
              }
            }
            if($scope.serviceContract.billType === 'DEVICE') {
              if ($scope.presettupDeviceServices.length > 0) {
                for (var d = 0; d < $scope.presettupDeviceServices.length; d++) {
                  if ($scope.presettupDeviceServices[d].name === name) {
                    check = false;
                    break;
                  }
                }
              }
            } else if($scope.serviceContract.billType === 'USER') {
              if ($scope.presettupUsersServices.length > 0) {
                for (var u = 0; u < $scope.presettupUsersServices.length; u++) {
                  if ($scope.presettupUsersServices[u].name === name) {
                    check = false;
                    break;
                  }
                }
              }
            }
          }
          return check;
        };


        function validateNewServiceName(serviceName) {
          var deferred = $q.defer();
          if (serviceName) {
            if (!$scope.serviceContract.startDate || !$scope.serviceContract.endDate) {
              $scope.showNewServiceError = true;
              $scope.newServiceErrorMessage = 'Please enter start and end date to check service name';
              deferred.reject();
            } else {
              var companyId = returnCompanyId();
              var name = [];
              name.push(serviceName);

              var startDate = $filter('date')($scope.serviceContract.startDate, 'yyyy/MM/dd');
              var endDate = $filter('date')($scope.serviceContract.endDate, 'yyyy/MM/dd');
              ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, name,($scope.isEditContract) ?  $scope.serviceContract.id : null, function (resp) {
                if (Object.keys(resp).length === 0) {
                  
                  deferred.resolve(resp);
                } else {
                 
                  deferred.reject();
                }
              });
            }
          }
          return deferred.promise;
        }

        function validateListOfNames(listOFNames) {
          var deferred = $q.defer();
          var companyId = returnCompanyId();
          var startDate = $filter('date')($scope.serviceContract.startDate, 'yyyy/MM/dd');
          var endDate = $filter('date')($scope.serviceContract.endDate, 'yyyy/MM/dd');
          ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, listOFNames,($scope.isEditContract) ?  $scope.serviceContract.id : null, function (resp) {
            
            if (Object.keys(resp).length === 0) {

              deferred.resolve(resp);
            } else {
              deferred.reject();
              showCreateErrorWithTimeout();
            }
          });
          return deferred.promise;
        }

        function returnCompanyId() {
          var id;
          if ($scope.serviceContract.companyId) {
            id = $scope.serviceContract.companyId;
          } else if ($scope.contractCompany && $scope.contractCompany.id) {
            id = $scope.contractCompany.id;
          } else if ($scope.companyId) {
            id = $scope.companyId;
          }

          return id.id ? id.id : id;
        }

        function checkForInvalidFields() {
          function formCheck() {
            return ($scope.serviceContract.description &&
            $scope.serviceContract.startDate &&
            $scope.serviceContract.endDate &&
            $scope.serviceContract.billType);
          }

          function serviceCheck() {
            if ($scope.serviceContract.billType === 'DEVICE') {
              var deviceCheck =  $scope.serviceContract.serviceContractServices.length > 0;
              var presetupCheck = $scope.presettupDeviceServices.length > 0;
              return (deviceCheck || presetupCheck)
            } else if($scope.serviceContract.billType === 'USER'){
              var userCheck =  $scope.serviceContract.serviceContractServices.length > 0;
              var presetupCheck  =  $scope.presettupUsersServices.length > 0;
              return (userCheck || presetupCheck)
            }else if($scope.serviceContract.billType === 'OTHER'){
              return ($scope.serviceContract.serviceExpenses.length > 0 || $scope.serviceContract.productExpenses.length > 0);
            }
          }
          $scope.showRequiredFieldError = !formCheck();
          if(!serviceCheck()) {
            errorTimeOut()
          }
          return (formCheck() && serviceCheck());
        }

        function errorTimeOut() {
          $scope.showServiceLengthCheckError = true;
          $timeout(function () {
            $scope.showServiceLengthCheckError = false;
          }, 4000);
        }

        $scope.isShowingErrorsServiceContract = function (form, fieldName) {
          return form && form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldError) && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewSCSField = function (form, fieldName) {
          return form && form[fieldName] &&  $scope.showRequiredFieldErrorSCS && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewServiceField = function (form, fieldName) {
          return form && form[fieldName] &&  $scope.showRequiredFieldErrorService && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewServicExpenseeField = function (form, fieldName) {
          return form && form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldErrorServiceExpense) && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewSCSTTField = function (form, fieldName) {
          return form && form[fieldName] &&  $scope.showRequiredFieldErrorServiceExpense && !form[fieldName].$valid;
        };


        $scope.showNotAddedAdditionalServiceError = function(service) {
          return (service.nameValue && service.nameValue.length && $scope.notAddedAdditionalServiceError)
        };
        $scope.showNotAddedSCSServiceError = function(service) {
          return (service.name && service.name.length && $scope.notAddedSCSError)
        };
        $scope.showNotAddedSCSTTServiceError = function(service) {
          return (service.name && service.name.length && $scope.notAddedSCSTTError)
        };
        $scope.showNotAddedServiceExpenseError = function(service) {
          if(service.name) {
            return (service.name && service.name.name && service.name.name.length && $scope.notAddedServiceExpenseError)
          }

        };
        $scope.showNotAddedProductExpenseError = function(service) {
          return (service.name && service.name.description.length && $scope.notAddedProductExpenseError)
        };


        $scope.refreshNotAddedError = function(serviceType) {
          switch(serviceType) {
            case 'additional':
              $scope.notAddedAdditionalServiceError = false;
              break;
            case 'SCS':
              $scope.notAddedSCSError = false;
              break;
            case 'SCSTT' :
              $scope.notAddedSCSTTError = false;
              break;
            case 'serviceExpense':
              $scope.notAddedServiceExpenseError = false;
              break;
            case 'productExpense':
              $scope.notAddedProductExpenseError = false;
              break;
            default:
             
          }
        };

        function activateNotAddedServiceErrors() {
          $scope.notAddedAdditionalServiceError = true;
          $scope.notAddedSCSError = true;
          $scope.notAddedSCSTTError = true;
          if($scope.serviceContract.billType === 'OTHER') {
            $scope.notAddedServiceExpenseError = true;
            $scope.notAddedProductExpenseError = true;
          }
        }



        $scope.calculateTotalAmount = function () {
          var totalAmount = 0;
          if($scope.editMode) {
            if ($scope.serviceContract.billType === 'OTHER') {
              if ($scope.serviceContract.serviceExpenses.length > 0) {
                for(var j=0; j<$scope.serviceContract.serviceExpenses.length; j++) {
                  var servCost = $scope.serviceContract.serviceExpenses[j].quantity * ($scope.serviceContract.serviceExpenses[j].name.rate / 60);
                  totalAmount = totalAmount+servCost;
                }
              }
              if ($scope.serviceContract.productExpenses.length > 0) {
                for(var i=0; i<$scope.serviceContract.productExpenses.length; i++) {
                  var productCost = $scope.serviceContract.productExpenses[i].quantity * $scope.serviceContract.productExpenses[i].salePrice;
                  totalAmount = totalAmount+productCost;
                }
              }
            } else {
              if($scope.serviceContract.serviceContractServices.length>0) {
                for(var t=0; t<$scope.serviceContract.serviceContractServices.length; t++) {
                  var scs = $scope.serviceContract.serviceContractServices[t].count * $scope.serviceContract.serviceContractServices[t].rate;
                  totalAmount = totalAmount+scs;
                }
              }
              if($scope.serviceContract.billType === 'USER') {
                if($scope.presettupUsersServices.length>0) {
                  for(var u=0; u<$scope.presettupUsersServices.length; u++) {
                    if($scope.presettupUsersServices[u].count && $scope.presettupUsersServices[u].rate) {
                      var ups = $scope.presettupUsersServices[u].count * $scope.presettupUsersServices[u].rate;
                      totalAmount = totalAmount+ups;
                    }
                  }
                }
              } else if($scope.serviceContract.billType === 'DEVICE') {
                if($scope.presettupDeviceServices.length>0) {
                  for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                    if($scope.presettupDeviceServices[d].count && $scope.presettupDeviceServices[d].rate) {
                      var dps = $scope.presettupDeviceServices[d].count * $scope.presettupDeviceServices[d].rate;
                      totalAmount = totalAmount+dps;
                    }
                  }
                }
              }
            }
          }
          $scope.total = totalAmount;
        };

        function convertMinutesToHour(minutes) {
          var hours = Math.floor(minutes/60);
          var part = (minutes%60) / 60;
          return hours + part;
        }

        $scope.$watch(function() {
          return $scope.serviceContract.services[0]
        }, function(val) {
         
        });

        $scope.$watch(function() {
          return $scope.serviceContract.services
        }, function(val) {
          

          for (var i = 0; i < val.length; i++) {
            var serv = val[i];

            if (typeof serv.name === 'object') {
              serv = Object.assign({}, serv);

              // var defaultServ = serv;
              // defaultServ.nameValue = defaultServ.name;
              //
             
              // var newServ = $scope.defaultServicesAdditionalForDropDown.find(function(value) {
              //   return value.name === serv.nameValue;
              // });

              var ns = {
                name: serv.nameValue,
                rate: serv.name.rate,
                billable: true,
                taxes: serv.name.taxes,
                nameValue: serv.nameValue
              };

             

              (function() {
                var id = i;
               
                var serv = ns;

                validateNewServiceName(serv.nameValue).then(function (resp) {
                  if (resp) {
                   
                    $scope.serviceContract.services.splice(id, 1, ns);
                  }
                }, function() {
                  showErrorNewServiceValidationTimeOut();

                })
              }())


            }
          }
        }, true)

        function updateServiceContract(serviceContract) {
          $scope.showValidationFailMessage = false;
          if (serviceContract) {
            var servContract = {
              id: serviceContract.id,
              description: serviceContract.description,
              type: "SERVICE_CONTRACT",
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              customInterval: serviceContract.customInterval,
              billType: serviceContract.billType,
              companyId: returnCompanyId(),
              services: [],
              serviceContractServices: [],
              serviceExpenses: null,
              productExpenses: null,
              serviceContractServicesToTrack: [],
              contractWithBlockTime: false,
              taxIds: null,
              includedHours: null,
              rateExceeding: null,
              blockTimeServices: null
            };

            if(serviceContract.contractWithBlockTime && (servContract.billType === 'USER' || servContract.billType === 'DEVICE')) {
              servContract.contractWithBlockTime = serviceContract.contractWithBlockTime;
              servContract.includedHours = serviceContract.includedHours;
              servContract.rateExceeding = serviceContract.rateExceeding;
              servContract.blockRate = 0;
              servContract.blockTimeServices = [];

              if (serviceContract.taxes && serviceContract.taxes.length) {
                servContract.taxIds = [];
                for (var r = 0; r < serviceContract.taxes.length; r++) {
                  servContract.taxIds.push(serviceContract.taxes[r].id);
                }
              }
            }


            if (servContract.billType === 'OTHER') {
              servContract.serviceExpenses = [];
              servContract.productExpenses = []
            } else {
              servContract.invoiceAsSingleItem = serviceContract.invoiceAsSingleItem;
            }

            if ($scope.serviceContract.interval === 'MONTHLY' || $scope.serviceContract.interval === 'YEARLY') {
              servContract.interval = serviceContract.interval;
            } else {
              servContract.interval = null;
            }

            var sd = new Date($scope.serviceContract.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            servContract.startDate = $filter('date')(sd, 'yyyy/MM/dd');

            var ed = new Date($scope.serviceContract.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            servContract.endDate = $filter('date')(ed, 'yyyy/MM/dd');

            if(serviceContract.billType !== 'OTHER') {
              if(serviceContract.serviceContractServicesToTrack && serviceContract.serviceContractServicesToTrack.length) {
                for (var l=0; l<serviceContract.serviceContractServicesToTrack.length; l++) {
                  var scstt = {
                    
                    id: (serviceContract.serviceContractServicesToTrack[l].id) ? serviceContract.serviceContractServicesToTrack[l].id : uuidv4(),
                    name: serviceContract.serviceContractServicesToTrack[l].name,
                    rate: (serviceContract.serviceContractServicesToTrack[l].rate) ? serviceContract.serviceContractServicesToTrack[l].rate : 0,
                    count: (serviceContract.serviceContractServicesToTrack[l].count) ? serviceContract.serviceContractServicesToTrack[l].count : null,
                    billable: (serviceContract.serviceContractServicesToTrack[l].billable) ? serviceContract.serviceContractServicesToTrack[l].billable : true,
                    basedOnDefault: (serviceContract.serviceContractServicesToTrack[l].basedOnDefault) ? serviceContract.serviceContractServicesToTrack[l].basedOnDefault : false,
                    commissionRate: (serviceContract.serviceContractServicesToTrack[l].commissionRate) ? serviceContract.serviceContractServicesToTrack[l].commissionRate : 0,
                    taxIds: (serviceContract.serviceContractServicesToTrack[l].taxIds)  ? serviceContract.serviceContractServicesToTrack[l].taxIds : [],
                  };
                  if(serviceContract.contractWithBlockTime) {
                    servContract.blockTimeServices.push(scstt);
                  } else {
                    servContract.serviceContractServicesToTrack.push(scstt);
                  }

                }
              }
              if (serviceContract.isAdditionalServices && serviceContract.services && serviceContract.services.length) {
                for (var i = 0; i < serviceContract.services.length; i++) {
                  var serv = {
                    name: serviceContract.services[i].nameValue || serviceContract.services[i].name,
                    rate: 0,
                    billable: serviceContract.services[i].billable,
                    taxIds: [],
                    basedOnDefault: serviceContract.services[i].basedOnDefault,
                    id: (typeof serviceContract.services[i].id === "string")? serviceContract.services[i].id : serviceContract.services[i].id.id,
                    commissionRate: serviceContract.services[i].commissionRate,
                    count : serviceContract.services[i].count
                  };
                  if(serviceContract.services[i].billable) {
                    serv.rate = serviceContract.services[i].rate;
                    if (serviceContract.services[i].taxes && serviceContract.services[i].taxes.length) {
                      for (var n = 0; n < serviceContract.services[i].taxes.length; n++) {
                        serv.taxIds.push(serviceContract.services[i].taxes[n].id);
                      }
                    }
                  }
                  servContract.services.push(serv);
                }
              }
            }



            if(serviceContract.billType === 'DEVICE' && $scope.presettupDeviceServices.length>0) {
              for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                var dServ = {
                  name: $scope.presettupDeviceServices[d].name,
                  rate: $scope.presettupDeviceServices[d].rate,
                  count: $scope.presettupDeviceServices[d].count,
                  taxIds: [],
                  id: $scope.presettupDeviceServices[d].id,
                  billable: $scope.presettupDeviceServices[d].billable,
                  basedOnDefault: $scope.presettupDeviceServices[d].basedOnDefault,
                  commissionRate: $scope.presettupDeviceServices[d].commissionRate,
                };
                if ($scope.presettupDeviceServices[d].taxes && $scope.presettupDeviceServices[d].taxes.length) {
                  for (var j = 0; j < $scope.presettupDeviceServices[d].taxes.length; j++) {
                    dServ.taxIds.push($scope.presettupDeviceServices[d].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(dServ);
              }
            }

            if(serviceContract.billType === 'USER' && $scope.presettupUsersServices.length>0) {
              for(var d=0; d<$scope.presettupUsersServices.length; d++) {
                var uServ = {
                  name: $scope.presettupUsersServices[d].name,
                  rate: $scope.presettupUsersServices[d].rate,
                  count: $scope.presettupUsersServices[d].count,
                  taxIds: [],
                  id: $scope.presettupUsersServices[d].id,
                  billable: $scope.presettupUsersServices[d].billable,
                  basedOnDefault: $scope.presettupUsersServices[d].basedOnDefault,
                  commissionRate: $scope.presettupUsersServices[d].commissionRate,
                };
                if ($scope.presettupUsersServices[d].taxes && $scope.presettupUsersServices[d].taxes.length) {
                  for (var j = 0; j < $scope.presettupUsersServices[d].taxes.length; j++) {
                    uServ.taxIds.push($scope.presettupUsersServices[d].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(uServ);
              }
            }

            if (serviceContract.serviceContractServices && serviceContract.serviceContractServices.length) {
              for (var m = 0; m < serviceContract.serviceContractServices.length; m++) {
                var scs = {
                  name: serviceContract.serviceContractServices[m].name,
                  rate: serviceContract.serviceContractServices[m].rate,
                  count: serviceContract.serviceContractServices[m].count,
                  taxIds: [],
                  id: serviceContract.serviceContractServices[m].id,
                  billable: serviceContract.serviceContractServices[m].billable,
                  basedOnDefault: serviceContract.serviceContractServices[m].basedOnDefault,
                  commissionRate: serviceContract.serviceContractServices[m].commissionRate,
                };
                if (serviceContract.serviceContractServices[m].taxes && serviceContract.serviceContractServices[m].taxes.length) {
                  for (var j = 0; j < serviceContract.serviceContractServices[m].taxes.length; j++) {
                    scs.taxIds.push(serviceContract.serviceContractServices[m].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(scs);
              }
            }

            if (serviceContract.serviceExpenses && serviceContract.serviceExpenses.length) {
              for (var u = 0; u < serviceContract.serviceExpenses.length; u++) {
                if (serviceContract.serviceExpenses[u] && serviceContract.serviceExpenses[u].name) {
                  var servExp = {
                    serviceId: serviceContract.serviceExpenses[u].name.serviceId,
                    quantity: serviceContract.serviceExpenses[u].quantity,// convertMinutesToHour(serviceContract.serviceExpenses[u].quantity),
                    description: serviceContract.serviceExpenses[u].description,
                    date: new Date(serviceContract.serviceExpenses[u].date).getTime(),
                    serviceExpenseDurationStart: null,
                    serviceExpenseDurationEnd: null,
                  };
                  servContract.serviceExpenses.push(servExp);
                }
              }
            }

            if (serviceContract.productExpenses && serviceContract.productExpenses.length) {
              for (var t = 0; t < serviceContract.productExpenses.length; t++) {
                if (serviceContract.productExpenses[t] && serviceContract.productExpenses[t].name) {
                  var prodExp = {
                    productId: returnProductId(serviceContract.productExpenses[t]),
                    quantity: serviceContract.productExpenses[t].quantity,
                    salePrice: serviceContract.productExpenses[t].name.sale
                  };
                  servContract.productExpenses.push(prodExp);
                }
              }
            }

            sendContractUpdateRequest(servContract)
          }

       

          function sendContractUpdateRequest(servContract) {
            AgreementsService.updateContract(servContract, function (resp) {
              if (resp.message === 'Validation failed') {
                showCreateErrorWithTimeout()
              } else {
                $scope.closeModal();
              }
            })
          }
        }

        function createServiceContract(serviceContract) {
          $scope.showValidationFailMessage = false;
          if (serviceContract) {
            var servContract = {
              id: null,
              description: serviceContract.description,
              type: "SERVICE_CONTRACT",
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              customInterval: serviceContract.customInterval,
              billType: serviceContract.billType,
              companyId: returnCompanyId(),
              services: [],
              serviceContractServices: [],
              serviceExpenses: null,
              productExpenses: null,
              serviceContractServicesToTrack: [],
              contractWithBlockTime: false,
              taxIds: null,
              includedHours: null,
              rateExceeding: null,
              blockTimeServices: null
            };

            if(serviceContract.contractWithBlockTime && (servContract.billType === 'USER' || servContract.billType === 'DEVICE')) {
              servContract.contractWithBlockTime = serviceContract.contractWithBlockTime;
              servContract.includedHours = serviceContract.includedHours;
              servContract.rateExceeding = serviceContract.rateExceeding;
              servContract.blockRate = 0;
              servContract.blockTimeServices = [];

              if (serviceContract.taxes && serviceContract.taxes.length) {
                servContract.taxIds = [];
                for (var r = 0; r < serviceContract.taxes.length; r++) {
                  servContract.taxIds.push(serviceContract.taxes[r].id);
                }
              }
            }


            if (servContract.billType === 'OTHER') {
              servContract.serviceExpenses = [];
              servContract.productExpenses = []
            } else {
              servContract.invoiceAsSingleItem = serviceContract.invoiceAsSingleItem;
            }

            if ($scope.serviceContract.interval === 'MONTHLY' || $scope.serviceContract.interval === 'YEARLY') {
              servContract.interval = serviceContract.interval;
            } else {
              servContract.interval = null;
            }

            var sd = new Date($scope.serviceContract.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            servContract.startDate = $filter('date')(sd, 'yyyy/MM/dd');

            var ed = new Date($scope.serviceContract.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            servContract.endDate = $filter('date')(ed, 'yyyy/MM/dd');

            if(serviceContract.billType !== 'OTHER') {
              if(serviceContract.serviceContractServicesToTrack && serviceContract.serviceContractServicesToTrack.length) {
                for (var l=0; l<serviceContract.serviceContractServicesToTrack.length; l++) {
                  var scstt = {
                    name: serviceContract.serviceContractServicesToTrack[l].name,
                    rate: 0
                  };
                  if(serviceContract.contractWithBlockTime) {
                    servContract.blockTimeServices.push(scstt);
                  } else {
                    servContract.serviceContractServicesToTrack.push(scstt);
                  }

                }
              }
              if (serviceContract.services && serviceContract.services.length) {
                for (var i = 0; i < serviceContract.services.length; i++) {
                  var serv = {
                    name: serviceContract.services[i].nameValue || serviceContract.services[i].name,
                    rate: 0,
                    billable: serviceContract.services[i].billable,
                    taxIds: [],
                    basedOnDefault: true,
                    id: serviceContract.services[i].id.id,
                    commissionRate: serviceContract.services[i].commissionRate
                  };
                  if(serviceContract.services[i].billable) {
                    serv.rate = serviceContract.services[i].rate;
                    if (serviceContract.services[i].taxes && serviceContract.services[i].taxes.length) {
                      for (var n = 0; n < serviceContract.services[i].taxes.length; n++) {
                        serv.taxIds.push(serviceContract.services[i].taxes[n].id);
                      }
                    }
                  }
                  servContract.services.push(serv);
                }
              }
            }



            if(serviceContract.billType === 'DEVICE' && $scope.presettupDeviceServices.length>0) {
              for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                var dServ = {
                  name: $scope.presettupDeviceServices[d].name,
                  rate: $scope.presettupDeviceServices[d].rate,
                  count: $scope.presettupDeviceServices[d].count,
                  taxIds: []
                };
                if ($scope.presettupDeviceServices[d].taxes && $scope.presettupDeviceServices[d].taxes.length) {
                  for (var j = 0; j < $scope.presettupDeviceServices[d].taxes.length; j++) {
                    dServ.taxIds.push($scope.presettupDeviceServices[d].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(dServ);
              }
            }

            if(serviceContract.billType === 'USER' && $scope.presettupUsersServices.length>0) {
              for(var d=0; d<$scope.presettupUsersServices.length; d++) {
                var uServ = {
                  name: $scope.presettupUsersServices[d].name,
                  rate: $scope.presettupUsersServices[d].rate,
                  count: $scope.presettupUsersServices[d].count,
                  taxIds: []
                };
                if ($scope.presettupUsersServices[d].taxes && $scope.presettupUsersServices[d].taxes.length) {
                  for (var j = 0; j < $scope.presettupUsersServices[d].taxes.length; j++) {
                    uServ.taxIds.push($scope.presettupUsersServices[d].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(uServ);
              }
            }

            if (serviceContract.serviceContractServices && serviceContract.serviceContractServices.length) {
              for (var m = 0; m < serviceContract.serviceContractServices.length; m++) {
                var scs = {
                  name: serviceContract.serviceContractServices[m].name,
                  rate: serviceContract.serviceContractServices[m].rate,
                  count: serviceContract.serviceContractServices[m].count,
                  taxIds: []
                };
                if (serviceContract.serviceContractServices[m].taxes && serviceContract.serviceContractServices[m].taxes.length) {
                  for (var j = 0; j < serviceContract.serviceContractServices[m].taxes.length; j++) {
                    scs.taxIds.push(serviceContract.serviceContractServices[m].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(scs);
              }
            }

            if (serviceContract.serviceExpenses && serviceContract.serviceExpenses.length) {
              for (var u = 0; u < serviceContract.serviceExpenses.length; u++) {
                if (serviceContract.serviceExpenses[u] && serviceContract.serviceExpenses[u].name) {
                  var servExp = {
                    serviceId: serviceContract.serviceExpenses[u].name.serviceId,
                    quantity: serviceContract.serviceExpenses[u].quantity,// convertMinutesToHour(serviceContract.serviceExpenses[u].quantity),
                    description: serviceContract.serviceExpenses[u].description,
                    date: new Date(serviceContract.serviceExpenses[u].date).getTime()
                  };
                  servContract.serviceExpenses.push(servExp);
                }
              }
            }

            if (serviceContract.productExpenses && serviceContract.productExpenses.length) {
              for (var t = 0; t < serviceContract.productExpenses.length; t++) {
                if (serviceContract.productExpenses[t] && serviceContract.productExpenses[t].name) {
                  var prodExp = {
                    productId: returnProductId(serviceContract.productExpenses[t]),
                    quantity: serviceContract.productExpenses[t].quantity,
                    salePrice: serviceContract.productExpenses[t].name.sale
                  };
                  servContract.productExpenses.push(prodExp);
                }
              }
            }

            if(Utils.compareDateNowWithDate(serviceContract.startDate)) {
              askCreateBillableItemNow(servContract)
            } else {
              sendContractCreateRequest(servContract, false)
            }
          }

          function askCreateBillableItemNow(servContract) {
            var confirmMessage = 'Do we need to create the billable item now? ';
            var confirmButton = 'Yes, create';
            UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function(){
              sendContractCreateRequest(servContract, true);
            }, function() {
              sendContractCreateRequest(servContract, false)
            })
          }

          function sendContractCreateRequest(servContract, createBillableItem) {
            AgreementsService.createContract(servContract, createBillableItem, function (resp) {
              if (resp.message === 'Validation failed') {
                showCreateErrorWithTimeout()
              } else {
                $scope.closeModal();
              }
            })
          }
        }

        function returnProductId(productExpenses) {
          if(productExpenses.name && productExpenses.name.versionedId && productExpenses.name.versionedId.id) {
            return productExpenses.name.versionedId.id
          } else if(productExpenses.productId) {
            return productExpenses.productId
          }
        }

        $scope.refreshNewProductExpense = function(newServiceExpense) {
          $scope.newProductExpense = newServiceExpense
        };

        function showCreateErrorWithTimeout() {
          $scope.showValidationFailMessage = true;
          $timeout(function () {
            $scope.showValidationFailMessage = false;
          }, 4000);
        }

        function disableCreateButtonTimeout() {
          $scope.dissableCreateButton = true;
          $timeout(function () {
            $scope.dissableCreateButton = false;
          }, 4000);
        }
        function uuidv4() {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        $scope.validateAndUpdateServiceContract = function (serviceContract) {
       
        
          disableCreateButtonTimeout();
          if(checkForInvalidFields()) {
            $scope.notAddedServiceError = false;
            var emptyServices = true;
            var checkSCS = ($scope.NewServiceContractServices && $scope.NewServiceContractServices.name && $scope.NewServiceContractServices.name.length>0);
            var checkPE = ($scope.newProductExpense && $scope.newProductExpense.name && $scope.newProductExpense.name.description.length>0);
            var checkSE = ($scope.newServiceExpense && $scope.newServiceExpense.name && $scope.newServiceExpense.name.name.length>0);
            var checkServices = ($scope.newService && $scope.newService.nameValue && $scope.newService.nameValue.length>0);
            var checkSCSTT = ($scope.newServiceContractServicesToTrack && $scope.newServiceContractServicesToTrack.name && $scope.newServiceContractServicesToTrack.name.length)
            if($scope.serviceContract.billType === 'OTHER') {
              if(checkPE || checkSE) {
                emptyServices = false;
              }
              // if($scope.serviceContract.isAdditionalServices) {
              //   if(checkServices) {
              //     emptyServices = false;
              //   }
              // }
              // if(checkSCSTT) {
              //   emptyServices = false;
              // }
            } else {
              if(checkSCS) {
                emptyServices = false;
              }
              if($scope.serviceContract.isAdditionalServices) {
                if(checkServices) {
                  emptyServices = false;
                }
              }
              if(checkSCSTT) {
                emptyServices = false;
              }
            }

            validateServiceContractServices(serviceContract);
          }

          function validateServiceContractServices(serviceContract) {
            var listOfNames = [];
            var listOfAdditionalServicesNames = [];
            if (serviceContract.billType === 'DEVICE' || serviceContract.billType === 'USER') {
              for (var i = 0; i < serviceContract.serviceContractServices.length; i++) {
                listOfNames.push(checkNameForObject(serviceContract.serviceContractServices[i].name));
              }
              if(serviceContract.billType === 'DEVICE') {
                if($scope.presettupDeviceServices.length>0) {
                  for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                    listOfNames.push(checkNameForObject($scope.presettupDeviceServices[d].name));
                  }
                }

              } else if(serviceContract.billType === 'USER') {
                if($scope.presettupUsersServices.length>0) {
                  for(var u=0; u<$scope.presettupUsersServices.length; u++) {
                    listOfNames.push(checkNameForObject($scope.presettupUsersServices[u].name));
                  }
                }
              }
              if(serviceContract.serviceContractServicesToTrack.length>0) {
                for (var l = 0; l < serviceContract.serviceContractServicesToTrack.length; l++) {
                  listOfAdditionalServicesNames.push(checkNameForObject(serviceContract.serviceContractServicesToTrack[l].name));
                }
              }
              if(serviceContract.services.length>0) {
                for (var n = 0; n < serviceContract.services.length; n++) {
                  listOfAdditionalServicesNames.push(checkNameForObject(serviceContract.services[n].name));
                }
              }
            }


            if(listOfNames.length > 0) {
              validateListOfNames(listOfNames).then(function(resp) {
                if(resp) {
                  if (listOfAdditionalServicesNames.length>0) {
                    validateListOfNames(listOfAdditionalServicesNames).then(function (resp) {
                      if (resp) {
                        updateServiceContract(serviceContract);
                      }
                    })
                  } else {
                    updateServiceContract(serviceContract);
                  }
                }
              })
            } else {
              if(listOfAdditionalServicesNames.length>0) {
                validateListOfNames(listOfAdditionalServicesNames).then(function (resp) {
                  if (resp) {
                    updateServiceContract(serviceContract);
                  }
                })
              } else {
                updateServiceContract(serviceContract);
              }
            }
          }


        }

        $scope.validateAndCreateServiceContract = function (serviceContract) {
       
        
          disableCreateButtonTimeout();
          if(checkForInvalidFields()) {
            $scope.notAddedServiceError = false;
            var emptyServices = true;
            var checkSCS = ($scope.NewServiceContractServices && $scope.NewServiceContractServices.name && $scope.NewServiceContractServices.name.length>0);
            var checkPE = ($scope.newProductExpense && $scope.newProductExpense.name && $scope.newProductExpense.name.description.length>0);
            var checkSE = ($scope.newServiceExpense && $scope.newServiceExpense.name && $scope.newServiceExpense.name.name.length>0);
            var checkServices = ($scope.newService && $scope.newService.nameValue && $scope.newService.nameValue.length>0);
            var checkSCSTT = ($scope.newServiceContractServicesToTrack && $scope.newServiceContractServicesToTrack.name && $scope.newServiceContractServicesToTrack.name.length)
            if($scope.serviceContract.billType === 'OTHER') {
              if(checkPE || checkSE) {
                emptyServices = false;
              }
              // if($scope.serviceContract.isAdditionalServices) {
              //   if(checkServices) {
              //     emptyServices = false;
              //   }
              // }
              // if(checkSCSTT) {
              //   emptyServices = false;
              // }
            } else {
              if(checkSCS) {
                emptyServices = false;
              }
              if($scope.serviceContract.isAdditionalServices) {
                if(checkServices) {
                  emptyServices = false;
                }
              }
              if(checkSCSTT) {
                emptyServices = false;
              }
            }

            if(!emptyServices) {
              activateNotAddedServiceErrors();
              var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
              var confirmButton = 'Yes, create';
              UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function() {
                emptyServices = true;
                validateServiceContractServices(serviceContract);
              })
            } else {
              validateServiceContractServices(serviceContract);
            }
          }

          function validateServiceContractServices(serviceContract) {
            var listOfNames = [];
            var listOfAdditionalServicesNames = [];
            if (serviceContract.billType === 'DEVICE' || serviceContract.billType === 'USER') {
              for (var i = 0; i < serviceContract.serviceContractServices.length; i++) {
                listOfNames.push(checkNameForObject(serviceContract.serviceContractServices[i].name));
              }
              if(serviceContract.billType === 'DEVICE') {
                if($scope.presettupDeviceServices.length>0) {
                  for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                    listOfNames.push(checkNameForObject($scope.presettupDeviceServices[d].name));
                  }
                }

              } else if(serviceContract.billType === 'USER') {
                if($scope.presettupUsersServices.length>0) {
                  for(var u=0; u<$scope.presettupUsersServices.length; u++) {
                    listOfNames.push(checkNameForObject($scope.presettupUsersServices[u].name));
                  }
                }
              }
              if(serviceContract.serviceContractServicesToTrack.length>0) {
                for (var l = 0; l < serviceContract.serviceContractServicesToTrack.length; l++) {
                  listOfAdditionalServicesNames.push(checkNameForObject(serviceContract.serviceContractServicesToTrack[l].name));
                }
              }
              if(serviceContract.services.length>0) {
                for (var n = 0; n < serviceContract.services.length; n++) {
                  listOfAdditionalServicesNames.push(checkNameForObject(serviceContract.services[n].name));
                }
              }
            }


            if(listOfNames.length > 0) {
              validateListOfNames(listOfNames).then(function(resp) {
                if(resp) {
                  if (listOfAdditionalServicesNames.length>0) {
                    validateListOfNames(listOfAdditionalServicesNames).then(function (resp) {
                      if (resp) {
                        createServiceContract(serviceContract);
                      }
                    })
                  } else {
                    createServiceContract(serviceContract);
                  }
                }
              })
            } else {
              if(listOfAdditionalServicesNames.length>0) {
                validateListOfNames(listOfAdditionalServicesNames).then(function (resp) {
                  if (resp) {
                    createServiceContract(serviceContract);
                  }
                })
              } else {
                createServiceContract(serviceContract);
              }
            }
          }


        }

        function checkNameForObject(name) {
          if (typeof name === 'object') {
            return name.name;
          } else {
            return name;
          }
        }

        $scope.terminateAndCopyServiceContract = function () {
          AgreementsService.terminate($scope.editContract.id, function (resp) {
            $scope.action = 'COPY';
            $scope.editContract.description = $scope.editContract.description + ' COPY';
            $scope.modlToShow = $scope.editContract.type;
            $scope.editMode = true;
            

            $scope.editService = { taxes: [] };
            var d = new Date($scope.editContract.startDate);
         
         //   $scope.editContract.startDate = $filter('date')(Date.now(), 'dd MMM yyyy');
          /*  $scope.editContract.serviceExpenses.forEach((item) => {
             item.date = $filter('date')(Date.now(), 'dd MMM yyyy');
              item.startDate =  $scope.editContract.startDate;
            })*/
         
            console.log('$scope.editContract',$scope.editContract);
            console.log('$scope.serviceContract',$scope.serviceContract);
            // if (d.getTime() < $scope.today) {
            //   $scope.editContract.startDate = '';
            //   $scope.editContract.endDate = '';
            // }
            $scope.$apply();
           // $rootScope.$broadcast('terminateAndCopy', null);
          })
        };



      }])

}());
