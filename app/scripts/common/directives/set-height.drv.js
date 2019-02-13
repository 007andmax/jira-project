'use strict';

(function () {
  var app = angular.module('quicktech.common.directives');

  app.directive('setHeightNote',['$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        scope: {
          quantity: "=serviceQuantityPicker",
          lineLength: '=lineLength',
        },
        link: (function (scope, element) {
          $timeout(function() {
            if (element[0].offsetHeight > 43) {
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
