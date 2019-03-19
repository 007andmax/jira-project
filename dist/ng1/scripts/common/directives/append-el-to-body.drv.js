'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('appendHtmlToBody',
    ['$templateRequest', '$compile', '$location', '$document', function ($templateRequest, $compile, $location, $document) {
      return {
        restrict: 'A',
        scope: {
          url: '@',
          data: '=',
          func: '=?',
          firstNodeClass: '@?'
        },
        link: function ($scope, $element, $attrs) {
          // element.po

        }
      };
    }]);

})();
