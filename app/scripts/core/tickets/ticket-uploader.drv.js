'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketUploader',
    ['$modal', 'FilesService', '$rootScope', 'TicketsService', '$stateParams', '$timeout',
      'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
      function ($modal, FilesService, $rootScope, TicketsService, $stateParams, $timeout, UserNotificationService, SharedStateService) {

        return {
          restrict: 'A',
          link: function (scope, element) {

            var $document = $(document),
              scrollListenerInitialize,
              isTicketsAlreadyLoad = false,
              saveParams;

            scope.ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader');
            scope.globalSearch = SharedStateService.getSharedState('globalSearch');

            scope.$watch('ticketsHeaderState.searchFilter', function (searchFilter) {

              if ($stateParams.listType.toLowerCase() === 'preview') {
                $document.off('scroll');
                return;
              }

              getTicketsList(searchFilter);
            }, true);

            function getTicketsList(params) {

              var paramsToSend = {};

              if ($stateParams.listType === 'spam') {
                if (scope.currentUser.isOwner) {
                  paramsToSend.filter = 'ADMIN_MARKED_AS_SPAM';
                } else {
                  paramsToSend.filter = 'USER_SPAM';
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

              saveParams = paramsToSend;
              scope.ticketsHeaderState.ticketsQuantity = 0;
              scope.tickets = TicketsService.getList(scope, paramsToSend, function (uploadedTickets, params) {

                if (params === saveParams) {
                  scope.globalSearch.counts = {};
                  scope.ticketsHeaderState.aditionalTicketsQuantity = 0;
                  scope.globalSearch.counts['quantity'] = TicketsService.getCount(paramsToSend, scope, function () {

                    if (paramsToSend.filter === 'ADMIN_MARKED_AS_SPAM') {

                      var filterReported = {
                        filter: 'ADMIN_REPORTED_AS_SPAM'
                      };

                      scope.globalSearch.counts['additionalQuantity'] = TicketsService.getCount(filterReported, scope.$new());
                    }

                  });
                }

                UserNotificationService.hide();

                scope.onTicketRendering = function (last) {

                  if (last) {

                    var ticketConteiner = element.find('[tu-tickets-container]');
                    scope.markedSpamMesage = true;
                    $timeout(function () {

                      if ((ticketConteiner.height() < $(window).height()) && !isTicketsAlreadyLoad) {

                        UserNotificationService.show('Loading...');
                        isTicketsAlreadyLoad = true;

                        TicketsService.loadMore(scope, function (moreTicket) {

                          isTicketsAlreadyLoad = false;

                          if ($stateParams.listType === 'spam' && scope.currentUser.isOwner && moreTicket.length === 0 && paramsToSend.filter === 'ADMIN_MARKED_AS_SPAM') {
                            getReportSpamTicket(paramsToSend);
                          }

                          UserNotificationService.hide();

                        })
                      }

                      $timeout(function () {
                        var dropdown = element.find('.container-ticket-list [dropdown]');

                        dropdown.on('show.bs.dropdown', function () {
                          initDropdown();
                        })

                      }, 0);

                    }, 0);

                  }
                };

                initScrollListener(paramsToSend, scope);
                openTicketList();
              });
            }

            function initScrollListener(paramsToSend, $scope) {

              if (scrollListenerInitialize) {
                return;
              }

              scrollListenerInitialize = true;

              $document.on('scroll', function () {

                if (($document.scrollTop() >= ($document.height() - $(window).height() - 500)) && !isTicketsAlreadyLoad) {

                  UserNotificationService.show('Loading...');
                  isTicketsAlreadyLoad = true;

                  TicketsService.loadMore($scope, function (moreTicket) {

                    isTicketsAlreadyLoad = false;
                    UserNotificationService.hide();

                    if (moreTicket.length === 0) {

                      $document.off('scroll');

                      if (paramsToSend.filter !== 'ADMIN_REPORTED_AS_SPAM' && $stateParams.listType === 'spam' && $scope.currentUser.isOwner) {
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


            function initDropdown() {

              var windowWidth = $(window).width(),
                dropdownMenu = element.find('.container-ticket-list  .dropdown-menu-custom'),
                dropdownSubmenu = element.find('.container-ticket-list  .dropdown-submenu');

              if (windowWidth > 1700) {
                dropdownMenu.removeClass('dropdown-menu-right');
                dropdownSubmenu.removeClass('left-align');
              } else {
                dropdownMenu.addClass('dropdown-menu-right');
                dropdownSubmenu.addClass('left-align');
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
