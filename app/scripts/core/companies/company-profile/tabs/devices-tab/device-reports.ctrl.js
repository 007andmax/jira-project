'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.deviceReports',
    ['$scope', 'DevicesService', '$stateParams', '$filter', function ($scope, DevicesService, $stateParams, $filter) {

      $scope.isNotEmptyObject = isNotEmptyObject;
      $scope.isReportClosed = [];

      DevicesService.getAgentsByCompany($scope, $stateParams.companyId, function (resp) {
        $scope.agents = resp;
      });

      $scope.closeReport = function (index) {
        $scope.isReportClosed[index] = true;
        if ($scope.isReportClosed.every(function (isClosed) {
            return isClosed;
          })) {
          $scope.close();
        }
      };

      $scope.userReadable = function (str) {
        return str.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
          return str.toUpperCase();
        })
      };

      $scope.getDeviceNameByAgentId = function (agentId) {
        if ($scope.agents && $scope.agents.length) {
          var agent = $scope.agents.find(function (agent) {
            return agent.agentId === agentId;
          });

          return agent.hostName || agent.ip;
        } else {
          return '';
        }
      };

      $scope.qtIsArray = function (item) {
        return Array.isArray(item);
      };

      $scope.qtIsObject = function (item) {
        return typeof item === 'object' && !Array.isArray(item);
      };

      $scope.formatValueIfNeeded = function (value, name) {
        if (name.search(/size|capacity/i) !== -1) {
          return $filter('fileSizeFilter')(value);
        } else if ((value === 1 || value === 0) && name.search(/enabled|shared/i) !== -1) {
          return value ? 'Yes' : 'No';
        } else {
          return value;
        }
      };

      function isNotEmptyObject(obj) {
        for (var prop in obj) {
          var value = obj[prop];
          if (Array.isArray(value)) {
            if (value.length) {
              return true;
            }
          } else if ($scope.qtIsObject(value)) {
            if (isNotEmptyObject(value)) {
              return true;
            }
          } else if (value) {
            return true;
          }
        }
        return false;
      }

    }]);

}());
