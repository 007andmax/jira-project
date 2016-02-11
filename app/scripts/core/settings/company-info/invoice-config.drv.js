'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("invoiceConfig",
    ['BillableService', 'EmailSettingsService',
      function (BillableService, EmailSettingsService) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var invoiceParams = {},
              numberInput = element.find('[ic-number-input]'),
              termsInput = element.find('[ic-terms-input]'),
              conditionsInput = element.find('[ic-conditions-input]');

            scope.invoiceConfig = {
              count: '',
              term: '',
              termsAndConditions: ''
            };

            EmailSettingsService.getTermsAndConditions(function (invoiceInfo) {
              scope.invoiceConfig.term = invoiceInfo.term;
              invoiceParams.term = invoiceInfo.term;
              scope.invoiceConfig.termsAndConditions = invoiceInfo.conditions;
              invoiceParams.termsAndConditions = invoiceInfo.conditions;
            });

            BillableService.getActualInvoiceNumber(scope, function (number) {
                scope.invoiceConfig.count = number;
                invoiceParams.count = number;
              }
            );


            numberInput.on('focusout', function () {
              if (scope.invoiceForm.$valid && ifInputsChange()) {
                EmailSettingsService.saveNumberForm(scope.invoiceConfig, 'INVOICE', function(){

                  invoiceParams.term = scope.invoiceConfig.term;
                  invoiceParams.termsAndConditions = scope.invoiceConfig.termsAndConditions;
                  invoiceParams.count = scope.invoiceConfig.count;
                })
              }
            });

            termsInput.on('focusout', function () {
              if (scope.invoiceForm.$valid && ifInputsChange()) {
                EmailSettingsService.saveNumberForm(scope.invoiceConfig, 'INVOICE', function(){

                  invoiceParams.term = scope.invoiceConfig.term;
                  invoiceParams.termsAndConditions = scope.invoiceConfig.termsAndConditions;
                  invoiceParams.count = scope.invoiceConfig.count;
                })
              }
            });

            conditionsInput.on('focusout', function () {
              if (scope.invoiceForm.$valid && ifInputsChange()) {
                EmailSettingsService.saveNumberForm(scope.invoiceConfig, 'INVOICE', function(){

                  invoiceParams.term = scope.invoiceConfig.term;
                  invoiceParams.termsAndConditions = scope.invoiceConfig.termsAndConditions;
                  invoiceParams.count = scope.invoiceConfig.count;
                })
              }
            });

            function ifInputsChange() {
              var termChange = invoiceParams.term !== scope.invoiceConfig.term;
              var termsAndConditionsChange = invoiceParams.termsAndConditions !== scope.invoiceConfig.termsAndConditions;
              var countChange = invoiceParams.count !== scope.invoiceConfig.count;

              return termChange || termsAndConditionsChange || countChange;
            }

          }
        }
      }]);
})();
