'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('showTicketDetails',
      function () {
        return {
          restrict: 'A',
          link: function (scope, element) {

            var body = $('body');

            element.hide();
            body.addClass('opened-ticket');

            scope.$on('ticketDetailsLoad', function(){
              element.fadeIn();
            });

            scope.$on('$destroy', function () {
              body.removeClass('opened-ticket');
            });

          }
        };
      });

})();

