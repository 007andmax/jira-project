'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('smartDropdownMenuPosition', ['$document', function ($document) {
    return {
      restrict: 'A',
      scope: {
      },
      link: function (scope, element, attrs) {

        var input = element;

        input.bind('click', function() {
          var winHeight = $(window).height();
          var dropdownMenu = element.next();
          var position = element[0].getBoundingClientRect().top;
          // console.log('position '+position+' ,buttonHeight: '+ buttonHeight);
          // console.log('win height', win.height());
          // console.log('newxt element:', dropdownMenu[0]);
          if((winHeight - position) < 200) {
            $(dropdownMenu[0]).css({'top': 'auto'});
            $(dropdownMenu[0]).css({'bottom': '100%'});
          } else {
            $(dropdownMenu[0]).css({'bottom': ''});
          }
        })


      }
    }
  }]);
})();
