'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtSidebar',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element) {

          var windowWidth;

          $timeout(initLeftPanel, 420);

          $(window).on('resize', initLeftPanel);
          $(element).on('click', function () {
            $timeout(function(){
              element.find('.qt-sidebar-scroll').nanoScroller();
            }, 420);
          });

          function initLeftPanel() {

            windowWidth = window.innerWidth;

            if (windowWidth > 1389) {
              openLeftPanel();
            } else {
              closeLeftPanel();
            }
          }

          element.hover(function () {
            if (!(windowWidth > 1389)) {
              openLeftPanel();
            }
          }, function () {
            if (!(windowWidth > 1389)) {
              closeLeftPanel();
            }
          });

          function openLeftPanel(){
            $timeout(function(){
              scope.isLeftPanelOpen = true;
            }, 300);

            // element.addClass('opened');
            element.css("box-shadow", "none");
            element.find('.qt-sidebar-scroll').nanoScroller();
          }

          function closeLeftPanel(){
            scope.isLeftPanelOpen = false;
            // element.removeClass('opened');
          }

        }
      }
    }]);
})();
