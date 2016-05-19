'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("createTicketOpenModal",
    ['$state', '$modal',
      function ($state, $modal) {
        return {
          restrict: 'A',
          link: function ($scope, element) {

            element.click(function () {

              if (!($state.is('tickets') || $state.is('tickets.details'))) {
                $state.go('tickets', {listType: 'user'});
              }

              var modalInstance = $modal.open({
                templateUrl: '/html/scripts/core/tickets/create/create-ticket.tpl.html',
                controller: 'quicktech.core.tickets.createTicketCtrl',
                windowClass: 'modal-create-ticket',
                backdrop: 'static',
                animation: true,
                resolve: {
                  sessionId: false,
                  sessionTime: false
                }
              });

              modalInstance.opened.then(function () {
                $('body').addClass('non-body-scroll');
              });

              modalInstance.result.finally(function () {
                $('body').addClass('non-body-scroll');
              });

            });
          }
        }
      }]);
})();
