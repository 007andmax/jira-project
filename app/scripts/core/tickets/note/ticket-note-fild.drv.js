'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("ticketNoteFild",
      function () {
        return {
          restrict: 'A',
          scope: {
            noteUpdates: '=ngModel'
          },
          link: function (scope, element) {

            element.bind('keyup', function(){
              scope.noteUpdates.note = element.text();
              scope.$apply();
            });

          }
        }
      });
})();
