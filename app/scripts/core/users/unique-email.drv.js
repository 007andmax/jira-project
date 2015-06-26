'use strict';

(function () {

  angular.module("quicktech.core.users").directive('uniqueUserEmail',
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
