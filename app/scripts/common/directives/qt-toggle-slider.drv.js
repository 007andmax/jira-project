'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtToggleSlider',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var target = element.find('[qt-ts-toggler]').length ? element.find('[qt-ts-toggler]') : element;

          target.click(function () {
            element.toggleClass("expanded");
            element.find('[qt-ts-slider]').slideToggle('fast');
          })
        }
      }
    }]);
})();
