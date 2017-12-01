'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketUploader',
    ['$uibModal', 'TicketsService', '$stateParams', '$timeout', '$document', 'localStorageService',
      'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
      function ($uibModal, TicketsService, $stateParams, $timeout, $document, localStorageService, UserNotificationService,
                SharedStateService) {

        return {
          restrict: 'A',
          link: function (scope, element) {

            var $win = $(window),
              lastListType,
              ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');

            scope.loadingOrRendering = false;
            scope.globalSearch = SharedStateService.getSharedState('globalSearch');

            if (!localStorageService.get('ticket-list-view')) {
              localStorageService.set('ticket-list-view', 'opened');
            }

            scope.$watch(function () {
              if (ticketsHeaderState.searchFilter) {
                return {
                  userId: ticketsHeaderState.searchFilter.userId,
                  companyId: ticketsHeaderState.searchFilter.companyId
                };
              }
            }, getTicketsList, true);

            scope.onFinishRendering = function () {
              scope.loadingOrRendering = false;
            };

            function getTicketsList(filter) {
              if (!filter) {
                return;
              }

              UserNotificationService.show('Loading...');

              scope.loadingOrRendering = true;
              lastListType = $stateParams.listType.toUpperCase();
              TicketsService.getList(lastListType, filter.userId, filter.companyId, function (uploadedTickets) {
                scope.tickets = uploadedTickets;

                if (!uploadedTickets.length) {
                  scope.onFinishRendering();
                }

                TicketsService.getCount(function (quantity) {
                  scope.globalSearch.count = quantity;
                });
                // var ticketFilter = ticketsHeaderState.filter;
                // var result;
                // var isAnyFilters = false;
                // for(var prop in ticketFilter) {
                //   if (ticketFilter.hasOwnProperty(prop)) {
                //     isAnyFilters = true;
                //     break;
                //   }
                // }
                // if(isAnyFilters) {
                //   if (ticketFilter.companyId) {
                //     result = scope.tickets.filter((ticket) => ticket.company.id === ticketFilter.companyId)
                //   }
                //
                //   if (ticketFilter.clientUserId) {
                //     result = scope.tickets.filter((ticket) => ticket.createdUserId === ticketFilter.clientUserId)
                //   }
                //
                //   if (ticketFilter.techUserId) {
                //     result = scope.tickets.filter((ticket) => ticket.createdUserId === ticketFilter.techUserId)
                //   }
                //
                //   if(ticketFilter.completed) {
                //     result = scope.tickets.filter((ticket) => ticket.status === 'COMPLETED')
                //   }
                //   if(ticketFilter.inProgress) {
                //     result = scope.tickets.filter((ticket) => ticket.status === 'IN_PROGRESS')
                //   }
                //   if(ticketFilter.onHold) {
                //     result = scope.tickets.filter((ticket) => ticket.status === 'ON_HOLD')
                //   }
                //   if(ticketFilter.onHoldTag) {
                //     result = scope.tickets.filter((ticket) => ticket.status === 'ON_HOLD')
                //   }
                //   scope.globalSearch.count = result.length;
                // }

                UserNotificationService.hide();
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
                if (!scope.loadingOrRendering) {
                  var scrollTop = $(e.target).scrollTop(),
                    isNeedToLoadMoreTickets = ($('[tu-tickets-container]').height() - $win.innerHeight()) <= scrollTop + 200;

                  if (isNeedToLoadMoreTickets && (!scope.tickets || scope.tickets.length < scope.globalSearch.count)) {
                    scope.loadingOrRendering = true;
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
              } else if (windowWidth > 1315 && localStorageService.get('ticket-list-view') === 'opened') {
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
