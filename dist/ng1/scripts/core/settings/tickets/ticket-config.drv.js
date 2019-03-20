'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("ticketConfig",
    ['TicketsService', 'EmailSettingsService',
      function (TicketsService, EmailSettingsService) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var ticketParams = {},
              numberInput = element.find('[tc-number-input]'),
              prefixInput = element.find('[tc-prefix-input]');

            TicketsService.getActualNumber(scope, function (number) {
                scope.actualTicketNumber = number;

                if (scope.actualTicketNumber.split('-').length === 1) {
                  scope.ticketConfig = {
                    count: scope.actualTicketNumber.split('-')[0],
                    prefix: ''
                  };
                } else {
                  scope.ticketConfig = {
                    count: scope.actualTicketNumber.split('-')[1],
                    prefix: scope.actualTicketNumber.split('-')[0]
                  };
                }

                ticketParams.count = scope.ticketConfig.count;
                ticketParams.prefix = scope.ticketConfig.prefix;
              }
            );

            numberInput.on('focusout', saveTicketNumber);

            prefixInput.on('focusout', function () {
              if (scope.invoiceAndTicketForm.$valid && ifInputsChange()) {
                EmailSettingsService.saveNumberForm(scope.ticketConfig, 'TICKET')
              }
            });

            scope.saveTicketNumber = function (source) {
              source.count = source.nextValid;
              saveTicketNumber();
            };

            function ifInputsChange() {
              var countChange = ticketParams.count !== scope.ticketConfig.count;
              var prefixChanhe = ticketParams.prefix !== scope.ticketConfig.prefix;

              return countChange || prefixChanhe;
            }

            function saveTicketNumber() {
              if (ifInputsChange()) {
                scope.invoiceAndTicketForm.ticketCount.$setValidity('used', true);
                if (scope.invoiceAndTicketForm.$valid) {
                  EmailSettingsService.saveNumberForm(scope.ticketConfig, 'TICKET', function (resp) {
                    scope.invoiceAndTicketForm.ticketCount.$setValidity('used', resp.code !== 409);
                    if (resp.code === 409) {
                      scope.ticketConfig.nextValid = resp.message;
                      ticketParams.count = scope.ticketConfig.count
                    }
                  });
                }
              }
            }
          }
        }
      }]);
})();
