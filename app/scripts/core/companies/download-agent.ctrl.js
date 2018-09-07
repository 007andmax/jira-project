'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.downloadAgentModal',
    ['$scope', '$uibModalInstance', '$rootScope',
      function ($scope, $uibModalInstance, $rootScope) {
        $scope.launchApp = $rootScope.launchRemoteApp;
        // $scope.getCounter = getCounter;

        $scope.close = $uibModalInstance.dismiss;

        $scope.$watch(function() {
          return $rootScope.companyForDownload;
        }, function(val) {
          $scope.company = val;
        })



      }]);
}());
