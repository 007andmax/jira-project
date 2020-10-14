'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('chartDataRestriction',
    ['StatisticsService', function (StatisticsService) {
      return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {
          var $window = angular.element(window),
            $document = angular.element(document),
            params,
            lastCanBeShown,
            handledData = [];

          $scope.$watchCollection(getParams, function (value) {
            if (value.every(function (item) {
                return !!item;
              })) {
              params = value;
              getChartData();
            }
          });
          $window.on('resize', recropData);

          $scope.$on('$destroy', function (info) {
            if (info.targetScope && info.targetScope.$id === $scope.$id) {
              $window.off('resize', recropData);
            }
          });

          function recropData() {
            setChartData(handledData);
          }

          function getParams() {
            var arr = [];
            for (var prop in attrs) {
              if (prop.indexOf('param') > -1) {
                arr[parseInt(prop.replace('param', ''))] = $scope[attrs[prop]];
              }
            }
            return arr;
          }

          function getChartData() {
            lastCanBeShown = 0;
            if (attrs.fetchFunc) {
              StatisticsService[attrs.fetchFunc](params, function (data) {
                console.log("attrs",attrs);
                if (attrs.handleData && $scope[attrs.handleData]) {
                  handledData = $scope[attrs.handleData](data);
                } else {
                  handledData = data;
                }
                console.log("handledData",handledData);
                setChartData(handledData);
              });
            } else if ($scope[attrs.handleData]) {
              handledData = $scope[attrs.handleData];
              setChartData(handledData);
            }
          }

          function setChartData(data) {
            var canBeShown = Math.floor(getShownCounts('[chart-wrap]'));

            if (!lastCanBeShown || lastCanBeShown !== canBeShown) {
              if (lastCanBeShown) {
                data.shift();
                data.pop();
              }

              if (canBeShown < data.length - 2) {
                $scope.chartData = addExtremeValues(data.slice(data.length - canBeShown + 2));
              } else {
                $scope.chartData = addExtremeValues(data);
              }
              $scope.chartTicks = $scope.parseDate($scope.chartData);
            }
console.log("$scope.chartData",$scope.chartData);
            lastCanBeShown = canBeShown;
          }

          function getShownCounts(selector) {
            var chartWrap = $document.find(selector);
            if (!chartWrap.length) {
              chartWrap = $element;
            }
            return (chartWrap.width() - attrs.margin) / parseInt(attrs.divider);
          }

          function addExtremeValues(data) {
            if (data && data.length) {
              var start = angular.copy(data[0]);
              var end = angular.copy(data[data.length - 1]);
              start.date = new Date(start.date);
              end.date = new Date(end.date);

              for (var prop in start) {
                if (prop !== 'date') {
                  start[prop] = 0;
                  end[prop] = 0;
                }
              }

              if ($scope.frequency === 'DAILY') {
                start.date.setDate(start.date.getDate() - 1);
                end.date.setDate(end.date.getDate() + 1);
                data.unshift(start);
                data.push(end);
              } else if ($scope.frequency === 'WEEKLY') {
                start.date.setDate(start.date.getDate() - 7);
                end.date.setDate(end.date.getDate() + 7);
                data.unshift(start);
                data.push(end);
              } else if ($scope.frequency === 'MONTHLY') {
                start.date.setDate(1);
                end.date.setDate(1);
                start.date.setMonth(start.date.getMonth() - 1);
                end.date.setMonth(end.date.getMonth() + 1);
                data.unshift(start);
                data.push(end);
              }
            }

            return data;
          }
        }
      }
    }]);
})();
