'use strict';

(function () {

  angular.module("quicktech").directive("createNewEntity",
    ['$uibModal', '$rootScope', function ($uibModal, $rootScope) {
      return {
        restrict: 'A',
        scope: {
          item: '=?'
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

            $rootScope.$broadcast('createNewEntity', attrs.createNewEntity);

            if (!angular.element(document).find('.create-popup.modal-create-ticket').length) {
              var modalInstance = $uibModal.open({
                templateUrl: '/html/scripts/core/header/create-new-entity/create-new-entity.tpl.html',
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
                  resolvedExistedItem: existingItem
                }
              });

              modalInstance.opened.then(function () {
                $('body').addClass('non-body-scroll');
              });

              modalInstance.result.finally(function () {
                $('body').removeClass('non-body-scroll');
              });
            }

            $scope.$apply();

          });
        }
      }
    }]);
})();
