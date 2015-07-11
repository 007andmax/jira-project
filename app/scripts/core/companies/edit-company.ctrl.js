'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.editCompanyCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService', 'ContactsService', 'TaxRatesService',
      'quicktech.common.services.SharedStateService', '$stateParams', '$state', '$http',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, ContactsService, TaxRatesService,
                SharedStateService, $stateParams, $state, $http) {

        var headerSharedState = SharedStateService.getSharedState('companiesHeader');

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
          var companyData = CompaniesService.getCompanyData($stateParams.companyId);

          if (!company) {
            $state.go('companies');
            throw 'wrong cmpany id specified!';
          }

          $scope.editCompany = {
            id: $stateParams.companyId,
            name: company.name,
            type: company.type,
            domain: company.domain,
            primaryAddress: companyData.primaryAddress,
            addresses: companyData.addresses || [{}],
            contacts: companyData.contacts || [getEmptyContact()]
          };

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
          $scope.editCompany.addresses.splice(index, 1);
        };

        $scope.addContact = function () {
          $scope.editCompany.contacts.unshift(getEmptyContact());
        };

        $scope.removeContact = function (index) {
          $scope.editCompany.contacts.splice(index, 1);
        };

        $scope.isShowingErrors = function (contact, form, fieldName) {
          return form[fieldName] && ((contact && contact.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.save = function () {
          //todo fix phone numbers before save!!!!!!!!!!!!!
        };

        function getEmptyContact() {
          return {
            subscription: {}
          };
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editCompany && $scope.editCompany.id) || form[fieldName].$dirty) && !form[fieldName].$valid;
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

        $scope.validateCompanyEmail = function (ngModelCtrl) {
          var validationResult = ContactsService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

        $scope.validateTaxRateCode = function (ngModelCtrl) {
          //var validationResult = TaxRatesService.isUniqueInCompany(ngModelCtrl.$viewValue, $scope.editCompany.taxRates["0"].versionedId.id || '', $scope.editCompany.id || '', function () {
          //  ngModelCtrl.$setValidity('unique', validationResult.value || angular.forEach($scope.editCompany.taxRates, function (taxRates) {
          //      if (taxRates.code === ngModelCtrl.$viewValue) {
          //        return false;
          //      };
          //      return true;
          //    }));
          //});
        };

        $scope.changePrimaryAddress = function (location) {
          angular.forEach($scope.editCompany.addresses, function (address) {
            address.isPrimary = false;
          });
          location.isPrimary = true;
        };

        $scope.newTaxRate = {};

        $scope.saveNewTax = function () {
          if (!$scope.newTaxRate.code && !$scope.newTaxRate.rate) {
            $scope.showErrorType = true;
            $scope.showErrorRate = true;
            return;
          } else if (!$scope.newTaxRate.code) {
            $scope.showErrorType = true;
            return;
          } else if (!$scope.newTaxRate.rate) {
            $scope.showErrorRate = true;
            return;
          }
          ;
          $scope.editCompany.taxRates.push($scope.newTaxRate);
          $scope.newTaxRate = {"code": null, "rate": null};
          $scope.showErrorType = false;
          $scope.showErrorRate = false;
        };

      }]);

}());
