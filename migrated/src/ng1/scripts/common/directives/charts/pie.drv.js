'use strict';

(function () {
  angular.module('quicktech.common.directives').directive('d3pie', function () {
    var defaults;
    defaults = function () {
      return {
        x: 0,
        y: 1,
        innerRadius: 0,
        labelRadius: 0.6,
        transition: 'cubic-in-out',
        transitionDuration: 300,
        minOffset: 6,
        value: 'value'
      };
    };

    return {
      restrict: 'E',
      require: '^d3chart',
      link: function (scope, el, attrs, chartController) {
        var _current, center, chart, colorScale, innerRadius, labelRadius, options, pie, redraw;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        var additionalLabelRadius = parseFloat(options.additionalLabelRadius);

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

        pie = d3.layout.pie().sort(null).value(function (d) {
          return d[options.value];
        });
        _current = null;
        center = null;

        redraw = function (data) {
          var arc, arcTween, getPosition, label, labelArc, padding, prevbb, radius, slice, phantomArc;
          center || (center = chart.append('g').attr('class', 'pie'));

          if (!((data != null) && data.length !== 0)) {
            return;
          }

          radius = Math.min(chartController.innerWidth, chartController.innerHeight) / 2;
          center.attr('transform', 'translate(' + radius + ',' + radius + ')');
          arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius);
          phantomArc = d3.svg.arc().outerRadius(radius).innerRadius(0);

          chart.selectAll("g.phantom-arc").data(pie(data)).remove();
          var phantomArcs = chart.selectAll("g.phantom-arc").data(pie(data));

          phantomArcs.enter().append("g")
            .attr("class", "phantom-arc")
            .attr("transform", "translate(" + radius + ", " + radius + ")")

            .append("path")
            .attr("fill", 'white')
            .attr("fill-opacity", 0.1)
            .style('stroke', 'white')
            .style('stroke-width', 1)
            .attr("d", phantomArc);

          phantomArcs.exit();

          arcTween = function (a) {
            var i;
            i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
              return arc(i(t));
            };
          };

          labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
          var additionalLabelArc = d3.svg.arc().outerRadius(radius * additionalLabelRadius).innerRadius(radius * additionalLabelRadius);
          slice = center.selectAll('.pie').data(pie(data));
          slice.enter().append('path').attr('class', function (d, i) {
            return 'pie pie-' + i;
          }).attr('d', arc).each(function (d) {
            return this._current = d;
          });

          if (attrs.colors) {
            slice.style('fill', function (d, i) {
              if (colorScale) {
                return colorScale(i);
              } else {
                return d[attrs.color];
              }
            });
          }

          slice.exit().remove();
          slice.transition().ease(options.transition).duration(options.transitionDuration).attrTween('d', arcTween);

          if (options.label) {
            prevbb = null;
            padding = +options.minOffset;

            getPosition = function (d, i) {
              var cpx, cpy, ctx, cty, offset, offsetArc, position, relativePosition, thisbb;
              position = labelArc.centroid(d);
              position[1] += 3;

              if (options.avoidCollisions) {
                relativePosition = [position[0], position[1]];
                if (this._position) {
                  relativePosition[0] -= this._position[0];
                  relativePosition[1] -= this._position[1];
                }

                var boundingClientRect = this.getBoundingClientRect();

                thisbb = {};
                for (var direction in boundingClientRect) {
                  var value = boundingClientRect[direction];
                  switch (direction) {
                    case 'left':
                      thisbb[direction] = value - padding + relativePosition[0];
                      break;
                    case 'top':
                      thisbb[direction] = value - padding + relativePosition[1];
                      break;
                    case 'right':
                      thisbb[direction] = value + padding + relativePosition[0];
                      break;
                    case 'bottom':
                      thisbb[direction] = value + padding + relativePosition[1];
                  }
                }

                if (prevbb && !(thisbb.right < prevbb.left || thisbb.left > prevbb.right || thisbb.bottom < prevbb.top || thisbb.top > prevbb.bottom)) {
                  ctx = thisbb.left + (thisbb.right - thisbb.left) / 2;
                  cty = thisbb.top + (thisbb.bottom - thisbb.top) / 2;
                  cpx = prevbb.left + (prevbb.right - prevbb.left) / 2;
                  cpy = prevbb.top + (prevbb.bottom - prevbb.top) / 2;
                  offset = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2)) / 1.5;
                  offsetArc = d3.svg.arc().outerRadius(radius * labelRadius + offset).innerRadius(radius * labelRadius + offset);
                  position = offsetArc.centroid(d);
                }
                this._position = position;
                prevbb = thisbb;
              }
              return 'translate(' + position + ')';
            };

            label = center.selectAll('text').data(pie(data));
            label.enter().append('text')
              .style('text-anchor', 'middle')
              .attr('fill', function (d, i) {
                return labelRadius > 1 ? colorScale(i) : 'white';
              })
              .attr('class', function (d, i) {
                return 'pie-label pie-label-' + i;
              });
            label.exit().remove();
            label.text(function (d, i) {
              if (data[i][options.value]){
                return data[i][options.label] + (options.labelPostfix || '');
              } else {
                return '';
              }
            });

            if (options.additionalLabel) {
              padding = +options.minOffset;

              var getAdditionalPosition = function (d, i) {
                var cpx, cpy, ctx, cty, offset, offsetArc, position, relativePosition, thisbb;
                position = additionalLabelArc.centroid(d);

                if (options.avoidCollisions) {
                  relativePosition = [position[0], position[1]];
                  if (this._position) {
                    relativePosition[0] -= this._position[0];
                    relativePosition[1] -= this._position[1];
                  }

                  var boundingClientRect = this.getBoundingClientRect();

                  thisbb = {};
                  for (var direction in boundingClientRect) {
                    var value = boundingClientRect[direction];
                    switch (direction) {
                      case 'left':
                        thisbb[direction] = value - padding + relativePosition[0];
                        break;
                      case 'top':
                        thisbb[direction] = value - padding + relativePosition[1];
                        break;
                      case 'right':
                        thisbb[direction] = value + padding + relativePosition[0];
                        break;
                      case 'bottom':
                        thisbb[direction] = value + padding + relativePosition[1];
                    }
                  }

                  if (prevbb && !(thisbb.right < prevbb.left || thisbb.left > prevbb.right || thisbb.bottom < prevbb.top || thisbb.top > prevbb.bottom)) {
                    ctx = thisbb.left + (thisbb.right - thisbb.left) / 2;
                    cty = thisbb.top + (thisbb.bottom - thisbb.top) / 2;
                    cpx = prevbb.left + (prevbb.right - prevbb.left) / 2;
                    cpy = prevbb.top + (prevbb.bottom - prevbb.top) / 2;
                    offset = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2)) / 1.5;
                    offsetArc = d3.svg.arc().outerRadius(radius * additionalLabelRadius - offset).innerRadius(radius * additionalLabelRadius - offset);
                    position = offsetArc.centroid(d);
                  }
                  this._position = position;
                  prevbb = thisbb;
                }

                if (!position[0]) {
                  position[0] = 0;
                }
                if (!position[1]) {
                  position[1] = 0;
                }
                return 'translate(' + position + ')';
              };

              var additionalLabel = center.selectAll('text .additional-label').data(pie(data));
              additionalLabel.enter().append('text').attr('class', 'additional-label')
                .style('text-anchor', 'middle')
                .attr('fill', function (d, i) {
                  return additionalLabelRadius > 1 ? colorScale(i) : 'white';
                })
                .attr('class', function (d, i) {
                  return 'pie-label pie-label-' + i;
                });
              additionalLabel.exit().remove();
              additionalLabel.text(function (d, i) {
                if (data[i][options.value]){
                  return data[i][options.additionalLabel];
                } else {
                  return '';
                }
              });

              additionalLabel.attr('transform', getAdditionalPosition);
            }

            label.attr('transform', getPosition);
          }
        };

        return chartController.registerElement(redraw, options.order);
      }
    };
  });
})();
