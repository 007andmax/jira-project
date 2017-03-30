'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.bulkOptionCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'DevicesService', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, UsersService, SubscriptionsService, DevicesService, UserConfirmationsService) {

        $scope.$watch('companyProfileHeader', function (val) {

          if (val.selectUsersIds.length > 0) {

            $scope.bulkOptionMode = 'users';
            $scope.selectUsersIds = val.selectUsersIds;
            $scope.usersSbscr = angular.copy(val.selectUsersSubscr);

          } else if (val.selectDevicesIds.length > 0) {
            console.log(val);

            $scope.bulkOptionMode = 'devices';
            $scope.selectDevicesIds = val.selectDevicesIds;

          } else {
            $scope.bulkOptionMode = false;
            $scope.selectUsersIds = [];
            $scope.selectDevicesIds = [];
          }

        }, true);

        $scope.changeUserRole = function (role) {
          UsersService.changeUsersRoles($scope.selectUsersIds, role);
        };

        $scope.changeUserSubscription = function (subsc) {
          if ($scope.disabledSubscr || (subsc === 'invoice' && $scope.isInvoiceSubscriptionForbidden())) {
            return;
          }

          $scope.disabledSubscr = true;
          $scope.usersSbscr[subsc] = !$scope.usersSbscr[subsc];
          SubscriptionsService.changeSubscriptionsForUsers($scope.selectUsersIds, subsc, $scope.usersSbscr[subsc], function () {
            $scope.disabledSubscr = false;
          });
        };

        $scope.archiveUsers = function () {
          var confirmMessage = 'Do you want to archive ',
            confirmButton = 'Yes';

          confirmMessage += $scope.selectUsersIds.length === 1 ? '1 user' : $scope.selectUsersIds.length + ' users';

          UserConfirmationsService.show(confirmMessage, confirmButton).then(function () {
            try {
              UsersService.archiveUser($scope.selectUsersIds, function () {
                $scope.companyProfileHeader.unCheckAll();
              });
            } catch (err) {
              confirmButton = 'Ok';
              UserConfirmationsService.show(err, confirmButton, true);
            }
          });

        };

        $scope.removeDevices = function () {
          DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.selectDevicesIds);
          $scope.companyProfileHeader.unCheckAll();
        };

        $scope.shutdownDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesIds, 'shutdown');
        };

        $scope.restartDevices = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.selectDevicesIds, 'reboot');
        };

        $scope.getDeviceReport = function (agentIds) {
          DevicesService.getDeviceReports(agentIds, $scope.company.id, function (resp) {
            $scope.deviceReport = {};

            for (var i = 0; i < resp.reports.length; i++) {
              var report = resp.reports[i],
                agentId = report.agentId;

              delete report.agentId;
              groupSingleFields(report);
              report.agent = DevicesService.getOneById(agentId, resp.companyId);
              report.company = CompaniesService.getOneById(resp.companyId);
              report.primaryContact = $scope.getPrimaryContact(resp.companyId);
              report.address = resp.address;
              $scope.deviceReport[agentId] = report;
            }

          });
        };

        $scope.uncheckSelect = $scope.companyProfileHeader.unCheckAll;

        $scope.isInvoiceSubscriptionForbidden = function () {
          return $scope.users.filter(function (user) {
              return user.subscription && user.subscription.invoice;
            }).length === $scope.selectUsersIds.filter(function (id) {
              var user = UsersService.getOneById(id);
              return user.subscription && user.subscription.invoice;
            }).length;
        };

        function groupSingleFields(report) {
          report.general = {};
          for (var prop in report) {
            var value = report[prop];

            if (typeof value !== 'object') {
              report.general[prop] = value;
              delete report[prop];
            }
          }
        }

      }]);

}());
