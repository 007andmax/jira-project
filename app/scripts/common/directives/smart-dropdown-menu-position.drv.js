'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('smartDropdownMenuPosition', ['$document', function ($document) {
    return {
      restrict: 'A',
      scope: {
      },
      link: function (scope, element, attrs) {

        setInterval(function() {
          var winHeight = $(window).height();
          var dropdownMenu = element.next();
          var position = element[0].getBoundingClientRect().top;
          var d = $(dropdownMenu[0]);
          if((winHeight - position) < 250) {
            d.css({'top': 'auto'});
            d.css({'bottom': '100%'});
          } else {
            d.css({'bottom': ''});
          }
        }, 100)


      }
    }
  }]);
})();
