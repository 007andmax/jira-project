describe('AccountingService', function () {

    var scope;

    var $injector = angular.injector(['ng', 'main.services']),
        $rootScope = $injector.get('$rootScope'),
        Utils = $injector.get('Utils'),
        AccountingService = $injector.get('AccountingService'),
        TicketsService = $injector.get('TicketsService');

    window.scope = $rootScope.$new();

    window.AccountingService = AccountingService;

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('getBillableCompanies()', function () {

        it('should return a list of companies billable data', function (done) {

            var data = AccountingService.getBillableCompanies(scope, function () {

                for (var i = 0; i < data.length; i++) {
                    var companyInfo = data[i];

                    expect(companyInfo.company).not.toBeUndefined();
                    expect(companyInfo.ticketsCount).toBeGreaterThan(0);
                    expect(companyInfo.total).toBeGreaterThan(0);

                }

                done();

            })
        });
    });

    describe('getCompanyBillableTickets()', function () {

        it('should return a list of tickets with expenses', function (done) {

            var data = AccountingService.getBillableCompanies(scope, function () {

                if (data.length > 0) {
                    var tickets = AccountingService.getCompanyBillableTickets(data[0].company.id, scope, function () {

                        for (var i = 0; i < tickets.length; i++) {
                            var ticket = tickets[i];

                            expect(ticket.number).not.toBeUndefined();
                            expect(ticket.subject).not.toBeUndefined();

                            for (var p = 0; p < ticket.productExpenses.length; p++) {
                                var expense = ticket.productExpenses[p];

                                expect(expense.amount).not.toBeUndefined();
                                expect(expense.sum).not.toBeUndefined();

                                //todo remove it later
                                expect(expense.description).not.toBeUndefined();

                                expect(expense.item).not.toBeUndefined();
                                expect(expense.item).not.toBeNull();
                                expect(expense.item.name).not.toBeUndefined();
                            }

                            for (var s = 0; s < ticket.serviceExpenses.length; s++) {
                                var expense = ticket.serviceExpenses[s];

                                expect(expense.amount).not.toBeUndefined();
                                expect(expense.sum).not.toBeUndefined();

                                //todo remove it later
                                expect(expense.description).not.toBeUndefined();

                                expect(expense.item).not.toBeUndefined();
                                expect(expense.item).not.toBeNull();
                                expect(expense.item.name).not.toBeUndefined();
                            }

                            done();
                        }
                    })
                }
            })
        });
    });

    describe('real-time', function () {

        it('should update data in real-time', function (done) {

            var data = AccountingService.getBillableCompanies(scope, function () {

                if (data.length > 0) {

                    var companyInfo = data[0],
                        oldCompanyInfo = companyInfo.staticCopy();

                    var tickets = AccountingService.getCompanyBillableTickets(companyInfo.company.id, scope, function () {

                        var oldTicketsLength = tickets.length;

                        if (tickets.length > 0) {

                            var ticket = tickets[0],
                                ticketSum = 0;

                            for (var p = 0; p < ticket.productExpenses.length; p++) {
                                ticketSum += ticket.productExpenses[p].sum;
                            }

                            for (var s = 0; s < ticket.serviceExpenses.length; s++) {
                                ticketSum += ticket.serviceExpenses[s].sum;
                            }

                            TicketsService.changeStatus(ticket.id, 'ON_HOLD', function () {

                                setTimeout(function () {
                                    expect(companyInfo.total).toBe(oldCompanyInfo.total - ticketSum);
                                    expect(companyInfo.ticketsCount).toBe(oldCompanyInfo.ticketsCount - 1);

                                    expect(tickets.length).toBe(oldTicketsLength - 1);
                                    expect(Utils.findById(tickets, ticket.id)).toBeUndefined();


                                    TicketsService.changeStatus(ticket.id, 'COMPLETED', function () {

                                        setTimeout(function () {
                                            expect(companyInfo.total).toBe(oldCompanyInfo.total);
                                            expect(companyInfo.ticketsCount).toBe(oldCompanyInfo.ticketsCount);

                                            expect(tickets.length).toBe(oldTicketsLength);
                                            expect(Utils.findById(tickets, ticket.id)).not.toBeUndefined();

                                            done();
                                        }, 2000);

                                    });
                                }, 2000);

                            });
                        }
                    })
                }
            })
        });
    });

});