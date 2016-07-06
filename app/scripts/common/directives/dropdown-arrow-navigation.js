'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("dropdownArrowNavigation", function () {
    return {
      restrict: 'A',
      scope: {
        onEnter: '=',
        onExpand: '=?',
        dropdownDataItemName: '@',
        focusedClass: '@?',
        twoLevels: '=?',
        refreshOn: '@?',
        withHeader: '@?'
      },
      link: function ($scope, element, attrs) {
        var currentFocused;
        var dropdownMenu;
        var destroy;

        $scope.focusedClass = $scope.focusedClass || 'dropdown-menu-child-focused';

        if ($scope.twoLevels) {
          twoLevelsNavigation();
        } else {
          oneLevelNavigation();
        }

        if ($scope.refreshOn) {
          $scope.$on($scope.refreshOn, function (e, oneLevel) {
            destroy && destroy();

            if (oneLevel) {
              oneLevelNavigation();
            } else {
              twoLevelsNavigation();
            }
          });
        }


        function oneLevelNavigation() {
          element.on('keydown', onKeyDown);

          function onKeyDown(e) {

            dropdownMenu = element.find('.dropdown-menu:not(.ng-hide)');

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
          }

          function changeFocus(el, direction) {
            var tempElement,
              list = dropdownMenu.children();

            if ($scope.$eval($scope.withHeader)) {
              list.splice(0, 1);
            }

            if (el) {
              el.removeClass($scope.focusedClass);

              if (direction === 'next' && list.index(el) >= list.length - 1) {
                tempElement = angular.element(list.first());
              } else if (direction === 'prev' && list.index(el) <= 0) {
                tempElement = angular.element(list.last());
              } else if (list.index(el) > -1) {
                tempElement = angular.element(el[direction]());
              } else {
                tempElement = angular.element(list[direction === 'next' ? 'first' : 'last']());
              }
            } else {
              tempElement = angular.element(list[direction === 'next' ? 'first' : 'last']());
            }
            tempElement.addClass($scope.focusedClass);
            tempElement[0].scrollIntoViewIfNeeded(false);
            return tempElement;
          }

          destroy = function () {
            if (currentFocused) {
              currentFocused.removeClass($scope.focusedClass);
              currentFocused = undefined;
            }
            element.off('keydown', onKeyDown);
          }

        }

        function twoLevelsNavigation() {
          var isOnFirstLevel = true,
            firstLevel = [],
            secondLevel = [],
            saveIndex,
            firstIndex;

          element.on('keydown', onKeyDown);

          function onKeyDown(e) {

            dropdownMenu = element.find('.dropdown-menu:not(.ng-hide)');

            if (element.hasClass('open')) {
              firstLevel = dropdownMenu.children();

              switch (e.which || e.keyCode) {
                case 13://enter
                {
                  if (currentFocused) {
                    if (isOnFirstLevel && currentFocused.hasClass('expandable')) {
                      currentFocused.removeClass($scope.focusedClass);
                      currentFocused.addClass('expanded');
                      $scope.onExpand(currentFocused.scope().$index, true);
                      secondLevel = currentFocused.find('.focusable');
                      currentFocused = angular.element(secondLevel[0]);
                      currentFocused.addClass($scope.focusedClass);
                      saveIndex = firstIndex;
                      firstIndex = 0;
                      isOnFirstLevel = false;
                    } else {
                      $scope.onEnter(currentFocused.scope()[$scope.dropdownDataItemName]);
                      firstIndex = undefined;
                      saveIndex = 0;
                      isOnFirstLevel = true;
                      closeDropdown();
                    }
                    $scope.$apply();
                  }
                  break;
                }
                case 27://escape
                {
                  var currentParent = currentFocused.parent();
                  if (currentParent.hasClass('expandable')) {
                    currentFocused.removeClass($scope.focusedClass);
                    currentParent.removeClass('expanded');
                    $scope.onExpand(currentParent.scope().$index, false);
                    $scope.$apply();
                    firstIndex = saveIndex;
                    currentFocused = changeFocus(currentFocused, firstLevel, firstIndex);
                    saveIndex = 0;
                  } else {
                    firstIndex = undefined;
                    saveIndex = 0;
                    closeDropdown();
                  }
                  isOnFirstLevel = true;
                  break;
                }
                case 38://up
                {
                  if (!firstIndex) {
                    firstIndex = (isOnFirstLevel ? firstLevel.length : secondLevel.length) - 1;
                  } else {
                    firstIndex--;
                  }
                  currentFocused = changeFocus(currentFocused, isOnFirstLevel ? firstLevel : secondLevel, firstIndex);
                  break;
                }
                case 40://down
                {
                  if (firstIndex === undefined || firstIndex === (isOnFirstLevel ? firstLevel.length : secondLevel.length) - 1) {
                    firstIndex = 0;
                  } else {
                    firstIndex++;
                  }
                  currentFocused = changeFocus(currentFocused, isOnFirstLevel ? firstLevel : secondLevel, firstIndex);
                  break;
                }

                default:
                  return;
              }
              e.stopPropagation();
            } else {
              element.addClass('open');
            }
          }

          function changeFocus(current, array, index) {
            var temp;

            current = angular.element(current);
            temp = angular.element(array[index]);

            current.removeClass($scope.focusedClass);
            current = temp;
            current.addClass($scope.focusedClass);
            current[0].scrollIntoViewIfNeeded(false);
            return current;
          }

          destroy = function () {
            isOnFirstLevel = true;
            firstLevel = [];
            secondLevel = [];
            saveIndex = 0;
            firstIndex = undefined;
            if (currentFocused) {
              currentFocused.removeClass($scope.focusedClass);
              currentFocused = undefined;
            }
            element.off('keydown', onKeyDown);
          }

        }

        function closeDropdown() {
          element.removeClass('open');
          if (currentFocused) {
            currentFocused.removeClass($scope.focusedClass);
            currentFocused = undefined;
          }
        }
      }
    }
  });
})();
