'use strict';

(function () {
  angular.module('main.services').factory('DiscountsService', ['$http', 'Utils', 'RealTimeService', '$filter',
    function ($http, Utils, RealTimeService, $filter) {

    function getAll($scope, callback) {
      var discounts = [];
      $http.get('/discountTemplates').then(function (resp) {
        discounts = angular.copy(resp.data);
        callback && callback(discounts);

        RealTimeService.subscribe('/discountTemplates', $scope, function (newChange) {
          if (newChange.action === 'DISCOUNT_TEMPLATE_CREATED') {
            discounts.push(newChange.data);
          } else if (newChange.action === 'DISCOUNT_TEMPLATE_UPDATED') {
            var discount = Utils.findById(discounts, newChange.data.id);
            if (discount) {
              Utils.customizeObj(newChange.data, discount);
            }
          } else if (newChange.action === 'DISCOUNT_TEMPLATE_DELETED') {
            Utils.deleteById(discounts, newChange.data.id);
          }
        });
      });
    }

    function save(item, callback) {
      var future = $http[item.id ? 'put' : 'post']('/discountTemplates', item);
      Utils.handleCallback(future, callback);
    }

    function remove(id, callback) {
      var future = $http.delete('/discountTemplates/' + id);
      Utils.handleCallback(future, callback);
    }

    function getAmount(discount) {
      if (discount.discountType === 'FIXED') {
        return $filter('currency')(discount.amount, '$', 2);
      } else {
        return discount.amount + '%';
      }
    }

    return {
      getAll: getAll,
      save: save,
      remove: remove,
      getAmount: getAmount
    };

  }]);
})();
