'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProductReportCtrl',
    ['$scope', '$rootScope', '$timeout', 'quicktech.common.services.PermissionsService',
      function ($scope, $rootScope, $timeout, PermissionsService ) {

        $scope.PermissionsService = PermissionsService;

        $scope.selectedLines = [];
        $scope.selectedLinesIds = {};
        var lineId = 0;
        $rootScope.reportLineChanged = false;

        $scope.selectLine = function(line) {


          var ind = $scope.selectedLines.indexOf(line);
          if (ind === -1) {
            $scope.selectedLines.push(line);
            $scope.selectedLinesIds[line.lineId] = true;
          } else {
            $scope.selectedLines.splice(ind, 1);
            $scope.selectedLinesIds[line.lineId] = false;
          }
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

        $scope.selectAllLines = function() {
          if( $scope.selectedLines.length < 1 || $scope.selectedLines.length !== $scope.reportByProducts.lines.length) {
            $scope.selectedLines = [];
            $scope.reportByProducts.lines.forEach(function(line) {
              line.lineId = lineId;
              $scope.selectedLines.push(line);
              lineId++;
              $scope.selectedLinesIds[line.lineId] = true;
            });

            $timeout(function () {
              $rootScope.reportLineChanged = true;
            }, 1000);

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
