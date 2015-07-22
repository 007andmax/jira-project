'use strict';

(function () {

  angular.module("quicktech.core.products").directive('productsToggleSlider',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          scope.$on(attrs.productsToggleSlider, function () {
            element.toggleClass("opened");
            element.find('[products-ts-slider]').slideToggle('fast');
          });
        }
      }
    }]);
})();
