'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("focusOn",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var isEnabled = $scope.$eval(attrs.focusOn);
          focusOn();
          $scope.$on('focusOnElement', focusOn);

          function focusOn() {
            if (isEnabled === undefined || isEnabled) {
              $timeout(function () {
                element.focus();
              }, attrs.delay || 0);
            }
          }
        }
      }
    }]);

})();
