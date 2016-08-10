'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('CompaniesService', ['$http', '$rootScope', 'RealTimeService', 'Utils', '$filter', function ($http, $rootScope, RealTimeService, Utils) {

    var serviceScope = $rootScope.$new(),
      initialized = false,
      initListeners = [],
      amountChangeListeners = [],
      storage = {
        companies: [],
        clientCompanies: [],
        deletedCompanies: [],
        currentCompany: {}
      },
      callbackForArchive,
      callbackForSavedCompanies = {};

    Utils.customizeObj(storage);

    $http.get('/company/clients').then(function (resp) {
        for (var i = 0; i < resp.data.length; i++) {
          var custCompany = Utils.customizeObj(resp.data[i]);
          if (resp.data[i].deletedAt) {
            storage.deletedCompanies.push(custCompany);
          } else {
            storage.clientCompanies.push(custCompany);
            storage.companies.push(custCompany);
          }
        }
        checkInit();
      },
      function (resp) {
        console.error(resp);
        throw 'Cannot initialize CompaniesService!';
      });

    $http.get('/company/current').then(function (resp) {
        Utils.customizeObj(resp.data, storage.currentCompany);
        storage.companies.push(storage.currentCompany);
        checkInit();
      },
      function (resp) {
        console.error(resp);
        throw 'Cannot initialize CompaniesService!';
      });

    var checkInitsCount = 0;

    function checkInit() {
      checkInitsCount++;
      if (checkInitsCount === 2) {
        initialized = true;

        for (var i = 0; i < initListeners.length; i++) {
          initListeners[i]();
        }
      }
    }

    RealTimeService.subscribe('/company', serviceScope, function (newChange) {

      console.log(newChange);

      if (!initialized) {
        return;
      }

      var companyId = newChange.data.id;
      if (newChange.action == 'COMPANY_SAVED') {

        var company = Utils.findById(storage.companies, companyId);

        if (company) {
          Utils.customizeObj(newChange.data, company);
        } else {
          var newClient = Utils.customizeObj(newChange.data);
          storage.companies.push(newClient);
          storage.clientCompanies.push(newClient);

          for (var i = 0; i < amountChangeListeners.length; i++) {
            amountChangeListeners[i]();
          }

          if (callbackForSavedCompanies[companyId]) {
            callbackForSavedCompanies[companyId](companyId);
          }
        }

      } else if (newChange.action == 'COMPANY_ARCHIVED') {
        storage.deletedCompanies.push(Utils.findById(storage.companies, companyId));

        Utils.deleteById(storage.companies, companyId);
        Utils.deleteById(storage.clientCompanies, companyId);

        if (callbackForArchive && (typeof callbackForArchive == 'function')) {
          callbackForArchive(companyId);
        }

        for (var i = 0; i < amountChangeListeners.length; i++) {
          amountChangeListeners[i]();
        }
      } else if (newChange.action == 'COMPANY_DEARCHIVED') {

        var company = Utils.customizeObj(newChange.data);

        storage.clientCompanies.push(company);
        storage.companies.push(company);

        for (var i = 0; i < amountChangeListeners.length; i++) {
          amountChangeListeners[i]();
        }
      }
    });

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

    function getAllCompanies() {
      return storage.companies;
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
      return Utils.findById(storage.companies, companyId) || Utils.findById(storage.deletedCompanies, companyId);
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
      if (!companyId) throw 'companyId is required!';
      $http.get('/company/archive/' + companyId).then(function (resp) {
        callback(resp);
      }, function (resp) {
        callback(resp);
      });
    }

    function dearchive(companyId, callback) {
      if (!companyId) throw 'companyId is required!';
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

      RealTimeService.subscribe('/clientCompaniesInfo', scope, function (newChange) {

        console.log(newChange);

        if (newChange.action == 'CLIENT_COMPANY_INFO') {

          var data = JSON.parse(newChange.data);

          for (var companyId in  data) {
            Utils.defineReadOnlyProperty(info, companyId, Utils.customizeObj(data[companyId]));
          }
        } else if (newChange.action == 'COMPANY_ARCHIVED') {
          delete info[newChange.data.id];

          if (callbackForArchive && (typeof callbackForArchive == 'function')) {
            callbackForArchive(newChange.data.id);
          }
        }
      });

      return info;
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

        console.log(newChange);

        if (newChange.action == 'CLIENT_COMPANY_INFO') {

          var data = JSON.parse(newChange.data);

          for (var key in  data) {
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
          callback(resp.data);
        }

      }, function (resp) {
        if (callback) {
          callback(resp.data);
        }
      });

      RealTimeService.subscribe('/companyDto/' + companyId, scope, function (newChange) {

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

      if (!company.id && callback) {
        future.then(function (resp) {
          var companyId = resp.data.id;
          if (!getOneById(companyId)) {
            callbackForSavedCompanies[companyId] = callback;
          } else {
            callback(resp.data);
          }
        });
      } else {
        Utils.handleCallback(future, callback);
      }
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

    function changeUserAndPass(user, password, id, callback) {

      if (!id) {
        throw 'id is required!'
      }

      var info = Utils.customizeObj({});

      $http.get('/company/' + id + '/changeUserAndPass?userName=' + user + '&password=' + password).then(function (resp) {
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

      $http.get('/company/isCompanyNameUnique?name=' + name + '&id=' + id).then(function (resp) {
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

    function getCompanyContacts(scope, companyId, callback) {

      if (!scope || !scope.$id) {
        throw 'First argument must be Angularjs scope!';
      }
      if (!companyId) {
        throw 'Second argument must be companyId!';
      }

      return Utils.getListByUrl('/company/' + companyId + '/contacts', callback, function (list) {

        RealTimeService.subscribe('/companyContact', scope, function (newChange) {

          console.log(newChange);

          if (newChange.action == 'COMPANY_CONTACT') {
            list.splice(0, list.length);
            Utils.customizeArray(newChange.data, list);
          }
        });

        RealTimeService.subscribe('/subscription/' + companyId, scope, function (newChange) {

          console.log(newChange);

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

    function getCompanySMTPSettings(callback) {
      var future = $http.get('/settings/companyProfile/SMTPSettings');
      Utils.handleCallback(future, callback);
    }

    function checkSMTPLoginUnique(email, callback) {
      var future = $http.get('/settings/companyProfile/SMTPSettings/checkEmailUnique?email=' + email);
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

    return {
      _addInitListener: addInitListener,
      _addAmountChangeListener: _addAmountChangeListener,
      _search: search,
      _isInitialized: isInitialized,
      getCurrentCompany: getCurrentCompany,
      getClientCompanies: getClientCompanies,
      getAllCompanies: getAllCompanies,
      getOneById: getOneById,
      getUnassignedCompany: getUnassignedCompany,
      searchByAllCompanies: searchByAllCompanies,
      searchByClientCompanies: searchByClientCompanies,
      getClientCompaniesInfo: getClientCompaniesInfo,
      getCompanyInfo: getCompanyInfo,
      archive: archive,
      dearchive: dearchive,
      save: save,
      saveForCompanyProfile: saveForCompanyProfile,
      saveCompanySettingsDto: saveCompanySettingsDto,
      getCompanyForSettingPage: getCompanyForSettingPage,
      getCompanyData: getCompanyData,
      isNameUnique: isNameUnique,
      isDomainUnique: isDomainUnique,
      isCompanyInboxUnique: isCompanyInboxUnique,
      changeUserAndPass: changeUserAndPass,
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
      getTechRoles: getTechRoles,
      getEmailAlias: getEmailAlias,
      saveEmailAlias: saveEmailAlias
    }

  }]);

})(window, jQuery);
