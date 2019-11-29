'use strict';
(function () {
  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketsCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      'quicktech.common.services.TicketsPermissionsService', 'quicktech.common.services.SharedStateService', 'Utils',
      'quicktech.common.services.PermissionsService', 'DevicesService', 'TagsService', '$rootScope', 'CustomStorageService', '$timeout',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams,
        TicketsPermissionsService, SharedStateService, Utils, PermissionsService, DevicesService, TagsService, $rootScope, CustomStorageService, $timeout) {
        var availableTypes = ['all', 'unassigned', 'user', 'shared', 'spam', 'open', 'closed', 'trash', 'on_hold', 'completed', 'in_progress'],
          ticketsHeaderState = SharedStateService.getSharedState('ticketsHeader'),
          globalSearch = SharedStateService.getSharedState('globalSearch');
        var ticketsSharedState = ticketsHeaderState;
        $timeout(function () {
          $scope.ticketsGroup = window.location.href.split('/').slice(-1)[0].split('_').join(' ');
          if ($scope.ticketsGroup === 'user') $scope.ticketsGroup = 'My';
        })
        $scope.companyModelObj = {
          companyModel: ''
        }
        $scope.lastSavedStatus = null;
        $scope.selectedTickets = {};
        $scope.TicketsPermissionsService = TicketsPermissionsService;
        $scope.PermissionsService = PermissionsService;
        $scope.usersCurrentCompany = UsersService.getAllByCompanyIdNonArchived(CompaniesService.getCurrentCompany().id);
        $scope.tagColors = TagsService.getColors();
        $scope.attachmentTypePattern = /[0-9a-z]+$/i;
        $scope.numberPattern = /^\+?[0-9]{0,19}$/;
        $scope.clientCompanies = CompaniesService.getClientCompanies;
        $scope.allUsers = UsersService.getAllUsers;
        $scope.clientUsers = UsersService.getClientUsers;
        $scope.techUsers = UsersService.getTechUsers;
        $scope.allUsers = UsersService.getAllUsers();
        $scope.ticketsSharedState = ticketsSharedState;
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

      /*  if (window.localStorage.getItem('company_dashboard')) {
          window.location.href = `#/clients/companyProfile/${window.localStorage.getItem('company_dashboard')}?tabName=dashboard`;
          return;
        }*/
        // CustomStorageService.getUserCustomStorageValue('ticketPageFilterByCompanyHistory', function (resp) {
        //   $scope.companiesFilterHistoryTicketsPage = resp;
        // });
        //
        // CustomStorageService.getUserCustomStorageValue('ticketPageFilterByClientUsersHistory', function (resp) {
        //   $scope.clientUsersFilterHistoryTicketsPage = resp;
        // });
        //
        // CustomStorageService.getUserCustomStorageValue('ticketPageFilterByTechUsersHistory', function (resp) {
        //   $scope.techUsersFilterHistoryTicketsPage = resp;
        // });
        $scope.getLastNameUser = function (user) {
          return (user) ? user.lastName : "";
        }
        $scope.getFirstNameUser = function (user) {
          return (user) ?  user.firstName : "";
        }
        $scope.stateMobileGo = function () {
          $scope.lastSavedStatus = arguments;
        }
        $scope.stateGo = function (event, state, stateParams, isTag) {

          if (isTag) {
            $scope.isOnHoldTag = true;
          } else {
            $scope.isOnHoldTag = false;
          }
          if (event && event.button > 0) {
            var url = $state.href(state, stateParams, { absolute: true });
            window.open(url, '_blank');
          } else {
            $state.go(state, stateParams);
          }
        };
        $scope.getFullName = function (client) {
          var isAllSpaces = client.lastName === "    ";
          if (client.lastName && !isAllSpaces) {
            return client.firstName + ' ' + client.lastName;
          } else {
            return client.firstName;
          }
        };
        $scope.getUserByID = function (userId) {
          if (!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if (user) {
            if (user.lastName === '    ') {
              return user.firstName
            } else {
              return user.firstName + ' ' + user.lastName;
            }
          }
        };
        $scope.techUserModel = ticketsSharedState.filter.techUserId;
        $scope.companyModelObj.companyModel = $scope.ticketsSharedState.filter.companyId;
        $scope.clientUserModel = $scope.ticketsSharedState.filter.clientUserId;
        $scope.areMobileTicketsFiltersOpened = false;
        let state = $scope.$watch(function () {
          return $stateParams;
        }, function (stateParams) {
          if (availableTypes.indexOf(stateParams.listType) < 0) {
            $state.go('tickets', {
              listType: availableTypes[2]
            });
          } else {
            $scope.listType = stateParams.listType;
            $scope.currentOpeningTicket = stateParams.ticketId;
          }
        }, true);
        let changeTicketCompany = $scope.$watch(function () {
          return $rootScope.changeTicketCompany;
        }, function (val) {
          if (val) {
            // TicketsService.getCompanyTicketCount();
          }
        })
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
        $scope.getAssignedUserIDFromTicket = function (ticket) {
          if (ticket) {
            if (ticket.assignedUser && ticket.assignedUser.id) {
              return ticket.assignedUser.id;
            } else {
              return ticket.assignedUserId;
            }
          }
        };
        let changeSelectedTicketsWatch = $scope.$watch('tickets', changeSelectedTickets);
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
        function getUserIdByUserFullName(name) {
          var user = $scope.allUsers.find(function (user) {
            var fullName = user.lastName ? user.firstName + ' ' + user.lastName : user.firstName;
            return name === fullName;
          });
          return user.id;
        }
        function getCompanyIdByCompanyName(name) {
          //var company = $scope.clientCompanies().find((c) => c.name === name);
          var company = $scope.clientCompanies().find(function (c) {
            return c.name === name;
          });
          return company ? company.id : '';
        }
        function getUserObjByUserFullName(name) {
          var user = $scope.allUsers.find(function (user) {
            var fullName = user.lastName ? user.firstName + ' ' + user.lastName : user.firstName;
            return name === fullName;
          });
          return user;
        }
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
          }
        }
        $scope.checkAgreementTypeToShowDiscount = function (serviceExpense) {
          if (serviceExpense.item && serviceExpense.item.name && serviceExpense.item.name !== " ") {
            if (serviceExpense.item.blockTimeServiceAgreement == null &&
              serviceExpense.item.serviceContractServiceAgreement == null &&
              serviceExpense.item.serviceAgreement && serviceExpense.item.serviceAgreement.id) {
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
          state();
          changeTicketCompany();
          changeSelectedTicketsWatch();
        });
      }]);
}());
