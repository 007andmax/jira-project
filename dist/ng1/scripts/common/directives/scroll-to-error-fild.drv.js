'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('scrollToErrorFild',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        scope: {},
        link: function (scope) {

          scope.$on('scrollToErrorFild', function () {

            $timeout(function () {
              var errors = $(".has-error");
              if (errors.length === 0) {
                throw "Can't find error fields";
              }
              $('html, body').animate({scrollTop: errors.offset().top - 200}, 500);
            }, 0)

          });

        }
      }
    }]);
})();
