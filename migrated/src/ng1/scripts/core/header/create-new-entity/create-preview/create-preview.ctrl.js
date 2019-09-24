'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editPreviewCtrl',
    ['$scope', '$rootScope', '$timeout',
      function ($scope, $rootScope, $timeout) {
        $scope.showModal = false;

        $scope.img = new Image();
        $scope.img.onload = function () {
          document.body.querySelector('.modal-dialog').classList.add('preview-photo');
          $scope.showModal = true;
          $("#privew-container").html($scope.img);
          // if (620 < this.width) {
          //   document.body.querySelector('.modal-dialog').classList.add('big-preview-photo');
          //   document.body.querySelector('.modal-dialog').classList.remove('small-preview-photo');
          //
          // } else {
          //   document.body.querySelector('.modal-dialog').classList.add('small-preview-photo');
          //   document.body.querySelector('.modal-dialog').classList.remove('big-preview-photo');
          // }
        }
        $scope.img.src = '/file/' + $rootScope.fileId;

      }]);

}());
