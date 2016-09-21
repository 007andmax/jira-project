'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').service('quicktech.common.services.UserConfirmationsService',
    ['$uibModal',
      function ($uibModal) {

        var modalParams = {
          animation: true,
          backdrop: 'static',
          keyboard: false,
          size: 'custom-size-confirmation-pop-up',
          windowClass: 'modal-spam',
          templateUrl: '/commonHtml/assets/templates/user-confirmations.tpl.html'
        };

        this.show = function (message, button, hideCancel) {

          modalParams.controller = (['$scope', '$uibModalInstance',
            function ($scope, $uibModalInstance) {

              $scope.messageConfirm = message;
              $scope.buttonConfirm = button;
              $scope.hideCancel = hideCancel;

              $scope.approveConfirm = function (result) {
                $uibModalInstance.close(result);
              };

              $scope.cancelConfirm = function () {
                $uibModalInstance.dismiss();
              };

            }]);

          return $uibModal.open(modalParams).result;
        };

      }]);

})(window, jQuery);


