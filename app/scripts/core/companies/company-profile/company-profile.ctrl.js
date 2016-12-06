'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'DevicesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', '$timeout', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService',
      function ($scope, $state, $stateParams, CompaniesService, DevicesService, StatisticsService,
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
        $scope.companyId = $stateParams.companyId;
        $scope.frequency = 'WEEKLY';
        $scope.selectedChart = 'countOfNewTickets';
        $scope.dateFormat = '%d %b';

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

        $scope.archiveCompany = function () {
          var company = CompaniesService.getOneById($scope.company.id);
          var confirmMessage = 'Do you want to archive ' + company.name;
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
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

        $scope.parseDate = function (values) {
          return values.map(function (obj) {
            return new Date(obj.date);
          })
        };

        $scope.selectChart = function (type) {
          $scope.selectedChart = type;
          $scope.chartHidden = false;
          $scope.reloading = true;
          $timeout(function () {
            $scope.reloading = false;
          });
        };

        $scope.timeToHoursAndMinutes = function (time) {
          var hours = Math.floor(time) || 0,
            minutes = Math.round((time - hours) * 60) || 0;

          return hours + ' h ' + (minutes ? minutes + ' min' : '');
        };

        $scope.getChartTitle = function () {
          switch ($scope.selectedChart) {
            case 'countOfNewTickets': return 'Created tickets';
            case 'responseTime': return 'Response time';
            case 'averageTime': return 'Average service time';
          }
        };

        $scope.setFrequency = function (newFrequency) {
          $scope.frequency = newFrequency;

          if (newFrequency === 'MONTHLY') {
            $scope.dateFormat = '%b';
          } else {
            $scope.dateFormat = '%d %b';
          }
        };

      }]);

}());
