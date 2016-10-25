'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.billingDashboardCtrl',
    ['$scope', '$filter', 'StatisticsService', 'CompaniesService', 'UsersService', '$timeout',
      function ($scope, $filter, StatisticsService, CompaniesService, UsersService, $timeout) {
        var lastRange;
        $scope.loading = false;
        $scope.dateRange = [];
        $scope.shownDateRange = '';
        $scope.dashboard = {};
        $scope.startDashboard = {};
        $scope.allDashboards = [];
        $scope.totalOverdueTicks = ['30 days', '60 days', '90+ days'];
        $scope.revenueLegend = ['Services', 'Products'];
        $scope.currentCompany = CompaniesService.getCurrentCompany();

        getStatistic();

        $scope.getStatistic = getStatistic;
        $scope.getCompanyById = CompaniesService.getOneById;
        $scope.getPrimaryContact = function (companyId) {
          return UsersService.getAllByCompanyId(companyId).find(function (user) {
            return user.isContact;
          });
        };

        $scope.onDateRangeChange = function (dates) {
          if (dates.length > 0) {
            $scope.dateRange = angular.copy(dates);
            $scope.shownDateRange = $scope.dateRange.map(function (date) {
              return $filter('date')(date, 'dd MMM yyyy')
            }).join(' - ');
          } else {
            $scope.dateRange = [];
            $scope.shownDateRange = '';
          }
        };

        $scope.xFilter = function (data) {
          var result = [];

          for (var i = data.regular.length - 1; i < data.regular.length; i++) {
            var array = data.regular[i];
            for (var j = 0; j < array.length; j++) {
              var item = array[j];
              result.push(item.date);
            }
          }

          return result;
        };

        $scope.yFilter = function (data) {
          var result = [];

          for (var group in data) {
            for (var i = 0; i < data[group].length; i++) {
              var array = data[group][i];
              for (var j = 0; j < array.length; j++) {
                var item = array[j];
                result.push(item.y);
              }
            }
          }

          return result;
        };

        $scope.isStackedBarsShown = function (groupedData) {
          var result = false;

          for (var group in groupedData) {
            var data = groupedData[group];

            for (var i = 0; i < data.length; i++) {
              var array = data[i];
              for (var j = 0; j < array.length; j++) {
                var item = array[j];
                if (item.y) {
                  return true;
                }
              }
            }
          }

          return result;
        };

        $scope.clearDateRangeAndReload = function (event) {
          event.stopPropagation();
          $scope.clearDateRange();
          $timeout(function () { getStatistic(); });
        };

        function isRestrictionChanged(range) {
          if (!lastRange) {
            return true;
          }

          if (lastRange.length === range.length) {
            if (range.length === 0) {
              return false;
            } else if (range.length === 1) {
              return lastRange[0].getTime() !== range[0].getTime();
            }

            return lastRange[0].getTime() !== range[0].getTime() || lastRange[1].getTime() !== range[1].getTime();
          }

          return true;
        }

        function getStatistic() {
          if (isRestrictionChanged($scope.dateRange)) {
            lastRange = angular.copy($scope.dateRange);
            $scope.loading = true;
            StatisticsService.getBillingDashboard(lastRange[0], lastRange[1], function (resp) {
              $scope.allDashboards = angular.copy(resp);
              if (resp.length > 1) {
                $scope.startDashboard = $scope.allDashboards.shift();
              } else {
                $scope.startDashboard = undefined;
              }
              $scope.dashboard = $scope.allDashboards[$scope.allDashboards.length - 1];
              $scope.dashboard.totalProjection = $scope.dashboard.totalSales + $scope.dashboard.totalReceivable;

              if ($scope.allDashboards.length > 366) {
                $scope.dateFormat = '%Y';
              } else if ($scope.allDashboards.length > 31) {
                $scope.dateFormat = '%b %Y';
              } else if ($scope.allDashboards.length > 20) {
                $scope.dateFormat = '%d/%m';
              } else {
                $scope.dateFormat = '%d %b';
              }

              var oneThirty = $scope.dashboard.totalOverDue.ONE_THIRTY;
              var thirtySixty = $scope.dashboard.totalOverDue.THIRTY_SIXTY;
              var sixtyPlus = $scope.dashboard.totalOverDue.SIXTY_PLUS;

              if (oneThirty || thirtySixty || sixtyPlus) {
                $scope.totalOverdueData = [
                  { group: '30 days', y: Math.round(oneThirty) },
                  { group: '60 days', y: Math.round(thirtySixty) },
                  { group: '90+ days', y: Math.round(sixtyPlus) }
                ];
                $scope.dashboard.overdueSum = oneThirty + thirtySixty + sixtyPlus;
                $scope.noTotalOverdueData = false;
              } else {
                $scope.noTotalOverdueData = true;
              }

              $scope.managedNonManagedData = getDataForStackedBarsChart(resp);
              $scope.managedNonManagedTicks = $scope.managedNonManagedData.regular[0].map(function (item) {
                return item.date
              });

              var length = $scope.managedNonManagedTicks.length;
              if (length >= 20) {
                $scope.barsWidth = 5;
              } else if (length >= 15) {
                $scope.barsWidth = 7;
              } else if (length >= 10) {
                $scope.barsWidth = 10;
              } else {
                $scope.barsWidth = 15;
              }

              var product = $scope.dashboard.revenueByExpenseType.PRODUCT;
              var service = $scope.dashboard.revenueByExpenseType.SERVICE;
              var revenueSum = product + service;
              if (product || service) {
                $scope.revenue = [{
                  percents: Math.round(product * 100 / revenueSum)
                }, {
                  percents: Math.round(service * 100 / revenueSum)
                }];
                $scope.noRevenue = false;
              } else {
                $scope.noRevenue = true;
              }

              var revenueByPaymentMethod = $scope.dashboard.revenueByPaymentMethod, sum = 0;
              for (var method in revenueByPaymentMethod) {
                sum += revenueByPaymentMethod[method];
              }

              $scope.revenueByMethod = [{
                method: 'Cash', percents: Math.round($scope.dashboard.revenueByPaymentMethod.CASH * 100 / sum)
              }, {
                method: 'Cheque', percents: Math.round($scope.dashboard.revenueByPaymentMethod.CHEQUE * 100 / sum)
              }, {
                method: 'Credit Card',
                percents: Math.round($scope.dashboard.revenueByPaymentMethod.CREDIT_CARD * 100 / sum)
              }, {
                method: 'Debit Card',
                percents: Math.round($scope.dashboard.revenueByPaymentMethod.DEBIT_CARD * 100 / sum)
              }, {
                method: 'Wire Transfer',
                percents: Math.round($scope.dashboard.revenueByPaymentMethod.WIRE_TRANSFER * 100 / sum)
              }];

              $scope.totalReceivableData = getDataForLineChart($scope.allDashboards, 'totalReceivable');
              $scope.totalReceivableTicks = $scope.totalReceivableData.map(function (item) {
                return item.date;
              });

              $scope.totalInvoicableData = getDataForLineChart($scope.allDashboards, 'totalInvoicable');
              $scope.totalInvoicableTicks = $scope.totalInvoicableData.map(function (item) {
                return item.date;
              });

              for (var i = 0; i < $scope.allDashboards.length; i++) {
                var dashboard = $scope.allDashboards[i],
                  lastDashboard = $scope.allDashboards[i - 1] || $scope.startDashboard;
                dashboard.totalProjection = (dashboard.totalSales - lastDashboard.totalSales) + dashboard.totalReceivable;
              }
              $scope.totalProjectionData = getDataForLineChart($scope.allDashboards, 'totalProjection');
              $scope.totalProjectionTicks = $scope.totalProjectionData.map(function (item) {
                return item.date;
              });

              $scope.loading = false;
            })
          }
        }

        function getDataForLineChart(data, property, transformer) {
          var result = [], lastMonth, lastYear,
            groupedForMonth = 0,
            groupedForYear = 0,
            counter = 0;

          for (var i = 0; i < data.length; i++) {
            var item = data[i],
              currentDate = new Date(item.date);

            if (data.length > 366) {
              if (!lastYear) {
                lastYear = currentDate.getFullYear();
              }

              if (lastYear !== currentDate.getFullYear()) {
                currentDate.setDate(1);
                currentDate.setMonth(0);
                currentDate.setFullYear(lastYear);
                result.push({ date: currentDate, total: parseFloat((groupedForYear / counter).toFixed(2)) });
                lastYear = undefined;
                counter = 0;
                groupedForYear = 0;
              }

              groupedForYear += transformer ? transformer(item[property]) : item[property];
              counter++;

              if (i === data.length - 1) {
                currentDate.setDate(1);
                currentDate.setMonth(0);
                currentDate.setFullYear(lastYear);
                result.push({ date: currentDate, total: parseFloat((groupedForYear / counter).toFixed(2)) });
                lastYear = undefined;
                counter = 0;
                groupedForYear = 0;
              }
            } else if (data.length > 31) {
              if (!lastMonth) {
                lastMonth = currentDate.getMonth();
              }

              if (lastMonth !== currentDate.getMonth()) {
                currentDate.setDate(1);
                currentDate.setMonth(lastMonth);
                result.push({ date: currentDate, total: parseFloat((groupedForMonth / counter).toFixed(2)) });
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }

              groupedForMonth += transformer ? transformer(item[property]) : item[property];
              counter++;

              if (i === data.length - 1) {
                currentDate.setDate(1);
                currentDate.setMonth(lastMonth);
                result.push({ date: currentDate, total: parseFloat((groupedForMonth / counter).toFixed(2)) });
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }
            } else {
              result.push({ date: currentDate, total: transformer ? transformer(item[property]) : item[property] });
            }
          }

          return result;
        }

        function getDataForStackedBarsChart(data) {
          return {
            regular: getValues(data, 'revenueByInvoiceType.REGULAR'),
            recurring: getValues(data, 'revenueByInvoiceType.RECURRING')
          };
        }

        function getValues(data, path) {
          var result = [[], []],
            splitPath = path.split('.'),
            lastMonth,
            lastYear,
            lastItem,
            productExpense = 0,
            serviceExpense = 0;

          for (var i = 1; i <= data.length; i++) {
            var item = data[i - 1],
              currentDate = data[i] ? new Date(data[i].date) : undefined;

            for (var j = 0; j < splitPath.length; j++) {
              var property = splitPath[j];
              item = item[property];
            }

            if (!lastItem) {
              lastItem = item;
              continue;
            }

            if (data.length > 366) {
              if (!lastYear) {
                lastYear = new Date(data[i - 1].date).getFullYear();
              }

              if (!currentDate || lastYear !== currentDate.getFullYear()) {
                currentDate.setDate(1);
                currentDate.setMonth(0);
                currentDate.setFullYear(lastYear);

                productExpense = parseFloat((item.productExpenseSum - lastItem.productExpenseSum).toFixed(2));
                serviceExpense = parseFloat((item.serviceExpenseSum - lastItem.serviceExpenseSum).toFixed(2));
                result[0].push({
                  date: currentDate,
                  y: productExpense
                });
                result[1].push({
                  date: currentDate,
                  y: serviceExpense
                });
                lastYear = undefined;
                lastItem = item;
              }
            } else if (data.length > 31) {
              if (!lastMonth) {
                lastMonth = new Date(data[i - 1].date).getMonth();
              }

              if (!currentDate || lastMonth !== currentDate.getMonth()) {
                currentDate = currentDate || new Date(data[i - 1].date);
                currentDate.setDate(1);
                currentDate.setMonth(lastMonth);

                productExpense = parseFloat((item.productExpenseSum - lastItem.productExpenseSum).toFixed(2));
                serviceExpense = parseFloat((item.serviceExpenseSum - lastItem.serviceExpenseSum).toFixed(2));
                result[0].push({
                  date: currentDate,
                  y: productExpense
                });
                result[1].push({
                  date: currentDate,
                  y: serviceExpense
                });
                lastMonth = undefined;
                lastItem = item;
              }
            } else {
              currentDate = currentDate || new Date(data[i - 1].date);
              productExpense = parseFloat((item.productExpenseSum - lastItem.productExpenseSum).toFixed(2));
              serviceExpense = parseFloat((item.serviceExpenseSum - lastItem.serviceExpenseSum).toFixed(2));
              result[0].push({
                date: currentDate,
                y: productExpense
              });
              result[1].push({
                date: currentDate,
                y: serviceExpense
              });

              lastItem = item;
            }
          }

          if (result[0][0]) {
            var fakeObj1 = { date: new Date(result[0][0].date), y: 0 };
            var fakeObj2 = { date: new Date(result[1][result[1].length - 1].date), y: 0 };
            if (data.length > 366) {
              fakeObj1.date.setFullYear(fakeObj1.date.getFullYear() - 1);
              fakeObj2.date.setFullYear(fakeObj2.date.getFullYear() + 1);
            } else if (data.length > 31) {
              fakeObj1.date.setMonth(fakeObj1.date.getMonth() - 1);
              fakeObj2.date.setMonth(fakeObj2.date.getMonth() + 1);
            } else {
              fakeObj1.date.setDate(fakeObj1.date.getDate() - 1);
              fakeObj2.date.setDate(fakeObj2.date.getDate() + 1);
            }

            result[0].unshift(fakeObj1);
            result[1].unshift(fakeObj1);
            result[0].push(fakeObj2);
            result[1].push(fakeObj2);
          }

          return result;
        }

      }]);
}());
