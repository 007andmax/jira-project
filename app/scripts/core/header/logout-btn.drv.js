'use strict';

(function () {

  angular.module("quicktech").directive('logoutBtn',
    ['$rootScope', function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.on('click', function () {

            window.loggingOut = true;

            window.location.href = '/logout';
            window.location.hash = '';
          })
        }
      }
    }]);
})();
