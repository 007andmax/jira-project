'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('customSelection',
    ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {

          $timeout(function () {

            var childElements = $(element).children('li');

            var selectionCallback = function(event, inputElement, change_state){

                if( change_state ) {
                    if ( inputElement.prop("checked")) {
                        inputElement.prop("checked", false);
                    } else {
                        inputElement.prop("checked", true);
                    }
                }

                if( event.shiftKey ) {
                    if( element.find('li.last-clicked').length ) {
                        var lastClicked = element.find('li.last-clicked').index();
                        var nowClicked = childElements.index( inputElement.parents('li') );

                        var direction = nowClicked > lastClicked?1:-1;
                        var i = lastClicked;
                        var stop = nowClicked + direction;

                        for(; i != stop; i += direction) {
                            var checkBox = $(childElements.get(i)).addClass('checked').find('input');
                            checkBox.prop("checked", true);
                        }

                    }
                }

                childElements.removeClass('last-clicked');

                if ( inputElement.prop("checked")) {
                    inputElement.parents('li').addClass('checked');
                    inputElement.parents('li').addClass('last-clicked');
                } else {
                    inputElement.parents('li').removeClass('checked');
                }
                //$(document).click();
            };

            childElements.find('input').click(function(event){
                selectionCallback(event, $(this), false);
                event.stopPropagation();
            });

            childElements.click(function(event){
                if(!$(event.target).is('span.control-indicator') && (event.ctrlKey||event.metaKey) ) {
                  selectionCallback(event, $(this).find('input'), true);
                  event.stopPropagation();
                }
            });
          }, 0);
        }
      }
    }]);
})();
