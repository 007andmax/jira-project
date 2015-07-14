'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.editCompanyCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', 'ContactsService', 'TaxRatesService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$state', '$http',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, ContactsService, TaxRatesService,
                SharedStateService, $stateParams, $state, $http) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');

        $scope.locationsMaxCount = 3;
        $scope.contactsMaxCount = 3;
        $scope.emailPattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.domainPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        $scope.taxRateNumberPattern = /^\+?[0-9]{0,19}$/;
        $scope.companies = CompaniesService.getClientCompanies();
        //todo receive it using services!!
        $http.get('/addresses/getAllLocales').success(function (resp) {
          $scope.timezones = resp;
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

          var companyData = CompaniesService.getCompanyData($stateParams.companyId, function () {

            if (!companyData.addresses || companyData.addresses.length === 0) {
              companyData.addresses = [{}];
            }

            if (!companyData.contacts || companyData.contacts.length === 0) {
              companyData.contacts = [getEmptyContact()];
            }
          });

          $scope.editCompany = companyData;

        } else {
          $scope.editCompany = {
            addresses: [{isPrimary: true}],
            contacts: [getEmptyContact()],
            taxRates: []
          };
        }

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('companiesHeader');
        });

        $scope.addLocation = function () {
          $scope.editCompany.addresses.unshift({});
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
            if ($scope.editCompany.contacts[i].email === ngModelCtrl.$viewValue) {
              emailsCount++;
            }
          }

          if (emailsCount > 1) {
            ngModelCtrl.$setValidity('unique', false);
          } else {
            var validationResult = ContactsService.isEmailUnique(ngModelCtrl.$viewValue, contactId || '', function () {
              ngModelCtrl.$setValidity('unique', validationResult.value);
            });
          }
        };

        $scope.validateTaxRateCode = function (ngModelCtrl, modelId) {

          var taxRateCount = 0;

          for (var i = 0; i < $scope.editCompany.taxRates.length; i++) {
            if ($scope.editCompany.taxRates[i].code === ngModelCtrl.$viewValue) {
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
            if ($scope.editCompany.taxRates[i].code === form.code.$viewValue) {
              taxRateCount++;
            }
          }

          if (taxRateCount >= 1) {
            form.validation.code.unique = true;
          }

          form.validation.code.invalid = form.validation.code.required || form.validation.code.maxlength || form.validation.code.unique;
          form.validation.rate.invalid = form.validation.rate.required || form.validation.rate.number;
        };

        $scope.saveNewTax = function (form) {

          $scope.validateNewTaxRate(form);

          if (form.validation && !form.validation.code.invalid && !form.validation.rate.invalid) {
            $scope.editCompany.taxRates.push($scope.newTaxRate);
            $scope.newTaxRate = {};
            $scope.newTaxRateFormShowErrors = false;
          } else {
            $scope.newTaxRateFormShowErrors = true;
          }
        };

        function getEmptyContact() {
          return {
            subscription: {},
            avatar: {
              scale: 50
            }
          };
        };

        //$scope.preventPaste = function(e){
        //  e.preventDefault();
        //  return false;
        //};

      }]);

}());
