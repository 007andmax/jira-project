'use strict';

(function () {

  angular.module("quicktech.common.directives").directive("clickOutside",
    ['$document', '$parse', '$rootScope', function ($document, $parse, $rootScope) {
      return {
        restrict: 'A',
        scope: {
          type: '@',
          show: '='
        },
        link: function ($scope, elem, attr) {

          var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [],
            fn = $parse(attr['clickOutside']);

          if (attr.id !== undefined) {
            classList.push(attr.id);
          }

          var eventHandler = function (e) {
            var isClickedElementChildOfPopup = elem
              .find(e.target)
              .length > 0;

            if ($scope.type === 'time' && e.target.id !== 'time-picker-input' && !isClickedElementChildOfPopup) {
              $scope.$emit('hideTimepicker', true);
            };

            if (angular.element(elem).hasClass("ng-hide")) {
              return;
            }

            var i = 0,
              element;

            if (!e || !e.target) {
              return;
            }

            for (element = e.target; element; element = element.parentNode) {
              var id = element.id,
                classNames = element.className,
                l = classList.length;

              if (classNames && classNames.baseVal !== undefined) {
                classNames = classNames.baseVal;
              }

              for (i = 0; i < l; i++) {
                if ((id !== undefined && id.indexOf(classList[i]) > -1) || (classNames && classNames.indexOf(classList[i]) > -1)) {
                  return;
                }
              }
            }

            // if(!$scope.$$phase && !$rootScope.$$phase) {
            return setTimeout(function() {
              $scope.$apply(function () {
                return fn($scope);
              });
            }, 0)      //$digest or $apply
            // }


          };

          $document.on('click', eventHandler);

          $scope.$on('$destroy', function () {
            $document.off('click', eventHandler);
          });

        }

      };
    }]);
})();
