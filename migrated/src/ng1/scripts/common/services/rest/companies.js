'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('CompaniesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', function ($http, $rootScope, RealTimeService, Utils) {
 
    var serviceScope = $rootScope.$new(),
      initialized = false,
      initListeners = [],
      amountChangeListeners = [],
      storage = {
        companies: [],
        vendors: [],
        clientCompanies: [],
        clientCompaniesWoVendorsAndLeads: [],
        deletedCompanies: [],
        currentCompany: {}
      },
      callbackForArchive,
      callbackForSavedCompanies = {},
      companyPaymentInfo = {};


    Utils.customizeObj(storage);

    function reinitCompanies(callback) {
      $http.get('/company/clients').then(function (resp) {
        for (var i = 0; i < resp.data.length; i++) {
          var custCompany = Utils.customizeObj(resp.data[i]);
          if (custCompany.deletedAt) {
            storage.deletedCompanies.push(custCompany);
          } else {
            if (!custCompany.isDefault && custCompany.clientType) {
              if (custCompany.clientType === 'CLIENT') {
                storage.clientCompaniesWoVendorsAndLeads.push(custCompany);
              }
              if (custCompany.clientType.toLowerCase() !== 'vendor') {
                storage.clientCompanies.push(custCompany);
              } else {
                storage.clientCompanies.push(custCompany);
                storage.vendors.push(custCompany);
              }
            }

            storage.companies.push(custCompany);
          }
        }
        checkInit();
        $rootScope.companyListLoaded = true;

        if (callback) {
          callback(resp);
        }
      },
        function (resp) {
          console.error(resp);
          throw 'Cannot initialize CompaniesService!';
        });
    }

    function updateCompanyTags(newCompanyTags, companyId) {
      const companyForChangeIndex = storage.companies.findIndex(function (item) {
        return item.id === companyId;
      });
      return storage.companies[companyForChangeIndex].tags = newCompanyTags;
    }

    $http.get('/company/clients').then(function (resp) {
      for (var i = 0; i < resp.data.length; i++) {
        var custCompany = Utils.customizeObj(resp.data[i]);
        if (custCompany.deletedAt) {
          storage.deletedCompanies.push(custCompany);
        } else {
          if (!custCompany.isDefault && custCompany.clientType) {
            if (custCompany.clientType === 'CLIENT') {
              storage.clientCompaniesWoVendorsAndLeads.push(custCompany);
            }
            if (custCompany.clientType.toLowerCase() !== 'vendor') {
              storage.clientCompanies.push(custCompany);
            } else {
              storage.clientCompanies.push(custCompany);
              storage.vendors.push(custCompany);
            }
          }

          storage.companies.push(custCompany);
        }
      }
      checkInit();
      $rootScope.companyListLoaded = true;
    },
      function (resp) {
        console.error(resp);
        throw 'Cannot initialize CompaniesService!';
      });

    $http.get('/ps/settings').then(function (resp) {
      Utils.customizeObj(resp.data, companyPaymentInfo);
      checkInit();
    },
      function (resp) {
        console.error(resp);
        throw 'Cannot initialize CompanyPaymentInfo!';
      });

    $http.get('/company/current').then(function (resp) {
      Utils.customizeObj(resp.data, storage.currentCompany);
      setRealTimeCurrentCompany();
      checkInit();
    },
      function (resp) {
        console.error(resp);
        throw 'Cannot initialize CompaniesService!';
      });

    function reloadCurrentCompany(callback) {
      $http.get('/company/current').then(function (resp) {
        if (callback) {
          callback(resp.data);
        } else {
          Utils.customizeObj(resp.data, storage.currentCompany);
        }
      })
    }

    var checkInitsCount = 0;

    function checkInit() {
      checkInitsCount++;
      if (checkInitsCount === 3) {
        initialized = true;

        for (var i = 0; i < initListeners.length; i++) {
          initListeners[i]();
        }
      }
    }

    RealTimeService.subscribe('/company', serviceScope, function (newChange) {
     
      if (!initialized) {
        return;
      }
      


      var companyId = newChange.data.id;
      if (newChange.action == 'COMPANY_SAVED') {
       
        var company = getOneById(companyId);

        if (companyId === getCurrentCompany().id) {
          $rootScope.techCompanyChanged = newChange.data;
        }

        if (company) {
          Utils.customizeObj(newChange.data, company);
        } else if (newChange.data.accountType !== 'TECH') {
          var newClient = Utils.customizeObj(newChange.data);
          storage.companies.push(newClient);
          if (newClient.clientType.toLowerCase() === 'client') {
            storage.clientCompaniesWoVendorsAndLeads.push(newClient);
          }
          if (newClient.clientType.toLowerCase() !== 'vendor') {
            storage.clientCompanies.push(newClient);
          } else {
            storage.clientCompanies.push(newClient);
            storage.vendors.push(newClient);
          }

          for (var i = 0; i < amountChangeListeners.length; i++) {
            amountChangeListeners[i]();
          }

          if (callbackForSavedCompanies[companyId]) {
           
            callbackForSavedCompanies[companyId](companyId);
          }
        }

      } else if (newChange.action == 'COMPANY_ARCHIVED') {
        var deletedCompany = Utils.findById(storage.companies, companyId);
        if (deletedCompany) {
          storage.deletedCompanies.push(Utils.customizeObj(newChange.data, deletedCompany));
        }

        Utils.deleteById(storage.companies, companyId);
        Utils.deleteById(storage.clientCompanies, companyId);
        Utils.deleteById(storage.clientCompaniesWoVendorsAndLeads, companyId);
        Utils.deleteById(storage.vendors, companyId);

        if (callbackForArchive && (typeof callbackForArchive == 'function')) {
          callbackForArchive(companyId);
        }

        for (var i = 0; i < amountChangeListeners.length; i++) {
          amountChangeListeners[i]();
        }
      } else if (newChange.action == 'COMPANY_DEARCHIVED') {

        var company = Utils.customizeObj(newChange.data);
        if (company.clientType == ' CLIENT') {
          storage.clientCompaniesWoVendorsAndLeads.push(company);
        }
        if (company.clientType.toLowerCase() !== 'vendor') {
          storage.clientCompanies.push(company);
        } else {
          storage.clientCompanies.push(company);
          storage.vendors.push(company);
        }

        storage.companies.push(company);
        Utils.deleteById(storage.deletedCompanies, company.id);

        for (var i = 0; i < amountChangeListeners.length; i++) {
          amountChangeListeners[i]();
        }
      }
    });
    function setRealTimeCurrentCompany() {
    
      RealTimeService.subscribe('/company/' + storage.currentCompany.id, serviceScope, function (newChange) {
        
        if (newChange.action === "SERVICE_EXPENSE_DATA_PICKER_CHANGED") {
          storage.currentCompany.serviceExpenseDurationPresentation = newChange.data.presentation;
          storage.currentCompany.serviceExpenseDurationPickerInterval = newChange.data.interval;
        }


      })
    }
    
    RealTimeService.subscribe('/companySettings', serviceScope, function (newChange) {

      if (newChange.action === 'SMTP_SETTINGS_UPDATED') {
        $rootScope.SMTPChanged = newChange.data;
      } else if (newChange.action === 'COMPANY_EMAIL_ALIAS_UPDATED') {
        $rootScope.updatedAlias = newChange.data;
      }
    })

    function _addAmountChangeListener(callback) {
      amountChangeListeners.push(callback);
    }

    function getCurrentCompany() {
      return storage.currentCompany;
    }

    function getClientCompanies(callback) {
      addInitListener(callback);
      return storage.clientCompanies;
    }

    function getClientCompaniesWoClientsAndLeads(callback) {
      addInitListener(callback);
      return storage.clientCompaniesWoVendorsAndLeads;
    }

    function getAllCompanies() {
      return storage.companies;
    }

    function getArchivedCompanies() {
      return storage.deletedCompanies;
    }

    function getVendors() {
      return storage.vendors;
    }

    function getCompanyPaymentInfo() {
      return companyPaymentInfo;

    }


    function resetReferenceDate(callback) {
      $http.post('/settings/companyProfile/accountingStartDate/reset')
        .then(function (res) {
          if (callback) callback(res)
        })
    }

    function getReferenceDate(callback) {
      $http.get('/settings/companyProfile/accountingStartDate')
        .then(function (res) {
          if (callback) callback(res);
        })
    }

    function setReferenceDate(date, callback) {
      $http.post('/settings/companyProfile/accountingStartDate', date)
        .then(function (res) {
          if (callback) callback(res)
        })
    }

    function setTechLead(companyId, techLeadId, callback) {
      if (!companyId || !techLeadId) return;
      $http.put('/company/' + companyId + '/setTechLead/' + techLeadId).
        then(function (res) {
          if (callback) {
            callback()
          }
        })
    }

    function getCompanyByAddressId(id) {
      var clients = storage.clientCompanies;

      for (var i = 0; i < clients.length; i++) {
        if (clients[i].companyInfo.addresses && clients[i].companyInfo.addresses[0] && clients[i].companyInfo.addresses[0].id === id) {
          return clients[i];
        }
      }

      return null;
    }

    function getUnassignedCompany() {
      for (var i = 0; i < storage.companies.length; i++) {
        if (storage.companies[i].isDefault) {
          return storage.companies[i];
        }
      }
    }

    function getOneById(companyId, callback) {

      if (callback) {
        callbackForArchive = callback;
      }
      if (companyId === storage.currentCompany.id) {
        return storage.currentCompany;
      }

      return Utils.findById(storage.companies, companyId) || Utils.findById(storage.deletedCompanies, companyId);

    }

    function checkStorageCompanyLength() {
      return storage.companies.length;
    }

    function searchByAllCompanies(keyword) {
      return search(keyword, true)
    }

    function searchByClientCompanies(keyword) {
      return search(keyword, false)
    }

    function search(keyword, includeCurrent) {

      if (!keyword) {
        throw 'Keyword is required!'
      }

      var searchResult = [],
        keywordLowerCase = keyword.toLowerCase();

      for (var i = 0; i < storage.companies.length; i++) {

        var company = storage.companies[i];
        if (!includeCurrent && storage.currentCompany.id === company.id) {
          continue;
        }

        if (company.name.toLowerCase().indexOf(keywordLowerCase) > -1) {
          searchResult.push(company);
        }
      }

      return searchResult;
    }

    function archive(companyId, callback) {
      var future = $http.get('/company/archive/' + companyId);
      Utils.handleCallback(future, callback);
    }

    function dearchive(companyId, callback) {
      var future = $http.get('/company/dearchive/' + companyId);
      Utils.handleCallback(future, callback);
    }

    function getClientCompaniesInfo(scope, callback) {

      if (!scope || !scope.$id) {
        throw 'Second argument must be Angularjs scope!'
      }

      var info = Utils.customizeObj({});

      $http.get('/company/clients/info').then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      RealTimeService.subscribe('https://dev.quicktech.com/clientCompaniesInfo', scope, function (newChange) {

        if (newChange.action == 'CLIENT_COMPANY_INFO') {

          var data = JSON.parse(newChange.data);
          for (var companyId in data) {
            Utils.defineReadOnlyProperty(info, companyId, Utils.customizeObj(data[companyId]));
            for (var i = 0; i < storage.companies.length; i++) {
              if (storage.companies[i].id === companyId) {
                storage.companies[i].companyInfo = {
                  addresses: data[companyId].addresses,
                  contacts: data[companyId].contacts,
                  primaryAddress: data[companyId].primaryAddress
                }
              }
            }
            $rootScope.$broadcast('newCompanyInfo' + companyId);
          }
        }
      });
      return info;
    }

    function setCategoryRate(id, data, callback) {
      $http.put('/settings/companyProfile/categoryRate/' + id + '?setForOldExpenses=' + data.setForOldExpenses, {
        commissionRate: data.rate
      }).then(function (res) {
        if (callback) callback(res);
      })
    }

    function setServiceRate(id, data, callback) {
      $http.put('/settings/companyProfile/serviceRate/' + id + '?setForOldExpenses=' + data.setForOldExpenses, {
        commissionRate: data.rate
      }).then(function (res) {
        if (callback) callback(res);
      })
    }

    function setAgreementsRate(rates, setForOldExpenses, callback) {
      $http.post('/settings/companyProfile/agreementRates' + "?setForOldExpenses=" + setForOldExpenses, rates)
        .then(function (res) {
          if (callback) callback(res);
        })
    }

    function getAgreementsRates(callback) {
      $http.get('/settings/companyProfile/agreementRates')
        .then(function (res) {
          if (callback) callback(res);
        })
    }

    function getCompanyInfo(companyId, scope, callback) {

      if (!companyId) {
        throw 'companyId is required!'
      }

      if (!scope || !scope.$id) {
        throw 'Second argument must be Angularjs scope!'
      }

      var info = Utils.customizeObj({});

      $http.get('/company/' + companyId + '/info').then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      RealTimeService.subscribe('/clientCompaniesInfo', scope, function (newChange) {

        if (newChange.action == 'CLIENT_COMPANY_INFO') {

          var data = JSON.parse(newChange.data);

          for (var key in data) {
            if (key === companyId) {
              Utils.customizeObj(data[companyId], info);
            }
          }
        }
      });

      return info;
    }

    function getCompanyData(scope, companyId, callback) {

      if (!companyId) {
        throw 'companyId is required!'
      }

      if (!scope || !scope.$id) {
        throw 'Second argument must be Angularjs scope!'
      }

      var companyDto = Utils.customizeObj({});

      $http.get('/company/' + companyId + '/data').then(function (resp) {
        Utils.customizeObj(resp.data, companyDto);

        if (callback) {
          callback(companyDto);
        }

      }, function (resp) {
        if (callback) {
          callback(resp);
        }
      });

      RealTimeService.subscribe('https://dev.quicktech.com/companyDto/' + companyId, scope, function (newChange) {

        if (newChange.action == 'COMPANY_DTO_CHANGED') {

          var data = JSON.parse(newChange.data);
          if (data[companyId]) {
            Utils.customizeObj(data[companyId], companyDto);
          }
        }
      });

      RealTimeService.subscribe('/user', serviceScope, function (newChange) {
        if (newChange.action === 'USER_SAVED') {
          if (newChange.data.id === companyDto.contacts[0].id) {
            Utils.customizeObj(newChange.data, companyDto.contacts[0]);
          }
        }
      });

      return companyDto;
    }

    function getCompanyProfileData(scope, companyId, callback) {

      var companyDto = Utils.customizeObj({});

      $http.get('/company/' + companyId + '/profile').then(function (resp) {
        Utils.customizeObj(resp.data, companyDto);

        if (callback) {
          callback(companyDto);
        }

      }, function (resp) {
        if (callback) {
          callback(resp);
        }
      });

      RealTimeService.subscribe('/companyDto/' + companyId, scope, function (newChange) {

        if (newChange.action == 'COMPANY_DTO_CHANGED') {



          var data = JSON.parse(newChange.data);

          if (data[companyId]) {
            Utils.customizeObj(data[companyId], companyDto);

            if (callback) {
              callback(companyDto);
            }
          }
        }
      });

      RealTimeService.subscribe('/user', serviceScope, function (newChange) {
        if (newChange.action === 'USER_SAVED') {
          if (newChange.data.id === companyDto.contacts[0].id) {
            Utils.customizeObj(newChange.data, companyDto.contacts[0]);

            if (callback) {
              callback(companyDto);
            }
          }
        }
      });

      return companyDto;
    }

    function isInitialized() {
      return initialized;
    }

    function save(company, callback) {

      if (!company) throw 'company is required!';

      var method = 'POST';
      if (company.id) {
        method = 'PUT';
      }

      var future = $http({
        url: '/company',
        method: method,
        data: company
      });

      if (company.id) {
        storage.clientCompanies.find(function (val) {
          return val.id === company.id;
        }).techLeadId = company.techLeadId;
      }

      if (!company.id && callback) {
        future.then(function (resp) {
          var companyId = resp.data.id;
          if (!getOneById(companyId)) {
            callbackForSavedCompanies[companyId] = callback;
          } else {
            callback(resp.data);
          }
        }, function (resp) {
          callback(resp.data);
        });
      } else {
        Utils.handleCallback(future, callback);
      }
    }

    function deleteExample(callback) {
      var future = $http({
        url: '/company/removeExampleCompany',
        method: 'POST',
      });

      Utils.handleCallback(future, callback);
    }

    function saveCompanySettingsDto(companyDto, callback) {

      if (!companyDto) throw 'companyDto is required!';

      var future = $http({
        url: '/settings/companyProfile/',
        method: 'PUT',
        data: companyDto
      });

      Utils.handleCallback(future, callback);
    }

    function saveForCompanyProfile(data, toUpdate, callback) {

      if (!data) throw 'data is required!';
      if (!toUpdate) throw 'toUpdate is required!';

      if (toUpdate === 'addresses') {
        data = { addresses: data }
      }

      var url = '/settings/companyProfile/' + toUpdate,
        method = 'PUT',
        saveData = angular.copy(data);

      $http({
        url: url,
        method: method,
        data: data
      }).then(function (resp) {
        if (callback) {
          callback(resp.data, saveData);
        }
      }, function (resp) {
        if (callback) {
          callback(resp.data, saveData);
        }
      });

    }

    function getCompanyForSettingPage(callback) {

      var info = {};

      $http.get('/settings/companyProfile/').then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function isNameUnique(name, id, callback) {

      if (!name) {
        throw 'name is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/company/isCompanyNameUnique', {
        params: { name: name, id: id }
      }).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function isDomainUnique(domain, id, callback) {

      if (!domain) {
        throw 'domain is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/company/isCompanyDomainUnique?domain=' + domain + '&id=' + id).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function isCompanyInboxUnique(inbox, callback) {

      if (!inbox) {
        throw 'inbox is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/isCompanyInboxUnique?inbox=' + inbox).then(function (resp) {
        Utils.customizeObj(resp.data, info);

        if (callback) {
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });
      return info;
    }

    function saveLogo(croppedImage, companyId, callback) {

      if (!croppedImage) throw 'croppedImage is required!';
      if (!companyId) throw 'companyId is required!';

      var future = $http({
        url: '/company/' + companyId + '/logo',
        method: 'POST',
        data: croppedImage
      });

      Utils.handleCallback(future, callback);
    }


    function saveCover(croppedImage, companyId, callback) {

      if (!croppedImage) throw 'croppedImage is required!';
      if (!companyId) throw 'companyId is required!';

      var url = '/company/' + companyId + '/cover',
        method = 'POST';

      var future = $http({
        url: url,
        method: method,
        data: croppedImage
      });

      Utils.handleCallback(future, callback);
    }

    function deleteCover(companyId, callback) {

      if (!companyId) throw 'companyId is required!';

      var future = $http({
        url: '/company/' + companyId + '/false',
        method: 'DELETE'
      });

      Utils.handleCallback(future, callback);
    }

    function deleteLogo(companyId, callback) {

      if (!companyId) throw 'companyId is required!';

      var future = $http({
        url: '/company/' + companyId + '/true',
        method: 'DELETE'
      });

      Utils.handleCallback(future, callback);
    }

    function addInitListener(callback) {

      if (!callback) return;

      if (!initialized) {
        initListeners.push(callback);
      } else {
        callback();
      }
    }

    function sendEmail(data, callback) {
      $http({
        url: '/email/customEmail',
        method: "POST",
        data: data
      }).then(function (res) {
        if (callback) callback(res);
      })
    }

    function getCompanyContacts(scope, companyId, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!';
      }
      if (!companyId) {
        throw 'Second argument must be companyId!';
      }

      return Utils.getListByUrl('/company/' + companyId + '/contacts', callback, function (list) {

        RealTimeService.subscribe('/companyContact', scope, function (newChange) {

          if (newChange.action == 'COMPANY_CONTACT') {
            list.splice(0, list.length);
            Utils.customizeArray(newChange.data, list);
          }
        });

        RealTimeService.subscribe('/subscription/' + companyId, scope, function (newChange) {

          if (!newChange.data.contact) {
            return;
          }

          var contact = Utils.findById(list, newChange.data.contact.id);

          if (contact) {

            if (newChange.action == 'SUBSCRIPTION_SAVED') {
              Utils.defineReadOnlyProperty(contact, 'subscription', Utils.customizeObj(newChange.data));
            } else if (newChange.action == 'SUBSCRIPTION_DELETED') {
              delete contact.subscription;
            }
          }

        });
      });
    }

    function saveAllowingCreateCustomTags(value) {
      if (value === undefined) {
        throw 'First parameter required!'
      }

      $http.put('/settings/companyProfile/allowUsersCreateTags?allow=' + value, {});
    }

    function saveCompanyPaymentInfo(data, callback) {
      if (data === undefined) {
        throw 'First parameter required!'
      }
      var future = $http({
        url: '/ps/settings',
        method: 'PUT',
        data: data
      });

      Utils.handleCallback(future, callback);
    }

    function getCompanySMTPSettings(callback) {
      var future = $http.get('/settings/companyProfile/SMTPSettings');
      Utils.handleCallback(future, callback);
    }

    function checkSMTPLoginUnique(email, callback) {
      var future = $http.get('/settings/companyProfile/SMTPSettings/checkEmailUnique?email=' + email);
      Utils.handleCallback(future, callback);
    }

    function changeRoleName(name, id, callback) {
      var future = $http.put('/settings/companyProfile/updateTechRoleName/' + id, { newTechRoleName: name });
      Utils.handleCallback(future, callback);
    }

    function addNewRole(role, callback) {
      var future = $http.post('/settings/companyProfile/createTechRole', role);
      Utils.handleCallback(future, callback);
    }

    function deleteRole(roleId, callback) {
      var future = $http.delete('/settings/companyProfile/deleteTechRole/' + roleId);
      Utils.handleCallback(future, callback);
    }

    function getPermissions(callback) {
      var future = $http.get('/settings/companyProfile/permissions');
      Utils.handleCallback(future, callback);
    }

    function savePermissions(permissions, callback) {
      $http.post('/settings/companyProfile/permissions', permissions);
    }

    function getTechRoles(callback) {
      var future = $http.get('/settings/companyProfile/getRoleNames');

      RealTimeService.subscribe('/techRoles', $rootScope.$new(), function (newChange) {


        if (newChange.action === 'TECH_ROLE_DELETED') {
          $rootScope.techRolesChanged = newChange.data.id;
        } else {
          $rootScope.techRolesChanged = newChange.data;
        }
      })

      Utils.handleCallback(future, callback);
    }

    function getEmailAlias(callback) {
      var future = $http.get('/settings/companyProfile/emailAlias');
      Utils.handleCallback(future, callback);
    }

    function saveEmailAlias(emailAlias, callback) {
      var future = $http.post('/settings/companyProfile/emailAlias', { emailAlias: emailAlias });
      Utils.handleCallback(future, callback);
    }

    function getIndustries(callback) {
      var future = $http.get('/company/getIndustries');
      Utils.handleCallback(future, callback);
    }

    function changeCompanyStatusToActive() {
      return $http.get('/company/changeStatusFromSignUpToActive');
    }

    function isVendorHasProducts(vendorId, callback) {
      var future = $http.get('/company/' + vendorId + '/isProductExist');
      Utils.handleCallback(future, callback);
    }

    function saveInboxEnabled(isEnabled, callback) {
      var future = $http.put('/settings/companyProfile/inbox', { enabled: isEnabled });
      Utils.handleCallback(future, callback);
    }

    function changePrimaryContact(id, callback) {
      var future = $http({
        method: 'GET',
        url: '/company/resetPrimaryContact?userId=' + id
      });
      Utils.handleCallback(future, callback);
    }

    return {
      _addInitListener: addInitListener,
      _addAmountChangeListener: _addAmountChangeListener,
      _search: search,
      _isInitialized: isInitialized,
      getCurrentCompany: getCurrentCompany,
      reinitCompanies: reinitCompanies,
      getVendors: getVendors,
      getClientCompanies: getClientCompanies,
      getClientCompaniesWoClientsAndLeads: getClientCompaniesWoClientsAndLeads,
      getAllCompanies: getAllCompanies,
      getArchivedCompanies: getArchivedCompanies,
      getOneById: getOneById,
      getCompanyByAddressId: getCompanyByAddressId,
      getUnassignedCompany: getUnassignedCompany,
      searchByAllCompanies: searchByAllCompanies,
      searchByClientCompanies: searchByClientCompanies,
      getClientCompaniesInfo: getClientCompaniesInfo,
      getCompanyInfo: getCompanyInfo,
      archive: archive,
      dearchive: dearchive,
      save: save,
      deleteExample: deleteExample,
      saveForCompanyProfile: saveForCompanyProfile,
      saveCompanySettingsDto: saveCompanySettingsDto,
      getCompanyForSettingPage: getCompanyForSettingPage,
      getCompanyData: getCompanyData,
      getCompanyProfileData: getCompanyProfileData,
      isNameUnique: isNameUnique,
      isDomainUnique: isDomainUnique,
      isCompanyInboxUnique: isCompanyInboxUnique,
      saveCover: saveCover,
      saveLogo: saveLogo,
      deleteCover: deleteCover,
      deleteLogo: deleteLogo,
      getCompanyContacts: getCompanyContacts,
      saveAllowingCreateCustomTags: saveAllowingCreateCustomTags,
      getCompanySMTPSettings: getCompanySMTPSettings,
      checkSMTPLoginUnique: checkSMTPLoginUnique,
      getPermissions: getPermissions,
      savePermissions: savePermissions,
      changeRoleName: changeRoleName,
      addNewRole: addNewRole,
      deleteRole: deleteRole,
      getTechRoles: getTechRoles,
      getEmailAlias: getEmailAlias,
      saveEmailAlias: saveEmailAlias,
      getIndustries: getIndustries,
      changeCompanyStatusToActive: changeCompanyStatusToActive,
      isVendorHasProducts: isVendorHasProducts,
      saveInboxEnabled: saveInboxEnabled,
      getCompanyPaymentInfo: getCompanyPaymentInfo,
      saveCompanyPaymentInfo: saveCompanyPaymentInfo,
      changePrimaryContact: changePrimaryContact,
      checkStorageCompanyLength: checkStorageCompanyLength,
      reloadCurrentCompany: reloadCurrentCompany,
      setServiceRate: setServiceRate,
      setCategoryRate: setCategoryRate,
      setAgreementsRate: setAgreementsRate,
      getAgreementsRates: getAgreementsRates,
      setTechLead: setTechLead,
      getReferenceDate: getReferenceDate,
      setReferenceDate: setReferenceDate,
      resetReferenceDate: resetReferenceDate,
      sendEmail: sendEmail,
      updateCompanyTags: updateCompanyTags
    }

  }]);

})(window, jQuery);
