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

                if(scope.actualTicketNumber.split('-').length === 1){
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

            numberInput.on('focusout', function () {
              if (scope.ticketForm.$valid && ifInputsChange()) {
                EmailSettingsService.saveNumberForm(scope.ticketConfig, 'TICKET')
              }
            });

            prefixInput.on('focusout', function () {
              if (scope.ticketForm.$valid && ifInputsChange()) {
                EmailSettingsService.saveNumberForm(scope.ticketConfig, 'TICKET')
              }
            });

            function ifInputsChange(){
              var countChange = ticketParams.count !== scope.ticketConfig.count;
              var prefixChanhe = ticketParams.prefix !== scope.ticketConfig.prefix;

              return countChange || prefixChanhe;
            }

          }
        }
      }]);
})();
