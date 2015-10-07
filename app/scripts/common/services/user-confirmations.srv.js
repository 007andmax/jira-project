'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').service('quicktech.common.services.UserConfirmationsService',
    ['$modal',
      function ($modal) {

        var modalConfirmWindow = "" +
          "<div class='modal-body' style='padding: 5px 30px;padding-top: 26px;'>" +
          " <p>{{ messageConfirm }}</p>" +
          "</div>" +
          "<div class='modal-footer' style='border-top: none;padding: 19px 30px 30px;'>" +
          " <button type='button' class='btn btn-gray' data-dismiss='modal' ng-click=cancelConfirm()>Cancel</button>" +
          " <button type='button' class='btn btn-scooter' ng-click=approveConfirm()>{{ buttonConfirm }}</button>" +
          "</div>";

        var modalParams = {
          animation: true,
          backdrop: 'static',
          size: 'custom-size-confirmation-pop-up',
          template: modalConfirmWindow
        };

        this.show = function (message, button) {

          modalParams.controller = (['$scope', '$modalInstance',
            function ($scope, $modalInstance) {

              $scope.messageConfirm = message;
              $scope.buttonConfirm = button;

              $scope.approveConfirm = function (result) {
                $modalInstance.close(result);
              };

              $scope.cancelConfirm = function () {
                $modalInstance.dismiss('cancel');
              };

            }]);

          return $modal.open(modalParams).result;
        };

      }]);

})(window, jQuery);


