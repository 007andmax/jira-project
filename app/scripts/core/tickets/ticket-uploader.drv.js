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

                if ($stateParams.listType.toLowerCase() === 'preview') {
                  var cssSettings = {
                      'width': '80%',
                      'position': 'fixed',
                      'height': '100%'
                    },
                    conteiner = element.find('[show-ticket-details]');

                  conteiner.removeClass('container-ticket-content');
                  conteiner.css(cssSettings);

                  element.find('.ticket-header').css({'width': '80%'});


                  $document.off('scroll');
                  return;
                }

                getTicketsList(searchFilter);
              }, true
            );

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

                      $timeout(function () {
                        var dropdown = element.find('[dropdown]');

                        dropdown.on('show.bs.dropdown', function () {
                          initDropdown();
                        })

                      }, 0);

                    }, 0);

                  }
                };

                initScrollListener(paramsToSend, scope);
                $('body').addClass("opened-ticket-list");
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


            function initDropdown() {

              var windowWidth = $(window).width(),
                dropdownMenu = element.find('.dropdown-menu-custom');

              if (windowWidth > 1560) {
                dropdownMenu.removeClass('dropdown-menu-right');
              } else {
                dropdownMenu.addClass('dropdown-menu-right');
              }
            }


            //function initTicketList() {
            //
            //  var windowWidth = $(window).width();
            //
            //  console.log(windowWidth)
            //
            //  console.log($('.ticket-list .dropdown-menu'))
            //
            //  if (windowWidth > 1560) {
            //
            //
            //    dropdownAssignUser.removeClass('dropdown-menu-right');
            //    $('.ticket-list .dropdown-menu .dropdown-submenu').removeClass('left-align');
            //    //$(".container-ticket-content").addClass("nano");
            //    //$(".container-ticket-content .ticket-header").addClass('ticket-fixed-header');
            //    //$(".ticket-detail > h2").css("margin-top", "92px");
            //
            //
            //  } else {
            //
            //    $('body').addClass("opened-ticket-list");
            //    dropdownAssignUser.addClass('dropdown-menu-right');
            //    $('.ticket-list .dropdown-menu .dropdown-submenu').addClass('left-align');
            //
            //    //$(".container-ticket-content").removeClass("nano");
            //    //$(".container-ticket-content .ticket-header").removeClass('ticket-fixed-header');
            //    //$(".ticket-detail > h2").css("margin-top", "0");
            //
            //  }
            //
            //  $('.nano').nanoScroller({
            //    alwaysVisible: false,
            //    flash: true,
            //    flashDelay: 1000,
            //    sliderMinHeight: 98
            //  });
            //}

          }
        };
      }])
  ;

})
();
