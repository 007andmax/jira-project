'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', function ($scope, $uibModal) {

    $scope.openAgreementsModal = function() {
      $uibModal.open({
        templateUrl:'/html/scripts/core/service-agreements/service-agreements-modal.tpl.html',
        animation: true,
        backdrop: false,
        size: 'lg',
        controller: 'serviceAgreementsModalCtrl'

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
      $scope.serviceContracts.contractType ='byDevice';

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
      }



    }
  ])

}());
