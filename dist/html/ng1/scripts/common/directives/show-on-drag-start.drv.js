'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("attachFiles", ['$document', '$timeout', function ($document, $timeout) {
    return {
      restrict: 'A',
      scope: {
        attachFunc: '='
      },
      link: function ($scope, element) {
        var dragTimer;
        element.hide();

        $timeout(function () {
          var teEditor = $document.find('[te-editor]');
          if (teEditor.length) {
            teEditor.off('dragover');
          }
        });

        $document.on('dragover', onDragOver);
        $document.on('dragleave', onDragLeave);
        $document.on('drop', preventDropDefault);
        element.on('drop', onDrop);

        $scope.$on('$destroy', function () {
          $document.off('dragover', onDragOver);
          $document.off('dragleave', onDragLeave);
          $document.off('drop', preventDropDefault);
          element.off('drop', onDrop);
        });

        function onDragOver(e) {
          e.stopPropagation();
          e.preventDefault();
          var dt = e.originalEvent.dataTransfer;
          if(dt.types != null && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'))) {
            element.show();
            $timeout.cancel(dragTimer);
          }
        }

        function onDragLeave(e) {
          e.stopPropagation();
          e.preventDefault();
          $timeout.cancel(dragTimer);
          dragTimer = $timeout(function () {
            element.hide();
          }, 85);
        }

        function onDrop(e) {
          // e.stopPropagation();
          e.preventDefault();
          element.hide();

          var files = e.originalEvent.dataTransfer.files;

          if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              $scope.attachFunc(files[i]);
            }
          }
        }

        function preventDropDefault(e) {
          e.stopPropagation();
          e.preventDefault();
          element.hide();
        }
      }
    }
  }]);
})();
