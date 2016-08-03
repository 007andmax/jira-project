'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtToFixed',
    function () {
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

          element.on('blur', function () {
            var val = element.val();
            if (val) {
              element.val(parseFloat(val).toFixed(parseInt(attrs.qtToFixed)));
              scope.$apply();
            }
          });
        }
      }
    });
})();
