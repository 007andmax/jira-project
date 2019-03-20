'use strict';

(function () {

  angular.module('quicktech.core.devices').controller('quicktech.core.devices.networkScanTabCtrl',
    [
      '$scope', 'UsersService', 'CompaniesService', 'DevicesService', 'quicktech.common.services.PermissionsService',
      'quicktech.common.services.UserNotificationService',
      'Utils', 'PasswordManagerService', 'quicktech.common.services.UserConfirmationsService', '$filter',
      function ($scope, UsersService, CompaniesService, DevicesService, PermissionsService,
                UserNotificationService, Utils, PasswordManagerService, UserConfirmationsService, $filter) {
        var lastMasterAgentId;

        $scope.testCredentialsModel = {};
        $scope.downloadAgentModel = {};
        $scope.isAllSelected = false;
        $scope.selectedDevices = {};
        $scope.isScanDevicesLoad = false;
        $scope.orderScanBy = 'ipAddress';
        $scope.reverse = false;
        $scope.PermissionsService = PermissionsService;
        $scope.passwordShown = false;
        $scope.defaultMasterAgent = null;
        $scope.selectedCredential = {};

        $scope.usersWithEmails = UsersService.getAllByCompanyId($scope.company.id).filter(function (user) {
          return !!user.primaryEmail;
        });

        DevicesService.getSomeInfoForDevices($scope.company.id, function (resp) {
          $scope.allowAgentInstall = resp.allowAgentInstall;
          if (resp.masterAgentId !== lastMasterAgentId) { // this check is needed when realtime comes
            lastMasterAgentId = resp.masterAgentId;
            $scope.discoveredByAgentId = lastMasterAgentId;

            if (lastMasterAgentId) {
              // $scope.masterAgent = DevicesService.getOneByAgentId(lastMasterAgentId, $scope.company.id);
              // $scope.lastMasterAgent = $scope.masterAgent;
              $scope.masterAgent = selectMAsterAgent(lastMasterAgentId);
              $scope.lastMasterAgent = $scope.masterAgent;
            }

            if (lastMasterAgentId && PermissionsService.isAllowed('NETWORK_SCAN_CLIENTS')) {
              getScanDevices();
            } else {
              $scope.scanDevices = undefined;
              $scope.isScanDevicesLoad = false;
            }
          }
        });

        PasswordManagerService.getAgentsCredentialsForCompany($scope, $scope.company.id, function (resp) {
          $scope.companyAgentsCredentials = resp[$scope.company.id];
        });

        $scope.changeSelectedCredential = function (credential) {
          if (credential) {
            if ($scope.selectedCredential && $scope.selectedCredential.id === credential.id) {
              $scope.selectedCredential = {};
              $scope.testCredentialsModel.id = '';
            } else {
              $scope.selectedCredential = credential;
              $scope.testCredentialsModel = angular.copy(credential);
            }
          }
        };

        // $scope.$watchCollection('scanDevices.devices', function() {
        //   if ($scope.manualSort) {
        //     $scope.manualSort = false;
        //     return;
        //   }
        //   $scope.sortDevices();
        // })

        $scope.downloadAgentUser = {
          agentName: '',
          agentPassword: '',
          userName: '',
          email: '',
          companyId: $scope.company.id
        };

        DevicesService.getDownloadAgentLink($scope.downloadAgentUser, function (resp) {
          $scope.gettingLink = false;
          $scope.downloadLink = resp.downloadLink;
        });

        function getScanDevices(newMasterAgent) {
          DevicesService.getLastScanDevices($scope, $scope.company.id, function (resp) {
            $scope.scanDevices = $scope.scanDevices || {};
            var devices = resp[$scope.company.id];
            if (devices) {
              $scope.scanDevices.devices = devices.sort(function (a, b) {
                return a.ipAddress < b.ipAddress;
              });
            }

            $scope.scanDevices.status = resp.status;
          });
        }

        function selectMAsterAgent(masterAgentId) {
          if ($scope.masterAgent) {
            return $scope.masterAgent;
          }

          if ($scope.agents) {
            var masterAgent = $scope.agents.find(function(agent) {
              return agent.master;
            });

            if (masterAgent) {
              if (!$scope.defaultMasterAgent) {
                $scope.defaultMasterAgent = masterAgent;
              }

              return masterAgent;
            } else {
              var agentsSortedByCreatedAtDate = $scope.agents.sort(function (a, b) {
                var aa = new Date(a.createdAt);
                var bb = new Date(b.createdAt);
                return aa > bb
              });

              // DevicesService.markDeviceAsMaster($scope.company.id, masterAgent.agentId);

              return agentsSortedByCreatedAtDate[0]
            }
          }
        }

        $scope.changeShowPassword = function() {
          $scope.passwordShown = !$scope.passwordShown;
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToDownload || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.isShowingMailFormErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSendMail || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.filterUserFullName = function (value) {
          return function (item) {
            if (value && value !== '[$empty$]') {
              return $scope.getUserName(item).toLowerCase().indexOf(value.toLowerCase()) !== -1;
            }
            return true;
          };
        };

        $scope.downloadAgent = function (isWoForm, form) {
          if (isWoForm || form.$valid) {
            if (!$scope.savingInProcess) {
              $scope.triedToDownload = false;
              $scope.savingInProcess = true;
              DevicesService.downloadAgent($scope.company.id, $scope.downloadAgentModel.username || '',
                $scope.downloadAgentModel.password || '', !!$scope.downloadAgentModel.autoInstall, function () {
                  $scope.savingInProcess = false;
                  if (!isWoForm) {
                    form.$setPristine();
                  }

                });
            }
          } else {
            $scope.triedToDownload = true;
          }
        };

        $scope.sendEmailWithAgent = function (form) {
          if (form.$valid) {
            if (!$scope.savingInProcess) {
              $scope.triedToSendMail = false;
              $scope.savingInProcess = true;

              var dto = {
                agentName: $scope.downloadAgentModel.username || '',
                agentPassword: $scope.downloadAgentModel.password || '',
                companyId: $scope.company.id,
                email: $scope.downloadAgentModel.email,
                autoGlobalRemoteInstall: !!$scope.downloadAgentModel.autoInstall
              };

              DevicesService.sendDownloadAgentLink(dto, function () {
                $scope.savingInProcess = false;
                $scope.downloadAgentModel.email = '';
                $scope.downloadAgentModel.showSendMailForm = false;
                UserNotificationService.show('Email was successfully sent!', true);
                form.$setPristine();
              });
            }
          } else {
            $scope.triedToSendMail = true;
          }
        };

        $scope.clearEmail = function () {
          $scope.downloadAgentModel.email = '';
        };

        $scope.toggleAll = function () {
          var devices = $scope.scanDevices.devices;
          for (var i = 0; i < devices.length; i++) {
            var device = devices[i];
            $scope.selectedDevices[device.status.statusValue ? device.deviceId : device.id] = $scope.isAllSelected;
          }
        };

        $scope.checkSelection = function () {
          var keys = Object.keys($scope.selectedDevices);
          var devices = $scope.scanDevices.devices;
          if (keys.length === devices.length) {
            $scope.isAllSelected = keys.every(function (key) {
              return $scope.selectedDevices[key];
            });
          } else {
            $scope.isAllSelected = false;
          }
        };

        $scope.isDeviceSelected = function () {
          var keys = Object.keys($scope.selectedDevices);
          return keys.length && keys.some(function (key) {
            return $scope.selectedDevices[key];
          });
        };

        $scope.isAnyHasPassword = function () {
          for (var deviceId in $scope.selectedDevices) {
            if ($scope.selectedDevices[deviceId]) {
              var device = Utils.findById($scope.scanDevices.devices, deviceId);
              if (device && device.agentPassword) {
                return true;
              }
            }
          }
        };

        $scope.isAnyHasValidPassword = function () {
          for (var deviceId in $scope.selectedDevices) {
            if ($scope.selectedDevices[deviceId]) {
              var device = Utils.findById($scope.scanDevices.devices, deviceId);
              if (device && device.agentPassword && device.agentPassword.status === 'SUCCESS') {
                return true;
              }
            }
          }
        };

        $scope.testCredentials = function (form) {
          if (form.$valid) {
            $scope.isTestInProgress = true;
            $scope.triedToDownload = false;
            var deviceIds = [];
            for (var deviceId in $scope.selectedDevices) {
              if ($scope.selectedDevices[deviceId]) {
                deviceIds.push(deviceId);
              }
            }

            if (deviceIds.length) {
              var dto = {
                login: $scope.testCredentialsModel.username,
                password: $scope.testCredentialsModel.password,
                companyId: $scope.company.id,
                discoveredByAgentId: $scope.discoveredByAgentId,
                deviceIds: deviceIds
              };
              DevicesService.testCredentials(dto, function () {
                $scope.isTestInProgress = false;
                form.$setPristine();
              });
            }
          } else {
            $scope.triedToDownload = true;
          }
        };

        $scope.installAgents = function (form) {
          // if (form.$valid) {
            if (true) {
            $scope.isInstallInProgress = true;
            $scope.triedToDownload = false;

            var deviceIds = [];
            for (var deviceId in $scope.selectedDevices) {
              if ($scope.selectedDevices[deviceId]) {
                deviceIds.push(deviceId);
              }
            }

            $scope.devicesToWatch = deviceIds.map(function(id) {
              return $scope.scanDevices.devices.find(function(device) {
                return device.id === id;
              })
            })
            $scope.devicesToWatch = $scope.devicesToWatch.filter(function(el) {
              return !!el;
            })

            if ($scope.selectedCredential.password && $scope.selectedCredential.username) {
              // var completedIds = {};
              $scope.devicesToWatch = $scope.devicesToWatch.map(function(dev) {
                if (!dev.status) return dev;
                dev.status.message = '';
                dev.status.tooltip = '';
                return dev;
              })
              var watcher = $scope.$watch('devicesToWatch', function(val) {
                var completedDevices = 0;
                var devices = $scope.devicesToWatch;

                for (var i = 0; i < devices.length; i++) {
                  if (devices[i].status.message !== 'Installing' && devices[i].status.tooltip) {
                    completedDevices++;
                  }
                }

                if (completedDevices === devices.length) {
                  $scope.isInstallInProgress = false;
                }
              }, true)
            } else {
              $scope.isInstallInProgress = false;
            }


            if (deviceIds.length) {
              var dto = {
                login: $scope.testCredentialsModel.username,
                password: $scope.testCredentialsModel.password,
                companyId: $scope.company.id,
                deviceIds: deviceIds,
                discoveredByAgentId: $scope.discoveredByAgentId
              };
              DevicesService.sendInstallAgentRequests(dto, function () {

              });
            }
          } else {
            $scope.triedToDownload = true;
          }
        };

        $scope.saveMasterAgent = function (masterAgent) {
          if (!$scope.saveMasterAgentInProgress) {
            $scope.saveMasterAgentInProgress = true;
            $scope.masterAgent = masterAgent;
            DevicesService.saveMasterAgent($scope.company.id, masterAgent.agentId, function () {
              $scope.saveMasterAgentInProgress = false;
            });
          }
          // var lastMasterAgentId = masterAgent.agentId;
          // $scope.discoveredByAgentId = lastMasterAgentId;
          //
          // if (lastMasterAgentId) {
          //   $scope.masterAgent = masterAgent;
          //   $scope.lastMasterAgent = $scope.masterAgent;
          // }
          //
          // getScanDevices();

        };

        $scope.changeSortProp = function(prop) {
          if ($scope.orderScanBy === prop) {
            $scope.reverse = !$scope.reverse;
          }

          $scope.orderScanBy = prop;
        }

        $scope.sortDevices = function(option, devices) {

          if (!devices) return

          if (!$scope.scanDevices.devices) return;

          if (!option) {
            option = $scope.orderScanBy;
          } else if (option === $scope.orderScanBy) {
            $scope.reverse = !$scope.reverse;
          } else {
            $scope.reverse = false;
          }

          var sortedDevices = devices;

          $scope.orderScanBy = option;

          if (option === 'ipAddress') {
            devices.sort(function(a, b) {
              var first = $scope.reverse ? b : a;
              var second = $scope.reverse ? a : b;

              return getIpAsNum(first.ipAddress) - getIpAsNum(second.ipAddress);
            });
          } else {
            devices.sort(function(a, b) {
              var first = $scope.reverse ? b : a;
              var second = $scope.reverse ? a : b;

              return ('' + first.attr).localeCompare(second.attr);
            })
          }

          function getIpAsNum(ip) {
            return +ip.split('.').join('');
          }

          return sortedDevices


        }

        $scope.runScanDevices = function () {
          $scope.runScan = true;
          $scope.scanDevices = {};
          $scope.discoveredByAgentId = $scope.masterAgent && $scope.masterAgent.agentId;
          $scope.lastMasterAgent = $scope.masterAgent;
          DevicesService.runScanDevices($scope, $scope.company.id, function (resp) {
            $scope.masterAgentOffline = resp.code === 400;
            if ($scope.masterAgentOffline) {
              $scope.isScanDevicesLoad = false;
            }
            $scope.runScan = false;
          });
        };

        $scope.sortNetworkScan = function (option) {
          if (option === $scope.orderScanBy) {
            if (option[0] === '-') {
              $scope.orderScanBy = $scope.orderScanBy.substring(1);
            } else {
              $scope.orderScanBy = '-' + $scope.orderScanBy;
            }
          } else {
            $scope.orderScanBy = option;
          }
        };



        $scope.toggleDescription = function (deviceId, close) {
          $scope.isEditDescrOpened = true;
          $scope.$broadcast('toggleEditDeviceDescription', deviceId);

        };

        $scope.saveCredential = function (form) {
          if (form.$valid) {
            $scope.triedToDownload = false;
            $scope.triedToSavePassword = false;
            // if($scope.editedPasswordCompany && !$scope.editedPassword.companyId) {
            //   $scope.setCompanyId();
            // }
            // $scope.loadingInProgress = true;
            // $scope.editedPassword.links = angular.copy($scope.password.links);
            // $scope.editedPassword.onlyForMe = $scope.password.onlyForMe;
            // var toSave = buildDto($scope.editedPassword);
            var data = {
              companyId: $scope.company.id,
              description: 'Agent Network Credentials',
              expiredDate: '',
              template: 'AGENT',
              password: $scope.testCredentialsModel.password,
              username: $scope.testCredentialsModel.username
            };
            if($scope.testCredentialsModel.id) {
              data.id = $scope.testCredentialsModel.id;
            }
            PasswordManagerService.save(data, function () {
              $scope.loadingInProgress = false;
            })
          } else {
            $scope.triedToSavePassword = true;
            $scope.triedToDownload = true;
          }
        };

        $scope.removeCredential = function(credential) {
          if (PermissionsService.isAllowed('DELETE_PASSWORD')) {
            var message = 'Are you sure you want to delete this password?';
            UserConfirmationsService.show(message, 'Yes').then(function () {
              PasswordManagerService.deletePassword(credential.id, function () {
                UserNotificationService.show('Password was deleted successfully.', true);
              })
            });
          }
        };

        $scope.$watch(function () {
          if ($scope.scanDevices) {
            return $scope.scanDevices.status;
          }
        }, function (val) {
          // $scope.sortDevices('hostName');
          $scope.isScanDevicesLoad = val && val !== 'disabled' && val !== 'finished' || $scope.runScan;
          if(val === 'finished') {
            UserNotificationService.show('Scanning finished', true);
          }
        });

        $scope.$on('$destroy', function() {
          if ($scope.defaultMasterAgent) {
            DevicesService.markDeviceAsMaster($scope.company.id, $scope.defaultMasterAgent.agentId);
          }
        })

      }
    ]).filter('sortScanDevs', function () {
      return function (devices, option, reverse) {
        if (!devices) return;

        var toSort = devices.slice();

        if (option === 'ipAddress') {
          toSort.sort(function(a, b) {
            var first = reverse ? b : a;
            var second = reverse ? a : b;

            return getIpAsNum(first.ipAddress) - getIpAsNum(second.ipAddress);
          });
        } else {
          toSort.sort(function(a, b) {
            var first = reverse ? b : a;
            var second = reverse ? a : b;
            return first[option].localeCompare(second[option]);
          })
        }

        return toSort;

        function getIpAsNum(ip) {
          return +ip.split('.').join('');
        }

      }
    })
}());
