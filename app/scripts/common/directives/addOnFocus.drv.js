'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('addOnFocus',
    ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

          setTimeout(function() {
            var input = element.find('input');

            console.log(element[0], input)

            $scope.$watch(function() {
              return input.val();
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


              console.log('something is FOCUSEDDDDDD')
            })

            input.on('blur', function() {

              if (!input.val()) {
                element.removeClass('active-field');
              }

            })
          }, 500)

        }
      }
    }]);
})();
