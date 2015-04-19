'use strict';

/* Services */

(function (window, $, undefined) {

    var services = angular.module('main.services');

    services.factory('TicketsService', ['$http', '$rootScope', 'RealTimeService', '$filter', function ($http, $rootScope, RealTimeService, $filter) {

        var ticketChangedActions = ['ASSIGNED_USER', 'PRIORITY_CHANGED', 'STATUS', 'TRASH', 'SPAM'];

        var idCounter = 0;

        var storage = {
            lists: {},
            tickets: {}
        };

        function staticCopy(inst) {

            var instCopy,
                copyProps = inst || this;

            if (Object.prototype.toString.call(copyProps) === '[object Array]') {

                instCopy = [];

                for (var i = 0; i < copyProps.length; i++) {
                    instCopy.push(staticCopy(copyProps[i]));
                }

            } else if (Object.prototype.toString.call(copyProps) === '[object Object]') {

                instCopy = {};

                for (var prop in copyProps) {

                    if (prop === 'staticCopy' || prop == '$$hashKey') continue;

                    instCopy[prop] = copyProps[prop];
                }
            }

            return instCopy;
        }

        function customizeObj(sourceObj, targetObj) {

            targetObj = targetObj || sourceObj;

//            if(targetObj['staticCopy']){
//                throw 'Method staticCopy engaged by TicketsService!';
//            }

            for (var prop in sourceObj) {

                var value = sourceObj[prop];

                if (Object.prototype.toString.call(value) === '[object Array]') {
                    customizeArray(value);
                } else if (Object.prototype.toString.call(value) === '[object Object]') {
                    customizeObj(value);
                }

                defineReadOnlyProperty(targetObj, prop, value);
            }

            defineReadOnlyProperty(targetObj, 'staticCopy', staticCopy);

            return targetObj;

        }

        function customizeArray(source, target) {

            if (target) {
                for (var i = 0; i < source.length; i++) {
                    target.push(customizeObj(source[i]));
                }

                defineReadOnlyProperty(target, 'staticCopy', staticCopy);

                return target;

            }

            for (var i = 0; i < source.length; i++) {
                source[i] = customizeObj(source[i]);
            }

            defineReadOnlyProperty(source, 'staticCopy', staticCopy);

            return source;

        }

        function defineReadOnlyProperty(obj, prop, value) {
            Object.defineProperty(obj, prop, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: true
            })
        }

        function findById(arrayObj, id) {
            for (var i = 0; i < arrayObj.length; i++)
                if (arrayObj[i].id === id)
                    return arrayObj[i];
            return;
        };

        function indexOfId(arrayObj, id) {
            for (var i = 0; i < arrayObj.length; i++) {
                var item = arrayObj[i],
                    itemId;

                if (item) {

                    if (item.versionedId) {
                        itemId = item.versionedId.id;
                    } else {
                        itemId = item.id;
                    }

                    if (itemId === id) {
                        return i;
                    }
                }
            }
            return -1;
        };

        function refreshTicketAttachments(ticket) {

            var attachments = [];

            for (var i = 0; i < ticket.updates.length; i++) {

                var update = ticket.updates[i];

                if (update.attachments && update.attachments.length) {
                    attachments = attachments.concat(update.attachments);
                }
            }

            defineReadOnlyProperty(ticket, 'attachments', customizeArray(attachments));
        }

        function getFormattedNumber(numberCounter, increment) {

            var num;

            if (increment) {
                num = '' + (parseInt(numberCounter.numPart) + 1);

                while (num.length < numberCounter.numPart.length) num = '0' + num;
            } else {
                num = numberCounter.numPart;
            }
            if (numberCounter.charPart) {
                return numberCounter.charPart + $rootScope.numberCounterDelimiter + num;
            } else {
                return num;
            }

        }

//  only one list per scope !
        function getList(scope, params, callback) {

            if (!scope || !scope.$id) {
                throw 'First argument must be Angularjs scope!'
            }

            if (!params || !params.filter) {
                throw "'filter' is mandatory parameter that must be counted in second argument"
            }

            params.filter = params.filter.toUpperCase();

            var list = [];

            storage.lists[scope.$id] = {
                params: params,
                scope: scope,
                list: list,
                alreadyLoaded: []
            };

            loadMore(scope, callback);

            scope.$on('$destroy', function () {
                delete storage.lists[scope.$id];
            });

            return list;

        }

        function loadMore(scope, callback) {

            if (!scope || !scope.$id) {
                throw 'First argument must be Angularjs scope!'
            }

            var listData = storage.lists[scope.$id];

            if (!listData) {
                throw 'There is no ticket list for scope ' + scope.$id;
            }

            if (listData.loadingInProcess) {
                console.log('Loading tickets already in process');
                return;
            }

            if (listData.list.length > 0) {
                listData.params.lastId = listData.list[listData.list.length - 1].id;
            } else {
                delete listData.params.lastId;
            }

            listData.loadingInProcess = true;

            $http({
                method: 'GET',
                url: '/v2/tickets',
                params: listData.params
            }).then(function (response) {

                if (response) {

                    customizeArray(response.data, listData.list);

                    listData.loadingInProcess = false;

                    if (callback) {
                        callback(response.data);
                    }
                }

                listData.loadingInProcess = false;
            }, function (response) {
                listData.loadingInProcess = false;
                if (callback) {
                    callback(response.data);
                }
            });
        }

        function getOne(id, scope, detailed, callback) {

            if (!id) {
                throw 'Id is mandatory argument!'
            }

            if (!scope || !scope.$id) {
                throw 'Second argument must be Angularjs scope!'
            }

            var storageId = idCounter++;
            var ticket = {id: id};
            var url = '/v2/tickets/' + id;

            if (detailed) {
                url += '?view=extended';
            }

            storage.tickets[storageId] = ticket;

            scope.$on('$destroy', function () {
                delete storage.tickets[storageId];
            });

            $http.get(url).then(function (resp) {
                customizeObj(resp.data, ticket);

                if (callback) {
                    callback(resp.data);
                }

                if (detailed) {
                    RealTimeService.subscribe('/ticketUpdates?ticketId=' + id, scope, function (newChange) {

                        if (newChange.action == 'updateSaved') {

                            var update = findById(ticket.updates, newChange.update.id);

                            if (update) {
                                customizeObj(update, newChange.update);
                            } else {
                                update = customizeObj(newChange.update);
                                ticket.updates.unshift(update);
                            }

                            refreshTicketAttachments(ticket);

                            if (update.type.value == 'CLAIM') {
                                ticket.watchers.push(update.user);
                            }

                            if (update.addedWatchers && update.addedWatchers.length > 0) {

                                for (var i = 0; i < update.addedWatchers.length; i++) {

                                    var addedWatcher = update.addedWatchers[i];
                                    var index = indexOfId(ticket.watchers, addedWatcher.id);

                                    if (index < 0) {
                                        ticket.watchers.push(addedWatcher);
                                    }
                                }

                            }

                            if (update.removedWatchers && update.removedWatchers.length > 0) {

                                for (var i = 0; i < update.removedWatchers.length; i++) {

                                    var index = indexOfId(ticket.watchers, update.removedWatchers[i].id);

                                    if (index > -1) {
                                        ticket.watchers.splice(index, 1);
                                    }
                                }
                            }

                        } else if (newChange.action == 'updateDeleted') {

                            var index = indexOfId(ticket.updates, newChange.updateId);

                            if (index > -1) {

                                if (newChange.field) {
                                    ticket.updates[index][newChange.field] = [];
                                } else {
                                    ticket.updates.splice(index, 1);
                                }

                                refreshTicketAttachments(ticket);
                            }
                        }
                    });
                }
            }, function (resp) {
                if (callback) {
                    callback(resp.data);
                }
            });

            return ticket;

        }

        function changePriority(ticketId, priority, callback) {
            if (!ticketId || !priority) throw 'ticketId and priority is required arguments!';
            changeTicket('priority', ticketId, priority, callback);
        }

        function assignTo(ticketId, userId, callback) {
            if (!ticketId || !userId) throw 'ticketId and userId is required arguments!';
            changeTicket('assign', ticketId, userId, callback);
        }

        function changeTicket(action, id, value, callback) {
            var url, data = {value: value};

            if (Object.prototype.toString.call(id) === '[object Array]') {
                url = 'v2/tickets/' + action;
                data.ids = id;
            } else {
                url = 'v2/tickets/' + id + '/' + action;
            }

            var future = $http.put(url, data);

            handleCallback(future, callback)
        }

        function claimUser(ticketId) {
            $http.get('tickets/claimUser?ticketId=' + ticketId);
        }

        function createTicket(ticket, callback) {
            var future = $http.post('v2/tickets', ticket);

            handleCallback(future, callback);
        }

        function updateStatus(ticketId, status) {
            $http({
                url: 'tickets/updateStatus',
                method: 'GET',
                params: {ticketId: ticketId, status: status}
            });
        };

        function loadActualNumber(scope, callback) {
            $http.get('data/actualNumber?type=TICKET').success(function (ticketNumber) {
                callback(ticketNumber);
            });

            RealTimeService.subscribe('/numbers?type=TICKET', scope, function (change) {
                callback(getFormattedNumber(change.value, true));
            });
        }

        function saveTicketUpdate(ticketUpdate, close, callback) {
            var future = $http({
                url: 'tickets/update',
                method: 'POST',
                params: {
                    close: !!close
                },
                data: ticketUpdate
            });

            handleCallback(future, callback);

        }

        function deleteTicketUpdate(id) {
            $http.get('tickets/deleteUpdate?updateId=' + id);
        }

        var newScope = $rootScope.$new();

        RealTimeService.subscribe('/tickets', newScope, function (newChange) {
            console.log(newChange);

            if (newChange.action === 'CREATED_TICKET') {

                var ticket = customizeObj(newChange.data, {});

                delete ticket.spam;
                delete ticket.trash;
                delete ticket.sharedBetween;

                for (var key in storage.lists) {

                    var listData = storage.lists[key];

                    if (isTicketMatchesFilters(newChange.data, listData.params)) {
                        listData.list.unshift(ticket);
                    }
                }
            } else if (ticketChangedActions.indexOf(newChange.action) > -1) {

                var ticket = customizeObj(newChange.data, {});

                delete ticket.spam;
                delete ticket.trash;
                delete ticket.sharedBetween;

                for (var key in storage.lists) {

                    var listData = storage.lists[key],
                        needSort = false;

                    var ticketIndex = indexOfId(listData.list, ticket.id);

                    if (ticketIndex > -1) {
                        if (isTicketMatchesFilters(newChange.data, listData.params)) {
                            customizeObj(ticket, listData.list[ticketIndex]);
                            needSort = true;
                        } else {
                            listData.list.splice(ticketIndex, 1);
                        }
                    } else if (isTicketMatchesFilters(newChange.data, listData.params)) {

                        if (listData.list.length === 0) {
                            listData.list.push(ticket);
                        } else {
                            var last = listData.list[listData.list.length - 1],
                                lastTicketDate = last.assignedAt || last.createdAt,
                                ticketDate = ticket.assignedAt || ticket.createdAt;

                            if (ticketDate >= lastTicketDate) {
                                listData.list.push(ticket);
                                needSort = true
                            }
                        }
                    }

                    if(needSort) {
                        listData.list.sort(sortTicketList);
                    }
                }

                for (var key in storage.tickets) {
                    customizeObj(ticket, storage.tickets[key]);
                }

            } else {
                //            todo remove this later
                console.log("DEBUUUG!!!", newChange);
            }


        });

        function sortTicketList(a, b){

            var aDate = a.assignedAt || a.createdAt;
            var bDate = b.assignedAt || b.createdAt;

            return bDate - aDate;
        }

        function isTicketMatchesFilters(ticket, params) {
//  todo write tests for all cases
            if (params.filter == 'URGENT') {

                if ((ticket.priorityLevel != 'HIGH' || ticket.status == 'COMPLETED')) {
                    return false;
                }

                if ($rootScope.currentUser.role !== 'ADMIN' && !findById(ticket.sharedBetween, $rootScope.currentUser.id)) {
                    return false;
                }
            }

            if (params.filter == 'UNASSIGNED' && (ticket.assignedUser && ticket.assignedUser.id)) {
                return false;
            }

            if (params.filter == 'USER' && (!ticket.assignedUser || ticket.assignedUser.id != $rootScope.currentUser.id || ticket.status == 'COMPLETED')) {
                return false;
            }

            if (params.filter == 'OPEN' && ticket.status == 'COMPLETED') {
                return false;
            }

            if (params.filter == 'CLOSED') {

                if (ticket.status != 'COMPLETED') {
                    return false;
                }

                if ($rootScope.currentUser.role !== 'ADMIN' && (!ticket.assignedUser || ticket.assignedUser.id != $rootScope.currentUser.id)) {
                    return false;
                }
            }

            if (params.filter == 'SHARED' && !findById(ticket.sharedBetween, $rootScope.currentUser.id)) {
                return false;
            }

            if (params.filter == 'SPAM' && !ticket.spam) {
                return false;
            }

            if (params.filter == 'TRASH' && !ticket.trash) {
                return false;
            }

            if (params.filter !== 'SPAM' && params.filter !== 'TRASH' && (ticket.spam || ticket.trash)) {
                return false;
            }

            if (params.companyId && params.companyId != ticket.company.id) {
                return false;
            }

            if (params.status && params.status != ticket.status) {
                return false;
            }

            if (params.priority && params.priority != ticket.priorityLevel) {
                return false;
            }

            return true;

        }

        function handleCallback(future, callback) {
            if (callback) {
                future.then(function (resp) {
                    callback(resp.data);
                }, function (resp) {
                    callback(resp.data);
                });
            }
        }

        return {
            getList: getList,
            loadMore: loadMore,
            getOne: getOne,
            changePriority: changePriority,
            assignTo: assignTo,
            claimUser: claimUser,
            updateStatus: updateStatus,
            createTicket: createTicket,
            loadActualNumber: loadActualNumber,
            saveTicketUpdate: saveTicketUpdate,
            deleteTicketUpdate: deleteTicketUpdate
        }

    }]);

})(window, jQuery);