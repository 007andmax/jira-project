'use strict';

(function () {

  angular.module("quicktech.core.tickets").filter('ticketCreateDate',
    ['$filter',
      function ($filter) {
        return function (input) {

          var now = new Date(),
            date = new Date(input),
            dateYear = date.getFullYear(),
            dateMonth = date.getMonth(),
            dateDay = date.getDate(),
            template = '';


          if (dateYear === now.getFullYear() && dateMonth === now.getMonth() && dateDay === now.getDate()) {

            template = 'h:mm a';

          } else if (dateYear === now.getFullYear()) {

            template = 'd MMM';

          } else {

            template = 'd MMM yyyy';

          }

          return $filter('date')(input, template);

        }
      }])
})();
