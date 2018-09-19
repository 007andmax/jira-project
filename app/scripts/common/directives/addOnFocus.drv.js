'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('addOnFocus',
    ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        scope: {
          isTextarea: '<isTextarea'
        },
        link: function ($scope, element, attrs) {
          element.addClass('no-animation');

          var interval = setTimeout(function() {
            var input = element.find($scope.isTextarea ? 'textarea' : 'input');

            if (!input.length) {
              return;
            }


            $scope.$watch(function() {
              return input[0].value;
            }, function(val) {
              if (val) {
                element.addClass('active-field');
              } else {
                if (!input.is(':focus')) {
                  element.removeClass('active-field');
                  // console.log('im not focused bitch')
                }
              }
            })

            input.on('focus', function() {
              element.addClass('active-field');
            })

            input.on('blur', function() {

              if (!input[0].value) {
                element.removeClass('active-field');
              }

            })

            if (input.length !== 0) {
              clearInterval(interval);

              setTimeout(function() {
                element.removeClass('no-animation')
              }, 500);
            }
          }, 0)

        }
      }
    }]);
})();
