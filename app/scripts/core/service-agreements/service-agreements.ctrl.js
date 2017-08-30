'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', 'AgreementsService','CompaniesService',
      function ($scope, $uibModal, AgreementsService, CompaniesService) {

        $scope.parseDate = Date.parse.bind(Date);
        $scope.filterType = 'company.name';

        AgreementsService.getAllServiceAgreements($scope, function (data) {
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
                template = '/html/scripts/core/service-agreements/modal/block-time-billing-modal.tpl.html';
                break;
              case('PER_USER/DEVICE_BILLING'):
                template = '/html/scripts/core/service-agreements/modal/service-contract-modal.tpl.html';
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

      $scope.taxes = TaxesService.getAll();
      $scope.companyId = companyData.companyId;
      $scope.companyInfo = companyData.companyInfo;
      $scope.companiesList = CompaniesService.getClientCompanies();

      $scope.selectedContractType = 'CREATE_NEW';
      $scope.modlToShow = 'CREATE_NEW';
      $scope.blockHourlyChoice = false;

      $scope.today = Date.now();

      $scope.minDateForEndDatePicker;
      setMiNDateForEndDate($scope.today);

      $scope.editMode = true;

      if(companyData.editMode) {

        $scope.editContract = {};
        $scope.editContract.services = [];

        ServicesService.getServicesData($scope, false, function (data) {
          for (var i = 0; i < data.length; i++) {
            var serv = {
              name: data[i].name,
              rate: data[i].rate,
              billable: data[i].billable,
              taxes: data[i].taxes || [],
              taxIds: data[i].taxIds || []
            };
            if(data[i].taxIds && data[i].taxIds.length) {
              for(var m=0; m<data[i].taxIds.length; m++) {
                serv.taxIds.push(data[i].taxes[m].id)
              }
            }
            $scope.editContract.services.push(serv);
          }
        });

      } else {
        console.log(companyData);
        $scope.editContract = companyData.companyForReadOnlyMode;

        //create tax object by comparing taxIds and array of taxes
        for(var e=0; e<$scope.editContract.services.length; e++) {
          $scope.editContract.services[e].taxes = [];
          for(var i=0; i<$scope.editContract.services[e].taxIds.length; i++) {
            for(var m=0; m<$scope.taxes.length; m++) {
              if($scope.editContract.services[e].taxIds[i] === $scope.taxes[m].id) {
                $scope.editContract.services[e].taxes.push($scope.taxes[m]);
                console.log($scope.editContract.services[e])
              }
            }
          }
        }
      }


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

      function setMiNDateForEndDate(date) {
        var d = new Date(date);
        d.setDate(d.getDate() + 30);
        $scope.minDateForEndDatePicker = d.getTime();
        console.log($scope.minDateForEndDatePicker);
      }


      $scope.startDatePicker = function(date) {
        var startDate = new Date(date);
        if (startDate) {
          var startMonth = startDate.getMonth() + 1;
          $scope.editContract.startDate = startDate.getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(startDate.getDate());
          $scope.startDate =  $scope.editContract.startDate;
        }
        var f = new Date(date);

        setMiNDateForEndDate(f.getTime());
      };

      $scope.endDatePicker = function(date) {
        var endDate = new Date(date);
        if (endDate) {
          var endMonth = endDate.getMonth() + 1;
          $scope.editContract.endDate = endDate.getFullYear() + "/" + addZeroIfNeed(endMonth) + "/" + addZeroIfNeed(endDate.getDate());
          $scope.endDate = $scope.editContract.endDate;
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


      $scope.closeModal = function () {
        $uibModalInstance.close();
        if (!$state.includes('service-agreements')) {
          $state.go('service-agreements');
        }
      };

      $scope.addNewService = function (form, editService) {
        if (form.$valid) {
          var newService = {
            name: editService.name,
            rate: editService.rate || 0.00,
            billable: editService.billable || false,
            taxes: editService.taxes || [],
            taxIds: []
          };
          if(editService.taxes.length) {
            for(var i=0; i<editService.taxes.length; i++) {
              newService.taxIds.push(editService.taxes[i].id)
            }
          }

          $scope.editContract.services.push(newService);
          $scope.editService = {
            name: '',
            rate: null,
            billable: false,
            taxes: []
          };

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
        return form[fieldName] &&  form[fieldName].$dirty && form[fieldName].$invalid;
      };


      $scope.createContract = function() {
        var servicesWithTaxIds = [];
        for(var i=0; i<$scope.editContract.services.length; i++) {
          var correctService = {
            name: $scope.editContract.services[i].name,
            rate: $scope.editContract.services[i].rate,
            billable: $scope.editContract.services[i].billable,
            taxIds: []
          };
          if($scope.editContract.services[i].taxes.length) {
            for(var n=0; n<$scope.editContract.services[i].taxes.length; n++) {
              correctService.taxIds.push($scope.editContract.services[i].taxes[n].id)
            }
          }
          servicesWithTaxIds.push(correctService);
        }

        var companyContractInfo = {
          description: $scope.editContract.description,
          startDate: $scope.editContract.startDate,
          endDate: $scope.editContract.endDate,
          companyId: $scope.editContract.companyId || companyData.companyId ||  $scope.contractCompany.id,
          services: servicesWithTaxIds,
          // type: companyData.type || $scope.modlToShow
          type: 'HOURLY'
        };

        console.log(companyContractInfo);
        AgreementsService.createContract(companyContractInfo, function(resp) {
          console.log(resp);
          $scope.closeModal();
        })
      };

      $scope.terminateContract = function() {
        AgreementsService.terminate($scope.editContract.id, function(resp) {
          $scope.closeModal()
        })
      };

      $scope.terminateAndCopy = function() {
        AgreementsService.terminate($scope.editContract.id, function(resp) {
          $scope.editContract.description = $scope.editContract.description +' COPY';
          $scope.modlToShow = $scope.editContract.type;
          $scope.editMode = true;
        })
      };


      $uibModalInstance.closed.then(function () {

        if (!$state.includes('service-agreements')) {
          $state.go('service-agreements');
        }
      });


    }
  ])

}());



// у таксов нету origin
// recurring выпилить
// discount на биллабле переделать.
