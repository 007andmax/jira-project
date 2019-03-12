'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('priceDelimiters', function () {
    return function (input) {

      if (!input) return 0;
      
      var inputParts = (input + '').split('.');

      var firstPart = inputParts[0] + '';

      if (firstPart.length > 3) {
        firstPart = firstPart.slice(0, -3) + ',' + firstPart.slice(-3);
      }

      return firstPart + '.' + inputParts[1];
    }
  })
})();
