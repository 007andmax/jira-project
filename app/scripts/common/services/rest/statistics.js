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

      function formatDate(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      }

      return {
        getTicketsDashboard: getTicketsDashboard
      }
    }

  ])
  ;

})(window, jQuery);
