'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtToggleSlider',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.find('[qt-ts-toggler]').click(function () {
            element.toggleClass("expanded");
            element.find('[qt-ts-slider]').slideToggle('fast');
          })
        }
      }
    }]);
})();
