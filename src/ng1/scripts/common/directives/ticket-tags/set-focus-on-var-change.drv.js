'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("setFocusOnVarChange",
    function () {
      return {
        restrict: 'A',
        scope: {
          trigger: '=setFocusOnVarChange'
        },
        link: function ($scope, $element) {
          var initialized = false;
          $scope.$watch('trigger', function () {
            if (initialized) {
              $element.focus();
            } else {
              initialized = true;
            }
          });
        }
      }
    });

})();
