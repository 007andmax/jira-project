'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PasswordManagerService', ['$http', 'Utils', function ($http, Utils) {

    function generateRandomPassword(length) {
      return Math.random().toString(36).slice(-length || -12);
    }

    function getRecords(callback) {
      var future = $http.get('/passwordRecords');
      Utils.handleCallback(future, callback);
    }

    function getPasswordByRecord(recordId, callback) {
      var future = $http.get('/passwordRecords/' + recordId + '/password');
      Utils.handleCallback(future, callback);
    }

    function save(data, callback) {
      var future = $http.post('/passwordRecords', data);
      Utils.handleCallback(future, callback);
    }

    return {
      generateRandomPassword: generateRandomPassword,
      getRecords: getRecords,
      getPasswordByRecord: getPasswordByRecord,
      save: save
    }

  }]);

})(window, jQuery);
