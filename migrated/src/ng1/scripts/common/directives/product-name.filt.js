'use strict';

(function () {

  angular.module("quicktech.common.directives").filter('filterProductByName', function () {
    return function (input, name) {
      if (name.length > 0) {
        return input.filter(function(item) {
          console.log(item.description, name);
          return item.description.toLowerCase().indexOf(name.toLowerCase()) > -1;
        });
      } else {
        return input;
      }
    };
  });
})();
