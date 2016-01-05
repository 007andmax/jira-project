'use strict';

(function () {

  angular.module("quicktech.core.billable").filter('filterBillableCompany', function () {
    return function (items, reverse) {

      var filtered = [];

      angular.forEach(items, function (item, id) {
        if (id !== 'staticCopy') {

          item.companyId = id;
          filtered.push(item);

        }
      });

      filtered.sort(function (a, b) {
        return (a.tickets.length > b.tickets.length ? 1 : -1);
      });

      if (reverse) filtered.reverse();

      return filtered;

    };
  });
})();

