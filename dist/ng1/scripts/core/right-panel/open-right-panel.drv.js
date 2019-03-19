'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").directive('openRightPanel',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var rightPanel = $('#right'),
            navigation = element.find('[orp-navigation]');

          initScroll();

          navigation.on('click', openRightPanel);

          scope.getTooltipPlacemant = function(){

            if (rightPanel.hasClass('collapsed')) {
              if ($(window).width() > 1315) {
                return "top";
              } else {
                return "left";
              }
            }
            return "top";
          };

          function openRightPanel() {

            $(".tooltip").hide();

            if (rightPanel.hasClass('collapsed')) {
              rightPanel.removeClass('collapsed');
            }

            initScroll();
          }

          function initScroll(){
            $timeout(function(){
              rightPanel.nanoScroller();
            }, 0)
          }

        }
      }
    }]);
})();
