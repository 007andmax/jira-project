'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtToggleSlider',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          setTimeout(function() {
            var target = element.find('[qt-ts-toggler]').length ? element.find('[qt-ts-toggler]') : element;

            var icon = element.find('[qt-icon-toggle-to-change]');

            function changeIconClass(){
              if(icon.hasClass('expand-down')){
                icon.removeClass('expand-down');
                icon.addClass('expand-up');
              } else {
                icon.removeClass('expand-up');
                icon.addClass('expand-down');
              }
            }

            icon.click(function () {
              changeIconClass();
              element.toggleClass("expanded");
              element.find('[qt-ts-slider]').slideToggle('fast');
            })
          }, 0)


        }
      }
    }]);
})();
