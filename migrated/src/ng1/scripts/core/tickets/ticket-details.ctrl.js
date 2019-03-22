'use strict';

'use strict';
(function () {
    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
      ['$scope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService', 'Downloader', '$rootScope',
        '$state', 'ProductsService', '$sce', '$timeout', 'quicktech.common.services.UserConfirmationsService',
        'quicktech.common.services.UserNotificationService', 'quicktech.common.services.SharedStateService',
        'quicktech.common.services.TicketsPermissionsService', 'DevicesService',
        'quicktech.common.services.RemoteAccessService', 'ServicesService', 'quicktech.common.services.ticketMobileSettings', 'TagsService',
        function ($scope, TicketsService, $stateParams, UsersService, CompaniesService, Downloader, $rootScope, $state,
                  ProductsService, $sce, $timeout, UserConfirmationsService, UserNotificationService, SharedStateService,
                  TicketsPermissionsService, DevicesService, RemoteAccessService, ServicesService, ticketMobileSettings, TagsService) {

          var rightPanelSharedState = SharedStateService.getSharedState('rightPanel'),
            ticketsSharedState = SharedStateService.getSharedState('ticketsHeader');

          rightPanelSharedState.companyId = '';
          var ticketMobileSettings = ticketMobileSettings;
          $rootScope.saveForStartDate = new Date();
          $rootScope.saveForEndDate = new Date();
          $scope.showServicesError = false;
          $scope.currentCompany = CompaniesService.getCurrentCompany();
          $rootScope.serviceExpenseDurationPresentation = $scope.currentCompany.serviceExpenseDurationPresentation;
          $scope.linkPattern = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
          $scope.TicketsPermissionsService = TicketsPermissionsService;
          $scope.allUpdatesLoaded = false;
          $scope.selectUpdateSharedUser = {};
          $scope.ticketSharedUsersList = [];
          $scope.disabledWhenLoadAttachment = false;
          $scope.autocompleteData = ProductsService.getFullListForAutocomplete($scope);
          $scope.tagColors = TagsService.getColors();
          var today = new Date();

          $scope.date = today;
          $scope.hour = today.getHours();
          $scope.minute = Math.floor(today.getMinutes() / 5) * 5;
          $scope.isLoaded = false;
          $timeout(function() {
            ticketMobileSettings.data = $scope;
          }, 3000);
          $scope.getTicketStatus = function(ticket, arg) {
            var status;
            if(ticket.assignedUserId === null) {
              status = 'unassigned';
            } else if(ticket.status === 'COMPLETED') {
              status = 'completed';
            } else if(ticket.status === 'IN_PROGRESS') {
              status = 'inProgress';
            } else if(ticket.status === 'ON_HOLD') {
              status = 'onHold';
            }
            return status;
          };

          $rootScope.toggleUpdateWindow = function(state) {
            $rootScope.isMobileUpdateShown = state;
            $rootScope.isTicketEditOpened = state;
            if (!state) {
              $scope.editExpense = null;
            } else {
              $scope.editExpense = $scope.editExpense || false;
            }
          };

          $rootScope.closeTicket = function() {
            window.location.href = window.location.href.split('/').slice(0, -1).join('/');
          };

          $rootScope.isTicketOpened = true;
          $scope.$on('$destroy', function() {
            $rootScope.isTicketOpened = false;
          });

          $scope.agents = UsersService.getAllByCompanyId(CompaniesService.getCurrentCompany().id).filter(function(user) {
            return !user.deletedAt;
          });

          $scope.usersToWatch = $scope.agents.slice();
          $scope.editForms = {};
          $scope.setEditForm = function(form, name) {
            $scope.editForms[name] = form;
          };

          var params = $state.params.remoteParams;
          var isFromRemote = params && (params.deviceId || params.companyId || params.connectionDuration);
          if (isFromRemote) {
            $scope.ticketUpdate = { services: [{}] };
            $scope.ticketUpdate.services[0].quantity = params.connectionDuration ? params.connectionDuration.toFixed() : undefined;
            if (params.deviceId) {
              $scope.linkAgent($stateParams.ticketId, params.deviceId);
            }
            $scope.currentOpenTab = 'SERVICE';
          }

          UserNotificationService.show('Loading...');
          if($state.includes('tickets') && !$state.includes('companyProfile')) {
            $scope.ticketDetails = { id: $stateParams.ticketId };
          } else if($state.includes('companyProfile')) {
            $scope.ticketDetails = { id: ticketsSharedState.openTicketId };
          }

          TicketsService.getOne($scope.ticketDetails, $scope, function (details) {});
          UserNotificationService.hide();
          var condition = 'ticketUpdate.note' +
            '|| (ticketUpdate.attachments && ticketUpdate.attachments.length)' +
            '|| (ticketUpdate.products && ticketUpdate.products.length > 1)' +
            '|| (ticketUpdate.services && ticketUpdate.services.length > 1)';
          UserConfirmationsService.preventLocationChange($scope, condition);
        }]);
  }()
);
