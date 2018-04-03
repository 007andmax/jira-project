'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TaxesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', function ($http, $rootScope, RealTimeService, Utils) {

    var taxes = [],
      $serviceScope = $rootScope.$new();

    $http.get('/taxes').then(function (resp) {
      taxes = Utils.customizeArray(resp.data, taxes);
    });

    RealTimeService.subscribe('/taxes', $serviceScope, function (newChange) {
      var action = newChange.action;
      var taxById = Utils.findById(taxes, newChange.data.id);

      if (action === 'TAX_CREATED') {
        taxes.push(newChange.data);
      } else if (action === 'TAX_UPDATED') {
        Utils.customizeObj(newChange.data, taxById);
      } else if (action === 'TAX_DELETED') {
        Utils.deleteById(taxes, newChange.data.id);
      }

      //update or delete related taxes in products, services and expenses
      $rootScope.$broadcast(action.toLowerCase() + '_original', taxById);
    });

    function getAll(callback) {
      callback && callback(taxes);
      return taxes;
    }

    function create(tax, callback) {
      var future = $http.post('/taxes', tax);
      Utils.handleCallback(future, callback);
    }

    function update(tax, callback) {
      var future = $http.put('/taxes', tax);
      Utils.handleCallback(future, callback);
    }

    function save(tax, callback) {
      if (tax.id) {
        update(tax, callback);
      } else {
        create(tax, callback);
      }
    }

    function remove(taxId, callback) {
      var future = $http.delete('/taxes/' + taxId);
      Utils.handleCallback(future, callback);
    }

    function linkWithEntity(entityId, entityType, taxIds, callback) {
      var future = $http.post('/taxes/linkToExpense', {
        expenseId: entityId,
        expenseType: entityType.toUpperCase(),
        taxIds: taxIds
      });
      Utils.handleCallback(future, callback);
    }

    function isUniqueName(name, id, callback) {
      var future = $http.get('/taxes/isUniqueName', { params: { name: name, taxId: id } });
      Utils.handleCallback(future, callback);
    }

    function findTaxById(taxId) {
      if(taxId) {
        return Utils.findById(taxes, taxId);
      } else {
        //console.log('no tax id', taxId);
      }
    }

    function findTaxesByIds(IdsArray) {
      if(IdsArray && IdsArray.length && IdsArray.length > 0) {
        var taxes = [];
        IdsArray.forEach(function(id) {
          var tax = findTaxById(id);
          taxes.push(tax);
        });
        return taxes;
      }
    }

    return {
      getAll: getAll,
      save: save,
      remove: remove,
      linkWithEntity: linkWithEntity,
      isUniqueName: isUniqueName,
      findTaxById: findTaxById,
      findTaxesByIds: findTaxesByIds
    };

  }]);

})(window, jQuery);
