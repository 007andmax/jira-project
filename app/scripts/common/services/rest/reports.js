'use strict';

/*Reports*/

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('ReportsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function($http, $rootScope, RealTimeService, Utils){

    var urlForReportsByTaxes = "/salesReports/byTaxes";
    var urlForReportsByCustomers = "/salesReports/byCustomers";
    var urlForReportsByProducts = "/salesReports/byProducts";
    var urlForReportByTechSold = "/reports/sales/byTechSold";
    var urlForReportRemoteAccess = "/reports/remoteAccess";

    function getReport(url, data, callback) {
      var reports ={};
      $http({
        url: url,
        method: 'GET',
        data: data
      }).then(function(resp){
        Utils.customizeObj(resp.data, reports);
      }, function(resp){
        if(callback) {
          callback(resp.data);
        }
      });
      return reports;
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

    function getReportRemoteAccess(data,callback) {
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

}) ();
