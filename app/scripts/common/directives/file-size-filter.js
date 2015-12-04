'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('fileSizeFilter', function () {
    return function (input) {
      if (input / 1024 <= 1) {
        return Math.ceil(input * 10) / 10 + ' B';
      } else if (input / 1024 < 1000) {
        return Math.ceil((input / 1024) * 10) / 10 + ' KB';
      } else {
        return Math.ceil((input / 1048576) * 10) / 10 + " MB";
      }
    }
  })
})();
