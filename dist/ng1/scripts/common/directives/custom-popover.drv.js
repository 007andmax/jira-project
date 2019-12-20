'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("customPopover",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          if ((attrs.customPopoverContent === undefined) || !attrs.customPopoverPlacement) {
            throw 'Required custom-popover-content and custom-popover-placement attrs'
          }

          scope.$watch(function () {
            return attrs.customPopoverContent
          }, initPopover);

          var isFirstShowing = true;

          function initPopover() {

            if (attrs.customPopoverContent === '') {
              return
            }

            element.popover("destroy");

            element.popover({
              content: attrs.customPopoverContent,
              placement: attrs.customPopoverPlacement,
              trigger: 'hover',
              container: 'body'
            });

            element.on('show.bs.popover', function () {

              $timeout(function () {
                var popover = $('.popover');
                popover.addClass('description-popover');

                if (isFirstShowing) {
                  var leftPosition = parseInt(popover.css('left'));
                  popover.css({'left': leftPosition + +attrs.customPopoverFirstLeft + 'px'});
                  isFirstShowing = false;
                }
              }, 0);
            });

            element.on('hidden.bs.popover', function () {
              var popover = $('.popover');
              popover.removeClass('description-popover');
            })

          }

        }
      }
    }]);
})();

