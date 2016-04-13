'use strict';

(function () {

  angular.module("quicktech.core.products").directive('setListHeightByContent',
    [function ($timeout) {
        return {
          restrict: 'A',
          scope: {
            itemsCount: '@'
          },
          link: function (scope, element, attrs) {
            var listItemHeight = parseInt(attrs['setListWidthByContent']);

            scope.$watch('itemsCount', function (value) {
              if (value) {
                element.height((listItemHeight * value) + 'px');
              } else {
                element.height('100%');
              }
            });
          }
        }
      }]);
})();
