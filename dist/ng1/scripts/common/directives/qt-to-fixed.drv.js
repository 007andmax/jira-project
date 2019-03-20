'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtToFixed',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var focused;

          var unwatch = scope.$watch(function () {
            return element.val();
          }, function (val) {
            if (val && !focused) {
              element.val(parseFloat(val).toFixed(parseInt(attrs.qtToFixed)));

            }

          });
          element.on('focus', function() {
            focused = true;
          })
          element.on('blur', function() {
            focused = false;
            formatNumber();
          });
          scope.$on('addFloatPartOfNumber', formatNumber);

          function formatNumber() {
            $timeout(function () {
              var val = element.val();
              if (val) {
                element.val(parseFloat(val).toFixed(parseInt(attrs.qtToFixed)));
              }
            });
          }
        }
      }
    }]);
})();
