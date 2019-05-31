'use strict';

(function () {

  angular.module("quicktech.core.products").directive('executeWhenOutfocused',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.on('blur', function () {
            scope.$apply(attrs['executeWhenOutfocused']);
          })
        }
      }
    }]);
})();
