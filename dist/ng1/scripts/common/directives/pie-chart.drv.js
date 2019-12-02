'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('pieChart',
    [function () {
      return {
        restrict: 'A',
        template: "<canvas id='myCanvas' pie-chart-canvas-tpl class='pull-left' width='{{ size }}' height='{{ size }}'></canvas>",
        scope: {
          value: '=pieChartValue',
          size: '=pieChartSize',
          color: '=pieChartColor'
        },
        link: function (scope, element) {

          var elem = element.find('[pie-chart-canvas-tpl]');

          scope.$watch('value', function () {

            var sum = scope.value[0] + scope.value[1];

            var data = [
              {
                percentage: scope.value[0] / sum || 0,
                fillColor: scope.color[0],
                label: "",
                description: ""
              }, {
                percentage: scope.value[1] / sum || 0,
                fillColor: scope.color[1],
                label: "",
                description: ""

              }];

            HoverPie.make(elem, data, {});

          }, true);

        }
      }
    }]);
})();
