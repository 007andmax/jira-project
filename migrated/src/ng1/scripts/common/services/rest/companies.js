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
      if (checkInitsCount === 2) {
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











    function isInitialized() {
      return initialized;
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
      saveLogo: saveLogo,
      deleteLogo: deleteLogo,
      checkStorageCompanyLength: checkStorageCompanyLength,
      sendEmail: sendEmail,
      updateCompanyTags: updateCompanyTags
    }

  }]);

})(window, jQuery);
