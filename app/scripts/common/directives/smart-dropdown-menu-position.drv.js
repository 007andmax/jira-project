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
          var parentElement = d.closest('.category-expanded');

          if(attrs.smartDropdownMenuPosition === 'product-list') {
            var productListDropdownMenu = d.closest('.dropdown-menu');
            if((winHeight - position) < 570) {
              productListDropdownMenu.css({'top': 'auto'});
              productListDropdownMenu.css({'bottom': '100%'});
            } else {
              productListDropdownMenu.css({'bottom': ''});
            }
          } else if(parentElement ) {

            if((winHeight - position) < 250) {
              d.css({'top': 'auto'});
              d.css({'bottom': '100%'});
              parentElement.css({'overflow': 'visible'});
            } else {
              d.css({'top': '36px'});
              d.css({'bottom': ''});
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
