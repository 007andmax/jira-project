'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('reportTime', function () {
    return function (input) {
      if (!input) {
        return "00:00";
      }

      var num = +input;
      var remainder = num - Math.floor(num);

      if (!remainder) {
        return addZero(num) + ':' + '00';
      } else {
        return addZero(Math.floor(num)) + ':' + Math.floor(remainder * 60);
      }


      function addZero(num) {
        if (String(num).length < 2) {
          return '0' + num;
        }

        return num;
      }
    }
  })
})();
