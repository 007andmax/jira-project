'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showTicketDetails',
    ['$timeout', '$stateParams',
      function ($timeout, $stateParams) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var body = $('body'),
              ticketHeader = element.find('.ticket-header');

            controlTicketList();

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('ticketDetailsLoad', function () {
              element.fadeIn(1500, function () {
                controlTicketList();
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

            $(window).on('resize', controlTicketList);

            function controlTicketList() {

              if (!$stateParams.ticketId) {
                return;
              }

              var windowWidth = window.innerWidth;

              if (windowWidth > 1700) {

                body.addClass("opened-ticket-list opened-ticket");
                element.nanoScroller();
                element.find('.nano-content').css({'position': 'absolute'});
                //ticketHeader.addClass('ticket-fixed-header');
                //element.find(".ticket-detail > h2").css("margin-top", "92px");

              } else {

                body.removeClass("opened-ticket-list").addClass("opened-ticket");
                element.nanoScroller({destroy: true});
                element.find('.nano-content').css({'position': 'static'});
                //ticketHeader.removeClass('ticket-fixed-header');
                //element.find(".ticket-detail > h2").css("margin-top", "0");

              }

              element.nanoScroller({
                alwaysVisible: false,
                flash: true,
                flashDelay: 1000,
                sliderMinHeight: 98
              });

            }

          }
        };
      }]);

})();

