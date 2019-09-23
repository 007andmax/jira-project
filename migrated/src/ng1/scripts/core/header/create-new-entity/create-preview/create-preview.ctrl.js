'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.editPreviewCtrl',
    ['$scope', '$rootScope', '$timeout',
      function ($scope, $rootScope, $timeout) {
        $scope.showModal = false;
        var img = new Image();
        img.onload = function () {
         
          if (620 < this.width) {
            document.body.querySelector('.modal-dialog').classList.add('big-preview-photo');
            document.body.querySelector('.modal-dialog').classList.remove('small-preview-photo');
         
          } else {
            document.body.querySelector('.modal-dialog').classList.add('small-preview-photo');
            document.body.querySelector('.modal-dialog').classList.remove('big-preview-photo');
          }
        }
        img.src = '/file/' + $rootScope.fileId;
        $scope.img_url = '/file/' + $rootScope.fileId;
        $timeout(function () {
          $scope.showModal = true;
        }, 50)
      }]);

}());
