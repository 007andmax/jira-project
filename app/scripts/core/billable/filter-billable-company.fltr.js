'use strict';

(function () {

  angular.module("quicktech.core.billable").filter('filterBillableCompany',
    ['CompaniesService', function (CompaniesService) {
      return function (items, reverse) {

        var filtered = [];

        angular.forEach(items, function (item, id) {
          if (id !== 'staticCopy') {

            item.companyId = id;
            filtered.push(item);

          }
        });

        filtered.sort(function (a, b) {
          var company = CompaniesService.getOneById(a.companyId);
          return (a.tickets.length + '-' + company.name > b.tickets.length + '-' + company.name ? 1 : -1);
        });

        if (reverse) filtered.reverse();

        return filtered;

      };
    }]);
})();

