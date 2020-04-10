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

    

      function deletePassword(recordId, callback) {
        var future = $http.delete('/passwordRecords/' + recordId);
        Utils.handleCallback(future, callback);
      }

      function save(data, callback) {
        var method = data.id ? 'put' : 'post';
        var future = $http[method]('/passwordRecords', data);
        Utils.handleCallback(future, callback);
    }

      function getAgentsCredentialsForCompany(scope, companyId, callback) {
        var credentials = {};
        $http.get('/passwordRecords/'+companyId+'/agents/password').then(function(resp){
          credentials = resp.data;

          RealTimeService.subscribe('/passwordRecords', scope, function (newChange) {
            if (newChange.action === 'PASSWORD_RECORD_CREATED') {
              var credential = {
                id: newChange.data.id,
                password: newChange.data.password,
                username: newChange.data.username
              };
              credentials[newChange.data.companyId].push(credential);

            } else if(newChange.action === 'PASSWORD_RECORD_UPDATED') {

              var recordById = Utils.findById(credentials[newChange.data.companyId], newChange.data.id);
              if (recordById) {
                var newCredentionalData = {
                  is: newChange.data.id,
                  password: newChange.data.password,
                  username: newChange.data.username
                };
                Utils.customizeObj(newCredentionalData, recordById);
              }

            } else if(newChange.action === 'PASSWORD_RECORD_DELETED') {
              var companyID = Object.keys(credentials)[0];
              Utils.deleteById(credentials[companyID], newChange.data.id);

            }

            if (callback) {
              callback(credentials);
            }
          });

          if (callback) {
            callback(credentials);
          }
        });


      }

      return {
        generateRandomPassword: generateRandomPassword,
        deletePassword: deletePassword,
        save: save,
        getAgentsCredentialsForCompany: getAgentsCredentialsForCompany
      }

    }]);

})(window, jQuery);
