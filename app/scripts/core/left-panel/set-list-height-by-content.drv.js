'use strict';

(function () {

  angular.module("quicktech.core.products").directive('setListHeightByContent',
    [function ($timeout) {
        return {
          restrict: 'A',
          scope: {
            itemsCount: '@',
            offset: '@?'
          },
          link: function (scope, element, attrs) {
            var listItemHeight = parseInt(attrs['setListHeightByContent']);

            scope.$watch('[itemsCount, offset]', function (value) {
              if (value) {
                element.height((listItemHeight * value[0] + (parseInt(value[1]) || 0)) + 'px');
              } else {
                element.height('100%');
              }
            }, true);
          }
        }
      }]);
})();
