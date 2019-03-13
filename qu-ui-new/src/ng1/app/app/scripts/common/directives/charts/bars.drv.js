"use strict";

(function () {
  angular.module('quicktech.common.directives').directive('d3bars', function () {
    var defaults;
    defaults = function () {
      return {
        x: 0,
        y: 1,
        width: 15,
        toFixed: 2
      };
    };
    return {
      restrict: 'E',
      require: '^d3chart',
      link: function (scope, el, attrs, chartController) {
        var barsElements, height, options, redraw, width, x, y, toFixed, tooltip, shadowBars;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        toFixed = options.toFixed;
        tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

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
            var offset = options.offset ? parseInt(options.offset) : width / 2;
            return x(options.x === 'date' ? new Date(d[options.x]) : d[options.x]) - offset;
          }).attr("y", function (d) {
            return y(d[options.y]);
          }).attr("rx", 3).attr("ry", 3).attr("height", function (d) {
            return chartController.innerHeight - y(d[options.y]);
          }).attr("width", width);

          shadowBars = barsElements.selectAll("rect.shadow-bar").data(data);

          shadowBars.exit().attr("y", function () {
            return chartController.innerHeight;
          }).attr("height", 0).remove();

          shadowBars.attr("x", function (d) {
            var offset = options.offset ? parseInt(options.offset) : width / 2;
            return x(options.x === 'date' ? new Date(d[options.x]) : d[options.x]) - offset;
          }).attr("y", 0).attr("rx", 3).attr("ry", 3).attr("height", function (d, i) {
            return (i && i !== data.length - 1 ? chartController.innerHeight : 0);
          }).attr("width", width);

          if (typeof options.staticLabel === 'string') {
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
          }

          shadowBars.enter().append("rect").attr("class", 'shadow-bar')
            .attr("rx", 3).attr("ry", 3).attr("x", function (d) {
            var offset = options.offset ? parseInt(options.offset) : width / 2;
            return x(options.x === 'date' ? new Date(d[options.x]) : d[options.x]) - offset;
          }).attr("width", width).attr("y", function () {
            return chartController.innerHeight;
          }).attr("height", 0).attr("y", 0).attr("height", function (d, i) {
            return (i && i !== data.length - 1 ? chartController.innerHeight : 0);
          }).style('fill', '#e9e9e9');

          return bars.enter().append("rect").attr("class", function (d, i) {
            return "bar bar-" + i;
          }).style('fill', options.color).attr("rx", 3).attr("ry", 3).attr("x", function (d) {
            var offset = options.offset ? parseInt(options.offset) : width / 2;
            return x(options.x === 'date' ? new Date(d[options.x]) : d[options.x]) - offset;
          }).attr("width", width).attr("y", function () {
            return chartController.innerHeight;
          }).attr("height", 0).attr("y", function (d) {
            return y(d[options.y]);
          }).attr("height", function (d) {
            return chartController.innerHeight - y(d[options.y]);
          }).on("mouseover", function (d, i) {
            tooltip.transition().duration(200).style("opacity", .9).style('z-index', 9999);
            chartController.xAxisShowLabel && chartController.xAxisShowLabel(i);
            var postion = angular.element(this).offset();
            return tooltip.html(
              '<div class="tooltip-inner ' + options.chartTooltip + '-tooltip">' +
              (options.tooltipPreffix || '') + d[options.y].toFixed(toFixed) + ' ' + (options.tooltipPostfix || '') + '<br>' +
              (d[options.additionalTooltipField] !== undefined ? d[options.additionalTooltipField] : '') +
              '</div>')
              .attr('class', 'tooltip')
              .style("left", function () {
                return (postion.left + width / 2 - this.clientWidth / 2) + "px";
              })
              .style("top", function () {
                return (postion.top - this.clientHeight - 5) + "px";
              });
          })
            .on("mouseleave", function (d, i) {
              chartController.xAxisHideLabel && chartController.xAxisHideLabel(i);
              tooltip.transition().duration(200).style("opacity", 0);
              tooltip.style('left', '-10000px');
            });
        };
        return chartController.registerElement(redraw, options.order);
      }
    };
  });
})();
