'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("invoiceConfig",
    ['BillableService', 'EmailSettingsService', '$templateRequest', 'CompaniesService',
      function (BillableService, EmailSettingsService, $templateRequest, CompaniesService) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            scope.taxIdPattern = /^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/;
            scope.taxIdDescriptionPattern = /^[0-9A-Za-z!@.)(/,|\\;:-='"?&\-\s ]{1,15}$/;

            var invoiceParams = {},
              numberInput = element.find('[ic-number-input]'),
              termsInput = element.find('[ic-terms-input]'),
              conditionsInput = element.find('[ic-conditions-input]');

            scope.invoiceConfig = {
              count: '',
              term: '',
              termsAndConditions: ''
            };
            scope.taxIdData = {
              taxIdDescription: '',
              taxId: ''
            };
            EmailSettingsService.getTaxNumber(function(resp) {
              scope.taxIdData = resp;
            });

            scope.changeTaxIdData = function() {
              EmailSettingsService.updateTaxNumber(scope.taxIdData, function(resp) {
                console.log(resp);
              })
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

            numberInput.on('focusout', saveInvoiceConfig);
            termsInput.on('focusout', saveInvoiceConfig);
            conditionsInput.on('focusout', saveInvoiceConfig);

            scope.saveInvoiceNumber = function (source) {
              source.count = source.nextValid;
              saveInvoiceConfig();
            };

            function ifInputsChange() {
              var termChange = invoiceParams.term !== scope.invoiceConfig.term;
              var termsAndConditionsChange = invoiceParams.termsAndConditions !== scope.invoiceConfig.termsAndConditions;
              var countChange = invoiceParams.count !== scope.invoiceConfig.count;

              return termChange || termsAndConditionsChange || countChange;
            }

            function saveInvoiceConfig() {
              if (ifInputsChange()) {
                scope.invoiceAndTicketForm.invoiceCount.$setValidity('used', true);
                if (scope.invoiceAndTicketForm.$valid) {
                  EmailSettingsService.saveNumberForm(scope.invoiceConfig, 'INVOICE', function (resp) {

                    scope.invoiceAndTicketForm.invoiceCount.$setValidity('used', resp.code !== 409);

                    if (resp.code === 409) {
                      scope.invoiceConfig.nextValid = resp.message;
                      invoiceParams.count = scope.invoiceConfig.count;
                    } else {
                      invoiceParams.term = scope.invoiceConfig.term;
                      invoiceParams.termsAndConditions = scope.invoiceConfig.termsAndConditions;
                      invoiceParams.count = scope.invoiceConfig.count;
                    }
                  })
                }
              }
            }

          }
        }
      }]);
})();
