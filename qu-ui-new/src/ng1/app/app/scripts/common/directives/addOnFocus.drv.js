'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('addOnFocus',
    ['$timeout', '$compile', '$rootScope', function ($timeout, $compile, $rootScope) {
      return {
        restrict: 'A',
        scope: {
          isTextarea: '<isTextarea'
        },
        link: function ($scope, element, attrs) {
          element.addClass('no-animation');

          var interval = setInterval(function() {
            var input = element.find($scope.isTextarea ? 'textarea' : 'input:not([no-select])');


            // console.log('input', input, 'ENDLESS INTERVAL')

            if (!input.length) {
              return;
            }

            // console.log(input, 'INPUT INPUT INPUT')

            $scope.$watch(function() {
              return $rootScope.taxPlaceholderIsUp;
            }, function(val) {
              if (val) {
                $rootScope.taxPlaceholderIsUp = false;

                if (input.hasClass('tax-input')) {
                  // console.log('tax input');

                  element.addClass('active-field');
                }
              }
            })


            $scope.$watch(function() {
              return input[0].value;
            }, function(val) {
              if (val) {
                element.addClass('active-field');
              } else {
                if (!input.is(':focus')) {
                  element.removeClass('active-field');
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

            if (input.length && input.length !== 0) {
              // console.log(input, "CLEAR INTERVAL")
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
