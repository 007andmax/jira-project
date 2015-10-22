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

              if($stateParams.listType.toLowerCase() === 'preview'){
                $document.off('scroll');
                return;
              }

              getTicketsList(searchFilter);
            }, true);

            function getTicketsList(params) {

              var paramsToSend = {};

              if ($stateParams.listType === 'spam') {
                if (scope.currentUser.role === 'USER') {
                  paramsToSend.filter = 'USER_SPAM';
                } else {
                  paramsToSend.filter = 'ADMIN_MARKED_AS_SPAM';
                }
              } else {
                paramsToSend.filter = $stateParams.listType.toUpperCase();
              }

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

                scope.ticketsHeaderState.ticketsQuantity = TicketsService.getCount(paramsToSend, scope);

                UserNotificationService.hide();

                scope.onTicketRendering = function (last) {

                  if (last) {

                    var ticketConteiner = element.find('[tu-tickets-container]');
                    scope.markedSpamMesage = true;
                    $timeout(function () {

                      if (ticketConteiner.height() < $(window).height()) {

                        UserNotificationService.show('Loading...');
                        TicketsService.loadMore(scope, function (moreTicket) {

                          if ($stateParams.listType === 'spam' && scope.currentUser.role !== 'USER' && moreTicket.length === 0 && paramsToSend.filter === 'ADMIN_MARKED_AS_SPAM') {
                            getReportSpamTicket(paramsToSend);
                          }

                          UserNotificationService.hide();

                        })
                      }
                    }, 0);

                  }
                };

                initScrollListener(paramsToSend, scope);

              });
            }

            function initScrollListener(paramsToSend, $scope) {

              if (scrollListenerInitialize) {
                return;
              }

              scrollListenerInitialize = true;

              $document.on('scroll', function () {

                if ($document.scrollTop() >= ($document.height() - $(window).height() - 500)) {

                  UserNotificationService.show('Loading...');

                  TicketsService.loadMore($scope, function (moreTicket) {

                    UserNotificationService.hide();

                    if (moreTicket.length === 0) {

                      $document.off('scroll');

                      if (paramsToSend.filter !== 'ADMIN_REPORTED_AS_SPAM' && $stateParams.listType === 'spam' && $scope.currentUser.role !== 'USER') {
                        getReportSpamTicket(paramsToSend);
                      }
                    }

                  })
                }
              });

              $scope.$on('$destroy', function () {
                $document.off('scroll');
                SharedStateService.clearState('ticketsHeader');
              });

            }

            function getReportSpamTicket(paramsToSend) {

              var reportedAsSpamScope = scope.$new();

              scrollListenerInitialize = false;

              paramsToSend.filter = 'ADMIN_REPORTED_AS_SPAM';

              scope.reportSpamTickets = TicketsService.getList(reportedAsSpamScope, paramsToSend, function () {

                scope.reportedSpamMesage = true;
                scope.onReportedAsSpamTicketRendering = scope.onTicketRendering;
                initScrollListener(paramsToSend, reportedAsSpamScope)
              });
            }

          }
        };
      }]);

})();
