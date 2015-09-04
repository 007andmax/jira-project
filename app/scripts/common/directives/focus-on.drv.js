'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("focusOn",
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          element.focus();
        }
      }
    }]);

})();
