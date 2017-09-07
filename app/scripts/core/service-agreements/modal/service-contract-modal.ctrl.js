'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService', 'ProductsService', '$filter', '$timeout',
      function ($scope, AgreementsService, CompaniesService, ServicesService, ProductsService, $filter, $timeout) {

        $scope.intervals = ['YEARLY', 'MONTHLY'];
        $scope.serviceContractType = {
          DEVICE: 'By Device',
          USER: 'By Users',
          OTHER: 'Other'
        };
        $scope.serviceContract = {
          contractType: '',
          minStartDate: Date.now(),
          includedHours: null,
          blockRate: null,
          interval: "MONTHLY",
          deviceServiceList: [],
          usersServiceList: [],
          serviceExpences: [],
          productExpences: []
        };
        $scope.reInitEndDate = true;

        // $scope.deviceServiceList = [];
        // $scope.usersServiceList = [];

        $scope.defaultServices = [];
        $scope.defaultProducts = [];

        $scope.openedTab = 'product';

        var day = 1000 * 60 * 60 * 24;
        var month = 30*day;

        $scope.serviceContract.minEndDate = $scope.serviceContract.minStartDate + month;
        $scope.serviceContract.endDate = $scope.serviceContract.minStartDate + month;


        $scope.serviceContract.period = $scope.serviceContract.interval === 'MONTHLY' ? 'Month' : 'Year';

        function changeStartDate(){
          var date = $scope.serviceContract.startDate;
          var endDate = new Date(date);
          //console.log('endDate.getMonth() ', date.getMonth());
          endDate.setMonth(endDate.getMonth() + 1);

          //console.log(date);

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
          $scope.serviceContract.period = interval === 'MONTHLY' ? 'Month' : 'Year';
        });

        $scope.$watch(function () {
          return $scope.serviceContract.startDate;
        }, function(){
          changeStartDate()
        });


        ServicesService.getServicesData($scope, false, function (data) {
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
          $scope.serviceContract.contractType = type;
        };


        createNewDevice();

        function createNewDevice() {
          var device = {
            deviceName: null,
            deviceNumber: null,
            deviceCost: null
          };
          $scope.serviceContract.deviceServiceList.push(device);
        }

        $scope.addNewDevice = function () {
          createNewDevice();
        };

        $scope.deleteDevice = function (device) {
          for (var i = 0; i < $scope.serviceContract.deviceServiceList.length; i++) {
            if ($scope.serviceContract.deviceServiceList[i] == device) {
              $scope.serviceContract.deviceServiceList.splice(i, 1);
              break;
            }
          }
        };


        createNewUser();

        function createNewUser() {
          var device = {
            userName: null,
            userNumber: null,
            userCost: null
          };
          $scope.serviceContract.usersServiceList.push(device);
        }

        $scope.addNewUser = function () {
          createNewUser();
        };

        $scope.deleteUser = function (user) {
          for (var i = 0; i < $scope.serviceContract.usersServiceList.length; i++) {
            if ($scope.serviceContract.usersServiceList[i] == user) {
              $scope.serviceContract.usersServiceList.splice(i, 1);
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
          $scope.serviceContract.serviceExpences.push(newServiceExpense);
        };

        $scope.addServiceExpense();

        $scope.deleteServiceExpense = function(service) {
          for (var i = 0; i < $scope.serviceContract.serviceExpences.length; i++) {
            if ($scope.serviceContract.serviceExpences[i] == service) {
              $scope.serviceContract.serviceExpences.splice(i, 1);
              break;
            }
          }
        };

        $scope.addProductExpense = function() {
          var newProductExpense = {};
          $scope.serviceContract.productExpences.push(newProductExpense);
        };

        $scope.addProductExpense();

        $scope.deleteProductExpense = function(product) {
          for (var i = 0; i < $scope.serviceContract.productExpences.length; i++) {
            if ($scope.serviceContract.productExpences[i] == product) {
              $scope.serviceContract.productExpences.splice(i, 1);
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
              interval: serviceContract.interval,
              customInterval: null,
              billType: serviceContract.contractType,
              companyId: $scope.companyId || $scope.contractCompany.id,
              services: [],
              serviceContractServices: [],
              serviceExpenses: [],
              productExpenses: []
            };


            AgreementsService.createContract(servContract, function (resp) {
              console.log(resp);
              $scope.closeModal();
            })
          }
        }


      }])

}());
