'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('UsersService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {

      var serviceScope = $rootScope.$new(),
        initListeners = [],
        initialized = false,
        initializingStarted = false,
        storage = {
          users: [],
          clientUsers: [],
          deleted: [],
          usersByCompanies: {}
        };
      Utils.customizeObj(storage);


      CompaniesService._addInitListener(init);


      function reinitUsers(callback) {
        $http.get('/users').then(function (resp) {
            Utils.customizeArray(resp.data, storage.users);
            for (var i = 0; i < storage.users.length; i++) {
              var user = storage.users[i];
              generateInitials(user);
              if (!storage.usersByCompanies[user.company.id]) {
                storage.usersByCompanies[user.company.id] = [];
              }
              storage.usersByCompanies[user.company.id].push(user);
              var oneByIdIncludeDeleted = CompaniesService.getOneById(user.company.id);
              var isDeleted = (oneByIdIncludeDeleted && oneByIdIncludeDeleted.deletedAt) || user.deletedAt;
              if (user.company.id !== CompaniesService.getCurrentCompany().id && !isDeleted && !user.isDefault) {
                storage.clientUsers.push(user);
              } else if (isDeleted) {
                storage.deleted.push(user);
              }
            }
            initialized = true;
            for (var i = 0; i < initListeners.length; i++) {
              initListeners[i]();
            }
            initListeners = [];

            if (callback) {
              callback(resp)
            }
          },
          function (resp) {
            console.error(resp);
            throw 'Cannot initialize CompaniesService!';
          });
      }

      function init() {

        if (initializingStarted) {
          return;
        }

        initializingStarted = true;

        $http.get('/users').then(function (resp) {
            Utils.customizeArray(resp.data, storage.users);
            for (var i = 0; i < storage.users.length; i++) {
              var user = storage.users[i];
              generateInitials(user);
              if (!storage.usersByCompanies[user.company.id]) {
                storage.usersByCompanies[user.company.id] = [];
              }
              storage.usersByCompanies[user.company.id].push(user);
              var oneByIdIncludeDeleted = CompaniesService.getOneById(user.company.id);
              var isDeleted = (oneByIdIncludeDeleted && oneByIdIncludeDeleted.deletedAt) || user.deletedAt;
              if (user.company.id !== CompaniesService.getCurrentCompany().id && !isDeleted && !user.isDefault) {
                storage.clientUsers.push(user);
              } else if (isDeleted) {
                storage.deleted.push(user);
              }
            }
            initialized = true;
            for (var i = 0; i < initListeners.length; i++) {
              initListeners[i]();
            }
            initListeners = [];
          },
          function (resp) {
            console.error(resp);
            throw 'Cannot initialize CompaniesService!';
          });

        RealTimeService.subscribe('/user', serviceScope, function (newChange) {

          if (!initialized) {
            return;
          }
          if (newChange.action === 'USER_SAVED') {

            var currentUser = getCurrentUser();
            if (currentUser.id === newChange.data.id) {
              var permissions = currentUser.permissions;
              Utils.customizeObj(newChange.data, currentUser);
              currentUser.permissions = permissions;
              return;
            }

            if (newChange.data.company.id !== currentUser.company.id) {
              addOrUpdateClientUser(newChange.data);
            } else {
              var techUser = Utils.findById(storage.usersByCompanies[newChange.data.company.id], newChange.data.id);

              if (techUser) {
                Utils.customizeObj(newChange.data, techUser);
              } else {
                storage.usersByCompanies[newChange.data.company.id] = storage.usersByCompanies[newChange.data.company.id] || [];
                storage.usersByCompanies[newChange.data.company.id].push(Utils.customizeObj(newChange.data));
                Utils.deleteById(storage.deleted, newChange.data.id);
                storage.users.push(Utils.customizeObj(newChange.data));
              }
            }
          } else if (newChange.action === 'USER_ARCHIVED') {
            var user = Utils.findById(storage.deleted, newChange.data.id);
            if (user) {
              Utils.customizeObj(newChange.data, user);
            } else {
              user = Utils.findById(storage.users, newChange.data.id);
              if (user) {
                Utils.customizeObj(newChange.data, user);
              }
              storage.deleted.push(newChange.data);
            }
            Utils.deleteById(storage.users, newChange.data.id);
            Utils.deleteById(storage.clientUsers, newChange.data.id);
            // if (storage.usersByCompanies[newChange.data.company.id]) {
            //   Utils.deleteById(storage.usersByCompanies[newChange.data.company.id], newChange.data.id);
            // }
          } else if (newChange.action === 'USER_ONLINE') {
            var user = Utils.findById(storage.users, newChange.data.id);
            if (user) {
              Utils.defineReadOnlyProperty(user, 'online', !!newChange.data.online);
            }
          } else if (newChange.action === 'COMPANY_ARCHIVED') {
            for (var i = 0; i < storage.users.length; i++) {
              var user = storage.users[i];
              if (user.company.id === newChange.data.id) {
                var archivedUser = Utils.findById(storage.deleted, user.id);
                if (!archivedUser) {
                  user.deletedAt = Date.now();
                  storage.deleted.push(user);
                }
                storage.users.splice(i, 1);
                storage.clientUsers.splice(storage.clientUsers.indexOf(user), 1);
                i--;
              }
            }
            // delete storage.usersByCompanies[newChange.data.id];
          } else if (newChange.action === 'USERS_DEARCHIVED') {
            newChange.data.forEach(addOrUpdateClientUser);
          }
        });

        RealTimeService.subscribe('/userSubmittedTicket', serviceScope, function (newChange) {

          if (newChange.action === 'USER_SUBMITTED_TICKET') {
            var user = getOneById(newChange.data);

            var prevValue = user.userStatistic.ticketsSubmitted || 0;
            Utils.defineReadOnlyProperty(user.userStatistic, 'ticketsSubmitted', prevValue + 1);
          }
        });

        RealTimeService.subscribe('/subscription/' + CompaniesService.getCurrentCompany().id, serviceScope, function (newChange) {

          if (!newChange.data.user) {
            return;
          }

          var user = Utils.findById(storage.users, newChange.data.user.id);

          if (user) {

            if (newChange.action == 'SUBSCRIPTION_SAVED') {
              Utils.defineReadOnlyProperty(user, 'subscription', Utils.customizeObj(newChange.data));
            } else if (newChange.action == 'SUBSCRIPTION_DELETED') {
              delete user.subscription;
            }
          }
        });

        RealTimeService.subscribe('/lockScreen/' + getCookie('LOCK_SCREEN_ID'), serviceScope, function (newChange) {
          if (newChange.action === 'LOCK_SCREEN' && !$rootScope.isUnlockShowed) {
            $rootScope.showLockModal();
          }
        });
      }

      function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }

      function addOrUpdateClientUser(updUser) {
        var user = Utils.findById(storage.users, updUser.id);
        Utils.deleteById(storage.deleted, updUser.id);

        if (user) {
          Utils.customizeObj(updUser, user);
          if ($rootScope.currentUser.id === user.id) {
            Utils.customizeObj(updUser, $rootScope.currentUser);
          }
        } else {
          var newUser = Utils.customizeObj(updUser);
          storage.users.push(newUser);
          if (newUser.company.id !== CompaniesService.getCurrentCompany().id) {
            storage.clientUsers.push(newUser);
          }

          generateInitials(newUser);

          if (!storage.usersByCompanies[newUser.company.id]) {
            storage.usersByCompanies[newUser.company.id] = [];
          }

          var userFromByCompanyStorage = Utils.findById(storage.usersByCompanies[newUser.company.id], newUser.id);
          if (!userFromByCompanyStorage) {
            storage.usersByCompanies[newUser.company.id].push(newUser);
          } else {
            Utils.customizeObj(newUser, userFromByCompanyStorage);
          }
        }
      }

      function addInitListener(callback) {
        if (!callback) {
          throw "callback is required!"
        }

        if (initialized) {
          callback();
        } else {
          initListeners.push(callback);
        }

      }

      function generateInitials(user) {
        var initials = [user.firstName, user.lastName].map(function (s) {
          if (s !== null)  return s.charAt(0).toUpperCase();
         
        }).join('');
        Utils.defineReadOnlyProperty(user, 'initials', initials);
      }

      function getAllUsers() {
        return storage.users;
      }

      function getClientUsers() {
        return storage.clientUsers;
      }

      function getCurrentUser() {
        if (!$rootScope.currentUser) {
          return {};
        }
        return $rootScope.currentUser;
      }

      function getAllByCompanyId(companyId) {
        return storage.usersByCompanies[companyId] || [];
      }

      function getAllByCompanyIdNonArchived(companyId) {
        var companyUsers =  storage.usersByCompanies[companyId] || [];
        var nonArchivedUsers = [];
        if(companyUsers.length > 0) {
          for(var i=0; i<companyUsers.length; i++) {
            if(!companyUsers[i].deletedAt) {
              nonArchivedUsers.push(companyUsers[i]);
            }
          }
        }
        return nonArchivedUsers;
      }

      function getTechUsers() {
        if (!$rootScope.currentUser) {
          return [];
        }

        return storage.usersByCompanies[$rootScope.currentUser.company.id] || [];
      }

      function resendWelcomeEmail(email, callback) {
        $http.post('/resend/verifyUserEmail', {
          "email": email
        }).then(function(resp) {
          if (callback) {
            callback(resp);
          }
        })
      }

      function setGridPresentation(data) {
        var translate = {
          'list': 'LIST',
          'grid': 'TILE'
        }
        var currentUser = getCurrentUser();
        var users = translate[data.users];
        var companies = translate[data.companies];

        currentUser.usersGridPresentation = users ? users : currentUser.usersGridPresentation;
        currentUser.companiesGridPresentation = companies ? companies : currentUser.companiesGridPresentation;


        var future = $http({
          url: '/settings/userProfile/gridPresentation',
          method: 'PUT',
          data: {
            "usersGridPresentation": translate[data.users] || null,
            "companiesGridPresentation": translate[data.companies] || null
          }
        })


        Utils.handleCallback(future)
      }

      function getTechUsersEmailNotification(listOfTechUsers, callback) {
        var future = $http({
          url: '/settings/userProfile/getUsersEmailNotifications',
          method: 'POST',
          data: listOfTechUsers
        });
        Utils.handleCallback(future, callback)
      }

      function saveUsersEmailNotification(userId, data, callback) {
        var future = $http({
          method: 'PUT',
          url: '/settings/userProfile/saveUsersEmailNotifications?userId='+userId,
          data: data
        });
        Utils.handleCallback(future, callback)
      }

      function getArchivedUsers() {
        return storage.deleted;
      }

      function getOneById(userId) {
        return Utils.findById(storage.users, userId) || Utils.findById(storage.deleted, userId);
      }

      function getUnassignedUser(companyId) {
        var unassignedCompanyUsers = storage.usersByCompanies[companyId];
        for (var i = 0; i < unassignedCompanyUsers.length; i++) {
          if (unassignedCompanyUsers[i].isDefault) {
            return unassignedCompanyUsers[i];
          }
        }
      }

      function searchByAllUsers(keyword) {
        return search(keyword, true)
      }

      function searchByClientUsers(keyword) {
        return search(keyword, false)
      }

      function searchByUsersFromCompany(keyword, companyId) {
        return search(keyword, false, companyId)
      }

      function search(keyword, includeCurrentCompany, companyId) {

        if (!keyword) {
          throw 'Keyword is required!'
        }

        var searchUsers,
          searchResult = [],
          keywordLowerCase = keyword.toLowerCase();

        if (companyId) {
          searchUsers = storage.usersByCompanies[companyId] || [];
        } else {
          searchUsers = storage.users;
        }

        for (var i = 0; i < searchUsers.length; i++) {

          var user = searchUsers[i];
          if (!includeCurrentCompany && getCurrentUser().company.id === user.company.id) {
            continue;
          }

          if ((user.firstName + ' ' + user.lastName).toLowerCase().indexOf(keywordLowerCase) > -1) {
            searchResult.push(user);
          }
        }

        return searchResult;
      }

      function changeUserRole(userId, roleName, callback) {

        if (!userId) {
          throw 'userId is required!'
        }

        if (!roleName) {
          throw 'roleName is required!'
        }

        var future = $http({
          url: '/users/updateRole/' + userId + '?role=' + roleName.toUpperCase(),
          method: 'PUT'
        });

        Utils.handleCallback(future, callback);
      }

      function changeUsersRoles(userIds, role, callback) {

        if (!userIds) {
          throw 'userIds is required!'
        }
        if (role.toLowerCase() !== 'admin' && role.toLowerCase() !== 'user') {
          throw 'role is required and must be admin or user!'
        }

        var future = $http({
          url: '/users/updateRoles?role=' + role,
          method: 'PUT',
          data: userIds
        });

        Utils.handleCallback(future, callback);
      }

      function save(user, callback, addSubscription) {

        if (!user) {
          throw 'user is required!';
        }

        var url = '/users',
          method = 'POST';

        if (user.id) {
          method = 'PUT';
          url = url + '/' + user.id;

        }

        if (addSubscription && !user.subscription) {
          user.subscription = {id: null, invoice: null, ticket: null, ticketManager: null}
        }

        var future = $http({
          url: url,
          method: method,
          data: user
        });

        Utils.handleCallback(future, callback);
      }

      function saveUserSettingsDto(userDto, callback) {

        if (!userDto) {
          throw 'userDto is required!';
        }

        var future = $http({
          url: '/settings/userProfile/',
          method: 'PUT',
          data: userDto
        });

        Utils.handleCallback(future, callback);
      }

      function saveForUserProfile(data, toUpdate, callback) {

        if (!data && data !== false) {
          throw 'data is required!';
        }
        if (!toUpdate) {
          throw 'toUpdate is required!';
        }

        var url = '/settings/userProfile/' + toUpdate.toLowerCase(),
          method = 'PUT';

        var future = $http({
          url: url,
          method: method,
          data: data
        });
        Utils.handleCallback(future, callback);
      }

      function getUserProfile(callback) {

        var info = {};

        $http.get('/settings/userProfile/').then(function (resp) {
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

      function getUserEmailNotifications(callback) {

        var info = {};

        $http.get('/settings/userProfile/emailNotifications').then(function (resp) {
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

      function isEmailUnique(email, id, isTechUser, companyId, callback) {

        if (!email) {
          throw 'email is required!'
        }

        var isCompanyId = (typeof companyId === 'function' ? false : companyId);

        if (!isCompanyId && !callback) {
          callback = companyId;
        }

        var info = Utils.customizeObj({});
        var url = '/users/isEmailUnique?email=' + email + '&id=' + id + '&isTechUser=' + isTechUser;

        if (isCompanyId) {
          url += '&companyId=' + isCompanyId;
        }

        $http.get(url).then(function (resp) {
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

      function archiveUser(ids, callback) {
        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        if (getOneById(ids[0]).accountType !== 'TECH') {
          var errorMessage = isArchiveUsersAllowed(ids);

          if (errorMessage) {
            throw errorMessage;
          }
        }

        var future = $http.post('/users/archive', { ids: ids });
        Utils.handleCallback(future, callback);
      }

      function dearchiveUser(ids, callback) {
        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        var future = $http.post('/users/dearchive', { ids: ids });
        Utils.handleCallback(future, callback);
      }

      function deleteAvatar(userId, callback) {
        var future = $http({
          url: '/users/' + userId + '/avatar',
          method: 'DELETE'
        });

        Utils.handleCallback(future, callback);
      }

      function saveAvatar(model, userId, callback) {
        var future = $http.post('/users/' + userId + '/avatar', model);
        Utils.handleCallback(future, callback);
      }

      function isArchiveUsersAllowed(ids) {
        var companyId = getOneById(ids[0]).company.id,
          users = storage.usersByCompanies[companyId],
          errorMessage = '';

        var isAllUsersSelected = ids.length === users.length;

        var isPrimaryContactSelected = ids.filter(function (id) {
          return getOneById(id).isContact;
        }).length;

        var isAllWithInvoiceSubscriptionSelected =
          users.filter(function (user) {
            return user.subscription.invoice;
          }).length === ids.filter(function (id) {
            return getOneById(id).subscription.invoice;
          }).length;

        if (isAllUsersSelected) {
          errorMessage = 'U can\'t archive all users. At least one must remain.';
        } else if (isPrimaryContactSelected) {
          errorMessage = 'U can\'t archive primary contact.';
        } else if (isAllWithInvoiceSubscriptionSelected) {
          errorMessage = 'U can\'t archive all user with invoice subscription. At least one must remain.';
        }

        return errorMessage;
      }

      function getActivityHistory(callback) {
        var future = $http.get('/settings/userProfile/device');
        Utils.handleCallback(future, callback);
      }

      function closeSessions(ids, callback) {
        var future = $http.post('/settings/userProfile/device', ids);
        Utils.handleCallback(future, callback);
      }

      function get2FA(callback) {
        var future = $http.get('/users/twoFactorAuth');
        Utils.handleCallback(future, callback);
      }

      function toggle2FA(type, callback) {
        var future = $http.post('/users/twoFactorAuth?type=' + type, {});
        Utils.handleCallback(future, callback);
      }

      function deactivateAccount(note) {
        $http.post('/users/deactivate', { note: note });
      }

      function restoreUser(userId, callback) {
        var future = $http.post('/users/restore', { userId: userId });
        Utils.handleCallback(future, callback);
      }

      function requestToChangePassword(userId, callback) {
        var future = $http.post('/users/changePasswordRequest', { userId: userId });
        Utils.handleCallback(future, callback);
      }

      function updateWelcomeWizard(state, dontShowThisAgain) {
        var dto = $rootScope.currentUser.wizardTracker || {};
        switch (state.split('.').pop()) {
          case 'techUsers':
            dto.addStaff = true;
            break;
          case 'email':
            dto.emailSettings = true;
            break;
          case 'taxes':
            dto.rates = true;
            break;
          case 'companyProfile':
            dto.companySettings = true;
            break;
          case 'setupClient':
            dto.setupClient = true;
            break;
        }

        $http.put('/settings/userProfile/updateWizard' + (dontShowThisAgain ? '?dontShowThisAgain=' + dontShowThisAgain : ''), dto);
      }

      function changePassword(oldPass, newPass, callback) {
        $http.post('/resetPassword', { oldPass: hex_md5(oldPass), newPass: hex_md5(newPass) }).then(function (resp) {
          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp);
          }
        });
      }

      function changeTimePickerType(type) {
        $http.put('/settings/userProfile/serviceExpenseDurationPresentation', { presentation: type  }).then(function (resp) {
          if (status === 200) {
            $rootScope.currentUser.serviceExpenseDurationPresentation = type;
          }
        });
      }


      return {
        _addInitListener: addInitListener,
        getCurrentUser: getCurrentUser,
        getAllUsers: getAllUsers,
        reinitUsers: reinitUsers,
        getClientUsers: getClientUsers,
        getTechUsers: getTechUsers,
        getTechUsersEmailNotification: getTechUsersEmailNotification,
        saveUsersEmailNotification: saveUsersEmailNotification,
        getArchivedUsers: getArchivedUsers,
        getAllByCompanyId: getAllByCompanyId,
        getAllByCompanyIdNonArchived: getAllByCompanyIdNonArchived,
        getOneById: getOneById,
        getUserProfile: getUserProfile,
        getUserEmailNotifications: getUserEmailNotifications,
        getUnassignedUser: getUnassignedUser,
        searchByAllUsers: searchByAllUsers,
        searchByClientUsers: searchByClientUsers,
        searchByUsersFromCompany: searchByUsersFromCompany,
        changeUserRole: changeUserRole,
        changeUsersRoles: changeUsersRoles,
        save: save,
        saveUserSettingsDto: saveUserSettingsDto,
        setGridPresentation: setGridPresentation,
        saveForUserProfile: saveForUserProfile,
        archiveUser: archiveUser,
        dearchiveUser: dearchiveUser,
        isEmailUnique: isEmailUnique,
        deleteAvatar: deleteAvatar,
        saveAvatar: saveAvatar,
        getActivityHistory: getActivityHistory,
        closeSessions: closeSessions,
        toggle2FA: toggle2FA,
        get2FA: get2FA,
        deactivateAccount: deactivateAccount,
        restoreUser: restoreUser,
        requestToChangePassword: requestToChangePassword,
        updateWelcomeWizard: updateWelcomeWizard,
        changePassword: changePassword,
        resendWelcomeEmail: resendWelcomeEmail,
        changeTimePickerType: changeTimePickerType
      }

    }]);

})(window, jQuery);
