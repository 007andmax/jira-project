'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('smartDropdownMenuPosition', ['$document', function ($document) {
    return {
      restrict: 'A',
      scope: {
      },
      link: function (scope, element, attrs) {

        //var etco = $document.find(attrs.elementToChangeOverflow);

        setInterval(function() {
          var winHeight = $(window).height();
          var dropdownMenu = element.next();
          var position = element[0].getBoundingClientRect().top;
          var d = $(dropdownMenu[0]);

          var parentElement = d.parent().parent();


          if(parentElement && parentElement.hasClass('category-expanded')) {

            if((winHeight - position) < 250) {
              d.css({'top': '-170px'});
              parentElement.css({'overflow': 'visible'});
            } else {
              d.css({'top': '36px'});
              parentElement.css({'overflow': 'hidden'});
            }
          } else {
            if((winHeight - position) < 250) {
              d.css({'top': 'auto'});
              d.css({'bottom': '100%'});
            } else {
              d.css({'bottom': ''});
            }
          }
        }, 100)


      }
    }
  }]);
})();
