'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('fileSizeFilter', function () {
    return function (input) {
      if (input / 1024 <= 0) {
        return input.toFixed(1) + ' B';
      } else if (input / 1024 < 1000) {
        return (input / 1024).toFixed(1) + ' KB';
      } else {
        return (input / 1048576).toFixed(1) + " MB";
      }
    }
  })
})();
