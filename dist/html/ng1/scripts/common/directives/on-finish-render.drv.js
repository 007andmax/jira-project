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
          }
        }
      };
    }]);
})();
