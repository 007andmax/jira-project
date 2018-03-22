'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProductReportCtrl',
    ['$scope',
      function ($scope ) {

        $scope.selectedLines = [];
        $scope.selectedLinesIds = {};
        var lineId = 0;

        $scope.selectLine = function(line) {
          var ind = $scope.selectedLines.indexOf(line);
          if (ind === -1) {
            $scope.selectedLines.push(line);
            $scope.selectedLinesIds[line.lineId] = true;
          } else {
            $scope.selectedLines.splice(ind, 1);
            $scope.selectedLinesIds[line.lineId] = false;
          }
        };

        $scope.isLineSelected = function(line) {
          return  $scope.selectedLines.indexOf(line) === -1
        };

        $scope.selectAllLines = function() {
          if( $scope.selectedLines.length < 1 || $scope.selectedLines.length !== $scope.reportByProducts.lines.length) {
            $scope.selectedLines = [];
            $scope.reportByProducts.lines.forEach(function(line) {
              line.lineId = lineId;
              $scope.selectedLines.push(line);
              lineId++;
              $scope.selectedLinesIds[line.lineId] = true;
            });
          } else {
            $scope.reportByProducts.lines.forEach(function(line){
              $scope.selectedLinesIds[line.lineId] = false;
            });
            $scope.selectedLines = [];

          }
        };

        if($scope.reportByProducts.lines) {
          $scope.selectedLines = [];
          $scope.selectAllLines();
        }

        $scope.isAllLinesAreChecked = function() {
          return $scope.selectedLines.length === $scope.reportByProducts.lines.length
        }

      }]);

}());
