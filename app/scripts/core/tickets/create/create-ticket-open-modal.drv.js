'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("createTicketOpenModal",
    ['$state', '$modal',
      function ($state, $modal) {
        return {
          restrict: 'A',
          link: function ($scope, element, attrs) {

            element.click(function () {

              if (!$state.is('tickets') || $state.is('ickets.Detail')) {
                $state.go('tickets', {listType: 'user'});
              }

              var modalInstance = $modal.open({
                templateUrl: '/html/scripts/core/tickets/create/create-ticket.tpl.html',
                controller: 'quicktech.core.tickets.createTicketCtrl',
                windowClass: 'modal-create-ticket'
              });
            });
          }
        }
      }]);
})();
