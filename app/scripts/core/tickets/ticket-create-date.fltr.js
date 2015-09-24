'use strict';

(function () {

  angular.module("quicktech.core.tickets").filter('ticketCreateDate', function () {
    return function (input) {

      var day = 60 * 60 * 24 * 1000,
        now = new Date(),
        date = new Date(input),
        dateYear = date.getFullYear(),
        dateMonth = date.getUTCMonth(),
        dateDay = date.getDate(),
        dateHours = date.getHours(),
        dateMinuts = date.getMinutes(),
        stringDate = '',
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if ((now - input) < day) {

        if (dateHours < 12) {
          stringDate += dateHours === 0 ? '12:' + dateMinuts + ' am' : dateHours + ':' + dateMinuts + ' am';
        } else {
          stringDate += dateHours === 12 ? '12:' + dateMinuts + ' pm' : (dateHours - 12) + ':' + dateMinuts + ' pm';
        }

        return stringDate;

      } else if (dateYear === now.getFullYear()) {

        stringDate += dateDay + ' ' + month[dateMonth];
        return stringDate;

      } else {

        stringDate += dateDay + ' ' + month[dateMonth] + ' ' + dateYear;
        return stringDate;
      }
    }
  })
})();
