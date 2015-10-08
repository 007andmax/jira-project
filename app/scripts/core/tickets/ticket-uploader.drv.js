'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketUploader',
    ['$modal', 'FilesService', '$rootScope', 'TicketsService', '$stateParams', '$timeout', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.SharedStateService',
      function ($modal, FilesService, $rootScope, TicketsService, $stateParams, $timeout, UserNotificationService, SharedStateService) {

        return {
          restrict: 'A',
          link: function (scope, element) {

            var $document = $(document),
              scrollListenerInitialize;

            scope.ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');

            scope.$watch('ticketsHeaderState.searchFilter', function (searchFilter) {
              getTicketsList(searchFilter);
            }, true);

            function getTicketsList(params) {

              var paramsToSend = {
                filter: $stateParams.listType.toUpperCase()
              };

              if (params.priority) {
                paramsToSend.priority = params.priority;
              }

              if (params.status) {
                paramsToSend.status = params.status;
              }

              if (params.userId) {
                paramsToSend.userId = params.userId;
              }

              if (params.companyId) {
                paramsToSend.companyId = params.companyId;
              }

              UserNotificationService.show('Loading...');

              scope.tickets = TicketsService.getList(scope, paramsToSend, function () {

                scope.countHeaderTickets = TicketsService.getCount(paramsToSend, scope, function () {
                  scope.ticketsHeaderState.count = scope.countHeaderTickets.count;
                });

                UserNotificationService.hide();
                scope.onTicketRendering = function (last) {

                  if (last) {

                    var ticketConteiner = element.find('[tu-tickets-container]');

                    $timeout(function () {

                      if (ticketConteiner.height() < $(window).height()) {

                        UserNotificationService.show('Loading...');
                        TicketsService.loadMore(scope, function (moreTicket) {

                          UserNotificationService.hide();

                          if (moreTicket.length === 0) {
                            $document.off('scroll');
                          }
                        })
                      }
                    }, 0);

                  }
                };

                initScrollListener()

              });
            }

            function initScrollListener() {

              if (scrollListenerInitialize) {
                return;
              }

              scrollListenerInitialize = true;

              $document.on('scroll', function () {

                if ($document.scrollTop() > ($document.height() - 750)) {

                  UserNotificationService.show('Loading...');
                  TicketsService.loadMore(scope, function (moreTicket) {
                    UserNotificationService.hide();

                    if (moreTicket.length === 0) {
                      $document.off('scroll');
                    }
                  })
                }
              });

              scope.$on('$destroy', function () {
                $document.off('scroll');
                SharedStateService.clearState('billableClientsHeader');
              });

            }
          }
        };
      }]);

})();
