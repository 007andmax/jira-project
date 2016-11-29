'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('StatisticsService', ['$http', 'Utils',
    function ($http, Utils) {

      function getTicketsDashboard(from, to, callback) {
        var params = {
          from: formatDate(from),
          to: to ? formatDate(to) : formatDate(from)
        };

        var future = $http.get('/dashboard/ticket', { params: params });
        Utils.handleCallback(future, callback);
      }

      function getBillingDashboard(from, to, callback) {
        var params = {
          from: formatDate(from),
          to: to ? formatDate(to) : formatDate(from)
        };

        var future = $http.get('/dashboard/accounting', { params: params });
        Utils.handleCallback(future, callback);
      }

      function formatDate(date) {
        return date ? date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() : null;
      }

      function getStatisticByCompany(params, callback) {
        var future = $http.get('/dashboard/company?companyId=' + params[0] + '&frequency=' + params[1]);
        Utils.handleCallback(future, callback);
      }

      return {
        getTicketsDashboard: getTicketsDashboard,
        getBillingDashboard: getBillingDashboard,
        getStatisticByCompany: getStatisticByCompany
      }
    }

  ])
  ;

})(window, jQuery);
