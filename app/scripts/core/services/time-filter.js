'use strict';

(function () {

  angular.module("quicktech.core.services").filter('timeFilter', function () {
    return function (input) {
      if (input !== undefined) {
        input = input.toString();
        var hours = (input.split('.')[0]);
        if (input.split('.')[1]) {
          var minuts = ((input.split('.')[1].length === 2 ? input.split('.')[1] : input.split('.')[1] + '0') * 60 / 100) || 0;
        } else {
          var minuts = 0;
        }
        if (+input < 1 && +input !== 0) {
          return minuts + ' minutes';
        } else if (+input === 0) {
          return "0 minut";
        } else if (+minuts === 0) {
          return hours + (hours == 1 ? " hour" : " hours");
        } else if (+input < 2) {
          return hours + ' hour ' + minuts + ' minutes';
        } else {
          return hours + ' hours ' + minuts + ' minutes';
        }
      }
    }
  })
})();
