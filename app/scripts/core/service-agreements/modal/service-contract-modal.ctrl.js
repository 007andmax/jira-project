'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      function ($scope, AgreementsService, CompaniesService, ServicesService) {

        $scope.intervals = ['YEARLY', 'MONTHLY'];
        $scope.serviceBillType = {
          byDevice: 'By Device',
          byUsers: 'By Users'
        };
        $scope.serviceContract = {
          contractType: ''
        };

        $scope.changeContractType = function (type) {
          $scope.serviceContract.contractType = type;
        };

        $scope.deviceServiceList=[];
        createNewDevice();

        function createNewDevice() {
          var device ={
            deviceName: null,
            deviceNumber: null,
            deviceCost: null
          };
          $scope.deviceServiceList.push(device);
        }
        $scope.addNewDevice = function() {
          createNewDevice();
        };

        $scope.deleteDevice = function(device){
          for(var i=0; i<$scope.deviceServiceList.length; i++) {
            if($scope.deviceServiceList[i] == device) {
              $scope.deviceServiceList.splice(i, 1);
              break;
            }
          }
        };


      }])

}());
