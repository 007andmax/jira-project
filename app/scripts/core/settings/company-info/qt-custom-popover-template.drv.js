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
            if (popoverShown) {
              newScope.hidePopover();
            } else {
              popoverShown = true;
              popover.show();
            }

            e.stopPropagation();
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

              var triggerHeight = +trigger.css('height').replace('px', ''),
                left = -popover.css('width').replace('px', '') / 2 + +trigger.css('width').replace('px', '') + 30,
                top = -triggerHeight - popover.css('height').replace('px', '') + 5;

              popover.css({
                display: 'block',
                position: 'absolute',
                width: 'auto',
                padding: '15px 25px',
                top: top + 'px'
              });

              popover.attr('style', popover.attr('style') + ' left: ' + left + 'px !important;');

              popover.hide();
            });
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
