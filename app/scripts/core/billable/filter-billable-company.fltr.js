'use strict';

(function () {

  angular.module("quicktech.core.billable").filter('filterBillableCompany',
    ['CompaniesService', 'quicktech.common.services.SharedStateService', function (CompaniesService, SharedStateService) {
      return function (items, reverse) {

        var filtered = [];
        var headerSharedState = SharedStateService.getSharedState('billableHeader');

        angular.forEach(items, function (item, id) {
          if (id !== 'staticCopy' && !CompaniesService.getOneById(id).isDefault) {

            if (!headerSharedState.filter.companyId || headerSharedState.filter.companyId === id) {
              item.companyId = id;
              filtered.push(item);
            }

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
