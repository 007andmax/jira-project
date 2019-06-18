'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editPreviewCtrl',
    ['$scope', '$timeout',
      function ($scope, $timeout) {
        $scope.showModal = false;
        $scope.img_url = '/file/' + window.localStorage.getItem('file-id');
        $timeout(function () {
          $scope.showModal = true;
        }, 50)
      }]);

}());
