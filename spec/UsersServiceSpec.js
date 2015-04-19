describe('UsersService', function () {

    var scope;

    var $injector = angular.injector(['ng', 'main.services']),
        UsersService = $injector.get('UsersService'),
        Utils = $injector.get('Utils'),
        $rootScope = $injector.get('$rootScope');

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('getCurrentUser()', function () {

        it('should return currently authorized user', function () {

            var user = UsersService.getCurrentUser();

            expect(user).not.toBeUndefined();
            expect(user.id).toBe(window.currentUser.id);
            expect(user.firstName).toBe(window.currentUser.firstName);
            expect(user.lastName).toBe(window.currentUser.lastName);
        })
    });

    describe('getAllUsers()', function () {

        it('should return list of all available users', function () {

            var users = UsersService.getAllUsers();

            expect(users).not.toBeUndefined();
            expect(users.length).toBeGreaterThan(0);

            expect(Utils.findById(users, window.currentUser.id)).not.toBeUndefined();

            for(var i = 0; i < window.clientUsers.length; i++){
                expect(Utils.findById(users, window.clientUsers[i].id)).not.toBeUndefined();
            }

            for(var i = 0; i < window.colleagues.length; i++){
                expect(Utils.findById(users, window.colleagues[i].id)).not.toBeUndefined();
            }

        })
    });

    describe('getClientUsers()', function () {

        it('should return  list of users from all client companies', function () {

            var users = UsersService.getClientUsers();

            expect(users).not.toBeUndefined();
            expect(users.length).toBeGreaterThan(0);

            expect(Utils.findById(users, window.currentUser.id)).toBeUndefined();

            for(var i = 0; i < window.clientUsers.length; i++){
                expect(Utils.findById(users, window.clientUsers[i].id)).not.toBeUndefined();
            }

            for(var i = 0; i < window.colleagues.length; i++){
                expect(Utils.findById(users, window.colleagues[i].id)).toBeUndefined();
            }

        })
    });

    describe('getAllByCompanyId()', function () {

        it('should return list of users by companyId', function () {

            var users = UsersService.getAllByCompanyId(window.currentUser.company.id);

            expect(users).not.toBeUndefined();
            expect(users.length).toBeGreaterThan(0);

            expect(Utils.findById(users, window.currentUser.id)).not.toBeUndefined();

            for(var i = 0; i < window.clientUsers.length; i++){
                expect(Utils.findById(users, window.clientUsers[i].id)).toBeUndefined();
            }

            for(var i = 0; i < window.colleagues.length; i++){
                expect(Utils.findById(users, window.colleagues[i].id)).not.toBeUndefined();
            }

        })
    });

    describe('getOneById()', function () {

        it('should return a user by id', function () {

            expect(UsersService.getOneById(window.currentUser.id).id).toBe(window.currentUser.id);

            for(var i = 0; i < window.clientUsers.length; i++){
                expect(UsersService.getOneById(window.clientUsers[i].id).id).toBe(window.clientUsers[i].id);
            }

            for(var i = 0; i < window.colleagues.length; i++){
                expect(UsersService.getOneById(window.colleagues[i].id).id).toBe(window.colleagues[i].id);
            }
        })
    });

});