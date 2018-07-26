'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtCustomPopoverTemplate',
    ['$templateRequest', '$compile', '$document', '$timeout', '$rootScope', function ($templateRequest, $compile, $document, $timeout, $rootScope) {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
          var template, popover, popoverShown, promise,
            $body = angular.element(document.body),
            newScope = $scope.$new(),
            trigger = $element.find('[qt-popover-trigger]'),
            toggleTrigger = trigger.attr('qt-popover-trigger') || 'click',
            isAppendToBody = typeof $attrs.qtPopoverAppendToBody === 'string';

          $element.css('position', 'relative');

          $templateRequest($attrs.qtCustomPopoverTemplate).then(function (resp) {
            template = angular.copy(resp);
            createPopover();
          });

          if (toggleTrigger === 'click') {
            trigger.on(toggleTrigger, togglePopover);
          } else if (toggleTrigger === 'mouseenter') {
            trigger.on(toggleTrigger, openPopover);
          }

          newScope.hidePopover = function () {
            popoverShown = false;
            popover.hide();
          };

          newScope.forceShowPopover = function () {
            popoverShown = true;
            popover.show();
            calcPosition($attrs.qtPopoverPosition);
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
            }
          }

          function openPopover(e) {
            if (!$element[0].hasAttribute('disabled')) {
              if (!popoverShown) {
                popoverShown = true;
                popover.show();
                calcPosition($attrs.qtPopoverPosition);
              }
            }
          }

          var unbind = newScope.$on('$destroy', function () {
            if (toggleTrigger === 'click') {
              trigger.on(toggleTrigger, togglePopover);
            } else if (toggleTrigger === 'mouseenter') {
              trigger.on(toggleTrigger, openPopover);
            }

            if (toggleTrigger === 'click') {
              $document.off('keydown', closeIfEscape);
              $document.off('click', hideOnOutsideClick);
            } else if (toggleTrigger === 'mouseenter') {
              $element.on('mouseleave', hideOnMouseLeave);
            }

            unbind();
          });

          function createPopover() {
            $compile(template)(newScope, function (compiledHtml) {
              if (isAppendToBody) {
                $body.append(compiledHtml);
              } else {
                $element.append(compiledHtml);
              }
              popover = compiledHtml;

              if (toggleTrigger === 'click') {
                $document.on('keydown', closeIfEscape);
                $document.on('click', hideOnOutsideClick);
              } else if (toggleTrigger === 'mouseenter') {
                $element.on('mouseleave', hideOnMouseLeave);
              }

              popover.addClass('popover');
              popover.css({
                position: 'absolute',
                width: 'auto',
                padding: '15px 25px',
                'z-index': $attrs.zIndex || 1001,
              });
              calcPosition($attrs.qtPopoverPosition);

              popover.hide();
            });
          }

          function calcPosition(position) {
            var left, top;

            if (position === 'top' || !position) {
              left = -popover.outerWidth() / 2 + trigger.outerWidth() / 2;
              top = -(popover.outerHeight() + 10);
            } else if (position === 'bottom') {
              left = -popover.outerWidth() / 2 + trigger.outerWidth() / 2;
              top = trigger.outerHeight() + 10;
            } else if (position === 'right') {
              left = trigger.outerWidth() + 10;
              top = trigger.outerHeight() / 2 - popover.outerHeight() / 2;
            } else if (position === 'right-bottom-align') {
              left = trigger.outerWidth() + 10;
              top = trigger.outerHeight() - popover.outerHeight();
            } else if (position === 'bottom-left-align') {
              left = 0;
              top = trigger.outerHeight() + 10;
            } else if (position === 'bottom-left-align-dashboard') {
              left = 'calc(50% - 125px) !important;';

              if ($attrs.openedFromList) {
                left = 'calc(50% - 211px) !important;';
              }
              top = trigger.outerHeight() + 10;
            }else if (position === 'bottom-right-align') {
              left = -popover.outerWidth() + trigger.outerWidth();
              top = trigger.outerHeight() + 10;
            }

            if (isAppendToBody) {
              var offset = trigger.offset();
              top += offset.top;
              left += offset.left
            }

            var attributesForLeftStyle = (position === 'bottom-left-align-dashboard') ? '' : 'px !important;';

            popover.attr('style', popover.attr('style') + ' top: ' + top + 'px !important;' + ' left: ' + left + attributesForLeftStyle);
          }

          function hideOnOutsideClick(e) {
            var targetElement = angular.element(e.target);
            var isInside = e.target === $element[0] || targetElement.parent().hasClass('uib-typeahead-match');

            if (!isInside && !targetElement.closest($element).length) {
              newScope.hidePopover();
            }
          }

          function hideOnMouseLeave() {
            if (promise) {
              $timeout.cancel(promise);
            }

            promise = $timeout(function () {
              newScope.hidePopover();
              popover.off('mouseenter', cancelHiding)
            }, 200);
            popover.on('mouseenter', cancelHiding);
          }

          function cancelHiding(e) {
            var isInside = e.target === popover[0] || angular.element(e.target).closest(popover);

            if (promise && isInside) {
              $timeout.cancel(promise);
            }
            popover.off('mouseenter', cancelHiding);
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
