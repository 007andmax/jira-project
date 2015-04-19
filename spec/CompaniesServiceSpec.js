describe('CompaniesService', function () {

    var scope;

    var $injector = angular.injector(['ng', 'main.services']),
        CompaniesService = $injector.get('CompaniesService'),
        Utils = $injector.get('Utils'),
        $rootScope = $injector.get('$rootScope');

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('getCurrentCompany()', function () {

        it('should return company of currently authorized user', function () {

            var company = CompaniesService.getCurrentCompany();

            expect(company).not.toBeUndefined();
            expect(company.id).toBe(window.currentUser.company.id);
        })
    });

    describe('getClientCompanies()', function () {

        it('should return list of client companies', function () {

            var companies = CompaniesService.getClientCompanies();

            expect(companies).not.toBeUndefined();
            expect(companies.length).toBeGreaterThan(0);

            expect(Utils.findById(companies, window.currentUser.company.id)).toBeUndefined();

            for (var i = 0; i < window.clientUsers.length; i++) {
                expect(Utils.findById(companies, window.clientUsers[i].company.id)).not.toBeUndefined();
            }
        })
    });

    describe('getAllCompanies()', function () {

        it('should return list of all available companies', function () {

            var companies = CompaniesService.getAllCompanies();

            expect(companies).not.toBeUndefined();
            expect(companies.length).toBeGreaterThan(0);

            expect(Utils.findById(companies, window.currentUser.company.id)).not.toBeUndefined();

            for (var i = 0; i < window.clientUsers.length; i++) {
                expect(Utils.findById(companies, window.clientUsers[i].company.id)).not.toBeUndefined();
            }
        })
    });

    describe('getOneById()', function () {

        it('should return a company by id', function () {

            expect(CompaniesService.getOneById(window.currentUser.company.id).id).toBe(window.currentUser.company.id);

            for (var i = 0; i < window.clientUsers.length; i++) {
                expect(CompaniesService.getOneById(window.clientUsers[i].company.id).id).toBe(window.clientUsers[i].company.id);
            }

            for (var i = 0; i < window.colleagues.length; i++) {
                expect(CompaniesService.getOneById(window.colleagues[i].company.id).id).toBe(window.colleagues[i].company.id);
            }
        })
    });

});