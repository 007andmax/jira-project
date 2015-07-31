'use strict';

(function () {

  angular.module("quicktech.core.services").filter('durationFilter', function () {
    return function (input) {
      if (!input) {
        return "0 minuts";
      }

      var timeInMinutes = input * 60,
        hours = Math.floor(timeInMinutes / 60),
        minutes = Math.round(timeInMinutes - (hours * 60));

      return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes);
    }
  })
})();
