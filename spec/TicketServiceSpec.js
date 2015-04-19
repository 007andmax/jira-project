describe('TicketsService', function () {

    var createdTicketIds = [];
    var scope;

    var $injector = angular.injector(['ng', 'main.services']),
        TicketsService = $injector.get('TicketsService'),
        CompaniesService = $injector.get('CompaniesService'),
        UsersService = $injector.get('UsersService'),
        $rootScope = $injector.get('$rootScope');

    var ticketsCounts = TicketsService.getCounts($rootScope.$new());

    /*  beforeEach(function () {

     var $injector = angular.injector([ 'ng', 'main.services' ]);
     TicketsService = $injector.get('TicketsService');
     $rootScope = $injector.get('$rootScope');
     });*/

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('getList()', function () {

        it('should return empty array', function () {

            var tickets = TicketsService.getList(scope, {filter: 'ALL'});

            expect(tickets.length).toBe(0);
        });

        it('callback should be called when returned array is filled with received tickets', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function (loadedTickets) {

                expect(loadedTickets.length).toBe(realtimeTickets.length);

                for (var i = 0; i < loadedTickets.length; i++) {

                    for (var key in loadedTickets[i]) {

                        if (key === 'staticCopy') continue;

                        expect(realtimeTickets[i][key]).toBe(loadedTickets[i][key]);
                        expect(loadedTickets[i].spamPerformer).toBeNull();
                        expect(loadedTickets[i].trash).toBeFalsy();
                    }
                }

                done()
            });
        });

        it('should load tickets with HIGH priorityLevel when filter is URGENT', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'URGENT'
            }, function (loadedTickets) {

                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].priorityLevel).toBe('HIGH');
                    expect(loadedTickets[i].status).not.toBe('COMPLETED');
                    expect(loadedTickets[i].spamPerformer).toBeNull();
                    expect(loadedTickets[i].trash).toBeFalsy();
                    //    todo implement checking sharedBetween
                }

                done()
            });
        });

        it('should load tickets with no assignedUser when filter is UNASSIGNED', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'UNASSIGNED'
            }, function (loadedTickets) {

                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].assignedUser).toBe(null);
                    expect(loadedTickets[i].spamPerformer).toBeNull();
                    expect(loadedTickets[i].trash).toBeFalsy();
                }

                done()
            });
        });

        it('should load tickets with assigned to current user when filter is USER', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'USER'
            }, function (loadedTickets) {

                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].assignedUser.id).toBe($rootScope.currentUser.id);
                    expect(loadedTickets[i].status).not.toBe('COMPLETED');
                    expect(loadedTickets[i].spamPerformer).toBeNull();
                    expect(loadedTickets[i].trash).toBeFalsy();
                }

                done()
            });
        });

        it('should load tickets where status is ON_HOLD or IN_PROGRESS when filter is OPEN', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'OPEN'
            }, function (resp) {

                if ($rootScope.currentUser.role === 'ADMIN') {
                    for (var i = 0; i < resp.length; i++) {
                        expect(resp[i].status).not.toBe('COMPLETED');
                        expect(resp[i].spamPerformer).toBeNull();
                        expect(resp[i].trash).toBeFalsy();
                    }
                } else {
                    expect(resp.code).toBe(403);
                }

                done()
            });
        });

        it('should load tickets where status is COMPLETED when filter is CLOSED', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'CLOSED'
            }, function (loadedTickets) {

                //    todo implement checking sharedBetween
                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].status).toBe('COMPLETED');
                    expect(loadedTickets[i].spamPerformer).toBeNull();
                    expect(loadedTickets[i].trash).toBeFalsy();

                    if ($rootScope.currentUser.role !== 'ADMIN') {
                        expect(loadedTickets[i].assignedUser.id).toBe($rootScope.currentUser.id);
                    }
                }

                done()
            });
        });

        it('should load tickets where spam is true when filter is SPAM', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'SPAM'
            }, function (loadedTickets) {

                //    todo implement checking sharedBetween
                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].spamPerformer).not.toBeNull();
                    expect(loadedTickets[i].spamPerformer.id).not.toBeUndefined();

                    if ($rootScope.currentUser.role !== 'ADMIN') {
                        expect(loadedTickets[i].spamPerformer.id).toBe($rootScope.currentUser.id);
                    }
                }

                done()
            });
        });

        it('should load tickets where trash is true when filter is TRASH', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'TRASH'
            }, function (resp) {

                if ($rootScope.currentUser.role === 'ADMIN') {
                    //    todo implement checking sharedBetween
                    for (var i = 0; i < resp.length; i++) {
                        expect(resp[i].trash).toBeTruthy();
                    }
                } else {
                    expect(resp.code).toBe(403);
                }

                done()
            });
        });

        it('all filters represented in params should be summarized', function (done) {

            var requestsCount = 3;

            TicketsService.getList(scope, {
                filter: 'USER',
                priority: 'MEDIUM',
                status: 'IN_PROGRESS'
            }, function (loadedTickets) {

                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].assignedUser.id).toBe($rootScope.currentUser.id);
                    expect(loadedTickets[i].priorityLevel).toBe('MEDIUM');
                    expect(loadedTickets[i].status).toBe('IN_PROGRESS');
                }

                customDone();
            });

            scope = $rootScope.$new();

            TicketsService.getList(scope, {
                filter: 'USER',
                priority: 'HIGH',
                status: 'COMPLETED'
            }, function (loadedTickets) {

                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].assignedUser.id).toBe($rootScope.currentUser.id);
                    expect(loadedTickets[i].priorityLevel).toBe('HIGH');
                    expect(loadedTickets[i].status).toBe('COMPLETED');
                }

                customDone();
            });

            TicketsService.getList(scope, {
                filter: 'USER',
                priority: 'LOW',
                status: 'ON_HOLD'
            }, function (loadedTickets) {

                for (var i = 0; i < loadedTickets.length; i++) {
                    expect(loadedTickets[i].assignedUser.id).toBe($rootScope.currentUser.id);
                    expect(loadedTickets[i].priorityLevel).toBe('LOW');
                    expect(loadedTickets[i].status).toBe('ON_HOLD');
                }

                customDone();
            });

            var finishedRequestsCount = 0;

            function customDone() {

                finishedRequestsCount++;

                if (finishedRequestsCount == requestsCount) {
                    done();
                }
            }
        });

        it('should filter tickets by keyword', function (done) {

            TicketsService.getList(scope, {
                filter: 'USER'
            }, function (loadedTickets) {

                if (loadedTickets.length > 0) {
                    var userName = UsersService.getOneById(loadedTickets[0].createdUser.id).firstName;

                    TicketsService.getList(scope, {
                        filter: 'USER',
                        keyword: userName
                    }, function (tickets) {

                        for (var i = 0; i < tickets.length; i++) {
                            expect(UsersService.getOneById(tickets[i].createdUser.id).firstName.indexOf(userName)).toBeGreaterThan(-1);
                        }

                        done();
                    });

                }

            });
        });

        it('should return empty list when params contradict each other', function (done) {

                var requestsCount = 2;

                TicketsService.getList(scope, {
                    filter: 'URGENT',
                    priority: 'LOW'
                }, function (loadedTickets) {

                    expect(loadedTickets.length).toBe(0);

                    customDone();
                });

                scope = $rootScope.$new();

                TicketsService.getList(scope, {
                    filter: 'UNASSIGNED',
                    status: 'ON_HOLD'
                }, function (loadedTickets) {

                    expect(loadedTickets.length).toBe(0);

                    customDone();
                });

                /* TicketsService.getList(scope, {
                 filter: 'UNASSIGNED',
                 status: 'COMPLE'
                 }, function (loadedTickets) {
                 console.log(loadedTickets)
                 expect(loadedTickets.length).toBe(0);

                 customDone();
                 });*/

                var finishedRequestsCount = 0;

                function customDone() {

                    finishedRequestsCount++;

                    if (finishedRequestsCount == requestsCount) {
                        done();
                    }
                }
            }
        )
    });

    describe('loadMore()', function () {

        it('should be used only after call getList method', function () {

                expect(function () {
                    TicketsService.loadMore(scope)
                }).toThrow();
            }
        );

        it('callback should be called when tickets list in passed scope is filled with received tickets', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function (loadedList) {

                TicketsService.loadMore(scope, function (loadedTickets) {

                    for (var i = 0; i < loadedTickets.length; i++) {
                        loadedList.push(loadedTickets[i]);
                    }

                    expect(realtimeTickets.length).toBe(loadedList.length);

                    for (var i = 0; i < loadedList.length; i++) {

                        for (var key in loadedList[i]) {

                            if (key === 'staticCopy') continue;

                            expect(realtimeTickets[i][key]).toBe(loadedList[i][key]);
                        }
                    }

                    done()
                });

            });
        });

        it('should load tickets with params that were used in getList', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'OPEN'
            }, function (loadedList) {

                TicketsService.loadMore(scope, function (loadedTickets) {

                    if ($rootScope.currentUser.role !== 'ADMIN') {
                        expect(loadedTickets.code).toBe(403);
                        done();
                        return;
                    }

                    for (var i = 0; i < loadedTickets.length; i++) {
                        loadedList.push(loadedTickets[i]);

                        expect(loadedTickets[i].status).not.toBe('COMPLETED');
                    }

                    expect(realtimeTickets.length).toBe(loadedList.length);

                    for (var i = 0; i < loadedList.length; i++) {

                        for (var key in loadedList[i]) {

                            if (key === 'staticCopy') continue;

                            expect(realtimeTickets[i][key]).toBe(loadedList[i][key]);
                        }
                    }

                    done()
                });

            });
        });
    });

    describe('search()', function () {

        it('should search by companies', function (done) {

                var companies = CompaniesService.getClientCompanies();

                if (companies.length > 0) {

                    var keyword = companies[0].legalName.substring(1, 4);

                    var searchResults = TicketsService.search({
                        filter: 'ALL',
                        keyword: keyword
                    }, function (resp) {
                        expect(resp).toBe(searchResults);

                        expect(searchResults.companies.length).toBeGreaterThan(0);

                        for (var i = 0; i < searchResults.companies.length; i++) {
                            expect(searchResults.companies[i].legalName.indexOf(keyword)).toBeGreaterThan(-1);
                        }

                        done();
                    })
                } else {
                    done();
                }
            }
        );

        it('should search by tickets', function (done) {

                if (window.clientUsers.length > 0) {

                    var keyword = window.clientUsers[0].firstName.substring(0, 3);

                    var searchResults = TicketsService.search({
                        filter: 'ALL',
                        keyword: keyword
                    }, function (resp) {
                        expect(resp).toBe(searchResults);

                        for (var i = 0; i < searchResults.companies.length; i++) {
                            expect(searchResults.companies[i].legalName.indexOf(keyword)).toBeGreaterThan(-1);
                        }

                        for (var i = 0; i < searchResults.tickets.length; i++) {
                            expect(UsersService.getOneById(searchResults.tickets[i].createdUser.id).firstName.indexOf(keyword)).toBeGreaterThan(-1);
                        }

                        done();
                    })
                } else {
                    done()
                }

            }
        );

    });

    describe('getOne()', function () {

        it('should work only with real ticket ids', function (done) {

                TicketsService.getOne('unexisting', scope, false, function (resp) {

                    expect(resp.code).toBe(400);
                    expect(resp.message).toBe('There is no ticket with id - unexisting');

                    done()
                });

            }
        );

        it('callback should be called when returned object is filled with received ticket fields', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function (loadedList) {

                expect(loadedList.length).not.toBe(0);

                var id = loadedList[0].id;

                var realtimeTicket = TicketsService.getOne(id, scope, false, function (ticket) {

                    for (var key in ticket) {

                        if (key === 'staticCopy') continue;

                        expect(realtimeTicket[key]).toBe(ticket[key]);
                    }

                    done()
                });

                expect(realtimeTicket).toEqual({id: id});

            });
        });

        it('should be able to receive NOT detailed ticket', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function (loadedList) {

                expect(loadedList.length).not.toBe(0);

                var id = loadedList[0].id;

                var realtimeTicket = TicketsService.getOne(id, scope, false, function (ticket) {
//                        expect(ticket.createdUser).not.toBeUndefined();
                    expect(ticket.number).not.toBeUndefined();
                    expect(ticket.subject).not.toBeUndefined();
                    expect(ticket.status).not.toBeUndefined();
                    expect(ticket.company).not.toBeUndefined();
                    expect(ticket.priorityLevel).not.toBeUndefined();
                    expect(ticket.createdAt).not.toBeUndefined();

                    expect(ticket.note).toBeUndefined();
                    expect(ticket.updates).toBeUndefined();
                    expect(ticket.attachments).toBeUndefined();

                    done()
                });

                expect(realtimeTicket).toEqual({id: id});

            });
        });

        it('should be able to receive detailed ticket', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function (loadedList) {

                expect(loadedList.length).not.toBe(0);

                var id = loadedList[0].id;

                var realtimeTicket = TicketsService.getOne(id, scope, true, function (ticket) {
//                        expect(ticket.createdUser).not.toBeUndefined();
                    expect(ticket.number).not.toBeUndefined();
                    expect(ticket.subject).not.toBeUndefined();
                    expect(ticket.status).not.toBeUndefined();
                    expect(ticket.company).not.toBeUndefined();
                    expect(ticket.priorityLevel).not.toBeUndefined();
                    expect(ticket.createdAt).not.toBeUndefined();

                    expect(ticket.updates).not.toBeUndefined();
                    expect(ticket.note).not.toBeUndefined();

                    done()
                });

                expect(realtimeTicket).toEqual({id: id});

            });
        });

        it('should mark ticket as readed ', function (done) {

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'USER'
            }, function (loadedList) {

                var foundedUnread = false;

                for (var i = 0; i < realtimeTickets.length && !foundedUnread; i++) {

                    var ticket = realtimeTickets[i];

                    if (ticket.unread) {

                        foundedUnread = true;

                        expect(ticket.unread).toBeTruthy();

                        var realtimeTicket = TicketsService.getOne(ticket.id, scope, true, function (ticket) {

                            setTimeout(function () {
                                expect(ticket.unread).toBeFalsy();
                                expect(realtimeTicket.unread).toBeFalsy();

                                done()
                            }, 1000);
                        });
                    }
                }

                if (!foundedUnread) {
                    done();
                }

            });
        });

    });

    describe('createTicket(), getActualNumber() and real-time', function () {
        //        todo add validation testing

        it('should create ticket and add it to list in real-time if new ticket matches list filters', function (done) {

            var actualNumber = undefined;

            TicketsService.getActualNumber(scope, function (num) {

                if (actualNumber) {
                    expect(incrementTicketNumber(actualNumber)).toBe(num);
                }

                actualNumber = num;
            });

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'UNASSIGNED'
            }, function (loadedList) {

                var prevCounts = ticketsCounts.staticCopy();

                TicketsService.createTicket({
                    subject: 'Created from js tests, ' + new Date(),
                    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    company: window.clientUsers[0].company.id,
                    createdUser: window.clientUsers[0].id,
                    priorityLevel: 'MEDIUM'
                }, function (resp) {

                    createdTicketIds.push(resp.id);

                    expect(resp.id).not.toBeUndefined();

                    setTimeout(function () {
                        expect(realtimeTickets[0].id).toBe(resp.id);

                        expect(ticketsCounts.UNASSIGNED).toBe(prevCounts.UNASSIGNED + 1);
                        expect(ticketsCounts.ALL).toBe(prevCounts.ALL + 1);

                        done();
                    }, 3000)

                })
            });
        });

