'use strict';

(function () {

  angular.module("quicktech").directive('logoutBtn',
    [function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.on('click', function () {
            location.hash = '';
            location.href = '/logout';
          })
        }
      }
    }]);
})();
