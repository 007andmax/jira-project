'use strict';

(function () {

  angular.module("quicktech.core.users").directive('trimmedTooltip', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var tooltipConteiner = element.find('[trimmed-tooltip-container]');
        scope.isShowTooltip = scope.isShowTooltip || [];
        scope.isShowTooltip[attrs.trimmedTooltip] = function () {
          return element.width() < tooltipConteiner.width();
        }

      }
    }
  });
})();
