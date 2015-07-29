'use strict';

(function () {

  angular.module("quicktech.core.products").directive('eventToggleSlider',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          scope.$on(attrs.eventToggleSlider, function () {
            element.toggleClass("opened");
            element.find('[ets-slider]').slideToggle('fast');
          });
        }
      }
    }]);
})();
