'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('DevicesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'UsersService', 'Downloader', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, UsersService, Downloader, CompaniesService) {

      var storage = { devices: {}, callbacks: {}, deviceCounter: {}, oneTimeCallbacks: {} },
        serviceScope = $rootScope.$new(),
        callbacksForRemoteInstall = {},
        callbacksForRemoteUninstall = {},
        callbackForRemoteConnection = {};
      $rootScope.onInitDevciesCompleted = false;

      var initListeners = [],
        initialized = false;

      var scannedDevices = {};


      var installationStatuses = {
        'INITIALIZATION': {
          status: 'Installing',
          message: "Remote installation initialized"
        },
        'CONNECT_TO_HOST': {
          status: 'Installing',
          message: 'Connecting to a remote computer'
        },
        'OPEN_SC_MANAGER': {
          status: 'Installing',
          message: 'Opening the service manager'
        },
        'OPEN_S_C_MANAGER': {
          status: 'Installing',
          message: 'Opening the service manager'
        },
        'INSTALL_CLEAN_UP': {
          status: 'Installing',
          message: 'Cleaning the previous installation'
        },
        'OPEN_DESTINATION_FOLDER': {
          status: 'Installing',
          message: 'Opening the destination folder'
        },
        'COPY_BINARY_FILES': {
          status: 'Installing',
          message: 'Copying the binary files'
        },
        'SERVICE_INSTALLATION': {
          status: 'Installing',
          message: 'Running the service'
        },
        'SERVICE_INSTALLED': {
          status: 'Installing',
          message: 'Service is installed \ started'
        },
        'BIN_DOWNLOADING': {
          status: 'Installing',
          message: 'Downloading the installer'
        },
        'INSTALLATION': {
          status: 'Installing',
          message: 'Running the installer'
        },
        'INSTALL_FINISHED': {
          status: 'Installed',
          message: 'Remote installation completed successfully'
        },
        'ERROR_USER_NAME_OR_PASS': {
          status: 'Bad password',
          message: 'Incorrect login or password'
        },
        'ERROR_INVALID_USER_NAME': {
          status: 'Bad password',
          message: 'Incorrect username'
        },
        'ERROR_HOST_OFFLINE_OR_FIREWALL': {
          status: 'Blocked',
          message: 'The remote computer is not connected to the network or is blocked by a firewall'
        },
        'ERROR_UAC': {
          status: 'Blocked',
          message: 'Enabled UAC does not allow installation'
        },
        'ERROR_INITIALIZATION': {
          status: 'Install error',
          message: 'Initialization error'
        },
        'ERROR_CONNECT_TO_HOST': {
          status: 'Install error',
          message: 'Error  connecting to a remote computer'
        },
        'ERROR_OPEN_SC_MANAGER': {
          status: 'Install error',
          message: 'Error opening service manager'
        },
        'ERROR_OPEN_S_C_MANAGER': {
          status: 'Install error',
          message: 'Error opening service manager'
        },
        'ERROR_OPEN_DESTINATION_FOLDER': {
          status: 'Install error',
          message: 'Error opening destination folder'
        },
        'ERROR_COPY_BINARY_FILES': {
          status: 'Install error',
          message: 'Error copying files'
        },
        'ERROR_SERVICE_INSTALLATION': {
          status: 'Install error',
          message: 'Error installing service'
        },
        'ERROR_BIN_DOWNLOADING': {
          status: 'Install error',
          message: 'Failed to load installer'
        },
        'ERROR_INSTALLATION': {
          status: 'Install error',
          message: 'Installation error'
        },

      }

      Utils.customizeObj(storage);

      CompaniesService._addInitListener(init);

      function init() {

        $http.get("/devices?companyId=" + CompaniesService.getCurrentCompany().id).then(function (resp) {
          var devices = storage.devices;
          $rootScope.onInitDevciesCompleted = true;
          var listOfCompaniesWithAgents = {};
          Object.keys(resp.data).forEach(function (key, index) {
            if (resp.data[key] !== null) {
              listOfCompaniesWithAgents[key] = resp.data[key];
            }
          });

          Utils.customizeObj(listOfCompaniesWithAgents, devices);
          calculateDevicesCountersAndCallCallbacks();

          $rootScope.$broadcast('onDevicesComplated', true);
          RealTimeService.subscribe('/device', serviceScope, function (newChange) {

            if (false && newChange.action === 'REMOTE_INSTALL_INFO') {

              var device = Utils.findById(scannedDevices[companyId], newChange.data.netScanId);
              if (!device) {
                for (var i in scannedDevices[companyId]) {

                  if (scannedDevices[companyId][i].deviceId === newChange.data.deviceId || newChange.data.netScanId) {
                    device = scannedDevices[companyId][i];
                  }
                }
              }

              if (device) {
                if (newChange.data.status === 'MANAGED') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'managed');
                } else if (newChange.data.status === 'INSTALLED') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'installed');
                } else if (newChange.data.status === 'INSTALL_ERROR') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'error');
                } else if (newChange.data.status === 'LOGIN_ERROR') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'loginError');
                } else if (newChange.data.status === 'UNKNOWN') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'unknown');
                } else if (newChange.data.status === 'INSTALL_INITIALIZED') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'init');
                } else if (newChange.data.status === 'INSTALL_DEPLOYING') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'inProgress');
                }
                Utils.defineReadOnlyProperty(device, "message", newChange.data.content);
                Utils.defineReadOnlyProperty(device, "realTimeChecker", true);
              }

              var call = callbacksForRemoteInstall[newChange.data.netScanId] || callbacksForRemoteInstall[newChange.data.deviceId];
              if (call && typeof call === "function") {
                call();
              }

              var uninstallCall = callbacksForRemoteUninstall[newChange.data.netScanId] || callbacksForRemoteUninstall[newChange.data.deviceId];
              if (uninstallCall && typeof uninstallCall === "function") {
                uninstallCall();
              }
            } else if (newChange.action === 'DEVICE_ONLINE') {
              var deviceFound = false;
              for (var i in devices[newChange.data.clientCompanyId]) {
                if (devices[newChange.data.clientCompanyId][i].id === newChange.data.value) {
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'online', true);
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'userName', newChange.data.userName);
                  deviceFound = true;
                }
              }

              if (!deviceFound) {

                getUpdatedDevices();
                // var username = newChange.data.username;

                // // var parsedData = JSON.parse(newChange.data.value);
                // // parsedData.device.userName = newChange.data.userName;
                // if (!devices[newChange.data.clientCompanyId]) {
                //   var companyId = newChange.data.clientCompanyId;
                //   devices[companyId] = [];
                //   devices[companyId].push(parsedData.device);
                // } else {
                //   var deviceById = Utils.findById(devices[newChange.data.clientCompanyId], parsedData.device.id);
                //   Utils.defineReadOnlyProperty(parsedData.device, 'uninstalledAt', '');
                //   Utils.customizeObj(parsedData.device, deviceById);
                // }
                // calculateDevicesCountersAndCallCallbacks();
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'DEVICE_OFFLINE') {
              for (var i in devices[newChange.data.clientCompanyId]) {
                if (devices[newChange.data.clientCompanyId][i].id === newChange.data.value) {
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'online', false);
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'userName', newChange.data.userName);
                  var now = Date.now();
                  Utils.defineReadOnlyProperty(devices[newChange.data.clientCompanyId][i], 'offlineSince', now);
                  break;
                }
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'DEVICE_INSTALLED') {

              var parsedData = JSON.parse(newChange.data.value);
              parsedData.device.userName = newChange.data.userName;
              if (!devices[newChange.data.clientCompanyId]) {
                var companyId = newChange.data.clientCompanyId;
                devices[companyId] = [];
                devices[companyId].push(parsedData.device);
              } else {
                var deviceById = Utils.findById(devices[newChange.data.clientCompanyId], parsedData.device.id);
                Utils.defineReadOnlyProperty(parsedData.device, 'uninstalledAt', '');
                Utils.customizeObj(parsedData.device, deviceById);
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'DEVICE_UNINSTALLED') {
              if (newChange.data.uninstalledAt) {
                var device = Utils.findById(devices[newChange.data.clientCompanyId], newChange.data.value);
                Utils.defineReadOnlyProperty(device, 'uninstalledAt', newChange.data.uninstalledAt);
              } else {
                Utils.deleteById(devices[newChange.data.clientCompanyId], newChange.data.value);
              }
              calculateDevicesCountersAndCallCallbacks();
            } else if (newChange.action === 'REMOTE_CONNECTION') {
              if (callbackForRemoteConnection[newChange.data.sessionId]) {
                callbackForRemoteConnection[newChange.data.sessionId]();
              }
            } else if (newChange.action === 'TEST_CREDENTIALS') {
              if (scannedDevices[newChange.data.companyId]) {
                var device = _getDeviceByAgentId(devices[newChange.data.companyId], newChange.data.agentId);
                if (device) {
                  device = _getNetScanByDeviceId(scannedDevices[newChange.data.companyId], device.id);
                  if (device && newChange.data.testResult.toUpperCase() === 'FAIL') {

                    $rootScope.$broadcast('masterAgentWrongCredentials-' + device.deviceId);
                  }
                }
              }
            } else if (newChange.action === 'AGENT_ACTIVITY_STATUS') {

              var companyId = getCompanyIdByAgentId(newChange.data.agentId);
              if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('Idle')) {
                if (companyId) {
                  for (var i = 0; i < devices[companyId].length; i++) {
                    if (devices[companyId][i].agentId === newChange.data.agentId) {
                      if (newChange.data.statuses.Idle) {
                        storage.devices[companyId][i].Idle = newChange.data.statuses.Idle;
                      } else {
                        storage.devices[companyId][i].Idle = 'none';
                      }

                      break;
                    }
                  }
                }

              } else if (newChange.data && newChange.data.statuses && newChange.data.statuses.hasOwnProperty('NoRestart') && newChange.data.statuses.hasOwnProperty('Online')) {

                for (var i = 0; i < devices[companyId].length; i++) {
                  if (companyId) {
                    if (devices[companyId][i].agentId === newChange.data.agentId) {
                      storage.devices[companyId][i].NoRestart = newChange.data.statuses.NoRestart;
                      storage.devices[companyId][i].Online = newChange.data.statuses.Online;
                      break;
                    }
                  }
                }
              }
            }
          });

          RealTimeService.subscribe('/oneTimeConnection', $rootScope, function (newChange) {
            storage.oneTimeCallbacks[newChange.action] && storage.oneTimeCallbacks[newChange.action](newChange);
            storage.oneTimeCallbacks.listener && storage.oneTimeCallbacks.listener(newChange);


            if (newChange.action === 'REMOTE_CONNECTION_CLOSED') {
              var session = newChange.data;
              $rootScope.openCreateTicketForm(session.sessionId, session.duration, session.clientCompany.id, session.oneTime ? '' : session.deviceId);
            } else if (newChange.action === 'ONE_TIME_CONNECTION_OPEN') {
              addRemoteConnectionSessionToDevice(newChange, devices);

            } else if (newChange.action === 'ONE_TIME_DELETED') {



              removeRemoteConnectionSessionToDevice(newChange, devices);
            }
          })
        });

        initialized = true;

        for (var i = 0; i < initListeners.length; i++) {
          initListeners[i]();
        }
      }

      function getUpdatedDevices() {
        $http.get("/devices?companyId=" + CompaniesService.getCurrentCompany().id).then(function (resp) {
          var devices = storage.devices;

          var listOfCompaniesWithAgents = {};
          Object.keys(resp.data).forEach(function (key, index) {
            if (resp.data[key] !== null) {
              listOfCompaniesWithAgents[key] = resp.data[key];
            }
          });

          Utils.customizeObj(listOfCompaniesWithAgents, devices);
          calculateDevicesCountersAndCallCallbacks();
        });
      }

      function addRemoteConnectionSessionToDevice(newChange, devices) {
        //var device = Utils.findById(devices[newChange.data.clientCompany.id], newChange.data.deviceId);
        for (var i = 0; i < devices[newChange.data.clientCompany.id].length; i++) {
          if (devices[newChange.data.clientCompany.id][i].id === newChange.data.deviceId) {
            devices[newChange.data.clientCompany.id][i].OneTimeConnectionData.push(newChange.data)
          }
        }
      }

      function removeRemoteConnectionSessionToDevice(newChange, devices) {
        var companyId = getCompanyIdByAgenSessionId(newChange.data);
        if (companyId) {
          for (var i = 0; i < devices[companyId].length; i++) {
            for (var r = 0; r < devices[companyId][i].OneTimeConnectionData.length; r++) {
              if (devices[companyId][i].OneTimeConnectionData[r].id === newChange.data) {
                devices[companyId][i].OneTimeConnectionData.splice(r, 1);
              }
            }
          }
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
          if (scopeId === 'staticCopy') {
            continue;
          }
          var callback = storage.callbacks[scopeId];
          if (callback && callback.callback && typeof callback.callback === "function") {
            callback.callback(storage.devices[callback.companyId] || storage.devices);
          }
        }
      }

      function destroyCallbackByScope(scope) {
        for (var scopeId in storage.callbacks) {
          if (companyId === 'staticCopy') {
            continue;
          }
          if (scopeId === scope.$id) {
            delete storage.callbacks[scopeId]
          }
        }
      }

      function calculateDevicesCountersAndCallCallbacks() {
        for (var companyId in storage.devices) {
          if (companyId === 'staticCopy') {
            continue;
          }

          if (storage.devices[companyId] === null || !storage.devices[companyId].length) {
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

      function downloadAgent(companyId, userName, userPassword, globalAutoInstall, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }

        var url = "/data/prepareDownloadAgent?companyId=" + companyId + "&userName=" + userName +
          "&userPassword=" + userPassword + "&autoGlobalRemoteInstall=" + globalAutoInstall;
        return $http.get(url).then(function (response) {
          if (callback) {
            callback(response.data);
          }
          if (response.data.code >= 400) {
            return;
          }
          var link = document.createElement('a');
          link.target = "_blank";
          link.href = response.data.link;
          link.download = response.data.link.substring(response.data.link.lastIndexOf('/') + 1, response.data.link.length);;
          link.click();
        });
      }

      function sendDownloadAgentLink(agentDownloadDto, callback) {
        var future = $http.post('/data/sendAgent', agentDownloadDto);
        Utils.handleCallback(future, callback);
      }

      function getDownloadAgentLink(agentDownloadDto, callback) {
        var future = $http.post('/data/getAgentDownloadLink', agentDownloadDto);
        Utils.handleCallback(future, callback);
      }

      function markDeviceAsMaster(companyId, agentId, callback) {
        var request = {
          "masterAgentId": agentId,
          "clientCompanyId": companyId
        }

        $http.post('/devices/updateMasterAgent', request)
          .then(function (resp) {

          })
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

          storage.oneTimeCallbacks.listener = function (newChange) {
            if (newChange.data.oneTime) {
              var session = Utils.findById(list, newChange.data.id);
              if (session) {
                Utils.customizeObj(newChange.data, session);
              } else {
                list.unshift(Utils.customizeObj(newChange.data));
              }
            }
          };

          storage.oneTimeCallbacks.ONE_TIME_DELETED = function (newChange) {
            Utils.deleteById(list, newChange.data);
          };
          storage.oneTimeCallbacks.ONE_TIME_UNINSTALLED = storage.oneTimeCallbacks.ONE_TIME_DELETED;
        });
      }

      function deleteRemoteSession(ids, callback) {
        if (!ids) {
          throw 'ids is required!';
        }

        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        var future = $http({
          url: '/remote/deleteRemoteSession',
          method: 'POST',
          data: ids
        });

        Utils.handleCallback(future, callback);
      }

      //one time connection
      function getSessionId(remoteSessionId, connectionType, callback) {

        if (!remoteSessionId) {
          throw 'remoteSessionId is required!';
        }

        if (!connectionType) {
          throw 'connectionType is required!';
        }

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
      function createRemoteSession(deviceId, companyId, connectionType, callback, ticketId) {

        if (!deviceId) {
          throw 'deviceId is required!';
        }

        if (!companyId) {
          throw 'companyId is required!';
        }

        if (!connectionType) {
          throw 'connectionType is required!';
        }

        $http.get('/remote/createRemoteSession?deviceId=' + deviceId + '&connectionType=' + connectionType + '&companyId=' + companyId + (ticketId ? '&ticketId=' + ticketId : '')).then(function (resp) {
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

        if (!Array.isArray(devicesIds)) {
          devicesIds = [devicesIds];
        }

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

      function sendInstallAgentRequests(dto, callback) {
        var future = $http.post('/devices/remoteInstall', dto);
        Utils.handleCallback(future, callback);
      }

      function sendUninstallAgentRequest(companyId, devicesIds, callback) {
        if (!companyId) {
          throw "CompanyId is required!"
        }
        if (!devicesIds) {
          throw "agentId is required!"
        }

        if (!Array.isArray(devicesIds)) {
          devicesIds = [devicesIds];
        }

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

        if (!Array.isArray(agentIds)) {
          agentIds = [agentIds];
        }

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

        if (!Array.isArray(agentIds)) {
          agentIds = [agentIds];
        }

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

        scannedDevices[companyId] = [];

        $http.get('/devices/refreshNetworkScan?companyId=' + companyId).success(function (resp) {
          if (callback) {
            callback(resp);
          }
        }).error(function (resp) {
          if (callback) {
            callback(resp);
          }
        });
      }

      function getLastScanDevices(scope, companyId, callback) {

        if (!scope) {
          throw "scope is required!"
        }
        if (!companyId) {
          throw "CompanyId is required!"
        }

        $http.get('/devices/networkScan?companyId=' + companyId).then(function (resp) {
          var networkScan = JSON.parse(resp.data.networkScan);

          if (networkScan) {
            Utils.defineReadOnlyProperty(scannedDevices, "status", networkScan.netScanStatus.toLowerCase());
            scannedDevices[companyId] = networkScan.devices;


          }


          RealTimeService.subscribe('/netScan/' + companyId, scope, function (newChange) {

            if (newChange.action === 'NETWORK_SCAN') {

              var data = newChange.data,
                newDevices = data.deviceList,
                status = data.status.toLowerCase();

              if (!scannedDevices[data.companyId] || (scannedDevices.status === 'finished' && status !== 'finished')) {
                scannedDevices[data.companyId] = [];
              }

              Utils.defineReadOnlyProperty(scannedDevices, "status", status);

              for (var i = 0; i < newDevices.length; i++) {
                var newDevice = newDevices[i],
                  dublicatedDevice = Utils.findById(scannedDevices[data.companyId], newDevice.id);

                if (!dublicatedDevice) {
                  scannedDevices[data.companyId].push(newDevice);
                } else {
                  Utils.customizeObj(newDevice, dublicatedDevice);
                }
              }

            } else if (newChange.action === 'REMOTE_INSTALL' || newChange.action === 'REMOTE_INSTALL_INFO') {
              var device = Utils.findById(scannedDevices[companyId], newChange.data.netScanId);
              if (!device) {
                for (var i in scannedDevices[companyId]) {

                  if (scannedDevices[companyId][i].deviceId === newChange.data.deviceId || newChange.data.netScanId) {
                    device = scannedDevices[companyId][i];
                  }
                }
              }



              if (device) {

                var statusName = newChange.data.status;
                var status = installationStatuses[statusName];



                if (statusName === 'MANAGED') {
                  Utils.defineReadOnlyProperty(device, "agentStatus", 'managed')
                  Utils.defineReadOnlyProperty(device, "agentStatusTooltip", 'Managed');
                  return;
                }
                Utils.defineReadOnlyProperty(device, "agentStatus", status.status);
                Utils.defineReadOnlyProperty(device, "agentStatusTooltip", status.message);
                Utils.defineReadOnlyProperty(device, "message", newChange.data.content);
                Utils.defineReadOnlyProperty(device, "realTimeChecker", true);
              }

              var call = callbacksForRemoteInstall[newChange.data.netScanId] || callbacksForRemoteInstall[newChange.data.deviceId];
              if (call && typeof call === "function") {
                call();
              }

              var uninstallCall = callbacksForRemoteUninstall[newChange.data.netScanId] || callbacksForRemoteUninstall[newChange.data.deviceId];
              if (uninstallCall && typeof uninstallCall === "function") {
                uninstallCall();
              }
            } else if (newChange.action === 'AGENT_PASSWORDS_CHANGED') {
              for (var i = 0; i < newChange.data.length; i++) {
                var agentPassword = newChange.data[i];
                var device = Utils.findById(scannedDevices[companyId], agentPassword.deviceId);
                if (!device) {
                  device = _getNetScanByDeviceId(scannedDevices[companyId], agentPassword.deviceId);
                }
                device.agentPassword = device.agentPassword || {};
                Utils.customizeObj(agentPassword, device.agentPassword);
              }
            } else if (newChange.action === 'NETWORK_DEVICE_DESCRIPTON') {
              var device = Utils.findById(scannedDevices[companyId], newChange.data.deviceId);
              device.description = newChange.data.description;
            }
            if (callback) {
              callback(scannedDevices);
            }
          });

          if (callback) {
            callback(scannedDevices);
          }

        }, function () {
          if (callback) {
            callback(scannedDevices);
          }
          return scannedDevices;
        });
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

        var agentSettings = {};

        $http.get('/devices/getAgentSettingsByCompany?companyId=' + companyId).then(function (resp) {
          agentSettings = resp.data;

          if (callback) {
            callback(agentSettings);
          }
        });

        RealTimeService.subscribe('/agentSettings/' + companyId, serviceScope, function (newChange) {

          if (newChange.action === 'MASTER_AGENT_CHANGED') {

            agentSettings.masterAgent = newChange.data;

            if (callback) {
              callback(agentSettings);
            }
          }
        });

        if (callback) {
          callback(agentSettings);
        }

        return agentSettings;
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
            if (callback) {
              callback(newChange.data);
            }
          }
        });
      }

      function getDeviceReports(agentIds, companyId, callback) {
        var future = $http.post('/devices/report?companyId=' + companyId, agentIds);
        Utils.handleCallback(future, callback);
      }

      function getOneTimeHistory(callback) {
        var history = [];

        $http.get('/remote/history').then(function (resp) {
          Utils.customizeArray(resp.data, history);

          storage.oneTimeCallbacks.REMOTE_CONNECTION_CLOSED = function (newChange) {
            if (newChange.data.oneTime) {
              history.unshift(newChange.data);
            }
          };

          if (callback) {
            callback(history);
          }
        });

        return history;
      }

      function getOneById(id, companyId) {
        return Utils.findById(storage.devices[companyId], id);
      }

      function getOneByDeviceId(deviceId, companyId) {
        var devices = storage.devices[companyId] || storage.devices;

        if (companyId) {
          return _getDeviceByDeviceId(devices, deviceId);
        } else {
          for (var companyId in devices) {
            if (companyId !== 'staticCopy') {
              var devicesByCompany = devices[companyId];
              var device = _getDeviceByDeviceId(devicesByCompany, deviceId);
              if (device) {
                return device;
              }
            }
          }
        }
      }

      function _getDeviceByDeviceId(devices, agentId) {
        if (devices) {
          for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            if (device.id === agentId) {
              return device;
            }
          }
        }

      }

      function _getNetScanByDeviceId(devices, deviceId) {
        for (var i = 0; i < devices.length; i++) {
          var device = devices[i];
          if (device.deviceId === deviceId) {
            return device;
          }
        }
      }

      function getOneByAgentId(agentId, companyId) {
        var devices = storage.devices[companyId] || storage.devices;

        if (companyId) {
          return _getDeviceByAgentId(devices, agentId);
        } else {
          for (var companyId in devices) {
            if (companyId !== 'staticCopy') {
              var devicesByCompany = devices[companyId];
              var device = _getDeviceByAgentId(devicesByCompany, agentId);
              if (device) {
                return device;
              }
            }
          }
        }
      }

      function getCompanyIdByAgentId(value) {
        if (value) {
          return Object.keys(storage.devices).find(function (key) {
            if (key !== 'staticCopy') {
              for (var i = 0; i < storage.devices[key].length; i++) {
                if (storage.devices[key][i].agentId === value) {
                  return true;
                }
              }

            }
          });
        }
      }

      function getCompanyIdByAgenSessionId(value) {
        if (value) {
          return Object.keys(storage.devices).find(function (key) {
            if (key !== 'staticCopy') {
              for (var i = 0; i < storage.devices[key].length; i++) {
                if (storage.devices[key][i].OneTimeConnectionData && storage.devices[key][i].OneTimeConnectionData.length) {
                  for (var c = 0; c < storage.devices[key][i].OneTimeConnectionData.length; c++) {
                    if (storage.devices[key][i].OneTimeConnectionData[c].id === value) {
                      return true;
                    }
                  }
                }
              }
            }
          });
        }
      }

      function _getDeviceByAgentId(devices, agentId) {
        for (var i = 0; i < devices.length; i++) {
          var device = devices[i];
          if (device.agentId === agentId) {
            return device;
          }
        }
      }

      function saveReportEditedFields(dto, callback) {
        var future = $http.post('/devices/report/edit', dto);
        Utils.handleCallback(future, callback);
      }

      function reportPasswordShow(agentId, companyId, callback) {
        var future = $http.get('/devices/report/showPassword?agentId=' + agentId + '&companyId=' + companyId);
        Utils.handleCallback(future, callback);
      }

      function getGadgets(callback) {
        var future = $http.get('/gadgets');
        Utils.handleCallback(future, callback);
      }

      function saveGadget(name, companyId, callback) {
        var future = $http.post('/gadgets', { name: name, clientCompanyId: companyId });
        Utils.handleCallback(future, callback);
      }

      function removeGadget(id, callback) {
        var future = $http.delete('/gadgets/' + id);
        Utils.handleCallback(future, callback);
      }

      function saveMasterAgent(companyId, agentId, callback) {
        var future = $http.post('/devices/updateMasterAgent', { masterAgentId: agentId, clientCompanyId: companyId });
        Utils.handleCallback(future, callback);
      }

      function testCredentials(dto, callback) {
        var future = $http.post('/devices/updateAndTestAgentPassword', dto);
        Utils.handleCallback(future, callback);
      }

      function getAgentsAndReportsDataByCompanyId(scope, companyId, callback) {

        var checking = 0;
        $rootScope.isAgentsRequestSending = true;
        var extendedRespInterval = setInterval(function () {

          if (storage.devices[companyId] && storage.devices[companyId].length) {
            $http.get('/devices/extended?companyId=' + companyId).then(function (resp) {
              $rootScope.isAgentsRequestSending = false;
              if (resp) {

                for (var i = 0; i < storage.devices[companyId].length; i++) {
                  storage.devices[companyId][i].report = resp.data[companyId][i].report;
                  storage.devices[companyId][i].label = resp.data[companyId][i].label;
                  storage.devices[companyId][i].OneTimeConnectionData = [];
                  storage.devices[companyId][i].iconName = resp.data[companyId][i].iconName
                  storage.devices[companyId][i].remoteSessions = resp.data[companyId][i].remoteSessions;
                  if (resp.data[companyId][i].remoteSessions && resp.data[companyId][i].remoteSessions.length && resp.data[companyId][i].remoteSessions.length > 0) {
                    for (var r = 0; r < resp.data[companyId][i].remoteSessions.length; r++) {
                      var connection = {
                        startedAt: resp.data[companyId][i].remoteSessions[r].createdAt || resp.data[companyId][i].remoteSessions[r].startedAt,
                        id: resp.data[companyId][i].remoteSessions[r].id,
                        sessionId: resp.data[companyId][i].remoteSessions[r].sessionId || resp.data[companyId][i].remoteSessions[r].id,
                        agentConnectedAt: resp.data[companyId][i].remoteSessions[r].createdAt || resp.data[companyId][i].remoteSessions[r].startedAt,
                      };
                      var user = UsersService.getOneById(resp.data[companyId][i].remoteSessions[r].userId);
                      connection.performer = user;
                      storage.devices[companyId][i].OneTimeConnectionData.push(connection);
                    }
                  }
                  if (!resp.data[companyId][i].online) {
                    storage.devices[companyId][i].offlineSince = resp.data[companyId][i].offlineAt;
                  }
                }
              }
              getAgentsByCompany(scope, companyId, callback);
            });
          } else {

            $rootScope.isAgentsRequestSending = false;
          }
          checking++;
          if (checking > 4) {

            clearInterval(extendedRespInterval);
          }
          if (storage.devices[companyId]) {

            clearInterval(extendedRespInterval);
          }

        }, 1000)


      }

      function setNewDeviceLabel(dto, callback) {

        // dto structure
        // {
        // “agentId”:””,
        // “deviceId”:””,
        // “companyId”:””,
        // “newLabelValue”:””
        // }

        var future = $http.post('/devices/editAgentInfo', dto);
        Utils.handleCallback(future, callback);
      }

      var actionsList = ["idle", "norestart", "online"];

      function sendDeviceStatusRequest(companyId, agentId, callback) {
        if (companyId && agentId) {
          var dto = {
            companyId: companyId,
            agentId: agentId,
            actions: actionsList
          };

          var future = $http({
            url: '/devices/agentStatuses',
            method: 'POST',
            data: dto
          });
          Utils.handleCallback(future, callback);
        }
      }

      function getDevicesCredentials(devices, scope, callback) {
        var credentials = {};
        console.log("getDevicesCredentials");
        $http.post('/passwordRecords/devices/password', devices).then(function (resp) {
          credentials = resp.data;
          RealTimeService.subscribe('/passwordRecords', scope, function (newChange) {
            if (newChange.action === 'PASSWORD_RECORD_CREATED') {
              var agentId = newChange.data.links[0] && newChange.data.links[0].deviceId;

              if (agentId) {
                var credential = {
                  password: newChange.data.password,
                  username: newChange.data.username,
                  id: newChange.data.id
                };

                if (!credentials[agentId]) {
                  credentials.agentId = [credential];
                } else {
                  credentials[agentId].push(credential);
                }
              }


            } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
              var agentId = newChange.data.links[0] && newChange.data.links[0].deviceId;

              if (agentId) {
                var recordIndex = credentials[agentId].findIndex(function (el) {
                  return el.id === newChange.data.id;
                })

                if (recordIndex !== -1) {

                  credentials[agentId][recordIndex] = {
                    id: newChange.data.id,
                    password: newChange.data.password,
                    username: newChange.data.username
                  }
                }
              }


            } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
              var agents = Object.keys(credentials);

              for (var i = 0; i < agents.length; i++) {
                credentials[agents[i]] = credentials[agents[i]].filter(function (el) {
                  return el.id !== newChange.data.id;
                })
              }

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
        downloadAgent: downloadAgent,
        sendDownloadAgentLink: sendDownloadAgentLink,
        getDownloadAgentLink: getDownloadAgentLink,
        runScanDevices: runScanDevices,
        getDevicesCount: getDevicesCount,
        getAgentsByCompany: getAgentsByCompany,
        getLastScanDevices: getLastScanDevices,
        sendInstallAgentRequest: sendInstallAgentRequest,
        sendInstallAgentRequests: sendInstallAgentRequests,
        sendUninstallAgentRequest: sendUninstallAgentRequest,
        sendDescription: sendDescription,
        sendAgentUpdateRequest: sendAgentUpdateRequest,
        sendPowerAction: sendPowerAction,
        updateAgentSettings: updateAgentSettings,
        getAgentSettingsByCompany: getAgentSettingsByCompany,
        createOneTimeRemoteSession: createOneTimeRemoteSession,
        getRemoteSessions: getRemoteSessions,
        getSessionId: getSessionId,
        createRemoteSession: createRemoteSession,
        subscribeToRemoteConnection: subscribeToRemoteConnection,
        deleteRemoteSession: deleteRemoteSession,
        getSomeInfoForDevices: getSomeInfoForDevices,
        getDeviceReports: getDeviceReports,
        getOneTimeHistory: getOneTimeHistory,
        getOneById: getOneById,
        getOneByDeviceId: getOneByDeviceId,
        getOneByAgentId: getOneByAgentId,
        getCompanyIdByAgentId: getCompanyIdByAgentId,
        saveReportEditedFields: saveReportEditedFields,
        reportPasswordShow: reportPasswordShow,
        getGadgets: getGadgets,
        saveGadget: saveGadget,
        removeGadget: removeGadget,
        saveMasterAgent: saveMasterAgent,
        testCredentials: testCredentials,
        _addInitListener: _addInitListener,
        getAgentsAndReportsDataByCompanyId: getAgentsAndReportsDataByCompanyId,
        setNewDeviceLabel: setNewDeviceLabel,
        sendDeviceStatusRequest: sendDeviceStatusRequest,
        getDevicesCredentials: getDevicesCredentials,
        markDeviceAsMaster: markDeviceAsMaster,
        getUpdatedDevices: getUpdatedDevices,

      }
    }
  ]);
})
  (window, jQuery);
