'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("createTicketOpenModal",
    ['$modal', function ($modal) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

          element.click(function () {

            var modalInstance = $modal.open({
              templateUrl: '/html/scripts/core/tickets/create/create-ticket.tpl.html',
              controller: 'quicktech.core.tickets.createTicketCtrl',
              windowClass: 'modal-create-ticket',
              backdrop: 'static',
              animation: true,
              resolve: {
                sessionId: false,
                sessionTime: false,
                companyId: function () {
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
