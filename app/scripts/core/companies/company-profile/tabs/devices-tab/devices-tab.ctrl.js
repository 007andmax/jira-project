'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.devicesTabCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService', 'ConstantsService', 'CompaniesService',
      'quicktech.common.services.SharedStateService', '$rootScope', 'quicktech.common.services.UserConfirmationsService', '$interval',
      function ($scope, DevicesService, RemoteAccessService, ConstantsService, CompaniesService, SharedStateService,
                $rootScope, UserConfirmationsService, $interval) {

        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var constVersion = ConstantsService.getConstant('rest.server.agent.version', function (resp) {
          var lastAgentArr = resp.split('.');
          for (var i = 0; i < lastAgentArr.length; i++) {
            if (lastAgentArr[i] > currentAgentArr[i]) {
              $scope.agentDeprecated = true;
              break;
            }
          }
        });
        var lastAgentArr = constVersion ? constVersion.split('.') : [];
        var currentAgentArr = $scope.agent.agentVersion ? $scope.agent.agentVersion.split('.') : [];
        $scope.agent.timing = {};
        $scope.agent.timing.idle = 0;
        $scope.agent.timing.noRestart = 0;
        $scope.agent.timing.online = 0;
        $scope.agent.timing.agentConnectedAt = 0;
        $scope.agent.timing.offline = 0;
        $scope.agent.timing.uptimeForOrdering = 0;

        // $scope.deviceOrder = 'hostName';
        // $scope.changeOrder = function(order) {
        //   if(order === $scope.deviceOrder) {
        //     $scope.deviceOrder = '-'+$scope.deviceOrder
        //   } else {
        //     $scope.deviceOrder = order;
        //   }
        // };

        for (var i = 0; i < lastAgentArr.length; i++) {
          if (lastAgentArr[i] > currentAgentArr[i]) {
            $scope.agentDeprecated = true;
            break;
          }
        }

        DevicesService.sendDeviceStatusRequest($scope.company.id, $scope.agent.agentId, function(resp){
          if(resp){
            console.log(resp);
          }
        });

        $scope.openDevicesDetails = false;
        $scope.showDeviceLabelEditButtom = false;
        $scope.showDeviceLabelEditForm = false;
        $scope.reserveAgentLabelCopy = '';

        $scope.openDeviceLabelEditForm = function() {
          $scope.reserveAgentLabelCopy = $scope.agent.label;
          $scope.showDeviceLabelEditForm = true;
        };

        $scope.saveNewDeviceLabel = function(name) {
          if(name) {

            $scope.showDeviceLabelEditForm = false;
            var dto = {
              agentId: $scope.agent.agentId,
              companyId: $scope.company.id,
              newLabelValue: name
            };
            DevicesService.setNewDeviceLabel(dto, function(resp) {
              if(resp) {
                $scope.agent.label = name;
              }

            })
          }
        };

        $scope.cancelNewDeviceLabelEdit = function() {
          $scope.agent.label = $scope.reserveAgentLabelCopy;
          $scope.showDeviceLabelEditForm = false;
        };

        $scope.highlightDevice = function () {
          if (globalSearch.deviceFilter) {
            $rootScope.$broadcast('showFilteredDevice-' + globalSearch.deviceFilter);
            globalSearch.deviceFilter = undefined;
          }
        };

        $scope.updateAgent = function () {
          DevicesService.sendAgentUpdateRequest($scope.company.id, $scope.agent.id);
        };

        $scope.remoteAccess = function (connectionType) {
          if (!$scope.agent.online) {
            throw 'agent must be online'
          }

          DevicesService.createRemoteSession($scope.agent.id, $scope.company.id, connectionType, function (resp) {
            RemoteAccessService.connectRemoteAccess(resp.sessionId, connectionType);
          });
        };

        $scope.orderDevicesBy = 'hostName';
        $scope.uptimeOrder = '';
        $scope.sortDevicesTab = function (option, uptimeOption) {
          if (option === $scope.orderDevicesBy) {
            if (option[0] === '-') {
              $scope.orderDevicesBy = $scope.orderDevicesBy.substring(1);
            } else {
              $scope.orderDevicesBy = '-' + $scope.orderDevicesBy;
            }
          } else {
            $scope.orderDevicesBy = option;
          }
          if(uptimeOption) {
            if( $scope.uptimeOrder) {
              $scope.uptimeOrder = '';
            }else {
              $scope.uptimeOrder = 'timing.uptimeForOrdering';
            }
          }
        };

        $scope.sendAlert = function () {
          console.log('sendAlert - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.specReport = function () {
          console.log('specReport - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.transferFile = function () {
          console.log('transferFile - ' + $scope.agent.agentId);
          //DevicesService
        };

        $scope.restart = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.agent.agentId, 'reboot');
        };

        $scope.shutdown = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.agent.agentId, 'shutdown');
        };

        $scope.remove = function () {
          var confirmMesage = 'Do you want to remove ' + ($scope.agent.hostName || $scope.agent.ip) + ' device?';
          var confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            DevicesService.sendUninstallAgentRequest($scope.company.id, $scope.agent.id, function () {
              if (delete $scope.selectDevices[$scope.agent.id]) {
                $scope.changeSelectDevices();
              }
            });
          });
        };

        $scope.getDeviceReport = function (agent) {
          DevicesService.getDeviceReports([agent.agentId], $scope.company.id, function (resp) {
            var report = resp.reports[0],
              agentId = report.agentId;
            delete report.agentId;
            groupSingleFields(report);

            $scope.deviceReport = {};
            report.agent = agent;
            report.company = CompaniesService.getOneById(resp.companyId);
            report.primaryContact = $scope.getPrimaryContact(resp.companyId);
            report.address = resp.address;
            $scope.deviceReport[agentId] = report;
          });
        };

        function groupSingleFields(report) {
          report.general = {};
          for (var prop in report) {
            var value = report[prop];

            if (typeof value !== 'object') {
              report.general[prop] = value;
              delete report[prop];
            }
          }
        }

        $scope.$watch(function(){
          return $rootScope.deviceCredentialsRecived;
        }, function(value) {
          if(value){
            $scope.deviceCredentials = $scope.devicesCredentials[$scope.agent.id];
          }
        });


        $scope.$watch('agent.Idle', function(value) {
          if(value) {
            if(value !== 'none') {
              $scope.agent.timing.idle = $scope.getMillisecondsFromTimeString(value);
            }
          }
        });

        $scope.$watch('agent.NoRestart', function(value) {
          if(value) {
            $scope.agent.timing.noRestart = $scope.getMillisecondsFromTimeString(value);
          }
        });

        $scope.$watch('agent.Online', function(value) {
          if(value) {
            $scope.agent.timing.online = $scope.getMillisecondsFromTimeString(value);
            $scope.agent.timing.uptimeForOrdering = $scope.agent.timing.online;
          }
        });

        $scope.$watch('agent.offlineSince', function(value) {
          if(value) {
            $scope.agent.timing.offline = (Date.now() - value);
            $scope.agent.timing.uptimeForOrdering = $scope.agent.timing.offline;
          }
        });

        // $scope.$watch('agent.online', function(value) {
        //   if(value === true) {
        //     $scope.agent.timing.online = 0;
        //     console.log('VALUE', value)
        //     //$scope.agent.timing.uptimeForOrdering = $scope.agent.timing.online;
        //   }
        // });

        $scope.$watch('agent.agentConnected', function(value) {
          if(value) {
            $scope.agent.agentConnected = value;
            if($scope.agent.OneTimeConnectionData && $scope.agent.OneTimeConnectionData.startedAt) {
              if($scope.agent.OneTimeConnectionData.startedAt > Date.now()) {
                $scope.agentConnectedAt = 0;
              } else {
                $scope.agentConnectedAt = ( Date.now() - $scope.agent.OneTimeConnectionData.startedAt);
              }
              console.log($scope.agentConnectedAt);
            }
          }
        });


         var addSecond = $interval(function() {
           $scope.agent.timing.idle += 1000;
           $scope.agent.timing.noRestart += 1000;
           $scope.agent.timing.online += 1000;
           $scope.agent.timing.agentConnectedAt += 1000;
           $scope.agent.timing.offline +=1000;
           $scope.agent.timing.uptimeForOrdering +=1000;
        }, 1000);


        $scope.getMillisecondsFromTimeString = function(timeString) {
          var splittedArray = timeString.split(':');
          return splittedArray[2]*1000 + splittedArray[1]*60000 + splittedArray[0]*3600000
        };



        $scope.returnTimeFormatForPage = function(time) {
          var days = '';
          var hours = '';
          var minutes = '';
          var seconds = '';
          if(time > 86400000) {
            days = Math.floor(time/86400000);
            hours = Math.floor((time - (days*86400000))/3600000);
            minutes = Math.floor((time - (days*86400000) - (hours*3600000))/60000);
            seconds =  Math.floor((time - (days*86400000) - (hours*3600000) - (minutes*60000))/1000);
          } else if(time < 86400000 && time > 3600000) {
            days = 0;
            hours = Math.floor((time - (days*86400000))/3600000);
            minutes = Math.floor((time - (days*86400000) - (hours*3600000))/60000);
            seconds =  Math.floor((time - (days*86400000) - (hours*3600000) - (minutes*60000))/1000);
          } else if(time < 3600000 && time > 60000) {
            days = 0;
            hours = 0;
            minutes = Math.floor((time - (days*86400000) - (hours*3600000))/60000);
            seconds =  Math.floor((time - (days*86400000) - (hours*3600000) - (minutes*60000))/1000);
          } else {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds =  Math.floor((time - (days*86400000) - (hours*3600000) - (minutes*60000))/1000);
          }
          return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
          }

        };

        $scope.checkAgentType = function(type) {
          return type === 'workstation' || type === 'device' || type === 'printer' || type === 'server';
        }





      }]);




}());
