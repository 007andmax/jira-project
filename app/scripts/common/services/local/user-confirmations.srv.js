'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').service('quicktech.common.services.UserConfirmationsService',
    ['$modal',
      function ($modal) {

        var modalParams = {
          animation: true,
          backdrop: 'static',
          keyboard: false,
          size: 'custom-size-confirmation-pop-up',
          windowClass: 'modal-spam',
          templateUrl: '/commonHtml/assets/templates/user-confirmations.tpl.html'
        };

        this.show = function (message, button, hideCancel) {

          modalParams.controller = (['$scope', '$modalInstance',
            function ($scope, $modalInstance) {

              $scope.messageConfirm = message;
              $scope.buttonConfirm = button;
              $scope.hideCancel = hideCancel;

              $scope.approveConfirm = function (result) {
                $modalInstance.close(result);
              };

              $scope.cancelConfirm = function () {
                $modalInstance.dismiss();
              };

            }]);

          return $modal.open(modalParams).result;
        };

      }]);

})(window, jQuery);


