'use strict';

(function () {

  angular.module("quicktech.core.passwordManager").directive("openPasswordModal",
    ['$uibModal', 'quicktech.common.services.PermissionsService', function ($uibModal, PermissionsService) {
      return {
        restrict: 'A',
        scope: {
          item: '=?openPasswordModal',
          company: '=?companyForPasswordModal',
        },
        link: function ($scope, element, attrs) {
          var existingItem = false;
          var presetupCompany = false;
          if ($scope.item || attrs.item) {
            existingItem = function () { return $scope.item; };
          }

          if($scope.company || attrs.company) {
            presetupCompany = function () { return $scope.company; };
          }

          element.click(function () {

            if (element.hasClass('disabled') || typeof element.attr('disabled') === 'string') {
              return;
            }


            var modalInstance = $uibModal.open({
              templateUrl: '/html/scripts/core/password-manager/modal/password-modal.tpl.html',
              controller: 'quicktech.core.passwordManager.passwordModalCtrl',
              windowClass: 'modal-password-manager',
              backdrop: 'static',
              animation: true,
              resolve: {
                resolvedExistedItem: existingItem,
                presetupCompany: presetupCompany,
                isEditable: function () {
                  return PermissionsService.isAllowed('EDIT_PASSWORD')
                }
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
