'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('StatisticsService', ['$http', 'Utils',
    function ($http, Utils) {

      function getTicketsDashboard(params, callback) {
        var future = $http.get('/dashboard/ticket?frequency=' + params[0]);
        Utils.handleCallback(future, callback);
      }

      function getBillingDashboard(params, callback) {
        var future = $http.get('/dashboard/accounting?frequency=' + params[0]);
        Utils.handleCallback(future, callback);
      }

      function getStatisticByCompany(params, callback) {
        var future = $http.get('/dashboard/company?companyId=' + params[0] + '&frequency=' + params[1]);
        Utils.handleCallback(future, callback);
      }

      function getCustomerTicketReport(dto, callback) {
        var future = $http.post('/customerReport', dto);
        Utils.handleCallback(future, callback);
      }

      return {
        getTicketsDashboard: getTicketsDashboard,
        getBillingDashboard: getBillingDashboard,
        getStatisticByCompany: getStatisticByCompany,
        getCustomerTicketReport: getCustomerTicketReport
      }
    }

  ])
  ;

})(window, jQuery);
