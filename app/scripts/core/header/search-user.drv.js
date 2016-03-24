'use strict';

(function () {

  angular.module("quicktech").directive('headerSearchUser',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element) {

          var removeButton = element.find('.icn-remove-token');
          var searchInput = element.find('input');

          removeButton.click(function(){
            searchInput.focus();
          })

        }
      }
    }]);
})();
