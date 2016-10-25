'use strict';

(function () {
  angular.module('quicktech.common.directives').directive('d3axis', function () {
    var defaults;
    defaults = function () {
      return {
        orientation: 'bottom',
        ticks: '5',
        extent: false
      };
    };
    return {
      priority: 1,
      restrict: 'E',
      require: '^d3chart',
      scope: {
        customTimeFormat: '=',
        filter: '=',
        tickValues: '='
      },
      link: function ($scope, $el, $attrs, chartController) {
        var adjustTickLabels, axisElement, drawGrid, getAxis, grid, label, options, positionLabel,
          range, redraw, scale, translation, updateScale;
        options = angular.extend(defaults(), $attrs);
        range = function (domainValues) {
          if (options.scale !== 'ordinal') {
            if (options.orientation === 'top' || options.orientation === 'bottom') {
              if (options.reverse != null) {
                return [chartController.innerWidth, 0];
              } else {
                return [0, chartController.innerWidth];
              }
            } else {
              if (options.reverse != null) {
                return [0, chartController.innerHeight];
              } else {
                return [chartController.innerHeight, 0];
              }
            }
          } else {
            var interval = 0, range;
            if (options.orientation === 'top' || options.orientation === 'bottom') {
              interval = chartController.innerWidth / (domainValues.length - 1);
              range = domainValues.map(function (value, i) {
                return interval * i;
              });
              if (options.reverse != null) {
                return range.reverse();
              } else {
                return range;
              }
            } else {
              interval = chartController.innerHeight / (domainValues.length - 1);
              range = domainValues.map(function (value, i) {
                return interval * i;
              });
              if (options.reverse != null) {
                return range;
              } else {
                return range.reverse();
              }
            }
          }
        };
        translation = function () {
          if (options.orientation === 'bottom') {
            return "translate(0, " + chartController.innerHeight + ")";
          } else if (options.orientation === 'top') {
            return "translate(0, 0)";
          } else if (options.orientation === 'left') {
            return "translate(0, 0)";
          } else if (options.orientation === 'right') {
            return "translate(" + chartController.innerWidth + ", 0)";
          }
        };
        if (options.scale === 'time') {
          scale = d3.time.scale();
        } else if (options.scale) {
          scale = d3.scale[options.scale]();
        } else {
          scale = d3.scale.linear();
        }
        getAxis = function () {
          var axis, format, tickSize;
          axis = d3.svg.axis().scale(scale).orient(options.orientation);
          if (options.ticks) {
            axis.ticks(options.ticks);
          }
          if (options.timeScale) {
            axis.ticks(d3.time[options.timeScale], options.timeInterval);
          }
          if ($scope.tickValues) {
            axis.tickValues($scope.tickValues);
          }
          if (options.tickSize) {
            tickSize = options.tickSize.split(',');
            axis.innerTickSize(tickSize[0]);
            axis.outerTickSize(tickSize[1]);
          }
          if ($scope.customTimeFormat != null) {
            format = d3.time.format.multi(angular.copy($scope.customTimeFormat));
            axis.tickFormat(function (value) {
              return format(new Date(value));
            });
          }
          if (options.timeFormat != null) {
            format = d3.time.format(options.timeFormat);
            axis.tickFormat(function (value) {
              return format(new Date(value));
            });
          } else if (options.format != null) {
            format = d3.format(options.format);
            axis.tickFormat(format);
          }
          return axis;
        };
        positionLabel = function (label) {
          if (options.orientation === 'bottom') {
            return label.attr("x", "" + (chartController.innerWidth / 2))
              .attr("dy", "" + chartController.margin.bottom)
              .attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'top') {
            return label.attr("x", "" + (chartController.innerWidth / 2))
              .attr("dy", "" + (-chartController.margin.top))
              .attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'left') {
            return label.attr("x", "-" + (chartController.innerHeight / 2))
              .attr("dy", "" + (-chartController.margin.left + 18))
              .attr("style", "text-anchor: middle;")
              .attr("transform", "rotate(-90)");
          } else if (options.orientation === 'right') {
            return label.attr("x", "" + (chartController.innerHeight / 2))
              .attr("dy", "" + (-chartController.margin.right + 18))
              .attr("style", "text-anchor: middle;")
              .attr("transform", "rotate(90)");
          }
        };
        drawGrid = function (grid, axis) {
          if (options.orientation === 'bottom') {
            return grid.call(axis.tickSize(chartController.innerHeight, 0, 0).tickFormat(''));
          } else if (options.orientation === 'top') {
            return grid.attr("transform", "translate(0, " + chartController.innerHeight + ")")
              .call(axis.tickSize(chartController.innerHeight, 0, 0).tickFormat(''));
          } else if (options.orientation === 'left') {
            return grid.attr("transform", "translate(" + chartController.innerWidth + ", 0)")
              .call(axis.tickSize(chartController.innerWidth, 0, 0).tickFormat(''));
          } else if (options.orientation === 'right') {
            return grid.call(axis.tickSize(chartController.innerWidth, 0, 0).tickFormat(''));
          }
        };
        adjustTickLabels = function (g) {
          var firstTickLabels, lastTickLabels, tickLabels;
          tickLabels = g.selectAll('.tick text');
          if (options.maxLabelsCount) {
            var maxLabels = +options.maxLabelsCount;
            if (tickLabels[0].length > maxLabels) {
              var reduceIn = Math.ceil(tickLabels[0].length / maxLabels);
              tickLabels.text(function (d, i) {
                return i % reduceIn === 0 ? this.innerHTML : '';
              });
            }
          }
          if (options.tickDy) {
            tickLabels.attr('dy', options.tickDy);
          }
          if (options.tickDx) {
            tickLabels.attr('dx', options.tickDx);
          }
          if (options.tickAnchor) {
            tickLabels.style('text-anchor', options.tickAnchor);
          }
          lastTickLabels = d3.select(tickLabels[0].slice(-1)[0]);
          if (options.lastTickDy) {
            lastTickLabels.attr('dy', options.lastTickDy);
          }
          if (options.lastTickDx) {
            lastTickLabels.attr('dx', options.lastTickDx);
          }
          if (options.lastTickAnchor) {
            lastTickLabels.style('text-anchor', options.lastTickAnchor);
          }
          firstTickLabels = d3.select(tickLabels[0][0]);
          if (options.firstTickDy) {
            firstTickLabels.attr('dy', options.firstTickDy);
          }
          if (options.firstTickDx) {
            firstTickLabels.attr('dx', options.firstTickDx);
          }
          if (options.listTickAnchor) {
            return firstTickLabels.style('text-anchor', options.firstTickAnchor);
          }
        };
        axisElement = null;
        grid = null;
        label = null;
        redraw = function (data) {
          var axis, tickLabels;
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          axis = getAxis();
          if (options.hide == null) {
            axisElement || (axisElement = chartController.getChart().append("g")
              .attr("class", "axis axis-" + options.orientation + " axis-" + options.name)
              .attr("transform", translation()));
            if (options.label) {
              label || (label = axisElement.append("text").attr("class", "axis-label").text(options.label));
            }
            if (options.grid) {
              grid || (grid = chartController.getChart().append("g")
                .attr("class", "axis-grid axis-grid-" + options.name));
            }
            if (label) {
              positionLabel(label.transition().duration(500));
            }
            axisElement.transition().duration(500).attr("transform", translation())
              .call(axis).selectAll('tick text').tween("attr.dx", null)
              .tween("attr.dy", null).tween("style.text-anchor", null);
            if (grid != null) {
              drawGrid(grid.transition().duration(500), axis);
            }
            tickLabels = axisElement.selectAll('.tick text');
            return axisElement.call(adjustTickLabels);
          }


          // if (options.tickDy && tickLabels[0].length > +options.maxLabelsCount) {
          //   axisElement.selectAll('.tick line').remove();
          //   var tickLines = axisElement.selectAll('g.tick'),
          //     x2 = Math.round(chartController.innerWidth / tickLines.length);
          //   tickLines.each(function (d, i) {
          //     d3.select(this).append("line")
          //       .attr("y2", (i % 2 === 0 ? +options.tickDy + 15 : +options.tickDy) - 5)
          //       .attr("x2", 0);
          //   });
          // }
        };
        updateScale = function (data) {
          var datum, domainValues;
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          if ($scope.filter) {
            domainValues = $scope.filter(data);
          } else {
            domainValues = (function () {
              var i, len, results;
              results = [];
              for (i = 0, len = data.length; i < len; i++) {
                datum = data[i];
                results.push(datum[options.name]);
              }
              return results;
            })();
          }
          scale.range(range(domainValues));
          if (options.extent) {
            return scale.domain(d3.extent(domainValues));
          } else {
            if (options.scale !== 'ordinal') {
              return scale.domain([0, d3.max(domainValues)]);
            } else {
              return scale.domain(domainValues);
            }
          }
        };
        chartController.addScale(options.name, scale, updateScale);
        chartController.registerElement(redraw, options.order);
        $scope.$watchCollection('tickValues', chartController.redraw);
        $scope.$watchCollection('customTimeFormat', chartController.redraw);
        $scope.$watch('filter', chartController.redraw);
        return $scope.$watch('tickValues', chartController.redraw);
      }
    };
  });
})();
