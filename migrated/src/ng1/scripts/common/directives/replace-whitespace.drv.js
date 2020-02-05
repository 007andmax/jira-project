'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('replaceWhitespace',
    function () {
      return {
        restrict: 'A',
        link: function (scope, element) {
          console.log('123512351235123513');

          element.on({
            keydown: function(e) {
              if (e.which === 32)
                return false;
            },
            input: function() {
              this.value = this.value.replace(/\s/g, "");
              scope.$apply();
            }
          });

        }
      };
    });

})();
