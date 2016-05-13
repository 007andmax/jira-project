'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('DevicesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'UsersService', 'Downloader', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, UsersService, Downloader, CompaniesService) {

      var storage = { devices: {}, callbacks: {}, deviceCounter: {} },
        serviceScope = $rootScope.$new(),
        callbacksForRemoteInstall = {},
        callbacksForRemoteUninstall = {},
        callbackForRemoteConnection = {};

      var initListeners = [],
        initialized = false;

      Utils.customizeObj(storage);

      CompaniesService._addInitListener(init);

      function init() {
        $http.get("/devices?companyId=" + CompaniesService.getCurrentCompany().id).then(function (resp) {
          var devices = storage.devices;

          Utils.customizeObj(resp.data, devices);
          calculateDevicesCountersAndCallCallbacks();

          RealTimeService.subscribe('/device', serviceScope, function (newChange) {

            if (newChange.action === 'DEVICE_ONLINE') {
              for (var i in devices[newChange.data.clientCompanyId]) {
                if (devices[newChange.data.clientCompanyId][i].id === newChange.data.value) {
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'online', true);
                }
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'DEVICE_OFFLINE') {
              for (var i in devices[newChange.data.clientCompanyId]) {
                if (devices[newChange.data.clientCompanyId][i].id === newChange.data.value) {
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'online', false);
                }
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'DEVICE_INSTALLED') {
              if (!devices[newChange.data.clientCompanyId]) {
                var companyId = newChange.data.clientCompanyId;
                devices[companyId] = [];
                devices[companyId].push(JSON.parse(newChange.data.value).device);
              } else {
                devices[newChange.data.clientCompanyId].push(Utils.customizeObj(JSON.parse(newChange.data.value).device));
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'DEVICE_UNINSTALLED') {
              for (var i in devices[newChange.data.clientCompanyId]) {
                if (devices[newChange.data.clientCompanyId][i].id === newChange.data.value) {
                  devices[newChange.data.clientCompanyId].splice(i, 1);
                }
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'REMOTE_CONNECTION') {
              if (callbackForRemoteConnection[newChange.data.sessionId]) {
                callbackForRemoteConnection[newChange.data.sessionId]();
              }
            }
          });

          RealTimeService.subscribe('/oneTimeConnection', $rootScope, function (newChange) {
            if (newChange.action === 'REMOTE_CONNECTION_CLOSED') {
              console.log(newChange);
              $rootScope.openCreateTicketForm(newChange.data.id, newChange.data.duration);
            }
          })
        });

        initialized = true;

        for (var i = 0; i < initListeners.length; i++) {
          initListeners[i]();
        }
      }

      function _addInitListener(callback) {

        if (!callback) {
          return;
        }

        if (!initialized) {
          initListeners.push(callback);
        } else {
          callback();
        }
      }

      function callCallbacks() {
        for (var scopeId in storage.callbacks) {
          if (scopeId === 'staticCopy') continue;
          var callback = storage.callbacks[scopeId];
          if (callback && callback.callback && typeof callback.callback === "function") {
            callback.callback(storage.devices[callback.companyId]);
          }
        }
      }

      function destroyCallbackByScope(scope) {
        for (var scopeId in storage.callbacks) {
          if (companyId === 'staticCopy') continue;
          if (scopeId === scope.$id) {
            delete storage.callbacks[scopeId]
          }
        }
      }

      function calculateDevicesCountersAndCallCallbacks() {
        for (var companyId in storage.devices) {
          if (companyId === 'staticCopy') continue;

          if (storage.devices[companyId].length == 0) {
            delete storage.devices[companyId];
            delete storage.deviceCounter[companyId];
            callCallbacks();
            return;
          }

          if (!storage.deviceCounter.companyId) {
            storage.deviceCounter[companyId] = Utils.customizeObj({ all: 0, online: 0 });
          }

          Utils.defineReadOnlyProperty(storage.deviceCounter[companyId], 'all', storage.devices[companyId].length);
          var online = 0;

          for (var i = 0; i < storage.devices[companyId].length; i++) {
            if (storage.devices[companyId][i].online) {
              online++;
            }
          }
          Utils.defineReadOnlyProperty(storage.deviceCounter[companyId], 'online', online);

        }
        callCallbacks();
      }

      function downloadAgent(companyId, userName, userPassword, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }

        return $http.get("/data/prepareDownloadAgent?companyId=" + companyId + "&userName=" + userName + "&userPassword=" + userPassword).then(function (response) {
          if (callback) {
            callback(response.data);
          }
          if (response.data.code >= 400) {
            return;
          }
          Downloader.downloadByUrl(response.data.link);
        });
      }

      function createOneTimeRemoteSession(callback) {
        $http.get('/remote/createOneTimeRemoteSession').then(function (resp) {
          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function getRemoteSessions(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        return Utils.getListByUrl('/remote/getRemoteSessions', callback, function (list) {
          RealTimeService.subscribe('/oneTimeConnection', scope, function (newChange) {
            console.log(newChange);

            if (newChange.action === 'ONE_TIME_CONNECTION_CLOSED' && !newChange.data.id) {
              //do nothing
            } else if (newChange.action === 'ONE_TIME_DELETED' || newChange.action === 'ONE_TIME_UNINSTALLED') {
              Utils.deleteById(list, newChange.data);
            } else {
              var session = Utils.findById(list, newChange.data.id);
              if (session) {
                Utils.customizeObj(newChange.data, session);
              } else {
                list.unshift(Utils.customizeObj(newChange.data));
              }
            }
          })
        });
      }

      function deleteRemoteSession(ids, callback) {
        if (!ids) throw 'ids is required!';

        if (!Array.isArray(ids)) ids = [ids];

        var future = $http({
          url: '/remote/deleteRemoteSession',
          method: 'POST',
          data: ids
        });

        Utils.handleCallback(future, callback);
      }

      //one time connection
      function getSessionId(remoteSessionId, connectionType, callback) {

        if (!remoteSessionId) throw 'remoteSessionId is required!';

        if (!connectionType) throw 'connectionType is required!';

        $http.get('/devices/getSessionId?remoteSessionId=' + remoteSessionId + '&connectionType=' + connectionType).then(function (resp) {
          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      //regular connection
      function createRemoteSession(deviceId, companyId, connectionType, callback) {

        if (!deviceId) throw 'deviceId is required!';

        if (!companyId) throw 'companyId is required!';

        if (!connectionType) throw 'connectionType is required!';

        $http.get('/remote/createRemoteSession?deviceId=' + deviceId + '&connectionType=' + connectionType + '&companyId=' + companyId).then(function (resp) {
          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function subscribeToRemoteConnection(sessionId, callback) {
        callbackForRemoteConnection[sessionId] = callback;
      }

      function sendInstallAgentRequest(companyId, agentId, devicesIds, agentIfForType, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }
        if (!agentId) {
          throw "agentId is required!"
        }
        if (!devicesIds) {
          throw "agentId is required!"
        }

        if (!Array.isArray(devicesIds)) devicesIds = [devicesIds];

        if (callback && typeof callback === "function") {
          for (var i in devicesIds) {
            callbacksForRemoteInstall[devicesIds[i]] = callback;
          }
        }

        $http({
          url: '/devices/sendInstallAgentRequest?companyId=' + companyId + '&agentId=' + agentId + '&agentIfForType=' + agentIfForType,
          method: 'POST',
          data: devicesIds
        });
      }

      function sendUninstallAgentRequest(companyId, devicesIds, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }
        if (!devicesIds) {
          throw "agentId is required!"
        }

        if (!Array.isArray(devicesIds)) devicesIds = [devicesIds];

        if (callback && typeof callback === "function") {
          for (var i in devicesIds) {
            callbacksForRemoteUninstall[devicesIds[i]] = callback;
          }
        }

        $http({
          url: '/devices/sendUninstallAgentRequest?companyId=' + companyId,
          method: 'POST',
          data: devicesIds
        });
      }

      function sendDescription(companyId, networkDeviceId, description, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }
        if (!networkDeviceId) {
          throw "agentId is required!"
        }

        var future = $http({
          url: '/devices/sendDescription?companyId=' + companyId + '&networkDeviceId=' + networkDeviceId,
          method: 'POST',
          data: description
        });
        Utils.handleCallback(future, callback);
      }

      function sendPowerAction(companyId, agentIds, action, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }
        if (!action) {
          throw "action is required!"
        }
        if (!agentIds) {
          throw "agentId is required!"
        }

        if (!Array.isArray(agentIds)) agentIds = [agentIds];

        var future = $http({
          url: '/devices/sendPowerAction?companyId=' + companyId + '&action=' + action,
          method: 'POST',
          data: agentIds
        });
        Utils.handleCallback(future, callback);
      }

      function sendAgentUpdateRequest(companyId, agentIds, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }
        if (!agentIds) {
          throw "agentId is required!"
        }

        if (!Array.isArray(agentIds)) agentIds = [agentIds];

        var future = $http({
          url: '/devices/sendAgentUpdateRequest?companyId=' + companyId,
          method: 'POST',
          data: agentIds
        });
        Utils.handleCallback(future, callback);
      }

      function getDevicesCount(scope, callback) {
        if (!scope) {
          throw "scope is required!"
        }

        storage.callbacks[scope.$id] = {
          companyId: CompaniesService.getCurrentCompany().id,
          callback: callback
        };

        if (storage.devices && callback) {
          callback(storage.devices);
        }

        return storage.deviceCounter;
      }

      function getAgentsByCompany(scope, companyId, callback) {

        if (!scope) {
          throw "scope is required!"
        }
        if (!companyId) {
          throw "CompanyId is required!"
        }

        if (callback) {
          storage.callbacks[scope.$id] = {
            companyId: companyId,
            callback: callback
          };
        }

        if (storage.devices[companyId] && callback) {
          callback(storage.devices[companyId]);
        }
        return storage.devices[companyId];

      }

      function runScanDevices(scope, companyId, callback) {

        if (!scope) {
          throw "scope is required!"
        }

        if (!companyId) {
          throw "CompanyId is required!"
        }

        $http.get('/devices/refreshNetworkScan?companyId=' + companyId).success(function (resp) {
          if (callback) {
            callback(resp);
          }
        }).error(function (resp) {
          if (callback) callback(resp);
        });
      }

      function getLastScanDevices(scope, companyId, callback) {

        if (!scope) {
          throw "scope is required!"
        }
        if (!companyId) {
          throw "CompanyId is required!"
        }

        var info = Utils.customizeObj({});

        $http.get('/devices/networkScan?companyId=' + companyId).then(function (resp) {
          Utils.customizeObj(resp.data, info);

          if (info.networkScan) {
            Utils.defineReadOnlyProperty(info, "networkScan", JSON.parse(info.networkScan));
          }

          RealTimeService.subscribe('/netScan', scope, function (newChange) {
            console.log(newChange);
            if (newChange.action === 'NETWORK_SCAN') {
              if (newChange.data === "finished") {
                Utils.defineReadOnlyProperty(info.networkScan, "netScanStatus", newChange.data);
              } else {
                var data = JSON.parse(newChange.data),
                  oldDevices = info.networkScan.devices,
                  newDevices = data.devices;
                Utils.defineReadOnlyProperty(info.networkScan, "netScanStatus", data.netScanStatus);
                Utils.defineReadOnlyProperty(info.networkScan, "lastScanDate", data.lastScanDate);

                for (var i in newDevices) {
                  var newDevice = newDevices[i];
                  var findById = Utils.findById(oldDevices, newDevice.id);
                  if (findById) {
                    Utils.customizeObj(newDevice, findById);
                  } else {
                    info.networkScan.devices.push(newDevice);
                  }
                }
              }

            } else if (newChange.action === 'REMOTE_INSTALL') {

              var device = Utils.findById(info.networkScan.devices, newChange.data.netScanId);

              if (!device) {
                for (var i in info.networkScan.devices) {
                  if (info.networkScan.devices[i].deviceId === newChange.data.deviceId) {
                    device = info.networkScan.devices[i];
                  }
                }
              }

              if (device) {
                if (newChange.data.status === 'MANAGED') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'managed');
                } else if (newChange.data.status === 'INSTALLED') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'installed');
                } else if (newChange.data.status === 'ERROR') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'error');
                } else if (newChange.data.status === 'LOGIN_ERROR') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'login error');
                } else if (newChange.data.status === 'UNKNOWN') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'unknown');
                } else if (newChange.data.status === 'INIT') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'init');
                } else if (newChange.data.status === 'IN_PROGRESS') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'inProgress');
                }
                Utils.defineReadOnlyProperty(device, "message", newChange.data.content);
              }

              var call = callbacksForRemoteInstall[newChange.data.netScanId] || callbacksForRemoteInstall[newChange.data.deviceId];
              if (call && typeof call === "function") {
                call();
              }

              var uninstallCall = callbacksForRemoteUninstall[newChange.data.netScanId] || callbacksForRemoteUninstall[newChange.data.deviceId];
              if (uninstallCall && typeof uninstallCall === "function") {
                uninstallCall();
              }
            }
            if (callback) {
              callback(info);
            }
          });

          if (callback) {
            callback(info);
          }

        }, function () {
          if (callback) {
            callback(info);
          }
          return info;
        });
      }

      function saveCredentials(list, companyId, callback) {
        if (!list) {
          throw "list is required!"
        }
        if (!companyId) {
          throw "companyId is required!"
        }

        var future = $http({
          url: '/devices/saveCredentials?companyId=' + companyId,
          method: 'POST',
          data: { credentialAgents: list }
        });
        Utils.handleCallback(future, callback);
      }

      function getCredentialsByCompany(companyId, callback) {
        if (!companyId) {
          throw "companyId is required!"
        }

        //var info = [];

        var future = $http({
          url: '/devices/getAllCredentials?companyId=' + companyId,
          method: 'GET'
        });

        RealTimeService.subscribe('/device', serviceScope, function (newChange) {

          if (newChange.action === 'CREDENTIALS_SAVED') {
            //Utils.customizeArray(newChange.data, info);
            if (callback) callback(newChange.data);
          }
        });

        if (callback) {
          future.then(function (resp) {
            //Utils.customizeArray(resp.data, info);
            callback(resp.data);
          }, function (resp) {
            callback(resp.data);
          });
        }
      }

      function updateAgentSettings(agentsSetting, callback) {
        if (!agentsSetting) {
          throw "agentsSetting is required!"
        }

        var future = $http({
          url: '/devices/updateAgentSettings',
          method: 'POST',
          data: agentsSetting
        });
        Utils.handleCallback(future, callback);
      }

      function getAgentSettingsByCompany(companyId, callback) {

        if (!companyId) {
          throw "companyId is required!"
        }

        var future = $http({
          url: '/devices/getAgentSettingsByCompany?companyId=' + companyId,
          method: 'GET'
        });
        Utils.handleCallback(future, callback);
      }

      function getAllAgentsAndLogin(companyId, callback) {

        if (!companyId) {
          throw "companyId is required!"
        }

        var future = $http({
          url: '/devices/getAllAgentsAndLogin?companyId=' + companyId,
          method: 'GET'
        });
        Utils.handleCallback(future, callback);
      }

      function getSomeInfoForDevices(companyId, callback) {
        if (!companyId) {
          throw "companyId is required!"
        }

        $http.get('/devices/getSomeInfoForDevices?companyId=' + companyId).then(function (resp) {
          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/device', serviceScope, function (newChange) {

          if (newChange.action === 'SOME_INFO_FOR_DEVICES') {
            if (callback) callback(newChange.data);
          }
        });
      }

      return {
        downloadAgent: downloadAgent,
        runScanDevices: runScanDevices,
        getDevicesCount: getDevicesCount,
        getAgentsByCompany: getAgentsByCompany,
        getAllAgentsAndLogin: getAllAgentsAndLogin,
        getLastScanDevices: getLastScanDevices,
        sendInstallAgentRequest: sendInstallAgentRequest,
        sendUninstallAgentRequest: sendUninstallAgentRequest,
        sendDescription: sendDescription,
        sendAgentUpdateRequest: sendAgentUpdateRequest,
        sendPowerAction: sendPowerAction,
        saveCredentials: saveCredentials,
        getCredentialsByCompany: getCredentialsByCompany,
        updateAgentSettings: updateAgentSettings,
        getAgentSettingsByCompany: getAgentSettingsByCompany,
        createOneTimeRemoteSession: createOneTimeRemoteSession,
        getRemoteSessions: getRemoteSessions,
        getSessionId: getSessionId,
        createRemoteSession: createRemoteSession,
        subscribeToRemoteConnection: subscribeToRemoteConnection,
        deleteRemoteSession: deleteRemoteSession,
        getSomeInfoForDevices: getSomeInfoForDevices,
        _addInitListener: _addInitListener
      }
    }
  ]);
})
(window, jQuery);
