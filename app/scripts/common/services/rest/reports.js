'use strict';

/*Reports*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReportsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

      var urlForReportsByTaxes = "/salesReports/byTaxes";
      var urlForReportsByCustomers = "/salesReports/byCustomers";
      var urlForReportsByProducts = "/salesReports/byProducts";
      var urlForReportByTechSold = "/reports/sales/byTechSold";
      var urlForReportRemoteAccess = "/reports/remoteAccess";

      function getReport(url, data, callback) {
        var future = $http({
          url: url,
          method: 'POST',
          data: data
        });

        Utils.handleCallback(future, callback)
      }


      function getReportByTaxes(data, callback) {
        return getReport(urlForReportsByTaxes, data, callback);
      }

      function getReportByCustomers(data, callback) {
        return getReport(urlForReportsByCustomers, data, callback);
      }

      function getReportByProducts(data, callback) {
        return getReport(urlForReportsByProducts, data, callback);
      }

      function getReportByTechSold(data, callback) {
        return getReport(urlForReportByTechSold, data, callback);
      }

      function getReportRemoteAccess(data, callback) {
        return getReport(urlForReportRemoteAccess, data, callback);
      }


      return {
        getReportByTaxes: getReportByTaxes,
        getReportByCustomers: getReportByCustomers,
        getReportByProducts: getReportByProducts,
        getReportByTechSold: getReportByTechSold,
        getReportRemoteAccess: getReportRemoteAccess
      }

    }])

})();
