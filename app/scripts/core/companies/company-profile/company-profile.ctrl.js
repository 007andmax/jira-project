'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'StatisticsService', 'TicketsService', 'DevicesService',
      'quicktech.common.services.SharedStateService', '$timeout', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService',
      function ($scope, $state, $stateParams, CompaniesService, StatisticsService, TicketsService, DevicesService,
                SharedStateService, $timeout, UserNotificationService, UserConfirmationsService, PermissionsService) {

        if (!PermissionsService.isAllowed('VIEW_COMPANIES')) {
          $state.go('tickets');
        }

        UserNotificationService.show('Loading...');

        var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');
        var globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.PermissionsService = PermissionsService;
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
          field: 'name',
          reverse: false
        };
        $scope.company = CompaniesService.getOneById($stateParams.companyId, function (resp) {
          if (resp === $scope.company.id) {
            $state.go('companies');
          }
        });

        if (!$scope.company) {
          $state.go('companies');
          return;
        }

        globalSearch.openedItemName = $scope.company.name;
        rightPanelSharedState.companyId = $scope.company.id;

        $scope.companyData = CompaniesService.getCompanyProfileData($scope, $stateParams.companyId, function (resp) {
          $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
          $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];

          $timeout(function () {
            UserNotificationService.hide();
          }, 0);

        });

        DevicesService.getSomeInfoForDevices($scope.company.id, function (resp) {
          $scope.isDomainPresent = resp.domainPresent;
          $scope.allowAgentInstall = resp.allowAgentInstall;
        });

        //$scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany($stateParams.companyId, $scope);
        //$scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany($stateParams.companyId, $scope);
        //$scope.countsTicketsCompany = TicketsService.getCountsByTypesAndCompany($scope, $stateParams.companyId, ['UNASSIGNED', 'OPEN'], function () {
        //
        //  $scope.$watch('countsTicketsCompany', function () {
        //
        //    $scope.countsByTypesAndCompany = [{
        //      label: 'Unassigned',
        //      value: $scope.countsTicketsCompany['UNASSIGNED'],
        //      color: "#1586e4"
        //    }, {
        //      label: 'Open',
        //      value: $scope.countsTicketsCompany['OPEN'],
        //      color: "#ffa726"
        //    }];
        //
        //    for (var i = 0; i < $scope.countsByTypesAndCompany.length; i++) {
        //      if ($scope.countsByTypesAndCompany[i].value > 0 && !$scope.isChartHasOpen) {
        //        //$scope.isCollapsed = false;
        //        $scope.isChartHasOpen = true;
        //        $scope.isCompanyHasTickets = true;
        //        return;
        //      }
        //    }
        //
        //  })
        //
        //});

        $scope.archiveCompany = function () {
          var company = CompaniesService.getOneById($scope.company.id);
          var confirmMesage = 'Do you want to archive ' + company.name;
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            CompaniesService.archive($scope.company.id, function (resp) {
              if (resp.data.code == 403) {
                UserNotificationService.show(resp.data.message, true);
              } else {
                $state.go('companies');
              }
            });
          })
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

        $scope.$on('showEditCover', function () {
          $scope.isShowEditCover = true;
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
          if (option === $scope.orderUsersTab.field) {
            $scope.orderUsersTab.reverse = !$scope.orderUsersTab.reverse;
          } else {
            $scope.orderUsersTab.field = option;
            $scope.orderUsersTab.reverse = false;
          }
        };

        $scope.orderByForUsers = function (item) {
          if ($scope.orderUsersTab.field === 'name') {
            return item.firstName + item.lastName;
          } else if ($scope.orderUsersTab.field === 'type') {
            return item.role;
          } else if ($scope.orderUsersTab.field === 'ticket') {
            return item.userStatistic ? item.userStatistic.ticketsSubmitted : false;
          }

        };

        $scope.setEditedUser = function (user) {
          $scope.editedUser = angular.copy(user);
        };

        $scope.createUser = function () {
          if (!$scope.editedUser || !$scope.editedUser.newUser) {
            $state.go('companyProfile', { tabName: 'user' }).then(function () {
              $scope.editedUser = {
                newUser: true,
                company: { id: $scope.company.id },
                role: 'USER',
                phoneNumbers: [{ typeNumber: 'OFFICE' }],
                subscription: {}
              };
            });
          }
        };

      }]);

}());
