'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("dragUpload", ['$http', function($http) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
          upload: '=uploadFunc'
        },
        require: '?ngModel',
        // template: '<div class="asset-upload">Drag here to upload</div>',
        link: function(scope, element, attrs, ngModel) {
          element.on('dragover', function(e) {
              e.preventDefault();
              e.stopPropagation();
          });
          element.on('dragenter', function(e) {
              e.preventDefault();
              e.stopPropagation();
          });

          element.on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.originalEvent.dataTransfer){
                if (e.originalEvent.dataTransfer.files.length > 0) {
                  scope.upload(e.originalEvent.dataTransfer.files[0]);
                }
            }
            return false;
        });

        }
    };
  }]);
})();
