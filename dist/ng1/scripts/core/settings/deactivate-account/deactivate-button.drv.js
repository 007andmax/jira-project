'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("deactivateButton",
    ['UsersService', '$uibModal',
      function (UsersService, $uibModal) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            element.click(function () {
              $uibModal.open({
                templateUrl: '/ng1/scripts/core/settings/deactivate-account/deactivate-account.tpl.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                  $scope.modalData = { note: '' };
                  $scope.dismiss = $uibModalInstance.dismiss;
                  $scope.confirm = function () {
                    $uibModalInstance.close($scope.modalData.note);
                  };
                }],
                keyboard: false,
                size: 'custom-size-confirmation-pop-up',
                windowClass: 'modal-spam',
                backdrop: 'static',
                animation: true

              }).result.then(function (note) {
                UsersService.deactivateAccount(note);
              });

            })

          }
        }
      }]);
})();
