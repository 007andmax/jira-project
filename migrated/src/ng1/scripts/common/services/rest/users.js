'use strict';

/* Services */

(function (window, $, undefined) {

  var services = angular.module('main.services');

  services.factory('UsersService', ['$http', '$rootScope', 'RealTimeService', 'Utils', 'CompaniesService',
    function ($http, $rootScope, RealTimeService, Utils, CompaniesService) {

      var serviceScope = $rootScope.$new(),
        initListeners = [],
        initialized = true,
        initializingStarted = false,
        storage = {
          users: [],
          clientUsers: [],
          deleted: [],
          usersByCompanies: {}
        };
      Utils.customizeObj(storage);


  //    CompaniesService._addInitListener(init);


      
      

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
          if (s == null) return  '';
          return s.charAt(0).toUpperCase();
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

      function changeTimePickerType(type,interval) {
        $http.put('/settings/companyProfile/serviceExpenseDurationPresentation', { presentation: type ,interval:interval }).then(function (resp) {
          if (status === 200) {
            $rootScope.currentUser.serviceExpenseDurationPresentation = type;
          }
        });
      }


      return {
        _addInitListener: addInitListener,
        getCurrentUser: getCurrentUser,
        getAllUsers: getAllUsers,
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
        saveForUserProfile: saveForUserProfile,
        archiveUser: archiveUser,
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
