'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showTicketDetails',
    ['$timeout',
      function ($timeout) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var body = $('body');

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('ticketDetailsLoad', function () {
              element.fadeIn(1500, function () {
                element.css("position", "fixed");
              });
            });

            scope.$on('$destroy', function () {
              body.removeClass('opened-ticket');
            });

            scope.scrollToFirstUpdate = function (last) {
              if (last) {

                $timeout(function () {

                  var scrollPane = element.data('jsp'),
                    ticketUpdates = element.find('[std-update]');

                  for (var i = 0; i < ticketUpdates.length; i++) {
                    if (scope.firstUnreadUpdateId === ticketUpdates[i].getAttribute('std-update')) {
                      scrollPane.scrollToElement(ticketUpdates[i], true, true)
                    }
                  }

                }, 1500)
              }
            }
          }
        };
      }]);

})();

