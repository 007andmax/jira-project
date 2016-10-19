'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createCompanyCtrl',
    [
      '$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService',
      'TaxRatesService', 'AddressesService', 'ServicesService', 'quicktech.common.services.PhoneFormats',
      'quicktech.common.services.SharedStateService', '$state', '$timeout', '$rootScope',
      'quicktech.common.services.PermissionsService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService,
                TaxRatesService, AddressesService, ServicesService, PhoneFormats, SharedStateService,
                $state, $timeout, $rootScope, PermissionsService, UserConfirmationsService) {

        if (!PermissionsService.isAllowed('VIEW_COMPANIES')) {
          $scope.closeWindow();
        }

        var steps = ['info', 'location', 'contact', 'billing', 'agent'];
        var savedState = $scope.getLastSavedState('company');

        if (savedState.type === 'company' && savedState.item) {
          var companyId = savedState.item.id,
            company = CompaniesService.getOneById(companyId);

          var companyData = CompaniesService.getCompanyData($scope, companyId, function () {

            if (!companyData.addresses || companyData.addresses.length === 0) {
              companyData.addresses = [{}];
            }

            if (!companyData.contacts || companyData.contacts.length === 0) {
              companyData.contacts = [getEmptyContact()];
            }

            $scope.isLastInvoiceSubsciption = companyData.contacts[0].subscription &&
              companyData.contacts[0].subscription.invoice &&
              UsersService.getAllByCompanyId(companyId).filter(function (user) {
                return user.subscription.invoice;
              }).length <= 1;

            for (var k = 0; k < companyData.services.length; k++) {
              $scope.selectedServices[companyData.services[k].name] = true
            }

            $scope.editCompany = companyData.staticCopy();
            $scope.contact = $scope.editCompany.contacts[0];

            if ($scope.editCompany.isVendor) {
              CompaniesService.isVendorHasProducts(companyId, function (resp) {
                $scope.editCompany.hasProducts = resp.isProductExist;
              });
            }

            if (company.defaultPaymentMethod) {
              $scope.editCompany.defaultPaymentMethod = company.defaultPaymentMethod.split('_').map(function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
              }).join(' ');
            }

            if (!$scope.editCompany.credential) {
              $scope.editCompany.login = '';
              $scope.editCompany.password = '';
            }

            TaxRatesService.getAllByCompany($scope.currentUser.company.id, $scope, function (resp) {
              $scope.techCompanyTax = angular.copy(resp);

              for (var i = 0; i < $scope.editCompany.taxRates.length; i++) {
                $scope.selectedTax[$scope.editCompany.taxRates[i].code] = true;
              }
            });

          });

        } else {
          $scope.isLastInvoiceSubsciption = true;
          $scope.editCompany = {
            addresses: [{ isPrimary: true }],
            contacts: [getEmptyContact()],
            services: [],
            clientIndustry: {},
            defaultPaymentMethod: '',
            login: '',
            password: '',
            maxAgents: 0,
            removeOfflineTime: 30
          };
          $scope.contact = $scope.editCompany.contacts[0];

          TaxRatesService.getAllByCompany($scope.currentUser.company.id, $scope, function (resp) {
            $scope.techCompanyTax = angular.copy(resp);

            if ($scope.editCompany.taxRates) {
              return;
            }

            $scope.editCompany.taxRates = [];
            for (var i = 0; i < resp.length; i++) {
              $scope.editCompany.taxRates.push(resp[i]);
              $scope.selectedTax[resp[i].code] = true;
            }
          });
        }

        $scope.tryToSave = false;
        $scope.currentStep = 'info';
        $scope.PermissionsService = PermissionsService;
        $scope.domainPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.taxRateNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.selectedServices = {};
        $scope.selectedTax = {};
        $scope.techCompanyTax = [];

        $scope.clientTypes = ['Client', 'Lead'];
        $scope.serviceTypes = ['Fully Managed', 'Semi Managed', 'Hourly'];
        $scope.paymentMethods = ['Cash', 'Cheque', 'Debit Card', 'Credit Card', 'Wire Transfer'];
        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });

        $scope.servicesData = ServicesService.getServicesData($scope, false, function () {
          if (!$scope.editCompany.id) {
            $timeout(function () {
              if ($scope.servicesData && $scope.servicesData.default) {
                for (var i = 0; i < $scope.servicesData.default.length; i++) {
                  var service = angular.copy($scope.servicesData.default[i]);
                  $scope.editCompany.services.push(service);
                  $scope.selectedServices[$scope.servicesData.default[i].name] = true;
                }
              }
            });
          }
        });

        AddressesService.getLocales(true, function (response) {
          $scope.timeZones = response;
        });

        $scope.isShowingContactErrors = function (contact, form, fieldName) {
          return form[fieldName] && ((contact && contact.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.save = function (form) {

          if (form.$valid) {
            $scope.savingInProcess = true;

            var editCompany = angular.copy($scope.editCompany);
            var contacts = editCompany.contacts,
              addresses = editCompany.addresses;

            for (var i = 0; i < contacts.length; i++) {
              var contact = contacts[i];

              processPhoneNumbers(contact.phoneNumbers);

              if (contact.avatar && !contact.avatar.id && !contact.avatar.origin && !contact.avatar.cropped) {
                contact.avatar = undefined;
              }
            }

            for (var i = 0; i < addresses.length; i++) {
              processPhoneNumbers(addresses[i].phoneNumbers);
            }

            if (editCompany.defaultPaymentMethod) {
              editCompany.defaultPaymentMethod = editCompany.defaultPaymentMethod.toUpperCase().split(' ').join('_');
            } else {
              editCompany.defaultPaymentMethod = null;
            }

            CompaniesService.save(editCompany, function (resp) {
              $scope.savingInProcess = false;
              $scope.disablePreventingLocationChange = true;

              $rootScope.$broadcast('newCompanyHasBeenCreated', resp.id || resp);
              if (!$scope.savedState.items.length) {
                $scope.closeWindow();
              }
            })
          } else {
            $scope.triedToSave = true;

            for (var error in form.$error) {
              var subForm = form.$error[error][0];
              $scope.setCurrentStep(subForm.$name.replace('Form', ''));
            }
          }

          function processPhoneNumbers(phoneNumbers) {
            var firstPhone = phoneNumbers[0].number,
              lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

            if (!lastPhone || lastPhone.trim().length === 0 ||
              (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

              phoneNumbers.splice(phoneNumbers.length - 1, 1);

              if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                phoneNumbers[0].number = '';
              }
            } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
              phoneNumbers.shift();
            }
          }

        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editCompany && $scope.editCompany.id) || form[fieldName].$dirty || $scope.triedToSave) && form[fieldName].$invalid;
        };

        $scope.isShowingServiceErrors = function (form, fieldName) {
          return form[fieldName] && (form[fieldName].$dirty || $scope.triedToSave) && form[fieldName].$invalid;
        };

        $scope.validateCompanyName = function (ngModelCtrl) {

          if ($scope.currentUser.accountType === "ROOT") {
            ngModelCtrl.$setValidity('unique', true);
            return
          }

          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.validatePaymentTerms = function (form) {
          var valid = ($scope.editCompany.paymentTerms > 0 || $scope.editCompany.paymentTerms === undefined);
          form.vendorPaymentTerms.$setValidity('minValue', valid || !$scope.editCompany.isVendor);
        };

        $scope.validateCompanyDomain = function (ngModelCtrl) {
          var validationResult = CompaniesService.isDomainUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.validateContactEmail = function (ngModelCtrl, contactId) {

          var emailsCount = 0;

          for (var i = 0; i < $scope.editCompany.contacts.length; i++) {
            if ($scope.editCompany.contacts[i].primaryEmail === ngModelCtrl.$viewValue) {
              emailsCount++;
            }
          }

          if (emailsCount > 1) {
            ngModelCtrl.$setValidity('unique', false);
          } else {
            var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, contactId || '', false, function () {
              ngModelCtrl.$setValidity('unique', validationResult.value);
            });
          }
        };

        $scope.validateTaxRateCode = function (ngModelCtrl, modelId) {

          var taxRateCount = 0;

          for (var i = 0; i < $scope.editCompany.taxRates.length; i++) {
            if (($scope.editCompany.taxRates[i].code).toLowerCase() === (ngModelCtrl.$viewValue).toLowerCase()) {
              taxRateCount++;
            }
          }

          if (taxRateCount > 1) {
            ngModelCtrl.$setValidity('unique', false);
          } else {
            ngModelCtrl.$setValidity('unique', true);
          }
        };

        $scope.changePrimaryAddress = function (location) {
          angular.forEach($scope.editCompany.addresses, function (address) {
            address.isPrimary = false;
          });
          location.isPrimary = true;
        };

        $scope.validateNewTaxRate = function (form) {

          var code = $scope.newTaxRate.code,
            rate = $scope.newTaxRate.rate;

          form.validation = {
            code: {
              required: !code,
              maxlength: !!code && code.length > 30
            },
            rate: {
              required: !rate,
              number: !$.isNumeric(rate)
            }
          };

          var taxRateCount = 0;

          for (var i = 0; i < $scope.editCompany.taxRates.length; i++) {
            if (($scope.editCompany.taxRates[i].code).toLowerCase() === (form.code.$viewValue).toLowerCase()) {
              taxRateCount++;
            }
          }

          for (var i = 0; i < $scope.techCompanyTax.length; i++) {
            if (($scope.techCompanyTax[i].code).toLowerCase() === (form.code.$viewValue).toLowerCase()) {
              taxRateCount++;
            }
          }

          if (taxRateCount >= 1) {
            form.validation.code.unique = true;
          }

          form.validation.code.invalid = form.validation.code.required || form.validation.code.maxlength || form.validation.code.unique;
          form.validation.rate.invalid = form.validation.rate.required || form.validation.rate.number;

          form.invalid = form.validation.rate.invalid || form.validation.code.invalid;
        };

        //$scope.saveNewTax = function (form) {
        //
        //  $scope.validateNewTaxRate(form);
        //
        //  if (form.validation && !form.validation.code.invalid && !form.validation.rate.invalid) {
        //    $scope.editCompany.taxRates.push($scope.newTaxRate);
        //    $scope.newTaxRate = {};
        //    form.$setPristine();
        //    //$scope.newTaxRateFormShowErrors = false;
        //  }
        //  /*else {*/
        //  //$scope.newTaxRateFormShowErrors = true;
        //  //}
        //};

        $scope.removeAssociation = function (index) {
          var association = $scope.editCompany.companyAssociations[index];
          $scope.vendorsSelection[association.vendor.id] = false;
          $scope.editCompany.companyAssociations.splice(index, 1);
        };

        $scope.changeAssociation = function (vendor, isAdd) {
          if (isAdd) {
            $scope.editCompany.companyAssociations.push({
              vendor: vendor
            })
          } else {
            for (var i = 0; i < $scope.editCompany.companyAssociations.length; i++) {
              var association = $scope.editCompany.companyAssociations[i];
              if (association.vendor.id === vendor.id) {
                $scope.editCompany.companyAssociations.splice(i, 1);
              }
            }
          }
        };

        $scope.movingService = function (originService, form) {

          if (originService === 'new-service') {
            var newService = {
              new: true,
              name: '',
              rate: 0,
              billable: true
            };
            $scope.editCompany.services.push(newService);
            form.$setPristine();

          } else {
            var service = angular.copy(originService)

            if ($scope.selectedServices[service.name]) {
              $scope.editCompany.services.push(service);
            } else {
              $scope.deleteService(service.name);
            }
          }
        };

        $scope.deleteService = function (name) {

          if ($scope.selectedServices[name]) {
            $scope.selectedServices[name] = false;
          }

          for (var i = 0; i < $scope.editCompany.services.length; i++) {
            if (name === $scope.editCompany.services[i].name) {
              $scope.editCompany.services.splice(i, 1);
              return;
            }
          }

        };

        $scope.validateServiceName = function (ngModelCtrl) {
          var defaultDuplicates = 0,
            newServicesDuplicates = 0;

          if ($scope.servicesData && $scope.servicesData.default) {
            for (var i = 0; i < $scope.servicesData.default.length; i++) {
              if (ngModelCtrl.$viewValue.toLowerCase() === $scope.servicesData.default[i].name.toLowerCase()) {
                defaultDuplicates++;
              }
            }
          }

          if ($scope.editCompany.services) {
            for (var i = 0; i < $scope.editCompany.services.length; i++) {
              if (ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.toLowerCase() === $scope.editCompany.services[i].name.toLowerCase()) {
                newServicesDuplicates++;
              }
            }
          }

          ngModelCtrl.$setValidity('unique', newServicesDuplicates < 2 && defaultDuplicates < 1);
        };

        $scope.movingTax = function (originTax, form) {

          if (originTax === 'new-tax-rate') {
            var newTaxRate = {
              new: true,
              code: '',
              rate: 0
            };

            $scope.editCompany.taxRates.push(newTaxRate);
            form.$setPristine();

          } else {
            var tax = angular.copy(originTax);

            if ($scope.selectedTax[tax.code]) {
              $scope.editCompany.taxRates.push(tax);
            } else {
              $scope.deleteTaxRate(tax.code);
            }
          }
        };

        $scope.deleteTaxRate = function (taxCode) {
          for (var i = 0; i < $scope.editCompany.taxRates.length; i++) {
            if ($scope.editCompany.taxRates[i].code === taxCode ||
              (taxCode && $scope.editCompany.taxRates[i].code.toLowerCase() === taxCode.toLowerCase())) {

              $scope.editCompany.taxRates.splice(i, 1);
              $scope.selectedTax[taxCode] = false;
              return;
            }
          }
        };

        $scope.nextStep = function () {
          $scope.currentStep = steps[steps.indexOf($scope.currentStep) + 1];
        };

        $scope.setCurrentStep = function (step) {
          $scope.currentStep = step;
        };

        function getEmptyContact() {
          return {
            subscription: { invoice: true },
            avatar: {
              scale: 50
            }
          };
        }

        UserConfirmationsService.preventLocationChange($scope);
      }
    ]);

}());
