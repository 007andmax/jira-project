'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('uniqueEmail',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          element.on('blur', function () {
            console.log("Here must be email validation!!!!")
          });
        }
      }
    }]);
})();
