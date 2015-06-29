'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('navigationBar',
    ['$timeout', function ($timeout) {

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var wrapperSelector = element.attr('navigation-bar'),
            wrapperOffset = 0,
            activeNav = element.find('[navigate-to]:first').addClass('active');

          if (wrapperSelector) {
            wrapperOffset = $(wrapperSelector).offset().top;
          }

          element.on('click', '[navigate-to]', function (e) {
            var target = $(e.currentTarget),
              selector = target.attr('navigate-to');

            $(window).off('scroll');

            $('html, body').animate({
              scrollTop: $(selector).offset().top - wrapperOffset
            }, 500, undefined, function () {
              $timeout(listenScroll);
            });

            activeNav.removeClass('active');
            target.addClass('active');
            activeNav = target;
          });

          var listenScroll = function () {
            $(window).on('scroll', function () {
              var topPoint = $(activeNav.attr('navigate-to')).offset().top - wrapperOffset + 1,
                nextNav = activeNav.next(),
                bottomPoint = nextNav.length > 0 ? $(nextNav.attr('navigate-to')).offset().top - wrapperOffset : undefined,
                newActive;

              if (window.scrollY < topPoint) {
                newActive = activeNav.prev();
              } else if (nextNav.length > 0 && window.scrollY > bottomPoint) {
                newActive = nextNav;
              }

              if (newActive && newActive.length > 0) {
                activeNav.removeClass('active');
                newActive.addClass('active');
                activeNav = newActive;
              }
            });
          };

          scope.$on('$destroy', function () {
            $(window).off('scroll');
          });
        }
      }
    }]);
})();
