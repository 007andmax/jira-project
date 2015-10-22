'use strict';

(function () {

  angular.module("quicktech.core.rightPanel").filter('activitiesTime', function () {
    return function (input) {

      if (!input) {
        return '';
      }

      var minut = 1000 * 60,
        hour = minut * 60,
        day = hour * 24,
        week = day * 7,
        month = day * 30,
        year = day * 356;

      var currentTime = new Date();

      if ((currentTime - input) < (5 * minut)) {
        return 'few minutes ago'

      } else if ((currentTime - input) < hour) {
        return 'about ' + Math.round((currentTime - input) / minut) + ' minuts ago'

      } else if ((currentTime - input) < day) {
        return 'about ' + Math.round((currentTime - input) / hour) + ' hours ago'

      } else if ((currentTime - input) < week) {
        return 'about ' + Math.round((currentTime - input) / day) + ' day ago'

      } else if ((currentTime - input) < month) {
        return 'about ' + Math.round((currentTime - input) / week) + ' weeks ago'

      } else if ((currentTime - input) < year) {
        return 'about ' + Math.round((currentTime - input) / month) + ' months ago'

      } else {
        return 'about ' + Math.round((currentTime - input) / year) + ' years ago'
      }

    }
  })
})();
