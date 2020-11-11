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

      function getCustomerTicketReport(dto, callback) {
        var future = $http.post('/customerReport', dto);
        Utils.handleCallback(future, callback);
      }

      return {
        getCustomerTicketReport: getCustomerTicketReport,
        getTicketsDashboard:getTicketsDashboard
      }
    }

  ])
  ;

})(window, jQuery);
