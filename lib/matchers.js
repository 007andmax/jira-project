beforeEach(function() {
    jasmine.addMatchers({
        toBeIn: function (expected) {
            return {
                compare: function (actual, expected) {
                    return {
                        pass: expected.some(function (item) {
                            return item === actual;
                        }),
                        message: actual + ' is not in ' + expected
                    }
                }
            };
        }
    });
});