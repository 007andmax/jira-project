describe('TicketTagsService', function () {

    var TicketTagsService, TicketsService, $rootScope, scope;

    var $injector = angular.injector(['ng', 'main.services']);
    TicketTagsService = $injector.get('TicketTagsService');
    TicketsService = $injector.get('TicketsService');
    $rootScope = $injector.get('$rootScope');

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('getList()', function () {

        it('should return list of user tags', function (done) {

            var tags = TicketTagsService.getList($rootScope.$new(), function (resp) {

                expect(tags.length).toBe(resp.length);

                if (tags.length > 0) {
                    expect(tags[0].id).toBe(resp[0].id);
                }
                done();
            })
        })
    })

    describe('save() and deleteTag()', function () {

        var tags;

        beforeEach(function (done) {
            tags = TicketTagsService.getList(scope, done)
        });

        it('should create 2 tags and add them to tags list in real-time', function (done) {

            var prevTagsLength = tags.length;

            TicketTagsService.save({
                "name": "Onsite",
                "color": "2"
            }, function (resp) {

                setTimeout(function () {
                    expect(tags.length).toBeGreaterThan(prevTagsLength);

                    var tag = findById(tags, resp.id);

                    expect(tag.name).toBe("Onsite");
                    expect(tag.color).toBe(2);

                    customDone();
                }, 2000);
            });

            TicketTagsService.save({
                "name": "Devices",
                "color": "5"
            }, function (resp) {

                setTimeout(function () {
                    expect(tags.length).toBeGreaterThan(prevTagsLength);

                    var tag = findById(tags, resp.id);

                    expect(tag.name).toBe("Devices");
                    expect(tag.color).toBe(5);

                    customDone();
                }, 2000);
            });

            var finishedRequestsCount = 0;

            function customDone() {

                finishedRequestsCount++;

                if (finishedRequestsCount === 2) {
                    expect(tags.length).toBe(prevTagsLength + 2);
                    done();
                }
            }
        });

        it('should update 2 tags and refresh them in tags list in real-time', function (done) {

            var tag0 = tags[0],
                saveTag0 = tag0.staticCopy();

            saveTag0.name = 'Loren ipsum';
            saveTag0.color = 1;

            TicketTagsService.save(saveTag0, function (resp) {

                setTimeout(function () {
                    expect(saveTag0.id).toBe(resp.id);
                    expect(tag0.id).toBe(resp.id);
                    expect(tag0.name).toBe(saveTag0.name);
                    expect(tag0.color).toBe(saveTag0.color);

                    customDone();
                }, 3000);
            });

            var tag1 = tags[1],
                saveTag1 = tag1.staticCopy();

            saveTag1.name = 'Dolor sit';
            saveTag1.color = 1;

            TicketTagsService.save(saveTag1, function (resp) {

                setTimeout(function () {
                    expect(saveTag1.id).toBe(resp.id);
                    expect(tag1.id).toBe(resp.id);
                    expect(tag1.name).toBe(saveTag1.name);
                    expect(tag1.color).toBe(saveTag1.color);

                    customDone();
                }, 3000);
            });

            var finishedRequestsCount = 0;

            function customDone() {

                finishedRequestsCount++;

                if (finishedRequestsCount === 2) {
                    done();
                }
            }
        });

        it('should throw a validation error when put invalid data', function (done) {

            var tag1 = tags[0].staticCopy();

            tag1.color = -2;

            TicketTagsService.save(tag1, function (resp) {
                expect(resp.code).toBe(400);
                //expect(resp.message).toBe("data is not valid");
                customDone();
            });

            tag1 = tags[0].staticCopy();

            tag1.name = '';

            TicketTagsService.save(tag1, function (resp) {
                expect(resp.code).toBe(400);
                //expect(resp.message).toBe("data is not valid");
                customDone();
            });

            TicketTagsService.save({}, function (resp) {
                expect(resp.code).toBe(400);
                //expect(resp.message).toBe("data is not valid");
                customDone();
            });

            TicketTagsService.save({
                name: "Loren ipsum dolor sit amet... maximal length should be 16 characters !!",
                color: 50
            }, function (resp) {
                expect(resp.code).toBe(400);
                //expect(resp.message).toBe("data is not valid");
                customDone();
            });

            var finishedRequestsCount = 0;

            function customDone() {

                finishedRequestsCount++;

                if (finishedRequestsCount === 4) {
                    done();
                }
            }
        });

        it('should delete two tickets and reflect this changes by real-time', function (done) {

            if (tags.length == 0) return done();

            var firstTagId = tags[0].id,
                initialTagsLength = tags.length;

            TicketTagsService.deleteTag(firstTagId, function () {

                setTimeout(function () {
                    expect(tags[0].id).not.toBe(firstTagId);
                    expect(tags.length).toBe(initialTagsLength - 1);

                    if (tags.length == 0) return done();

                    firstTagId = tags[0].id;

                    TicketTagsService.deleteTag(firstTagId, function () {

                        setTimeout(function () {

                            if (tags[0]) expect(tags[0].id).not.toBe(firstTagId);

                            expect(tags.length).toBe(initialTagsLength - 2);

                            done();
                        }, 1000)
                    })
                }, 1000)
            })
        })

    });

    describe('link() and all related real-time features (with tickets)', function () {

        var ticketsList,
            detailedTicket,
            tags,
            createdTags = [];

        beforeEach(function (done) {
            ticketsList = TicketsService.getList(scope.$new(), {filter: 'ALL'}, function () {
                detailedTicket = TicketsService.getOne(ticketsList[0].id, scope, true, done);
            });
        });

        beforeEach(function (done) {

            TicketTagsService.save({
                "name": "Onsite",
                "color": "2"
            }, function (resp) {

                createdTags.push(resp.id);

                TicketTagsService.save({
                    "name": "Devices",
                    "color": "5"
                }, function (resp) {
                    createdTags.push(resp.id);
                    setTimeout(function () {
                        tags = TicketTagsService.getList(scope, done);
                    }, 3000);
                });
            });
        });

        afterEach(function () {
            for (var i = 0; i < createdTags.length; i++) {
                TicketTagsService.deleteTag(createdTags[i]);
            }
        });

        it('should link tickets with tags and refresh tags data in real-time', function (done) {

            var linkTicketsCount = 3,
                linkMap = {};

            linkTicketsCount = ticketsList.length > linkTicketsCount ? linkTicketsCount : ticketsList.length;

            for (var i = 0; i < linkTicketsCount; i++) {

                var tagIds = [];

                var linkTagsCount = i & 2 ? createdTags.length : 1;

                for (var ct = 0; ct < linkTagsCount; ct++) {
                    tagIds.push(createdTags[ct]);
                }

                linkMap[ticketsList[i].id] = tagIds;
            }

            TicketTagsService.link(linkMap, function () {

                setTimeout(function () {
                    for (var i = 0; i < linkTicketsCount; i++) {
                        var ticket = ticketsList[i];

                        expect(ticket.tags.length).toBe(linkMap[ticket.id].length);

                        for (var t = 0; t < ticket.tags.length; t++) {
                            var tag = findById(ticket.tags, linkMap[ticket.id][t]);
                            expect(tag).not.toBeUndefined();
                        }
                    }

                    for (var t = 0; t < detailedTicket.tags.length; t++) {
                        var tag = findById(ticket.tags, linkMap[detailedTicket.id][t]);
                        expect(tag).not.toBeUndefined();
                    }

                    done()
                }, 2000);
            })

        })

    });

});