'use strict';

(function () {

  angular.module("quicktech.core.devices").filter('unknownFilter', function () {
    return function (input) {

      if(!input){
        return;
      }

      if(input === 'unknown'){
        return;
      }

      return input;
    }
  })
})();
