describe('TicketsService TicketUpdate', function () {

    var TicketsService, $rootScope, scope;

    var $injector = angular.injector(['ng', 'main.services']);
    TicketsService = $injector.get('TicketsService');
    $rootScope = $injector.get('$rootScope');

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    var ticket;

    it('should create and get new ticket', function (done) {

        TicketsService.createTicket({
            subject: 'Created to test ticket updates , ' + new Date(),
            note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            company: window.clientUsers[0].company.id,
            createdUser: window.clientUsers[0].id,
            assignedUser: window.currentUser.id,
            priorityLevel: 'MEDIUM'
        }, function (resp) {
            ticket = TicketsService.getOne(resp.id, scope, true, function () {
                expect(ticket.assignedUser.id).toBe(window.currentUser.id);
                done();
            })
        })
    });

    describe('saveTicketUpdate() and real-time', function () {

        it('should create ticket update with products and this update should automatically be added to ticket', function (done) {

            TicketsService.saveTicketUpdate(
                ticket.id,
                {
                    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
//                    todo add attachments
//                    attachments: [],
//                    todo add products and services
                    products: [
                        {
                            item: window.products[0],
                            serialNumber: new Date().getTime(),
                            amount: 3
                        }
                    ],
                    sharedBetween: window.colleagues.concat(window.clientUsers)
                },
                false,
                function (resp) {
//  todo add unread flag checking
                    setTimeout(function () {
                        var ticketUpdate = findById(ticket.updates, resp.id);

                        expect(ticketUpdate).not.toBeUndefined();
                        expect(ticket.updates[0].id).toBe(resp.id);
                        expect(ticket.updates[0].sharedBetween.length).toBe(window.colleagues.concat(window.clientUsers).length);
                        expect(ticket.updates[0].products.length).toBe(1);

                        done()
                    }, 2000)
                })

        });

        it('should create ticket update with services and this update should automatically be added to ticket', function (done) {

            TicketsService.saveTicketUpdate(
                ticket.id,
                {
                    note: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
//                    todo add attachments
                    services: [
                        {
                            item: window.services[0],
                            description: 'this service expense was created for testing',
                            amount: 3,
                            date: new Date()
                        }
                    ],
                    sharedBetween: window.colleagues.concat(window.clientUsers)
                },
                false,
                function (resp) {
//  todo add unread flag checking
                    setTimeout(function () {
                        var ticketUpdate = findById(ticket.updates, resp.id);

                        expect(ticketUpdate).not.toBeUndefined();
                        expect(ticket.updates[0].id).toBe(resp.id);
                        expect(ticket.updates[0].sharedBetween.length).toBe(window.colleagues.concat(window.clientUsers).length);
                        expect(ticket.updates[0].services.length).toBe(1);

                        done()
                    }, 2000)
                })
        });

        it('should change ticket updates and reflect this changes using real-time', function (done) {
//todo add products versioning test
            var updates = ticket.updates.staticCopy();

            updates[0].services[0].amount = 5;
            updates[0].note = 'New changed note';
            updates[0].sharedBetween = window.colleagues;

            TicketsService.saveTicketUpdate(ticket.id, updates[0], false,
                function (resp) {
//  todo add unread flag checking
                    setTimeout(function () {
                        var ticketUpdate = findById(ticket.updates, resp.id);

                        expect(ticketUpdate).not.toBeUndefined();
                        expect(ticketUpdate.services[0].amount).toBe(5);
                        expect(ticketUpdate.note).toBe('New changed note');
//                        todo add beter checking
                        expect(ticketUpdate.sharedBetween.length).toBe(window.colleagues.length);

                        customDone()
                    }, 2000)
                });

            updates[1].products[0].amount = 5;
            updates[1].note = 'New changed note';
            updates[1].sharedBetween = window.colleagues;

            TicketsService.saveTicketUpdate(ticket.id, updates[1], false,
                function (resp) {
//  todo add unread flag checking
                    setTimeout(function () {
                        var ticketUpdate = findById(ticket.updates, resp.id);

                        expect(ticketUpdate).not.toBeUndefined();
                        expect(ticketUpdate.products[0].amount).toBe(5);
                        expect(ticketUpdate.note).toBe('New changed note');
//                        todo add beter checking
                        expect(ticketUpdate.sharedBetween.length).toBe(window.colleagues.length);

                        customDone()
                    }, 2000)
                });

            var finishedRequestsCount = 0;

            function customDone() {

                finishedRequestsCount++;

                if (finishedRequestsCount === updates.length) {
                    done();
                }
            }

        });

    })

    describe('deleteTicketUpdate() and real-time', function () {

        it('should delete ticket updates and reflect this changes using real-time', function (done) {

            var id = ticket.updates[0].id,
                updatesCount = ticket.updates.length;

            TicketsService.deleteTicketUpdate(ticket.id, id, function (resp) {
                setTimeout(function () {
                    var ticketUpdate = findById(ticket.updates, id);

                    expect(ticketUpdate).toBeUndefined();

                    expect(ticket.updates.length).toBe(updatesCount - 1);

                    done()
                }, 2000)
            });
        })
    })

    describe('loadRemainingTicketUpdates() and markUpdateAsRead() and real-time', function () {

        var scope;

        beforeEach(function () {
            scope = $rootScope.$new();
        });

        afterEach(function () {
            scope.$destroy();
        });

        var newTicket;

        beforeEach(function (done) {
            TicketsService.createTicket({
                subject: 'Created to test ticket updates , ' + new Date(),
                note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                company: window.clientUsers[0].company.id,
                createdUser: window.clientUsers[0].id,
                assignedUser: window.currentUser.id,
                priorityLevel: 'MEDIUM'
            }, function (resp) {
                newTicket = TicketsService.getOne(resp.id, scope, true, done);
            })
        });

        afterEach(function (done) {
            TicketsService.changeTrashFlag(newTicket.id, true, function (resp) {
                done();
            });
        });

        it('should load remaining ticket updates', function (done) {

            var updatesCount = 10,
                markUpdatesAsReadCount = 3,
                markedAsRead = 0;


            for (var i = 0; i < updatesCount; i++) {

                var update = {
                    note: i + ': Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
                };

                if (i & 1) {
                    update.products = [
                        {
                            item: window.products[0],
                            serialNumber: new Date().getTime(),
                            amount: 3
                        }
                    ];
                } else {
                    update.sharedBetween = window.colleagues.concat(window.clientUsers);
                }

                TicketsService.saveTicketUpdate(newTicket.id, update, false, function (resp) {

                    if (markUpdatesAsReadCount > markedAsRead) {
                        TicketsService.markUpdateAsRead(newTicket.id, resp.id);
                        markedAsRead++;
                    }

                    customDone();

                });
            }

            var finishedRequestsCount = 0;

            function customDone() {

                finishedRequestsCount++;

                if (finishedRequestsCount === updatesCount) {

                    setTimeout(function () {

                        expect(newTicket.updates.length).toBe(updatesCount);

                        var freshTicket = TicketsService.getOne(newTicket.id, scope, true, function () {
                            expect(freshTicket.updates.length).toBe(5);

                            expect(freshTicket.unloadedUpdates).toBe(updatesCount - 5);

                            TicketsService.loadRemainingTicketUpdates(freshTicket, function () {
                                expect(freshTicket.updates.length).toBe(updatesCount);
                                done();
                            })

                        })
                    }, 1000);
                }
            }
        })
    })

});