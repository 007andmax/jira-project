'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', 'AgreementsService',
      function ($scope, $uibModal, AgreementsService) {

        AgreementsService.getAllServiceAgreements(function (data) {
          //console.log(data);
          $scope.agreementsList = data;
        });

        $scope.openAgreementsModal = function (contractType) {
          var template;
          switch (contractType) {
            case('CREATE_NEW'):
              template = '/html/scripts/core/service-agreements/modal/create-new-modal.tpl.html';
              break;
            case('HOURLY_BILLING'):
              template = '/html/scripts/core/service-agreements/modal/hourly-service-modal.tpl.html';
              break;
            case('BLOCK_TIME_BILLING'):
              template = '/html/scripts/core/service-agreements/modal/service-contract-modal.tpl.html';
              break;
            case('PER_USER/DEVICE_BILLING'):
              template = '';
              break;
            default:
              console.log('no contract type selected');
          }
          $uibModal.open({
            templateUrl: template,
            animation: true,
            backdrop: false,
            size: 'lg',
            controller: 'serviceAgreementsModalCtrl',
            windowClass: 'create-popup margin-top-modal-dialog',
            resolve: {
              companyInfo: {},
              companyId: {}
            }

          });

        };

      }]).controller('serviceAgreementsModalCtrl', [
    '$scope', '$uibModalInstance', 'companyInfo', 'companyId', '$state', 'ServicesService', 'CompaniesService',
    function ($scope, $uibModalInstance, companyInfo, companyId, $state, ServicesService, CompaniesService) {


      $scope.serviceContracts = {};

      $scope.companyId = companyId;
      $scope.companyInfo = companyInfo;
      $scope.contractServiceList = [];
      $scope.companiesList = CompaniesService.getClientCompanies();
      $scope.serviceContracts.contractType = '';
      $scope.selectedContractType = 'CREATE_NEW';
      $scope.modlToShow = 'CREATE_NEW';

      ServicesService.getServicesData($scope, false, function (data) {

        for (var i = 0; i < data.length; i++) {
          var serv = {
            name: data[i].name,
            rate: data[i].rate,
            billable: data[i].billable
          };
          $scope.contractServiceList.push(serv);
        }

      });

      $scope.serviceBillType = {
        byDevice: 'By Device',
        byUsers: 'By Users'
      };

      $scope.startDatePicker = function(date) {
        console.log(date);
      };

      $scope.endDatePicker = function(date) {
        console.log(date)
      };


      $scope.changeModalToShow = function() {
        $scope.modlToShow = $scope.selectedContractType
      };

      $scope.selectContractType = function(type) {
        if($scope.selectedContractType === type) {
          $scope.selectedContractType = '';
        }else {
          $scope.selectedContractType = type;
        }
      };

      $scope.changeContractType = function (type) {
        $scope.serviceContracts.contractType = type;
      };

      $scope.closeModal = function () {
        $uibModalInstance.close();
        if (!$state.includes('service-agreements')) {
          $state.go('service-agreements');
        }
      };

      $scope.addNewService = function (form, editService) {
        if (form.$valid) {
          var newSerice = {
            name: editService.name,
            rate: editService.rate || 0.00,
            billable: editService.billable || false
          };
          //console.log(newSerice);
          $scope.editService = {};
          $scope.contractServiceList.push(newSerice);
        }
      };

      $scope.validateServiceName = function (ngModelCtrl, modelId, afterValidationCallback) {
        ServicesService.isNameUnique($scope.editService.name, modelId, function (resp) {
          ngModelCtrl.$setValidity('unique', resp.valid);
          afterValidationCallback();
        });
      };

      $scope.isShowingErrors = function (form, fieldName) {
        return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && form[fieldName].$invalid;
      };

      $scope.deleteService = function (service) {
        for (var i = 0; i < $scope.contractServiceList.length; i++) {
          if ($scope.contractServiceList[i] == service) {
            $scope.contractServiceList.splice(i, 1);
            break;
          }
        }
      };

      // $scope.deviceServiceList=[];
      // createNewDevice();
      //
      // function createNewDevice() {
      //   var device ={
      //     deviceName: null,
      //     deviceNumber: null,
      //     deviceCost: null
      //   };
      //   $scope.deviceServiceList.push(device);
      // }
      // $scope.addNewDevice = function() {
      //   createNewDevice();
      // };

      // $scope.deleteDevice = function(device){
      //   for(var i=0; i<$scope.deviceServiceList.length; i++) {
      //     if($scope.deviceServiceList[i] == device) {
      //       $scope.deviceServiceList.splice(i, 1);
      //       break;
      //     }
      //   }
      // };

      $uibModalInstance.closed.then(function () {

        if (!$state.includes('service-agreements')) {
          $state.go('service-agreements');
        }
      });


    }
  ])

}());
