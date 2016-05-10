'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('RightPanelService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService', 'UsersService', 'DevicesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService, UsersService, DevicesService) {

      var scope = $rootScope.$new(),
        storage = {
          lists: {},
          recentActivities: {},
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

      function getActivities(scope, params, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        var list = Utils.customizeObj([]),
          isNotSubscribed = !storage.lists[scope.$id];

        storage.lists[scope.$id] = {
          params: params,
          scope: scope,
          list: list
        };

        loadMoreActivities(scope, function (resp) {
          if (isNotSubscribed) {
            RealTimeService.subscribe('/activity', scope, function (newChange) {
              console.log(newChange);
              if (newChange.action == 'ACTIVITY_CREATED') {
                storage.lists[scope.$id].list.unshift(Utils.customizeObj(newChange.data));
              }
            });
          }
          if (callback) {
            callback(resp);
          }
        });

        scope.$on('$destroy', function () {
          delete storage.lists[scope.$id];
        });
        return list;
      }

      function loadMoreActivities(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        var listData = storage.lists[scope.$id];

        if (!listData) {
          throw 'There is no activities list for scope ' + scope.$id;
        }

        if (listData.loadingInProcess) {
          console.log('Loading tickets already in process');
          return;
        }

        if (listData.list.length > 0) {
          listData.params.createdAt = listData.list[listData.list.length - 1].createdAt
        }

        listData.loadingInProcess = true;

        $http({
          method: 'GET',
          url: '/activity/',
          params: listData.params
        }).then(function (response) {

          if (response) {

            Utils.customizeArray(response.data, listData.list);

            listData.loadingInProcess = false;

            if (callback) {
              callback(response.data);
            }
          }
          listData.loadingInProcess = false;
        }, function (response) {
          listData.loadingInProcess = false;
          if (callback) {
            callback(response.data);
          }
        });
      }

      function getRecentActivities(scope, params, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        params.keyword = "";

        var list = Utils.customizeObj([]);

        storage.recentActivities[scope.$id] = {
          params: params,
          scope: scope,
          list: list
        };

        $http({
          method: 'GET',
          url: '/activity/',
          params: params
        }).then(function (response) {

          if (response) {

            Utils.customizeArray(response.data, list);
            if (callback) {
              callback(response.data);
            }
          }
        }, function (response) {
          if (callback) {
            callback(response.data);
          }
        });

        RealTimeService.subscribe('/activity', scope, function (newChange) {
          console.log(newChange);
          if (newChange.action == 'ACTIVITY_CREATED') {
            list.unshift(Utils.customizeObj(newChange.data));
            list.pop();
          }
        });
        scope.$on('$destroy', function () {
          delete storage.lists[scope.$id];
        });
        return list;
      }

      //function getRecentActivities() {
      //
      //    if (storage.recentActivities.length < recentActivitiesAmount) {
      //        $http({
      //            method: 'GET',
      //            url: '/activities'
      //        }).then(function (resp) {
      //
      //            Utils.customizeArray(resp.data, storage.recentActivities);
      //            storage.recentActivities.splice(recentActivitiesAmount, storage.recentActivities.length);
      //        });
      //    }
      //
      //    return storage.recentActivities;
      //}

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
          users: UsersService.getAllByCompanyId(companyId),
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

          console.log(newChange);

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

        RealTimeService.subscribe('/rightBarCompanyInfo?targetId=' + companyId, scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'RB_COMPANY_INFO') {
            Utils.customizeObj(newChange.data, companyInfo);
          }
        });

        return companyInfo;
      }

      return {
        getActivities: getActivities,
        getRecentActivities: getRecentActivities,
        loadMoreActivities: loadMoreActivities,
        getClientCompaniesGroupedData: getClientCompaniesGroupedData,
        getOneCompanyGroupedData: getOneCompanyGroupedData,
        getCurrentUserInfo: getCurrentUserInfo,
        getClientCompanyInfo: getClientCompanyInfo
      }

    }]);

})(window, jQuery);
