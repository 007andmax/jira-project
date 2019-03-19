'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProductReportCtrl',
    ['$scope', '$rootScope', '$timeout', 'quicktech.common.services.PermissionsService', '$filter',
      function ($scope, $rootScope, $timeout, PermissionsService, $filter ) {

        $scope.PermissionsService = PermissionsService;
        $scope.purchaseCostSum = 0;
        $scope.salesPriceSum = 0;


        $scope.selectedLines = [];
        $scope.selectedLinesIds = {};
        var lineId = 0;
        $rootScope.reportLineChanged = false;

        $scope.sortBy = sortBy;
        $scope.reverse = false;
        $scope.sortProps = ['date', 'ticketNumber']

        $scope.selectLine = function(line) {
          var ind = $scope.selectedLines.indexOf(line);
          if (ind === -1) {
            $scope.selectedLines.push(line);
            $scope.selectedLinesIds[line.lineId] = true;
          } else {
            $scope.selectedLines.splice(ind, 1);
            $scope.selectedLinesIds[line.lineId] = false;
          }
          calculateSumPrices()
          $timeout(function () {
            $rootScope.reportLineChanged = true;
          }, 1000);
        };

        $scope.isLineSelected = function(line) {
          return  $scope.selectedLines.indexOf(line) === -1
        };

        $scope.elementChecker = function(line) {
          return !$scope.selectedLinesIds[line.lineId]
        }

        $scope.$watch(function() {
          return $rootScope.isPurchaseShown
        }, function(val) {
          $scope.isPurchaseShown = val;

        })

        $scope.selectAllLines = function() {
          if( $scope.selectedLines.length < 1 || $scope.selectedLines.length !== $scope.reportByProducts.lines.length) {
            $scope.selectedLines = [];
            $scope.reportByProducts.lines.forEach(function(line) {
              line.lineId = lineId;
              $scope.selectedLines.push(line);
              lineId++;
              $scope.selectedLinesIds[line.lineId] = true;
            });

            calculateSumPrices()

            $timeout(function () {
              $rootScope.reportLineChanged = true;
            }, 1000);

          } else {
            $scope.reportByProducts.lines.forEach(function(line){
              $scope.selectedLinesIds[line.lineId] = false;
            });
            $scope.selectedLines = [];
            calculateSumPrices()
          }
        };

        $scope.isAllLinesAreChecked = function() {
          return $scope.selectedLines.length === $scope.reportByProducts.lines.length
        }


        function calculateSumPrices(){
          if($scope.selectedLines.length > 0) {
            $scope.purchaseCostSum = 0;
            $scope.salesPriceSum = 0;
            for(var i=0; i<$scope.selectedLines.length; i++) {
              $scope.purchaseCostSum +=$scope.selectedLines[i].purchaseCost;
              $scope.salesPriceSum += $scope.selectedLines[i].salePrice;
            }
          }
        }


        var sortByFew;

        (function() {
          var default_cmp = function(a, b) {
              if (a == b) return 0;
              return a < b ? -1 : 1;
            },
            getCmpFunc = function(primer, reverse) {
              var dfc = default_cmp,
                cmp = default_cmp;
              if (primer) {
                cmp = function(a, b) {
                  return dfc(primer(a), primer(b));
                };
              }
              if (reverse) {
                return function(a, b) {
                  return -1 * cmp(a, b);
                };
              }
              return cmp;
            };

          sortByFew = function() {
            var fields = [],
              n_fields = arguments.length,
              field, name, reverse, cmp;

            for (var i = 0; i < n_fields; i++) {
              field = arguments[i];
              if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
              }
              else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
              }
              fields.push({
                name: name,
                cmp: cmp
              });
            }

            return function(A, B) {
              var a, b, name, result;
              for (var i = 0; i < n_fields; i++) {
                result = 0;
                field = fields[i];
                name = field.name;

                result = field.cmp(A[name], B[name]);
                if (result !== 0) break;
              }
              return result;
            }
          }
        }());


        function sortBy(props) {
          var prop1 = props[0];
          var prop2 = props[1];

          $timeout(function () {
            $rootScope.reportLineChanged = true;
          }, 1000);

          if ($scope.sortProps[0] !== props[0]) {
            $scope.reverse = false;
          } else {
            $scope.reverse = !$scope.reverse;
          }

          $scope.sortProps = props;
          if (!prop2) {
            $scope.reportByProducts.lines = separateEmpty($scope.reportByProducts.lines, prop1);
          } else {
            $scope.reportByProducts.lines.sort(sortByFew({name: prop1, reverse: $scope.reverse}, { name: prop2, reverse: $scope.reverse, primer: parseInt }));
          }


        }

        function separateEmpty(array, prop) {
          var toSort = [];
          var result = [];
          var reverse = $scope.reverse;

          for (var i = 0; i < array.length; i++) {
            var el = array[i];

            if (!el[prop] && el[prop] !== 0) {
              result.push(el);
            } else {
              toSort.push(el);
            }
          }

          if (!toSort.some(function(el) {
            return +el[prop] != el[prop];
          })) {
            reverse = !reverse;
          }
          //check for numbers
          // reverse = (+toSort[0][prop] == toSort[0][prop]) ? !$scope.reverse : $scope.reverse;

          toSort = $filter('orderBy')(toSort, prop, reverse);

          toSort.forEach(function(el) {
            result.push(el);
          })

          return result;
        }

        if ($scope.reportByProducts.lines) {
          $scope.selectedLines = [];
          $scope.selectAllLines();
          $scope.reportByProducts.lines = $scope.reportByProducts.lines.map(function(line) {
            if (line.invoiceNumber) {
              line.invoiceNumber = +line.invoiceNumber;
            }

            if (line.ticketNumber) {
              line.ticketNumber = +line.ticketNumber;
            }

            return line;
          })

          sortBy($scope.sortProps);
        }


      }]);


}());
