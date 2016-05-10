'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('TagsService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    function search(keyword, callback) {

      if (!keyword) {
        throw 'Keyword is required!';
      }

      $http.get("/tags/search?word=" + keyword.toLowerCase()).then(function (response) {

        if (callback) {
          callback(response.data);
        }

        return response.data;
      });
    }

    function setTagsInTicket(ticketTags, ticketId, callback) {

      if (!ticketTags || !Array.isArray(ticketTags)) {
        throw 'ticketTags is required and must be array!';
      }

      if (!ticketId) {
        throw 'ticketId is required!';
      }

      var future = $http({
        url: '/tags?ticketId=' + ticketId,
        method: 'PUT',
        data: ticketTags
      });

      Utils.handleCallback(future, callback);
    }

    return {
      search: search,
      setTagsInTicket: setTagsInTicket
    }
  }
  ]);
})(window, jQuery);
