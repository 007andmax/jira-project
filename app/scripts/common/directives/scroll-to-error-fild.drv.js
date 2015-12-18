'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('scrollToErrorFild',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        scope:{},
        link: function (scope) {

          scope.$on('scrollToErrorFild', function(){

            $timeout(function(){
              $('html, body').animate({ scrollTop: $(".has-error").offset().top - 200 }, 500);
            }, 0)

          });

        }
      }
    }]);
})();
