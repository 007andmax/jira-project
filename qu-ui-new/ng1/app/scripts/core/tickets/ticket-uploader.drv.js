'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketUploader',
    ['$uibModal', 'TicketsService', '$stateParams', '$timeout', '$document', 'localStorageService',
      'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService', '$rootScope', '$state',
      function ($uibModal, TicketsService, $stateParams, $timeout, $document, localStorageService, UserNotificationService,
                SharedStateService, $rootScope, $state) {

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

            scope.$watch(function(){
              return $stateParams.tabName
            }, function(tabName) {
              if(tabName) {
                getTicketsList(ticketsHeaderState.searchFilter)
              }
            })


            // scope.$watch(function() {
            //   return ticketsHeaderState.filter.clientUserId;
            // }, getTicketsList , true);
            // var filterObj = {
            //   userId: ticketsHeaderState.searchFilter.userId,
            //   companyId: ticketsHeaderState.searchFilter.companyId
            // }

            scope.onFinishRendering = function () {
              scope.loadingOrRendering = false;
            };

            scope.$watch('runTicketListUploader', function(runTicketListUploader) {
              if(runTicketListUploader) {
                console.log(runTicketListUploader);
                getTicketsList(ticketsHeaderState.searchFilter);
                $rootScope.runTicketListUploader = false;
              }
            });

            function getTicketsList(filter) {
              if (!filter) {
                return;
              }

              if($state.includes('tickets')) {
                filter = {
                  companyId: undefined,
                  userId: undefined
                }
              }
              UserNotificationService.show('Loading... ');
              scope.loadingOrRendering = true;
              lastListType = $stateParams.listType.toUpperCase();
              TicketsService.getList(lastListType, filter.userId, filter.companyId, function (uploadedTickets) {
                scope.tickets = uploadedTickets;

                if (!uploadedTickets.length) {
                  scope.onFinishRendering();
                }

                var ticketFilter = ticketsHeaderState.filter;
                var isAnyFilters = false;
                for(var prop in ticketFilter) {
                  if (ticketFilter[prop] && ticketFilter[prop].length > 0) {
                    isAnyFilters = true;
                    break;
                  }
                }
                if(!isAnyFilters) {
                  TicketsService.getCount(function (quantity) {
                    scope.globalSearch.count = quantity;
                  });
                }


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
