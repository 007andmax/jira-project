'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showTicketDetails',
    ['$timeout', '$stateParams', 'localStorageService', 'quicktech.common.services.SharedStateService',
      function ($timeout, $stateParams, localStorageService, SharedStateService) {
        return {
          restrict: 'A',
          link: function (scope, element) {
            var t0 = performance.now();

            var body = $('body');
            var ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');

            controlTicketList(null, true);

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('ticketDetailsLoad', function () {
              controlTicketList(null, true);
              element.show();
            });

            scope.$on('toggleTicketsList', function () {
              if (scope.ticketListOpened) {
                body.removeClass("opened-ticket-list").addClass("opened-ticket");
              } else {
                body.addClass("opened-ticket-list opened-ticket");
                element.nanoScroller();
              }
              scope.ticketListOpened = !scope.ticketListOpened;
              localStorageService.set('ticket-list-view', scope.ticketListOpened ? 'opened' : 'closed')
            });

            scope.$on('$destroy', function () {
              body.removeClass('opened-ticket');
              body.addClass('opened-ticket-list');
              $(window).off('resize', controlTicketList);
            });

            scope.scrollToFirstUpdate = function (last) {
              if (last) {

                $timeout(function () {

                  var ticketUpdates = element.find('[std-update]');

                  for (var i = 0; i < ticketUpdates.length; i++) {
                    if (scope.firstUnreadUpdateId === ticketUpdates[i].getAttribute('std-update')) {

                      if (scope.ticketListOpened) {
                        element.nanoScroller({scrollTo: $(ticketUpdates[i])});
                      } else {
                        $('html, body').animate({
                          scrollTop: ($(ticketUpdates[i]).offset().top - 270) + 'px'
                        }, 'fast');
                      }

                      return;
                    }
                  }

                }, 0)
              }
            };

            $(window).on('resize', controlTicketList);

            function controlTicketList(e, isCheckView) {
              if (!$stateParams.ticketId && !ticketsSharedState.openTicketId) {
                return;
              }

              var windowWidth = window.innerWidth;

              if (windowWidth > 1315 && (!isCheckView || localStorageService.get('ticket-list-view') === 'opened')) {
                scope.ticketListOpened = true;

                body.addClass("opened-ticket-list opened-ticket");
                element.nanoScroller();
                element.find('.nano-content').css({'position': 'absolute'});
                //ticketHeader.addClass('ticket-fixed-header');
                //element.find(".ticket-detail > h2").css("margin-top", "92px");

              } else {
                scope.ticketListOpened = false;

                body.removeClass("opened-ticket-list").addClass("opened-ticket");
                // element.nanoScroller({destroy: true});
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

