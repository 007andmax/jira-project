'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TaxesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function getAll($scope, callback) {
      var taxes = [];
      $http.get('/taxes').then(function (resp) {
        taxes = taxes.concat(resp.data);
        callback && callback(taxes);
      });

      RealTimeService.subscribe('/taxes', $scope, function (newChange) {
        var action = newChange.action;
        if (action === 'TAX_CREATED') {
          taxes.push(newChange.data);
        } else if (action === 'TAX_UPDATED') {
          var taxById = Utils.findById(taxes, newChange.data.id);
          Utils.customizeObj(newChange.data, taxById);
        } else if (action === 'TAX_DELETED') {
          Utils.deleteById(taxes, newChange.data.id);
        }
        callback && callback(taxes);
      });
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
      var future = $http.delete('/taxes', { id: taxId });
      Utils.handleCallback(future, callback);
    }

    return {
      getAll: getAll,
      save: save,
      remove: remove
    };

  }]);

})(window, jQuery);
