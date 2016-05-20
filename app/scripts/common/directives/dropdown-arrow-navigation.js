'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("dropdownArrowNavigation", function () {
    return {
      restrict: 'A',
      scope: {
        onEnter: '=',
        dropdownDataItemName: '@',
        focusedClass: '@?'
      },
      link: function ($scope, element, attrs) {
        var currentFocused,
          dropdownMenu = element.find('.dropdown-menu');

        $scope.focusedClass = $scope.focusedClass || 'dropdown-menu-child-focused';

        element.on('keydown', function (e) {
          if (element.hasClass('open')) {
            switch (e.which || e.keyCode) {
              case 13://enter
              {
                if (currentFocused && $scope.dropdownDataItemName) {
                  $scope.onEnter(currentFocused.scope()[$scope.dropdownDataItemName]);
                  $scope.$apply();
                  closeDropdown();
                }

                break;
              }
              case 27://escape
              {
                closeDropdown();
                break;
              }
              case 38://up
              {
                currentFocused = changeFocus(currentFocused, 'prev');
                break;
              }
              case 40://down
              {
                currentFocused = changeFocus(currentFocused, 'next');
                break;
              }

              default:
                return;
            }
            e.preventDefault();
          }
        });

        function changeFocus(el, direction) {
          var tempElement,
            list = dropdownMenu.children();

          if (el) {
            el.removeClass($scope.focusedClass);

            if (direction === 'next' && list.index(el) >= list.length - 1) {
              tempElement = angular.element(list.first());
            } else if  (direction === 'prev' && list.index(el) <= 0) {
              tempElement = angular.element(list.last());
            } else {
              tempElement = angular.element(el[direction]());
            }
          } else {
            tempElement = angular.element(list[direction === 'next' ? 'first' : 'last']());
          }
          tempElement.addClass($scope.focusedClass);
          tempElement[0].scrollIntoViewIfNeeded(false);
          return tempElement;
        }

        function closeDropdown() {
          element.removeClass('open');
          currentFocused.removeClass($scope.focusedClass);
          currentFocused = undefined;
        }
      }
    }
  });
})();
