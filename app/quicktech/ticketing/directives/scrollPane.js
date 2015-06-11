'use strict';

(function(){

  var app = angular.module("quicktech.ticketing");

  app.directive('scrollPane', function($timeout){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        $timeout(function(){
          element.jScrollPane({
            autoReinitialise: true,
            verticalDragMinHeight: 54,
            verticalDragMaxHeight: 54,
          });  
        }, 5000);
      }
    }
  });
})();