'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketReviewSize',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          scope.ticketActionRendering = function () {

            $timeout(function () {
              var quantityTicketAction = element.find('.ticket-actions').children().length;

              switch (quantityTicketAction) {
                case 1:
                  element.addClass('one-action');
                  return;
                case 2:
                  element.addClass('two-actions');
                  return;
                case 3:
                  element.addClass('three-actions');
                  return;
                case 4:
                  element.addClass('four-actions');
                  return;
                case 5:
                  element.addClass('five-actions');
                  return;
              }

            }, 0);

          };

        }
      };
    }]);

})();
