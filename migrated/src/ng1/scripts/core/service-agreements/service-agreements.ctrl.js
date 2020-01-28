'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', 'AgreementsService', 'CompaniesService',
      'quicktech.common.services.UserConfirmationsService',
      'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.PermissionsService', 'ServicesService','$rootScope',
      function ($scope, $uibModal, AgreementsService, CompaniesService, UserConfirmationsService, UserNotificationService, PermissionsService, ServicesService,$rootScope) {

        $scope.parseDate = Date.parse.bind(Date);
        $scope.filterType = 'company.name';
        $scope.agreementsList = [];
        $scope.canDeleteAgreements = PermissionsService.isAllowed('DELETE_SERVICE_AGREEMENTS');
        $scope.allowToOpenAgreementModal = true;

        $scope.contractTypeDictionary = {
          HOURLY: 'Hourly',
          BLOCK_TIME: 'Block Time',
          SERVICE_CONTRACT: 'Service Contract'
        };

        $scope.billTypeDictionary = {
          DEVICE: '/by device',
          USER: '/by user',
          OTHER: '/by other'
        };

        $scope.contractStatusDictionary = {
          CURRENT: 'Current',
          PENDING: 'Pending',
          TERMINATED: 'Terminated',
          EXPIRED: 'Expired'
        };
        $scope.isEditContract = false;

        $scope.editService = { taxes: [] };


        $scope.terminateContract = function (id) {
          AgreementsService.terminate(id || $scope.editContract.id, function (resp) {
            if ($scope.closeModal) $scope.closeModal();
          })
        };
        $scope.$on('$destroy', function() {
         
          terminateAndEdit();
        });
      var terminateAndEdit =  $rootScope.$on('terminateAndEdit', function (evt, val) {
          $scope.setInitEditAgreement(true); 
          console.log('val',val);
          $scope.openModal(val.type, true, val);

        });
        AgreementsService.getAllServiceAgreements($scope, function (data) {

          $scope.agreementsList = data;

          for (var i = 0; i < $scope.agreementsList.length; i++) {
            $scope.agreementsList[i].company.name = getCompanyName($scope.agreementsList[i].company.id);
          }
          if ($scope.company && $scope.company.id) {
            $scope.agreementsListByCompany = $scope.agreementsList.filter(function (c) {
              return c.company.id === $scope.company.id;
            })
          }
        });

        $scope.allCompnaies = CompaniesService.getAllCompanies();

        function getCompanyName(id) {
          for (var i = 0; i < $scope.allCompnaies.length; i++) {
            if ($scope.allCompnaies[i].id === id) {
              return $scope.allCompnaies[i].name;
            }
          }
        }

        $scope.changeFilterType = function (type) {
          if ($scope.filterType === type) {
            $scope.filterType = "-" + $scope.filterType;
          } else {
            $scope.filterType = type;
          }
        };

        $scope.getDateInCorrectFormat = function (date) {
          var newDate = new Date(date);
          if (newDate) {
            var endMonth = newDate.getMonth() + 1;
            var correctDate = addZeroIfNeed(newDate.getDate()) + "/" + addZeroIfNeed(endMonth) + "/" + newDate.getFullYear();
          }
          return correctDate;
        };

        function addZeroIfNeed(n) {
          return n < 10 ? '0' + n : '' + n;
        }

        $scope.deleteAgreement = function (agreement) {
          if (agreement && agreement.id) {
            var confirmMessage = 'Are you sure you want to delete agreement?';
            var confirmButton = 'yes';
            UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
              AgreementsService.deleteAgreement(agreement.id, function (resp) {
                if (resp) {
                  UserNotificationService.show('Agreement deleted', true);

                }
              })
            });

          }
        };

        $scope.forceCreate = function (agreement) {
          if (agreement && agreement.id) {
            AgreementsService.forceCreate(agreement.id, function (resp) {
              UserNotificationService.show('Billable item created', true);


            })
          }
        };
        $scope.setInitEditAgreement = function (data) {
          $scope.isEditContract = data;
        }

        $scope.openAgreementsModal = function (contractType, editMode, agreementId, preSetupCompany) {
          var companyForReadOnlyMode = {};
          if (agreementId) {
            AgreementsService.getAgreement(agreementId, function (resp) {


              if (resp.code !== 500) {
                companyForReadOnlyMode = resp;
                $scope.openModal(contractType, editMode, companyForReadOnlyMode)
              }

            })
          } else {
            $scope.openModal(contractType, editMode, companyForReadOnlyMode)
          }

          function openModal(contractType, editMode, companyForReadOnlyMode) {
            if ($scope.allowToOpenAgreementModal) {
              var template;
              console.log('contractType',contractType);
              switch (contractType) {
                case ('CREATE_NEW'):
                  template = '/ng1/scripts/core/service-agreements/modal/create-new-modal.tpl.html';
                  break;
                case ('HOURLY'):
                  template = '/ng1/scripts/core/service-agreements/modal/hourly-service-modal.tpl.html';
                  break;
                case ('BLOCK_TIME'):
                  template = '/ng1/scripts/core/service-agreements/modal/block-time-billing-modal.tpl.html';
                  break;
                case ('SERVICE_CONTRACT'):
                  template = (companyForReadOnlyMode.billType === 'OTHER') ? '/ng1/scripts/core/service-agreements/modal/service-contract-modal-other.tpl.html' :  '/ng1/scripts/core/service-agreements/modal/service-contract-modal.tpl.html';
                  break;
                default:

              }
              $scope.allowToOpenAgreementModal = false;
              var modalInstance = $uibModal.open({
                templateUrl: template,
                animation: true,
                backdrop: false,
                size: 'md',
                controller: 'serviceAgreementsModalCtrl',
                windowClass: 'create-popup margin-top-modal-dialog',
                resolve: {
                  companyData: {
                    editMode: editMode,
                    isEditContract: $scope.isEditContract,
                    companyForReadOnlyMode: companyForReadOnlyMode,
                    contractType: contractType,
                    preSetupCompany: preSetupCompany
                  }
                }

              });

              modalInstance.opened.then(function () {
                $scope.allowToOpenAgreementModal = true;
              });
            }

          }


        };
        $scope.openModal = function(contractType, editMode, companyForReadOnlyMode,preSetupCompany) {
          if ($scope.allowToOpenAgreementModal) {
            var template;
            console.log('contractType',contractType);
            switch (contractType) {
              case ('CREATE_NEW'):
                template = '/ng1/scripts/core/service-agreements/modal/create-new-modal.tpl.html';
                break;
              case ('HOURLY'):
                template =   '/ng1/scripts/core/service-agreements/modal/hourly-service-modal.tpl.html';
                break;
              case ('BLOCK_TIME'):
                template = '/ng1/scripts/core/service-agreements/modal/block-time-billing-modal.tpl.html';
                break;
              case ('SERVICE_CONTRACT'):
                template = (companyForReadOnlyMode.billType === 'OTHER') ? '/ng1/scripts/core/service-agreements/modal/service-contract-modal-other.tpl.html' :  '/ng1/scripts/core/service-agreements/modal/service-contract-modal.tpl.html';
                break;
              default:

            }
            $scope.allowToOpenAgreementModal = false;
            var modalInstance = $uibModal.open({
              templateUrl: template,
              animation: true,
              backdrop: false,
              size: 'md',
              controller: 'serviceAgreementsModalCtrl',
              windowClass: 'create-popup margin-top-modal-dialog',
              resolve: {
                companyData: {
                  editMode: editMode,
                  isEditContract: $scope.isEditContract,
                  companyForReadOnlyMode: companyForReadOnlyMode,
                  contractType: contractType,
                  preSetupCompany: preSetupCompany
                }
              }

            });

            modalInstance.opened.then(function () {
              $scope.allowToOpenAgreementModal = true;
            });
          }

        }

      }]).controller('serviceAgreementsModalCtrl', [
        '$scope', '$uibModalInstance', 'companyData', '$state',
        'ServicesService', 'CompaniesService', 'TaxesService',
        'AgreementsService', '$filter', '$q', '$timeout',
        'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService', 'Utils','$rootScope',
        function ($scope, $uibModalInstance, companyData, $state, ServicesService,
          CompaniesService, TaxesService, AgreementsService, $filter, $q, $timeout,
          UserConfirmationsService, UserNotificationService, Utils,$rootScope) {

          $scope.taxes = TaxesService.getAll();
          console.log('companyData', companyData);
          $scope.companyId = companyData.companyId;
          $scope.companyInfo = companyData.companyInfo;
          $scope.endDatePreview = '';
          $scope.preSetupCompany = companyData.preSetupCompany;
          if ($scope.preSetupCompany) {
            $scope.contractCompany = $scope.preSetupCompany;
          }

          $scope.companiesList = CompaniesService.getClientCompaniesWoClientsAndLeads();
          $scope.descriptionPattern = /^[0-9A-Za-z!@.)(/,|\\#$&*-_№;:='"?\-\s ]{1,255}$/;
          $scope.serviceNamePattern = /^[0-9A-Za-z!@.)(/,|\\#$&*-_№;:='"?\-\s ]{1,255}$/;
          $scope.quantityPattern = /^\+?[0-9]{0,10}$/;

          $scope.selectedContractType = 'CREATE_NEW';
          $scope.modlToShow = 'CREATE_NEW';
          $scope.blockHourlyChoice = false;
          $scope.reInitEndDateHourly = true;
          $scope.notAddedHourlyServiceError = false;

          $scope.showErrorValidationDuplicatesHourly = false;
$scope.showErrorValidationCurrentDate = false;
          $scope.showFieldsError = false;
          $scope.showAddServiceButton = true;
          $scope.showErrorInHourlyContract = false;
          $scope.errorMessage = '';
          $scope.newServiceNameIsError = false;
          $scope.newServiceNameErrorMessage = '';
          $scope.showCreateHourlyContractValidationError = false;
          $scope.errorMessageCreateHourlyDuplicate = 'The current company has a working hourly agreement for these dates';

          $scope.parseDate = Date.parse.bind(Date);

          $scope.today = Date.now();

          $scope.minDateForEndDatePicker;
          $scope.defaultDate;


          $scope.reinitNewServiceForm = true;
          $scope.isEditContract = companyData.isEditContract;
          $scope.editMode = true;
          $scope.startDate = 0;
          $scope.currentCompany = CompaniesService.getCurrentCompany();
          if (companyData.editMode) {
            console.log('companyData', companyData);
            $scope.editContract = {};
         
        
              ServicesService.getServicesDataWithoutRealTime($scope, function (data) {

                var listOfServices = [];
                for (var i = 0; i < data.length; i++) {
                  var serv = {
                    commissionRate: data[i].commissionRate,
                    name: data[i].name,
                    rate: data[i].rate,
                    billable: data[i].billable,
                    taxes: data[i].taxes || [],
                    taxIds: data[i].taxIds || [],
                    basedOnDefault: true,
                    id: data[i].versionedId,
                    canUseInTicket: data[i].canUseInTicket
                  };
                  if (data[i].taxIds && data[i].taxIds.length) {
                    for (var m = 0; m < data[i].taxIds.length; m++) {
                      serv.taxIds.push(data[i].taxes[m].id)
                    }
                  }
                  listOfServices.push(serv);
                  listOfServices.sort(function (a, b) {
                    return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);
                  });

                  $scope.defaultServicesList = listOfServices.slice();
                  if (!$scope.isEditContract) {
                    $scope.editContract.services = [];
                    $scope.editContract.services = listOfServices.filter(function (el) {

                      return el.canUseInTicket;
                    });

                  }
                
                }
              });
          



            setMiNDateForEndDate($scope.today);
            setDefaultTime($scope.today);

            // $timeout(function () {
            //   $scope.editService = {
            //     name: '',
            //     rate: null,
            //     billable: true,
            //     taxes: addDefaultTaxes()
            //   };
            // }, 1000);

            $scope.editService = {
              name: '',
              rate: null,
              billable: true,
              taxes: addDefaultTaxes()
            };
            if ($scope.isEditContract && companyData.contractType === 'HOURLY') {
              $scope.editContract.description = companyData.companyForReadOnlyMode.description;
              $scope.editContract.companyId = companyData.companyForReadOnlyMode.companyId;
              var startDate = new Date(companyData.companyForReadOnlyMode.startDate);
              var endDate = new Date(companyData.companyForReadOnlyMode.endDate - $scope.currentCompany.addresses[0].timeZone.timeOffset);
              $scope.editContract.startDate = $filter('date')(startDate, 'dd MMM yyyy');
              $scope.editContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
              $scope.isEditContract = true;
              $scope.editContract.services = companyData.companyForReadOnlyMode.services;
              $scope.startDate = new Date(angular.copy($scope.editContract.startDate));
            }
            if ($scope.isEditContract && companyData.contractType === 'BLOCK_TIME' || $scope.isEditContract && companyData.contractType === 'SERVICE_CONTRACT') {
              $scope.editContract = companyData.companyForReadOnlyMode;
              $scope.startDate = new Date(angular.copy($scope.editContract.startDate));

            }
           
          } else {
console.log('companyData.companyForReadOnlyMode',companyData.companyForReadOnlyMode);
            $scope.editContract = companyData.companyForReadOnlyMode;
            $scope.editContract.startDate = $filter('date')($scope.editContract.startDate, 'dd MMM yyyy');
         //   $scope.editContract.endDate = $filter('date')($scope.editContract.endDate, 'dd MMM yyyy');
         $scope.endDatePreview = $filter('date')(angular.copy($scope.editContract.endDate - $scope.currentCompany.addresses[0].timeZone.timeOffset), 'dd MMM yyyy');
            AgreementsService.getServiceAgreementById($scope.editContract.id, function (data) {
              $scope.contractStatus = data.status;
            });

            //create tax object by comparing taxIds and array of taxes
            for (var e = 0; e < $scope.editContract.services.length; e++) {
              $scope.editContract.services[e].taxes = [];
              for (var i = 0; i < $scope.editContract.services[e].taxIds.length; i++) {
                for (var m = 0; m < $scope.taxes.length; m++) {
                  if ($scope.editContract.services[e].taxIds[i] === $scope.taxes[m].id) {
                    $scope.editContract.services[e].taxes.push($scope.taxes[m]);
                  }
                }
              }
            }

          }
          console.log('$scope.editContract.', $scope.editContract);
          console.log('$scope.editMode',$scope.editMode);
          if (!companyData.editMode) {
            ServicesService.getServicesDataWithoutRealTime($scope, function (data) {

              var listOfServices = [];
              for (var i = 0; i < data.length; i++) {
                var serv = {
                  commissionRate: data[i].commissionRate,
                  name: data[i].name,
                  rate: data[i].rate,
                  billable: data[i].billable,
                  taxes: data[i].taxes || [],
                  taxIds: data[i].taxIds || [],
                  basedOnDefault: true,
                  id: data[i].versionedId
                };
                if (data[i].taxIds && data[i].taxIds.length) {
                  for (var m = 0; m < data[i].taxIds.length; m++) {
                    serv.taxIds.push(data[i].taxes[m].id)
                  }
                }
                listOfServices.push(serv);
                listOfServices.sort(function (a, b) {
                  return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);
                });

                $scope.defaultServicesList = listOfServices.slice();
              }
            });
          }


          if (companyData.editMode === false) {
            $scope.editMode = false;
          }

          $scope.$watch('editService', function (val) {
            if (!val) {
              $scope.editService = { taxes: [] };
            }
          })


          $scope.showClearIcon = function () {
            if ($scope.contractCompany) {
              return true;
            } else {
              return false;
            }
          };

          $scope.disabledCreateButtonInCreateNewModal = function () {
            var disable = false;
            if ($scope.contractCompany) {
              for (var i = 0; i < $scope.companiesList.length; i++) {
                if ($scope.companiesList[i].name == $scope.contractCompany.name) {
                  disable = false;
                  break;
                } else {
                  disable = true;
                }
              }
            } else {
              var disable = true;
            }
            return disable;
          };

          $scope.showServiceColumn = function () {
            var show = false;
            for (var i = 0; i < $scope.editContract.services.length; i++) {
              if ($scope.editContract.services[i].billable) {
                show = true;
                break;
              }
            }
            return show;
          };

          function reInitServiceForm() {
            $scope.reinitNewServiceForm = false;
            $timeout(function () {
              $scope.reinitNewServiceForm = true;
            }, 0);
          }

          function setMiNDateForEndDate(date) {
            $scope.minDateForEndDatePicker = $filter('date')(date, 'dd MMM yyyy');
          }

          function setDefaultTime(date) {
            if (!date) {
              date = new Date();
            }

            $scope.defaultDate = date
          }


          $scope.pullServiceRate = function (service) {
            var counter = 0;

            pull()

            function pull() {
              $timeout(function () {
                if (typeof service.name === 'object') {
                  if (service.name.rate || service.name.rate == 0) {
                    $scope.editService.rate = service.name.rate;
                  }
                } else if (counter !== 50) {
                  counter++;
                  pull();
                }
              }, 50)
            }



          }


          $scope.addDefaultTaxes = function () {
            var defaultTaxList = [];
            for (var i = 0; i < $scope.taxes.length; i++) {
              if ($scope.taxes[i].isDefault) {
                defaultTaxList.push($scope.taxes[i])
              }
            }
            return defaultTaxList;
          };
          function addDefaultTaxes() {
            var defaultTaxList = [];
            for (var i = 0; i < $scope.taxes.length; i++) {
              if ($scope.taxes[i].isDefault) {
                defaultTaxList.push($scope.taxes[i])
              }
            }
            return defaultTaxList;
          }

          $scope.dateFilter = function (date) {
            return $filter('date')(date, 'dd MMM yyyy');
          };

          function reInitEndDateHourly(date) {
            $scope.reInitEndDateHourly = false;
            $timeout(function () {
              $scope.reInitEndDateHourly = true;
            }, 0);
          }

          $scope.startDatePicker = function (date) {
            console.log('startDatePicker', date);
            var newEndDate = new Date(moment(date).year() + 1, moment(date).month() + 1, 0);

            if (date && date.length > 0) {
              var startDate = new Date(date);
             
              var startMonth = startDate.getMonth() + 1;
              //$scope.editContract.startDate = startDate.getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(startDate.getDate());
            
              $scope.editContract.startDate = $filter('date')(startDate, 'dd MMM yyyy');
            
              var endDate = new Date(date);
              //endDate.setMonth(endDate.getMonth() + 1);
              var n = Utils.addNumberOfMonth(endDate, 1);
              var temp = Utils.minusDays(n, 1);
              // var temp = new Date(n);
              // temp.setDate(temp.getDate()-1);
              // $scope.editContract.endDate = $filter('date')(temp, 'dd MMM yyyy');
              var f = new Date(date);
              // setMiNDateForEndDate(f);
              // reInitEndDateHourly(newEndDate);
              $scope.endDatePicker(newEndDate, true);
             
              // setDefaultTime(newEndDate)

            }

          };

          $scope.endDatePicker = function (date, force) {
            var newDate = date;
            var isForce = force;
            if (new Date(date) < new Date($scope.editContract.startDate)) {
              newDate = new Date($scope.editContract.startDate);
              newDate.setDate(newDate.getDate() + 1);
              isForce = true;
            }

            if ((date && date.length > 0) || isForce) {
              var endDate = new Date(newDate);
              var endMonth = endDate.getMonth() + 1;
              $scope.editContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
              $scope.endDate = $scope.editContract.endDate;
              console.log('$scope.endDate',$scope.endDate);
            }

          };

          // function addZeroIfNeed(n) {
          //   return n < 10 ? '0' + n : '' + n;
          // }


          $scope.changeModalToShow = function () {
            $scope.modlToShow = $scope.selectedContractType
          };

          $scope.selectContractType = function (type) {
            if ($scope.selectedContractType === type) {
              $scope.selectedContractType = 'CREATE_NEW';
            } else {
              $scope.selectedContractType = type;
            }
          };


          $scope.closeModal = function () {
            $uibModalInstance.close();
            // if (!$state.includes('service-agreements')) {
            //   $state.go('service-agreements');
            // }
          };

          $scope.getUniqueServicesForDropdown = function () {



            return $scope.defaultServicesList && $scope.defaultServicesList.filter(function (el) {
              return !~$scope.editContract.services.findIndex(function (service) {
                return service.name.toLowerCase() === el.name.toLowerCase();
              })
            })
          }


          $scope.addNewService = function (form, editService) {
            $scope.showAddServiceButton = false;
            $scope.newServiceNameIsError = false;
            if (form.$valid) {
              if (!$scope.editContract.startDate || !$scope.editContract.startDate) {
                $scope.newServiceNameIsError = true;
                $scope.newServiceNameErrorMessage = 'Please enter start and end date to check service name';
                $scope.showAddServiceButton = true;
              } else {
                validateNewServiceName(editService).then(function (resp) {
                  if (resp) {


                    if (editService.name.name) {
                      var newService = {
                        name: editService.name.name,
                        rate: editService.rate || editService.name.rate || 0.00,
                        billable: editService.name.billable || false,
                        taxes: editService.taxes || $scope.addDefaultTaxes(),
                        taxIds: [],
                        id: editService.name.id,
                        basedOnDefault: true
                      };
                    } else {
                      var newService = {
                        name: editService.name,
                        rate: editService.rate || 0.00,
                        billable: editService.billable || false,
                        taxes: editService.taxes || $scope.addDefaultTaxes(),
                        taxIds: [],
                        basedOnDefault: true
                      };
                    }


                    if (editService.taxes && editService.taxes.length) {
                      for (var i = 0; i < editService.taxes.length; i++) {
                        newService.taxIds.push(editService.taxes[i].id)
                      }
                    }


                    if (!editService.name.id) {
                      var serviceToSend = Object.assign({ isDefault: true }, newService)

                      ServicesService.save(serviceToSend, function (resp) {
                        newService.id = resp.versionedId
                        $scope.editContract.services.push(newService);
                      })
                    } else {
                      $scope.editContract.services.push(newService);
                    }


                    $scope.editService = {
                      name: '',
                      rate: null,
                      billable: true,
                      taxes: $scope.addDefaultTaxes()
                    };
                    reInitServiceForm();
                    $scope.showAddServiceButton = true;
                  }
                }, function () {
                  $scope.showAddServiceButton = true;
                })
              }

            } else {
              $scope.showAddServiceButton = true;
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


          function returnCompanyId() {
            var id;
            console.log('$scope.editContract', $scope.editContract);
            if ($scope.editContract.companyId) {
              id = $scope.editContract.companyId
            } else if ($scope.contractCompany && $scope.contractCompany.id) {
              id = $scope.contractCompany.id
            } else if ($scope.companyId && $scope.companyId.id) {
              id = $scope.companyId.id;
            } else {
              id = $scope.companyId;
            }
            return id;
          }


          function validateCrossingDatesHourly() {
            $scope.showCreateHourlyContractValidationError = false;
            var deferred = $q.defer();

            var companyId = returnCompanyId();
            console.log('$scope.isEditContract',$scope.isEditContract);
            console.log('$scope.editContract',companyData.companyForReadOnlyMode);
            AgreementsService.validateCrossingDatesHourly($scope.editContract.startDate, $scope.editContract.endDate, companyId,($scope.isEditContract) ? companyData.companyForReadOnlyMode.id : null, function (resp) {
              if (resp.valid == true) {
                deferred.resolve(resp)
              } else {
                $scope.showCreateHourlyContractValidationError = true;

                deferred.reject();
              }

            });
            return deferred.promise;
          }



          function checkHourlyExistingNamesDuplicates(name) {
            var duplicate = false;
            var names = [];
            for (var i = 0; i < $scope.editContract.services.length; i++) {
              names.push($scope.editContract.services[i].name)
            }
            var sortedNames = names.slice().sort();
            if (name) {
              for (var t = 0; t < sortedNames.length - 1; t++) {
                if (sortedNames[t + 1] === sortedNames[t] && sortedNames[t] === name) {
                  duplicate = true;
                }
              }
            } else {
              for (var t = 0; t < sortedNames.length - 1; t++) {
                if (sortedNames[t + 1] === sortedNames[t]) {
                  duplicate = true;
                }
              }
            }
            if (duplicate) {
              $scope.showErrorInHourlyContract = true;
              $scope.showCreateHourlyContractValidationError = false;
              $scope.errorMessage = 'You have duplicates services name';
            } else {
              $scope.showErrorInHourlyContract = false;
            }
            return duplicate;
          }

          $scope.checkHourlyServiceErrorForm = function (service) {
            if (service.name && !checkHourlyExistingNamesDuplicates(service.name)) {
              return false;
            } else {
              return true;
            }
          };

          function showErrorValidationDuplicatesHourlyTimeout() {
            $scope.showErrorValidationDuplicatesHourly = true;
            $timeout(function () {
              $scope.showErrorValidationDuplicatesHourly = false;
            }, 4000);
          }

          function showErrorValidationCurrentDateTimeout() {
            $scope.showErrorValidationCurrentDate = true;
            $timeout(function () {
              $scope.showErrorValidationCurrentDate = false;
            }, 4000);
          }


          function checkForDuplicateServiceNames() {

            var deferred = $q.defer();

            var companyId = returnCompanyId();
            var serviceNamesList = [];
            for (var i = 0; i < $scope.editContract.services.length; i++) {
              serviceNamesList.push(checkNameForObject($scope.editContract.services[i].name));
            }
            console.log('checkForDuplicateServiceNames',$scope.editContract);
            ServicesService.searchDuplicatedServiceNames($scope.editContract.startDate, $scope.editContract.endDate, companyId, serviceNamesList, ($scope.isEditContract) ? companyData.companyForReadOnlyMode.id : null, function (resp) {
              if (Object.keys(resp).length === 0) {

                deferred.resolve(resp);
              } else {

                showErrorValidationDuplicatesHourlyTimeout();
                deferred.reject();

              }
            });
            return deferred.promise;
          }

          function checkNameForObject(name) {
            if (typeof name === 'object') {
              return name.name;
            } else {
              return name;
            }
          }

          function validateNewServiceName(editService) {
            $scope.newServiceNameIsError = false;
            var deferred = $q.defer();
            if (editService && editService.name) {

              var companyId = returnCompanyId();
              var name = [];
              name.push(editService.name.name || editService.name);
              ServicesService.searchDuplicatedServiceNames($scope.editContract.startDate, $scope.editContract.endDate, companyId, name,($scope.isEditContract) ?  companyData.companyForReadOnlyMode.id : null, function (resp) {
                if (Object.keys(resp).length === 0) {
                  deferred.resolve(resp);
                } else {
                  deferred.reject();
                  $scope.newServiceNameIsError = true;
                  $scope.newServiceNameErrorMessage = 'Service name is duplicate';
                }
              });
            }
            return deferred.promise;
          }

          function checkUniqueServiceName(serviceList, serviceName) {
            if (serviceList && serviceName) {
              var unique = true;
              for (var i = 0; i < serviceList.length; i++) {
                if (serviceList[i].name === serviceName) {
                  unique = false;
                  break;
                }
              }
              return unique;
            } else {
              return true;
            }
          }

          $scope.isNameUnique = function (serviceName) {
            if (serviceName) {
              var check = checkUniqueServiceName($scope.editContract.services, serviceName);
              return check;
            }
          };


          function createHourlyContract() {
            var servicesWithTaxIds = [];
            for (var i = 0; i < $scope.editContract.services.length; i++) {
              var correctService = {
                name: $scope.editContract.services[i].name,
                rate: 0,
                billable: $scope.editContract.services[i].billable,
                taxIds: [],
                basedOnDefault: $scope.editContract.services[i].basedOnDefault || false,
                commissionRate: $scope.editContract.services[i].commissionRate || 0,

              };

              if (correctService.basedOnDefault) {
                correctService.id = $scope.editContract.services[i].id.id
              }
              if ($scope.editContract.services[i].billable) {
                correctService.rate = $scope.editContract.services[i].rate;
                if ($scope.editContract.services[i].taxes.length) {
                  for (var n = 0; n < $scope.editContract.services[i].taxes.length; n++) {
                    correctService.taxIds.push($scope.editContract.services[i].taxes[n].id)
                  }
                }
              }
              servicesWithTaxIds.push(correctService);
            }

            var companyContractInfo = {
              description: $scope.editContract.description,
              companyId: returnCompanyId(),
              services: servicesWithTaxIds,
              type: 'HOURLY'
            };
            console.log('companyContractInfo', companyContractInfo);
            console.log('$scope.editContract', $scope.editContract);
            var sd = new Date($scope.editContract.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            companyContractInfo.startDate = $filter('date')(sd, 'yyyy/MM/dd');

            var ed = new Date($scope.editContract.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            companyContractInfo.endDate = $filter('date')(ed, 'yyyy/MM/dd');

            AgreementsService.createContract(companyContractInfo, false, function (resp) {
              if (resp.message === 'Validation failed') {
                $scope.showErrorInHourlyContract = true;
                if (resp.validationResults && resp.validationResults.serviceAgreementDto) {
                  $scope.errorMessage = resp.validationResults.serviceAgreementDto;
                } else {
                  $scope.errorMessage = 'Something went wrong, please try again later and contact administrator';
                }
              } else {
                $scope.closeModal();
              }

            })
          }
          function updateHourlyContract() {
            var servicesWithTaxIds = [];
            for (var i = 0; i < $scope.editContract.services.length; i++) {
              var correctService = {
                id: (typeof $scope.editContract.services[i].id === 'string') ? $scope.editContract.services[i].id : $scope.editContract.services[i].id.id ,
                name: $scope.editContract.services[i].name,
                rate: $scope.editContract.services[i].rate,
                billable: $scope.editContract.services[i].billable,
                taxIds: $scope.editContract.services[i].taxes.map(item => {
                  return item.id;
                }),
                basedOnDefault: $scope.editContract.services[i].basedOnDefault || true,
                commissionRate: $scope.editContract.services[i].commissionRate || 0,

              };

              /*if (correctService.basedOnDefault) {
                correctService.id = $scope.editContract.services[i].id.id
              }*/
              /*  if($scope.editContract.services[i].billable) {
                  correctService.rate =  $scope.editContract.services[i].rate;
                  if ($scope.editContract.services[i].taxes.length) {
                    for (var n = 0; n < $scope.editContract.services[i].taxes.length; n++) {
                      correctService.taxIds.push($scope.editContract.services[i].taxes[n].id)
                    }
                  }
                }*/
              servicesWithTaxIds.push(correctService);
            }

            var companyContractInfo = {
              id: companyData.companyForReadOnlyMode.id,
              description: $scope.editContract.description,
              companyId: returnCompanyId(),
              services: servicesWithTaxIds,
              type: companyData.companyForReadOnlyMode.type
            };


            companyContractInfo.startDate = new Date($scope.editContract.startDate).getTime();


            companyContractInfo.endDate = new Date($scope.editContract.endDate).getTime();
            console.log('companyContractInfo', companyContractInfo);
            console.log('$scope.editContract', $scope.editContract);




            AgreementsService.updateContract(companyContractInfo, function (resp) {
              console.log('resp', resp);
              if (resp.message === 'Validation failed') {
                $scope.showErrorInHourlyContract = true;
                if (resp.validationResults && resp.validationResults.serviceAgreementDto) {
                  $scope.errorMessage = resp.validationResults.serviceAgreementDto;
                } else {
                  $scope.errorMessage = 'Something went wrong, please try again later and contact administrator';
                }
              } else {
                $scope.closeModal();
              }

            })
          }

          $scope.validateAndUpdateHourlyContract = function (editService) {

            if (!checkForInvalidFields()) {
              var startDate = new Date($scope.editContract.startDate);
              startDate.setMilliseconds(0);
              startDate.setSeconds(0);
              startDate.setMinutes(0);
              startDate.setHours(0);

              var current = new Date($scope.startDate);
              current.setMilliseconds(0);
              current.setSeconds(0);
              current.setMinutes(0);
              current.setHours(0);
              console.log('current',current);
              console.log('startDate',startDate);

              var now = new Date();
              now.setMilliseconds(0);
              now.setSeconds(0);
              now.setMinutes(0);
              now.setHours(0);
              if (current.getTime() != startDate.getTime() && startDate.getTime() < now.getTime()) {
              
                 showErrorValidationCurrentDateTimeout();
                 return;
              }
              var emptyNewService = true;

              if (editService && editService.name && editService.name.length) {
                activateNotAddedServiceErrorHourly();
                emptyNewService = false;
                var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
                var confirmButton = 'Yes, Update';
                UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not update').then(function () {
                  emptyNewService = true;
                  validateAndUpdate();
                });
              } else {
                validateAndUpdate();
              }
            }


            function validateAndUpdate() {
              if (emptyNewService) {
                console.log('$scope.editContract', $scope.editContract);



                var CurrentstartDate = $filter('date')(new Date(companyData.companyForReadOnlyMode.startDate), 'dd MMM yyyy');
                var CurrentendDate = $filter('date')(new Date(companyData.companyForReadOnlyMode.endDate), 'dd MMM yyyy');

                console.log('$scope.CurrentstartDate', CurrentstartDate);
                console.log('$scope.CurrentendDate', CurrentendDate);
                if ($scope.editContract.startDate != CurrentstartDate || $scope.editContract.endDate != CurrentendDate) {
                  validateCrossingDatesHourly().then(function (resp) {
                    if (resp) {
                      checkForDuplicateServiceNames().then(function (resp) {
                        if (resp) {
                          updateHourlyContract();
                        }
                      })
                    }
                  });
                } else {
                  updateHourlyContract();

                }


              }
            }

          }
          $scope.validateAndCreateHourlyContract = function (editService) {


            if (!checkForInvalidFields()) {
              var emptyNewService = true;

              if (editService && editService.name && editService.name.length) {
                activateNotAddedServiceErrorHourly();
                emptyNewService = false;
                var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
                var confirmButton = 'Yes, create';
                UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function () {
                  emptyNewService = true;
                  validateAndCreate();
                });
              } else {
                validateAndCreate();
              }
            }


            function validateAndCreate() {
              if (emptyNewService) {
                validateCrossingDatesHourly().then(function (resp) {
                  if (resp) {
                    checkForDuplicateServiceNames().then(function (resp) {
                      if (resp) {
                        createHourlyContract();
                      }
                    })
                  }
                });
              }
            }

          };

          function checkServiceNameLength() {
            var check = true;
            for (var i = 0; i < $scope.editContract.services.length; i++) {
              if ($scope.editContract.services[i].name == undefined) {
                check = false;
              }
            }
            if (!check) {
              $scope.showErrorInHourlyContract = true;
              $scope.errorMessage = 'You have an empty services names'
            } else {
              $scope.showErrorInHourlyContract = false;
            }
            return check;
          }

          $scope.isShowingHourErrors = function (form, fieldName) {
            return form[fieldName] && (form[fieldName].$dirty || $scope.showFieldsError) && !form[fieldName].$valid;
          };

          $scope.isShowingHourNewFieldError = function (form, fieldName) {
            return form[fieldName] && form[fieldName].$dirty && !form[fieldName].$valid;
          };


          $scope.showNotAddedHourlyServiceError = function (service) {
            if (service) {
              return (service.name && service.name.length && $scope.notAddedHourlyServiceError)
            }
          };

          $scope.refreshNotAddedServiceErrorHourly = function () {
            $scope.notAddedHourlyServiceError = false;
          };

          function activateNotAddedServiceErrorHourly() {
            $scope.notAddedHourlyServiceError = true;
          }



          function checkForInvalidFields() {


            if (!$scope.editContract.startDate ||
              !$scope.editContract.endDate ||
              !$scope.editContract.description ||
              !$scope.editContract.services.length > 0 ||
              !checkServiceNameLength() || checkHourlyExistingNamesDuplicates()) {
              $scope.showFieldsError = true;
              return true;
            } else {
              $scope.showFieldsError = false;
              return false;
            }
          }




          $scope.terminateContract = function (id) {

            AgreementsService.terminate(id || $scope.editContract.id, function (resp) {
              if ($scope.closeModal) $scope.closeModal();
            })
          };

          $scope.terminateAndCopy = function () {
            AgreementsService.terminate($scope.editContract.id, function (resp) {
              $scope.editContract.description = $scope.editContract.description + ' COPY';
              $scope.modlToShow = $scope.editContract.type;
              $scope.editMode = true;

              $scope.editService = { taxes: [] };
              var d = new Date($scope.editContract.startDate);
           
              $scope.editContract.startDate = $filter('date')(Date.now(), 'dd MMM yyyy');
            /*  $scope.editContract.serviceExpenses.forEach((item) => {
               item.date = $filter('date')(Date.now(), 'dd MMM yyyy');
                item.startDate =  $scope.editContract.startDate;
              })*/
           
              console.log('$scope.editContract',$scope.editContract);
              // if (d.getTime() < $scope.today) {
              //   $scope.editContract.startDate = '';
              //   $scope.editContract.endDate = '';
              // }
              $scope.$apply();
              $rootScope.$broadcast('terminateAndCopy', null);
            })
          };

          $scope.terminateAndEdit = function () {
           
            $scope.closeModal();
            
            console.log('$scope.editContract',$scope.editContract);
            $rootScope.$broadcast('terminateAndEdit', $scope.editContract);
          };


          $uibModalInstance.closed.then(function () {

            if ($state.includes('tickets')) {
              $state.go('service-agreements');
            }
          });


        }
      ])

}());
