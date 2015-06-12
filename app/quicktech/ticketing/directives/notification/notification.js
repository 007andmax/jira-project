'use strict';

(function(){

    var app = angular.module("quicktech.core.ticketing");

    app.directive('notification', function($timeout){
        return {
            restrict: 'E',
            replace: true,
            template: '<div>hiiiiiiiiiii i</div>',
            link: function(scope, element, attrs){
               $timeout(function(){
                   element.remove();
               }, 5000);
            }
        }
    });

})();
