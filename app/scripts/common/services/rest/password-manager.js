'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('PasswordManagerService', ['$http', 'Utils', 'RealTimeService', '$rootScope',
    function ($http, Utils, RealTimeService, $rootScope) {
      var scope = $rootScope.$new();

      function generateRandomPassword(length) {
        return Math.random().toString(36).slice(-length || -12);
      }

      function getRecords(callback) {
        var records = [];
        $http.get('/passwordRecords').then(function (resp) {
          Utils.customizeArray(resp.data, records);

          RealTimeService.subscribe('/passwordRecords', scope, function (newChange) {

            if (newChange.action === 'PASSWORD_RECORD_CREATED') {

              records.push(newChange.data);

            } else if(newChange.action === 'PASSWORD_RECORD_UPDATED') {

              var recordById = Utils.findById(records, newChange.data.id);
              if (recordById) {
                Utils.customizeObj(newChange.data, recordById);
              }

            } else if(newChange.action === 'PASSWORD_RECORD_DELETED') {

              Utils.deleteById(records, newChange.data.id);

            }

            if (callback) {
              callback(records);
            }
          });

          if (callback) {
            callback(records);
          }
        });
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
