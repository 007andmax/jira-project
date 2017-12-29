'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('smartDropdownMenuPosition', ['$document', function ($document) {
    return {
      restrict: 'A',

      link: function (scope, element, attrs) {

        setInterval(function() {
          var winHeight = $(window).height();
          var dropdownMenu = element.next();
          var position = element[0].getBoundingClientRect().top;
          var d = $(dropdownMenu[0]);
          var parentElement = d.closest('.category-expanded');

          if(attrs.smartDropdownMenuPosition === 'product-list') {
            var productInputPosition = element[0].getBoundingClientRect().top;
            var productInput = $(element[0]);
            var productDropdownMenu = productInput.parent('div').parent('div').find('.nano');
            if((winHeight - productInputPosition) < 360) {
              productDropdownMenu.css({'top': 'auto'});
              productDropdownMenu.css({'bottom': '100%'});
            } else {
              productDropdownMenu.css({'bottom': ''});
            }

          } else if(attrs.smartDropdownMenuPosition === 'service-list'){

            var listContainer = element.next().next();
            var serviceDropdownMenu = listContainer.find('.uib-dropdown-menu');
            if((winHeight - position) < 210) {
              serviceDropdownMenu.css({'top': 'auto'});
              serviceDropdownMenu.css({'bottom': '100%'});
            } else {
              serviceDropdownMenu.css({'bottom': ''});
            }

          } else if(parentElement ) {
            // if(!d.hasClass('ng-hide')) {
            //   parentElement.css({'overflow': 'visible'});
            //   //console.log('open')
            // } else {
            //   parentElement.css({'overflow': 'hidden'});
            // }

            if((winHeight - position) < 250) {
              d.css({'top': 'auto'});
              d.css({'bottom': '100%'});
              parentElement.css({'overflow': 'visible'});
            } else {
              d.css({'top': '50px'});
              d.css({'bottom': ''});
              parentElement.css({'overflow': 'hidden'});
            }
          } else {
            if((winHeight - position) < 250) {
              d.css({'top': 'auto'});
              d.css({'bottom': '100%'});
            } else {
              d.css({'top': '34px'});
              d.css({'bottom': ''});
            }
          }
        }, 100)


      }
    }
  }]);
})();
