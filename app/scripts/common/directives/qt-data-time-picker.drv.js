'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtDataTimePicker',
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          minDate: '=',
          maxDate: '='
        },
        link: function (scope, element, attrs, ctrl) {

          var options = {
            keepOpen: true,
            format: 'DD MMM YYYY'
          };

          if (scope.minDate) {
            options.minDate = scope.minDate;
          }

          if (scope.maxDate) {
            options.maxDate = scope.maxDate;
          }

          element.datetimepicker(options);

          //element.on('shown.bs.dropdown', function(){
          //  var dropdown = element.find('.dropdown-menu');
          //  dropdown.css({'left': '95px'})
          //});

          element.bind('dp.change', function (e) {
            ctrl.$setViewValue(e.date._d)
          });

        }
      }
    });
})();