//todo test all filters
        it('should create ticket and NOT add it to list in real-time if new ticket does NOT match list filters', function (done) {

            var actualNumber = undefined;

            TicketsService.getActualNumber(scope, function (num) {

                if (actualNumber) {
                    expect(incrementTicketNumber(actualNumber)).toBe(num);
                }

                actualNumber = num;
            });

            var realtimeTickets = TicketsService.getList(scope, {
                filter: 'UNASSIGNED'
            }, function (loadedList) {

                var firstElemId = loadedList[0].id;

                var prevCounts = ticketsCounts.staticCopy();

                TicketsService.createTicket({
                    subject: 'Created from js tests, ' + new Date(),
                    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    company: window.clientUsers[0].company.id,
                    createdUser: window.clientUsers[0].id,
                    assignedUser: $rootScope.currentUser.id,
                    priorityLevel: 'MEDIUM'
                }, function (resp) {

                    createdTicketIds.push(resp.id);

                    expect(resp.id).not.toBeUndefined();

                    setTimeout(function () {
                        expect(realtimeTickets[0].id).not.toBe(resp.id);
                        expect(realtimeTickets[0].id).toBe(firstElemId);

                        expect(ticketsCounts.UNASSIGNED).toBe(prevCounts.UNASSIGNED);
                        expect(ticketsCounts.USER).toBe(prevCounts.USER + 1);
                        expect(ticketsCounts.CLOSED).toBe(prevCounts.CLOSED);
                        expect(ticketsCounts.SHARED).toBe(prevCounts.SHARED + 1);
                        expect(ticketsCounts.ALL).toBe(prevCounts.ALL + 1);
                        expect(ticketsCounts.SPAM).toBe(prevCounts.SPAM);

                        if ($rootScope.currentUser.role === 'ADMIN') {
                            expect(ticketsCounts.OPEN).toBe(prevCounts.OPEN + 1);
                            expect(ticketsCounts.TRASH).toBe(prevCounts.TRASH);
                        }

                        done();
                    }, 3000)

                })
            });
        });

        function incrementTicketNumber(number) {
            var index = number.indexOf($rootScope.numberCounterDelimiter);
            var numPart,
                newNum;

            if (index > -1) {
                numPart = number.substring(index + 1);
            } else {
                numPart = number;
            }

            newNum = '' + (parseInt(numPart) + 1);

            while (newNum.length < numPart.length) newNum = '0' + newNum;

            if (index > -1) {
                newNum = number.substring(0, index + 1) + newNum;
            }

            return newNum;
        }

    });

    describe('changePriority() and real-time', function () {

        it('when priority is changed - tickets with new priority should be automatically updated and added or removed from ticket list (regarding to filters)', function (done) {

            var lowPriorityTickets = TicketsService.getList(scope.$new(), {
                filter: 'ALL',
                priority: 'LOW'
            });

            var mediumPriorityTickets = TicketsService.getList(scope.$new(), {
                filter: 'ALL',
                priority: 'MEDIUM'
            }, function () {

                var initialMediumTicketsCount = mediumPriorityTickets.length;
                expect(initialMediumTicketsCount).not.toBe(0);

                var ticketIds = [],
                    maxCount = 4;

                for (var i = 0; i < mediumPriorityTickets.length; i++) {
                    ticketIds.push(mediumPriorityTickets[i].id);
                    if (ticketIds.length === maxCount) break;
                }

                TicketsService.changePriority(ticketIds, 'LOW', function () {

                    setTimeout(function () {
                        expect(mediumPriorityTickets.length).toBe(initialMediumTicketsCount - ticketIds.length);

                        var loadedByRealtime = 0;

                        for (var t = 0; t < ticketIds.length; t++) {
                            var ticketId = ticketIds[t];
                            expect(findById(mediumPriorityTickets, ticketId)).toBeUndefined();

                            var ticket = findById(lowPriorityTickets, ticketId);

                            if (ticket) {
                                expect(ticket.priorityLevel).toBe('LOW');
                                loadedByRealtime++;
                            }

                        }

                        expect(loadedByRealtime).not.toBe(0);

                        for (var i = 0; i < ticketIds.length; i++) {

                            (function (ticketId) {
                                TicketsService.changePriority(ticketId, 'MEDIUM', function () {

                                    setTimeout(function () {
                                        expect(findById(lowPriorityTickets, ticketId)).toBeUndefined();

                                        var ticket = findById(mediumPriorityTickets, ticketId);

                                        expect(ticket.priorityLevel).toBe('MEDIUM');
                                        customDone();
                                    }, 3000)

                                })
                            })(ticketIds[i]);
                        }

                        var finishedRequestsCount = 0;

                        function customDone() {

                            finishedRequestsCount++;

                            if (finishedRequestsCount === ticketIds.length) {
                                expect(mediumPriorityTickets.length).toBe(initialMediumTicketsCount);
                                done();
                            }
                        }

                    }, 2000)
                })
            });
        });
    });

    describe('assignTo() and real-time', function () {

        it('when ticket assigned not to current user it should have unread sign with value == true', function (done) {

            var prevCounts = ticketsCounts.staticCopy();

            TicketsService.createTicket({
                subject: 'Created to test assignTo(), ' + new Date(),
                note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, do consequat.',
                company: window.clientUsers[0].company.id,
                createdUser: window.clientUsers[0].id,
                priorityLevel: 'MEDIUM'
            }, function (resp) {

                createdTicketIds.push(resp.id);

                expect(resp.id).not.toBeUndefined();

                setTimeout(function () {
                    expect(ticketsCounts.UNASSIGNED).toBe(prevCounts.UNASSIGNED + 1);
                    expect(ticketsCounts.USER).toBe(prevCounts.USER);
                    expect(ticketsCounts.CLOSED).toBe(prevCounts.CLOSED);
                    expect(ticketsCounts.SHARED).toBe(prevCounts.SHARED);
                    expect(ticketsCounts.ALL).toBe(prevCounts.ALL + 1);
                    expect(ticketsCounts.SPAM).toBe(prevCounts.SPAM);

                    if ($rootScope.currentUser.role === 'ADMIN') {
                        expect(ticketsCounts.TRASH).toBe(prevCounts.TRASH);
                    }

                    var realTimeTicket = TicketsService.getOne(resp.id, scope, false);

                    var userId = window.colleagues[0].id;

                    prevCounts = ticketsCounts.staticCopy();

                    TicketsService.assignTo(resp.id, userId, function () {

                        setTimeout(function () {
                            expect(realTimeTicket.unread).toBeTruthy();
                            expect(realTimeTicket.assignedUser.id).toBe(userId);
                            expect(realTimeTicket.status).toBeNull();

                            expect(ticketsCounts.UNASSIGNED).toBe(prevCounts.UNASSIGNED - 1);
                            expect(ticketsCounts.USER).toBe(prevCounts.USER);
                            expect(ticketsCounts.CLOSED).toBe(prevCounts.CLOSED);
                            expect(ticketsCounts.SHARED).toBe(prevCounts.SHARED);
                            expect(ticketsCounts.ALL).toBe(prevCounts.ALL);
                            expect(ticketsCounts.SPAM).toBe(prevCounts.SPAM);

                            if ($rootScope.currentUser.role === 'ADMIN') {
                                expect(ticketsCounts.OPEN).toBe(prevCounts.OPEN);
                                expect(ticketsCounts.TRASH).toBe(prevCounts.TRASH);
                            }

                            done();
                        }, 3000)
                    })
                }, 2000)
            })
        });

        it('when ticket assigned to current user it should have unread sign with value == false and status IN_PROGRESS (if previously it was not presented)', function (done) {

            TicketsService.createTicket({
                subject: 'Created to test assignTo(), ' + new Date(),
                note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, do consequat.',
                company: window.clientUsers[0].company.id,
                createdUser: window.clientUsers[0].id,
                priorityLevel: 'MEDIUM'
            }, function (resp) {

                createdTicketIds.push(resp.id);

                expect(resp.id).not.toBeUndefined();

                var realTimeTicket = TicketsService.getOne(resp.id, scope, false);

                var userId = $rootScope.currentUser.id;

                TicketsService.assignTo(resp.id, userId, function () {

                    setTimeout(function () {
                        expect(realTimeTicket.unread).toBeFalsy();
                        expect(realTimeTicket.assignedUser.id).toBe(userId);
                        expect(realTimeTicket.status).toBe('IN_PROGRESS');

                        done();
                    }, 3000)
                })
            })
        });

        it('should be able to perform bulk update', function (done) {

            var realTimeTicketsList = TicketsService.getList(scope, {
                filter: 'UNASSIGNED'
            }, function () {

                var initialTicketsCount = realTimeTicketsList.length;
                expect(initialTicketsCount).not.toBe(0);

                var ticketIds = [],
                    realTimeTickets = [],
                    maxCount = 2;

                for (var i = 0; i < realTimeTicketsList.length; i++) {
                    var id = realTimeTicketsList[i].id;
                    ticketIds.push(id);
                    realTimeTickets.push(TicketsService.getOne(id, scope));
                    if (ticketIds.length === maxCount) break;
                }

                var userId = window.colleagues[0].id;

                TicketsService.assignTo(ticketIds, userId, function () {

                    setTimeout(function () {
                        expect(realTimeTicketsList.length).toBe(initialTicketsCount - ticketIds.length);

                        for (var t = 0; t < ticketIds.length; t++) {
                            expect(findById(realTimeTicketsList, ticketIds[t])).toBeUndefined();
                        }

                        for (var i = 0; i < realTimeTickets.length; i++) {
                            var ticket = realTimeTickets[i];
                            expect(ticket.unread).toBeTruthy();
                            expect(ticket.assignedUser.id).toBe(userId);
                        }

                        done();
                    }, 2000)
                })
            });
        });
    });

    describe('changeStatus() and real-time', function () {

        it('when status is changed - tickets with new priority should be automatically updated and added or removed from ticket list (regarding to filters)', function (done) {

            var onHoldTickets = TicketsService.getList(scope.$new(), {
                filter: 'ALL',
                status: 'ON_HOLD'
            });

            var inProgressTickets = TicketsService.getList(scope.$new(), {
                filter: 'ALL',
                status: 'IN_PROGRESS'
            }, function () {

                var initialInProgressTicketsCount = inProgressTickets.length;
                expect(initialInProgressTicketsCount).not.toBe(0);

                var ticketIds = [],
                    maxCount = 4;

                for (var i = 0; i < inProgressTickets.length; i++) {
                    ticketIds.push(inProgressTickets[i].id);
                    if (ticketIds.length === maxCount) break;
                }

                TicketsService.changeStatus(ticketIds, 'ON_HOLD', function () {

                    setTimeout(function () {
                        expect(inProgressTickets.length).toBe(initialInProgressTicketsCount - ticketIds.length);

                        var loadedByRealtime = 0;

                        for (var t = 0; t < ticketIds.length; t++) {
                            var ticketId = ticketIds[t];
                            expect(findById(inProgressTickets, ticketId)).toBeUndefined();

                            var ticket = findById(onHoldTickets, ticketId);

                            if (ticket) {
                                expect(ticket.status).toBe('ON_HOLD');
                                loadedByRealtime++;
                            }
                        }

                        expect(loadedByRealtime).not.toBe(0);

                        for (var i = 0; i < ticketIds.length; i++) {

                            (function (ticketId) {
                                TicketsService.changeStatus(ticketId, 'IN_PROGRESS', function () {

                                    setTimeout(function () {
                                        expect(findById(onHoldTickets, ticketId)).toBeUndefined();

                                        var ticket = findById(inProgressTickets, ticketId);

                                        if (ticket) {
                                            expect(ticket.status).toBe('IN_PROGRESS');
                                        }
                                        customDone();
                                    }, 2000)

                                })
                            })(ticketIds[i]);
                        }

                        var finishedRequestsCount = 0;

                        function customDone() {

                            finishedRequestsCount++;

                            if (finishedRequestsCount === ticketIds.length) {
                                expect(inProgressTickets.length).toBe(initialInProgressTicketsCount);
                                done();
                            }
                        }

                    }, 2000)
                })
            });
        });
    });

    describe('changeSpamFlag() and real-time', function () {

        it('should move tickets from spam and back, if current user is not ADMIN - should throw an error', function (done) {

            var spamTickets = TicketsService.getList(scope.$new(), {
                filter: 'SPAM'
            }, function () {

                var initialSpamTicketsCount = spamTickets.length;
                expect(initialSpamTicketsCount).not.toBe(0);

                var ticketIds = [],
                    maxCount = 4;

                for (var i = 0; i < spamTickets.length; i++) {
                    ticketIds.push(spamTickets[i].id);
                    if (ticketIds.length === maxCount) break;
                }

                var prevCounts = ticketsCounts.staticCopy();

                TicketsService.changeSpamFlag(ticketIds, false, function (resp) {

                    if ($rootScope.currentUser.role != 'ADMIN') {
                        expect(resp.code).toBe(401);
                        expect(resp.message).toBe("Only admin can remove from spam");
                        expect(spamTickets.length).toBe(initialSpamTicketsCount);

                        done();
                        return;
                    }

                    setTimeout(function () {
                        expect(spamTickets.length).toBe(initialSpamTicketsCount - ticketIds.length);

                        for (var i = 0; i < ticketIds.length; i++) {
                            expect(findById(spamTickets, ticketIds[i])).toBeUndefined();
                        }

                        expect(ticketsCounts.SPAM).toBe(prevCounts.SPAM - ticketIds.length);
                        prevCounts = ticketsCounts.staticCopy();

                        TicketsService.changeSpamFlag(ticketIds, true, function () {

                            setTimeout(function () {
                                for (var i = 0; i < ticketIds.length; i++) {
                                    var ticket = findById(spamTickets, ticketIds[i]);
                                    expect(ticket).not.toBeUndefined();
                                    expect(ticket.id).not.toBeUndefined();
                                    expect(ticket.spamPerformer).not.toBeNull();
                                    expect(ticket.spamPerformer.id).toBe($rootScope.currentUser.id);
                                }

                                expect(spamTickets.length).toBe(initialSpamTicketsCount);

                                expect(ticketsCounts.SPAM).toBe(prevCounts.SPAM + ticketIds.length);

                                done();
                            }, 2000)
                        });

                    }, 2000)
                })
            });
        });

        it('should move tickets into spam folder, if current user is not ADMIN - should throw an error while moving from spam', function (done) {

            var realTimeTicketsList = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function () {

                var initialTicketsCount = realTimeTicketsList.length;
                expect(initialTicketsCount).not.toBe(0);

                var ticketIds = [],
                    realTimeTickets = [],
                    maxCount = 2;

                for (var i = 0; i < realTimeTicketsList.length; i++) {
                    var id = realTimeTicketsList[i].id;
                    ticketIds.push(id);
                    realTimeTickets.push(TicketsService.getOne(id, scope));
                    if (ticketIds.length === maxCount) break;
                }

                TicketsService.changeSpamFlag(ticketIds, true, function () {

                    setTimeout(function () {
                        expect(realTimeTicketsList.length).toBe(initialTicketsCount - ticketIds.length);

                        for (var t = 0; t < ticketIds.length; t++) {
                            expect(findById(realTimeTicketsList, ticketIds[t])).toBeUndefined();
                        }

                        for (var i = 0; i < realTimeTickets.length; i++) {
                            var ticket = realTimeTickets[i];
                            expect(ticket.spamPerformer).not.toBeNull();
                            expect(ticket.spamPerformer.id).toBe($rootScope.currentUser.id);
                        }

                        TicketsService.changeSpamFlag(ticketIds, false, function (resp) {

                            if ($rootScope.currentUser.role != 'ADMIN') {
                                expect(resp.code).toBe(401);
                                expect(resp.message).toBe("Only admin can remove from spam");

                                done();
                                return;
                            }

                            setTimeout(function () {

                                for (var i = 0; i < realTimeTickets.length; i++) {
                                    expect(realTimeTickets[i].spamPerformer).toBeNull();
                                }

                                for (var t = 0; t < ticketIds.length; t++) {
                                    expect(findById(realTimeTicketsList, ticketIds[t])).not.toBeUndefined();
                                }

                                done();
                            }, 2000)

                        })
                    }, 2000);
                });
            });
        });
    });

    describe('changeTrashFlag() and real-time', function () {

        it('should move tickets from trash and back, if current user is not ADMIN - should throw an error', function (done) {

            var trashTickets = TicketsService.getList(scope.$new(), {
                filter: 'TRASH'
            }, function () {

                var initialTrashTicketsCount = trashTickets.length;
                expect(initialTrashTicketsCount).not.toBe(0);

                var ticketIds = [],
                    maxCount = 4;

                for (var i = 0; i < trashTickets.length; i++) {
                    ticketIds.push(trashTickets[i].id);
                    if (ticketIds.length === maxCount) break;
                }

                var prevCounts = ticketsCounts.staticCopy();

                TicketsService.changeTrashFlag(ticketIds, false, function (resp) {

                    if ($rootScope.currentUser.role != 'ADMIN') {
                        expect(resp.code).toBe(401);
                        expect(resp.message).toBe("Only admin can delete tickets");
                        expect(trashTickets.length).toBe(initialTrashTicketsCount);

                        done();
                        return;
                    }

                    setTimeout(function () {
                        expect(trashTickets.length).toBe(initialTrashTicketsCount - ticketIds.length);

                        for (var i = 0; i < ticketIds.length; i++) {
                            expect(findById(trashTickets, ticketIds[i])).toBeUndefined();
                        }

                        expect(ticketsCounts.TRASH).toBe(prevCounts.TRASH - ticketIds.length);
                        prevCounts = ticketsCounts.staticCopy();

                        TicketsService.changeTrashFlag(ticketIds, true, function () {

                            setTimeout(function () {
                                for (var i = 0; i < ticketIds.length; i++) {
                                    var ticket = findById(trashTickets, ticketIds[i]);
                                    expect(ticket).not.toBeUndefined();
                                    expect(ticket.id).not.toBeUndefined();
                                    expect(ticket.trash).toBeTruthy();
                                }

                                expect(trashTickets.length).toBe(initialTrashTicketsCount);

                                expect(ticketsCounts.TRASH).toBe(prevCounts.TRASH + ticketIds.length);

                                done();
                            }, 2000)
                        });

                    }, 2000)
                })
            });
        });

        it('should move tickets into trash folder and back, if current user is not ADMIN - should throw an error', function (done) {

            var realTimeTicketsList = TicketsService.getList(scope, {
                filter: 'ALL'
            }, function () {

                var initialTicketsCount = realTimeTicketsList.length;
                expect(initialTicketsCount).not.toBe(0);

                var ticketIds = [],
                    realTimeTickets = [],
                    maxCount = 2;

                for (var i = 0; i < realTimeTicketsList.length; i++) {
                    var id = realTimeTicketsList[i].id;
                    ticketIds.push(id);
                    realTimeTickets.push(TicketsService.getOne(id, scope));
                    if (ticketIds.length === maxCount) break;
                }

                TicketsService.changeTrashFlag(ticketIds, true, function (resp) {

                    if ($rootScope.currentUser.role != 'ADMIN') {
                        expect(resp.code).toBe(401);
                        expect(resp.message).toBe("Only admin can delete tickets");

                        done();
                        return;
                    }

                    setTimeout(function () {
                        expect(realTimeTicketsList.length).toBe(initialTicketsCount - ticketIds.length);

                        for (var t = 0; t < ticketIds.length; t++) {
                            expect(findById(realTimeTicketsList, ticketIds[t])).toBeUndefined();
                        }

                        for (var i = 0; i < realTimeTickets.length; i++) {
                            expect(realTimeTickets[i].trash).toBeTruthy();
                        }

                        TicketsService.changeTrashFlag(ticketIds, false, function () {

                            setTimeout(function () {

                                for (var i = 0; i < realTimeTickets.length; i++) {
                                    expect(realTimeTickets[i].trash).toBeFalsy();
                                }

                                for (var t = 0; t < ticketIds.length; t++) {
                                    expect(findById(realTimeTicketsList, ticketIds[t])).not.toBeUndefined();
                                }

                                done();
                            }, 2000)

                        }, 2000)
                    }, 2000);
                });
            });
        });
    });
});

