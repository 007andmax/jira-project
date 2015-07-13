'use strict';

(function () {

  var app = angular.module("quicktech.common.directives");

  app.directive('scrollPane', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        //$timeout(function () {
          element.jScrollPane({
            autoReinitialise: true,
            verticalDragMinHeight: 54,
            verticalDragMaxHeight: 54
          });

          var maxHeight = attrs.scrollMaxHeightPx;

          if (maxHeight) {

            var jsp = element.data('jsp');

            var checker = setInterval(function () {
              var contentHeight = jsp.getContentHeight();

              if (contentHeight <= maxHeight) {
                element.innerHeight(contentHeight);
              }
            }, 200);

            scope.$on('$destroy', function () {
              clearInterval(checker);
            })

          }

        //}, 5000);
      }
    }
  });
})();
