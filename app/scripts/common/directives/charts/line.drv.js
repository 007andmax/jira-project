'use strict';

(function () {
  angular.module('quicktech.common.directives').directive('d3line', function () {
    var defaults;
    defaults = function () {
      return {
        x: 0,
        y: 1
      };
    };
    return {
      restrict: 'E',
      require: '^d3chart',
      link: function (scope, el, attrs, chartController) {
        var tooltip, line, linePath, options, redraw, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
        line = d3.svg.line().x(function (d) {
          return x(d[options.x]);
        }).y(function (d) {
          return y(d[options.y]);
        });
        linePath = null;

        redraw = function (data) {
          linePath || (linePath = chartController.getChart().append("path")
            .attr("class", "line line-" + (options.name || options.y))
            .style("fill", "none")
            .style("stroke", options.stroke));

          chartController.getChart().selectAll("circle").remove();

          var dots = chartController.getChart().selectAll("dot").data(data);
          dots.enter().append("circle").attr("r", 5).attr('class', 'outer-circle')
            .attr("cx", function (d) {
              return x(d[options.x]);
            })
            .attr("cy", function (d) {
              return y(d[options.y]);
            })
            .on("mouseover", function (d, i) {
              tooltip.transition().duration(200).style("opacity", .9);
              chartController.xAxisShowLabel && chartController.xAxisShowLabel(i);
              return tooltip.html(
                '<div class="tooltip-inner ' + options.chartTooltip + '-tooltip">' +
                  (options.tooltipPreffix || '') + d[options.y] + ' ' + (options.tooltipPostfix || '') + '<br>' +
                  (d[options.additionalTooltipField] !== undefined ? d[options.additionalTooltipField] : '') +
                '</div>')
                .attr('class', 'tooltip')
                .style("left", d3.event.pageX - tooltip[0][0].clientWidth / 2 + "px")
                .style("top", (d3.event.pageY - (parseInt(options.tooltipTopOffset) || 35)) + "px");
            })
            .on("mouseleave", function (d, i) {
              chartController.xAxisHideLabel && chartController.xAxisHideLabel(i);
              tooltip.transition().duration(200).style("opacity", 0);
              tooltip.style('left', '-10000px');
            });
          dots.exit();

          dots.enter().append("circle").attr("r", 2.5).attr('fill', 'white').attr('class', 'inner-circle')
            .attr("cx", function (d) {
              return x(d[options.x]);
            })
            .attr("cy", function (d) {
              return y(d[options.y]);
            })
            .on("mouseover", function (d, i) {
              tooltip.transition().duration(200).style("opacity", .9);
              chartController.xAxisShowLabel && chartController.xAxisShowLabel(i);
              return tooltip.html(
                '<div class="tooltip-inner ' + options.chartTooltip + '-tooltip">' +
                (options.tooltipPreffix || '') + d[options.y] + ' ' + (options.tooltipPostfix || '') + '<br>' +
                (d[options.additionalTooltipField] !== undefined ? d[options.additionalTooltipField] : '') +
                '</div>')
                .attr('class', 'tooltip')
                .style("left", d3.event.pageX - tooltip[0][0].clientWidth / 2 + "px")
                .style("top", (d3.event.pageY - (parseInt(options.tooltipTopOffset) || 35)) + "px");
            })
            .on("mouseleave", function (d, i) {
              tooltip.transition().duration(200).style("opacity", 0);
              chartController.xAxisHideLabel && chartController.xAxisHideLabel(i);
              tooltip.style('left', '-10000px');
            });
          dots.exit();

          if (data == null || data.length === 0) {
            return;
          }
          return linePath.datum(data).transition().duration(500).attr("d", line);
        };

        return chartController.registerElement(redraw, options.order);
      }
    };
  });
})();
