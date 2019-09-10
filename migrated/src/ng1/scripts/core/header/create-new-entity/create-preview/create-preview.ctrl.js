'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editPreviewCtrl',
    ['$scope','$rootScope', '$timeout',
      function ($scope,$rootScope, $timeout) {
        $scope.showModal = false;
        $scope.img_url = '/file/' + $rootScope.fileId;
        $timeout(function () {
          $scope.showModal = true;
        }, 50)
      }]);

}());
