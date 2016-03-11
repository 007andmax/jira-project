'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('onFinishRender',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          if (scope.$last === true) {
            $timeout(function () {
              scope.$apply(attr.onFinishRender);
            });
          } else if ((scope.$first === true) && isOneInArray()) {
            $timeout(function () {
              scope.$apply(attr.onFinishRender);
            });
          }

          function isOneInArray() {
            if (attr.ofrIsOneElement) {
              var arr = JSON.parse(attr.ofrIsOneElement);
              var arrLength = arr && arr.length - 1;/*unassigned user*/
              return arrLength === 1;
            }
          }

        }
      };
    }]);
})();
