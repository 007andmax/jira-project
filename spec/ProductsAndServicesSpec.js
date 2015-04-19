describe('UsersService', function () {

    var scope;

    var ProductsService = $injector.get('ProductsService'),
        ServicesService = $injector.get('ServicesService'),
        Utils = $injector.get('Utils');

    window.ProductsService = ProductsService;

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    //  todo implement tests
    describe('ProductsService', function () {

        describe('getCategories()', function () {

            it('should return list of product categories for current company', function () {

                var categories = ProductsService.getCategories(function () {
                    expect(categories).not.toBeUndefined();
                    //expect(user.id).toBe(window.currentUser.id);
                    //expect(user.firstName).toBe(window.currentUser.firstName);
                    //expect(user.lastName).toBe(window.currentUser.lastName);
                });
            })
        });

    });

});