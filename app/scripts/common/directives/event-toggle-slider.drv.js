'use strict';

(function () {

  angular.module("quicktech.core.products").directive('eventToggleSlider',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          if (attrs.eventToggleSlider) {
            scope.$on(attrs.eventToggleSlider, function () {
              element.toggleClass("expanded");
              element.find('[ets-slider]').slideToggle('fast');
            });
          } else {
            scope.$on(attrs.showEvent, function () {
              element.addClass("expanded");
              element.find('[ets-slider]').slideDown('fast');
            });
            scope.$on(attrs.hideEvent, function () {
              element.removeClass("expanded");
              element.find('[ets-slider]').slideUp('fast');
            });
          }
        }
      }
    }]);
})();
