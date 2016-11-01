'use strict';

(function () {
  angular.module("quicktech.core.companies").directive('convertToPdf', ['$http', function ($http) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.openInPdf = function (selector, fileName, callback) {
          var target = element.find(selector).clone();

          target.find('.ng-hide').remove();

          var selectedHtml = target.wrap('div').parent().html();
          $http.post(attrs.convertToPdf, { fileName: fileName, content: selectedHtml }).then(function (resp) {
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
