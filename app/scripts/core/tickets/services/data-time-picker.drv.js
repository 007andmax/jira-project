'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('chooseDataDropdown',
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ctrl) {

          //var dateInput = element.find('input');

          element.datetimepicker({
            keepOpen: true,
            format: 'DD MMM YYYY'
          });

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
