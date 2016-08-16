'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketUploader',
    ['$modal', 'TicketsService', '$stateParams', '$timeout', '$document',
      'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
      function ($modal, TicketsService, $stateParams, $timeout, $document, UserNotificationService, SharedStateService) {

        return {
          restrict: 'A',
          link: function (scope, element) {

            var $win = $(window),
              lastListType,
              loadingOrRendering = false;

            scope.globalSearch = SharedStateService.getSharedState('globalSearch');

            getTicketsList();

            scope.onFinishRendering = function () {
              loadingOrRendering = false;
            };

            function getTicketsList() {
              UserNotificationService.show('Loading...');

              loadingOrRendering = true;
              lastListType = $stateParams.listType.toUpperCase();
              TicketsService.getList(lastListType, function (uploadedTickets, listType) {

                if (listType === lastListType) {
                  scope.tickets = uploadedTickets;

                  TicketsService.getCount(function (quantity) {
                    scope.globalSearch.count = quantity;
                  });

                  UserNotificationService.hide();
                }

                initScrollListener();
                openTicketList();
              });
            }

            function initScrollListener() {
              $document.on('scroll', scrollHandler);

              scope.$on('$destroy', function () {
                $document.off('scroll', scrollHandler);
              });

              function scrollHandler(e) {
                if (!loadingOrRendering) {
                  var scrollTop = $(e.target).scrollTop(),
                    isNeedToLoadMoreTickets = ($('[tu-tickets-container]').height() - $win.innerHeight()) <= scrollTop + 200;

                  if (isNeedToLoadMoreTickets && (!scope.tickets || scope.tickets.length < scope.globalSearch.count)) {
                    loadingOrRendering = true;
                    TicketsService.loadMore(lastListType);
                  }
                }
              }
            }

            function openTicketList() {
              var windowWidth = $(window).width(),
                body = $('body');

              if (!$stateParams.ticketId) {
                body.addClass("opened-ticket-list");
              } else if (windowWidth > 1700) {
                body.addClass("opened-ticket-list");
                element.addClass('has-scrollbar nano');
              }
            }

          }
        };
      }])
  ;

})
();
