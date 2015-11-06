'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("ticketConfig",
    ['TicketsService', 'EmailSettingsService',
      function (TicketsService, EmailSettingsService) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs, ctrl) {

            var numberInput = element.find('[tc-number-input]'),
              prefixInput = element.find('[tc-prefix-input]');

            TicketsService.getActualNumber(scope, function (number) {
                scope.actualTicketNumber = number;

                scope.ticketConfig = {
                  count: scope.actualTicketNumber.split('-')[1],
                  prefix: scope.actualTicketNumber.split('-')[0]
                };
              }
            );

            numberInput.on('focusout', function () {
              if (scope.ticketForm.$valid) {
                EmailSettingsService.saveNewNumberCounter(scope.ticketConfig, 'TICKET')
              }
            });

            prefixInput.on('focusout', function () {
              if (scope.ticketForm.$valid) {
                EmailSettingsService.saveNewNumberCounter(scope.ticketConfig, 'TICKET')
              }
            })

          }
        }
      }]);
})();
