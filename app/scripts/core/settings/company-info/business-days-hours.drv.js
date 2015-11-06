'use strict';

(function () {

  angular.module("quicktech.core.settings").directive("businessDaysHours",
    function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function (scope, element, attrs, ctrl) {

          var isSliderInitialized = false;

          scope.$watch(function () {
            return ctrl.$viewValue;
          }, function () {
            if (ctrl.$viewValue && !isSliderInitialized) {
              initializeTimeSlider(ctrl.$viewValue)
            }
          });

          function initializeTimeSlider(data) {

            isSliderInitialized = true;

            var elemDOM = element[0],
              timeInfo = {
                from: data.from / 60,
                to: data.to / 60
              };

            noUiSlider.create(elemDOM, {
              start: [timeInfo.from, timeInfo.to],
              step: 1,
              connect: true,
              behaviour: 'tap-drag',
              range: {
                'min': 1,
                'max': 24
              }
            });

            elemDOM.noUiSlider.on('change', function (values) {

              var timeInfo = {
                from: values[0] * 60,
                to: values[1] * 60
              };

              ctrl.$setViewValue(timeInfo);
            });

          }

        }
      }
    });
})();
