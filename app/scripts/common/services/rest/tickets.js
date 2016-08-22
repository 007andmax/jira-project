'use strict';

/* Services */

(function (window, $, undefined) {

  var numberPrefix = 'Tkt# ';

  var services = angular.module('main.services');

  services.factory('TicketsService', ['$http', '$rootScope', 'RealTimeService', 'Utils',
    function ($http, $rootScope, RealTimeService, Utils) {

      var scope = $rootScope.$new();
      var ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'REPORT_AS_SPAM', 'RESTORE_FROM_SPAM', 'TICKET_INVOICED', 'TICKET_SHARE', 'MARKED_AS_SPAM', 'EDITED_TICKET'];
      var queries, loadingInProcess;
      var operators = {
        NULL: function (value) {
          return value === null || value === undefined;
        },
        NOT_NULL: function (value) {
          return !operators.NULL(value);
        },
        EQ: function (value1, value2) {
          return value1 == value2;
        },
        NOT_EQ: function (value1, value2) {
          return !operators.EQ(value1, value2);
        },
        GT: function (value1, value2) {
          return value1 > value2;
        },
        GE: function (value1, value2) {
          return value1 >= value2;
        },
        LT: function (value1, value2) {
          return value1 < value2;
        },
        LE: function (value1, value2) {
          return value1 <= value2;
        },
        LIKE: function (str1, str2) {
          return str1 && str1.indexOf(str2) !== -1;
        },
        IN: function (value, array) {
          if (array && array.length) {
            for (var i = 0; i < array.length; i++) {
              var item = array[i];

              if (angular.equals(value, item)) {
                return true;
              }
            }
          }
          return false;
        }
      };

      var storage = {
        lastParams: {},
        tickets: [],
        ticketsQuantity: 0,
        leftPanelCounters: {}
      };

      var unwatch = $rootScope.$watch('currentUser.id', function (currentUserId) {
        if (currentUserId) {
          queries = getQueries(currentUserId);
          unwatch();
        }
      });

      function getQueries(currentUserId) {
        return {
          ALL: { excludeTrashSpam: true },
          UNASSIGNED: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'assignedUser',
                operator: 'NULL'
              }]
            }]
          },
          USER: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              predicateRule: 'AND',
              fieldFilterDtos: [{
                path: 'assignedUser.id',
                operator: 'EQ',
                values: [currentUserId]
              }, {
                path: 'status',
                operator: 'NOT_NULL'
              }, {
                path: 'status',
                operator: 'NOT_EQ',
                values: ['COMPLETED']
              }]
            }]
          },
          SHARED: {
            excludeTrashSpam: true,
            orderByFilters: [{
              path: 'shares.date',
              order: 'DESC',
              aggregation: 'MIN'
            }],
            groupFieldFilters: [{
              predicateRule: 'AND',
              fieldFilterDtos: [{
                path: 'shares.user.id',
                operator: 'EQ',
                values: [currentUserId]
              }, {
                path: 'status',
                operator: 'NOT_EQ',
                values: ['COMPLETED']
              }]
            }, {
              predicateRule: 'OR',
              fieldFilterDtos: [{
                path: 'assignedUser.id',
                operator: 'NULL'
              }, {
                path: 'assignedUser.id',
                operator: 'NOT_EQ',
                values: [currentUserId]
              }]
            }]
          },
          OPEN: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'NOT_EQ',
                values: ['COMPLETED']
              }]
            }]
          },
          CLOSED: {
            excludeTrashSpam: true,
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'status',
                operator: 'EQ',
                values: ['COMPLETED']
              }]
            }]
          },
          TRASH: {
            groupFieldFilters: [{
              fieldFilterDtos: [{
                path: 'trash',
                operator: 'EQ',
                values: [true]
              }]
            }]
          },
          SPAM: {
            groupFieldFilters: [{
              predicateRule: 'OR',
              fieldFilterDtos: [{
                path: 'spamMarker',
                operator: 'NOT_NULL'
              }, {
                path: 'spamReporter',
                operator: 'NOT_NULL'
              }]
            }]
          }
        };
      }

      function fetchTickets(listType, userId, companyId, callback) {
        var query = queries[listType.toUpperCase()];
        if (query) {
          storage.tickets = [];
          storage.lastParams = angular.copy(query);

          if (userId) {
            storage.lastParams.groupFieldFilters = storage.lastParams.groupFieldFilters || [];
            storage.lastParams.groupFieldFilters.push({
              fieldFilterDtos: [{
                path: 'createdUser.id',
                operator: 'EQ',
                values: [userId]
              }]
            });
          }

          if (companyId) {
            storage.lastParams.groupFieldFilters = storage.lastParams.groupFieldFilters || [];
            storage.lastParams.groupFieldFilters.push({
              fieldFilterDtos: [{
                path: 'company.id',
                operator: 'EQ',
                values: [companyId]
              }]
            });
          }

          loadMore(listType, callback);
        }
      }

      function loadMore(listType, callback) {

        storage.lastParams.offset = storage.tickets.length;

        loadingInProcess = true;

        $http.post('/v2/tickets/ticketTest', storage.lastParams).then(function (resp) {

          if (resp) {

            for (var i = 0; i < resp.data.length; i++) {
              var ticket = resp.data[i];
              ticket.number = numberPrefix + ticket.number;

              var existedTicket = Utils.findById(storage.tickets, ticket.id);

              if (existedTicket) {
                Utils.customizeObj(ticket, existedTicket);
              } else {
                storage.tickets.push(Utils.customizeObj(ticket));
              }

            }

            if (callback) {
              callback(storage.tickets, listType);
            }
          }

          loadingInProcess = false;
        }, function (resp) {
          loadingInProcess = false;
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function search(callback, keyword, companyId) {
        if (!keyword || keyword === '[$empty$]' || keyword === 'undefined') {
          keyword = '';
        }

        return $http.get('/v2/tickets/searchByKeyword?keyword=' + keyword + '&companyId=' + (companyId || ''))
          .then(function (resp) {
            if (callback) {
              callback(resp.data);
            }
            return resp.data;
          });
      }

      function getOne(ticket, targetScope, callback) {

        if (!ticket || !ticket.id) {
          throw 'Invalid first argument! It must be object with "id" field!';
        }

        storage.openedTicket = ticket;

        $http.get('/v2/tickets/' + ticket.id).then(function (resp) {

          resp.data.number = numberPrefix + resp.data.number;
          Utils.customizeObj(resp.data, ticket);

          if (callback) {
            callback(ticket);
          }

        }, function () {
          if (callback) {
            callback(ticket);
          }
        });

        RealTimeService.subscribe('/ticketUpdates/' + ticket.id, targetScope, function (newChange) {

          if (newChange.action == 'UPDATE_SAVED' || newChange.action == 'UPDATE_CREATED') {

            var update = Utils.findById(ticket.updates, newChange.data.id),
              attachments = newChange.data.attachments;

            if (update) {
              Utils.customizeObj(newChange.data, update);
            } else {
              update = Utils.customizeObj(newChange.data);
              ticket.updates.unshift(update);
            }

            if (attachments && attachments.length) {

              for (var i = 0; i < attachments.length; i++) {
                var attachment = attachments[i];
                ticket.attachments.push(attachment);
              }
            }

          } else if (newChange.action == 'UPDATE_DELETED') {
            Utils.deleteById(ticket.updates, newChange.data.id);
          }
        });

        RealTimeService.subscribe('/tagsSpecifying/' + ticket.id, targetScope, function (newChange) {

          if (newChange.action === 'TAG_TICKET_SPECIFYING_SAVED') {
            ticket.tags.splice(0, ticket.tags.length);
            for (var i = 0; i < newChange.data.length; i++) {
              ticket.tags.push(newChange.data[i]);
            }

            if (callback) {
              callback(ticket);
            }
          }
        });

        targetScope.$on('$destroy', function () {
          storage.openedTicket = undefined;
        });
      }

      function getLeftPanelCounts(scope, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        $http.get('/data/getCounters').then(function (resp) {
          Utils.customizeObj(resp.data, storage.leftPanelCounters);

          if (callback) {
            callback(storage.leftPanelCounters);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });

        RealTimeService.subscribe('/leftPanelCounts', scope, function (newChange) {
          if (newChange.action == 'LEFT_PANEL_COUNTS') {
            Utils.customizeObj(newChange.data, storage.leftPanelCounters);
          }
        });

        return storage.leftPanelCounters;
      }

      function getCountsByTypesAndCompany(scope, companyId, ticketTypes, callback) {

        if (!scope || !scope.$id) {
          throw 'First argument must be Angularjs scope!'
        }

        if (!companyId) {
          throw 'companyId is required!'
        }

        if (!ticketTypes || ticketTypes.length == 0) {
          throw 'ticketTypes is required!'
        }

        var counts = Utils.customizeObj({});

        getCountsFromServer();

        RealTimeService.subscribe('/ticketsCount', scope, function (newChange) {
          if (newChange.action == 'TICKETS_COUNT_CHANGED') {
            getCountsFromServer()
          }
        });

        function getCountsFromServer() {

          $http({
            url: '/v2/tickets/counts/',
            data: {
              companyId: companyId,
              types: ticketTypes
            },
            method: 'POST'
          }).then(function (resp) {
            Utils.customizeObj(resp.data, counts);

            if (callback) {
              callback(resp.data);
            }
          }, function (resp) {
            if (callback) {
              callback(resp.data);
            }
          });
        }

        return counts;

      }

      function getCount(callback) {

        getTicketQuantity(callback);

        RealTimeService.subscribe('/ticketsCount', scope, function (newChange) {
          if (newChange.action == 'TICKETS_COUNT_CHANGED') {
            getTicketQuantity(callback);
          }
        });

        function getTicketQuantity(callback) {
          $http.post('/v2/tickets/ticketTest/count', storage.lastParams).then(function (resp) {
            storage.ticketsQuantity = resp.data;

            if (callback) {
              callback(storage.ticketsQuantity);
            }
          }, function (resp) {
            if (callback) {
              callback(resp.data);
            }
          });
        }
      }

      function changePriority(ticketId, priority, callback) {
        if (!ticketId || !priority) {
          throw 'ticketId and priority is required arguments!';
        }
        changeTicket('priority', ticketId, priority.toUpperCase(), callback);
      }

      function assignTo(ticketId, userId, callback) {
        if (!ticketId || !userId) {
          throw 'ticketId and userId is required arguments!';
        }
        changeTicket('assign', ticketId, userId, callback);
      }

      function changeStatus(ticketId, status, callback, recipientsIds) {
        if (!ticketId || !status) {
          throw 'ticketId and status is required arguments!';
        }
        changeTicket('status', ticketId, status.toUpperCase(), callback, recipientsIds);
      }

      function markAsSpam(ticketId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('markAsSpam', ticketId, false, callback);
      }

      function reportAsSpam(ticketId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('reportAsSpam', ticketId, false, callback);
      }

      function restoreFromSpam(ticketId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('restoreFromSpam', ticketId, false, callback);
      }

      function changeTrashFlag(ticketId, value, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('trash', ticketId, !!value, callback);
      }

      function changeLinkedAgent(ticketId, agentId, callback) {
        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }
        changeTicket('linkedAgent', ticketId, agentId, callback);
      }

      function changeTicket(action, id, value, callback, recipientsIds) {
        var url, data = { value: value };

        if (Object.prototype.toString.call(id) === '[object Array]') {
          url = '/v2/tickets/' + action;
          data.ids = id;
        } else {
          url = '/v2/tickets/' + id + '/' + action;
        }

        if (value === 'COMPLETED') {
          data.recipientsIds = recipientsIds;
        }

        var future = $http.put(url, data);

        Utils.handleCallback(future, callback)
      }

      function deleteForever(ticketId, callback) {

        if (!ticketId) {
          throw 'ticketId is required arguments!';
        }

        var ids = ticketId;

        if (Object.prototype.toString.call(ticketId) !== '[object Array]') {
          ids = [ticketId];
        }

        var future = $http.post('/v2/tickets/delete/', { ids: ids });
        Utils.handleCallback(future, callback)
      }

      function claimUser(ticketId) {
        $http.get('/tickets/claimUser?ticketId=' + ticketId);
      }

      function createTicket(ticket, callback) {

        if (ticket.priorityLevel) {
          ticket.priorityLevel = ticket.priorityLevel.toUpperCase();
        }

        var future = $http.post('/v2/tickets', ticket);
        Utils.handleCallback(future, callback);
      }

      function getActualNumber(scope, callback) {
        $http.get('/data/actualNumber?type=TICKET').success(function (resp) {
          if (callback) {
            callback(resp.number);
          }
        });

        RealTimeService.subscribe('/number/TICKET', scope, function (change) {
          if (change.action === 'NUMBER_CHANGED') {
            if (callback) {
              callback(Utils.getFormattedNumber(change.data));
            }
          }
        });
      }

      function createTicketUpdate(ticketUpdate, close, callback) {

        if (!ticketUpdate) {
          throw 'ticketUpdate is required arguments!';
        }
        if (!ticketUpdate.ticket.id) {
          throw 'ticketUpdate.ticket.id is required!';
        }
        if (ticketUpdate.id) {
          throw 'TicketUpdate must be new, without ticketUpdate.id!';
        }
        if (!ticketUpdate.type) {
          throw 'ticketUpdate.type is required!';
        }
        if (!ticketUpdate.note && !ticketUpdate.products && !ticketUpdate.services) {
          throw 'In TicketUpdate must be or note or products or services!';
        }

        var future = $http.post('/v2/tickets/updates?close=' + !!close, ticketUpdate);
        Utils.handleCallback(future, callback);
      }

      function deleteTicketUpdate(ticketId, updateId, callback) {
        var future = $http.delete('/v2/tickets/' + ticketId + '/updates/' + updateId);
        Utils.handleCallback(future, callback);
      }

      function loadRemainingTicketUpdates(ticket, callback) {

        if (!ticket.id || !ticket.updates) {
          throw 'You can load updates only for detailed ticket!';
        }
        if (ticket.updates.length == 0) {
          throw 'There is no updates';
        }

        var loadedIds = [];

        for (var i = 0; i < ticket.updates.length; i++) {
          loadedIds.push(ticket.updates[i].id)
        }

        $http.post('/v2/tickets/' + ticket.id + '/updates/fetch', loadedIds).then(function (resp) {
          Utils.customizeArray(resp.data, ticket.updates);
          Utils.defineReadOnlyProperty(ticket, 'unloadedUpdates', 0);

          if (callback) {
            callback(resp.data);
          }
        }, function (resp) {
          if (callback) {
            callback(resp.data);
          }
        });
      }

      function markUpdateAsRead(ticketId, updateIds, callback) {

        if (!ticketId || !updateIds) {
          throw 'ticketId and updateIds is required parameters';
        }

        var future = $http.post('/v2/tickets/' + ticketId + '/updates/read', updateIds);
        Utils.handleCallback(future, callback);
      }

      RealTimeService.subscribe('/tickets', scope, function (newChange) {

        if (newChange.data && newChange.data.number) {
          newChange.data.number = numberPrefix + newChange.data.number;
        }

        var ticketIndex = Utils.indexOfId(storage.tickets, newChange.data.id),
          ticketById = storage.tickets[ticketIndex];

        if (newChange.action === 'CREATED_TICKET') {

          if (isTicketMatchesFilters(newChange.data, storage.lastParams)) {

            if (ticketById) {
              Utils.customizeObj(newChange.data, ticketById);
            } else {
              insertToFitOrdering(newChange.data, storage.tickets);
            }
          } else if (ticketById) {
            Utils.deleteById(storage.tickets, ticketById.id);
          }

        } else if (ticketChangedActions.indexOf(newChange.action) > -1) {


          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.customizeObj(newChange.data, storage.openedTicket);
          }

          if (isTicketMatchesFilters(newChange.data, storage.lastParams)) {

            if (ticketById) {
              Utils.customizeObj(newChange.data, ticketById);
            } else {
              insertToFitOrdering(newChange.data, storage.tickets);
            }

          } else if (ticketById) {
            storage.tickets.splice(ticketIndex, 1);
          }

        } else if (newChange.action === 'READ') {
          Utils.defineReadOnlyProperty(ticketById, 'unread', false);
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'unread', false);
          }

        } else if (newChange.action === 'TICKET_UPDATES_READ') {
          Utils.defineReadOnlyProperty(ticketById, 'hasNewUpdates', false);
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'hasNewUpdates', false);
          }

        } else if (newChange.action === 'TICKET_DELETED') {
          Utils.deleteById(storage.tickets, newChange.data.id);
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            $rootScope.$broadcast('ticket_is_not_available_anymore', newChange.data);
            storage.openedTicket = undefined;
          }

        } else if (newChange.action === 'TICKET_BILLABLE') {
          Utils.defineReadOnlyProperty(ticketById, 'isBillable', newChange.data.isBillable);
          if (storage.openedTicket && newChange.data.id === storage.openedTicket.id) {
            Utils.defineReadOnlyProperty(storage.openedTicket, 'isBillable', newChange.data.isBillable);
          }

        } else if (newChange.action === 'LINKED_AGENT_CHANGED') {
          for (var i = 0; i < newChange.data.ticketIds.length; i++) {
            var ticketId = newChange.data.ticketIds[i],
              ticket = Utils.findById(storage.tickets, ticketId);
            if (newChange.data.deviceId) {
              Utils.defineReadOnlyProperty(ticket, 'agent', { deviceId: newChange.data.deviceId });
            } else {
              Utils.defineReadOnlyProperty(ticket, 'agent', null);
            }

            if (storage.openedTicket && ticketId === storage.openedTicket.id) {
              if (newChange.data.deviceId) {
                Utils.defineReadOnlyProperty(storage.openedTicket, 'agent', { deviceId: newChange.data.deviceId });
              } else {
                Utils.defineReadOnlyProperty(storage.openedTicket, 'agent', null);
              }
            }
          }
        }
      });

      //is need to insert ticket now or it will be received later by lazy loading
      function insertToFitOrdering(newTicket, list) {
        var lastParams = storage.lastParams,
          orderByList = angular.copy(lastParams.orderByFilters);

        var orderByCreatedAt = {
          path: 'createdAt',
          order: 'DESC'
        };

        if (!orderByList) {
          orderByList = [orderByCreatedAt];
        } else if (orderByList.every(function (item) {
            return item.path !== orderByCreatedAt.path;
          })) {
          orderByList.push(orderByCreatedAt);
        }

        var insertIndex = getIndexToInsert(newTicket, list, orderByList);
        if (insertIndex < list.length || list.length < 15) {
          list.splice(insertIndex, 0, newTicket);
        }
      }

      function getIndexToInsert(newTicket, list, orderByList) {
        for (var index = 0; index < list.length; index++) {
          var ticket = list[index];

          for (var j = 0; j < orderByList.length; j++) {
            var orderBy = orderByList[j],
              path = orderBy.path.split('.'),
              direction = orderBy.order,
              aggregation = orderBy.aggregation,
              valueFromTicketInList,
              valueFromNewTicket,
              sortFunc,
              aggregationFunc;

            if (direction === 'DESC') {
              sortFunc = function (value1, value2) {
                return value1 >= value2;
              };
            } else {
              sortFunc = function (value1, value2) {
                return value1 <= value2;
              };
            }

            if (aggregation) {
              var arrayName = path.pop();
              aggregationFunc = Math[aggregation.toLowerCase()];
              valueFromTicketInList = getValueByAggregation(ticket[arrayName], path, aggregationFunc);
              valueFromNewTicket = getValueByAggregation(newTicket[arrayName], path, aggregationFunc);
            } else {
              valueFromTicketInList = getValueByPath(ticket, path);
              valueFromNewTicket = getValueByPath(newTicket, path);
            }

            if (sortFunc(valueFromNewTicket, valueFromTicketInList)) {
              return index;
            }
          }
        }

        return list.length;
      }

      function isTicketMatchesFilters(ticket, params) {
        var conditionsGroup = params.groupFieldFilters,
          groupRule = params.predicateRule;

        for (var prop in conditionsGroup) {
          var conditionGroup = conditionsGroup[prop],
            conditions = conditionGroup.fieldFilterDtos,
            rule = conditionGroup.predicateRule,
            conditionsResult = rule !== 'OR';

          for (var i = 0; i < conditions.length; i++) {
            var condition = conditions[i];

            if (rule === 'OR' && checkCondition(condition, ticket)) {
              conditionsResult = true;
              break;
            } else if ((!rule || rule === 'AND') && !checkCondition(condition, ticket)) {
              conditionsResult = false
            }
          }

          if (groupRule === 'OR' && conditionsResult) {
            return true;
          } else if ((!groupRule || groupRule === 'AND') && !conditionsResult) {
            return false;
          }
        }

        return groupRule !== 'OR';
      }

      function checkCondition(condition, ticket) {
        var path = condition.path.split('.'),
          operator = condition.operator,
          values = condition.values,
          valueFromTicket = ticket;

        valueFromTicket = getValueByPath(valueFromTicket, path);

        if (Array.isArray(valueFromTicket)) {
          for (var j = 0; j < valueFromTicket.length; j++) {
            var value = getValueByPath(valueFromTicket[j], valueFromTicket.path.split('.'));

            if (checkValueByOperator(value, operator, values)) {
              return true;
            }
          }
          return false
        } else {
          return checkValueByOperator(valueFromTicket, operator, values);
        }
      }

      function checkValueByOperator(valueToCheck, operator, values) {
        if (operator === 'IN') {
          if (values) {
            for (var i = 0; i < values.length; i++) {
              var value = values[i];
              if (value === valueToCheck) {
                return true;
              }
            }
          }
          return false;
        } else {
          if (values) {
            return operators[operator](valueToCheck, values[0]);
          } else {
            return operators[operator](valueToCheck);
          }
        }
      }

      function getValueByPath(source, path) {
        var result = angular.copy(source);

        for (var i = 0; i < path.length; i++) {
          result = result[path[i]];
          if (result === null || result === undefined) {
            return result;
          } else if (Array.isArray(result)) {
            result.path = path.slice(i + 1).join('.');
            return result;
          }
        }

        return result;
      }

      function getValueByAggregation(array, path, aggregationFunc) {
        if (array && path && aggregationFunc) {
          var result = getValueByPath(array[0], path);

          for (var i = 1; i < array.length; i++) {
            var item = array[i],
              value = item;

            for (var j = 0; j < path.length; j++) {
              value = value[path[j]];
              if (value === null || value === undefined) {
                break;
              }
            }

            result = aggregationFunc(result, value);
          }

          return result;
        }
      }

      function updateExpenseInTicketUpdate(expense, callback) {

        if (!expense) {
          throw 'expense is required!';
        }
        if (!expense.ticketUpdateId) {
          throw 'ticketUpdateId is required!';
        }
        if (!expense.serviceExpense && !expense.productExpense) {
          throw 'serviceExpense or productExpense is required!';
        }

        var future = $http.put('/v2/tickets/ticketUpdate/updateExpense', expense);
        Utils.handleCallback(future, callback);
      }

      function getCurrentlyWorkingWith(targetScope, callback) {

        if (!targetScope || !targetScope.$id) {
          throw 'First argument must be Angularjs scope!';
        }

        return Utils.getListByUrl('/v2/tickets/currentlyWorkingWith', callback, function (list) {

          RealTimeService.subscribe('/tickets', targetScope, function (newChange) {
            if (newChange.action == 'CURRENTLY_WORKING_WITH') {
              list.splice(0, list.length);
              Utils.customizeArray(newChange.data, list);
            }
          });
        });
      }

      function saveEditedTicket(ticket, callback) {
        var future = $http.put('/v2/tickets/edit', ticket);
        Utils.handleCallback(future, callback);
      }

      return {
        getList: fetchTickets,
        getCurrentlyWorkingWith: getCurrentlyWorkingWith,
        loadMore: loadMore,
        search: search,
        getCount: getCount,
        getCounts: getLeftPanelCounts,
        getCountsByTypesAndCompany: getCountsByTypesAndCompany,
        getOne: getOne,
        changePriority: changePriority,
        assignTo: assignTo,
        changeStatus: changeStatus,
        markAsSpam: markAsSpam,
        reportAsSpam: reportAsSpam,
        restoreFromSpam: restoreFromSpam,
        changeTrashFlag: changeTrashFlag,
        deleteForever: deleteForever,
        claimUser: claimUser,
        createTicket: createTicket,
        getActualNumber: getActualNumber,
        createTicketUpdate: createTicketUpdate,
        deleteTicketUpdate: deleteTicketUpdate,
        loadRemainingTicketUpdates: loadRemainingTicketUpdates,
        markUpdateAsRead: markUpdateAsRead,
        updateExpenseInTicketUpdate: updateExpenseInTicketUpdate,
        changeLinkedAgent: changeLinkedAgent,
        save: saveEditedTicket
      }

    }

  ]);

})(window, jQuery);
