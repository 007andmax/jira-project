(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./ng2/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./ng2/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../node_modules/@angular/router/fesm5/router.js");



var routes = [];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./ng2/app/app.component.html":
/*!************************************!*\
  !*** ./ng2/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<!-- ng1 -->\n<div class=\"view-container\">\n  <div ng-include=\"'/ng1/scripts/common/templates/index-page-body.tpl.html'\"></div>\n  <div ng-view class=\"view-frame\"></div>\n  <router-outlet></router-outlet>\n</div>\n\n\n\n\n"

/***/ }),

/***/ "./ng2/app/app.component.scss":
/*!************************************!*\
  !*** ./ng2/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvbmcyL2FwcC9hcHAuY29tcG9uZW50LnNjc3MifQ== */"

/***/ }),

/***/ "./ng2/app/app.component.ts":
/*!**********************************!*\
  !*** ./ng2/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_upgrade_static__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/upgrade/static */ "../node_modules/@angular/upgrade/fesm5/static.js");



var AppComponent = /** @class */ (function () {
    function AppComponent(upgrade) {
        this.upgrade = upgrade;
        this.title = 'migrated';
    }
    AppComponent.prototype.ngOnInit = function () {
        this.upgrade.bootstrap(document.body, ['quicktech']);
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./ng2/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./ng2/app/app.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_upgrade_static__WEBPACK_IMPORTED_MODULE_2__["UpgradeModule"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./ng2/app/app.module.ts":
/*!*******************************!*\
  !*** ./ng2/app/app.module.ts ***!
  \*******************************/
/*! exports provided: CustomHandlingStrategy, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomHandlingStrategy", function() { return CustomHandlingStrategy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./ng2/app/app-routing.module.ts");
/* harmony import */ var _angular_upgrade_static__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/upgrade/static */ "../node_modules/@angular/upgrade/fesm5/static.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./app.component */ "./ng2/app/app.component.ts");
/* harmony import */ var _components_password_manager_password_manager_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/password-manager/password-manager.component */ "./ng2/app/components/password-manager/password-manager.component.ts");








var CustomHandlingStrategy = /** @class */ (function () {
    function CustomHandlingStrategy() {
    }
    CustomHandlingStrategy.prototype.shouldProcessUrl = function (url) {
        console.log(url, 'URL');
        console.log((url.toString().startsWith("/ng2") || url.toString() == "/"), 'URL');
        return url.toString().startsWith("/ng2") || url.toString() == "/";
    };
    CustomHandlingStrategy.prototype.extract = function (url) { return url; };
    CustomHandlingStrategy.prototype.merge = function (url, whole) { return url; };
    return CustomHandlingStrategy;
}());

angular.module('quicktech')
    .directive('ng2Demo', Object(_angular_upgrade_static__WEBPACK_IMPORTED_MODULE_5__["downgradeComponent"])({ component: _components_password_manager_password_manager_component__WEBPACK_IMPORTED_MODULE_7__["PasswordManagerComponent"] }));
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"],
                _components_password_manager_password_manager_component__WEBPACK_IMPORTED_MODULE_7__["PasswordManagerComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                _angular_upgrade_static__WEBPACK_IMPORTED_MODULE_5__["UpgradeModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forRoot([
                    {
                        path: 'ng2/password-manager',
                        component: _components_password_manager_password_manager_component__WEBPACK_IMPORTED_MODULE_7__["PasswordManagerComponent"]
                    }
                ], {
                    useHash: true,
                    enableTracing: true
                })
            ],
            providers: [
                { provide: _angular_router__WEBPACK_IMPORTED_MODULE_3__["UrlHandlingStrategy"], useClass: CustomHandlingStrategy }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_6__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./ng2/app/components/password-manager/password-manager.component.html":
/*!*****************************************************************************!*\
  !*** ./ng2/app/components/password-manager/password-manager.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  password-manager works!\n</p>\n"

/***/ }),

/***/ "./ng2/app/components/password-manager/password-manager.component.scss":
/*!*****************************************************************************!*\
  !*** ./ng2/app/components/password-manager/password-manager.component.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvbmcyL2FwcC9jb21wb25lbnRzL3Bhc3N3b3JkLW1hbmFnZXIvcGFzc3dvcmQtbWFuYWdlci5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./ng2/app/components/password-manager/password-manager.component.ts":
/*!***************************************************************************!*\
  !*** ./ng2/app/components/password-manager/password-manager.component.ts ***!
  \***************************************************************************/
/*! exports provided: PasswordManagerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PasswordManagerComponent", function() { return PasswordManagerComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");


var PasswordManagerComponent = /** @class */ (function () {
    function PasswordManagerComponent() {
    }
    PasswordManagerComponent.prototype.ngOnInit = function () {
        console.log('testes');
    };
    PasswordManagerComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-password-manager',
            template: __webpack_require__(/*! ./password-manager.component.html */ "./ng2/app/components/password-manager/password-manager.component.html"),
            styles: [__webpack_require__(/*! ./password-manager.component.scss */ "./ng2/app/components/password-manager/password-manager.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PasswordManagerComponent);
    return PasswordManagerComponent;
}());



/***/ }),

/***/ "./ng2/environments/environment.ts":
/*!*****************************************!*\
  !*** ./ng2/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./ng2/main.ts":
/*!*********************!*\
  !*** ./ng2/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "../node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./ng2/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./ng2/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./ng2/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/nikolayepov/Desktop/GP/www/qt-ui/migrated/src/ng2/main.ts */"./ng2/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map