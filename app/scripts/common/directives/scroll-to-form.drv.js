'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('scrollToForm',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.on('click', function () {
            $("body").animate({scrollTop: element.offset().top}, "slow");
          })
        }
      }
    }]);
})();
