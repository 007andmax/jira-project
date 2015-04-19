describe('FilesService', function () {

    var watchTime = 10000;

    var $injector = angular.injector(['ng', 'main.services']),
        $rootScope = $injector.get('$rootScope'),
        TicketsService = $injector.get('TicketsService'),
        Utils = $injector.get('Utils'),
        FilesService = $injector.get('FilesService');

    var funcs;

    beforeEach(function () {
        funcs = {
            onProcess: function () {

            },
            onError: function () {

            }
        };

        spyOn(funcs, 'onProcess');
        spyOn(funcs, 'onError');

    });

    describe('test all stuff on images', function () {

        it('should create an image show it in preview and delete it from server', function (done) {

            var input = $('<input type="file" accept="image">');

            $('body').append(input);

            input.on('change', function (e) {

                var image = FilesService.create(input[0].files[0], funcs.onProcess, function (resp) {

                    //input.remove()

                    expect(resp).toBe(image);

                    expect(funcs.onProcess).toHaveBeenCalled();
                    expect(funcs.onError).not.toHaveBeenCalled();

                    var img = $('<img src="file/' + image.id + '" width="250px", height="250px"/>');
                    var thumb = $('<img src="file/' + image.id + '/thumbnail" width="250px", height="250px"/>');

                    setTimeout(function () {
                        $('body').append(img);
                        $('body').append(thumb);
                    }, 2000);

                    var metadata = FilesService.getMetadata(image.id, function (resp) {
                        expect(metadata).toBe(resp);

                        setTimeout(function () {

                            FilesService.remove(image.id, function (resp) {

                                FilesService.getMetadata(image.id, function (resp) {
                                    expect(resp.code).toBe(500);
                                    //expect(resp.message.indexOf('File is not exist')).toBeGreaterThan(-1);

                                    img.remove();
                                    thumb.remove();
                                    done()
                                });
                            });
                        }, watchTime)

                    });

                }, funcs.onError);

                input.off('change');
            });

            alert('Please choose an image')

        });
    });

    describe('test all stuff on pdf', function () {

        it('should create a pdf file instance show it in preview and delete it from server', function (done) {

            var input = $('<input type="file" accept="application/pdf">');

            $('body').append(input);

            input.on('change', function (e) {

                var pdf = FilesService.create(input[0].files[0], funcs.onProcess, function (resp) {

                    //input.remove();

                    expect(resp).toBe(pdf);

                    expect(funcs.onProcess).toHaveBeenCalled();
                    expect(funcs.onError).not.toHaveBeenCalled();

                    var thumb = $('<img src="file/' + pdf.id + '/thumbnail" width="250px" height="250px"/>');
                    var preview = $(' <object data="file/' + pdf.id + '/webview" type="application/pdf" width="400px" height="400px">  </object>');

                    setTimeout(function () {
                        $('body').append(thumb);
                        $('body').append(preview);
                    }, 2000);

                    var metadata = FilesService.getMetadata(pdf.id, function (resp) {
                        expect(metadata).toBe(resp);

                       // expect(resp).toEqual(pdf);

                        setTimeout(function () {

                            FilesService.remove(pdf.id, function (resp) {

                                FilesService.getMetadata(pdf.id, function (resp) {
                                    expect(resp.code).toBe(500);
                     //               expect(resp.message.indexOf('File is not exist')).toBeGreaterThan(-1);

                                    //thumb.remove();
                                    //preview.remove();
                                    done()
                                });
                            });
                        }, watchTime)
                    });

                }, funcs.onError);

                input.off('change');
            });

            alert('Please choose a pdf file')

        });
    });

     describe('test all stuff on doc', function () {

        it('should create a doc file instance show it in preview and delete it from server', function (done) {

            var input = $('<input type="file" accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">');

            $('body').append(input);

            input.on('change', function (e) {

                var doc = FilesService.create(input[0].files[0], funcs.onProcess, function (resp) {

                    //input.remove();

                    expect(resp).toBe(doc);

                    expect(funcs.onProcess).toHaveBeenCalled();
                    expect(funcs.onError).not.toHaveBeenCalled();

                    var thumb = $('<img src="file/' + doc.id + '/thumbnail" width="250px" height="250px"/>');
                    var preview = $(' <object data="file/' + doc.id + '/webview" type="application/pdf" width="400px" height="400px">  </object>');

                    setTimeout(function () {
                        $('body').append(thumb);
                        $('body').append(preview);
                    }, 2000);

                    var metadata = FilesService.getMetadata(doc.id, function (resp) {
                        expect(metadata).toBe(resp);

                       // expect(resp).toEqual(doc);

                        setTimeout(function () {

                            FilesService.remove(doc.id, function (resp) {

                                FilesService.getMetadata(doc.id, function (resp) {
                                    expect(resp.code).toBe(500);
                                //    expect(resp.message.indexOf('File is not exist')).toBeGreaterThan(-1);

                                    //thumb.remove();
                                    //preview.remove();
                                    done()
                                });
                            });
                        }, watchTime)
                    });

                }, funcs.onError);

                input.off('change');
            });

            alert('Please choose a doc file');

        });
    });

    describe('test all stuff on Excel', function () {

        it('should create a doc file instance show it in preview and delete it from server', function (done) {

            var input = $('<input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">');

            $('body').append(input);

            input.on('change', function (e) {

                var excel = FilesService.create(input[0].files[0], funcs.onProcess, function (resp) {

                    //input.remove();

                    expect(resp).toBe(excel);

                    expect(funcs.onProcess).toHaveBeenCalled();
                    expect(funcs.onError).not.toHaveBeenCalled();

                    var thumb = $('<img src="file/' + excel.id + '/thumbnail" width="250px" height="250px"/>');
                    var preview = $(' <object data="file/' + excel.id + '/webview" type="application/pdf" width="400px" height="400px">  </object>');

                    setTimeout(function () {
                        $('body').append(thumb);
                        $('body').append(preview);
                    }, 2000);

                    var metadata = FilesService.getMetadata(excel.id, function (resp) {
                        expect(metadata).toBe(resp);

                       // expect(resp).toEqual(excel);

                        setTimeout(function () {

                            FilesService.remove(excel.id, function (resp) {

                                FilesService.getMetadata(excel.id, function (resp) {
                                    expect(resp.code).toBe(500);
                                    //expect(resp.message.indexOf('File is not exist')).toBeGreaterThan(-1);

                                    //thumb.remove();
                                    //preview.remove();
                                    done()
                                });
                            });
                        }, watchTime)
                    });

                }, funcs.onError);

                input.off('change');
            });

            alert('Please choose a excel file')

        });
    });

    describe('test creating ticket attachments', function () {

        var scope;

        beforeEach(function () {
            scope = $rootScope.$new();
        });

        afterEach(function () {
            scope.$destroy();
        });

        it('should create a some files instances create and update ticket with that attachments', function (done) {

            var input = $('<input type="file" multiple accept="image,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">');

            $('body').append(input);

            input.on('change', function (e) {

                var filesCount = input[0].files.length,
                    createTicketAttachments = [],
                    updateTicketAttachments = [];

                for (var i = 0; i < filesCount; i++) {

                    if (i & 1) {
                        createTicketAttachments.push(FilesService.create(input[0].files[i], funcs.onProcess, customDone, funcs.onError));
                    } else {
                        updateTicketAttachments.push(FilesService.create(input[0].files[i], funcs.onProcess, customDone, funcs.onError));
                    }

                }

                var finishedRequestsCount = 0;

                function customDone() {

                    finishedRequestsCount++;

                    if (finishedRequestsCount === filesCount) {
                        // todo describe attachmetns in tickets doc!
                        TicketsService.createTicket({
                            subject: 'Created from js tests, ' + new Date(),
                            note: 'This ticket was created to test attachments',
                            company: window.clientUsers[0].company.id,
                            createdUser: window.clientUsers[0].id,
                            assignedUser: $rootScope.currentUser.id,
                            attachFileIds: createTicketAttachments.map(function (file) {
                                return file.id
                            }),
                            priorityLevel: 'MEDIUM'
                        }, function (resp) {

                            var ticket = TicketsService.getOne(resp.id, scope, false);

                            var detTicket = TicketsService.getOne(resp.id, scope, true, function (resp) {

                                setTimeout(function () {
                                    expect(ticket.hasAttachments).toBeTruthy();
                                    expect(detTicket.attachments.length).toBe(createTicketAttachments.length);

                                    for (var i = 0; i < createTicketAttachments.length; i++) {
                                        var attachment = Utils.findById(detTicket.attachments, createTicketAttachments[i].id);
                                        expect(attachment).not.toBeUndefined();
                                        expect(attachment.name).toBe(createTicketAttachments[i].name);
                                        expect(attachment.size).toBe(createTicketAttachments[i].size);
                                    }

                                    var update = {
                                        note: 'Add few attachments',
                                        attachments: updateTicketAttachments
                                    };

                                    TicketsService.saveTicketUpdate(ticket.id, update, false, function (resp) {

                                        setTimeout(function () {

                                            var update = Utils.findById(detTicket.updates, resp.id);

                                            expect(update.attachments.length).toBe(updateTicketAttachments.length);

                                            for (var i = 0; i < updateTicketAttachments.length; i++) {
                                                var attachment = Utils.findById(update.attachments, updateTicketAttachments[i].id);
                                                expect(attachment).not.toBeUndefined();
                                                expect(attachment.name).toBe(updateTicketAttachments[i].name);
                                                expect(attachment.size).toBe(updateTicketAttachments[i].size);
                                            }

                                            //todo finish it!
                                            TicketsService.deleteTicketUpdate(ticket.id, id, function (resp) {
                                                setTimeout(function () {
                                                    var ticketUpdate = findById(ticket.updates, id);

                                                    expect(ticketUpdate).toBeUndefined();

                                                    expect(ticket.updates.length).toBe(updatesCount - 1);

                                                    done()
                                                }, 2000)
                                            });

                                            TicketsService.changeTrashFlag(ticket.id, true);

                                            done();
                                        }, 2000);
                                    });
                                }, 2000);
                            });
                        });
                    }
                }
            });

            alert('Please choose some ticket attachments')
        });
    });
});