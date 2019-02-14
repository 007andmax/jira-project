'use strict';

(function () {
  var app = angular.module('quicktech.common.directives');

  app.directive('setHeightNote',['$timeout',
    function () {
      return {
        restrict: 'A',
        scope: {
          lineLength: '=lineLength',
        },
        link: (function (scope, element, attrs) {
          scope.$watch(attrs, function() {
            if (element[0].offsetHeight > 48) {
              element.addClass('hidden-note');
            }
            if (scope.lineLength && scope.lineLength >= 3) {
              element[0].style.webkitLineClamp =  scope.lineLength;
            }
          });

          scope.$watch(element, function() {
            if (element[0].offsetHeight > 48) {
              element.addClass('hidden-note');
            }
            if (scope.lineLength && scope.lineLength >= 3) {
              element[0].style.webkitLineClamp =  scope.lineLength;
            }
          });
        })
      };
    }]);
})();
