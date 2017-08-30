'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService', 'ProductsService',
      function ($scope, AgreementsService, CompaniesService, ServicesService, ProductsService) {

        $scope.intervals = ['YEARLY', 'MONTHLY'];
        $scope.serviceContractType = {
          DEVICE: 'By Device',
          USER: 'By Users',
          OTHER: 'Other'
        };
        $scope.serviceContract = {
          contractType: ''
        };

        $scope.deviceServiceList = [];
        $scope.usersServiceList = [];

        $scope.defaultServices = [];
        $scope.defaultProducts = [];

        $scope.openedTab = 'product';


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
          $scope.deviceServiceList.push(device);
        }

        $scope.addNewDevice = function () {
          createNewDevice();
        };

        $scope.deleteDevice = function (device) {
          for (var i = 0; i < $scope.deviceServiceList.length; i++) {
            if ($scope.deviceServiceList[i] == device) {
              $scope.deviceServiceList.splice(i, 1);
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
          $scope.usersServiceList.push(device);
        }

        $scope.addNewUser = function () {
          createNewUser();
        };

        $scope.deleteUser = function (user) {
          for (var i = 0; i < $scope.usersServiceList.length; i++) {
            if ($scope.usersServiceList[i] == user) {
              $scope.usersServiceList.splice(i, 1);
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
