'use strict';

(function () {

  angular.module("quicktech.core.products").directive('showModelElement',
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

          $scope.$on(attrs.showModelElement, function () {
            var $body = $("body"),
              offset = parseInt(attrs.scrollOffset) || window.innerHeight / 2,
              scrollPosition = element.offset().top - offset;

            $body.animate({scrollTop: scrollPosition}, "slow");

            var background = element.css('background');

            element.css({background: '#f0fafb'});

            //TODO add animation
            setTimeout(function () {
              element.css({background: background});
            }, 3000)
          });
        }
      }
    }]);
})();
