'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showTicketDetails',
    ['$timeout', '$stateParams',
      function ($timeout, $stateParams) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var body = $('body'),
              ifScrollInit = false,
              ticketDetailsLoad = false,
              ticketNanoContent = element.find('[ticket-nano-content]');

            controlTicketList();

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('ticketDetailsLoad', function () {
              element.fadeIn(1500, function () {
                ticketDetailsLoad = true;
                initializeScroll();
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
                body.addClass("opened-ticket-list");
                element.addClass('has-scrollbar nano');
                ticketNanoContent.addClass('nano-content');
                initializeScroll();
                //ticketNanoContent.removeAttr("style");
              } else {
                body.removeClass('opened-ticket-list');
                destroyScroll();
                element.removeClass('has-scrollbar nano');
                ticketNanoContent.removeClass('nano-content');
                //ticketNanoContent.removeAttr("style");
              }
            }

            function destroyScroll() {

              if (!ifScrollInit) {
                return;
              }

              element.nanoScroller({destroy: true});
              ifScrollInit = false;
            }

            function initializeScroll() {

              if (ifScrollInit || !ticketDetailsLoad) {
                return;
              }

              $timeout(function () {
                element.nanoScroller({
                  alwaysVisible: false,
                  flash: true,
                  flashDelay: 1000,
                  sliderMinHeight: 98
                });

                ifScrollInit = true;
              }, 0)
            }

          }
        };
      }]);

})();

