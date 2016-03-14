'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyCtrl',
    ['$scope', 'CompaniesService', '$state', 'quicktech.common.services.UserNotificationService',
      function ($scope, CompaniesService, $state, UserNotificationService) {

        $scope.$watch('companiesInfo["' + $scope.company.id + '"]', function (newInfo) {
          var primaryContact,
            primaryAddress,
            primaryPhone;

          if (newInfo) {

            for (var i = 0; i < newInfo.contacts.length; i++) {
              if (!primaryContact || newInfo.contacts[i].priority > primaryContact.priority)
                primaryContact = newInfo.contacts[i];
            }

            for (var i = 0; i < newInfo.addresses.length; i++) {
              if (newInfo.addresses[i].isPrimary) {
                primaryAddress = newInfo.addresses[i];
              }
            }

            if (primaryAddress) {
              for (var i = 0; i < primaryAddress.phoneNumbers.length; i++) {
                if (!primaryPhone || primaryAddress.phoneNumbers[i].priority > primaryPhone.priority)
                  primaryPhone = primaryAddress.phoneNumbers[i];
              }
            }
          }

          $scope.primaryContact = primaryContact;
          $scope.primaryAddress = primaryAddress;
          $scope.primaryPhone = primaryPhone;

          if (primaryAddress) {
            $scope.location = primaryAddress.suiteNumber ? primaryAddress.suiteNumber + ', ' : '';
            $scope.location += primaryAddress.address;
            $scope.location += primaryAddress.postalCode ? ', ' + primaryAddress.postalCode : '';
          } else {
            $scope.location = '';
          }
        });

        $scope.archiveCompany = function (companyId) {
          CompaniesService.archive(companyId, function (resp) {
            if (resp.data.code == 403) {
              UserNotificationService.show(resp.data.message, true);
            }
          });
        };

        $scope.showCompanyProfile = function () {
          if ($scope.currentUser.role !== 'USER') {
            $state.go('companyProfile', {companyId: $scope.company.id});
          }
        };

        $scope.getUserSubscribeClass = function () {
          if (!$scope.primaryContact || !$scope.primaryContact.subscription) {
            return;
          }

          if ($scope.primaryContact.subscription.ticket && $scope.primaryContact.subscription.invoice) {
            return 'badge-invoice-and-ticket-updates badge-updates';
          } else if ($scope.primaryContact.subscription.ticket && !$scope.primaryContact.subscription.invoice) {
            return 'badge-ticket-updates badge-updates';
          } else if (!$scope.primaryContact.subscription.ticket && $scope.primaryContact.subscription.invoice) {
            return 'badge-invoice-updates badge-updates';
          }
        };

        $scope.getUserSubscribeTooltip = function () {
          if (!$scope.primaryContact || !$scope.primaryContact.subscription) {
            return;
          }

          if ($scope.primaryContact.subscription.ticket && $scope.primaryContact.subscription.invoice) {
            return 'subscriber invoice and ticket updates';
          } else if ($scope.primaryContact.subscription.ticket && !$scope.primaryContact.subscription.invoice) {
            return 'subscriber ticket updates';
          } else if (!$scope.primaryContact.subscription.ticket && $scope.primaryContact.subscription.invoice) {
            return 'subscriber invoice updates';
          }
        };

      }]);

}());
