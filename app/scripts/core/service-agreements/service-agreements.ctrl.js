'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', function ($scope, $uibModal) {

    $scope.openAgreementsModal = function() {
      $uibModal.open({
        templateUrl:'/html/scripts/core/service-agreements/modal/hourly-service-modal.tpl.html',
        animation: true,
        backdrop: false,
        size: 'lg',
        controller: 'serviceAgreementsModalCtrl',
        windowClass: 'create-popup margin-top-modal-dialog',
        resolve: {
          companyInfo: {}
        }

      });

    };

    }]).controller('serviceAgreementsModalCtrl', [
      '$scope', '$uibModalInstance', 'companyInfo', '$state', 'ServicesService',
    function($scope, $uibModalInstance, companyInfo, $state, ServicesService){

      //$scope.serviceBillType = ['By Device', 'By Users'];

      $scope.serviceContracts={};

      $scope.companyInfo = companyInfo;
      $scope.contactServiceList=[];

      ServicesService.getServicesData($scope, false, function(data) {

        for(var i=0; i<data.length; i++) {
          $scope.contactServiceList.push(data[i]);
        }
        $scope.companyId = data[0].company.id;

      });

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
        if(!$state.includes('service-agreements')) {
          $state.go('service-agreements');
        }
      };


      // createNewServiceItem();
      //
      // function createNewServiceItem() {
      //   var item ={
      //     serviceName: null,
      //     perHour: null,
      //     isBillable: false
      //   };
      //   $scope.contactServiceList.push(item);
      // }

      $scope.addNewService = function(form,  editService) {
        if(form.$valid) {
          var newSerice ={
            name: editService.name,
            rate: editService.rate || 0.00,
            billable: editService.billable || false
          };
          console.log(newSerice);
          $scope.editService = {};
          $scope.contactServiceList.push(newSerice);
        }
        //console.log(editService);

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

      $uibModalInstance.closed.then(function(){

        if(!$state.includes('service-agreements')) {
          $state.go('service-agreements');
        }
      });




    }
  ])

}());
