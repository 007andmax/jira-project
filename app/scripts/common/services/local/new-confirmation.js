'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').service('quicktech.common.services.NewConfirmationsService',
    ['$uibModal', '$state',
      function ($uibModal, $state) {

        var modalParams = {
          animation: true,
          backdrop: 'static',
          keyboard: false,
          size: 'custom-size-confirmation-pop-up',
          windowClass: 'modal-spam',
          templateUrl: '/html/scripts/core/settings/commissions/commission-confirmation.html'
        };

        this.show = function (message, button, approveFn, rejectFn, closeFn) {

          modalParams.controller = (['$scope', '$uibModalInstance',
            function ($scope, $uibModalInstance) {

              $scope.messageConfirm = message;
              $scope.buttonConfirm = button;

              $scope.btnCancel = 'No';


              $scope.approveConfirm = function (result) {
                approveFn()
                $uibModalInstance.close(result);
              };

              $scope.cancelConfirm = function () {
                rejectFn();
                $uibModalInstance.dismiss();
              };

              $scope.closeModal = function() {
                if (closeFn) closeFn();
                $uibModalInstance.dismiss();
              }

            }]);

          return $uibModal.open(modalParams).result;
        };


      }]);

})(window, jQuery);
