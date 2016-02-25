'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("invoiceConfig",
    ['BillableService', 'EmailSettingsService', '$templateRequest', 'CompaniesService',
      function (BillableService, EmailSettingsService, $templateRequest, CompaniesService) {
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

            scope.previewInvoice = function(){
              $templateRequest('/html/scripts/core/settings/company-info/preview-invoice.tpl.html').then(function (html) {

                var body =  $("body");

                body.append(html);
                body.css('overflow-y', 'hidden');

                var invoiceElem = $('.preview-invoice');

                invoiceElem.find('#logo > img').attr("src", scope.getCompanyLogoUrl(CompaniesService.getCurrentCompany()));
                invoiceElem.find('.invoice-info .total').text(scope.invoiceConfig.count);
                invoiceElem.find('.email .name').text(scope.getUserName(scope.currentUser));
                invoiceElem.find('.email .em').append(scope.currentUser.primaryEmail);
                invoiceElem.find('.terms > span').text(scope.invoiceConfig.termsAndConditions);

                invoiceElem.fadeIn();

                invoiceElem.find('.close-icon').click(function(){
                  body.css('overflow-y', 'visible');
                  window.scroll(0, element.offset().top - 200);
                  invoiceElem.fadeOut();
                })
              });
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
