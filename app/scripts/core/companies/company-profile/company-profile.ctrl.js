'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'StatisticsService', 'UsersService', 'TicketsService',
      'SubscriptionsService', 'VendorsService', 'quicktech.common.services.SharedStateService', '$timeout',
      'DevicesService', 'quicktech.common.services.UserNotificationService', 'Utils',
      function ($scope, $state, $stateParams, CompaniesService, StatisticsService, UsersService, TicketsService,
                SubscriptionsService, VendorsService, SharedStateService, $timeout, DevicesService,
                UserNotificationService, Utils) {

        UserNotificationService.show('Loading...');

        var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');
        $scope.companyProfileHeader = {
          selectUsersIds: [],
          selectDevicesIds: []
        };

        $scope.isChartHasOpen = false;
        $scope.isShowLoaderOnCover = false;
        $scope.mode = 'user';
        $scope.isCollapsed = true;
        $scope.locationIndex = 0;
        $scope.contactIndex = 0;
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;
        $scope.selectedUsers = {};
        $scope.selectDevices = {};
        $scope.orderUsersTab = {
          fild: 'name',
          reverse: false
        };
        $scope.company = CompaniesService.getOneById($stateParams.companyId, function (resp) {
          if (resp === $scope.company.id) {
            $state.go('companies');
          }
        });
        DevicesService.getAgentsByCompany($scope, $scope.company.id, function (resp) {
          $scope.agents = resp;
        });

        $scope.isChartsAccess = function () {
          return $scope.currentUser.role === 'SUPER_TECH_ADMIN' && $scope.company.accountType === 'CLIENT';
        };

        rightPanelSharedState.companyId = $scope.company.id;

        $scope.companyData = CompaniesService.getCompanyData($scope, $stateParams.companyId, function () {
          $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
          $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];

          $timeout(function () {
            UserNotificationService.hide();
          }, 0);

        });
        $scope.users = UsersService.getAllByCompanyId($stateParams.companyId);
        $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($stateParams.companyId, $scope);

        if ($scope.isChartsAccess()) {

          $scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany($stateParams.companyId, $scope);
          $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany($stateParams.companyId, $scope);
          $scope.countsTicketsCompany = TicketsService.getCountsByTypesAndCompany($scope, $stateParams.companyId, ['UNASSIGNED', 'OPEN'], function () {

            $scope.$watch('countsTicketsCompany', function () {

              $scope.countsByTypesAndCompany = [{
                label: 'Unassigned',
                value: $scope.countsTicketsCompany['UNASSIGNED'],
                color: "#1586e4"
              }, {
                label: 'Open',
                value: $scope.countsTicketsCompany['OPEN'],
                color: "#ffa726"
              }];

              for (var i = 0; i < $scope.countsByTypesAndCompany.length; i++) {
                if ($scope.countsByTypesAndCompany[i].value > 0 && !$scope.isChartHasOpen) {
                  $scope.isCollapsed = false;
                  $scope.isChartHasOpen = true;
                  $scope.isCompanyHasTickets = true;
                  return;
                }
              }

            })

          });
        }

        $scope.changeCurrentLocation = function (index) {
          if (0 <= index && index < $scope.companyData.addresses.length) {
            $scope.locationIndex = index;
            $timeout(function () {
              $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
            }, 300)
          }
        };

        $scope.changeCurrentContact = function (index) {
          if (0 <= index && index < $scope.companyData.contacts.length) {
            $scope.contactIndex = index;
            $timeout(function () {
              $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];
            }, 300)
          }
        };

        $scope.archiveCompany = function () {
          CompaniesService.archive($scope.company.id, function (resp) {
            if (resp.data.code == 403) {
              UserNotificationService.show(resp.data.message, true);
            } else {
              $state.go('companies');
            }
          });
        };

        $scope.getPriorityNumber = function (object, returnType) {

          if (!object || !object.phoneNumbers || object.phoneNumbers.length < 1) {
            return;
          }

          var priority;
          var index;
          for (var i = 0; i < object.phoneNumbers.length; i++) {
            if (priority === undefined || object.phoneNumbers[i].priority < priority) {
              priority = object.phoneNumbers[i].priority;
              index = i;
            }
          }

          if (returnType) {
            return object.phoneNumbers[index].typeNumber;
          }

          return object.phoneNumbers[index].number;
        };

        $scope.showEditCover = function (option) {
          if (option) {
            $scope.$broadcast('openEditCover', {})
          } else {
            $scope.$broadcast('openEditCover', $scope.company.cover ? $scope.company.cover.staticCopy() : {});
          }

        };

        $scope.cancelEditCover = function () {
          $scope.isShowEditCover = false;
        };

        $scope.restoreDefaultCover = function () {
          CompaniesService.deleteCover($scope.company.id, function () {
            $scope.isShowEditCover = false;
          });
        };

        $scope.saveEditCover = function (editCover) {
          $scope.isShowLoaderOnCover = true;
          CompaniesService.saveCover(editCover, $scope.company.id, function () {
            $scope.isShowLoaderOnCover = false;
            $scope.isShowEditCover = false;
          });
        };

        $scope.getUserSubscribeClass = function (user) {
          if (!user || !user.subscription) {
            return;
          }

          if (user.subscription.ticket && user.subscription.invoice) {
            return 'badge-invoice-and-ticket-updates badge-updates';
          } else if (user.subscription.ticket && !user.subscription.invoice) {
            return 'badge-ticket-updates badge-updates';
          } else if (!user.subscription.ticket && user.subscription.invoice) {
            return 'badge-invoice-updates badge-updates';
          } else {
            return 'badge-not-updates badge-updates';
          }
        };

        $scope.getUserSubscribeTooltip = function (user) {
          if (!user || !user.subscription) {
            return;
          }

          if (user.subscription.ticket && user.subscription.invoice) {
            return 'subscriber invoice and ticket updates';
          } else if (user.subscription.ticket && !user.subscription.invoice) {
            return 'subscriber ticket updates';
          } else if (!user.subscription.ticket && user.subscription.invoice) {
            return 'subscriber invoice updates';
          } else {
            return 'click to choose subscriber';
          }
        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.setCollapsedValue = function (value) {
          $scope.isCollapsed = value;
        };

        $scope.setChartHasOpenValue = function (value) {
          $scope.isChartHasOpen = value;
        };

        $scope.changeSelectedUsers = function () {
          var selectUsersIds = [];
          var selectUsersSbscr = {
            invoice: 0,
            ticket: 0
          };

          for (var userId in $scope.selectedUsers) {
            if ($scope.selectedUsers[userId]) {
              selectUsersIds.push(userId);

              var user = Utils.findById($scope.users, userId);

              if (user.subscription.invoice) {
                selectUsersSbscr.invoice++;
              }
              if (user.subscription.ticket) {
                selectUsersSbscr.ticket++;
              }

            }
          }

          $scope.companyProfileHeader.selectUsersSubscr = {
            invoice: selectUsersSbscr.invoice === selectUsersIds.length,
            ticket: selectUsersSbscr.ticket === selectUsersIds.length
          };

          $scope.isSelectAllUsers = (selectUsersIds.length > 0) && (selectUsersIds.length === $scope.users.length);
          $scope.companyProfileHeader.selectUsersIds = selectUsersIds;
        };

        $scope.selectAllUsers = function () {
          $scope.isSelectAllUsers = !$scope.isSelectAllUsers;

          for (var i = 0, len = $scope.users.length; i < len; i++) {
            $scope.selectedUsers[$scope.users[i].id] = $scope.isSelectAllUsers;
          }

          $scope.changeSelectedUsers();
        };

        $scope.changeSelectDevices = function () {
          var selectDevicesIds = [];
          var countOnlineDevices = 0;

          for (var deviceId in $scope.selectDevices) {
            if ($scope.selectDevices[deviceId]) {
              selectDevicesIds.push(deviceId)
            }
          }

          if ($scope.agents) {
            for (var i = 0, len = $scope.agents.length; i < len; i++) {
              if ($scope.agents[i].online) {
                countOnlineDevices++
              }
            }
          }

          $scope.isSelectAllDevices = (selectDevicesIds.length > 0) && (selectDevicesIds.length === countOnlineDevices);
          $scope.companyProfileHeader.selectDevicesIds = selectDevicesIds;
        };

        $scope.selectAllDevices = function () {
          $scope.isSelectAllDevices = !$scope.isSelectAllDevices;

          for (var i = 0, len = $scope.agents.length; i < len; i++) {
            if ($scope.agents[i].online) {
              $scope.selectDevices[$scope.agents[i].agentId] = $scope.isSelectAllDevices;
            } else {
              $scope.selectDevices[$scope.agents[i].agentId] = false
            }
          }

          $scope.changeSelectDevices();
        };

        $scope.companyProfileHeader.unCheckAll = function () {
          $scope.selectDevices = {};
          $scope.selectedUsers = {};
          $scope.changeSelectedUsers();
          $scope.changeSelectDevices();
        };

        $scope.$on('showEditCover', function () {
          $scope.isShowEditCover = true;
        });

        $scope.$watch('mode', function () {
          $scope.companyProfileHeader.unCheckAll()
        });

        $scope.$on('showErrorCover', function (event, message) {

          $scope.isShowErrorMessage = true;
          $scope.messageError = message;

          $scope.$apply();

          $timeout(function () {
            $scope.isShowErrorMessage = false;
            $scope.messageError = '';
          }, 3000)
        });

        $scope.$on('$destroy', function () {
          rightPanelSharedState.companyId = undefined;
        });

        $scope.setOrderByUsers = function (option) {
          if (option === $scope.orderUsersTab.fild) {
            $scope.orderUsersTab.reverse = !$scope.orderUsersTab.reverse;
          } else {
            $scope.orderUsersTab.fild = option;
            $scope.orderUsersTab.reverse = false;
          }
        };

        $scope.orderByForUsers = function (item) {
          if ($scope.orderUsersTab.fild === 'name') {
            return item.firstName + item.lastName;
          } else if ($scope.orderUsersTab.fild === 'type') {
            return item.role;
          } else if ($scope.orderUsersTab.fild === 'ticket') {
            return item.userStatistic ? item.userStatistic.ticketsSubmitted : false;
          }

        };

      }]);

}());
