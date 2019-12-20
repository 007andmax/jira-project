'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('RightPanelService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService', 'UsersService', 'DevicesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService, UsersService, DevicesService) {

      var scope = $rootScope.$new(),
        storage = {
          lists: {},
          groupedData: []
        };

      Utils.customizeObj(storage);

      CompaniesService._addAmountChangeListener(refreshGroupedData);

      function refreshGroupedData() {

        storage.groupedData.splice(0, storage.groupedData.length);

        var companies = CompaniesService.getClientCompanies();

        for (var i = 0; i < companies.length; i++) {
          var company = companies[i];

          storage.groupedData.push({
            company: company,
            users: UsersService.getAllByCompanyId(company.id),
            devices: DevicesService.getAgentsByCompany(scope, company.id)
          });
        }

      }

      function getClientCompaniesGroupedData(callback) {

        DevicesService._addInitListener(init);

        function init() {
          if (storage.groupedData.length == 0) {
            refreshGroupedData();
          }


          RealTimeService.subscribe('/device', scope, function (newChange) {
            if (newChange.action === 'DEVICE_INSTALLED') {
              refreshGroupedData();
              if (callback) {
                callback(storage.groupedData);
              }
            }
          });

          if (callback) callback(storage.groupedData);
          return storage.groupedData;
        }
      }

      function getOneCompanyGroupedData(companyId) {
        return {
          company: CompaniesService.getOneById(companyId),
          users: UsersService.getAllByCompanyIdNonArchived(companyId),
          devices: DevicesService.getAgentsByCompany(scope, companyId)
        }
      }

      function getCurrentUserInfo(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        var userInfo = Utils.customizeObj({});

        $http.get('/userInfo').then(function (resp) {
          Utils.customizeObj(resp.data, userInfo);

          if (callback) {
            callback(resp.data);
          }

        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/rightBarUserInfo', scope, function (newChange) {

          if (newChange.action == 'RB_USER_INFO') {
            Utils.customizeObj(newChange.data, userInfo);
          }
        });

        return userInfo;
      }

      function getClientCompanyInfo(scope, companyId, callback) {


        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        if (!companyId) {
          throw 'companyId is required!'
        }

        var companyInfo = Utils.customizeObj({});

        $http.get('/companyInfo/' + companyId).then(function (resp) {
          Utils.customizeObj(resp.data, companyInfo);

          if (callback) {
            callback(resp.data);
          }

        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/rightBarCompanyInfo/' + companyId, scope, function (newChange) {

          if (newChange.action == 'RB_COMPANY_INFO') {
            Utils.customizeObj(newChange.data, companyInfo);
          }
        });

        return companyInfo;
      }

      return {
        getClientCompaniesGroupedData: getClientCompaniesGroupedData,
        getOneCompanyGroupedData: getOneCompanyGroupedData,
        getCurrentUserInfo: getCurrentUserInfo,
        getClientCompanyInfo: getClientCompanyInfo
      }

    }]);

})(window, jQuery);
