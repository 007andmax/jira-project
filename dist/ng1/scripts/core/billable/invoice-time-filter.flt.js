'use strict';

(function () {

  angular.module("quicktech.core.billable").filter('invoiceTimeFilter', function () {
    return function (input) {

      if (!input || input <= 0) {
        return "";
      }

      var timeInSeconds = input / 1000,
        minutes = Math.floor(timeInSeconds / 60),
        seconds = Math.round(timeInSeconds - (minutes * 60));

      return (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds >= 10 ? seconds : '0' + seconds);

    }
  })
})();
