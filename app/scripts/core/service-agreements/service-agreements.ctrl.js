'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', 'AgreementsService','CompaniesService',
      function ($scope, $uibModal, AgreementsService, CompaniesService) {

        $scope.parseDate = Date.parse.bind(Date);
        $scope.filterType = 'company.name';

        AgreementsService.getAllServiceAgreements(function (data) {
          $scope.agreementsList = [];
          for(var i=0; i<data.length; i++) {
            var agreement = data[i];
            agreement.company.name = getCompanyName(data[i].company.id);
            $scope.agreementsList.push(agreement)
          }

        });

        $scope.allCompnaies = CompaniesService.getAllCompanies();

        function getCompanyName(id) {
          for(var i=0; i<$scope.allCompnaies.length; i++) {
            if($scope.allCompnaies[i].id === id) {
              return $scope.allCompnaies[i].name;
            }
          }
        }

        $scope.changeFilterType = function(type) {
          if($scope.filterType === type) {
            $scope.filterType = "-"+$scope.filterType;
          } else {
            $scope.filterType = type;
          }
        };

        $scope.getDateInCorrectFormat = function(date) {
          var newDate = new Date(date);
          if (newDate) {
            var endMonth = newDate.getMonth() + 1;
            var correctDate = addZeroIfNeed(newDate.getDate()) + "/"+ addZeroIfNeed(endMonth) +"/"+ newDate.getFullYear();
          }
          return correctDate;
        };

        function addZeroIfNeed(n) {
          return n < 10 ? '0' + n : '' + n;
        }


        $scope.openAgreementsModal = function (contractType, editMode, agreementId) {
          var companyForReadOnlyMode = {};
          if(agreementId) {
            AgreementsService.getAgreement(agreementId, function(resp) {
              console.log(resp);
              companyForReadOnlyMode = resp;
              openModal(contractType, editMode, companyForReadOnlyMode)
            })
          } else {
            openModal(contractType, editMode, companyForReadOnlyMode)
          }

          function openModal(contractType, editMode, companyForReadOnlyMode) {
            var template;
            switch (contractType) {
              case('CREATE_NEW'):
                template = '/html/scripts/core/service-agreements/modal/create-new-modal.tpl.html';
                break;
              case('HOURLY'):
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
                companyData: {
                  editMode: editMode,
                  companyForReadOnlyMode: companyForReadOnlyMode
                }
              }

            });
          }


        };

      }]).controller('serviceAgreementsModalCtrl', [
    '$scope', '$uibModalInstance', 'companyData', '$state',
    'ServicesService', 'CompaniesService', 'TaxesService', 'AgreementsService',
    function ($scope, $uibModalInstance, companyData, $state, ServicesService, CompaniesService, TaxesService, AgreementsService) {

      if(companyData.editMode) {
        $scope.editContract = {};
        $scope.editContract.services = [];
        ServicesService.getServicesData($scope, false, function (data) {

          for (var i = 0; i < data.length; i++) {
            var serv = {
              name: data[i].name,
              rate: data[i].rate,
              billable: data[i].billable,
              taxes: data[i].taxes || []
            };
            $scope.editContract.services.push(serv);
          }

        });
      } else {
        console.log(companyData);
        $scope.editContract = companyData.companyForReadOnlyMode;
      }


      $scope.companyId = companyData.companyId;
      $scope.companyInfo = companyData.companyInfo;
      $scope.companiesList = CompaniesService.getClientCompanies();
      $scope.taxes = TaxesService.getAll();
      $scope.selectedContractType = 'CREATE_NEW';
      $scope.modlToShow = 'CREATE_NEW';
      $scope.blockHourlyChoice = false;

      $scope.today = Date.now();
      $scope.minDateForEndDatePicker;

      $scope.editMode = true;

      if(companyData.editMode === false) {
        $scope.editMode = false;
      }

      $scope.editService={
        name: '',
        rate: null,
        billable: false,
        taxes: []
      };

      $scope.$watch(function () {
        return $scope.contractCompany;
      }, function (company) {
        $scope.blockHourlyChoice = false;
        if(company) {
          AgreementsService.getAgreementCountByType(company.id, 'HOURLY', function(resp) {

            if(resp.HOURLY > 0) {
              $scope.blockHourlyChoice = true;
              if($scope.selectedContractType === 'HOURLY') {
                $scope.selectedContractType = 'CREATE_NEW';
              }
            }
          })
        }
      });



      $scope.serviceBillType = {
        byDevice: 'By Device',
        byUsers: 'By Users'
      };

      function setMiNDateForEndDate(date) {
        var d = new Date(date);
        d.setDate(d.getDate() + 30);
        $scope.minDateForEndDatePicker = d.getTime();
      }

      $scope.startDatePicker = function(date) {
        var startDate = new Date(date);
        if (startDate) {
          var startMonth = startDate.getMonth() + 1;
          $scope.editContract.startDate = startDate.getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(startDate.getDate());
        }
        setMiNDateForEndDate(date);
      };

      $scope.endDatePicker = function(date) {
        var endDate = new Date(date);
        if (endDate) {
          var endMonth = endDate.getMonth() + 1;
          $scope.editContract.endDate = endDate.getFullYear() + "/" + addZeroIfNeed(endMonth) + "/" + addZeroIfNeed(endDate.getDate());
        }
      };

      function addZeroIfNeed(n) {
        return n < 10 ? '0' + n : '' + n;
      }


      $scope.changeModalToShow = function() {
        $scope.modlToShow = $scope.selectedContractType
      };

      $scope.selectContractType = function(type) {
        if($scope.selectedContractType === type) {
          $scope.selectedContractType = 'CREATE_NEW';
        }else {
          $scope.selectedContractType = type;
        }
      };

      // $scope.changeContractType = function (type) {
      //   $scope.serviceContracts.contractType = type;
      // };

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
            billable: editService.billable || false,
            taxes: editService.taxes || []
          };
          $scope.editContract.services.push(newSerice);
          $scope.editService = {};
        }
      };

      $scope.deleteService = function (service) {
        for (var i = 0; i < $scope.editContract.services.length; i++) {
          if ($scope.editContract.services[i] == service) {
            $scope.editContract.services.splice(i, 1);
            break;
          }
        }
      };


      $scope.validateServiceName = function (ngModelCtrl, modelId, afterValidationCallback) {
        ServicesService.isNameUnique(ngModelCtrl.$viewValue, modelId, function (resp) {
          ngModelCtrl.$setValidity('unique', resp.valid);
          afterValidationCallback();
        });
      };

      $scope.isShowingErrors = function (form, fieldName) {
        return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && form[fieldName].$invalid;
      };


      $scope.createContract = function() {
        var companyContractInfo = {
          description: $scope.editContract.description,
          startDate: $scope.editContract.startDate,
          endDate: $scope.editContract.endDate,
          companyId: companyData.companyId ||  $scope.contractCompany.id,
          services: $scope.editContract.services,
          type: companyData.type || $scope.modlToShow
        };

        console.log(companyContractInfo);
        AgreementsService.createContract(companyContractInfo, function(resp) {
          console.log(resp);
          $scope.closeModal();
        })
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
