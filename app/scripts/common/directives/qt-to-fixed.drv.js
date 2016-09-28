'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtToFixed',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          var unwatch = scope.$watch(function () {
            return element.val();
          }, function (val) {
            if (val) {
              element.val(parseFloat(val).toFixed(parseInt(attrs.qtToFixed)));
            }
            unwatch();
          });

          element.on('blur', formatNumber);
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
