'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtTypeaheadStyler',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var initiator = element.parent().find('[aria-owns=' + attrs.id + ']');
          var customStyle = initiator.attr('custom-style');

          if (customStyle) {
            var style = scope.$eval(customStyle);
              element.css(style);
          }
        }
      }
    }]);
})();
