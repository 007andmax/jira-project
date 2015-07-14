'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("createTicketOpenModal",
    ['$state', '$modal',
      function ($state, $modal) {
        return {
          restrict: 'A',
          link: function ($scope, element, attrs) {

            element.click(function () {

              if (!$state.is('Tickets') || $state.is('Tickets.Detail')) {
                $state.go('Tickets', {listType: 'user'});
              }

              var modalInstance = $modal.open({
                animation: false,
                backdrop: 'static',
                templateUrl: '/html/scripts/core/tickets/create-ticket.tpl.html',
                controller: 'quicktech.core.tickets.createTicketCtrl'
              });
            });
          }
        }
      }]);
})();
