'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      'ProductsService', '$filter', '$timeout', 'TaxesService', '$q',
      'quicktech.common.services.UserConfirmationsService', 'Utils',
      function ($scope, AgreementsService, CompaniesService, ServicesService,
                ProductsService, $filter, $timeout, TaxesService, $q, UserConfirmationsService, Utils) {

        $scope.intervals = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days', '1 day'];
        $scope.serviceContractType = {
          DEVICE: 'By Device',
          USER: 'By Users',
          OTHER: 'Other'
        };

        $scope.taxes = TaxesService.getAll();

        $scope.dissableCreateButton = false;
        $scope.showAddButtonNewService = true;
        $scope.showAddButtonNewSCSTT = true;

        $scope.reInitStartDate = true;
        $scope.reInitEndDate = true;
        $scope.reInitServiceContractServicesForm = true;
        $scope.reInitServiceForm = true;
        $scope.reInitPrpductsExpenseNameField = false;
        $scope.reInitNewServiceExpenseForm = true;

        $scope.showRequiredFieldError = false;
        $scope.showServiceLengthCheckError = false;

        $scope.showRequiredFieldErrorSCS = false;
        $scope.showRequiredFieldErrorService = false;
        $scope.showRequiredFieldErrorServiceExpense = false;

        $scope.showNewServiceContractServiceValidationError = false;
        $scope.showNewServiceValidationError = false;
        $scope.showServiceExpenseError = false;
        $scope.showProductExpenseError = false;
        $scope.showValidationFailMessage = false;
        $scope.validationServiceError = 'There are existing service name on another contract with the same dates. Please change service name or dates';
        $scope.createValidationFailedMessage = 'Something went wrong, please try again later and contact administrator';

        $scope.defaultServices = [];
        $scope.defaultProducts = [];

        $scope.openedTab = 'product';



        var day = 1000 * 60 * 60 * 24;
        var month = 30 * day;

        $scope.totsl = 0;
        $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);


        if ($scope.editMode) {
          $scope.serviceContract = {
            billType: null,
            minStartDate: Date.now(),
            isAdditionalServices: false,
            includedHours: null,
            blockRate: null,
            interval: "MONTHLY",
            serviceContractServices: [],
            services: [],
            serviceExpenses: [],
            productExpenses: [],
            serviceContractServicesToTrack: []
          };
          $scope.reInitPrpductsExpenseNameField = true;
          preCreateFirstServicesEntities();
          createDefaultServices();
          createDefaultServiceContractServicesToTrack();
        } else {
          $scope.serviceContract = angular.copy($scope.editContract);
          $scope.reInitPrpductsExpenseNameField = false;
          $scope.serviceContract.endDatePreview = $scope.serviceContract.endDate;
          $scope.serviceContract.endDate = '';
          $scope.serviceContract.startDatePreview = $scope.serviceContract.startDate;
          $scope.serviceContract.startDate = '';
          $scope.serviceContract.isAdditionalServices = $scope.serviceContract.services.length > 0;
          $scope.serviceContract.minStartDate = Date.now();

          for (var i = 0; i < $scope.serviceContract.serviceContractServices.length; i++) {
            $scope.serviceContract.serviceContractServices[i].taxes = [];
            if ($scope.serviceContract.serviceContractServices[i].taxIds.length > 0) {
              for (var j = 0; j < $scope.serviceContract.serviceContractServices[i].taxIds.length; j++) {
                for (var n = 0; n < $scope.taxes.length; n++) {
                  if ($scope.serviceContract.serviceContractServices[i].taxIds[j] === $scope.taxes[n].id) {
                    $scope.serviceContract.serviceContractServices[i].taxes.push($scope.taxes[n]);
                    break;
                  }
                }
              }
            }
          }

          for (var i = 0; i < $scope.serviceContract.services.length; i++) {
            $scope.serviceContract.services[i].taxes = [];
            if ($scope.serviceContract.services[i].taxIds.length > 0) {
              for (var j = 0; j < $scope.serviceContract.services[i].taxIds.length; j++) {
                for (var n = 0; n < $scope.taxes.length; n++) {
                  if ($scope.serviceContract.services[i].taxIds[j] === $scope.taxes[n].id) {
                    $scope.serviceContract.services[i].taxes.push($scope.taxes[n]);
                    break;
                  }
                }
              }
            }
          }

          for(var g=0; g<$scope.serviceContract.serviceExpenses.length; g++) {
            $scope.serviceContract.serviceExpenses[g].quantity = $scope.serviceContract.serviceExpenses[g].quantity * 60;
          }

          ProductsService.getFullListForAutocomplete($scope, function(resp) {
            var productsData = resp;
            if($scope.serviceContract.productExpenses.length>0) {
              for(var p=0; p<$scope.serviceContract.productExpenses.length; p++) {
                for(var w=0; w<productsData.length; w++) {
                  for(var v=0; v<productsData[w].products.length; v++) {
                    if(productsData[w].products[v].versionedId.id ==  $scope.serviceContract.productExpenses[p].productId) {
                      $scope.serviceContract.productExpenses[p].name = {};
                      $scope.serviceContract.productExpenses[p].name.description = productsData[w].products[v].description;
                      break;
                    }
                  }
                }
              }
            }
            $scope.reInitPrpductsExpenseNameField = true;
          });

          $scope.total = $scope.serviceContract.amount;
          preCreateFirstServicesEntities();
        }



        function createDefaultServices(){
          var managedUsers = {
            name: 'Managed users',
            count: 0,
            rate: 0,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          $scope.presettupUsersServices.push(managedUsers);
          var managedWorkstation = {
            name: 'Managed workstations',
            count: 0,
            rate: 0,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          var managedServers = {
            name: 'Managed servers',
            count: 0,
            rate: 0,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
          $scope.presettupDeviceServices.push(managedWorkstation);
          $scope.presettupDeviceServices.push(managedServers);
        }


        function preCreateFirstServicesEntities() {

          $scope.presettupUsersServices = [];

          $scope.presettupDeviceServices = [];

          $scope.NewServiceContractServices = {
            name: null,
            count: null,
            rate: null,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };

          $scope.newProductExpense = {
            name: null,
            quantity: null,
            salePrice: null
          };

          $scope.newServiceExpense = {
            name: null,
            quantity: null,
            description: null,
            date: null
          };

          $scope.newService = {
            name: '',
            rate: 0,
            billable: true,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };

          $scope.newServiceContractServicesToTrack = {
            name: ''
          }
        }

        function createDefaultServiceContractServicesToTrack() {
          var scstt1 = {
            name: 'Managed Services Onsite'
          };
          var scstt2 = {
            name: 'Managed Services Remote'
          };
          $scope.serviceContract.serviceContractServicesToTrack.push(scstt1);
          $scope.serviceContract.serviceContractServicesToTrack.push(scstt2);
        }

        $scope.showAdditionalServiceColumn = function() {
          var show = false;
          for(var i=0; i<$scope.serviceContract.serviceContractServices.length; i++) {
            if($scope.serviceContract.serviceContractServices[i].billable) {
              show = true;
              break;
            }
          }
          return show;
        };


        $scope.formattingDateForServiceExpenses = function (date) {
          var d = new Date(date);
          return d;
        };

        $scope.serviceContract.minEndDate = $scope.serviceContract.minStartDate + month;
        $scope.serviceContract.endDate = $scope.serviceContract.minStartDate + month;
        $scope.defaultDareForServiceExpense = Date.now() + day;

        presettupPeriod();

        function presettupPeriod() {
          if ($scope.serviceContract.interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
          } else if ($scope.serviceContract.interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
          } else {
            $scope.serviceContract.period = $scope.serviceContract.customInterval;
          }
        }

        $scope.previewInterval = function () {
          return $scope.serviceContract.customInterval || $scope.serviceContract.interval;
        };

        function changeStartDate() {
          changeMinEndDate($scope.serviceContract.period);
        }

        function changeDefaultDateForServices() {
          var servicePickDate = new Date($scope.newServiceExpense.date);
          var startDate = new Date($scope.serviceContract.startDate);
          var pickedDate = new Date($scope.newServiceExpense.date);
          if(servicePickDate.getTime() < startDate.getTime()) {
            $scope.newServiceExpense.date = $scope.serviceContract.startDate;
            $scope.defaultDareForServiceExpense = startDate.getTime();
          } else {
            $scope.defaultDareForServiceExpense = pickedDate.getTime();
          }
          for(var i=0; i<$scope.serviceContract.serviceExpenses.length; i++) {
            var setDate = new Date($scope.serviceContract.serviceExpenses[i].date);
            if(setDate.getTime() < startDate.getTime()) {
              $scope.serviceContract.serviceExpenses[i].date = $scope.serviceContract.startDate;
            }
          }
        }

        function changeMinEndDate(period) {
          var date = $scope.serviceContract.startDate;
          var endDate = new Date(date);
          switch (period) {
            case('Month'):
              endDate = Utils.addNumberOfMonth(endDate, 1);
              break;
            case('Year'):
              endDate = Utils.addNumberOfMonth(endDate, 12);
              break;
            default:
              //endDate.setTime(endDate.getTime() + day * period);
              var utc_timestamp = Date.UTC(endDate.getUTCFullYear(),endDate.getUTCMonth(), endDate.getUTCDate() ,
                endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds(), endDate.getUTCMilliseconds());
              var calculatePlusDays = utc_timestamp + day*period;
              var nd = new Date(calculatePlusDays);
              endDate.setTime(calculatePlusDays - (nd.getTimezoneOffset()*60000))
          }
          endDate = Utils.minusDays(endDate, 1);
          $scope.serviceContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          $scope.serviceContract.minEndDate = $filter('date')(endDate, 'dd MMM yyyy');
          changeDefaultDateForServices();
          reInitEndDate();
        }

        function reInitStartDate() {
          $scope.reInitStartDate = false;
          $timeout(function () {
            $scope.reInitStartDate = true;
          }, 0);
        }

        function reInitEndDate() {
          $scope.reInitEndDate = false;
          $timeout(function () {
            $scope.reInitEndDate = true;
          }, 0);
        }

        function reInitNewServiceExpenseForm() {
          $scope.reInitNewServiceExpenseForm = false;
          $timeout(function () {
            $scope.reInitNewServiceExpenseForm = true;
          }, 0);
        }

        $scope.$watch(function () {
          return $scope.serviceContract.interval;
        }, function (interval) {
          var newMinStartDate;
          var now = Date.now();
          var n = new Date(now);
          if (interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
            $scope.serviceContract.interval = 'MONTHLY';
            $scope.serviceContract.customInterval = null;
            n.setMonth(n.getMonth() - 1);
            newMinStartDate = n.getTime() + day;

          } else if (interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
            $scope.serviceContract.interval = 'YEARLY';
            $scope.serviceContract.customInterval = null;
            n.setFullYear(n.getFullYear() - 1);
            newMinStartDate = n.getTime() + day;

          } else if (interval === '30 days') {
            $scope.serviceContract.period = 30;
            $scope.serviceContract.customInterval = 30;
            newMinStartDate = now - (29*day);

          } else if (interval === '15 days') {
            $scope.serviceContract.period = 15;
            $scope.serviceContract.customInterval = 15;
            newMinStartDate = now - (14*day);

          } else if (interval === '7 days') {
            $scope.serviceContract.period = 7;
            $scope.serviceContract.customInterval = 7;
            newMinStartDate = now - (6*day);

          } else if (interval === '1 day') {
            $scope.serviceContract.period = 1;
            $scope.serviceContract.customInterval = 1;
          }
          $scope.serviceContract.minStartDate = newMinStartDate;
          changeMinEndDate($scope.serviceContract.period);
          reInitStartDate();
          reInitEndDate();
        });

        $scope.$watch(function () {
          return $scope.serviceContract.startDate;
        }, function () {
          changeStartDate()
        });


        ServicesService.getServicesData($scope, function (data) {
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

          if ($scope.serviceContract.serviceExpenses.length > 0) {
            for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
              for (var j = 0; j < $scope.defaultServices.length; j++) {
                if ($scope.serviceContract.serviceExpenses[i].serviceId === $scope.defaultServices[j].serviceId) {
                  $scope.serviceContract.serviceExpenses[i].name = $scope.defaultServices[j];
                  $scope.defaultServices[j].picked = true;
                  break;
                }
              }
            }
          }
        });


        $scope.changeContractType = function (type) {
          $scope.serviceContract.billType = type;
        };

        $scope.createNewServiceContractServices = function (form, NewServiceContractServices) {
          $scope.showRequiredFieldErrorSCS =  false;
          $scope.showNewServiceContractServiceValidationError = false;
          if (form.$valid) {
            validateNewServiceName(NewServiceContractServices.name).then(function (resp) {
              if (resp) {
                var serviceContractServices = {
                  name: NewServiceContractServices.name,
                  count: NewServiceContractServices.count,
                  rate: NewServiceContractServices.rate,
                  taxIds: [],
                  taxes: NewServiceContractServices.taxes
                };
                $scope.serviceContract.serviceContractServices.push(serviceContractServices);
                $scope.NewServiceContractServices = {
                  name: null,
                  count: null,
                  rate: null,
                  taxIds: [],
                  taxes: $scope.addDefaultTaxes()
                };
                reInitServiceContractServicesForm();
                $scope.calculateTotalAmount();
              }
            }, function() {
              $scope.showNewServiceContractServiceValidationError = true;
            });
          } else {
            $scope.showRequiredFieldErrorSCS = true;
          }
        };

        function reInitServiceContractServicesForm() {
          $scope.reInitServiceContractServicesForm = false;
          $timeout(function () {
            $scope.reInitServiceContractServicesForm = true;
          }, 0);
        }

        function reInitServiceForm() {
          $scope.reInitServiceForm = false;
          $timeout(function () {
            $scope.reInitServiceForm = true;
          }, 0);
        }

        $scope.deleteServiceContractService = function (service) {
          for (var i = 0; i < $scope.serviceContract.serviceContractServices.length; i++) {
            if ($scope.serviceContract.serviceContractServices[i] == service) {
              $scope.serviceContract.serviceContractServices.splice(i, 1);
              break;
            }
          }
          $scope.calculateTotalAmount();
        };


        $scope.setOpenedTab = function (tab) {
          $scope.openedTab = tab;
        };

        $scope.isTabOpened = function (tab) {
          return $scope.openedTab === tab
        };

        $scope.deletePresettupDeviceService = function(service) {
          for (var i = 0; i < $scope.presettupDeviceServices.length; i++) {
            if ($scope.presettupDeviceServices[i] == service) {
              $scope.presettupDeviceServices.splice(i, 1);
              break;
            }
          }
          $scope.calculateTotalAmount();
        };

        $scope.deletePresettupUserService = function(service) {
          for (var i = 0; i < $scope.presettupUsersServices.length; i++) {
            if ($scope.presettupUsersServices[i] == service) {
              $scope.presettupUsersServices.splice(i, 1);
              break;
            }
          }
          $scope.calculateTotalAmount();
        };




        $scope.addServiceExpense = function (form, serviceExpense) {
          $scope.showRequiredFieldErrorServiceExpense = false;

          if (form.$valid) {
            var newServiceExpense = {
              name: serviceExpense.name,
              quantity: serviceExpense.quantity,
              description: serviceExpense.description,
              date: serviceExpense.date
            };
            $scope.serviceContract.serviceExpenses.push(newServiceExpense);
            for (var i = 0; i < $scope.defaultServices.length; i++) {
              if ($scope.defaultServices[i] == serviceExpense.name) {
                $scope.defaultServices[i].picked = true;
              }
            }
            $scope.newServiceExpense = {
              name: null,
              quantity: null,
              description: null,
              date: $filter('date')($scope.defaultDareForServiceExpense, 'dd MMM yyyy')
            };
            reInitNewServiceExpenseForm();
            $scope.calculateTotalAmount();
          } else {
            $scope.showRequiredFieldErrorServiceExpense = true;
          }
        };


        $scope.deleteServiceExpense = function (service) {
          for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
            if ($scope.serviceContract.serviceExpenses[i] == service) {
              $scope.serviceContract.serviceExpenses.splice(i, 1);

              for (var j = 0; j < $scope.defaultServices.length; j++) {
                if ($scope.defaultServices[j] == service.name) {
                  $scope.defaultServices[j].picked = false;
                }
              }

              break;
            }
          }
          $scope.calculateTotalAmount();
        };

        $scope.showAddButtonNewService = true;

        $scope.addNewService = function (form, service) {
          $scope.showAddButtonNewService = false;
          $scope.showRequiredFieldErrorService = false;
          $scope.showNewServiceError = false;
          $scope.showNewServiceValidationError = false;
          if (form.$valid) {

            validateNewServiceName(service.name).then(function (resp) {
              if (resp) {
                $scope.serviceContract.services.push(service);
                $scope.newService = {
                  name: '',
                  rate: 0,
                  billable: true,
                  taxes: $scope.addDefaultTaxes(),
                  taxIds: []
                };
                reInitServiceForm();
                $scope.showAddButtonNewService = true;
              }
            }, function() {
              $scope.showNewServiceValidationError = true;
              $scope.showAddButtonNewService = true;
            })

          } else {
            $scope.showRequiredFieldErrorService = true;
            $scope.showAddButtonNewService = true;
          }
        };

        $scope.deleteService = function (service) {
          for (var i = 0; i < $scope.serviceContract.services.length; i++) {
            if ($scope.serviceContract.services[i] == service) {
              $scope.serviceContract.services.splice(i, 1);
              break;
            }
          }
        };

        $scope.showErrorSCSTTNameRequired = false;
        function errorSCSTTNameRequiredTimeOut() {
          $scope.showErrorSCSTTNameRequired = true;
          $timeout(function () {
            $scope.showErrorSCSTTNameRequired = false;
          }, 2000);
        }


        $scope.addServiceContractServicesToTrack = function(service) {
          $scope.showAddButtonNewSCSTT = false;
          if(service.name && service.name.length) {
            validateNewServiceName(service.name).then(function(resp) {
              if(resp) {
                $scope.serviceContract.serviceContractServicesToTrack.push(service);
                $scope.newServiceContractServicesToTrack = {
                  name: ''
                };
                $scope.showAddButtonNewSCSTT = true;
              }
            })
          } else {
            errorSCSTTNameRequiredTimeOut();
            $scope.showAddButtonNewSCSTT = true;
          }
        };

        $scope.deleteServiceContractServicesToTrack = function(service) {
          for (var i = 0; i < $scope.serviceContract.serviceContractServicesToTrack.length; i++) {
            if ($scope.serviceContract.serviceContractServicesToTrack[i] == service) {
              $scope.serviceContract.serviceContractServicesToTrack.splice(i, 1);
              break;
            }
          }
        };

        $scope.isAdditionalServiceNameUnique = function (name) {
          var check = true;
          if (name) {
            if ($scope.serviceContract.billType == 'OTHER') {
              if ($scope.serviceContract.serviceExpenses.length > 0) {
                for (var i = 0; i < $scope.serviceContract.serviceExpenses.length; i++) {
                  if ($scope.serviceContract.serviceExpenses[i].name.name == name) {
                    check = false;
                    break;
                  }
                }
              }
              if ($scope.serviceContract.productExpenses.length > 0) {
                for (var j = 0; j < $scope.serviceContract.productExpenses.length; j++) {
                  if ($scope.serviceContract.productExpenses[j].name.name == name) {
                    check = false;
                    break;
                  }
                }
              }
            } else {
              if ($scope.serviceContract.serviceContractServices.length > 0) {
                for (var n = 0; n < $scope.serviceContract.serviceContractServices.length; n++) {
                  if ($scope.serviceContract.serviceContractServices[n].name == name) {
                    check = false;
                    break;
                  }
                }
              }
            }
          }
          if ($scope.serviceContract.services.length > 0) {
            for (var h = 0; h < $scope.serviceContract.services.length; h++) {
              if ($scope.serviceContract.services[h].name == name) {
                check = false;
                break;
              }
            }
          }
          if ($scope.serviceContract.serviceContractServicesToTrack.length > 0) {
            for (var m = 0; m < $scope.serviceContract.serviceContractServicesToTrack.length; m++) {
              if ($scope.serviceContract.serviceContractServicesToTrack[m].name == name) {
                check = false;
                break;
              }
            }
          }
          return check;
        };

        $scope.isNewServiceContractServiceNameUnique = function (name) {
          var check = true;
          if (name) {
            if ($scope.serviceContract.services.length > 0) {
              for (var i = 0; i < $scope.serviceContract.services.length; i++) {
                if ($scope.serviceContract.services[i].name == name) {
                  check = false;
                  break;
                }
              }
            }
            if ($scope.serviceContract.serviceContractServices.length > 0) {
              for (var j = 0; j < $scope.serviceContract.serviceContractServices.length; j++) {
                if ($scope.serviceContract.serviceContractServices[j].name == name) {
                  check = false;
                  break;
                }
              }
            }
            if ($scope.serviceContract.serviceContractServicesToTrack.length > 0) {
              for (var m = 0; m < $scope.serviceContract.serviceContractServicesToTrack.length; m++) {
                if ($scope.serviceContract.serviceContractServicesToTrack[m].name == name) {
                  check = false;
                  break;
                }
              }
            }
          }
          return check;
        };


        function validateNewServiceName(serviceName) {
          var deferred = $q.defer();
          if (serviceName) {
            if (!$scope.serviceContract.startDate || !$scope.serviceContract.endDate) {
              $scope.showNewServiceError = true;
              $scope.newServiceErrorMessage = 'Please enter start and end date to check service name';
              deferred.reject();
            } else {
              var companyId = returnCompanyId();
              var name = [];
              name.push(serviceName);

              var startDate = $filter('date')($scope.serviceContract.startDate, 'yyyy/MM/dd');
              var endDate = $filter('date')($scope.serviceContract.endDate, 'yyyy/MM/dd');
              ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, name, function (resp) {
                if (Object.keys(resp).length === 0) {
                  console.log('service name ' + serviceName + ' is valid');
                  deferred.resolve(resp);
                } else {
                  console.log('service name ' + serviceName + ' is NOT valid');
                  deferred.reject();
                }
              });
            }
          }
          return deferred.promise;
        }

        function validateListOfNames(listOFNames) {
          var deferred = $q.defer();
          var companyId = returnCompanyId();
          var startDate = $filter('date')($scope.serviceContract.startDate, 'yyyy/MM/dd');
          var endDate = $filter('date')($scope.serviceContract.endDate, 'yyyy/MM/dd');
          ServicesService.searchDuplicatedServiceNames(startDate, endDate, companyId, listOFNames, function (resp) {
            if (Object.keys(resp).length === 0) {
              deferred.resolve(resp);
            } else {
              deferred.reject();
            }
          });
          return deferred.promise;
        }

        function returnCompanyId() {
          var id;
          if ($scope.serviceContract.companyId) {
            id = $scope.serviceContract.companyId;
          } else if ($scope.contractCompany && $scope.contractCompany.id) {
            id = $scope.contractCompany.id;
          } else if ($scope.companyId) {
            id = $scope.companyId;
          }
          return id;
        }

        function checkForInvalidFields() {
          function formCheck() {
            return ($scope.serviceContract.description &&
            $scope.serviceContract.startDate &&
            $scope.serviceContract.endDate &&
            $scope.serviceContract.billType);
          }

          function serviceCheck() {
            if ($scope.serviceContract.billType == 'DEVICE') {
              var deviceCheck =  $scope.serviceContract.serviceContractServices.length > 0;
              var presetupCheck = $scope.presettupDeviceServices.length > 0;
              return (deviceCheck || presetupCheck)
            } else if($scope.serviceContract.billType == 'USER'){
              var userCheck =  $scope.serviceContract.serviceContractServices.length > 0;
              var presetupCheck  =  $scope.presettupUsersServices.length > 0;
              return (userCheck || presetupCheck)
            }else if($scope.serviceContract.billType == 'OTHER'){
              return ($scope.serviceContract.serviceExpenses.length > 0 || $scope.serviceContract.productExpenses.length > 0);
            }
          }
          $scope.showRequiredFieldError = !formCheck();
          if(!serviceCheck()) {
            errorTimeOut()
          }
          return (formCheck() && serviceCheck());
        }

        function errorTimeOut() {
          $scope.showServiceLengthCheckError = true;
          $timeout(function () {
            $scope.showServiceLengthCheckError = false;
          }, 2000);
        }

        $scope.isShowingErrorsServiceContract = function (form, fieldName) {
          return form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldError) && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewSCSField = function (form, fieldName) {
          return form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldErrorSCS) && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewServiceField = function (form, fieldName) {
          return form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldErrorService) && !form[fieldName].$valid;
        };

        $scope.isShowingErrorsNewServicExpenseeField = function (form, fieldName) {
          return form[fieldName] && (form[fieldName].$dirty || $scope.showRequiredFieldErrorServiceExpense) && !form[fieldName].$valid;
        };





        $scope.calculateTotalAmount = function () {
          var totalAmount = 0;
          if($scope.editMode) {
            if ($scope.serviceContract.billType === 'OTHER') {
              if ($scope.serviceContract.serviceExpenses.length > 0) {
                for(var j=0; j<$scope.serviceContract.serviceExpenses.length; j++) {
                  var servCost = $scope.serviceContract.serviceExpenses[j].quantity * ($scope.serviceContract.serviceExpenses[j].name.rate / 60);
                  totalAmount = totalAmount+servCost;
                }
              }
              if ($scope.serviceContract.productExpenses.length > 0) {
                for(var i=0; i<$scope.serviceContract.productExpenses.length; i++) {
                  var productCost = $scope.serviceContract.productExpenses[i].quantity * $scope.serviceContract.productExpenses[i].salePrice;
                  totalAmount = totalAmount+productCost;
                }
              }
            } else {
              if($scope.serviceContract.serviceContractServices.length>0) {
                for(var t=0; t<$scope.serviceContract.serviceContractServices.length; t++) {
                  var scs = $scope.serviceContract.serviceContractServices[t].count * $scope.serviceContract.serviceContractServices[t].rate;
                  totalAmount = totalAmount+scs;
                }
              }
              if($scope.serviceContract.billType === 'USER') {
                if($scope.presettupUsersServices.length>0) {
                  for(var u=0; u<$scope.presettupUsersServices.length; u++) {
                    if($scope.presettupUsersServices[u].count && $scope.presettupUsersServices[u].rate) {
                      var ups = $scope.presettupUsersServices[u].count * $scope.presettupUsersServices[u].rate;
                      totalAmount = totalAmount+ups;
                    }
                  }
                }
              } else if($scope.serviceContract.billType === 'DEVICE') {
                if($scope.presettupDeviceServices.length>0) {
                  for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                    if($scope.presettupDeviceServices[d].count && $scope.presettupDeviceServices[d].rate) {
                      var dps = $scope.presettupDeviceServices[d].count * $scope.presettupDeviceServices[d].rate;
                      totalAmount = totalAmount+dps;
                    }
                  }
                }
              }
            }
          }
          $scope.total = totalAmount;
        };

        function convertMinutesToHour(minutes) {
          var hours = Math.floor(minutes/60);
          var part = (minutes%60) / 60;
          return hours + part;
        }

        function createServiceContract(serviceContract) {
          $scope.showValidationFailMessage = false;
          if (serviceContract) {
            var servContract = {
              id: null,
              description: serviceContract.description,
              type: "SERVICE_CONTRACT",
              startDate: $scope.startDate,
              endDate: $scope.endDate,
              customInterval: serviceContract.customInterval,
              billType: serviceContract.billType,
              companyId: returnCompanyId(),
              services: [],
              serviceContractServices: [],
              serviceExpenses: null,
              productExpenses: null,
              serviceContractServicesToTrack: []
            };

            if (servContract.billType == 'OTHER') {
              servContract.serviceExpenses = [];
              servContract.productExpenses = []
            }

            if ($scope.serviceContract.interval == 'MONTHLY' || $scope.serviceContract.interval == 'YEARLY') {
              servContract.interval = serviceContract.interval;
            } else {
              servContract.interval = null;
            }

            var sd = new Date($scope.serviceContract.startDate);
            sd.setHours(0, 0, 0, 0);
            sd.setSeconds(0);
            sd.setMilliseconds(0);
            servContract.startDate = $filter('date')(sd, 'yyyy/MM/dd');

            var ed = new Date($scope.serviceContract.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            servContract.endDate = $filter('date')(ed, 'yyyy/MM/dd');

            if(serviceContract.serviceContractServicesToTrack && serviceContract.serviceContractServicesToTrack.length) {
              for (var l=0; l<serviceContract.serviceContractServicesToTrack.length; l++) {
                var scstt = {
                  name: serviceContract.serviceContractServicesToTrack[l].name,
                  rate: 0
                };
                servContract.serviceContractServicesToTrack.push(scstt);
              }
            }

            if (serviceContract.services && serviceContract.services.length) {
              for (var i = 0; i < serviceContract.services.length; i++) {
                var serv = {
                  name: serviceContract.services[i].name,
                  rate: 0,
                  billable: serviceContract.services[i].billable,
                  taxIds: []
                };
                if(serviceContract.services[i].billable) {
                  serv.rate = serviceContract.services[i].rate;
                  if (serviceContract.services[i].taxes && serviceContract.services[i].taxes.length) {
                    for (var n = 0; n < serviceContract.services[i].taxes.length; n++) {
                      serv.taxIds.push(serviceContract.services[i].taxes[n].id);
                    }
                  }
                }
                servContract.services.push(serv);
              }
            }

            if(serviceContract.billType === 'DEVICE' && $scope.presettupDeviceServices.length>0) {
              for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                var dServ = {
                  name: $scope.presettupDeviceServices[d].name,
                  rate: $scope.presettupDeviceServices[d].rate,
                  count: $scope.presettupDeviceServices[d].count,
                  taxIds: []
                };
                if ($scope.presettupDeviceServices[d].taxes && $scope.presettupDeviceServices[d].taxes.length) {
                  for (var j = 0; j < $scope.presettupDeviceServices[d].taxes.length; j++) {
                    dServ.taxIds.push($scope.presettupDeviceServices[d].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(dServ);
              }
            }

            if(serviceContract.billType === 'USER' && $scope.presettupUsersServices.length>0) {
              for(var d=0; d<$scope.presettupUsersServices.length; d++) {
                var uServ = {
                  name: $scope.presettupUsersServices[d].name,
                  rate: $scope.presettupUsersServices[d].rate,
                  count: $scope.presettupUsersServices[d].count,
                  taxIds: []
                };
                if ($scope.presettupUsersServices[d].taxes && $scope.presettupUsersServices[d].taxes.length) {
                  for (var j = 0; j < $scope.presettupUsersServices[d].taxes.length; j++) {
                    uServ.taxIds.push($scope.presettupUsersServices[d].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(uServ);
              }
            }

            if (serviceContract.serviceContractServices && serviceContract.serviceContractServices.length) {
              for (var m = 0; m < serviceContract.serviceContractServices.length; m++) {
                var scs = {
                  name: serviceContract.serviceContractServices[m].name,
                  rate: serviceContract.serviceContractServices[m].rate,
                  count: serviceContract.serviceContractServices[m].count,
                  taxIds: []
                };
                if (serviceContract.serviceContractServices[m].taxes && serviceContract.serviceContractServices[m].taxes.length) {
                  for (var j = 0; j < serviceContract.serviceContractServices[m].taxes.length; j++) {
                    scs.taxIds.push(serviceContract.serviceContractServices[m].taxes[j].id);
                  }
                }
                servContract.serviceContractServices.push(scs);
              }
            }

            if (serviceContract.serviceExpenses && serviceContract.serviceExpenses.length) {
              for (var u = 0; u < serviceContract.serviceExpenses.length; u++) {
                if (serviceContract.serviceExpenses[u] && serviceContract.serviceExpenses[u].name) {
                  var servExp = {
                    serviceId: serviceContract.serviceExpenses[u].name.serviceId,
                    quantity: convertMinutesToHour(serviceContract.serviceExpenses[u].quantity),
                    description: serviceContract.serviceExpenses[u].description,
                    date: new Date(serviceContract.serviceExpenses[u].date).getTime()
                  };
                  servContract.serviceExpenses.push(servExp);
                }
              }
            }

            if (serviceContract.productExpenses && serviceContract.productExpenses.length) {
              for (var t = 0; t < serviceContract.productExpenses.length; t++) {
                if (serviceContract.productExpenses[t] && serviceContract.productExpenses[t].name) {
                  var prodExp = {
                    productId: returnProductId(serviceContract.productExpenses[t]),
                    quantity: serviceContract.productExpenses[t].quantity,
                    salePrice: serviceContract.productExpenses[t].salePrice
                  };
                  servContract.productExpenses.push(prodExp);
                }
              }
            }

            console.log(servContract);

            if(Utils.compareDateNowWithDate(serviceContract.startDate)) {
              askCreateBillableItemNow(servContract)
            } else {
              sendContractCreateRequest(servContract, false)
            }
          }

          function askCreateBillableItemNow(servContract) {
            var answer = false;
            var confirmMessage = 'Do we need to create the billable item now? ';
            var confirmButton = 'Yes, create';
            UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function(){
              answer = true;
              sendContractCreateRequest(servContract, true);
            }, function() {
              sendContractCreateRequest(servContract, false)
            })
          }

          function sendContractCreateRequest(servContract, createBillableItem) {
            AgreementsService.createContract(servContract, createBillableItem, function (resp) {
              console.log(resp);
              if (resp.message === 'Validation failed') {
                $scope.showValidationFailMessage = true;
              } else {
                $scope.closeModal();
              }
            })
          }
        }

        function returnProductId(productExpenses) {
          if(productExpenses.name && productExpenses.name.versionedId && productExpenses.name.versionedId.id) {
            return productExpenses.name.versionedId.id
          } else if(productExpenses.productId) {
            return productExpenses.productId
          }
        }

        $scope.refreshNewProductExpense = function(newServiceExpense) {
          $scope.newProductExpense = newServiceExpense
        };

        function disableCreateButtonTimeout() {
          $scope.dissableCreateButton = true;
          $timeout(function () {
            $scope.dissableCreateButton = false;
          }, 2000);
        }


        $scope.validateAndCreateServiceContract = function (serviceContract) {
          disableCreateButtonTimeout();
          if(checkForInvalidFields()) {
            var emptyServices = true;
            var checkSCS = ($scope.NewServiceContractServices && $scope.NewServiceContractServices.name && $scope.NewServiceContractServices.name.length>0);
            var checkPE = ($scope.newProductExpense && $scope.newProductExpense.name && $scope.newProductExpense.name.description.length>0);
            var checkSE = ($scope.newServiceExpense && $scope.newServiceExpense.name && $scope.newServiceExpense.name.name.length>0);
            var checkServices = ($scope.newService && $scope.newService.name && $scope.newService.name.length>0);
            var checkSCSTT = ($scope.newServiceContractServicesToTrack && $scope.newServiceContractServicesToTrack.name && $scope.newServiceContractServicesToTrack.name.length)
            if($scope.serviceContract.billType == 'OTHER') {
              if(checkPE || checkSE) {
                emptyServices = false;
              }
              if($scope.serviceContract.isAdditionalServices) {
                if(checkServices) {
                  emptyServices = false;
                }
              }
              if(checkSCSTT) {
                emptyServices = false;
              }
            } else {
              if(checkSCS) {
                emptyServices = false;
              }
              if($scope.serviceContract.isAdditionalServices) {
                if(checkServices) {
                  emptyServices = false;
                }
              }
              if(checkSCSTT) {
                emptyServices = false;
              }
            }

            if(!emptyServices) {
              var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
              var confirmButton = 'Yes, create';
              UserConfirmationsService.show(confirmMessage, confirmButton, false, 'No, do not create').then(function() {
                emptyServices = true;
                validateServiceContractServices(serviceContract);
              })
            } else {
              validateServiceContractServices(serviceContract);
            }
          }

          function validateServiceContractServices(serviceContract) {
            var listOfNames = [];
            var listOfAdditionalServicesNames = [];
            if (serviceContract.billType == 'DEVICE' || serviceContract.billType == 'USER') {
              for (var i = 0; i < serviceContract.serviceContractServices.length; i++) {
                listOfNames.push(serviceContract.serviceContractServices[i].name);
              }
              if(serviceContract.billType == 'DEVICE') {
                if($scope.presettupDeviceServices.length>0) {
                  for(var d=0; d<$scope.presettupDeviceServices.length; d++) {
                    listOfNames.push($scope.presettupDeviceServices[d].name);
                  }
                }

              } else if(serviceContract.billType == 'USER') {
                if($scope.presettupUsersServices.length>0) {
                  for(var u=0; u<$scope.presettupUsersServices.length; u++) {
                    listOfNames.push($scope.presettupUsersServices[u].name);
                  }
                }
              }
            }
            if(serviceContract.services.length>0) {
              for (var n = 0; n < serviceContract.services.length; n++) {
                listOfAdditionalServicesNames.push(serviceContract.services[n].name);
              }
            }
            if(serviceContract.serviceContractServicesToTrack.length>0) {
              for (var l = 0; l < serviceContract.serviceContractServicesToTrack.length; l++) {
                listOfAdditionalServicesNames.push(serviceContract.serviceContractServicesToTrack[l].name);
              }
            }

            if(listOfNames.length > 0) {
              validateListOfNames(listOfNames).then(function(resp) {
                if(resp) {
                  if (listOfAdditionalServicesNames.length>0) {
                    validateListOfNames(listOfAdditionalServicesNames).then(function (resp) {
                      if (resp) {
                        createServiceContract(serviceContract);
                      }
                    })
                  } else {
                    createServiceContract(serviceContract);
                  }
                }
              })
            } else {
              if(listOfAdditionalServicesNames.length>0) {
                validateListOfNames(listOfAdditionalServicesNames).then(function (resp) {
                  if (resp) {
                    createServiceContract(serviceContract);
                  }
                })
              } else {
                createServiceContract(serviceContract);
              }
            }
          }
        }


      }])

}());
