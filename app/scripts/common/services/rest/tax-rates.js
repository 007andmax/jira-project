'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TaxRatesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function getAllByCompany(companyId, scope, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!';
      }

      if (!companyId || Object.prototype.toString.call(companyId) === "[object Function]") {
        throw 'companyId is required argument!';
      }

      return Utils.getListByUrl('/taxRate/' + companyId, callback, function (list) {

        RealTimeService.subscribe('/taxRate/' + companyId, scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'TAX_RATE_SAVE') {

            var taxRate = Utils.findById(list, newChange.data.versionedId.id);

            if (taxRate) {
              Utils.customizeObj(newChange.data, taxRate);
            } else {
              list.push(Utils.customizeObj(newChange.data));
            }
          } else if (newChange.action == 'TAX_RATE_DELETE') {
            Utils.deleteById(list, newChange.data.versionedId.id);
            scope.$broadcast("tax_rate_delete", newChange.data);
          }
          if (callback) {
            callback(list);
          }
        });

      });
    }

    function save(taxRate, callback) {

      if (!taxRate) {
        throw 'taxRate is required!';
      }

      var url = '/taxRate',
        method = 'POST';

      if (taxRate.versionedId && taxRate.versionedId.id) {
        method = 'PUT';
        url = url + '/' + taxRate.versionedId.id;

      }

      var future = $http({
        url: url,
        method: method,
        data: taxRate
      });

      Utils.handleCallback(future, callback);
    }

    function saveList(taxRates, callback) {

      if (!taxRates) throw 'taxRate is required!';

      var future = $http({
        url: '/taxRate/saveList',
        method: 'POST',
        data: { taxRates: taxRates } // TaxRateDto for validation
      });

      Utils.handleCallback(future, callback);
    }

    function deleteTaxRate(taxRateId, callback) {
      if (!taxRateId) throw 'taxRateId is required argument!';

      var future = $http({
        url: '/taxRate/' + taxRateId,
        method: 'DELETE'
      });

      Utils.handleCallback(future, callback);
    }


    function move(mapping, callback) {
      if (!mapping) throw 'mapping is required argument!';

      var future = $http({
        url: '/taxRate/move',
        method: 'POST',
        data: mapping
      });

      Utils.handleCallback(future, callback);
    }

    function isUniqueInCompany(taxRateCode, id, companyId, callback) {

      if (!taxRateCode) {
        throw 'taxRateCode is required!'
      }

      if (!companyId) {
        throw 'companyId is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/taxRate/isUniqueInCompany?taxRateCode=' + taxRateCode + '&id=' + id + '&companyId=' + companyId).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function getAllTaxRates(scope, callback) {

      var taxRates = Utils.customizeObj({});

      $http.get('/taxRate/getTaxRates').success(function (resp) {
        Utils.customizeObj(resp, taxRates);
        if (callback) {
          callback(resp);
        }
      });

      RealTimeService.subscribe('/taxRate', scope, function (change) {
        console.log(change);
        if (change.action === 'TAX_RATE_SAVE') {
          if (taxRates[change.data.company.id]) {
            var findById = Utils.findById(taxRates[change.data.company.id], change.data.versionedId.id);
            if (findById) {
              Utils.customizeObj(change.data, findById);
            } else {
              taxRates[change.data.company.id].push(change.data);
            }
          } else {
            taxRates[change.data.company.id] = [change.data];
          }

          if (callback) {
            callback(taxRates);
          }
        } else if (change.action === 'TAX_RATE_DELETE') {
          Utils.deleteById(taxRates[change.data.company.id], change.data.versionedId.id);
          if (callback) {
            callback(taxRates);
          }
        }
      });

      return taxRates;
    }


    return {
      getAllByCompany: getAllByCompany,
      save: save,
      saveList: saveList,
      deleteTaxRate: deleteTaxRate,
      isUniqueInCompany: isUniqueInCompany,
      getAllTaxRates: getAllTaxRates,
      move: move
    }

  }]);

})(window, jQuery);
