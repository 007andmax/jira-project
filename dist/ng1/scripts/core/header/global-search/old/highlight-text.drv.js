'use strict';

(function () {

  angular.module("quicktech").directive('highlightText',
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {

          var unwatch = $attrs.$observe('substring', function (value) {
            if (value) {
              highlightText(value);
            }
          });

          var unbind = $scope.$on('$destroy', function () {
            unwatch();
            unbind();
          });

          function highlightText(value) {
            var text = $attrs.highlightText,
              regExp = new RegExp(value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), 'gi');

            $element.html(text.replace(regExp, function (str) {
              return '<strong>' + str + '</strong>';
            }));
          }

        }
      }
    }]);
})();
