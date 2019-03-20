'use strict';

(function () {

  angular.module('quicktech').directive('welcomeWizard',
    ['$uibModal', 'localStorageService', function ($uibModal, localStorageService) {
      return {
        restrict: 'A',
        link: function ($scope) {
          var modalParams = {
            animation: true,
            backdrop: 'static',
            keyboard: false,
            windowClass: 'welcome-wizard',
            templateUrl: '/html/scripts/common/directives/welcome-wizard/welcome-wizard.tpl.html',
            controller: ['$scope', '$state', '$uibModalInstance', 'UsersService', '$rootScope', modalController]
          };

          var key = 'disableWelcomeWizard',
            disabledWizard = JSON.parse(localStorageService.cookie.get(key));

          if ($scope.currentUser && !$scope.currentUser.disabledWelcomeWizard && !disabledWizard) {
            var modalInstance = $uibModal.open(modalParams);
            localStorageService.cookie.set(key, 'true', 1, false);

            modalInstance.opened.then(function () {
              $('body').addClass('non-body-scroll');
            });

            modalInstance.result.finally(function () {
              $('body').removeClass('non-body-scroll');
            });
          }

          function modalController($scope, $state, $uibModalInstance, UsersService, $rootScope) {
            var startPageMap = {
              ALL: 'all',
              UNASSIGNED: 'unassigned',
              MY_TICKETS: 'user',
              SHARED: 'shared',
              OPEN: 'open',
              CLOSED: 'closed',
              TRASH: 'trash',
              SPAM: 'spam'
            };

            $scope.pageMapping = {
              'ALL': 'All Tickets',
              'UNASSIGNED': 'Unassigned',
              'MY_TICKETS': 'My Tickets',
              'SHARED': 'Shared',
              'OPEN': 'Open',
              'CLOSED': 'Closed',
              'TRASH': 'Trash',
              'SPAM': 'Spam'
            };

            if ($scope.currentUser) {
              $scope.pageToOpen = $scope.currentUser.startPage;
            } else {
              var unwatch = $scope.$watch('currentUser', function (currentUser) {
                if (currentUser) {
                  $scope.pageToOpen = currentUser.startPage;
                  unwatch();
                }
              });
            }

            $scope.setPageToOpen = function (value) {
              $scope.pageToOpen = value;
              UsersService.saveForUserProfile({ startPage: value }, 'misc');
            };

            $scope.goToTickets = function () {
              $state.go('tickets', { listType: startPageMap[$scope.pageToOpen] });
              UsersService.updateWelcomeWizard('', $scope.dontShowThisAgain);
              $uibModalInstance.dismiss();
            };

            $scope.openSection = function (state, params) {
              $state.go(state, params).then(function () {
                if (state !== 'settings.companyProfile') {
                  UsersService.updateWelcomeWizard(state, $scope.dontShowThisAgain);
                }
                $uibModalInstance.dismiss();
              });
            };

            $scope.closeModal = function () {
              $uibModalInstance.dismiss();
            };
          }
        }
      };
    }]);
})();
