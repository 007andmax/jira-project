'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("createTicketOpenModal",
    ['$uibModal', function ($uibModal) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

          element.click(function () {

            var modalInstance = $uibModal.open({
              templateUrl: '/html/scripts/core/tickets/create/create-ticket.tpl.html',
              controller: 'quicktech.core.tickets.createTicketCtrl',
              windowClass: 'modal-create-ticket',
              backdrop: 'static',
              animation: true,
              resolve: {
                sessionId: false,
                sessionTime: false,
                fromRemoteDeviceId: false,
                fromRemoteCompanyId: function () {
                  return attrs.createTicketOpenModal;
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
