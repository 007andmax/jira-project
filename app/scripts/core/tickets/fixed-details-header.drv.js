'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketFixedHeader', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {

        var doc = jQuery(document);

        angular.element(document).bind('scroll', function () {
          if (doc.scrollTop() > 100) {
            element.addClass('ticket-fixed-header')
          } else {
            element.removeClass('ticket-fixed-header');
          }
        });

      }
    };
  });

})();
