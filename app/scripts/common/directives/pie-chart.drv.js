'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('pieChart',
    [function () {
      return {
        restrict: 'A',
        template: "<canvas pie-chart-canvas-tpl class='pull-left' width='40' height='40'></canvas>",
        scope: {
          firstValuePieChart: '=firstValuePieChart',
          secondValuePieChart: '=secondValuePieChart'
        },
        link: function (scope, element) {

          var elem = element.find('[pie-chart-canvas-tpl]');

          scope.$watchGroup(['firstValuePieChart', 'secondValuePieChart'], function () {

            var data = [
              {
                percentage: (scope.firstValuePieChart / scope.secondValuePieChart),
                fillColor: "#7fd5e0",
                label: "",
                description: ""
              }, {
                percentage: 1 - (scope.firstValuePieChart / scope.secondValuePieChart),
                fillColor: "#e53935",
                label: "",
                description: ""

              }];

            HoverPie.make(elem, data, {});

          });

        }
      }
    }]);
})();
