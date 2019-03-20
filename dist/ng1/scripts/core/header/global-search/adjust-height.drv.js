'use strict';

(function () {

  angular.module("quicktech").directive('adjustHeight',
    [function () {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {

          $scope.$on($attrs.adjustHeight, function () {
            var paddingTop = parseInt($element.css('padding-top').replace('px', '')),
              paddingBottom = parseInt($element.css('padding-bottom').replace('px', '')),
              children = $element.children(),
              maxHeight = parseInt($attrs.maxHeight) - paddingTop - paddingBottom,
              height = 0;

            for (var counter = 0; counter < children.length; counter++) {
              var child = angular.element(children[counter]);
              var childHeight;
              var deepChildren = child.children();

              if (child.hasClass('expanded')) {
                var deepHeight = height;

                for (var i = 0; i < deepChildren.length; i++) {
                  var deepChild = angular.element(deepChildren[i]);
                  childHeight = deepChild.outerHeight(true);

                  if (deepHeight + childHeight > maxHeight) {
                    return $element.css('height', deepHeight + 'px');
                  }
                  deepHeight += childHeight;
                }

                height += child.outerHeight(true);
              } else {
                childHeight = child.outerHeight(true);

                if (height + childHeight > maxHeight) {
                  break;
                }
                height += childHeight;
              }
            }

            if (counter >= children.length) {
              height += paddingTop + paddingBottom;
            }

            $element.css('height', height + 'px');
          });

        }
      }
    }]);
})();
