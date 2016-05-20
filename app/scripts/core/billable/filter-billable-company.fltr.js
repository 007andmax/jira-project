'use strict';

(function () {

  angular.module("quicktech.core.billable").filter('filterBillableCompany',
    ['CompaniesService', function (CompaniesService) {
      return function (items, reverse) {

        var filtered = [];

        angular.forEach(items, function (item, id) {
          if (id !== 'staticCopy' && !CompaniesService.getOneById(id).isDefault) {

            item.companyId = id;
            filtered.push(item);

          }
        });

        filtered.sort(function (a, b) {
          var aCompany = CompaniesService.getOneById(a.companyId),
            bCompany = CompaniesService.getOneById(b.companyId);
          return (aCompany.name > bCompany.name ? 1 : -1);
        });

        if (reverse) {
          filtered.reverse();
        }

        return filtered;

      };
    }]);
})();

