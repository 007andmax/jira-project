'use strict';

(function () {

  angular.module("quicktech.core.users").directive('trimmedTooltip',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element) {

          var tooltipConteiner = element.find('[trimmed-tooltip-container]');

          scope.isShowTooltip = function(){
            return tooltipConteiner[0].offsetWidth < tooltipConteiner[0].scrollWidth;
          }

        }
      }
    }]);
})();
