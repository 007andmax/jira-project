'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('fileSizeFilter', function () {
    return function (input, isSpeed) {
      if (isNaN(parseInt(input))) {
        return input;
      }

      if (!isSpeed) {
        if (input / 1024 <= 1) {
          return Math.ceil(input * 10) / 10 + ' B';
        } else if (input / 1024 < 1000) {
          return Math.ceil((input / 1024) * 10) / 10 + ' KB';
        } else if (input / 1024 < 1000000) {
          return Math.ceil((input / 1048576) * 10) / 10 + ' MB';
        } else {
          return Math.ceil((input / 1073741824) * 10) / 10 + ' GB';
        }
      } else {
        if (input / 1000 <= 1) {
          return Math.ceil(input * 10) / 10 + ' (Bit)';
        } else if (input / 1000 < 1000) {
          return Math.ceil((input / 1000) * 10) / 10 + ' (KiloBit)';
        } else if (input / 1000 < 1000000) {
          return Math.ceil((input / 1000000) * 10) / 10 + ' (MegaBit)';
        } else {
          return Math.ceil((input / 1000000000) * 10) / 10 + ' (GigaBit)';
        }
      }
    }
  })
})();
