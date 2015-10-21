'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('ticketFixedHeader', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {

        var header = element.find('[fixed-header]'),
          scrollElement = element.find('[scroll-pane]'),
          tfhEmptySpace = element.find('[tfh-empty-space]'),
          scrollPane = scrollElement.data('jsp');

        angular.element(element).bind('scroll', function () {

          if (scrollPane.getContentPositionY() > 90) {

            header.addClass('ticket-fixed-header');
            tfhEmptySpace.show();

          } else {

            header.removeClass('ticket-fixed-header');
            tfhEmptySpace.hide();
          }
        });
      }
    };
  });

})();
