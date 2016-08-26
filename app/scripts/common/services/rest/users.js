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
              if (!user.company.deletedAt && !user.deletedAt) {
                if (!storage.usersByCompanies[user.company.id]) {
                  storage.usersByCompanies[user.company.id] = [];
                }
                storage.usersByCompanies[user.company.id].push(user);
              }
              var oneByIdIncludeDeleted = CompaniesService.getOneById(user.company.id);
              if (user.company.id !== CompaniesService.getCurrentCompany().id && (oneByIdIncludeDeleted && !oneByIdIncludeDeleted.deletedAt)) {
                storage.clientUsers.push(user);
              } else if (oneByIdIncludeDeleted && oneByIdIncludeDeleted.deletedAt) {
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
          if (newChange.action == 'USER_SAVED') {

            if (getCurrentUser().id === newChange.data.id) {
              window.startPage = newChange.data.startPage;
            }

            if (newChange.data.company.id !== getCurrentUser().company.id) {
              addOrUpdateClientUser(newChange.data);
            } else {
              var findById = Utils.findById(storage.usersByCompanies[newChange.data.company.id], newChange.data.id);
              if (findById) {
                Utils.customizeObj(newChange.data, findById);
              } else {
                storage.usersByCompanies[newChange.data.company.id].push(Utils.customizeObj(newChange.data));
                storage.users.push(Utils.customizeObj(newChange.data));
              }
            }
          } else if (newChange.action == 'USER_DELETED') {
            var user = Utils.findById(storage.users, newChange.data.id);
            storage.deleted.push(user);
            Utils.deleteById(storage.users, newChange.data.id);
            Utils.deleteById(storage.clientUsers, newChange.data.id);
            if (user) {
              Utils.deleteById(storage.usersByCompanies[user.company.id], newChange.data.id);
            }
          } else if (newChange.action == 'USER_ONLINE') {
            var user = Utils.findById(storage.users, newChange.data.id);
            if (user) {
              Utils.defineReadOnlyProperty(user, 'online', !!newChange.data.online);
            }
          } else if (newChange.action == 'COMPANY_ARCHIVED') {
            for (var i = 0; i < storage.users.length; i++) {
              if (storage.users[i].company.id === newChange.data.id) {
                storage.deleted.push(storage.users[i]);
                storage.users.splice(i, 1);
                i--;
              }
            }
            for (var i = 0; i < storage.clientUsers.length; i++) {
              if (storage.clientUsers[i].company.id === newChange.data.id) {
                storage.clientUsers.splice(i, 1);
                i--;
              }
            }
            delete storage.usersByCompanies[newChange.data.id];
          } else if (newChange.action == 'USERS_DEARCHIVED') {
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

      }

      function addOrUpdateClientUser(updUser) {
        var user = Utils.findById(storage.users, updUser.id);

        if (user) {
          Utils.customizeObj(updUser, user);
          if ($rootScope.currentUser.id === user.id) {
            Utils.customizeObj(updUser, $rootScope.currentUser);
          }
        } else {
          var newUser = Utils.customizeObj(updUser);
          storage.users.push(newUser);
          //todo check company
          if (newUser.company.id !== CompaniesService.getCurrentCompany().id) {
            storage.clientUsers.push(newUser);
          }

          generateInitials(newUser);

          if (!storage.usersByCompanies[newUser.company.id]) {
            storage.usersByCompanies[newUser.company.id] = [];
          }

          storage.usersByCompanies[newUser.company.id].push(newUser);
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
        return getOneById($rootScope.currentUser.id);
      }

      function getAllByCompanyId(companyId) {
        return storage.usersByCompanies[companyId] || [];
      }

      function getTechUsers() {
        if (!$rootScope.currentUser) {
          return [];
        }

        return storage.usersByCompanies[$rootScope.currentUser.company.id] || [];
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

      function save(user, callback) {

        if (!user) {
          throw 'user is required!';
        }

        var url = '/users',
          method = 'POST';

        if (user.id) {
          method = 'PUT';
          url = url + '/' + user.id;

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

        if (!data) {
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

      function isEmailUnique(email, id, isTechUser, callback) {

        if (!email) {
          throw 'email is required!'
        }

        var info = Utils.customizeObj({});

        $http.get('/users/isEmailUnique?email=' + email + '&id=' + id + '&isTechUser=' + isTechUser).then(function (resp) {
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

      function deleteOrArchiveUser(ids, isArchive, callback) {

        if (!ids) {
          throw 'ids is required!';
        }

        if (isArchive === undefined) {
          throw 'isArchive is required!';
        }

        if (!Array.isArray(ids)) {
          ids = [ids];
        }

        if (getOneById(ids[0]).accountType !== 'TECH') {
          var errorMessage = isArchiveUsersAllowed(ids);

          if (errorMessage) {
            throw errorMessage;
          }
        }

        var future = $http({
          url: '/users/' + !!isArchive,
          method: 'POST',
          data: ids
        });

        Utils.handleCallback(future, callback);
      }

      function deleteAvatar(userId, callback) {

        if (!userId) {
          throw 'companyId is required!';
        }

        var future = $http({
          url: '/users/' + userId + '/',
          method: 'DELETE'
        });

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

      function toggle2FA(isEnabled, callback) {
        var future = $http.post('/users/twoFactorAuth?enable=' + isEnabled, {});
        Utils.handleCallback(future, callback);
      }

      return {
        _addInitListener: addInitListener,
        getCurrentUser: getCurrentUser,
        getAllUsers: getAllUsers,
        getClientUsers: getClientUsers,
        getTechUsers: getTechUsers,
        getAllByCompanyId: getAllByCompanyId,
        getOneById: getOneById,
        getUserProfile: getUserProfile,
        getUnassignedUser: getUnassignedUser,
        searchByAllUsers: searchByAllUsers,
        searchByClientUsers: searchByClientUsers,
        searchByUsersFromCompany: searchByUsersFromCompany,
        changeUserRole: changeUserRole,
        changeUsersRoles: changeUsersRoles,
        save: save,
        saveUserSettingsDto: saveUserSettingsDto,
        saveForUserProfile: saveForUserProfile,
        deleteOrArchiveUser: deleteOrArchiveUser,
        isEmailUnique: isEmailUnique,
        deleteAvatar: deleteAvatar,
        getActivityHistory: getActivityHistory,
        closeSessions: closeSessions,
        toggle2FA: toggle2FA,
        get2FA: get2FA
      }

    }]);

})(window, jQuery);
