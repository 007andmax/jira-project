'use strict';

(function () {

  angular.module("quicktech.core.passwordManager").directive("openPasswordModal",
    ['$uibModal', function ($uibModal) {
      return {
        restrict: 'A',
        scope: {
          item: '=?openPasswordModal'
        },
        link: function ($scope, element, attrs) {
          var existingItem = false;
          if ($scope.item || attrs.item) {
            existingItem = function () { return $scope.item; };
          }

          element.click(function () {

            if (element.hasClass('disabled')) {
              return;
            }

            var modalInstance = $uibModal.open({
              templateUrl: '/html/scripts/core/password-manager/modal/password-modal.tpl.html',
              controller: 'quicktech.core.passwordManager.passwordModalCtrl',
              windowClass: 'modal-password-manager',
              backdrop: 'static',
              animation: true,
              resolve: {
                resolvedExistedItem: existingItem
              }
            });

            modalInstance.opened.then(function () {
              $('body').addClass('non-body-scroll');
            });

            modalInstance.result.finally(function () {
              $('body').removeClass('non-body-scroll');
            });

          });
        }
      }
    }]);
})();
