'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('toFixed', function () {
    return function (input, num) {
      return input.toFixed(num);
    }
  })
})();
