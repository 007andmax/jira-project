'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtCustomPopoverTemplate',
    ['$templateRequest', '$compile', '$document', function ($templateRequest, $compile, $document) {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
          var template, popover, popoverShown,
            newScope = $scope.$new(),
            trigger = $("[qt-popover-trigger]");

          $element.css('position', 'relative');

          $templateRequest($attrs.qtCustomPopoverTemplate).then(function (resp) {
            template = angular.copy(resp);
            createPopover();
          });

          trigger.on('click', togglePopover);

          newScope.hidePopover = function () {
            popoverShown = false;
            popover.hide();
          };

          function togglePopover(e) {
            if (!$element[0].hasAttribute('disabled')) {
              if (popoverShown) {
                newScope.hidePopover();
              } else {
                popoverShown = true;
                popover.show();
                calcPosition($attrs.qtPopoverPosition);
              }

              e.stopPropagation();
            }
          }

          var unbind = newScope.$on('$destroy', function () {
            $document.off('keydown', closeIfEscape);
            trigger.off('click', togglePopover);
            $document.off('click', hideOnOutsideClick);
            unbind();
          });

          function createPopover() {
            $compile(template)(newScope, function (compiledHtml) {
              $element.append(compiledHtml);
              popover = compiledHtml;

              $document.on('keydown', closeIfEscape);
              $document.on('click', hideOnOutsideClick);

              popover.addClass('popover');
              popover.css({
                position: 'absolute',
                width: 'auto',
                padding: '15px 25px',
                'z-index': 1001
              });
              calcPosition($attrs.qtPopoverPosition);

              popover.hide();
            });
          }

          function calcPosition(position) {
            var left, top;

            if (position === 'top') {

              left = -popover.outerWidth() / 2 + trigger.outerWidth() / 2;
              top = -(popover.outerHeight() + 10);
              popover.attr('style', popover.attr('style') + ' top: ' + top + 'px !important;' + ' left: ' + left + 'px !important;');

            } else if (position === 'bottom') {

              left = -popover.outerWidth() / 2 + trigger.outerWidth() / 2;
              top = trigger.outerHeight() + 10;
              popover.attr('style', popover.attr('style') + ' top: ' + top + 'px !important;' + ' left: ' + left + 'px !important;');

            }
          }

          function hideOnOutsideClick(e) {
            var isInside = e.target === $element[0] || angular.element(e.target).closest($element);

            if (!isInside.length) {
              newScope.hidePopover();
            }
          }

          function closeIfEscape(e) {
            if (e.which === 27 || e.keyCode === 27) {
              newScope.hidePopover();
            }
          }

        }
      };
    }]);

})();
