'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('stopPropagation',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          if (!attrs.stopPropagation) {
            throw 'event is not specified!';
          }

          element.on(attrs.stopPropagation, function (e) {
            console.log('12341234');
            // e.preventDefault();
            e.stopPropagation();
          });

        }
      }
    }]);
})();
