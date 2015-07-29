'use strict';

(function () {

  angular.module("quicktech.core.services").filter('timeFilter', function () {
    return function (input) {
      if (!input) {
        return "0 minuts";
      }

      var timeInMinutes = input * 60,
        hours = Math.floor(timeInMinutes / 60),
        minutes = Math.round(timeInMinutes - (hours * 60)),
        result = '';

      if (hours === 1) {
        result += '1 hour ';
      } else if (hours > 1) {
        result += hours + ' hours ';
      }

      if (minutes > 0) {
        result += minutes + ' minutes';
      }

      return result;
    }
  })
})();
