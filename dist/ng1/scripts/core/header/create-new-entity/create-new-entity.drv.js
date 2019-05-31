'use strict';

(function () {

  angular.module("quicktech").directive("createNewEntity",
    ['$uibModal', '$rootScope', function ($uibModal, $rootScope) {
      return {
        restrict: 'A',
        scope: {
          item: '=?',
          categoryForModal: '=?',
          isEdit: '<isEdit',
          isMobileEdit: '<isMobileEdit'
        },
        link: function ($scope, element, attrs) {
          var existingItem = false;
          var existingCategory = false;
          if ($scope.item || attrs.item) {
            existingItem = function () {
              return $scope.item;
            };
          }

          if($scope.categoryForModal || attrs.categoryForModal) {
            existingCategory = function() {
              return $scope.categoryForModal;
            }
          }

          element.click(function () {

            if (element.hasClass('disabled')) {
              return;
            } else {
              element.addClass('disabled');
            }

            $rootScope.$broadcast('createNewEntity', attrs.createNewEntity);

            if (!angular.element(document).find('.create-popup.modal-create-ticket').length) {
              var modalInstance = $uibModal.open({
                templateUrl: '/ng1/scripts/core/header/create-new-entity/create-new-entity.tpl.html',
                controller: 'createNewEntityCtrl',
                windowClass: 'create-popup modal-create-ticket',
                backdrop: true,
                animation: true,
                resolve: {
                  sessionId: false,
                  sessionTime: false,
                  resolvedDeviceId: false,
                  resolvedCompanyId: function () {
                    return attrs.companyId;
                  },
                  resolvedUserId: function () {
                    return attrs.userId;
                  },
                  resolvedOpenedTab: function () {
                    return attrs.createNewEntity;
                  },
                  resolvedExistedItem: existingItem,
                  resolveExistingCategory: existingCategory,
                  resolvedAdvanced: function() {
                    return $scope.isEdit ? true : false
                  },
                  isMobileEdit: function() {
                    return $scope.isMobileEdit ? true : false
                  }
                }
              });

              modalInstance.opened.then(function () {
                $('body').addClass('non-body-scroll');
                element.removeClass('disabled');
              });

              modalInstance.result.finally(function () {
                $scope.$emit('updateCompanyTags');
                $('body').removeClass('non-body-scroll');
              });
            }

            $scope.$apply();

          });
        }
      }
    }]);
})();
