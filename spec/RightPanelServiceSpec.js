describe('RightPanelService', function () {

    var scope;

    var $injector = angular.injector(['ng', 'main.services']),
        RightPanelService = $injector.get('RightPanelService'),
        TicketsService = $injector.get('TicketsService'),
        CompaniesService = $injector.get('CompaniesService'),
        Utils = $injector.get('Utils'),
        $rootScope = $injector.get('$rootScope');
    window.RightPanelService = RightPanelService
    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('getActivities()', function () {

        it('should return list of activities', function (done) {

            var activities = RightPanelService.getActivities(scope, undefined, function (resp) {

                expect(activities).not.toBeUndefined();
                expect(activities.length).toBeGreaterThan(0);

                done();
            });
        })

        it('should search activities by description', function (done) {

            var activities = RightPanelService.getActivities(scope, 'update', function (resp) {

                for (var i = 0; i < activities.length; i++) {
                    expect(activities[i].description.indexOf('update')).toBeGreaterThan(-1);
                }

                done();
            });
        })

        it('should load activities in real-time', function (done) {

            var activities = RightPanelService.getActivities(scope, undefined, function (resp) {

                var prevFirstActivity = activities[0];

                var tickets = TicketsService.getList(scope, {
                    filter: 'USER'
                }, function (loadedList) {

                    var ticket = tickets[0];

                    TicketsService.saveTicketUpdate(
                        ticket.id,
                        {
                            note: 'This is to test activities real-time 1'
                        },
                        false,
                        function (resp) {

                            setTimeout(function () {

                                var activity = activities[0];

                                expect(activity.id).not.toBe(prevFirstActivity.id);
                                expect(activity.user.id).toBe(window.currentUser.id);
                                expect(activity.action).toBe('ticket_note');
                                expect(activity.description).toBe('Added a note to Ticket# ' + ticket.number);

                                done()
                            }, 1000)
                        })
                });

            });
        });

        it('should filter activities in real-time', function (done) {

            var activities = RightPanelService.getActivities(scope, 'update', function (resp) {

                var prevFirstActivity = activities[0];

                var tickets = TicketsService.getList(scope, {
                    filter: 'USER'
                }, function (loadedList) {

                    var ticket = tickets[0];

                    TicketsService.saveTicketUpdate(
                        ticket.id,
                        {
                            note: 'This is to test activities real-time 2'
                        },
                        false,
                        function (resp) {

                            setTimeout(function () {

                                expect(activities[0].id).toBe(prevFirstActivity.id);

                                done()
                            }, 1000)
                        })
                });

            });
        })

    });

    describe('loadMoreActivities()', function () {

        it('should load next bunch of activities and add them into array', function (done) {

            var activities = RightPanelService.getActivities(scope, undefined, function (resp) {

                var activitiesCount = activities.length;

                RightPanelService.loadMoreActivities(scope, function () {
                    expect(activities.length).toBe(activitiesCount * 2);
                    done();
                })
            });
        });

        it('should load next bunch of activities regarding to search keyword', function (done) {

            var activities = RightPanelService.getActivities(scope, 'update', function (resp) {

                RightPanelService.loadMoreActivities(scope, function () {

                    for (var i = 0; i < activities.length; i++) {
                        expect(activities[i].description.indexOf('update')).toBeGreaterThan(-1);
                    }
                    done();
                })
            });
        })

    });

    describe('getRecentActivities()', function () {

        it('should return list of 3 last activities', function () {

            var activities = RightPanelService.getRecentActivities();

            expect(activities).not.toBeUndefined();
            expect(activities.length).toBe(3);
        });

        it('should update returned list in real-time', function (done) {

            var activities = RightPanelService.getRecentActivities();

            var prevFirstActivity = activities[0];

            var tickets = TicketsService.getList(scope, {
                filter: 'USER'
            }, function (loadedList) {

                var ticket = tickets[0];

                TicketsService.saveTicketUpdate(
                    ticket.id,
                    {
                        note: 'This is to test activities real-time 1'
                    },
                    false,
                    function (resp) {

                        setTimeout(function () {

                            var activity = activities[0];

                            expect(activity.id).not.toBe(prevFirstActivity.id);
                            expect(activity.user.id).toBe(window.currentUser.id);
                            expect(activity.action).toBe('ticket_note');
                            expect(activity.description).toBe('Added a note to Ticket# ' + ticket.number);

                            expect(activities.length).toBe(3);

                            done()
                        }, 1000)
                    })
            });
        })

    });

    describe('getClientCompaniesGroupedData()', function () {

        it('should return list grouped data for child companies', function () {

            var dataList = RightPanelService.getClientCompaniesGroupedData();
            var clientCompanies = CompaniesService.getClientCompanies();

            expect(dataList.length).toBe(clientCompanies.length);

            for (var i = 0; i < dataList.length; i++) {

                var data = dataList[i];

                expect(Utils.findById(clientCompanies, data.company.id)).not.toBeUndefined();
            }

        })
    });

    describe('getCurrentUserInfo()', function () {

        it('should return user information for right side panel and update it in real-time', function (done) {

            var userInfo = RightPanelService.getCurrentUserInfo(scope, function () {
                expect(userInfo).not.toBeUndefined();

                var old = userInfo.staticCopy(),
                    increaseSpentTimeTo = 3;

                var realtimeTickets = TicketsService.getList(scope, {
                    filter: 'USER'
                }, function (loadedTickets) {

                    TicketsService.saveTicketUpdate(
                        loadedTickets[0].id,
                        {
                            note: 'this is to test spent time',
                            services: [
                                {
                                    item: window.services[0],
                                    description: 'this service expense was created for testing',
                                    amount: increaseSpentTimeTo,
                                    date: new Date()
                                }
                            ],
                            sharedBetween: window.colleagues.concat(window.clientUsers)
                        },
                        false,
                        function (resp) {

                            setTimeout(function () {
                                expect(userInfo.spentTime).toBe(old.spentTime + increaseSpentTimeTo);

                                done()
                            }, 2000)
                        })
                });

            });
        })
    });

   describe('getClientCompanyInfo()', function () {

        it('should return company information for right side panel and update it in real-time', function (done) {

            var companyInfo = RightPanelService.getClientCompanyInfo(scope, window.clientUsers[0].company.id, function () {
                expect(companyInfo).not.toBeUndefined();

                var old = companyInfo.staticCopy();

                TicketsService.createTicket({
                    subject: 'Created from js tests, ' + new Date(),
                    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                    company: window.clientUsers[0].company.id,
                    createdUser: window.clientUsers[0].id,
                    assignedUser: $rootScope.currentUser.id,
                    priorityLevel: 'MEDIUM'
                }, function (resp) {

                    setTimeout(function () {
                        expect(companyInfo.openTickets).toBe(old.openTickets + 1);

                        done();
                    }, 2000)

                })
            });
        })
    });

});