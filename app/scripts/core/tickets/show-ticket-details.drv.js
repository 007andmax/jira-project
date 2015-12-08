'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showTicketDetails',
    ['$timeout', '$stateParams',
      function ($timeout, $stateParams) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var body = $('body');

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('ticketDetailsLoad', function () {
              element.fadeIn(1500, function () {
                element.nanoScroller({
                  alwaysVisible: false,
                  flash: true,
                  flashDelay: 1000,
                  sliderMinHeight: 98
                });
              });
            });

            scope.$on('$destroy', function () {
              body.removeClass('opened-ticket');
              body.addClass('opened-ticket-list');
            });

            scope.scrollToFirstUpdate = function (last) {
              if (last) {

                $timeout(function () {

                  var windowHeight = $(window).height(),
                    ticketUpdates = element.find('[std-update]');

                  for (var i = 0; i < ticketUpdates.length; i++) {
                    if (scope.firstUnreadUpdateId === ticketUpdates[i].getAttribute('std-update')) {
                      element.nanoScroller({scrollTo: $(ticketUpdates[i]), scrollTop: windowHeight});
                      return;
                    }
                  }

                }, 2000)
              }
            };

            controlTicketList();
            $(window).on('resize', controlTicketList);

            function controlTicketList() {

              if (!$stateParams.ticketId) {
                return;
              }

              var windowWidth = $(window).width();

              if (windowWidth > 1700) {
                body.addClass("opened-ticket-list");
                element.addClass('has-scrollbar nano');
              } else {
                body.removeClass('opened-ticket-list');
                element.removeClass('has-scrollbar nano');
              }
            }

          }
        };
      }]);

})();

