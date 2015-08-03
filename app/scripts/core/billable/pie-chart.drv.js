'use strict';

(function () {

  angular.module("quicktech.core.products").directive('pieChart',
    [function () {
      return {
        restrict: 'A',
        template: "<canvas id='myCanvas' class='pull-left' width='40' height='40'></canvas>",
        link: function (scope) {

          scope.$watch('totalbillables', function () {

            var data = [
              {
                percentage: (scope.totalbillables / scope.billedAmountLast30Days),
                fillColor: "#7fd5e0",
                label: "",
                description: ""
              }, {
                percentage: 1 - (scope.totalbillables / scope.billedAmountLast30Days),
                fillColor: "#e53935",
                label: "",
                description: ""

              }];

            HoverPie.make($("#myCanvas"), data, {});

          });

        }
      }
    }]);
})();
