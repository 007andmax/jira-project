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

          navigateTo(0);

          if (wrapperSelector) {
            wrapperOffset = $(wrapperSelector).offset().top;
          } else {
            wrapperOffset = 78; //header height
          }

          function navigateTo(scrollTop) {
            $(window).off('scroll.' + scope.$id);

            $('html, body').animate({
              scrollTop: scrollTop
            }, 500, undefined, function () {
              $timeout(listenScroll);
            });
          }

          element.on('click', '[navigate-to]', function (e) {
            var target = $(e.currentTarget),
              selector = target.attr('navigate-to');

            navigateTo($(selector).offset().top - wrapperOffset + 5);

            activeNav.removeClass('active');
            target.addClass('active');
            activeNav = target;
          });

          var listenScroll = function () {
            $(window).on('scroll.' + scope.$id, function () {

              if (activeNav.hasClass('notification-heading')) {
                activeNav = activeNav.prev();
                activeNav.addClass('active');
              }

              if (activeNav.hasClass('notification-heading')) {
                activeNav = activeNav.prev();
                activeNav.addClass('active');
              }

              if (!$(activeNav.attr('navigate-to')).offset()) {
                return;
              }

              var topPoint = $(activeNav.attr('navigate-to')).offset().top - wrapperOffset + 1,
                nextNav = activeNav.next();

              if (nextNav.hasClass('notification-heading')) {
                nextNav = nextNav.next();
              }

              var bottomPoint = nextNav.length > 0 ? $(nextNav.attr('navigate-to')).offset().top - wrapperOffset : undefined,
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

          listenScroll();

          scope.$on('$destroy', function () {
            $(window).off('scroll.' + scope.$id);
          });
        }
      }
    }]);
})();
