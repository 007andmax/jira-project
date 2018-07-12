'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('smartDropdownMenuPosition', ['$document', function ($document) {
    return {
      restrict: 'A',
      scope: {
        noRestricted: '<noRestricted'
      }

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
              productDropdownMenu.css({'margin-bottom': '10px'});
            } else {
              productDropdownMenu.css({'bottom': ''});
              productDropdownMenu.css({'margin-bottom': ''});
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

          } else if(attrs.smartDropdownMenuPosition === 'user-notification'){
            if((winHeight - position) < 250) {
              d.css({'top': 'auto'});
              d.css({'bottom': '100%'});
            } else {
              d.css({'top': ''});
              d.css({'bottom': ''});
            }
          } else if(attrs.smartDropdownMenuPosition === 'dropdown-menu'){

            var ulElement = $(element[0].children[1]);
            if((winHeight - position) < 250) {
              ulElement.css({'top': 'auto'});
              ulElement.css({'bottom': '100%'});
              ulElement.css({'margin': '0 0 15px 0'});
            } else {
              ulElement.css({'top': ''});
              ulElement.css({'bottom': ''});
              ulElement.css({'margin': ''});
            }

          }else if(parentElement ) {
            // if(!d.hasClass('ng-hide')) {
            //   parentElement.css({'overflow': 'visible'});
            //   //console.log('open')
            // } else {
            //   parentElement.css({'overflow': 'hidden'});
            // }

            if(attrs.smartDropdownMenuPosition === 'user-list') {
              if((winHeight - position) < 250) {
                d.css({'top': 'auto'});
                d.css({'bottom': '100%'});
                d.css({'max-height': '350px'});
                parentElement.css({'overflow': 'visible'});
              } else {
                d.css({'top': 'auto'});
                d.css({'bottom': ''});
                d.css({'max-height': '350px'});
                parentElement.css({'overflow': 'hidden'});
              }
            } else {
              if((winHeight - position) < 250) {
                d.css({'top': 'auto'});
                d.css({'bottom': '100%'});
                if (!noRestricted) {
                  d.css({'max-height': '160px'});
                }
                parentElement.css({'overflow': 'visible'});
              } else {
                d.css({'top': 'auto'});
                d.css({'bottom': ''});

                if (!noRestricted) {
                  d.css({'max-height': '160px'});
                }
                parentElement.css({'overflow': 'hidden'});
              }
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
