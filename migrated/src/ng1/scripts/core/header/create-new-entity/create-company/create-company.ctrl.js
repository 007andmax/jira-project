'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.createCompanyCtrl',
    [
      '$scope', '$uibModal', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'AddressesService', 'ServicesService',
      'quicktech.common.services.PhoneFormats', 'quicktech.common.services.SharedStateService', '$state', '$timeout',
      '$rootScope', 'quicktech.common.services.PermissionsService', 'TagsService',
      function ($scope, $uibModal, UsersService, SubscriptionsService, CompaniesService, AddressesService, ServicesService,
        PhoneFormats, SharedStateService, $state, $timeout, $rootScope, PermissionsService, TagsService) {

        $scope.descriptionMaxLength = 300;
        $scope.techUsers = UsersService.getTechUsers;
        $scope.showWorkingDaysEditButton = false;
        $scope.showWorkingDaysEditFields = false;
        $scope.showWorkingDaysSchedule = false;
        $scope.selectedContractType;

        $scope.activeTechUsers = function () {
          return UsersService.getTechUsers().filter(function (el) {
            return el.userEnabled && !el.deletedAt;
          })
        }

        $scope.isMobilePhone = window.innerWidth <= 414;
        $scope.showModal = true;

        var daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        $scope.daysOfWeekMap = {
          MONDAY: 'Monday',
          TUESDAY: 'Tuesday',
          WEDNESDAY: 'Wednesday',
          THURSDAY: 'Thursday',
          FRIDAY: 'Friday',
          SATURDAY: 'Saturday',
          SUNDAY: 'Sunday'
        };


        $scope.companyTags = [];



        $scope.addAnotherLocation = function () {
          $scope.editCompany.additionalAddresses.push({
            phoneNumbers: [],
            address: '',
            postalCode: '',
            suiteNumber: '',
            isPrimary: false,
          });
        };

        $scope.timeFormat = ['AM', 'PM'];

        var newServiceCounter = 0;
        var steps = ['info', 'location', 'contact', 'billing', 'agent'];
        var savedState = $scope.getLastSavedState ? $scope.getLastSavedState('company') : {};
        var action = 'CREATE_COMPANIES';

        var origin = savedState.item;
        if ((savedState.type === 'company' && origin && origin.id) || $rootScope.savedCompanyId) {

          if ($rootScope.savedCompanyId) {
            var companyId = $rootScope.savedCompanyId,
              company = CompaniesService.getOneById(companyId);

          } else {
            var companyId = origin.id,
              company = CompaniesService.getOneById(companyId);

          }

          action = 'EDIT_COMPANIES';

          if ($scope.isMobilePhone) {
            $scope.showModal = false;

          }

          var companyData = CompaniesService.getCompanyData($scope, companyId, function () {


            $scope.companyTags = companyData.tags || $scope.companyTags;

            if (!companyData.addresses || companyData.addresses.length === 0) {
              companyData.addresses = [{}];
            }

            if (!companyData.contacts || companyData.contacts.length === 0) {
              companyData.contacts = [getEmptyContact()];
            }

            $scope.isLastInvoiceSubsciption = companyData.contacts[0].subscription &&
              companyData.contacts[0].subscription.invoice &&
              UsersService.getAllByCompanyId(companyId).filter(function (user) {
                return user.subscription.invoice;
              }).length <= 1;

            // for (var k = 0; k < companyData.services.length; k++) {
            //   var service = companyData.services[k].originService || companyData.services[k];
            //   $scope.selectedServices[service.versionedId.id] = true;
            // }

            $scope.editCompany = companyData.staticCopy();


            getCorrectWorkingTime();
            $scope.contact = $scope.editCompany.contacts[0];

            if ($scope.editCompany.paymentTerms) {
              $scope.editCompany.paymentTerms += ' days';
            } else if ($scope.editCompany.paymentTerms === 0) {
              $scope.editCompany.paymentTerms = 'COD';
            }

            if ($scope.editCompany.clientType === 'VENDOR') {
              CompaniesService.isVendorHasProducts(companyId, function (resp) {
                $scope.editCompany.hasProducts = resp.isProductExist;
              });
            }

            if ($scope.editCompany.clientType) {
              $scope.editCompany.clientType = userReadable($scope.editCompany.clientType);
            }

            if ($scope.editCompany.serviceType) {
              $scope.editCompany.serviceType = userReadable($scope.editCompany.serviceType);
            }

            if (company.defaultPaymentMethod) {
              $scope.editCompany.defaultPaymentMethod = userReadable(company.defaultPaymentMethod);
            }

            if (!$scope.editCompany.credential) {
              $scope.editCompany.login = '';
              $scope.editCompany.password = '';
            }

            origin = angular.copy($scope.editCompany);

            if ($scope.resolvedAdvanced) {
              $scope.switchCompanyModal(true)
            } else if ($scope.isMobileEdit) {

              if ($scope.isMobilePhone) {
                $scope.showModal = false;
                $timeout(function () {
                  $scope.showModal = true;
                }, 400)
              }
              $scope.switchCompanyModal(false)
              $scope.switchCompanyModalBack(true)

              setTimeout(function () {
                $scope.$apply();
                $scope.switchCompanyModal(true)
              }, 50)

              setTimeout(function () {

                $scope.$apply();
                $scope.switchCompanyModal(true)
                $scope.switchCompanyModalBack(true)
              }, 100)
            }
          });

        } else if (origin) {
          $scope.isLastInvoiceSubsciption = true;
          $scope.editCompany = {
            addresses: [{ isPrimary: true }],
            contacts: [
              {
                firstName: origin.firstName,
                lastName: origin.lastName,
                primaryEmail: origin.source,
                subscription: { ticket: true, invoice: true },
                avatar: {
                  scale: 50
                }
              }
            ],
            services: [],
            clientIndustry: {},
            defaultPaymentMethod: '',
            login: '',
            password: '',
            maxAgents: 0,
            removeOfflineTime: 30
          };
          getCorrectWorkingTime();
          $scope.contact = $scope.editCompany.contacts[0];
        } else {
          $scope.isLastInvoiceSubsciption = true;
          $scope.editCompany = {
            addresses: [{ isPrimary: true }],
            contacts: [getEmptyContact()],
            services: [],
            clientIndustry: {},
            defaultPaymentMethod: '',
            login: '',
            password: '',
            maxAgents: 0,
            removeOfflineTime: 30
          };
          getCorrectWorkingTime();
          $scope.contact = $scope.editCompany.contacts[0];
        }
        // $scope.editCompany.additionalAddresses = [];



        $scope.$watch('currentUser.permissions', function (permissions) {
          if (permissions && !PermissionsService.isAllowed(action)) {
            $scope.closeWindow();
          }
        });

        $scope.tryToSave = false;
        $scope.currentStep = 'info';
        $scope.PermissionsService = PermissionsService;
        $scope.selectedServices = {};

        $scope.clientTypes = ['Client', 'Lead', 'Vendor'];
        $scope.serviceTypes = ['Fully Managed', 'Semi Managed', 'Hourly'];
        $scope.paymentMethods = ['Cash', 'Cheque', 'Debit Card', 'Credit Card', 'Wire Transfer'];
        $scope.paymentTerms = ['COD', '7 days', '15 days', '30 days'];
        $scope.serviceTypes = ['HOURLY', 'BLOCK_TIME', 'SEMI_MANAGED', 'FULLY_MANAGED'];
        $scope.serviceTypesMap = {
          HOURLY: 'Hourly',
          BLOCK_TIME: 'Block time',
          SEMI_MANAGED: 'Semi managed',
          FULLY_MANAGED: 'Fully managed'
        };

        CompaniesService.getIndustries(function (resp) {
          $scope.industries = resp;
        });

        $scope.saveWorkingHours = function () {
          $scope.editCompany.workingDays = [];
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

            $scope.editCompany.workingDays.push(day);
          }
          $scope.showWorkingDaysEditFields = false;

        };

        function gotSecondFromTimeAndFormatObject(objectTime, objectTimeFormat) {
          if (objectTime && objectTimeFormat) {
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
            var isWorkingDay = ($scope.editCompany.workingDays && $scope.editCompany.workingDays.length > 0 && ($scope.editCompany.workingDays[i].startTime || $scope.editCompany.workingDays[i].endTime)) ? true : false;
            var day;

            if (isWorkingDay) {
              day = {
                startTime: timeFormatter($scope.editCompany.workingDays && $scope.editCompany.workingDays.length > 0 ? $scope.editCompany.workingDays[i].startTime : 0),
                startTimeFormat: getTimeFormat($scope.editCompany.workingDays && $scope.editCompany.workingDays.length > 0 ? $scope.editCompany.workingDays[i].startTime : 0),
                endTime: timeFormatter($scope.editCompany.workingDays && $scope.editCompany.workingDays.length > 0 ? $scope.editCompany.workingDays[i].endTime : 0),
                endTimeFormat: getTimeFormat($scope.editCompany.workingDays && $scope.editCompany.workingDays.length > 0 ? $scope.editCompany.workingDays[i].endTime : 0),

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


        $scope.selectContractType = function (type) {
          if ($scope.selectedContractType === type) {
            $scope.selectedContractType = '';
          } else {
            $scope.selectedContractType = type;
          }
        };

        $scope.servicesData = ServicesService.getServicesData($scope, function () {
          if (!savedState.item || !savedState.item.id) {
            $timeout(function () {
              if ($scope.servicesData && $scope.servicesData.default) {
                for (var i = 0; i < $scope.servicesData.default.length; i++) {
                  var service = angular.copy($scope.servicesData.default[i]);
                  $scope.editCompany.services && $scope.editCompany.services.push(service);
                  $scope.selectedServices[service.versionedId.id] = true;
                }
              }
            });
          }
          console.log('$scope.editCompany.services',$scope.editCompany.services);
        });

        AddressesService.getLocales(true, function (response) {
          $scope.timeZones = response;
        });

        $scope.isShowingContactErrors = function (contact, form, fieldName) {
          if (!$scope.triedToSave) return false;

          return form[fieldName] && ((contact && contact.id) || form[fieldName].$dirty || $scope.triedToSave) && !form[fieldName].$valid;
        };

        $scope.save = function (form, isCreateContract, isInvoice) {
          $scope.isSaveFailed = false;

          // console.log(form, form.$valid);


          if (isInvoice) {
            $rootScope.updateBillTo = form;
          }

          $scope.triedToSave = true;


          if (form.$valid) {
            $scope.savingInProcess = true;
            $scope.saveWorkingHours();


            var editCompany = angular.copy($scope.editCompany);

            // editCompany.additionalAddresses.forEach(function(ad) {
            //   editCompany.addresses.push(ad);
            // })

            var contacts = editCompany.contacts,
              addresses = editCompany.addresses;


            for (var i = 0; i < contacts.length; i++) {
              var contact = contacts[i];

              processPhoneNumbers(contact.phoneNumbers);

              if (contact.avatar && !contact.avatar.id && !contact.avatar.origin && !contact.avatar.cropped) {
                contact.avatar = undefined;
              }
            }

            for (var i = 0; i < 1; i++) {
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

            // if(editCompany.techLeadIds) {
            //   var techIds = [];
            //   techIds.push(editCompany.techLeadIds);
            //   editCompany.techLeadIds = techIds;
            //
            // }
 



            CompaniesService.save(editCompany, function (resp) {
              $scope.savingInProcess = false;
              if (!resp.code || resp.code === 200) {
                $scope.disablePreventingLocationChange = true;
                if (!$scope.currentUser.wizardTracker || !$scope.currentUser.wizardTracker.setupClient) {
                  UsersService.updateWelcomeWizard('setupClient');
                }
                $rootScope.$broadcast('newCompanyHasBeenCreated', resp.id || resp);

                TagsService.setTagsInCompany($scope.companyTags, resp.id || resp, function (res) {
                  $rootScope.newCompanyEditTags = CompaniesService.updateCompanyTags($scope.companyTags, companyId);
                });

                if (!($scope.savedState && $scope.savedState.items.length)) {
                  if (isCreateContract && $scope.selectedContractType) {
                    $scope.closeWindowWithoutConfirmation();
                    openCreateContractModal(editCompany, 'CREATE_NEW', resp);
                  } else {
                    $scope.closeWindow();
                    openCreateContractModal(editCompany)
                  }
                }
              } else {
                $scope.isSaveFailed = true;
              }
            });


            unsubscribeClosingEvent();
          } else {
            $scope.triedToSave = true;

            for (var error in form.$error) {
              var subForm = form.$error[error][0];
              subForm && $scope.setCurrentStep(subForm.$name.replace('Form', ''));
            }
          }

          function processPhoneNumbers(phoneNumbers) {

            if (!phoneNumbers.length) return;

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

        };

        function openCreateContractModal(companyInfo, contractType, companyId) {
          var template;
          switch (contractType) {
            case ('CREATE_NEW'):
              template = '/ng1/scripts/core/service-agreements/modal/create-new-modal.tpl.html';
              break;
            case ('HOURLY'):
              template = '/ng1/scripts/core/service-agreements/modal/hourly-service-modal.tpl.html';
              break;
            case ('BLOCK_TIME_BILLING'):
              template = '/ng1/scripts/core/service-agreements/modal/block-time-billing-modal.tpl.html';
              break;
            case ('PER_USER/DEVICE_BILLING'):
              template = '/ng1/scripts/core/service-agreements/modal/service-contract-modal.tpl.html';
              break;
            default:
              console.log('no contract type selected');
          }

          companyInfo.companyId = companyId;
          companyInfo.company = {
            id: companyId
          }

          $uibModal.open({
            templateUrl: template,
            animation: true,
            backdrop: false,
            size: 'md',
            controller: 'serviceAgreementsModalCtrl',
            windowClass: 'create-popup margin-top-modal-dialog',
            resolve: {
              companyData: {
                companyInfo: companyInfo,
                companyId: companyId,
                type: contractType,
                editMode: true,
                preSetupCompany: companyInfo
              }
              // companyInfo: companyInfo,
              // companyId: companyId,
              // type:  contractType
            }

          });
        }

        $scope.isShowingErrors = function (form, fieldName) {
          if (!$scope.triedToSave) return false;
          return form[fieldName] && (($scope.editCompany && $scope.editCompany.id) || form[fieldName].$dirty || $scope.triedToSave) && form[fieldName].$invalid;
        };

        $scope.isShowingServiceErrors = function (form, fieldName) {
          if (!$scope.triedToSave) return false;
          return form[fieldName] && (form[fieldName].$dirty || $scope.triedToSave) && form[fieldName].$invalid;
        };
     /*   $scope.changeCompanyname = function () {
       
          if ($scope.editCompany.name.includes('%')) {
            $scope.editCompany.name = $scope.editCompany.name.replace('%', '');

            $scope.$apply();
          }
        }
*/

        $scope.validateCompanyName = function (ngModelCtrl, modelId, afterValidationCallback) {

          if ($scope.currentUser.accountType === "ROOT") {
            ngModelCtrl.$setValidity('unique', true);
            return
          }
        
          var validationResult = CompaniesService.isNameUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.validateCompanyDomain = function (ngModelCtrl, modelId, afterValidationCallback) {
          var validationResult = CompaniesService.isDomainUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
            afterValidationCallback();
          });
        };

        $scope.validateContactEmail = function (ngModelCtrl, contactId, afterValidationCallback) {

          var emailsCount = 0;

          for (var i = 0; i < $scope.editCompany.contacts.length; i++) {
            if ($scope.editCompany.contacts[i].primaryEmail === ngModelCtrl.$viewValue) {
              emailsCount++;
            }
          }

          if (emailsCount > 1) {
            ngModelCtrl.$setValidity('unique', false);
            afterValidationCallback();
          } else {
            var validationResult = UsersService.isEmailUnique(ngModelCtrl.$viewValue, contactId || '', false, $scope.editCompany.id, function () {
              ngModelCtrl.$setValidity('unique', validationResult.value);
              afterValidationCallback()
            });
          }
        };

        $scope.changePrimaryAddress = function (location) {
          angular.forEach($scope.editCompany.addresses, function (address) {
            address.isPrimary = false;
          });
          location.isPrimary = true;
        };

        $scope.movingService = function (originService, form) {

          if (originService === 'new-service') {
            var newService = {
              new: true,
              newId: newServiceCounter++,
              name: '',
              rate: 0,
              billable: true
            };
            $scope.editCompany.services.push(newService);
            form.$setPristine();

          } else {
            var service = angular.copy(originService);

            if ($scope.selectedServices[service.versionedId.id]) {
              $scope.editCompany.services.push(service);
            } else {
              $scope.deleteService(service);
            }
          }
        };

        $scope.deleteService = function (service) {

          if (service.originService && $scope.selectedServices[service.originService.versionedId.id]) {
            $scope.selectedServices[service.originService.versionedId.id] = false;
          } else if (service.versionedId && $scope.selectedServices[service.versionedId.id]) {
            $scope.selectedServices[service.versionedId.id] = false;
          }

          for (var i = 0; i < $scope.editCompany.services.length; i++) {
            var companyService = $scope.editCompany.services[i].originService || $scope.editCompany.services[i];

            if (
              service.new && service.newId === companyService.newId ||
              service.versionedId && service.versionedId.id === companyService.versionedId.id ||
              service.originService && service.originService.versionedId.id === companyService.versionedId.id
            ) {
              $scope.editCompany.services.splice(i, 1);
              return;
            }
          }

        };

        $scope.validateServiceName = function (ngModelCtrl, modelId, afterValidationCallback) {
          var defaultDuplicates = 0,
            newServicesDuplicates = 0;

          if ($scope.servicesData && $scope.servicesData.default) {
            for (var i = 0; i < $scope.servicesData.default.length; i++) {
              if (ngModelCtrl.$viewValue.toLowerCase() === $scope.servicesData.default[i].name.toLowerCase()) {
                defaultDuplicates++;
              }
            }
          }

          if ($scope.editCompany.services) {
            for (var i = 0; i < $scope.editCompany.services.length; i++) {
              if (ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.toLowerCase() === $scope.editCompany.services[i].name.toLowerCase()) {
                newServicesDuplicates++;
              }
            }
          }

          ngModelCtrl.$setValidity('unique', newServicesDuplicates < 2 && defaultDuplicates < 1);
          afterValidationCallback();
        };

        $scope.nextStep = function (form) {
          if (getFormByStep($scope.currentStep, form).$valid) {
            $scope.triedToSave = false;
            $scope.currentStep = steps[steps.indexOf($scope.currentStep) + 1];
          } else {
            $scope.triedToSave = true;
          }
        };

        $scope.setCurrentStep = function (step) {
          $scope.currentStep = step;
        };

        var unsubscribeClosingEvent = $scope.$on('createNewWindowClosing', createNewWindowClosing);

        function createNewWindowClosing() {
          var company = $scope.editCompany;
          var isCompanyChanged, hasClientType, hasAddress, hasContact;

          if (origin) {
            var user = company.contacts[0];
            var originUser = origin.contacts[0];
            hasContact = user.firstName !== originUser.firstName
              || user.lastName !== originUser.lastName
              || user.primaryEmail !== originUser.primaryEmail
              || user.designation !== originUser.designation
              || !angular.equals(user.avatar.cropped, originUser.avatar.cropped);

            isCompanyChanged = company.name !== origin.name
              || company.domain !== origin.domain
              || company.clientType.trim() !== origin.clientType.trim()
              || !angular.equals(company.logo.cropped, origin.logo.cropped)
              || company.accountNumber !== origin.accountNumber
              || company.description !== origin.description
              || !angular.equals(company.address, origin.address)
              || hasContact
              || company.login !== origin.login
              || company.password !== origin.password ||
              company.techLeadIds !== origin.techLeadIds;

          } else {
            hasClientType = company.clientType && company.clientType.trim();
            hasAddress = company.addresses && company.addresses.length && company.addresses[0].address;
            hasContact = company.contacts && company.contacts.length && (
              company.contacts[0].firstName || company.contacts[0].lastName || company.contacts[0].primaryEmail ||
              company.contacts[0].designation || company.contacts[0].avatar.cropped
            );

            isCompanyChanged = company.name || company.domain || hasClientType || company.logo ||
              company.accountNumber || company.description || hasAddress || hasContact || company.login || company.password;
          }

          if (isCompanyChanged) {
            $scope.savedState.types.unshift('company');
            $scope.savedState.items.unshift($scope.editCompany);
          }
        }

        function getFormByStep(step, parentForm) {
          return parentForm[step + 'Form'];
        }

        function getEmptyContact() {
          return {
            subscription: { ticket: true, invoice: true },
            avatar: {
              scale: 50
            }
          };
        }

        function userReadable(text) {
          if (!text) {
            return '';
          }

          var words = text.split('_'),
            result = '';

          for (var i = 0, len = words.length; i < len; i++) {
            var word = words[i];
            result += word[0].toUpperCase() + word.slice(1).toLowerCase();

            if (i !== len - 1) {
              result += ' ';
            }
          }

          return result;
        }

        function toEnum(text) {
          return text.trim().split(' ').join('_').toUpperCase();
        }

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

          var isAllSpaces = client.lastName === "    ";
          if (client.lastName && !isAllSpaces) {
            return client.firstName + ' ' + client.lastName;
          } else {
            return client.firstName;
          }
        };


      }
    ]);

}());
