describe('ProductsService', function () {

    var ProductsService = $injector.get('ProductsService'),
        Utils = $injector.get('Utils'),
        scope;

    beforeEach(function () {
        scope = $rootScope.$new();
    });

    afterEach(function () {
        scope.$destroy();
    });

    describe('saveCategory() and deleteCategory()', function () {

        it('should create and delete category', function (done) {

            ProductsService.saveCategory({
                name: 'Test category'
            }, function (resp) {

                var categories = ProductsService.getCategories(function () {

                    var category = Utils.findById(categories, resp.id);

                    expect(category).not.toBeUndefined();
                    expect(category.name).toBe('Test category');

                    ProductsService.deleteCategory(category.id, function (resp) {

                        expect(resp).toEqual({});

                        categories = ProductsService.getCategories(function () {

                            expect(Utils.findById(categories, category.id)).toBeUndefined();

                            ProductsService.deleteCategory(category.id, function (resp) {
                                expect(resp.code).toBe(500);
                                done();
                            })
                        });
                    });
                });
            });
        });
    });

    describe('getCategories()', function () {

        it('should return list of categories', function (done) {

            var categories = ProductsService.getCategories();
            var realTimeCategories = ProductsService.getCategories(scope, function () {

                ProductsService.saveCategory({
                    name: 'Test category'
                }, function (resp) {

                    setTimeout(function () {

                        expect(Utils.findById(categories, resp.id)).toBeUndefined();

                        var category = Utils.findById(realTimeCategories, resp.id);

                        expect(category).not.toBeUndefined();
                        expect(category.name).toBe('Test category');

                        var editCategory = category.staticCopy();
                        editCategory.name = 'New name';

                        ProductsService.saveCategory(editCategory, function (resp) {

                            setTimeout(function(){
                                expect(category.name).toBe(editCategory.name);

                                ProductsService.deleteCategory(category.id, function (resp) {

                                    setTimeout(function(){
                                        expect(Utils.findById(realTimeCategories, category.id)).toBeUndefined();
                                        done();
                                    }, 2000);
                                });
                            }, 2000);
                        });
                    }, 2000);
                });
            });
        })
    })

});