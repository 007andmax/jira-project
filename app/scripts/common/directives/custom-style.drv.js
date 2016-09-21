'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('customStyle',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var customStyle = attrs.customStyle;

          if (customStyle) {
            var style = scope.$eval(customStyle);

            $timeout(function () {
              element.siblings('[uib-typeahead-popup].dropdown-menu').css(style);
            });
          }
        }
      }
    }]);
})();
