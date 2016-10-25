"use strict";

(function () {
  angular.module('quicktech.common.directives').directive('d3bars', function () {
    var defaults;
    defaults = function () {
      return {
        x: 0,
        y: 1,
        width: 15
      };
    };
    return {
      restrict: 'E',
      require: '^d3chart',
      link: function (scope, el, attrs, chartController) {
        var barsElements, height, options, redraw, width, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);

        height = chartController.innerHeight;
        width = options.width;

        redraw = function (data) {
          var bars;
          barsElements || (barsElements = chartController.getChart().append("g").attr("class", "bars"));

          if (!((data != null) && data.length !== 0)) {
            return;
          }

          bars = barsElements.selectAll("rect.bar").data(data);

          bars.exit().attr("y", function () {
            return chartController.innerHeight;
          }).attr("height", 0).remove();

          bars.attr("x", function (d) {
            return x(d[options.x]) - width / 2;
          }).attr("y", function (d) {
            return y(d[options.y]);
          }).attr("height", function (d) {
            return chartController.innerHeight - y(d[options.y]);
          }).attr("width", width);

          var text = barsElements.selectAll('text').data(data);

          text.enter().append('text').attr("class", function (d, i) {
            return "bar-label-" + i;
          }).attr('x', function (d) {
            return x(d[options.x]) - this.clientWidth / 2;
          }).attr('y', function (d) {
            return y(d[options.y]) - 5;
          });

          text.text(function (d) {
            return (options.preffix ? options.preffix : '') + d[options.y];
          }).attr('x', function (d) {
            return x(d[options.x]) - this.clientWidth / 2;
          }).attr('y', function (d) {
            return y(d[options.y]) - 5;
          });
          text.exit().remove();

          return bars.enter().append("rect").attr("class", function (d, i) {
            return "bar bar-" + i;
          }).attr("x", function (d) {
            return x(d[options.x]) - width / 2;
          }).attr("width", width).attr("y", function () {
            return chartController.innerHeight;
          }).attr("height", 0).attr("y", function (d) {
            return y(d[options.y]);
          }).attr("height", function (d) {
            return chartController.innerHeight - y(d[options.y]);
          });
        };
        return chartController.registerElement(redraw, options.order);
      }
    };
  });
})();
