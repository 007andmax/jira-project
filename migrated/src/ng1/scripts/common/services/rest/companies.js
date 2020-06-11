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
      glNumbers = [],
      companyPaymentInfo = {};



    Utils.customizeObj(storage);

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
      $rootScope.$broadcast('onInitConpaiesList', null);
    },
      function (resp) {
        console.error(resp);
        throw 'Cannot initialize CompaniesService!';
      });

    function updateCompanyTags(newCompanyTags, companyId) {
      const companyForChangeIndex = storage.companies.findIndex(function (item) {
        return item.id === companyId;
      });
      return storage.companies[companyForChangeIndex].tags = newCompanyTags;
    }

    

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
      setRealTimeGLNumbers(resp.data.id);
    },
      function (resp) {
        throw 'Cannot initialize CompaniesService!';
      });

    $http.get('/glNumber').then(function (resp) {
      glNumbers = resp.data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
        1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
    })
    function getGlNumbers() {
      return angular.copy(glNumbers);
    }
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
    function setRealTimeGLNumbers(id) {

      RealTimeService.subscribe('/glNumber/' + id, serviceScope, function (newChange) {

        if (newChange.action === "GL_NUMBER_SAVED") {
          var index = glNumbers.findIndex(item => item.id === newChange.data.id);
          if (index > -1) {
            glNumbers[index] = newChange.data;
            if (newChange.data.blockTime || newChange.data.serviceContract) {
              glNumbers.forEach((item, indexItem) => {
                if (newChange.data.blockTime && index !== indexItem) {
                  item.blockTime = false;
                }
                if (newChange.data.serviceContract && index !== indexItem) {
                  item.serviceContract = false;
                }
              });
            }
          } else {
            glNumbers.push(newChange.data);
            glNumbers = glNumbers.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
              1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
          }
          $rootScope.$broadcast('setRealTimeGLNumbers', angular.copy(glNumbers));
        }
      })
    }
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
    function parseDateTechCompany(end_date) {
      var dateTechCompany = new Date(end_date).toLocaleString("CA", { timeZone: storage.currentCompany.addresses[0].locale }).replace(",", "").replace(/:.. /, " ");
      var index = dateTechCompany.indexOf(" ");
      var listDates = dateTechCompany.substring(0, index).split("/");
      return new Date(`${listDates[2]} ${listDates[1]} ${listDates[0]} ${dateTechCompany.substring(index + 1, dateTechCompany.length)}`);
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


     

    function getReferenceDate(callback) {
      $http.get('/settings/companyProfile/accountingStartDate')
        .then(function (res) {
          if (callback) callback(res);
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

    function getIndustries(callback) {
      var future = $http.get('/company/getIndustries');
      Utils.handleCallback(future, callback);
    }

   

    function isVendorHasProducts(vendorId, callback) {
      var future = $http.get('/company/' + vendorId + '/isProductExist');
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
      parseDateTechCompany: parseDateTechCompany,
      getGlNumbers: getGlNumbers,
      _addInitListener: addInitListener,
      _addAmountChangeListener: _addAmountChangeListener,
      _search: search,
      _isInitialized: isInitialized,
      getCurrentCompany: getCurrentCompany,
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
      archive: archive,
      save: save,
      getCompanyForSettingPage: getCompanyForSettingPage,
      getCompanyData: getCompanyData,
      getCompanyProfileData: getCompanyProfileData,
      isNameUnique: isNameUnique,
      isDomainUnique: isDomainUnique,
      saveCover: saveCover,
      saveLogo: saveLogo,
      deleteCover: deleteCover,
      deleteLogo: deleteLogo,
      getIndustries: getIndustries,
      isVendorHasProducts: isVendorHasProducts,
      getCompanyPaymentInfo: getCompanyPaymentInfo,
      changePrimaryContact: changePrimaryContact,
      checkStorageCompanyLength: checkStorageCompanyLength,
      reloadCurrentCompany: reloadCurrentCompany,
      getReferenceDate: getReferenceDate,
      sendEmail: sendEmail,
      updateCompanyTags: updateCompanyTags
    }

  }]);

})(window, jQuery);
