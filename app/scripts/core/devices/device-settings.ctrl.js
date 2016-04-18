'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.deviceSettingsCtrl',
    ['$scope', 'DevicesService',
      function ($scope, DevicesService) {
        $scope.newCredential = {};
      }]);

}());
