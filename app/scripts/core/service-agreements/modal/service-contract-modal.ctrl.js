'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      'ProductsService', '$filter', '$timeout', 'TaxesService',
      function ($scope, AgreementsService, CompaniesService, ServicesService, ProductsService, $filter, $timeout, TaxesService) {

        $scope.intervals = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days', '1 day'];
        $scope.serviceContractType = {
          DEVICE: 'By Device',
          USER: 'By Users',
          OTHER: 'Other'
        };

        $scope.taxes = TaxesService.getAll();

        $scope.reInitEndDate = true;

        $scope.defaultServices = [];
        $scope.defaultProducts = [];

        $scope.openedTab = 'product';

        var day = 1000 * 60 * 60 * 24;
        var month = 30*day;

        if($scope.editMode) {
          $scope.serviceContract = {
            billType: '',
            minStartDate: Date.now(),
            includedHours: null,
            blockRate: null,
            interval: "MONTHLY",
            serviceContractServices: [],
            services: [],
            serviceExpenses: [],
            productExpenses: []
          };
        } else {
          $scope.serviceContract = angular.copy($scope.editContract);
        }

        $scope.serviceContract.minEndDate = $scope.serviceContract.minStartDate + month;
        $scope.serviceContract.endDate = $scope.serviceContract.minStartDate + month;


        // $scope.serviceContract.period = $scope.serviceContract.interval === 'MONTHLY' ? 'Month' : 'Year';
        presettupPeriod();

        function presettupPeriod() {
          if($scope.serviceContract.interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
          } else if($scope.serviceContract.interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
          }  else {
            $scope.serviceContract.period = $scope.serviceContract.customInterval;
          }
        }

        function changeStartDate(){
          changeMinEndDate($scope.serviceContract.period);
        }

        function changeMinEndDate(period) {
          var date = $scope.serviceContract.startDate;
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
          $scope.serviceContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          $scope.serviceContract.minEndDate = $filter('date')(endDate, 'dd MMM yyyy');
          reInitEndDate()
        }

        function reInitEndDate() {
          $scope.reInitEndDate = false;
          $timeout(function () {
            $scope.reInitEndDate = true;
          }, 0);
        }



        $scope.$watch(function (){
          return $scope.serviceContract.interval;
        }, function(interval){

          if (interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
            $scope.serviceContract.interval = 'MONTHLY';
            $scope.serviceContract.customInterval = null;
          } else if (interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
            $scope.serviceContract.interval = 'YEARLY';
            $scope.serviceContract.customInterval = null;
          } else if (interval === '30 days') {
            $scope.serviceContract.period = 30;
            $scope.serviceContract.customInterval = 30;
          } else if (interval === '15 days') {
            $scope.serviceContract.period = 15;
            $scope.serviceContract.customInterval = 15;
          } else if (interval === '7 days') {
            $scope.serviceContract.period = 7;
            $scope.serviceContract.customInterval = 7;
          } else if(interval === '1 day') {
            $scope.serviceContract.period = 1;
            $scope.serviceContract.customInterval = 1;
          }
          changeMinEndDate($scope.serviceContract.period);
          reInitEndDate()
        });

        $scope.$watch(function () {
          return $scope.serviceContract.startDate;
        }, function(){
          changeStartDate()
        });


        ServicesService.getServicesData($scope, function (data) {
          console.log('dataServices ', data);
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
        });


        ProductsService.getProductsByCompany($scope, $scope.contractCompany.id, function (data) {
          console.log('products ', data);
          for (var i = 0; i < data.length; i++) {
            var serv = {
              name: data[i].description,
              productId: data[i].versionedId.id,
              quantity: 0,
              salePrice: 0
            };

            $scope.defaultProducts.push(serv);
          }
        });


        $scope.changeContractType = function (type) {
          $scope.serviceContract.billType = type;
        };


        createNewDevice();

        function createNewDevice() {
          var device = {
            name: null,
            count: null,
            rate: null,
            taxIds: [],
            taxes: []
          };
          $scope.serviceContract.serviceContractServices.push(device);
        }

        $scope.addNewDevice = function () {
          createNewDevice();
        };

        $scope.deleteDevice = function (device) {
          for (var i = 0; i < $scope.serviceContract.serviceContractServices.length; i++) {
            if ($scope.serviceContract.serviceContractServices[i] == device) {
              $scope.serviceContract.serviceContractServices.splice(i, 1);
              break;
            }
          }
        };


        createNewUser();

        function createNewUser() {
          var device = {
            name: null,
            rate: null,
            billable: false,
            taxIds: [],
            taxes: []
          };
          $scope.serviceContract.services.push(device);
        }

        $scope.addNewUser = function () {
          createNewUser();
        };

        $scope.deleteUser = function (user) {
          for (var i = 0; i < $scope.serviceContract.services.length; i++) {
            if ($scope.serviceContract.services[i] == user) {
              $scope.serviceContract.services.splice(i, 1);
              break;
            }
          }
        };


        $scope.setOpenedTab = function(tab) {
          $scope.openedTab = tab;
        };

        $scope.isTabOpened = function(tab) {
          return $scope.openedTab === tab
        };

        $scope.addServiceExpense = function() {
          var newServiceExpense = {};
          $scope.serviceContract.serviceExpenses.push(newServiceExpense);
        };

        $scope.addServiceExpense();

        $scope.deleteServiceExpense = function(service) {
          for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
            if ($scope.serviceContract.serviceExpenses[i] == service) {
              $scope.serviceContract.serviceExpenses.splice(i, 1);
              break;
            }
          }
        };

        $scope.addProductExpense = function() {
          var newProductExpense = {};
          $scope.serviceContract.productExpenses.push(newProductExpense);
        };

        $scope.addProductExpense();

        $scope.deleteProductExpense = function(product) {
          for (var i = 0; i < $scope.serviceContract.productExpenses.length; i++) {
            if ($scope.serviceContract.productExpenses[i] == product) {
              $scope.serviceContract.productExpenses.splice(i, 1);
              break;
            }
          }
        };



        $scope.createServiceContract = function (form, serviceContract) {
          if (form.$valid) {
            var servContract = {
              id: null,
              description: serviceContract.description,
              type: "SERVICE_CONTRACT",
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              customInterval: serviceContract.customInterval,
              billType: serviceContract.contractType,
              companyId: $scope.companyId || $scope.contractCompany.id || $scope.serviceContract.companyId,
              services: [],
              serviceContractServices: [],
              serviceExpenses: [],
              productExpenses: []
            };

            if($scope.serviceContract.interval == 'MONTHLY' || $scope.serviceContract.interval == 'YEARLY') {
              servContract.interval = serviceContract.interval;
            } else {
              servContract.interval = null;
            }

            var sd = new Date($scope.serviceContract.startDate);
            sd.setHours(0,0,0,0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            servContract.startDate = sd.getTime();

            var ed = new Date($scope.serviceContract.endDate);
            ed.setHours(0,0,0,0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            servContract.endDate = ed.getTime();

            if(serviceContract.services && serviceContract.services.length) {
              for(var i=0; i<serviceContract.services.length; i++) {
                var serv = {
                  name: serviceContract.services[i].name,
                  rate: serviceContract.services[i].rate,
                  billable: serviceContract.services[i].billable,
                  taxIds: []
                };
                if(serviceContract.services[i].taxes && serviceContract.services[i].taxes.length) {
                  for(var n=0; n<serviceContract.services[i].taxes.length; n++) {
                    serv.taxIds.push(serviceContract.services[i].taxes[n].id);
                  }
                }
                servContract.services.push(serv);
              }
            }

            if(serviceContract.serviceContractServices && serviceContract.serviceContractServices.length) {
              for(var m=0; m<serviceContract.serviceContractServices.length; m++) {
                var scs = {
                  name: serviceContract.serviceContractServices[m].name,
                  rate: serviceContract.serviceContractServices[m].rate,
                  count: serviceContract.serviceContractServices[m].count,
                  taxIds: []
                };
                if(serviceContract.serviceContractServices[m].taxes && serviceContract.serviceContractServices[m].taxes.length) {
                  for(var j=0; j<serviceContract.serviceContractServices[m].taxes.length; j++) {
                    scs.taxIds.push(serviceContract.serviceContractServices[m].taxes[j].id);
                  }
                }
                servContract.services.push(scs);
              }
            }

            if(serviceContract.serviceExpenses && serviceContract.serviceExpenses.length) {
              for(var u=0; u<serviceContract.serviceExpenses.length; u++) {
                var servExp = {
                  serviceId: serviceContract.serviceExpeses[u].name.serviceId,
                  quantity: serviceContract.serviceExpeses[u].quantuty,
                  description: serviceContract.serviceExpeses[u].description,
                  date: new Date(serviceContract.serviceExpeses[u].date).getTime()
                };
                servContract.serviceExpenses.push(servExp);
              }
            }

            if(serviceContract.productExpenses && serviceContract.productExpenses.length) {
              for(var t=0; t<serviceContract.productExpenses.length; t++) {
                var prodExp = {
                  productId: serviceContract.productExpenses[t].name.productId,
                  quantity: serviceContract.productExpenses[t].quantity,
                  salePrice: serviceContract.productExpenses[t].salePrice
                };
                servContract.productExpenses.push(prodExp);
              }
            }

            console.log(servContract);


            AgreementsService.createContract(servContract, function (resp) {
              console.log(resp);
              $scope.closeModal();
            })
          }
        }


      }])

}());
