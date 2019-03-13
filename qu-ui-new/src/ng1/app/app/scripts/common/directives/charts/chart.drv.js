'use strict';

(function () {
  angular.module('quicktech.common.directives').directive('d3chart', function() {
    return {
      restrict: 'EA',
      scope: {
        margin: '=',
        data: '=',
        onFinishRendering: '=?'
      },
      controller: [
        '$scope', '$element', '$attrs', '$window', '$timeout', '$rootScope', function($scope, $el, $attrs, $window, $timeout, $rootScope) {
          var chart, debounce, elements, height, scales, sortOrder, svg, updateSize, width;
          scales = $scope.scales = {};
          elements = $scope.elements = [];
          this.margin = $scope.margin || {
              top: 10,
              right: 10,
              bottom: 10,
              left: 10
            };

          svg = d3.select($el[0]).append('svg').attr('class', "d3").attr("width", "100%").attr("height", "100%");

          width = function() {
            return $el[0].offsetWidth;
          };
          height = function() {
            return $el[0].offsetHeight;
          };

          if (typeof $attrs.isCenter === 'string') {
            var center = width() / 2 - Math.min(width(), height()) / 2 + this.margin.left + 20;
            chart = svg.append("g").attr("transform", "translate(" + center + "," + this.margin.top + ")");
          } else {
            chart = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
          }

          this.getSvg = function() {
            return svg;
          };

          this.getChart = function() {
            return chart;
          };

          this.addScale = function(name, scale, update) {
            return scales[name] = {
              scale: scale,
              update: update
            };
          };

          this.getScale = function(name) {
            return scales[name].scale;
          };

          this.registerElement = function(el, order) {
            if (order == null) {
              order = 0;
            }
            return elements.push({
              redraw: el,
              order: Number(order)
            });
          };

          updateSize = (function(_this) {
            return function() {
              $timeout(function () {
                if (_this.width !== width() || _this.height !== height()) {
                  _this.width = width();
                  _this.height = height();
                  _this.innerWidth = _this.width - _this.margin.left - _this.margin.right;
                  _this.innerHeight = _this.height - _this.margin.top - _this.margin.bottom;
                  if (typeof $attrs.isCenter === 'string') {
                    var center = width() / 2 - Math.min(width(), height()) / 2 + $scope.margin.left + 20;
                    chart.attr("transform", "translate(" + center + "," + $scope.margin.top + ")");
                  }
                  return _this.redraw();
                }
              });
            };
          })(this);

          sortOrder = function(a, b) {
            return a.order - b.order;
          };
          debounce = null;

          this.redraw = (function(_this) {
            return function() {
              if (debounce || _this.width === 0 || _this.height === 0) {
                return;
              }
              return debounce = $timeout(function() {
                var data, element, i, len, name, ref, results, scale;
                debounce = null;
                data = $scope.data;
                for (name in scales) {
                  scale = scales[name];
                  scale.update(data);
                }
                ref = elements.sort(sortOrder);
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                  element = ref[i];
                  results.push(element.redraw(data));
                }

                $scope.onFinishRendering && $timeout(function () {
                  $scope.onFinishRendering('chart');
                }, 300);
                return results;
              }, $attrs.updateInterval || 200);
            };
          })(this);

          $window.addEventListener('resize', updateSize);

          if ($attrs.watch === 'deep') {
            $scope.$watch('data', this.redraw, true);
          } else {
            $scope.$watch('data', this.redraw);
          }

          // cpu killer
          // $scope.$watch(updateSize);
          $rootScope.$watch('isLeftPanelHidden', function (nextValue, oldValue) {
            if (oldValue !== nextValue) {
              $timeout(updateSize, 220);
            }
          });
          updateSize();
        }
      ]
    };
  });
})();
