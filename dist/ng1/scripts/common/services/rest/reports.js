'use strict';

/*Reports*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReportsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

      var urlForReportsByTaxes = '/reports/sales/byTaxes';
      var urlForReportsByCustomers = '/reports/sales/byCustomers';
      var urlForReportsByProducts = '/reports/sales/byProducts';
      var urlForReportByTechSold = '/reports/sales/byTechSold';
      var urlForReportRemoteAccess = '/reports/remoteAccess';
      var urlForReportCreatedVsClosedTickets = '/reports/techTickets';
      var urlForReportProductSoldVsQuotedProjects = '/reports/sales/byTechSold';
      var urlForReportAccountReceivable = '/reports/sales/byReceivable';
      var urlForReportByCommissions = '/reports/commission/byCustomers';
      var urlForReportSummary = '/devices/extended?companyId=';

      function getReport(url, data, callback) {
        var future = $http({
          url: url,
          method: 'POST',
          data: data
        });

        Utils.handleCallback(future, callback)
      }

      function getSummaryReport(url, callback) {
        var future = $http({
          url: url,
          method: 'Get'
        });

        Utils.handleCallback(future, callback);
      }

      function exportCsv(url, data, callback) {
        $http.post(url + '/csv', data).then(function (resp) {
          var blob = new Blob([resp.data]);
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);

          var filename = "";
          var disposition = resp.headers('Content-Disposition');
          if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]|(UTF-8)/g, '');
            }
          }

          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(link.href);
          callback && callback(resp);
        })
      }

      function exportPdf(reportType, callback) {
        var future = $http.get(reportType);
        Utils.handleCallback(future, callback);
      }

      function getReportByTaxes(data, callback) {
        return getReport(urlForReportsByTaxes, data, callback);
      }

      function getReportByCustomers(data, callback) {
        return getReport(urlForReportsByCustomers, data, callback);
      }

      function getReportSummary(data, callback) {
        const url = urlForReportSummary+data.companyId;
        return getSummaryReport(url, callback);
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

      function getReportAccountsReceivable(data, callback) {
        return getReport(urlForReportAccountReceivable, data, callback);
      }

      function getReportByCommissions(data, callback) {
        return getReport(urlForReportByCommissions, data, callback);
      }

      function exportCsvAccountsReceivable(data, callback) {
        return exportCsv(urlForReportAccountReceivable, data, callback);
      }

      function exportCsvByTaxes(data, callback) {
        return exportCsv(urlForReportsByTaxes, data, callback);
      }

      function exportCsvByCustomers(data, callback) {
        return exportCsv(urlForReportsByCustomers, data, callback);
      }

      function exportCsvByProducts(data, callback) {
        return exportCsv(urlForReportsByProducts, data, callback);
      }

      function exportCsvByTechSold(data, callback) {
        return exportCsv(urlForReportByTechSold, data, callback);
      }

      function exportCsvByTechTicketCreated(data, callback) {
        return exportCsv(urlForReportCreatedVsClosedTickets, data, callback);
      }

      function exportCsvByTechProductSold(data, callback) {
        return exportCsv(urlForReportProductSoldVsQuotedProjects, data, callback);
      }

      function exportCsvRemoteAccess(data, callback) {
        return exportCsv(urlForReportRemoteAccess, data, callback);
      }

      function getTechReportTicketCreated(data, callback) {
        return getReport(urlForReportCreatedVsClosedTickets, data, callback);
      }

      function getTechReportProductSales(data, callback) {
        return getReport(urlForReportProductSoldVsQuotedProjects, data, callback);
      }


      return {
        getReportByTaxes: getReportByTaxes,
        getReportByCustomers: getReportByCustomers,
        getReportByProducts: getReportByProducts,
        getReportByTechSold: getReportByTechSold,
        getReportRemoteAccess: getReportRemoteAccess,
        getReportByCommissions: getReportByCommissions,
        exportCsvByTaxes: exportCsvByTaxes,
        exportCsvByCustomers: exportCsvByCustomers,
        exportCsvByProducts: exportCsvByProducts,
        exportCsvByTechSold: exportCsvByTechSold,
        exportCsvRemoteAccess: exportCsvRemoteAccess,
        getTechReportTicketCreated: getTechReportTicketCreated,
        getTechReportProductSales: getTechReportProductSales,
        getReportAccountsReceivable: getReportAccountsReceivable,
        exportCsvAccountsReceivable: exportCsvAccountsReceivable,
        exportCsvByTechTicketCreated: exportCsvByTechTicketCreated,
        exportCsvByTechProductSold: exportCsvByTechProductSold,
        getReportSummary: getReportSummary
      };

    }]);

})(window);
