'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.companyProfileDashboardCtrl',
    ['$scope', '$state', '$stateParams', 'CompaniesService', 'DevicesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', '$timeout', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.PermissionsService', 'UsersService', '$uibModal', 'quicktech.common.services.PhoneFormats', "$rootScope",
      function ($scope, $state, $stateParams, CompaniesService, DevicesService, StatisticsService,
                SharedStateService, $timeout, UserNotificationService, UserConfirmationsService, PermissionsService, UsersService, $uibModal, PhoneFormats, $rootScope) {

        var daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        $scope.daysOfWeek = daysOfWeek;
        $scope.daysOfWeekMap = {
          MONDAY: 'Monday',
          TUESDAY: 'Tuesday',
          WEDNESDAY: 'Wednesday',
          THURSDAY: 'Thursday',
          FRIDAY: 'Friday',
          SATURDAY: 'Saturday',
          SUNDAY: 'Sunday'
        };

        $scope.serviceTypes = ['HOURLY', 'BLOCK_TIME', 'SEMI_MANAGED', 'FULLY_MANAGED'];
        $scope.serviceTypesMap = {
          HOURLY: 'Hourly',
          BLOCK_TIME: 'Block time',
          SEMI_MANAGED: 'Semi managed',
          FULLY_MANAGED: 'Fully managed'
        };

        $scope.downloadAgent = function(e) {

          if (e) e.stopPropagation();

          var modalParams = {
            animation: true,
            backdrop: 'static',
            keyboard: false,
            size: 'custom-size-confirmation-pop',
            windowClass: 'modal-remote-agent',
            templateUrl: '/html/scripts/core/companies/download-agent.tpl.html',
            controller: 'quicktech.core.companies.downloadAgentModal'
          };

          $rootScope.companyForDownload = $scope.company;

          $uibModal.open(modalParams);
        };

        //$timeout(getCorrectWorkingTime(), 1000);
        $scope.$watch(function(){
          return $scope.companyInfo;
        }, function(data){
          if(data) {
            getCorrectWorkingTime();
          }
        });

        $scope.$watch(function() {
          return $rootScope.updateTimePickers;
        }, function(val) {
          if (val) {
            getCorrectWorkingTime();
            $rootScope.updateTimePickers = false;
          }
        });

        $scope.$on('updateCompanyTags', function () {
          return ($scope.companyInfo = CompaniesService.getOneById($scope.companyInfo.id));
        });

        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });

        $scope.companyUsers = UsersService.getAllByCompanyId($scope.company.id);

        $scope.clientTypes = ['Client', 'Lead', 'Vendor'];
        $scope.clientTypesMap = {
          CLIENT: 'Client',
          LEAD: 'Lead',
          VENDOR: 'Vendor'
        };
        $scope.timeFormat = ['AM', 'PM'];

        $scope.techUsers = UsersService.getTechUsers;

        $scope.activeTechUsers = function() {
          return UsersService.getTechUsers().filter(function(el) {
            return el.userEnabled && !el.deletedAt;
          });
        };

        $scope.descriptionMaxLength = 300;

        $scope.showPhoneEditButton = false;
        $scope.showPhoneNumbersEditFields = false;
        $scope.showDomainEditButton = false;
        $scope.showDomainEditFields = false;
        $scope.showIndustryEditDutton = false;
        $scope.showIndustryEditFields = false;
        $scope.showContactPersonEditButton = false;
        $scope.showContactPersonEditFields = false;
        $scope.showNoteEditButton = false;
        $scope.showNoteEditField = false;
        $scope.showCompanyNameEditButton = false;
        $scope.showCompanyNameEditField = false;
        $scope.showServiceTypeEditButton = false;
        $scope.showServiceTypeEditField = false;
        $scope.showLedByEditButton = false;
        $scope.showLedByEditField = false;
        $scope.showAddressEditButton = false;
        $scope.showAddressEditFields = false;
        $scope.showWorkingDaysEditButton = false;
        $scope.showWorkingDaysEditFields = false;
        $scope.showWorkingDaysSchedule = false;

        $scope.isAnyEditFormOpen = false;


        function closeEditFields() {
          $scope.showPhoneNumbersEditFields = false;
          $scope.showDomainEditFields = false;
          $scope.showIndustryEditFields = false;
          $scope.showContactPersonEditFields = false;
          $scope.showNoteEditField = false;
          $scope.showCompanyNameEditField = false;
          $scope.showServiceTypeEditField = false;
          $scope.showLedByEditField = false;
          $scope.showAddressEditFields = false;

          $scope.isAnyEditFormOpen = false;
        }

        $scope.openEditForm = function(key) {
          if(!$scope.isAnyEditFormOpen) {
            $scope[key] = true;
            $scope.isAnyEditFormOpen = true;
          }
        };

        $scope.getTodayDayOfWeek = function() {
          var d = new Date();
          return d.getDay();
        };

        function toEnum(text) {
          return text.trim().split(' ').join('_').toUpperCase();
        }

        $scope.setClientType = function (type) {
          if (type) {
            $scope.companyInfo.clientType = type;
            $scope.save()
          }
        };

        $scope.openWorkingDaysSchedule = function() {
          $scope.showWorkingDaysSchedule = !$scope.showWorkingDaysSchedule;
          getCorrectWorkingTime();
        };

        $scope.openWorkingDayEditFields = function () {
          $scope.showWorkingDaysSchedule = false;
          $scope.showWorkingDaysEditFields = true;
          $scope.isAnyEditFormOpen = true;
          getCorrectWorkingTime();
        };

        $scope.cancelWorkingDaysEdit = function () {
          $scope.showWorkingDaysEditFields = false;
          $scope.isAnyEditFormOpen = false;
          $scope.workingDays = angular.copy($scope.workingDayReserved);
        };

        $scope.saveWorkingHours = function () {
          $scope.companyInfo.workingDays = [];
          for (var i = 0; i < 7; i++) {
            var day = {};
            if (!$scope.workingDays[i].isWorkingDay || (!$scope.workingDays[i].startTime && !$scope.workingDays[i].endTime)) {
              day = {
                dayOfWeek: $scope.workingDays[i].dayOfWeek,
                startTime: 0,
                endTime: 0
              }
            } else {
              day = {
                dayOfWeek: $scope.workingDays[i].dayOfWeek,
                startTime: gotSecondFromTimeAndFormatObject($scope.workingDays[i].startTime, $scope.workingDays[i].startTimeFormat),
                endTime: gotSecondFromTimeAndFormatObject($scope.workingDays[i].endTime, $scope.workingDays[i].endTimeFormat)
              };
            }

            $scope.companyInfo.workingDays.push(day);
          }
          $scope.showWorkingDaysEditFields = false;
          $scope.save();
        };

        function gotSecondFromTimeAndFormatObject(objectTime, objectTimeFormat) {
          if (objectTime && objectTimeFormat) {
            // console.log(objectTime, objectTimeFormat, '*******________**********  ');
            var hours, minutes, separateTime;

            if (typeof objectTime === 'string') {
              separateTime = objectTime.split(':');
              hours = parseInt(separateTime[0]);
              minutes = parseInt(separateTime[1]);
            } else {
              hours = Math.floor(objectTime / 60);
              minutes = objectTime % 60;
            }

            return (objectTimeFormat === 'AM' ? hours * 3600 + minutes * 60 : hours * 3600 + minutes * 60 + 12 * 3600);
          }
        }

        function getCorrectWorkingTime() {
          $scope.workingDays = [];
          for (var i = 0; i < 7; i++) {
            var isWorkingDay = ($scope.companyInfo.workingDays && $scope.companyInfo.workingDays.length > 0 && ($scope.companyInfo.workingDays[i].startTime || $scope.companyInfo.workingDays[i].endTime)) ? true : false;
            var day;

            if (isWorkingDay) {
              day = {
                startTime: timeFormatter($scope.companyInfo.workingDays && $scope.companyInfo.workingDays.length > 0 ? $scope.companyInfo.workingDays[i].startTime : 0),
                startTimeFormat: getTimeFormat($scope.companyInfo.workingDays && $scope.companyInfo.workingDays.length > 0 ? $scope.companyInfo.workingDays[i].startTime : 0),
                endTime: timeFormatter($scope.companyInfo.workingDays && $scope.companyInfo.workingDays.length > 0 ? $scope.companyInfo.workingDays[i].endTime : 0),
                endTimeFormat: getTimeFormat($scope.companyInfo.workingDays && $scope.companyInfo.workingDays.length > 0 ? $scope.companyInfo.workingDays[i].endTime : 0),

              };
            } else {
              day = {
                startTime: timeFormatter(28800),
                startTimeFormat: 'AM',
                endTime: timeFormatter(21600),
                endTimeFormat: 'PM'
              }
            }

            day.dayOfWeek = daysOfWeek[i];
            day.isWorkingDay = isWorkingDay;

            $scope.workingDays.push(day);
            $scope.workingDayReserved = angular.copy($scope.workingDays);
          }
        }

        function timeFormatter(time) {
          if (time && time > 0) {
            var seconds = time > 43200 ? time - 43200 : time;
            var hours = Math.floor(seconds / 3600);
            var hoursToReturn = hours.toString().length > 1 ? hours : '0' + hours;
            var minutes = Math.floor((seconds - (hours * 3600)) / 60);
            var minutesToreturn = minutes.toString().length > 1 ? minutes : '0' + minutes;
            return hoursToReturn + ':' + minutesToreturn;
          } else {
            return '12' + ':' + '00';
          }
        }

        function getTimeFormat(time) {
          if (time && time > 0) {

            var timeInHour = time / 3600;
            if (timeInHour <= 12) {
              return 'AM';
            } else {
              return 'PM';
            }
          } else {
            return 'AM';
          }
        }

        $scope.changePrimaryContact = function(user) {
          CompaniesService.changePrimaryContact(user.id, function(resp) {
            if(resp) {
              //console.log(resp);
            }
          })
        };

        $scope.saveNewPrimaryContact = function(user, form) {
          $scope.changePrimaryContact(user);
          $scope.checkingFormAndSave(form);
        };

        $scope.checkingFormAndSave = function (form) {
          if (form.$valid) {
            $scope.save()
          }
        };

        $scope.cancelEdit = function () {
          closeEditFields();
          $scope.companyInfo = angular.copy($scope.reservedCompanyInfo);
        };

        $scope.save = function () {
          var editCompany = angular.copy($scope.companyInfo);
          var contacts = editCompany.contacts,
            addresses = editCompany.addresses;

          for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];

            processPhoneNumbers(contact.phoneNumbers);

            if (contact.avatar && !contact.avatar.id && !contact.avatar.origin && !contact.avatar.cropped) {
              contact.avatar = undefined;
            }
          }

          for (var i = 0; i < addresses.length; i++) {
            processPhoneNumbers(addresses[i].phoneNumbers);
          }

          if (editCompany.defaultPaymentMethod) {
            editCompany.defaultPaymentMethod = editCompany.defaultPaymentMethod.toUpperCase().split(' ').join('_');
          } else {
            editCompany.defaultPaymentMethod = null;
          }

          if (editCompany.paymentTerms) {
            editCompany.paymentTerms = parseInt(editCompany.paymentTerms) || 0;
          }

          if (editCompany.clientType) {
            if (editCompany.clientType.toLowerCase() !== 'vendor') {
              editCompany.accountNumber = undefined;
            }
            editCompany.clientType = toEnum(editCompany.clientType);
          }

          if (editCompany.serviceType) {
            editCompany.serviceType = toEnum(editCompany.serviceType);
          }

          if (!editCompany.agentLinkToEmailEnabled) {
            editCompany.agentLinkToEmail = null;
          }

          // if (!editCompany.techLeadId) {
          //   editCompany.techLeadId = null;
          // }

          CompaniesService.save(editCompany, function (resp) {
            if (resp) {
              $scope.reservedCompanyInfo = angular.copy(editCompany);
              $scope.rewriteReservedCompanyInfoFromDashboard($scope.reservedCompanyInfo);
            }
          });
          closeEditFields();

          function processPhoneNumbers(phoneNumbers) {
            if (phoneNumbers && phoneNumbers.length) {
              var firstPhone = phoneNumbers[0].number,
                lastPhone = phoneNumbers[phoneNumbers.length - 1].number;

              if (!lastPhone || lastPhone.trim().length === 0 ||
                (lastPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(lastPhone))) {

                phoneNumbers.splice(phoneNumbers.length - 1, 1);

                if (phoneNumbers.length && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                  phoneNumbers.pop();
                }
              } else if (phoneNumbers.length > 1 && firstPhone.split(' ').length === 1 && PhoneFormats.isPrefixValid(firstPhone)) {
                phoneNumbers.shift();
              }
            }
          }
        };

        $scope.validateCompanyDomain = function (ngModelCtrl, modelId, afterValidationCallback) {
          var validationResult = CompaniesService.isDomainUnique(ngModelCtrl.$viewValue, $scope.companyInfo.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && (($scope.editCompany && $scope.editCompany.id) || form[fieldName].$dirty || $scope.triedToSave) && form[fieldName].$invalid;
        };

        $scope.validateCompanyName = function (ngModelCtrl, modelId, afterValidationCallback) {
          if ($scope.currentUser.accountType === "ROOT") {
            ngModelCtrl.$setValidity('unique', true);
            return
          }
          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.companyInfo.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.getUserByID = function (userId) {
          if (!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if (user) {
            if (user.lastName === '    ') {
              return user.firstName
            } else {
              return user.firstName + ' ' + user.lastName;
            }
          }
        };

        $scope.getFullName = function (client) {
          if (client) {
            var isAllSpaces = client.lastName === "    ";
            if (client.lastName && !isAllSpaces) {
              return client.firstName + ' ' + client.lastName;
            } else {
              return client.firstName;
            }
          }
        };

        $scope.checkCompanyReputationScore = function (value) {
          return ($scope.companyInfo.reputation !== null &&
            $scope.companyInfo.reputation &&
            $scope.companyInfo.reputation > (value - 1) )
        };

        $scope.setCompanyReputation = function (value) {
          $scope.companyInfo.reputation = value;
          $scope.save();
        };

        $scope.getUserObjByID = function (userId) {
          if (!userId) {
            return
          }
          var user = UsersService.getOneById(userId);
          if (user) {
            return user;
          }
        };

        $scope.openMapModal = function () {
          $uibModal.open({
            templateUrl: '/html/scripts/core/companies/company-profile/tabs/dashboard/map-modal.tpl.html',
            animation: true,
            backdrop: true,
            size: 'md',
            controller: 'quicktech.core.companies.companyProfileMapModalCtrl',
            windowClass: 'create-popup margin-top-modal-dialog',
            resolve: {
              companyInfo: $scope.companyInfo
            }
          });
        }

        console.log($scope, '$scope');


      }]);

      angular.module("quicktech.core.companies").filter('timeFilter',
        [function () {
          return function (time) {
            if (typeof time === 'string') return time;

            var hours = Math.floor(time / 60) + '';
            var minutes = time % 60 + '';

            if (hours.length === 1) hours = '0' + hours;
            if (minutes.length === 1) minutes = '0' + minutes;

            return hours + ':' + minutes;
          };
        }]);

}());
