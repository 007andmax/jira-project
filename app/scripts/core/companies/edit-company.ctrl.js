'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.editCompanyCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', 'ContactsService', 'TaxRatesService', 'AddressesService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$state', 'VendorsService', '$timeout',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, ContactsService, TaxRatesService, AddressesService,
                SharedStateService, $stateParams, $state, VendorsService, $timeout) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');
        var currentTimeZone;

        $scope.locationsMaxCount = 3;
        $scope.contactsMaxCount = 3;
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.domainPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.taxRateNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.vendorsSelection = {};
        $scope.companies = CompaniesService.getClientCompanies();
        $scope.vendors = VendorsService.getAllForAutocomplete($scope);
        $scope.timezones = AddressesService.getAllLocales(function () {

          var localZone = -(new Date().getTimezoneOffset() / 60),
            timeZone;

          for (var i = 0; i < $scope.timezones.length; i++) {

            var timeZoneDescription = $scope.timezones[i].description.match(/\d+/);

            if (timeZoneDescription === null) {
              timeZone = 0
            } else {
              timeZone = timeZoneDescription[0];
            }
            if (localZone === +timeZone) {
              currentTimeZone = $scope.timezones[i];
              if (!$stateParams.companyId) {
                setCurrentTimeZone(currentTimeZone);
              }
              return;
            }
          }
        });

        $scope.$watch('companies.length', function (companiesCount) {
          headerSharedState.count = companiesCount;
        });

        if ($stateParams.companyId) {

          var company = CompaniesService.getOneById($stateParams.companyId);

          if (!company) {
            $state.go('companies');
            throw 'wrong cmpany id specified!';
          }

          var companyData = CompaniesService.getCompanyData($scope, $stateParams.companyId, function () {

            if (!companyData.addresses || companyData.addresses.length === 0) {
              companyData.addresses = [{}];
            }

            if (!companyData.contacts || companyData.contacts.length === 0) {
              companyData.contacts = [getEmptyContact()];
            }

            for (var i = 0; i < companyData.companyAssociations.length; i++) {
              var association = companyData.companyAssociations[i];
              $scope.vendorsSelection[association.vendor.id] = true;
            }

            $scope.editCompany = companyData.staticCopy();

          });

        } else {
          $scope.editCompany = {
            addresses: [{isPrimary: true}],
            contacts: [getEmptyContact()],
            taxRates: [],
            companyAssociations: []
          };

          TaxRatesService.getAllByCompany($scope.currentUser.company.id, $scope, function (resp) {
            for (var i = 0; i < resp.length; i++) {
              $scope.editCompany.taxRates.push({code: resp[i].code, rate: resp[i].rate})
            }
          });

        }

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('companiesHeader');
        });

        $scope.addLocation = function () {
          $scope.editCompany.addresses.unshift({});
          setCurrentTimeZone(currentTimeZone);
        };

        $scope.removeLocation = function (index) {
          if ($scope.editCompany.addresses[index].isPrimary) {
            $scope.editCompany.addresses[$scope.editCompany.addresses.length - 1].isPrimary = true;
          }
          $scope.editCompany.addresses.splice(index, 1);
        };

        $scope.addContact = function () {
          $scope.editCompany.contacts.unshift(getEmptyContact());
        };

        $scope.removeContact = function (index) {
          $scope.editCompany.contacts.splice(index, 1);
        };

        $scope.isShowingContactErrors = function (contact, form, fieldName) {
          return form[fieldName] && ((contact && contact.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.save = function (form) {

          if (form.$valid) {
            $scope.savingInProcess = true;

            var contacts = $scope.editCompany.contacts,
              addresses = $scope.editCompany.addresses;

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

            CompaniesService.save($scope.editCompany, function () {
              $scope.savingInProcess = false;
              $state.go('companies');
            })
          } else {
            $scope.triedToSave = true;
            $scope.$broadcast('scrollToErrorFild')
          }

          function processPhoneNumbers(phoneNumbers) {
            var lastPhone = phoneNumbers[phoneNumbers.length - 1];

            if (!lastPhone.number || lastPhone.number.trim().length === 0) {
              phoneNumbers.splice(phoneNumbers.length - 1, 1);
            }
          }

        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editCompany && $scope.editCompany.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
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
            var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, contactId || '', function () {
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

        $scope.newTaxRate = {};

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

          if (taxRateCount >= 1) {
            form.validation.code.unique = true;
          }

          form.validation.code.invalid = form.validation.code.required || form.validation.code.maxlength || form.validation.code.unique;
          form.validation.rate.invalid = form.validation.rate.required || form.validation.rate.number;

          form.invalid = form.validation.rate.invalid || form.validation.code.invalid;
        };

        $scope.saveNewTax = function (form) {

          $scope.validateNewTaxRate(form);

          if (form.validation && !form.validation.code.invalid && !form.validation.rate.invalid) {
            $scope.editCompany.taxRates.push($scope.newTaxRate);
            $scope.newTaxRate = {};
            //$scope.newTaxRateFormShowErrors = false;
          }
          /*else {*/
          //$scope.newTaxRateFormShowErrors = true;
          //}
        };

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

        $scope.changeInvoiceSubscription = function () {

          if ($scope.currentUser.accountType !== "TECH") {
            return;
          }

          $timeout(function () {

            var countInvoiceSubscr = 0;

            for (var i = 0; i < $scope.editCompany.contacts.length; i++) {
              if ($scope.editCompany.contacts[i].subscription.invoice) {
                countInvoiceSubscr++
              }
            }

            $scope.showSubscribeError = countInvoiceSubscr < 1;

          })
        };

        $scope.$watch('editCompany.contacts.length', $scope.changeInvoiceSubscription);

        function getEmptyContact() {
          return {
            subscription: {invoice: true},
            avatar: {
              scale: 50
            }
          };
        }

        function setCurrentTimeZone(timeZoneObject) {
          $scope.editCompany.addresses[0].locale = timeZoneObject;
        }

      }]);

}());
