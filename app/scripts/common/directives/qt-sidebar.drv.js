'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtSidebar',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var windowWidth;

          $timeout(initLeftPanel, 420);

          $(window).on('resize', initLeftPanel);
          $(element).on('click', function () {
            $timeout(initLeftPanel, 420);
          });

          function initLeftPanel() {

            windowWidth = window.innerWidth;

            if (windowWidth > 1389) {

              element.addClass('opened');
              element.css("box-shadow", "none");

              element.find('.qt-sidebar-scroll').nanoScroller();

            } else {
              element.removeClass('opened');
            }
          }

          element.hover(function () {
            if (!(windowWidth > 1389)) {
              element.addClass('opened');
              element.find('.qt-sidebar-scroll').nanoScroller();
            }
          }, function () {
            if (!(windowWidth > 1389)) {
              element.removeClass('opened');
            }
          })

        }
      }
    }]);
})();
