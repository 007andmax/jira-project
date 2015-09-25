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
            //loader = $('#loading');

            scope.ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');

            scope.$watch('ticketsHeaderState', function (params) {
              getTicketsList(params.searchFilter);
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

              scope.tickets = TicketsService.getList(scope, paramsToSend, function () {

                scope.onTicketRendering = function (last) {

                  if (last) {

                    var ticketConteiner = element.find('[tu-tickets-container]');

                    $timeout(function () {

                      if (ticketConteiner.height() < $(window).height()) {

                        //UserNotificationService.show('Loading ...');
                        //loader.show();

                        TicketsService.loadMore(scope, function (moreTicket) {

                          //UserNotificationService.hide();
                          //loader.hide();

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
            };

            function initScrollListener(){

              if(scrollListenerInitialize){
                return;
              }

              scrollListenerInitialize = true;

              $document.on('scroll', function () {

                if ($document.scrollTop() > ($document.height() - 750)) {

                  //UserNotificationService.show('Loading ...');
                  //loader.show();

                  TicketsService.loadMore(scope, function (moreTicket) {

                    //UserNotificationService.hide();
                    //loader.hide();

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
