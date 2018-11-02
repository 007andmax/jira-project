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

              $scope.closeModal = function() {
                $uibModalInstance.dismiss();
              }

            }]);

          return $uibModal.open(modalParams).result;
        };


      }]);

})(window, jQuery);
