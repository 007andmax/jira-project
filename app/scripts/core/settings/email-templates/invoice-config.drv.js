'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("invoiceConfig",
    ['BillableService', 'EmailSettingsService',
      function (BillableService, EmailSettingsService) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs, ctrl) {

            var numberInput = element.find('[ic-number-input]'),
              termsInput = element.find('[ic-terms-input]'),
              conditionsInput = element.find('[ic-conditions-input]');

            scope.invoiceConfig = {
              count: '',
              term: '',
              termsAndConditions: ''
            };

            EmailSettingsService.getTermsAndConditions(function (invoiceInfo) {
              scope.invoiceConfig.term = invoiceInfo.term;
              scope.invoiceConfig.termsAndConditions = invoiceInfo.conditions;
            });

            BillableService.getActualInvoiceNumber(scope, function (number) {
                scope.invoiceConfig.count = number;
              }
            );


            numberInput.on('focusout', function () {
              if (scope.invoiceForm.$valid) {
                EmailSettingsService.saveNewNumberCounter(scope.invoiceConfig, 'INVOICE')
              }
            });

            termsInput.on('focusout', function () {
              if (scope.invoiceForm.$valid) {
                EmailSettingsService.saveNewNumberCounter(scope.invoiceConfig, 'INVOICE')
              }
            });

            conditionsInput.on('focusout', function () {
              if (scope.invoiceForm.$valid) {
                EmailSettingsService.saveNewNumberCounter(scope.invoiceConfig, 'INVOICE')
              }
            })

          }
        }
      }]);
})();
