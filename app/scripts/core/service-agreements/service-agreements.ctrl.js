'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', function ($scope, $uibModal) {

    $scope.openAgreementsModal = function() {
      $uibModal.open({
        templateUrl:'/html/scripts/core/service-agreements/service-contract-modal.tpl.html',
        animation: true,
        backdrop: true,
        size: 'lg',
        controller: 'serviceAgreementsModalCtrl',
        windowClass: 'create-popup margin-top-modal-dialog',

      });
    };


    }]).controller('serviceAgreementsModalCtrl', [
      '$scope', '$uibModalInstance', function($scope, $uibModalInstance){

      //$scope.serviceBillType = ['By Device', 'By Users'];

      $scope.serviceContracts={};

      $scope.serviceBillType = {
        byDevice: 'By Device',
        byUsers: 'By Users'
      };
      $scope.serviceContracts.contractType ='';

      $scope.changeCOntractType = function(type) {
        $scope.serviceContracts.contractType = type;
      };

      $scope.closeModal = function () {
        $uibModalInstance.close();
      };

      $scope.contactServiceList=[];
      createNewServiceItem();

      function createNewServiceItem() {
        var item ={
          serviceName: null,
          perHour: null,
          isBillable: false
        };
        $scope.contactServiceList.push(item);
      }

      $scope.addNewService = function() {
        createNewServiceItem();
      };

      $scope.deleteService = function(service){
        for(var i=0; i<$scope.contactServiceList.length; i++) {
          if($scope.contactServiceList[i] == service) {
            $scope.contactServiceList.splice(i, 1);
            break;
          }
        }
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






    }
  ])

}());
