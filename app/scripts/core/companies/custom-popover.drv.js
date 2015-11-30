'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("descriptionPopover",
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        replace: true,
        link: function(scope, element){

          var isFirstShowing = true;

          element.popover({
            content: scope.company.description,
            placement: 'bottom',
            trigger: 'hover',
            container: 'body'
          });

          element.on('show.bs.popover', function(){

            $timeout(function(){
              var popover = $('.popover');
              popover.addClass('description-popover');

              if(isFirstShowing){
                var leftPosition = parseInt(popover.css('left'));
                popover.css({'left': leftPosition + 25 + 'px'});
                isFirstShowing = false;
              }
            }, 0);
          });

          element.on('hidden.bs.popover', function(){
            var popover = $('.popover');
            popover.removeClass('description-popover');
          })

        }
      }
    }]);
})();

