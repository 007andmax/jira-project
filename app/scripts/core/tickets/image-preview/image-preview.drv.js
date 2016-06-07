'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('imagePreview',
    ['$templateRequest', '$compile', function ($templateRequest, $compile) {
      return {
        restrict: 'A',
        scope: {
          image: '=',
          download: '=downloadFunc'
        },
        link: function ($scope, $element) {
          var imagePreviewTpl,
            imagePreviewContainer,
            waitForTplLoaded = false,
            $body = angular.element(document.body);

          $templateRequest('/html/scripts/core/tickets/image-preview/image-preview.tpl.html').then(function (resp) {
            imagePreviewTpl = angular.copy(resp);

            if (waitForTplLoaded) {
              waitForTplLoaded = false;
              showPreview();
            }
          });

          $element.on('click', showPreview);

          $scope.closePreview = function () {
            imagePreviewContainer.remove();
          };

          function showPreview() {
            if (imagePreviewTpl) {
              $compile(imagePreviewTpl)($scope, function (compiledHtml) {
                imagePreviewContainer = $body.append(compiledHtml).find('.image-preview-tpl');
              });
            } else {
              waitForTplLoaded = true;
            }
          }

        }
      };
    }]);

})();
