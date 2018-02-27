'use strict';

(function () {

  angular.module("quicktech.core.quickSupport").directive('emailTo',
    [function () {
      return {
        restrict: 'A',
        scope: {
          emailTo: '='
        },
        link: function (scope, element, attrs) {

          element.click(function () {
              window.open("mailto:" + scope.emailTo, '_parent');
          });

        }
      }
    }]);
})();
