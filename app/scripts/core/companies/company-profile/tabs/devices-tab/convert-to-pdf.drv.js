'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('convertToPdf', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.openInPdf = function (selector, fileName, callback) {
          var source = element.find(selector);
          var target = source.clone(),
            unknownLoadingStr = 'Loading...',
            sourceSVGs = source.find('svg'),
            canvas = document.createElement('canvas');

          target.find('.ng-hide').remove();

          if (sourceSVGs && sourceSVGs.length) {
            var svgs = target.find('svg');
            svgs.replaceWith(function (index) {
              var svg = angular.element(sourceSVGs[index]),
                img = document.createElement('img');
              var width = svg.width() + 'px';
              var height = svg.height() + 'px';

              svg.attr('width', width);
              svg.attr('height', height);

              canvg(canvas, svg[0].outerHTML);

              svg.attr('width', '100%');
              svg.attr('height', '100%');

              img.src = canvas.toDataURL();
              img.style.width = width;
              img.style.height = height;
              return img;
            });
          }

          var selectedHtml = target.wrap('div').parent().html();
          if (selectedHtml.indexOf(unknownLoadingStr) !== -1) {
            selectedHtml = selectedHtml.slice(unknownLoadingStr.length);
          }
          $http.post(attrs.convertToPdf, {fileName: fileName, content: selectedHtml}).then(function (resp) {
            if (callback) {
              callback(resp.data);
            }
            if (resp.data && resp.data.url) {
              window.open(resp.data.url);
            }
          })
        }
      }
    }
  }]);
})();
