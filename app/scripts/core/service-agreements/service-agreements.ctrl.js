'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('quicktech.core.serviceAgreements.serviceAgreementsCtrl',
    ['$scope', '$uibModal', 'AgreementsService', 'CompaniesService',
      'quicktech.common.services.UserConfirmationsService',
      'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.PermissionsService', 'ServicesService',
      function ($scope, $uibModal, AgreementsService, CompaniesService, UserConfirmationsService, UserNotificationService, PermissionsService, ServicesService) {

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

        $scope.contractStatusDictionary ={
          CURRENT: 'Current',
          PENDING: 'Pending',
          TERMINATED: 'Terminated',
          EXPIRED: 'Expired'
        };


        $scope.editService = {taxes: []};


        AgreementsService.getAllServiceAgreements($scope, function (data) {
          $scope.agreementsList = data;

          for (var i = 0; i < $scope.agreementsList.length; i++) {
            $scope.agreementsList[i].company.name = getCompanyName($scope.agreementsList[i].company.id);
          }
          if($scope.company && $scope.company.id) {
            $scope.agreementsListByCompany = $scope.agreementsList.filter(function(c) {
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
                  console.log('Agreement delete', resp);
                }
              })
            });

          }
        };

        $scope.forceCreate = function(agreement) {
          if (agreement && agreement.id) {
            AgreementsService.forceCreate(agreement.id, function(resp) {
              UserNotificationService.show('Billable item created', true);
              console.log('Billable item created', resp);

            })
          }
        };

        $scope.openAgreementsModal = function (contractType, editMode, agreementId, preSetupCompany) {
          var companyForReadOnlyMode = {};
          if (agreementId) {
            AgreementsService.getAgreement(agreementId, function (resp) {
              // console.log(resp, 'rsp');

              if (resp.code !== 500) {
                companyForReadOnlyMode = resp;
                openModal(contractType, editMode, companyForReadOnlyMode)
              }

            })
          } else {
            openModal(contractType, editMode, companyForReadOnlyMode)
          }

          function openModal(contractType, editMode, companyForReadOnlyMode) {
            if($scope.allowToOpenAgreementModal) {
              var template;
              switch (contractType) {
                case('CREATE_NEW'):
                  template = '/html/scripts/core/service-agreements/modal/create-new-modal.tpl.html';
                  break;
                case('HOURLY'):
                  template = '/html/scripts/core/service-agreements/modal/hourly-service-modal.tpl.html';
                  break;
                case('BLOCK_TIME'):
                  template = '/html/scripts/core/service-agreements/modal/block-time-billing-modal.tpl.html';
                  break;
                case('SERVICE_CONTRACT'):
                  template = '/html/scripts/core/service-agreements/modal/service-contract-modal.tpl.html';
                  break;
                default:
                  console.log('no contract type selected');
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

      }]).controller('serviceAgreementsModalCtrl', [
    '$scope', '$uibModalInstance', 'companyData', '$state',
    'ServicesService', 'CompaniesService', 'TaxesService',
    'AgreementsService', '$filter', '$q', '$timeout',
    'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService', 'Utils',
    function ($scope, $uibModalInstance, companyData, $state, ServicesService,
              CompaniesService, TaxesService, AgreementsService, $filter, $q, $timeout,
              UserConfirmationsService, UserNotificationService, Utils) {

      $scope.taxes = TaxesService.getAll();

      $scope.companyId = companyData.companyId;
      $scope.companyInfo = companyData.companyInfo;
      $scope.preSetupCompany = companyData.preSetupCompany;
      if($scope.preSetupCompany) {
        $scope.contractCompany = $scope.preSetupCompany;
      }

      $scope.companiesList = CompaniesService.getClientCompaniesWoClientsAndLeads();

      $scope.descriptionPattern = /^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,255}$/;
      $scope.serviceNamePattern = /^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,255}$/;
      $scope.quantityPattern = /^\+?[0-9]{0,10}$/;

      $scope.selectedContractType = 'CREATE_NEW';
      $scope.modlToShow = 'CREATE_NEW';
      $scope.blockHourlyChoice = false;
      $scope.reInitEndDateHourly = true;
      $scope.notAddedHourlyServiceError = false;

      $scope.showErrorValidationDuplicatesHourly = false;

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

      $scope.editMode = true;

      if (companyData.editMode) {

        $scope.editContract = {};
        $scope.editContract.services = [];

        ServicesService.getServicesData($scope, function (data) {
          // console.log(data, 'SERVICES');
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
            listOfServices.sort(function(a,b) {
              return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);
            });

            $scope.defaultServicesList = listOfServices.slice();
            $scope.editContract.services = listOfServices.filter(function(el) {
              console.log(el)
              console.log(el.canUseInTicket, "CANUSEINTICKETs")
              return el.canUseInTicket;
            });
          }
        });

        // console.log($scope.today, 'SOSDOSDOSOs')
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

      } else {
        //console.log(companyData);
        $scope.editContract = companyData.companyForReadOnlyMode;
        $scope.editContract.startDate = $filter('date')($scope.editContract.startDate, 'dd MMM yyyy');
        $scope.editContract.endDate = $filter('date')($scope.editContract.endDate, 'dd MMM yyyy');
        AgreementsService.getServiceAgreementById($scope.editContract.id, function(data){
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

      if (!companyData.editMode) {
        ServicesService.getServicesData($scope, function (data) {
          // console.log(data, 'SERVICES');
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
            listOfServices.sort(function(a,b) {
              return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0);
            });

            $scope.defaultServicesList = listOfServices.slice();
          }
        });
      }


      if (companyData.editMode === false) {
        $scope.editMode = false;
      }

      $scope.$watch('editService', function(val) {
        if (!val) {
          $scope.editService = {taxes: []};
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

      $scope.showServiceColumn = function() {
        var show = false;
        for(var i=0; i<$scope.editContract.services.length; i++) {
          if($scope.editContract.services[i].billable) {
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


      $scope.pullServiceRate = function(service) {
        console.log(service, 'service');
        var counter = 0;

        pull()

        function pull() {
          $timeout(function() {
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
      function addDefaultTaxes(){
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
        var newEndDate = new Date(moment(date).year() + 1, moment(date).month() + 1, 0);

        if (date && date.length > 0) {
          var startDate = new Date(date);

          var startMonth = startDate.getMonth() + 1;
          //$scope.editContract.startDate = startDate.getFullYear() + "/" + addZeroIfNeed(startMonth) + "/" + addZeroIfNeed(startDate.getDate());
          $scope.editContract.startDate = $filter('date')(startDate, 'dd MMM yyyy');
          $scope.startDate = $scope.editContract.startDate;
          var endDate = new Date(date);
          //endDate.setMonth(endDate.getMonth() + 1);
          var n = Utils.addNumberOfMonth(endDate, 1);
          var temp  = Utils.minusDays(n, 1);
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

      $scope.getUniqueServicesForDropdown = function() {

        return $scope.defaultServicesList && $scope.defaultServicesList.filter(function(el) {
          return !~$scope.editContract.services.findIndex(function(service) {
            return service.id === el.id;
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

                console.log(editService, 'EDITEDIT')

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
                  var serviceToSend = Object.assign({isDefault: true}, newService)

                  ServicesService.save(serviceToSend, function(resp) {
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
            }, function() {
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
        AgreementsService.validateCrossingDatesHourly($scope.editContract.startDate, $scope.editContract.endDate, companyId, function (resp) {
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


      function checkForDuplicateServiceNames() {

        var deferred = $q.defer();

        var companyId = returnCompanyId();
        var serviceNamesList = [];
        for (var i = 0; i < $scope.editContract.services.length; i++) {
          serviceNamesList.push(checkNameForObject($scope.editContract.services[i].name));
        }
        ServicesService.searchDuplicatedServiceNames($scope.editContract.startDate, $scope.editContract.endDate, companyId, serviceNamesList, function (resp) {
          if (Object.keys(resp).length === 0) {
            console.log(' searchDuplicatedServiceNames true');
            deferred.resolve(resp);
          } else {
            console.log(' searchDuplicatedServiceNames false');
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
          ServicesService.searchDuplicatedServiceNames($scope.editContract.startDate, $scope.editContract.endDate, companyId, name, function (resp) {
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

      $scope.isNameUnique = function(serviceName) {
        if(serviceName) {
          var check = checkUniqueServiceName( $scope.editContract.services, serviceName);
          return check;
        }
      };


      function createHourlyContract() {
        var servicesWithTaxIds = [];
        for (var i = 0; i < $scope.editContract.services.length; i++) {
          console.log($scope.editContract.services[i], "SERVICE")
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
          if($scope.editContract.services[i].billable) {
            correctService.rate =  $scope.editContract.services[i].rate;
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

        console.log(companyContractInfo);
        AgreementsService.createContract(companyContractInfo, false, function (resp) {
          console.log(resp);
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

      $scope.validateAndCreateHourlyContract = function (editService) {


        if(!checkForInvalidFields()) {
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

      $scope.isShowingHourNewFieldError = function(form, fieldName) {
        return form[fieldName] && form[fieldName].$dirty && !form[fieldName].$valid;
      };


      $scope.showNotAddedHourlyServiceError = function(service) {
        if(service) {
          return (service.name && service.name.length && $scope.notAddedHourlyServiceError)
        }
      };

      $scope.refreshNotAddedServiceErrorHourly = function() {
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
          $scope.showFieldsError =  false;
          return false;
        }
      }




      $scope.terminateContract = function () {
        AgreementsService.terminate($scope.editContract.id, function (resp) {
          $scope.closeModal()
        })
      };

      $scope.terminateAndCopy = function () {
        AgreementsService.terminate($scope.editContract.id, function (resp) {
          $scope.editContract.description = $scope.editContract.description + ' COPY';
          $scope.modlToShow = $scope.editContract.type;
          $scope.editMode = true;

          $scope.editService = {taxes: []};
          var d = new Date($scope.editContract.startDate);
          // if (d.getTime() < $scope.today) {
          //   $scope.editContract.startDate = '';
          //   $scope.editContract.endDate = '';
          // }
        })
      };


      $uibModalInstance.closed.then(function () {

        if ($state.includes('tickets')) {
          $state.go('service-agreements');
        }
      });


    }
  ])

}());
