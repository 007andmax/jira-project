'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive("ticketNoteFild",
      function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {},
          link: function (scope, element, attr, ctrl) {

            element.bind('keyup', function(){
              ctrl.$setViewValue(element.text());
              scope.$apply();
            });

            scope.$on('setCreateUpdateFormToDefault', function(){
              element.text('');
            });

            //scope.$watch('noteUpdates.note', function(){
            //  element.text(scope.noteUpdates.note);
            //})

          }
        }
      });
})();
