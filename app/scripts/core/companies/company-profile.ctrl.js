'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'StatisticsService', 'UsersService', 'TicketsService',
      'SubscriptionsService', 'VendorsService', 'quicktech.common.services.SharedStateService', '$timeout',
      function ($scope, $state, $stateParams, CompaniesService, StatisticsService, UsersService, TicketsService,
                SubscriptionsService, VendorsService, SharedStateService, $timeout) {

        var rightPanelSharedState = SharedStateService.getSharedState('rightPanel');

        $scope.isShowLoaderOnCover = false;
        $scope.mode = 'user';
        $scope.isCollapsed = false;
        $scope.locationIndex = 0;
        $scope.contactIndex = 0;
        $scope.gmtPattern = /\w+/;
        $scope.hourPattern = /\d+\:\d+/;
        $scope.company = CompaniesService.getOneById($stateParams.companyId);

        rightPanelSharedState.companyId = $scope.company.id;

        $scope.companyData = CompaniesService.getCompanyData($scope, $stateParams.companyId, function () {
          $scope.currentLocation = $scope.companyData.addresses[$scope.locationIndex];
          $scope.currentContact = $scope.companyData.contacts[$scope.contactIndex];
        });
        $scope.ticketsResolution = StatisticsService.getTicketsResolutionTimeChartDataByCompany($stateParams.companyId, $scope);
        $scope.timeBilledByCompany = StatisticsService.getTimeBilledByCompany($stateParams.companyId, $scope);
        $scope.users = UsersService.getAllByCompanyId($stateParams.companyId);
        $scope.userSubscriptionsByCompanyId = SubscriptionsService.getUserSubscriptionsByCompanyId($stateParams.companyId, $scope);
        $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany($stateParams.companyId, $scope);

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
          })

        });

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
          CompaniesService.archive($scope.company.id);
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

          $scope.isOpenUploadWindow = option;

          if (option) {
            $scope.editCover = {}
          } else {
            $scope.editCover = $scope.company.cover ? $scope.company.cover.staticCopy() : {};
          }
        };

        $scope.cancelEditCover = closeEditCover;

        $scope.restoreDefaultCover = function () {
          CompaniesService.deleteCover($scope.company.id, function () {
            closeEditCover();
          });
        };

        $scope.saveEditCover = function (editCover) {
          $scope.isShowLoaderOnCover = true;
          CompaniesService.saveCover(editCover, $scope.company.id, function () {
            $scope.isShowLoaderOnCover = false;
            closeEditCover();
          });
        };

        $scope.getUserSubscribleClass = function (user) {
          if (!user || !user.subscription) {
            return;
          }

          if (user.subscription.ticket && user.subscription.invoice) {
            return 'badge-invoice-and-ticket-updates badge-updates';
          } else if (user.subscription.ticket && !user.subscription.invoice) {
            return 'badge-ticket-updates badge-updates';
          } else if (!user.subscription.ticket && user.subscription.invoice) {
            return 'badge-invoice-updates badge-updates';
          }
        };

        $scope.getUserSubscribleTooltip = function (user) {
          if (!user || !user.subscription) {
            return;
          }

          if (user.subscription.ticket && user.subscription.invoice) {
            return 'subscriber invoice and ticket updates';
          } else if (user.subscription.ticket && !user.subscription.invoice) {
            return 'subscriber ticket updates';
          } else if (!user.subscription.ticket && user.subscription.invoice) {
            return 'subscriber invoice updates';
          }
        };

        $scope.toggleCollapsed = function () {
          $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.$on('showEditCover', function () {
          $scope.isShowEditCover = true;
        });

        $scope.$on('showErrorCover', function (event, message) {

          $scope.isShowErrorMessage = true;
          $scope.messageError = message;
          $scope.editCover = undefined;

          $scope.$apply();

          $timeout(function () {
            $scope.isShowErrorMessage = false;
            $scope.messageError = '';
          }, 3000)
        });

        function closeEditCover() {
          $scope.editCover = undefined;
          $scope.isShowEditCover = false;
        }

        $scope.$on('$destroy', function () {
          rightPanelSharedState.companyId = undefined;
        });

      }]);

}());
