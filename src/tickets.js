'use strict';

/* Services */

(function (window, $, undefined) {

    var services = angular.module('main.services');

    services.factory('TicketsService', ['$http', '$rootScope', 'RealTimeService', function ($http, $rootScope, RealTimeService) {

        var idCounter = 0;

        var storage = {
            lists           : {},
            tickets         : {}
        };

        function staticCopy(inst) {

            var instCopy,
                copyProps = inst || this;

            if(Object.prototype.toString.call(copyProps) === '[object Array]' ) {

                instCopy = [];

                for(var i = 0; i < copyProps.length; i++){
                    instCopy.push(staticCopy(copyProps[i]));
                }

            } else if (Object.prototype.toString.call(copyProps) === '[object Object]') {

                instCopy = {};

                for(var prop in copyProps){

                    if(prop === 'staticCopy' || prop == '$$hashKey') continue;

                    instCopy[prop] = copyProps[prop];
                }
            }

            return instCopy;
        }

        function customizeObj(sourceObj, targetObj){

            targetObj = targetObj || sourceObj;

//            if(targetObj['staticCopy']){
//                throw 'Method staticCopy engaged by TicketsService!';
//            }

            for(var prop in sourceObj){

                var value = sourceObj[prop];

                if(Object.prototype.toString.call(value) === '[object Array]' ) {
                    customizeArray(value);
                } else if (Object.prototype.toString.call(value) === '[object Object]') {
                    customizeObj(value);
                }

                defineReadOnlyProperty(targetObj, prop, value);
            }

            defineReadOnlyProperty(targetObj, 'staticCopy', staticCopy);

            return targetObj;

        }

        function customizeArray(source, target){

            if(target){
                for(var i = 0; i < source.length; i++){
                    target.push(customizeObj(source[i]));
                }

                defineReadOnlyProperty(target, 'staticCopy', staticCopy);

                return target;

            }

            for(var i = 0; i < source.length; i++){
                source[i] = customizeObj(source[i]);
            }

            defineReadOnlyProperty(source, 'staticCopy', staticCopy);

            return source;

        }

        function defineReadOnlyProperty(obj, prop, value){
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
        function getList(scope, params, callback){

            if(!scope || !scope.$id){
                throw 'First argument must be Angularjs scope!'
            }

            if(!params || ! params.type){
                throw "'type' is mandatory parameter that must be counted in second argument"
            }

            params.type = params.type.toUpperCase();

            var list = [];

            storage.lists[scope.$id] = {
                params          : params,
                scope           : scope,
                list            : list,
                alreadyLoaded   : []
            }

            loadMore(scope, callback);

            scope.$on('$destroy', function () {
                delete storage.lists[scope.$id];
            });

            return list;

        }

        function loadMore(scope, callback){

            if(!scope || !scope.$id){
                throw 'First argument must be Angularjs scope!'
            }

            var listData = storage.lists[scope.$id];

            if(!listData){
                throw 'There is no ticket list for scope ' + scope.$id;
            }

            if(listData.loadingInProcess){
                console.log('Loading tickets already in process');
                return;
            }

            listData.loadingInProcess = true;

            $http({
                method: 'POST',
                url: 'tickets',
                params: listData.params,
                data: listData.list.map(function(ticket) { return ticket.id; })
            }).then(function (response) {

                if (response) {

                    customizeArray(response.data, listData.list);

                    if(callback){
                        callback(response.data);
                    }

                    listData.loadingInProcess = false;
                }
            });
        }

        function getOne(id, scope, detailed, callback){

            if(!id){
                throw 'Id is mandatory argument!'
            }

            if(!scope || !scope.$id){
                throw 'Second argument must be Angularjs scope!'
            }

            var storageId = idCounter++;
            var ticket = {id: id};
            var url;

            if (detailed){
                url = 'tickets/detailed?ticketId=' + id;
            } else {
                url = 'tickets/ticket?id=' + id;
            }

            storage.tickets[storageId] = ticket;

            scope.$on('$destroy', function () {
                delete storage.tickets[storageId];
            });

            $http.get(url).success(function (ticketData) {
                customizeObj(ticketData, ticket);

                if(callback) {
                    callback(ticketData);
                }

                if(detailed) {
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

                            if(update.removedWatchers && update.removedWatchers.length > 0){

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
            });

            return ticket;

        }

        function claimUser(ticketId){
            $http.get('tickets/claimUser?ticketId=' + ticketId);
        }

        function save(ticket, callback){
            var future = $http.post('tickets/createTicket', ticket);

            if(callback){
                future.success(callback);
            }
        }

        function updateStatus(ticketId, status) {
            $http({
                url: 'tickets/updateStatus',
                method: 'GET',
                params: {ticketId: ticketId, status: status}
            });
        };

        function loadActualNumber(scope, callback){
            $http.get('data/actualNumber?type=TICKET').success(function (ticketNumber) {
                callback(ticketNumber);
            });

            RealTimeService.subscribe('/numbers?type=TICKET', scope, function (change) {
                callback(getFormattedNumber(change.value, true));
            });
        }

        function saveTicketUpdate(ticketUpdate, close, callback){
            var future = $http({
                url: 'tickets/update',
                method: 'POST',
                params: {
                    close: !!close
                },
                data: ticketUpdate
            });

            if(callback){
                future.success(callback);
            }
        }

        function deleteTicketUpdate(id) {
            $http.get('tickets/deleteUpdate?updateId=' + id);
        }

        var newScope = $rootScope.$new();

        RealTimeService.subscribe('/tickets', newScope, function (newChange) {

            if (newChange.action == 'createdTicket') {

                var ticket = customizeObj(newChange.value);

                for(var key in storage.lists) {

                    var listData = storage.lists[key];

                    if (isTicketMatchesFilters(ticket, listData.params)) {
                        listData.list.unshift(ticket);
                    }
                }

            } else if (newChange.action == 'companyDeleted') {

                var tickets = [],
                    deletedCompanyIds = newChange.value;

//               todo discuss this case (implement notification)

//               todo implement clearing all related with ticket company (should be discussed behavior when we delete company)

            } else if (newChange.action == 'invoiceCreated') {

                if (newChange.invoice.tickets) {

                    var invoice = customizeObj({id: newChange.invoice});
                    var ticketIds = newChange.invoice.tickets.map(function(ticket){return ticket.id})

                    mapToAllTickets(function(ticket){
                        if(ticketIds.indexOf(ticket.id) >= 0){
                            defineReadOnlyProperty(ticket, 'invoice', invoice);
                            return true;
                        }
                    });
                }

            } else if (newChange.action == 'status') {

                mapToAllTickets(function(ticket){
                    if(ticket.id === newChange.ticketId){
                        defineReadOnlyProperty(ticket, 'status', newChange.value);
                        return true;
                    }
                });

            } else if (newChange.action == 'assignedUser') {

                mapToAllTickets(function(ticket){
                    if(ticket.id === newChange.ticketId){
                        defineReadOnlyProperty(ticket, 'assignedUser', newChange.value);

                        if(!ticket.status){
                            defineReadOnlyProperty(ticket, 'status', 'IN_PROGRESS');
                        }
                        return true;
                    }
                });

            } else {
                //            todo remove this later
                console.log("DEBUUUG!!!", newChange);
            }


        });

        function isTicketMatchesFilters(ticket, params) {

            //todo apply strategy pattern
            if (params.type == 'UNASSIGNED' && (ticket.assignedUser && ticket.assignedUser.id)) {
                return false;
            } else if (params.type == 'USER' && (!ticket.assignedUser || ticket.assignedUser.id != $rootScope.currentUser.id || ticket.status == 'COMPLETED')) {
                return false;
            } else if (params.type == 'URGENT' && (ticket.priorityLevel != 'HIGH' || ticket.status == 'COMPLETED')) {
                return false;
            } else if (params.type == 'OPEN' && ticket.status == 'COMPLETED') {
                return false;
            } else if (params.type == 'CLOSED' && ticket.status != 'COMPLETED') {
                return false;
            } else if (params.companyId && params.companyId != ticket.company.id) {
                return false;
            } else if (params.status && params.status != ticket.status) {
                return false;
            } else if (params.priority && params.priority != ticket.priorityLevel) {
                return false;
            }

            return true;

        }

        function mapToAllTickets(callback){

            for(var key in storage.lists) {

                var listData = storage.lists[key];

                for(var i = 0; i < listData.list.length; i++){

                    if(callback(listData.list[i]) && !isTicketMatchesFilters(listData.list[i], listData.params)){
                        listData.list.splice(i, 1);
                    }
                }
            }

            for(var key in storage.tickets) {
                callback(storage.tickets[key]);
            }

        }

        return {
            getList             : getList,
            loadMore            : loadMore,
            getOne              : getOne,
            claimUser           : claimUser,
            updateStatus        : updateStatus,
            save                : save,
            loadActualNumber    : loadActualNumber,
            saveTicketUpdate    : saveTicketUpdate,
            deleteTicketUpdate  : deleteTicketUpdate
        }

    }]);

})(window, jQuery);