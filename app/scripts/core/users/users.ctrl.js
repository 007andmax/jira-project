'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', '$rootScope', 'UsersService', 'SubscriptionsService', 'CompaniesService', '$timeout',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService', '$state',
      'localStorageService', 'ColorsService', 'TagsService', '$filter',
      function ($scope, $rootScope, UsersService, SubscriptionsService, CompaniesService, $timeout,
                SharedStateService, PermissionsService, $state, localStorageService, ColorsService, TagsService, $filter) {

        if (!PermissionsService.isAllowed('VIEW_USERS')) {
          $state.go('tickets');
        }

        var headerSharedState = SharedStateService.getSharedState('usersHeader');
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var availableViews = ['list', 'grid'];

        $scope.usersCtrl = {};

        $scope.currentUser = UsersService.getCurrentUser();

        $scope.usersView = $scope.currentUser.usersGridPresentation ?
                             $scope.currentUser.usersGridPresentation === 'LIST' ?
                               'list' :
                               'grid'
                             :
                             'grid';
        $scope.orderUsers = {
          field: 'name',
          reverse: false
        };


        $scope.$watch(function() {
          return window.innerWidth;
        }, function(val) {
          if (val <= 414) {
            $scope.usersView = 'list';
          } else {
            $scope.usersView = $scope.currentUser.usersGridPresentation ?
                                 $scope.currentUser.usersGridPresentation === 'LIST' ?
                                   'list' :
                                   'grid'
                                 :
                                 'grid';
          }
        })

        $scope.userRoles = {
          USER: 'Standard user',
          ADMIN: 'Manager'
        };

        if ($rootScope.exampleCompanyDeleted && $scope.users) {
          $scope.users = $scope.users.filter(function(user) {
            return user.company.id !== $rootScope.exampleCompanyDeleted;
          })
        }

        $scope.$watch(function() {
          return $rootScope.exampleCompanyDeleted
        }, function(val) {
          if (val) {
            $scope.users = $scope.users.filter(function(user) {
              return user.company.id !== val;
            })
          }
        })



        $scope.PermissionsService = PermissionsService;
        $scope.users = UsersService.getClientUsers();
        $scope.archivedUsers = UsersService.getArchivedUsers();

        $scope.tagColors = TagsService.getColors();

        ColorsService.getUserColors($scope, function(resp) {
          $scope.usersColors = resp;
        });

        $scope.changeView = function (view) {
          if (availableViews.indexOf(view) !== -1) {
            $scope.usersView = view;

            UsersService.setGridPresentation({ users: view });
            // localStorageService.set('users-view', view);
          }
        };

        $scope.$watch('usersCtrl.shownUsers.length', function (usersCount) {
          globalSearch.count = usersCount;
        });

        $scope.getUserCompanyName = function (user) {
          return user.company.isDefault ? '' : CompaniesService.getOneById(user.company.id).name;
        };

        $scope.getUserType = function(user) {
          var filter = headerSharedState.filter;
          if(user.role === 'ADMIN') {
            return 'MANAGER';
          }else if(user.role === 'USER'){
            // var company = CompaniesService.getOneById(user.company.id);
            // var type = company.clientType;
            // return type;
            return 'CLIENT'
          } else if(user.isContact) {
            return 'MANAGER'
          } else {
            return 'CLIENT'
          }

        };

        $scope.newSort = function(arr) {
          if ($scope.orderUsers.field !== 'email') {
            return $filter('orderBy')(arr, $scope.orderByForUsers, $scope.orderUsers.reverse)
          } else {
            var sorted = arr.slice();
            var reverse = $scope.orderUsers.reverse;
            var empty = [];
            var toSort = sorted
              .reduce(function(acc, el) {
                if (!el.primaryEmail && !el.secondaryEmail) {
                  empty.push(el);
                } else {
                  acc.push(el);
                }

                return acc;
              }, [])
              .sort(function(a,b) {
                var first = reverse ? b : a;
                var second = reverse ? a : b;

                var first = first.primaryEmail || first.secondaryEmail || '';
                var second = second.primaryEmail || second.secondaryEmail || '';

                return first.localeCompare(second);
              });


            for (var i = 0; i < toSort.length; i++) {
              empty.push(toSort[i]);
            }


            return empty;



          }
        }

        $scope.newFilter = function(arr) {
          return arr.filter(function(value) {

          })
        }


        $scope.usersFilter = function (value) {
          var filter = headerSharedState.filter;
          var company = CompaniesService.getOneById(value.company.id);
          var clientType = company.clientType;
          var isUserDeleted = value.deletedAt || company.deletedAt;

          var results = [];
          var result = !isUserDeleted && !$rootScope.showArchivedUsers || $rootScope.showArchivedUsers && isUserDeleted;
          var logs = [];
          results.push(result);

          if (value.isDefault || value.default || value.accountType === 'TECH') {
            return false;
          }

          if (filter.userId) {
            // result = result && filter.userId === value.id;
            results.push(filter.userId === value.id);
            logs.push('userid')
          }

          if (filter.companyId) {
            // result = result && filter.companyId === value.company.id;
            results.push(filter.companyId === value.company.id);
            logs.push('companyid')
          }

          if (filter.isContact) {
            //result = result && value.isContact;
            // result = result && $scope.getUserType(value) === 'MANAGER';
            results.push(value.isContact && $scope.getUserType(value) === 'MANAGER');
            logs.push('iscontact')
          }

          if(filter.isStandard) {
            // result = result && $scope.getUserType(value) === 'CLIENT';
            results.push($scope.getUserType(value) === 'CLIENT');
            logs.push('issstandart')
          }

          if (filter.isLead) {
            // result = result && clientType && clientType.toLowerCase() === 'lead';
            results.push(clientType && clientType.toLowerCase() === 'lead');
            logs.push('islead')
          }

          if (filter.isClient) {
            // result = result && clientType && clientType.toLowerCase() === 'client';
            results.push(clientType && clientType.toLowerCase() === 'client');

            logs.push('isclient')
          }

          if (filter.designation) {
            logs.push('designation')
            // result = (filter.designation || '').toLowerCase() === (value.designation || '').toLowerCase();
            // console.log((filter.designation || '').toLowerCase() === (value.designation || '').toLowerCase(), filter.designation, value.designation)
            results.push((filter.designation || '').toLowerCase() === (value.designation || '').toLowerCase());
          }

          // if(filter.isArchived) {
          //   result = result && !value.userEnabled;
          //   console.log(result && !value.userEnabled);
          // }

          if (filter.industry) {
            logs.push('industry')
            var industryName = company.clientIndustry ? (company.clientIndustry.name || '') : '';
            // result = result && industryName.toLowerCase() === filter.industry.toLowerCase();
            results.push(industryName.toLowerCase() === filter.industry.toLowerCase());
          }

          if (result && results.every(function(el) { return !!el })) {
            // console.log(results, 'results')
          }

          if (value.designation && value.designation.toLowerCase() === 'admin') {
            // console.log(results, value.designation, logs)
          }


          return results.every(function(el) { return !!el });
        };

        $scope.getUserName = function (user) {
          return user.firstName + ' ' + user.lastName;
        };

        $scope.$on('$destroy', function () {
          headerSharedState.filter = {};
        });

        $scope.changeUserRole = function (userId, userRole) {
          UsersService.changeUserRole(userId, userRole);
        };

        $scope.subscribeUser = function (user, nameSubscription) {
          if ($scope.disabledCheckbox || (nameSubscription === 'invoice' && $scope.isLastUserWithInvoiceSubscription(user))) {
            return;
          }

          $scope.disabledCheckbox = true;

          var subscription = user.subscription;

          if (subscription) {
            subscription = subscription.staticCopy()
          } else {
            subscription = {
              user: { id: user.id }
            }
          }

          subscription[nameSubscription] = !subscription[nameSubscription];
          SubscriptionsService.saveUserSubscription(subscription, function () {
            $scope.disabledCheckbox = false;
          });
        };

        $scope.goToUserTickets = function (user) {
          globalSearch.searchValue = '';
          $timeout(function () {
            $state.go('tickets', { listType: 'all' }).then(function () {
              $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');
              $scope.sharedState.searchFilter.companyId = '';
              $scope.sharedState.searchFilter.userId = user.id;
              globalSearch.preventClearing = true;
              globalSearch.searchValue = $scope.getUserName(user);
            });
          });
        };

        $scope.setOrderByUsers = function (option) {
          if (option === $scope.orderUsers.field) {
            $scope.orderUsers.reverse = !$scope.orderUsers.reverse;
          } else {
            $scope.orderUsers.field = option;
            $scope.orderUsers.reverse = false;
          }
        };

        $scope.orderByForUsers = function (item) {
          if ($scope.orderUsers.field === 'name') {
            return item.firstName + ' ' + item.lastName;
          } else if ($scope.orderUsers.field === 'type') {
            return item.role || '';
          } else if ($scope.orderUsers.field === 'company') {
            return CompaniesService.getOneById(item.company.id).name;
          } else if ($scope.orderUsers.field === 'phone') {
            var phoneNumbers = item.phoneNumbers;
            if (phoneNumbers && phoneNumbers.length) {
              return phoneNumbers[0].number || '';
            }
          }  else if ($scope.orderUsers.field === 'ticket') {
            return item.userStatistic ? item.userStatistic.ticketsSubmitted : false;
          }

        };

        $scope.isLastUserWithInvoiceSubscription = function (targetUser) {
          var users = UsersService.getAllByCompanyId(targetUser.company.id);

          for (var id in users) {
            var user = users[id];
            if (user.id === targetUser.id) {
              continue;
            }

            if (user.subscription && user.subscription.invoice) {
              return false;
            }
          }
          return true;
        };

      }]);

}());
