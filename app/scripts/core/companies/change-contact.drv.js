'use strict';

(function () {

  angular.module("quicktech.core.companies").directive("changeContact",
    [function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          contacts: '=ngModel',
          contactIndex: '=contactIndex'
        },
        link: function ($scope, element) {

          var user = $(element.context);

          $scope.$watch('contactIndex', function () {
            user.fadeOut(300, function(){
              user.fadeIn(300)
            });
          }, true);
        }
      }
    }]);
})();
