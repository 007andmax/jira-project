'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').service('quicktech.common.services.UserConfirmationsService',
    ['$uibModal', '$state',
      function ($uibModal, $state) {

        var modalParams = {
          animation: true,
          backdrop: 'static',
          keyboard: false,
          size: 'custom-size-confirmation-pop-up',
          windowClass: 'modal-spam',
          templateUrl: '/common/assets/templates/user-confirmations.tpl.html'
        };

        this.preventMessage = 'Do you want to leave this page? All entered information will be lost.';

        this.show = function (message, button, hideCancel, btnCancel) {

          modalParams.controller = (['$scope', '$uibModalInstance',
            function ($scope, $uibModalInstance) {

              $scope.messageConfirm = message;
              $scope.buttonConfirm = button;
              $scope.hideCancel = hideCancel;
              $scope.btnCancel = 'No';
              if(btnCancel) {
                $scope.btnCancel = btnCancel;
              }

              $scope.approveConfirm = function (result) {
                $uibModalInstance.close(result);
              };

              $scope.cancelConfirm = function () {
                $uibModalInstance.dismiss();
              };

            }]);

          return $uibModal.open(modalParams).result;
        };

        this.preventLocationChange = function ($scope, condition) {
          var preventLocationChange = true,
            self = this;

          $scope.$on('$stateChangeStart', function (event, toState, toParams) {
            var isNeedToPrevent = true;
            if (condition) {
              isNeedToPrevent = $scope.$eval(condition);
            }
            if (preventLocationChange && !$scope.disablePreventingLocationChange && isNeedToPrevent) {
              event.preventDefault();

              self.show(self.preventMessage, 'OK').then(function () {
                preventLocationChange = false;
                $state.go(toState.name, toParams);
              });
            }
          });
        };

      }]);

})(window, jQuery);


