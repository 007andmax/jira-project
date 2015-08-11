'use strict';

(function () {

  angular.module("quicktech.core.recurring").directive("timePicker", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element) {

        var today = new Date();

        element.datetimepicker({
          viewMode: 'years',
          keepOpen: true,
          format: 'DD MMM YYYY',
          minDate: today.setDate(today.getDate() + 1)
        }).on('dp.change', function (event) {
          element.blur();
          scope.createInvoice.sentOn = event.date._d;
        });
      }

    };
  });
})();
