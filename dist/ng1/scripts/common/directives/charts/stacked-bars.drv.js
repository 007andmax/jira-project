angular.module('quicktech.common.directives').directive('d3stackedBars', function () {
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
      var chart, height, options, redraw, width, x, y, g, colorScale;
      options = angular.extend(defaults(), attrs);
      x = chartController.getScale(options.xscale || options.x);
      y = chartController.getScale(options.yscale || options.y);

      chart = chartController.getChart();
      height = chartController.innerHeight;
      width = options.width;

      if (attrs.colors) {
        var colorsArray = scope.$eval(attrs.colors);
        if (Array.isArray(colorsArray)) {
          colorScale = function (i) {
            return colorsArray[i];
          }
        } else {
          colorScale = (function () {
            switch (attrs.colors) {
              case 'category20':
                return d3.scale.category20();
              case 'category20b':
                return d3.scale.category20b();
              case 'category20c':
                return d3.scale.category20c();
            }
          })();
        }
      }

      var stack = d3.layout.stack()
        .values(function (d) { return d; })
        .x(function (d) { return d[options.x]; })
        .y(function (d) { return d[options.y]; })
        .out(function (d, y0) { d.y0 = y0; });

      redraw = function (groupedData) {
        var data = groupedData[options.values];
        g = chart.append("g").attr("class", "stacked-bars");

        chart.selectAll('rect.' + options.values).remove();

        var group = g.selectAll(".group")
          .data(data[0])
          .enter().append("g")
          .attr("class", "group");

        var yI, y0I, xI;
        xI = yI = y0I = -1;
        var groups = group.selectAll("rect." + options.values).data(stack(data));

        groups.enter().append("rect")
          .attr('class', options.values)
          .style("fill", function (d, i) { return colorScale(i); })
          .attr("x", function (d, i) {
            if (i === 0) {
              xI++;
            }
            return x(d[xI][options.x]) + (options.xoffset ? (-options.width || -10) - 1 : 1);
          })
          .attr("y", function (d, i) {
            if (i === 0) {
              y0I++;
            }
            return y(d[y0I].y0 + d[y0I][options.y]);
          })
          .attr("width", options.width || 10)
          .attr("height", function (d, i) {
            if (i === 0) {
              yI++;
            }
            return y(d[yI].y0) - y(d[yI].y0 + d[yI][options.y]);
          });
      };

      return chartController.registerElement(redraw, options.order);
    }
  };
});
