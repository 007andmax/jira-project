'use strict';

(function () {

  angular.module('quicktech.core.serviceAgreements').controller('serviceContractCtrl',
    ['$scope', 'AgreementsService', 'CompaniesService', 'ServicesService',
      'ProductsService', '$filter', '$timeout', 'TaxesService', '$q', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, AgreementsService, CompaniesService, ServicesService,
                ProductsService, $filter, $timeout, TaxesService, $q, UserConfirmationsService) {

        $scope.intervals = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days', '1 day'];
        $scope.serviceContractType = {
          DEVICE: 'By Device',
          USER: 'By Users',
          OTHER: 'Other'
        };

        $scope.taxes = TaxesService.getAll();

        $scope.reInitEndDate = true;
        $scope.reInitServiceContractServicesForm = true;
        $scope.reInitServiceForm = true;

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


        if ($scope.editMode) {
          $scope.serviceContract = {
            billType: 'DEVICE',
            minStartDate: Date.now(),
            isAdditionalServices: false,
            includedHours: null,
            blockRate: null,
            interval: "MONTHLY",
            serviceContractServices: [],
            services: [],
            serviceExpenses: [],
            productExpenses: []
          };
        } else {
          $scope.serviceContract = angular.copy($scope.editContract);
          $scope.serviceContract.endDatePreview = $scope.serviceContract.endDate;
          $scope.serviceContract.startDatePreview = $scope.serviceContract.startDate;
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
          $timeout(function () {
            $scope.calculateTotalAmount()
          }, 100);
        }

        preCreateFirstServicesEntities();

        function preCreateFirstServicesEntities() {

          $scope.NewServiceContractServices = {
            name: null,
            count: null,
            rate: null,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };

          if($scope.serviceContract.billType === 'DEVICE') {
            $scope.NewServiceContractServices.name = 'Managed workstations';
          } else if($scope.serviceContract.billType === 'USER') {
            $scope.NewServiceContractServices.name = 'Managed users';
          }

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
            billable: false,
            taxIds: [],
            taxes: $scope.addDefaultTaxes()
          };
        }



        $scope.formattingDateForServiceExpenses = function (date) {
          var d = new Date(date);
          return d;
        };

        $scope.serviceContract.minEndDate = $scope.serviceContract.minStartDate + month;
        $scope.serviceContract.endDate = $scope.serviceContract.minStartDate + month;

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

        function changeMinEndDate(period) {
          var date = $scope.serviceContract.startDate;
          var endDate = new Date(date);
          switch (period) {
            case('Month'):
              endDate.setMonth(endDate.getMonth() + 1);
              break;
            case('Year'):
              endDate.setFullYear(endDate.getFullYear() + 1);
              break;
            default:
              endDate.setTime(endDate.getTime() + day * period);
          }
          $scope.serviceContract.endDate = $filter('date')(endDate, 'dd MMM yyyy');
          $scope.serviceContract.minEndDate = $filter('date')(endDate, 'dd MMM yyyy');
          $scope.serviceContract.minStartDate = date.getTime();
          //$scope.serviceContract.minStartDate = $scope.serviceContract.startDate.getTime();
          reInitEndDate();
        }

        function reInitEndDate() {
          $scope.reInitEndDate = false;
          $timeout(function () {
            $scope.reInitEndDate = true;
          }, 0);
        }




        $scope.$watch(function () {
          return $scope.serviceContract.interval;
        }, function (interval) {

          if (interval === 'MONTHLY') {
            $scope.serviceContract.period = 'Month';
            $scope.serviceContract.interval = 'MONTHLY';
            $scope.serviceContract.customInterval = null;
          } else if (interval === 'YEARLY') {
            $scope.serviceContract.period = 'Year';
            $scope.serviceContract.interval = 'YEARLY';
            $scope.serviceContract.customInterval = null;
          } else if (interval === '30 days') {
            $scope.serviceContract.period = 30;
            $scope.serviceContract.customInterval = 30;
          } else if (interval === '15 days') {
            $scope.serviceContract.period = 15;
            $scope.serviceContract.customInterval = 15;
          } else if (interval === '7 days') {
            $scope.serviceContract.period = 7;
            $scope.serviceContract.customInterval = 7;
          } else if (interval === '1 day') {
            $scope.serviceContract.period = 1;
            $scope.serviceContract.customInterval = 1;
          }
          changeMinEndDate($scope.serviceContract.period);
          reInitEndDate()
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

        ProductsService.getProductsByCompany($scope, returnCompanyId(), function (data) {
          console.log('products ', data);
          for (var i = 0; i < data.length; i++) {
            var prod = {
              name: data[i].description,
              productId: data[i].versionedId.id,
              quantity: 0,
              salePrice: 0,
              picked: false
            };

            $scope.defaultProducts.push(prod);
          }

          if ($scope.serviceContract.productExpenses.length > 0) {
            for (var i = 0; i < $scope.serviceContract.productExpenses.length; i++) {
              for (var j = 0; j < $scope.defaultProducts.length; j++) {
                if ($scope.serviceContract.productExpenses[i].serviceId === $scope.defaultProducts[j].serviceId) {
                  $scope.serviceContract.productExpenses[i].name = $scope.defaultProducts[j];
                  $scope.defaultProducts[j].picked = true;
                  break;
                }
              }
            }
          }
        });


        $scope.changeContractType = function (type) {
          $scope.serviceContract.billType = type;
          if($scope.serviceContract.billType === 'DEVICE') {
            if(!$scope.serviceContract.serviceContractServices.length>0) {
              $scope.NewServiceContractServices.name = 'Managed workstations';
            }
          } else if($scope.serviceContract.billType === 'USER') {
            if(!$scope.serviceContract.serviceContractServices.length>0) {
              $scope.NewServiceContractServices.name = 'Managed users';
            }
          }
        };

        $scope.createNewServiceContractServices = function (form, NewServiceContractServices) {
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


        $scope.addServiceExpense = function (form, serviceExpense) {

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
              date: null
            };
            $scope.calculateTotalAmount();
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


        $scope.addProductExpense = function (form, productExpense) {

          if (form.$valid) {

            var newProductExpense = {
              name: productExpense.name,
              quantity: productExpense.quantity,
              salePrice: productExpense.salePrice
            };
            $scope.serviceContract.productExpenses.push(newProductExpense);

            for (var i = 0; i < $scope.defaultProducts.length; i++) {
              if ($scope.defaultProducts[i] == productExpense.name) {
                $scope.defaultProducts[i].picked = true;
              }
            }

            $scope.newProductExpense = {
              name: null,
              quantity: null,
              salePrice: null
            };
            $scope.calculateTotalAmount();
          }
        };

        $scope.deleteProductExpense = function (product) {
          for (var i = 0; i < $scope.serviceContract.productExpenses.length; i++) {
            if ($scope.serviceContract.productExpenses[i] == product) {
              $scope.serviceContract.productExpenses.splice(i, 1);

              for (var j = 0; j < $scope.defaultProducts.length; j++) {
                if ($scope.defaultProducts[j] == product.name) {
                  $scope.defaultProducts[j].picked = false;
                }
              }

              break;
            }
          }
          $scope.calculateTotalAmount();
        };

        $scope.addNewService = function (form, service) {
          $scope.showNewServiceError = false;
          $scope.showNewServiceValidationError = false;
          if (form.$valid) {

            validateNewServiceName(service.name).then(function (resp) {
              if (resp) {
                $scope.serviceContract.services.push(service);
                $scope.newService = {
                  name: '',
                  rate: 0,
                  billable: false,
                  taxes: $scope.addDefaultTaxes(),
                  taxIds: []
                };
                reInitServiceForm()
              }
            }, function() {
              $scope.showNewServiceValidationError = true;
            })

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

        $scope.disableCreateButton = function () {
          function formCheck() {
            return ($scope.serviceContract.description &&
            $scope.serviceContract.startDate &&
            $scope.serviceContract.endDate &&
            $scope.serviceContract.billType);
          }

          function serviceCheck() {
            if ($scope.serviceContract.billType == 'DEVICE' || $scope.serviceContract.billType == 'USER') {
              return $scope.serviceContract.serviceContractServices.length > 0;
            } else {
              return ($scope.serviceContract.serviceExpenses.length > 0 || $scope.serviceContract.productExpenses.length > 0);
            }
          }

          return (formCheck() && serviceCheck());
        };

        $scope.calculateTotalAmount = function () {
          var totalAmount = 0;
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
          }

          $scope.total = totalAmount;
        };

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
              productExpenses: null
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
            servContract.startDate = sd.getTime();

            var ed = new Date($scope.serviceContract.endDate);
            ed.setHours(0, 0, 0, 0);
            ed.setSeconds(0);
            ed.setMilliseconds(0);
            servContract.endDate = ed.getTime();

            if (serviceContract.services && serviceContract.services.length) {
              for (var i = 0; i < serviceContract.services.length; i++) {
                var serv = {
                  name: serviceContract.services[i].name,
                  rate: serviceContract.services[i].rate,
                  billable: serviceContract.services[i].billable,
                  taxIds: []
                };
                if (serviceContract.services[i].taxes && serviceContract.services[i].taxes.length) {
                  for (var n = 0; n < serviceContract.services[i].taxes.length; n++) {
                    serv.taxIds.push(serviceContract.services[i].taxes[n].id);
                  }
                }
                servContract.services.push(serv);
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
                    quantity: serviceContract.serviceExpenses[u].quantity,
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
                    productId: serviceContract.productExpenses[t].name.productId,
                    quantity: serviceContract.productExpenses[t].quantity,
                    salePrice: serviceContract.productExpenses[t].salePrice
                  };
                  servContract.productExpenses.push(prodExp);
                }
              }
            }

            console.log(servContract);


            AgreementsService.createContract(servContract, function (resp) {
              console.log(resp);
              if (resp.message === 'Validation failed') {
                $scope.showValidationFailMessage = true;
              } else {
                $scope.closeModal();
              }
            })
          }
        }


        $scope.validateAndCreateServiceContract = function (serviceContract) {
          // var emptyServices = true;
          // var checkSCS = ($scope.NewServiceContractServices && $scope.NewServiceContractServices.name && $scope.NewServiceContractServices.name.length);
          // var checkPE = ($scope.newProductExpense && $scope.newProductExpense.name && $scope.newProductExpense.name.length);
          // var checkSE = ($scope.newServiceExpense && $scope.newServiceExpense.name && $scope.newServiceExpense.name.length);
          // var checkServices = ($scope.newService && $scope.newService.name && $scope.newService.name.length);
          // if(!checkServices) {
          //   if(serviceContract.billType === 'OTHER') {
          //
          //   }
          //   emptyServices = false;
          //   var confirmMessage = 'You have filled service name field but didn\'t add it to contract service list. Are you sure you want to create contract ?';
          //   var confirmButton = 'Yes, create';
          //   UserConfirmationsService.show(confirmMessage, confirmButton).then(function() {
          //     emptyServices = true;
          //     validateServiceContractServices(serviceContract);
          //   })
          // } else {
          //   validateServiceContractServices(serviceContract);
          // }

          validateServiceContractServices(serviceContract);

          function validateServiceContractServices(serviceContract) {
            var listOfNames = [];
            var listOfAdditionalServicesNames = [];
            if (serviceContract.billType == 'DEVICE' || serviceContract.billType == 'USER') {
              for (var i = 0; i < serviceContract.serviceContractServices.length; i++) {
                listOfNames.push(serviceContract.serviceContractServices[i].name);
              }
            }
            if(serviceContract.services.length>0) {
              for (var n = 0; n < serviceContract.services.length; n++) {
                listOfAdditionalServicesNames.push(serviceContract.services[n].name);
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
