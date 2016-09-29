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
            controller: ['$scope', '$http', '$uibModalInstance', modalController]
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

          function modalController($scope, $http, $uibModalInstance) {
            $scope.closeWizard = function () {
              if ($scope.dontShowThisAgain) {
                $http.post('/users/welcomeWizard', {});
              }
              $uibModalInstance.dismiss();
            };
          }
        }
      };
    }]);
})();
