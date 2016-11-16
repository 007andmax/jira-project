'use strict';

(function () {

  angular.module('quicktech.core.dashboards').controller('quicktech.core.dashboards.billingDashboardCtrl',
    ['$scope', '$filter', 'StatisticsService', 'CompaniesService', 'UsersService', '$timeout',
      function ($scope, $filter, StatisticsService, CompaniesService, UsersService, $timeout) {
        var lastRange;
        $scope.loading = false;
        $scope.dateRange = [];
        $scope.maxDate = Date.now();
        $scope.shownDateRange = '';
        $scope.dashboard = {};
        $scope.startDashboard = {};
        $scope.allDashboards = [];
        $scope.totalOverdueTicks = ['30 days', '60 days', '90+ days'];
        $scope.revenueLegend = {'Services': 0, 'Products': 0};
        $scope.currentCompany = CompaniesService.getCurrentCompany();

        $scope.chartTooltips = {
          totalProjection: 'Shows a potential income in the system during a selected period.\n Calculates as the sum of total sales, total receivables and total invoiceable\n during a selected period.',
          totalSales: 'Shows an amount of money that has already been received from invoices\n during a selected period (includes taxes).',
          taxCollected: 'Shows an amount of taxes from total sales during a selected period.',
          totalReceivables: 'Shows an amount of money that has been sent to clients as invoices\n and are waiting to be received during a selected period (includes taxes).',
          invoiceable: 'Shows an amount of money in closed tickets\n that have not been sent as invoices to clients yet\n during a selected period.',
          monthlySales: 'Shows an amount of money that has already been received from invoices\n during the current month (includes taxes).',
          totalOverdue: 'Shows an amount of money in outstanding invoices.',
          managedNonManaged: 'Shows an amount of total sales sorted by a type of invoice:\n fixed and recurring. Each type of invoice is sorted by products and services.\n During a selected period.',
          revenue: 'Shows an amount and percentage of total sales\n sorted by products and services. During a selected period.',
          revenueByPaymentMethod: 'Shows an amount and percentage of total sales sorted by type of payment:\n cash, cheque, debit card, credit card or wire transfer.\n During a selected period.',
          topCompanies: 'Top-10 companies sorted by generated income. During a selected period.'
        };

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

              var product = $scope.dashboard.revenueByExpenseType.PRODUCT,
                service = $scope.dashboard.revenueByExpenseType.SERVICE,
                firstProduct = $scope.startDashboard ? $scope.startDashboard.revenueByExpenseType.PRODUCT : 0,
                firstService = $scope.startDashboard ? $scope.startDashboard.revenueByExpenseType.SERVICE : 0;

              var productDiff = product - firstProduct,
                serviceDiff = service - firstService,
                revenueSum = (productDiff + serviceDiff) || 1;
              if (productDiff || serviceDiff) {
                $scope.revenue = [{
                  percents: Math.round(productDiff * 100 / revenueSum)
                }, {
                  percents: Math.round(serviceDiff * 100 / revenueSum)
                }];
                $scope.revenueLegend['Products'] = productDiff;
                $scope.revenueLegend['Services'] = serviceDiff;
                $scope.noRevenue = false;
              } else {
                $scope.noRevenue = true;
              }

              $scope.revenueByMethod = [];
              var revenueByPaymentMethod = $scope.dashboard.revenueByPaymentMethod, sum = 0;
              for (var method in revenueByPaymentMethod) {
                var lastRevenue = revenueByPaymentMethod[method];
                var firstRevenue = $scope.startDashboard ? $scope.startDashboard.revenueByPaymentMethod[method] : 0;
                var diff = lastRevenue - firstRevenue;
                sum += diff;

                var formattedMethod = method.split('_').join(' ');
                formattedMethod = formattedMethod.charAt(0).toUpperCase() + formattedMethod.slice(1).toLowerCase();
                $scope.revenueByMethod.push({ method: formattedMethod, percents: diff * 100, amount: diff });
              }

              var others = 0, othersAmount = 0;
              for (var u = 0; u < $scope.revenueByMethod.length; u++) {
                var item = $scope.revenueByMethod[u];
                item.percents = Math.round(item.percents / sum);

                if (item.percents <= 3) {
                  others += item.percents;
                  othersAmount += item.amount;
                  $scope.revenueByMethod.splice(u, 1);
                  u--;
                }
              }

              if (others) {
                $scope.revenueByMethod.push({ method: 'Others', percents: others, amount: othersAmount });
              }

              $scope.revenueByMethod.sort(function (a, b) {
                return b.percents - a.percents;
              });

              $scope.totalReceivableData = getDataForLineChart($scope.allDashboards, 'totalReceivable');
              $scope.totalReceivableTicks = $scope.totalReceivableData.map(function (item) {
                return item.date;
              });

              $scope.totalInvoiceableData = getDataForLineChart($scope.allDashboards, 'totalInvoiceable');
              $scope.totalInvoiceableTicks = $scope.totalInvoiceableData.map(function (item) {
                return item.date;
              });

              for (var i = 0; i < $scope.allDashboards.length; i++) {
                var dashboard = $scope.allDashboards[i],
                  lastDashboard = $scope.allDashboards[i - 1] || $scope.startDashboard;
                dashboard.totalProjection = (dashboard.totalSales - (lastDashboard ? lastDashboard.totalSales : 0)) + dashboard.totalReceivable + dashboard.totalInvoiceable;
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
                result.push({ date: currentDate, total: parseFloat((groupedForYear / (counter || 1)).toFixed(2)) });
                lastYear = undefined;
                counter = 0;
                groupedForYear = 0;
              }

              groupedForYear += transformer ? transformer(item[property]) : item[property];
              counter++;

              if (i === data.length - 1) {
                currentDate = new Date(item.date);
                currentDate.setDate(1);
                currentDate.setMonth(0);
                result.push({ date: currentDate, total: parseFloat((groupedForYear / (counter || 1)).toFixed(2)) });
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
                result.push({ date: currentDate, total: parseFloat((groupedForMonth / (counter || 1)).toFixed(2)) });
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }

              groupedForMonth += transformer ? transformer(item[property]) : item[property];
              counter++;

              if (i === data.length - 1) {
                currentDate = new Date(item.date);
                currentDate.setDate(1);
                result.push({ date: currentDate, total: parseFloat((groupedForMonth / (counter || 1)).toFixed(2)) });
                lastMonth = undefined;
                counter = 0;
                groupedForMonth = 0;
              }
            } else {
              result.push({ date: currentDate, total: transformer ? transformer(item[property]) : parseFloat(item[property].toFixed(2)) });
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
            serviceExpense = 0,
            item,
            currentDate;

          var firstResult = result[0];
          var secondResult = result[1];
          for (var i = 0; i < data.length; i++) {
            item = data[i];
            currentDate = data[i + 1] ? new Date(data[i + 1].date) : undefined;

            for (var j = 0; j < splitPath.length; j++) {
              var property = splitPath[j];
              item = item[property];
            }

            if (!lastItem) {
              lastItem = item;
              if (currentDate) {
                lastMonth = currentDate.getMonth();
                lastYear = currentDate.getFullYear();
              }
              continue;
            }

            if (!currentDate) {
              currentDate = new Date(data[i].date);
            }

            if (data.length - 1 > 366) {

              if (i === data.length - 1 || lastYear !== currentDate.getFullYear()) {

                var saveCurrentYear = currentDate.getFullYear();
                currentDate.setDate(1);
                currentDate.setMonth(0);
                currentDate.setFullYear(lastYear);

                productExpense = parseFloat((item.productExpenseSum - lastItem.productExpenseSum).toFixed(2));
                serviceExpense = parseFloat((item.serviceExpenseSum - lastItem.serviceExpenseSum).toFixed(2));
                firstResult.push({
                  date: currentDate,
                  y: productExpense
                });
                secondResult.push({
                  date: currentDate,
                  y: serviceExpense
                });

                lastYear = saveCurrentYear;
                lastItem = item;
              }
            } else if (data.length - 1 > 31) {

              if (i === data.length - 1 || lastMonth !== currentDate.getMonth()) {

                var saveCurrentMonth = currentDate.getMonth();
                currentDate.setDate(1);
                currentDate.setMonth(lastMonth);

                productExpense = parseFloat((item.productExpenseSum - lastItem.productExpenseSum).toFixed(2));
                serviceExpense = parseFloat((item.serviceExpenseSum - lastItem.serviceExpenseSum).toFixed(2));
                firstResult.push({
                  date: currentDate,
                  y: productExpense
                });
                secondResult.push({
                  date: currentDate,
                  y: serviceExpense
                });

                lastMonth = saveCurrentMonth;
                lastItem = item;
              }
            } else {
              if (data.length > 2 && i !== data.length - 1) {
                currentDate.setDate(currentDate.getDate() - 1);
              }

              productExpense = parseFloat((item.productExpenseSum - lastItem.productExpenseSum).toFixed(2));
              serviceExpense = parseFloat((item.serviceExpenseSum - lastItem.serviceExpenseSum).toFixed(2));
              firstResult.push({
                date: currentDate,
                y: productExpense
              });
              secondResult.push({
                date: currentDate,
                y: serviceExpense
              });

              lastItem = item;
            }
          }

          if (data.length === 1) {
            item = data[0];
            currentDate = new Date(item.date);

            for (var k = 0; k < splitPath.length; k++) {
              var prop = splitPath[k];
              item = item[prop];
            }
            firstResult.push({
              date: currentDate,
              y: parseFloat((item.productExpenseSum).toFixed(2))
            });
            secondResult.push({
              date: currentDate,
              y: parseFloat((item.serviceExpenseSum).toFixed(2))
            });
          }

          var firstResultStart = firstResult[0];
          var secondResultStart = secondResult[0];
          if (firstResultStart && secondResultStart && firstResultStart.y && secondResultStart.y) {
            var fakeObj1 = { date: new Date(firstResultStart.date), y: 0 };
            if (data.length > 366) {
              fakeObj1.date.setFullYear(fakeObj1.date.getFullYear() - 1);
            } else if (data.length > 31) {
              fakeObj1.date.setMonth(fakeObj1.date.getMonth() - 1);
            } else {
              fakeObj1.date.setDate(fakeObj1.date.getDate() - 1);
            }

            firstResult.unshift(fakeObj1);
            secondResult.unshift(fakeObj1);
          }

          var firstResultEnd = firstResult[firstResult.length - 1];
          var secondResultEnd = secondResult[secondResult.length - 1];
          if (firstResultEnd && secondResultEnd && firstResultEnd.y && secondResultEnd.y) {
            var fakeObj2 = { date: new Date(secondResult[secondResult.length - 1].date), y: 0 };
            if (data.length > 366) {
              fakeObj2.date.setFullYear(fakeObj2.date.getFullYear() + 1);
            } else if (data.length > 31) {
              fakeObj2.date.setMonth(fakeObj2.date.getMonth() + 1);
            } else {
              fakeObj2.date.setDate(fakeObj2.date.getDate() + 1);
            }

            firstResult.push(fakeObj2);
            secondResult.push(fakeObj2);
          }

          return result;
        }

      }]);
}());
