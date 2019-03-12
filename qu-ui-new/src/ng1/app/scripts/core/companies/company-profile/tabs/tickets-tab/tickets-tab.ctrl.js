'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.ticketsTabCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      'quicktech.common.services.TicketsPermissionsService', 'quicktech.common.services.SharedStateService', 'Utils',
      'quicktech.common.services.PermissionsService', 'DevicesService', 'TagsService', '$location', '$timeout',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams,
                TicketsPermissionsService, SharedStateService, Utils, PermissionsService, DevicesService, TagsService, $location, $timeout) {

        var availableTypes = ['all', 'unassigned', 'user', 'shared', 'spam', 'open', 'closed', 'trash', 'on_hold', 'completed', 'in_progress'],
          availableTabs = ['tickets-all', 'tickets-unassigned', 'tickets-inProgress', 'tickets-onHold', 'tickets-completed'],
          ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader'),
          globalSearch = SharedStateService.getSharedState('globalSearch'),
          tabsTypeMap={
            'tickets-all': 'all',
            'tickets-unassigned': 'unassigned',
            'tickets-inProgress': 'in_progress',
            'tickets-onHold' : 'on_hold',
            'tickets-completed': 'completed'
          };

        $scope.selectedTickets = {};
        $scope.TicketsPermissionsService = TicketsPermissionsService;
        $scope.PermissionsService = PermissionsService;
        $scope.usersCurrentCompany = UsersService.getAllByCompanyIdNonArchived(CompaniesService.getCurrentCompany().id);
        $scope.tagColors = TagsService.getColors();
        $scope.attachmentTypePattern = /[0-9a-z]+$/i;
        $scope.numberPattern = /^\+?[0-9]{0,19}$/;
        $scope.attachmentType = {
          'image/jpg': 'jpg',
          'image/jpeg': 'jpeg',
          'image/bmp': 'bmp',
          'image/gif': 'gif',
          'image/png': 'png',
          'application/vnd.oasis.opendocument.text': 'odt',
          'application/vnd.oasis.opendocument.spreadsheet': 'ods',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'application/vnd.ms-powerpoint': 'ppt',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
          'application/msword': 'doc',
          'application/msxls': 'xls',
          'application/rtf': 'rtf',
          'application/x-rtf': 'rtf',
          'text/plain': 'txt',
          'text/csv': 'cvs'
        };
        $scope.attachmentImageClass = {
          'image/jpg': 'viewable',
          'archive/zip': 'zip',
          'image/bmp': 'not-viewable'
        };

        $scope.$watch(function () {
          return $stateParams;
        }, function (stateParams) {

          // if (availableTypes.indexOf(stateParams.listType) < 0) {
          //   $state.go('tickets', {
          //     listType: availableTypes[0]
          //   });
          // } else {
          //   $scope.listType = stateParams.listType;
          //   $scope.currentOpeningTicket = stateParams.ticketId;
          // }
          ticketsHeaderState.filter.companyId = stateParams.companyId;
          ticketsHeaderState.searchFilter.companyId = stateParams.companyId;
          if(availableTabs.indexOf(stateParams.tabName) < 0) {
            $scope.listType = availableTabs[0];
            $stateParams.listType = 'all';
              // $state.go('companyProfile', {
              //   tabName: availableTabs[0]
              // });
          } else {
            $scope.listType = tabsTypeMap[stateParams.tabName];
            $scope.currentOpeningTicket = stateParams.ticketId;
            $stateParams.listType = tabsTypeMap[stateParams.tabName];
          }
        }, true);



        $scope.linkAgent = function (ticketId, agentId) {
          TicketsService.changeLinkedAgent(ticketId, agentId);
        };

        $scope.ticketStatusToCssFormat = function (status) {
          if (status === 'IN_PROGRESS') {
            return 'progress';
          } else if (status === 'COMPLETED') {
            return 'completed';
          } else if (status === 'ON_HOLD') {
            return 'onhold';
          }
        };

        $scope.getUserById = function (userId) {
          return UsersService.getOneById(userId);
        };

        $scope.getAssignedUserIDFromTicket = function(ticket) {
          if(ticket) {
            if(ticket.assignedUser && ticket.assignedUser.id) {
              return ticket.assignedUser.id;
            } else {
              return ticket.assignedUserId;
            }
          }
        };

        $scope.$watch('tickets', changeSelectedTickets);

        $scope.changeSelectedTickets = changeSelectedTickets;
        $scope.uncheckTicket = uncheckTicket;

        $scope.$on('uncheckAllTickets', uncheckAllTickets);

        $scope.userReadable = function (text) {
          if (!text) {
            return '';
          }

          var words = text.split('_'),
            result = '';

          for (var i = 0, len = words.length; i < len; i++) {
            var word = words[i];
            result += word[0].toUpperCase() + word.slice(1).toLowerCase();

            if (i !== len - 1) {
              result += ' ';
            }
          }

          return result;
        };

        $scope.isDeviceToLink = function (agents, agentFromTicket) {
          if (!agentFromTicket || !agentFromTicket.deviceId) {
            return true;
          }

          return agents.filter(function (agent) {
            return agent.id !== agentFromTicket.deviceId;
          }).length;
        };

        function changeSelectedTickets(id, status) {

          ticketsHeaderState.checkedTicketsIds = [];
          ticketsHeaderState.selectedTickets = [];
          ticketsHeaderState.agentList = undefined;
          globalSearch.selectedItemsCount = 0;

          for (var ticketId in $scope.selectedTickets) {
            if ($scope.selectedTickets[ticketId]) {

              ticketsHeaderState.checkedTicketsIds.push(ticketId);
              var ticket = Utils.findById($scope.tickets, ticketId) || Utils.findById($scope.reportSpamTickets, ticketId);

              if (!ticketsHeaderState.agentList) {
                DevicesService.getAgentsByCompany($scope, ticket.companyId, function (resp) {
                  ticketsHeaderState.agentList = resp;
                });
              }

              ticketsHeaderState.selectedTickets.push(ticket);
              globalSearch.selectedItemsCount++;
            }
          }


          if ($state.includes('tickets.details') && !globalSearch.selectedItemsCount) {
            globalSearch.goBack.isEnabled = true;
            globalSearch.goBack.func = function () {
              $state.go('tickets');
              globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            };
            globalSearch.goBack.tooltip = 'collapse ticket';
          } else {
            globalSearch.goBack.isEnabled = !!globalSearch.selectedItemsCount;
            globalSearch.goBack.func = uncheckAllTickets;
            globalSearch.goBack.tooltip = 'reset selected items';
            if(globalSearch.selectedItemsCount<1) {
              globalSearch.goBack.isEnabled = true;
              globalSearch.goBack.func = $state.go.bind($state, 'companies');
              globalSearch.goBack.tooltip = 'back to companies';
            }
          }
        }

        $scope.checkAgreementTypeToShowDiscount = function(serviceExpense) {
          if(serviceExpense.item && serviceExpense.item.name) {
            if(serviceExpense.item.blockTimeServiceAgreement == null &&
              serviceExpense.item.serviceContractServiceAgreement == null &&
              serviceExpense.item.serviceAgreement.id) {
              return true
            } else {
              return false;
            }
          }
        };

        function uncheckTicket(id) {
          if ($scope.selectedTickets[id]) {
            $scope.selectedTickets[id] = false;
            changeSelectedTickets(id);
          }
        }

        function uncheckAllTickets() {
          $scope.selectedTickets = {};
          changeSelectedTickets();
          ticketsHeaderState.agentList = undefined;
        }

        $scope.$on('$destroy', function () {
          ticketsHeaderState.checkedTicketsIds = [];
          ticketsHeaderState.selectedTickets = [];
          ticketsHeaderState.agentList = [];
        });

        $scope.openTicketDetailsPage = false;
        $scope.openTicket = function(id) {
          if(ticketsHeaderState.openTicketId !== id) {
            $scope.openTicketDetailsPage = false;
            $timeout(function(){
              $scope.openTicketDetailsPage = true;
            }, 0)
          } else {
            $scope.openTicketDetailsPage = true;
          }
          $scope.currentOpeningTicket = id;
          ticketsHeaderState.openTicketId = id;
        };

        $scope.$watch(function(){
          return $location.search().tabName
        }, function(tabName) {
          if(tabName) {
            $scope.openTicketDetailsPage = false;
          }
        })

      }]);
}());
