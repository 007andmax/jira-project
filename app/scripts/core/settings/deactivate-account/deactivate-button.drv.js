'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("deactivateButton",
    ['UsersService', '$modal',
      function (UsersService, $modal) {
        return {
          restrict: 'A',
          link: function (scope, element) {

            element.click(function () {
              $modal.open({
                templateUrl: '/html/scripts/core/settings/deactivate-account/deactivate-account.tpl.html',
                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                  $scope.modalData = { note: '' };
                  $scope.dismiss = $modalInstance.dismiss;
                  $scope.confirm = function () {
                    $modalInstance.close($scope.modalData.note);
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
