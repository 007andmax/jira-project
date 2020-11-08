'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.devicesTabCtrl',
    ['$scope', 'DevicesService', 'quicktech.common.services.RemoteAccessService', 'ConstantsService', 'CompaniesService',
      'quicktech.common.services.SharedStateService', '$rootScope', 'quicktech.common.services.UserConfirmationsService', '$interval', '$uibModal',
      function ($scope, DevicesService, RemoteAccessService, ConstantsService, CompaniesService, SharedStateService,
                $rootScope, UserConfirmationsService, $interval, $uibModal) {

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

        $scope.uptimeOrder = '';
        $scope.agentLabelEditForm = {};

        for (var i = 0; i < lastAgentArr.length; i++) {
          if (lastAgentArr[i] > currentAgentArr[i]) {
            $scope.agentDeprecated = true;
            break;
          }
        }

        DevicesService.sendDeviceStatusRequest($scope.company.id, $scope.agent.agentId, function(resp){
          if(resp){
           
          }
        });


        if ($scope.agent.OneTimeConnectionData) {
          $scope.agent.OneTimeConnectionData = $scope.agent.OneTimeConnectionData.map(function(el) {
            el.agentConnectedAt = el.starteddAt;

            return el;
          })
        }


        $scope.openDevicesDetails = false;
        $scope.showDeviceLabelEditButtom = false;
        $scope.showDeviceLabelEditForm = false;
        $scope.reserveAgentLabelCopy = '';

        $scope.markDeviceAsMaster = markDeviceAsMaster;

        $scope.openDeviceLabelEditForm = function() {
          $scope.reserveAgentLabelCopy = $scope.agent.label;
          $scope.agentLabelEditForm.name = $scope.agent.label;
          $scope.showDeviceLabelEditForm = true;
        };

        $scope.saveNewDeviceLabel = function(name) {
          var dto = {
            agentId: $scope.agent.agentId,
            companyId: $scope.company.id,
          };
          if(name) {
            dto.newLabelValue = name;
            $scope.agent.label = name;
          } else {
            dto.newLabelValue = $scope.agent.hostName;
            $scope.agent.label = $scope.agent.hostName;
          }
          $scope.showDeviceLabelEditForm = false;

          DevicesService.setNewDeviceLabel(dto, function(resp) {
            if(resp) {
              $scope.agent.label = name;
            }

          })
        };

        $scope.saveNewIcon = function(icon) {
          var dto = {
            agentId: $scope.agent.agentId,
            companyId: $scope.company.id,
            newLabelValue: $scope.agent.label || $scope.agent.hostName,
            iconName: icon
          }

          $scope.agent.iconName = icon || 'workstation';
          DevicesService.setNewDeviceLabel(dto, function(resp) {

          })
        }

        if ($scope.agent && $scope.agent.agentId && !$scope.agent.iconName) {
          $scope.saveNewIcon('workstation');
        }

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


        $scope.sendAlert = function () {
         
          //DevicesService
        };

        $scope.specReport = function () {
           
          //DevicesService
        };

        $scope.transferFile = function () {
         
          //DevicesService
        };

        $scope.restart = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.agent.agentId, 'reboot');
        };

        $scope.shutdown = function () {
          DevicesService.sendPowerAction($scope.company.id, $scope.agent.agentId, 'shutdown');
        };

        

        $scope.turnOffDevice = function(action) {
          var method;

         
          $uibModal.open({
            templateUrl: '/ng1/scripts/core/companies/company-profile/tabs/confirmModal.html',
            animation: true,
            backdrop: true,
            size: 'sm',
            controller: 'quicktech.core.companies.confirmModalCtrl',
            resolve: {
              action: function() {
                return action;
              },

              devices: function() {
                return $scope.agent.agentId
              },
              companyId: function() {
                return $scope.company.id
              }
            }
          });
        }

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
        $scope.redirectDevice = function (agent) {
          if (agent.agentId) {
            // localStorage.setItem('agentId', agent.agentId);
            // localStorage.setItem('type', agent.type);
            var url = `/#/ng2/device/dashboard/${agent.type}/${agent.agentId}`;
            window.open(url,'_blank');
          }
          
        };
        function markDeviceAsMaster() {
          $scope.agents = $scope.agents.map(function(agent) {
            if (agent.agentId === $scope.agent.agentId) {
              agent.master = true;
            } else {
              agent.master = false;
            };

            return agent;
          });

          DevicesService.markDeviceAsMaster($scope.company.id, $scope.agent.agentId);
        }

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

            var newValue = moment(value).valueOf();

            $scope.agent.timing.offline = (Date.now() - newValue);

            $scope.agent.timing.uptimeForOrdering = $scope.agent.timing.offline;
          }
        });



        // $scope.$watch('agent.online', function(value) {
        //   if(value === true) {
        //     $scope.agent.timing.online = 0;
       
        //     //$scope.agent.timing.uptimeForOrdering = $scope.agent.timing.online;
        //   }
        // });

        $scope.$watch('agent.OneTimeConnectionData.length', function(value) {
          if(value || value === 0) {

            $scope.indexesWoGMT = [];

            for(var i=0; i<$scope.agent.OneTimeConnectionData.length; i++) {
              if(moment($scope.agent.OneTimeConnectionData[i].startedAt).valueOf() > Date.now()) {
                $scope.agent.OneTimeConnectionData[i].agentConnectedAt = 0;

                $scope.indexesWoGMT.push(i);
              } else {
                $scope.agent.OneTimeConnectionData[i].agentConnectedAt = ( Date.now() - moment($scope.agent.OneTimeConnectionData[i].startedAt).valueOf());
              }
            }
          }
        });


         var addSecond = $interval(function() {
           $scope.agent.timing.idle += 1000;
           $scope.agent.timing.noRestart += 1000;
           $scope.agent.timing.online += 1000;
           $scope.agent.timing.offline +=1000;
           $scope.agent.timing.uptimeForOrdering +=1000;
           if($scope.agent.OneTimeConnectionData && $scope.agent.OneTimeConnectionData.length>0) {
             for(var i=0; i<$scope.agent.OneTimeConnectionData.length; i++) {
               $scope.agent.OneTimeConnectionData[i].agentConnectedAt += 1000;
             }
           }
        }, 1000);


        $scope.getMillisecondsFromTimeString = function(timeString) {
          var splittedArray = timeString.split(':');
          return splittedArray[2]*1000 + splittedArray[1]*60000 + splittedArray[0]*3600000
        };



        $scope.returnTimeFormatForPage = function(time, timeToNow, index) {
          if (typeof time === 'string') {
            time = moment(time).valueOf();
          }

          if (timeToNow && index !== undefined && $scope.indexesWoGMT) {
            var isGMT = !($scope.indexesWoGMT.indexOf(index) !== -1);
          }


          if (timeToNow && isGMT) {
            var currentTimeZone = new Date().getTimezoneOffset();
            var minutesDiff = -(currentTimeZone);
            time = (time - (minutesDiff * 60 * 1000));


          }

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
        };

        $scope.isLabel = function(agent) {
          if(agent && agent.label && agent.hostName) {
            return agent.label !== agent.hostName;
          }
        }



      }]);




}());
