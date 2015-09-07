'use strict';

(function () {

  angular.module("quicktech.core.companies").directive('pieChartCompany',
    [function () {
      return {
        restrict: 'A',
        template: "<canvas id='myCanvas' pie-chart-canvas-tpl class='pull-left' width='140' height='140'></canvas>",
        scope: {
          value: '=pieChartValue'
        },
        link: function (scope, element, attrs) {

          var elem = element.find('[pie-chart-canvas-tpl]');

          scope.$watch('value', function () {

            var sum = scope.value[0] + scope.value[1];

            var data = [
              {
                percentage: scope.value[0] / sum || 0,
                fillColor: "#eca935",
                label: "",
                description: ""
              }, {
                percentage: scope.value[1] / sum || 0,
                fillColor: "#2eabbe",
                label: "",
                description: ""

              }];

            HoverPie.make(elem, data, {});

          });

        }
      }
    }]);
})();
