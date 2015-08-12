(function (v, r, t) {
  v.layLoadingPageSize = 15;
  r = angular.module("main.services", []);
  r.config(["$provide", "$httpProvider", function (h, m) {
    h.factory("myHttpInterceptor", [function () {
      return {
        request: function (h) {
          h.url && (h.params || (h.params = {}), h.url.endsWith(".html") || (h.params.t = (new Date).getTime()));
          return h
        }, response: function (h) {
          if ("unauthorized" === h.data.errorMessage || "unauthorized" === h.data.authMessage)v.location.pathname = "/login"; else if (h.data.showMessage)return alert(h.data.showMessage), {};
          return h
        }
      }
    }]);
    m.interceptors.push("myHttpInterceptor")
  }]);
  r.run(["$http", "$rootScope", function (h, m) {
    h.get("/users/current").success(function (h) {
      m.currentUser = h
    });
    m.numberCounterDelimiter = "-"
  }]);
  r.service("Downloader", function () {
    function h(f) {
      if (/(iP)/g.test(navigator.userAgent))return alert("Your device does not support files downloading. Please try again in desktop browser."), !1;
      if (m || k || d) {
        var e = document.createElement("a");
        e.href = f;
        if (e.download !== t) {
          var b = f.substring(f.lastIndexOf("/") + 1, f.length);
          e.download =
            b
        }
        if (document.createEvent)return f = document.createEvent("MouseEvents"), f.initEvent("click", !0, !0), e.dispatchEvent(f), !0
      }
      v.open(f, "_self");
      return !0
    }

    var m = -1 < navigator.userAgent.toLowerCase().indexOf("chrome"), k = -1 < navigator.userAgent.toLowerCase().indexOf("safari"), d = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
    return {
      downloadByUrl: h, downloadTicketAttachments: function (d) {
        h("/v2/tickets/" + d + "/downloadAttachments")
      }, downloadFile: function (d) {
        h("/file" + d)
      }
    }
  });
  r.service("Utils", ["$http", function (h) {
    function m(b) {
      var a =
        b;
      !a && this.staticCopy && (a = this);
      if ("[object Array]" === Object.prototype.toString.call(a)) {
        b = [];
        for (var c = 0; c < a.length; c++)b.push(m(a[c]))
      } else if ("[object Object]" === Object.prototype.toString.call(a))for (c in b = {}, a)"staticCopy" !== c && "$$hashKey" != c && (b[c] = m(a[c])); else return a;
      return b
    }

    function k(b, a) {
      if ("[object String]" === Object.prototype.toString.call(b))return b;
      a = a || b;
      for (var c in b) {
        var g = b[c];
        "[object Array]" === Object.prototype.toString.call(g) ? d(g) : "[object Object]" === Object.prototype.toString.call(g) &&
        k(g);
        f(a, c, g)
      }
      f(a, "staticCopy", m);
      return a
    }

    function d(b, a) {
      if (a) {
        for (var c = 0; c < b.length; c++)a.push(k(b[c]));
        f(a, "staticCopy", m);
        return a
      }
      for (c = 0; c < b.length; c++)b[c] = k(b[c]);
      f(b, "staticCopy", m);
      return b
    }

    function f(b, a, c) {
      Object.defineProperty(b, a, {value: c, writable: !1, enumerable: !0, configurable: !0})
    }

    function e(b, a) {
      for (var c = 0; c < b.length; c++) {
        var g = b[c];
        if (g && (g = g.versionedId ? g.versionedId.id : g.id, g === a))return c
      }
      return -1
    }

    return {
      customizeObj: k, customizeArray: d, defineReadOnlyProperty: f, findById: function (b,
                                                                                         a) {
        for (var c = 0; c < b.length; c++) {
          var g = b[c];
          if ((g.versionedId ? g.versionedId.id : g.id) === a)return g
        }
      }, indexOfId: e, handleCallback: function (b, a) {
        a && b.then(function (c) {
          a(c.data)
        }, function (c) {
          a(c.data)
        })
      }, deleteById: function (b, a) {
        var c = e(b, a);
        -1 < c && b.splice(c, 1)
      }, getListByUrl: function (b, a, c) {
        var g = [];
        c && (g = d(g));
        h.get(b).then(function (b) {
          if (c)d(b.data, g), c(g); else for (var p = 0; p < b.data.length; p++)g.push(b.data[p]);
          a && a(g)
        }, function (b) {
          a && a(b.data)
        });
        return g
      }, getFormattedNumber: function (b, a) {
        var c;
        if (a)for (c =
                     "" + (parseInt(b.numPart) + 1); c.length < b.numPart.length;)c = "0" + c; else c = b.numPart;
        return b.charPart ? b.charPart + $rootScope.numberCounterDelimiter + c : c
      }, getComparatorBy: function (b, a) {
        return function (c, g) {
          return a ? g[b] - c[b] : c[b] - g[b]
        }
      }, formatDate: function (b) {
        return b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate()
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("AddressesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    return {
      getAllLocales: function (f) {
        var e = d.customizeObj({});
        h.get("/addresses/getAllLocales").then(function (b) {
          d.customizeObj(b.data, e);
          f && f(b.data)
        }, function (b) {
          f && f(b.data)
        });
        return e
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("BillableService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    return {
      getTotalBilledAmount: function (f, e) {
        var b = d.customizeObj({});
        h.get("/billable/totalBilled").then(function (a) {
          d.customizeObj(a.data, b);
          k.subscribe("/billedTicketsSumAdded", f, function (a) {
            console.log(a);
            "BILLED_TICKETS_SUM_ADDED" === a.action && d.defineReadOnlyProperty(b, "value", b.value + a.data)
          });
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return b
      }, getBillableChartData: function (f,
                                         e) {
        var b = d.customizeArray([]);
        h.get("/billable/billed/lastDays").then(function (a) {
          d.customizeArray(a.data, b);
          k.subscribe("/billedTicketsSumAdded", f, function (a) {
            console.log(a);
            if ("BILLED_TICKETS_SUM_ADDED" === a.action) {
              var g = b[b.length - 1];
              d.defineReadOnlyProperty(g, "sum", g.sum + a.data)
            }
          });
          e && e(b)
        }, function (a) {
          e && e(a.data)
        });
        return b
      }, getBillableCompanies: function (f, e) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        var b = d.customizeArray([]);
        h({url: "/billable/total", method: "GET"}).then(function (a) {
          d.customizeArray(a.data,
            b);
          k.subscribe("/billableTotal", f, function (a) {
            console.log(a);
            if ("CLIENT_BILLABLE_TOTAL" == a.action)if (0 < a.data.ticketsCount) {
              var g = d.findById(b, a.data.id);
              g || (g = {}, b.push(g));
              d.customizeObj(a.data, g)
            } else a = d.indexOfId(b, a.data.id), -1 < a && (d.defineReadOnlyProperty(b[a], "total", 0), d.defineReadOnlyProperty(b[a], "ticketsCount", 0), b.splice(a, 1)); else if ("COMPANY_ARCHIVED" == a.action)for (g = 0; g < b.length; g++)b[g].company.id === a.data.id && (b.splice(g, 1), g--)
          });
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return b
      },
      getCompanyBillableTickets: function (f, e, b) {
        if (!f)throw"companyId is required!";
        if (!e || !e.$id)throw"Second argument must be Angularjs scope!";
        var a = [];
        h.get("/billable/expenses/" + f).then(function (c) {
          d.customizeArray(c.data, a);
          k.subscribe("/billableExpense?targetId=" + f, e, function (b) {
            console.log(b);
            if ("BILLABLE_EXPENSE_ADDED" == b.action) {
              var c = d.findById(a, b.data.id);
              c || (c = {}, a.push(c));
              d.customizeObj(b.data, c)
            } else"BILLABLE_EXPENSE_REMOVED" == b.action && (b = d.indexOfId(a, b.data), -1 < b && a.splice(b, 1))
          });
          b &&
          b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }, createInvoice: function (f, e) {
        if (!f)throw"invoice is required!";
        var b = h({url: "/billable/invoice", method: "POST", data: f});
        d.handleCallback(b, e)
      }, getActualInvoiceNumber: function (f, e) {
        h.get("/data/actualNumber?type=INVOICE").success(function (b) {
          e(b.number)
        });
        k.subscribe("/number?targetId=INVOICE", f, function (b) {
          console.log(b);
          "NUMBER_CHANGED" === b.action && e(d.getFormattedNumber(b.data, !0))
        })
      }, search: function (d) {
        if (!d)throw"Keyword is required!";
        return h.get("/billable/search?keyword=" +
          d).then(function (d) {
          return d.data
        })
      }, getLockedTicketIds: function (f, e) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/billable/invoice/lock", e, function (b) {
          k.subscribe("/ticketResolution", f, function (a) {
            console.log(a);
            if ("TICKET_LOCKED" == a.action)for (var c = 0; c < a.data.length; c++)b.push(a.data[c]); else if ("TICKET_UNLOCKED" == a.action)for (c = 0; c < b.length; c++)for (var g = 0; g < a.data.length; g++)b[c] == a.data[g] && b.splice(c, 1)
          })
        })
      }, lockTicketIds: function (f, e) {
        if (!f)throw"ticketIds is required!";
        var b = d.customizeObj({});
        h({url: "/billable/invoice/lock", method: "POST", data: f}).then(function (a) {
          d.customizeObj(a.data, b);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return b
      }, unlockTicketIds: function (f, e) {
        if (!f)throw"lockId is required!";
        var b = h.get("/billable/invoice/unlock/" + f);
        d.handleCallback(b, e)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("CompaniesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    function f(b, c) {
      if (!b)throw"Keyword is required!";
      for (var d = [], l = 0; l < a.companies.length; l++) {
        var e = a.companies[l];
        (c || a.currentCompany.id !== e.id) && -1 < e.name.indexOf(b) && d.push(e)
      }
      return d
    }

    m = m.$new();
    var e = !1, b = [], a = {companies: [], clientCompanies: [], currentCompany: {}};
    d.customizeObj(a);
    h.get("/company/clients").then(function (b) {
      d.customizeArray(b.data,
        a.clientCompanies);
      for (b = 0; b < a.clientCompanies.length; b++)a.companies.push(a.clientCompanies[b]);
      c++;
      2 === c && (e = !0)
    }, function (a) {
      console.error(a);
      throw"Cannot initialize CompaniesService!";
    });
    h.get("/company/current").then(function (b) {
      d.customizeObj(b.data, a.currentCompany);
      a.companies.push(a.currentCompany);
      c++;
      2 === c && (e = !0)
    }, function (a) {
      console.error(a);
      throw"Cannot initialize CompaniesService!";
    });
    var c = 0;
    k.subscribe("/company", m, function (c) {
      console.log(c);
      if (e)if ("COMPANY_SAVED" == c.action) {
        var n =
          d.findById(a.companies, c.data.id);
        if (n)d.customizeObj(c.data, n); else for (c = d.customizeObj(c.data), a.companies.push(c), a.clientCompanies.push(c), c = 0; c < b.length; c++)b[c]()
      } else if ("COMPANY_ARCHIVED" == c.action)for (d.deleteById(a.companies, c.data.id), d.deleteById(a.clientCompanies, c.data.id), c = 0; c < b.length; c++)b[c](); else if ("COMPANY_DEARCHIVED" == c.action)for (n = d.customizeObj(c.data), a.clientCompanies.push(n), a.companies.push(n), c = 0; c < b.length; c++)b[c]()
    });
    return {
      _addAmountChangeListener: function (a) {
        b.push(a)
      },
      _search: f, _isInitialized: function () {
        return e
      }, getCurrentCompany: function () {
        return a.currentCompany
      }, getClientCompanies: function () {
        return a.clientCompanies
      }, getAllCompanies: function () {
        return a.companies
      }, getOneById: function (b) {
        return d.findById(a.companies, b)
      }, searchByAllCompanies: function (a) {
        return f(a, !0)
      }, searchByClientCompanies: function (a) {
        return f(a, !1)
      }, getClientCompaniesInfo: function (a, b) {
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/company/clients/info").then(function (a) {
          d.customizeObj(a.data,
            c);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        k.subscribe("/clientCompaniesInfo", a, function (a) {
          console.log(a);
          if ("CLIENT_COMPANY_INFO" == a.action) {
            a = JSON.parse(a.data);
            for (var b in a)d.defineReadOnlyProperty(c, b, d.customizeObj(a[b]))
          } else"COMPANY_ARCHIVED" == a.action && delete c[a.data.id]
        });
        return c
      }, getCompanyInfo: function (a, b, c) {
        if (!a)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var l = d.customizeObj({});
        h.get("/company/" + a + "/info").then(function (a) {
          d.customizeObj(a.data,
            l);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        k.subscribe("/clientCompaniesInfo", b, function (b) {
          console.log(b);
          if ("CLIENT_COMPANY_INFO" == b.action) {
            b = JSON.parse(b.data);
            for (var c in b)c === a && d.customizeObj(b[a], l)
          }
        });
        return l
      }, archive: function (a, b) {
        if (!a)throw"companyId is required!";
        var c = h.get("/company/archive/" + a);
        d.handleCallback(c, b)
      }, dearchive: function (a, b) {
        if (!a)throw"companyId is required!";
        var c = h.get("/company/dearchive/" + a);
        d.handleCallback(c, b)
      }, save: function (a, b) {
        if (!a)throw"company is required!";
        var c = "POST";
        a.id && (c = "PUT");
        c = h({url: "/company", method: c, data: a});
        d.handleCallback(c, b)
      }, getCompanyData: function (a, b) {
        if (!a)throw"companyId is required!";
        var c = {};
        h.get("/company/" + a + "/data").then(function (a) {
          for (var g in a.data)c[g] = a.data[g];
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        return c
      }, isNameUnique: function (a, b, c) {
        if (!a)throw"name is required!";
        var l = d.customizeObj({});
        h.get("/company/isCompanyNameUnique?name=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, l);
          c && c(a.data)
        }, function (a) {
          c &&
          c(a.data)
        });
        return l
      }, isDomainUnique: function (a, b, c) {
        if (!a)throw"domain is required!";
        var l = d.customizeObj({});
        h.get("/company/isCompanyDomainUnique?domain=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, l);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        return l
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ContactsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, m, k, d) {
    return {
      isEmailUnique: function (f, e, b) {
        if (!f)throw"email is required!";
        var a = d.customizeObj({});
        h.get("/contacts/isEmailUnique?email=" + f + "&id=" + e).then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("DevicesService", ["$http", "$rootScope", "RealTimeService", "Utils", "UsersService", function (h, m, k, d, f) {
    m = m.$new();
    var e = {devices: [], devicesByCompanies: {}};
    d.customizeObj(e);
    h.get("/devices").then(function (b) {
      d.customizeObj(b.data, e.devicesByCompanies);
      for (var a in e.devicesByCompanies)if ("staticCopy" !== a)for (b = 0; b < e.devicesByCompanies[a].length; b++)e.devices.push(e.devicesByCompanies[a][b]);
      f._addInitListener(function () {
        for (var a = 0; a < e.devices.length; a++)for (var b =
          0; b < e.devices[a].users.length; b++) {
          var d = f.getOneById(e.devices[a].users[b].id);
          e.devices[a].users[b] = d
        }
      })
    }, function (b) {
      console.error(b);
      throw"Cannot initialize CompaniesService!";
    });
    k.subscribe("/device", m, function (b) {
      console.log(b)
    });
    return {
      getAllDevices: function () {
        return e.devices
      }, getAllByCompanyId: function (b) {
        return e.devicesByCompanies[b] || []
      }, getOneById: function (b) {
        return d.findById(e.devices, b)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("FilesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    return {
      create: function (d, e, b, a, c) {
        if (!d)throw"file is required!";
        var g = {}, n = new FormData;
        n.append("file", d);
        d = new XMLHttpRequest;
        d.upload.addEventListener("progress", e, !1);
        d.addEventListener("load", function (a) {
          a = angular.fromJson(a.currentTarget.responseText);
          for (var c in a)g[c] = a[c];
          b && b(g)
        }, !1);
        d.addEventListener("error", a, !1);
        d.open("POST", "/file?isAvatar=" + !!c);
        d.send(n);
        return g
      }, createImageFromBase64Url: function (d, e) {
        if (!d)throw"base64Url is required!";
        var b = {};
        h({url: "/base64image", method: "POST", data: d.substring(22, d.length)}).then(function (a) {
          for (var c in a.data)b[c] = a.data[c];
          e && e(b)
        });
        return b
      }, getMetadata: function (d, e) {
        if (!d)throw"fileId is required!";
        var b = {id: d};
        h.get("/file/" + d + "/meta").then(function (a) {
          for (var c in a.data)b[c] = a.data[c];
          e && e(b)
        }, function (a) {
          e && e(a.data)
        });
        return b
      }, remove: function (d, e) {
        if (!d)throw"fileId is required!";
        h({
          url: "/file/" +
          d, method: "DELETE"
        }).then(function (b) {
          e && e(b.data)
        }, function (b) {
          e && e(b.data)
        })
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ProductsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, m, k, d, f) {
    return {
      search: function (d) {
        if (!d)throw"Keyword is required!";
        return h.get("/products/search?keyword=" + d).then(function (b) {
          return b.data
        })
      }, getCategories: function (e, b) {
        if (!e || !e.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/products/categories", b, function (a) {
          k.subscribe("/productCategory", e, function (b) {
            console.log(b);
            if ("PRODUCT_CATEGORY_SAVED" == b.action) {
              var g = d.findById(a, b.data.id);
              g ? d.customizeObj(b.data, g) : a.push(d.customizeObj(b.data))
            } else"PRODUCT_CATEGORY_DELETED" == b.action && (d.deleteById(a, b.data.id), e.$broadcast("product_category_deleted", b.data))
          })
        })
      }, saveCategory: function (e, b) {
        if (!e)throw"category is required!";
        var a = "/products/categories", c = "POST";
        e.id && (a += "/" + e.id, c = "PUT");
        a = h({url: a, method: c, data: e});
        d.handleCallback(a, b)
      }, deleteCategory: function (e, b) {
        if (!e)throw"categoryId is required argument!";
        var a = h({url: "/products/categories/" + e, method: "DELETE"});
        d.handleCallback(a, b)
      }, getAllByCategory: function (e, b, a, c) {
        if (!e || !e.$id)throw"First argument must be Angularjs scope!";
        if (!b)throw"categoryId is required argument!";
        var g = "/products?categoryId=" + b;
        c && (g = "/products/full?categoryId=" + b);
        return d.getListByUrl(g, a, function (a) {
          k.subscribe("/product?targetId=" + b, e, function (b) {
            console.log(b);
            if ("PRODUCT_SAVED" == b.action) {
              var c = d.findById(a, b.data.versionedId.id);
              c ? d.customizeObj(b.data, c) : a.push(d.customizeObj(b.data))
            } else"PRODUCT_DELETED" ==
            b.action && (d.deleteById(a, b.data.versionedId.id), e.$broadcast("product_deleted", b.data))
          })
        })
      }, saveProduct: function (e, b) {
        if (!e)throw"product is required!";
        var a = "POST";
        e.id && (a = "PUT");
        a = h({url: "/products", method: a, data: e});
        d.handleCallback(a, b)
      }, deleteProduct: function (e, b) {
        if (!e)throw"productId is required argument!";
        var a = h({url: "/products/" + e, method: "DELETE"});
        d.handleCallback(a, b)
      }, isProductNameUnique: function (e, b, a, c) {
        if (!e)throw"name is required!";
        if (!a)throw"vendorId is required!";
        var g = d.customizeObj({});
        h.get("/products/isProductNameUnique?name=" + e + "&id=" + b + "&vendorId=" + a).then(function (a) {
          d.customizeObj(a.data, g);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        return g
      }, getActualCode: function (e, b) {
        if (!e || !e.$id)throw"Second argument must be Angularjs scope!";
        var a = d.customizeObj({});
        h.get("/products/actualCode").then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        k.subscribe("/productCode", e, function (b) {
          console.log(b);
          "PRODUCT_CODE_CHANGED" === b.action && d.defineReadOnlyProperty(a,
            "value", b.data)
        });
        return a
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("RealTimeService", ["$http", "$timeout", "$rootScope", function (h, m, k) {
    function d() {
      h.post("/realTime/createWatcher").success(function (b) {
        a = b.id;
        if (0 < c.length) {
          for (b = 0; b < c.length; b++) {
            var d = c[b];
            p.subscribe(d.url, d.scope, d.callback)
          }
          c = []
        }
        e()
      }).error(function (a, b, c, d) {
        console.error("Cannot receive watcher Id !!!", a, b, c, d);
        throw"Cannot initialize RealTimeService";
      })
    }

    function f() {
      a = t;
      for (var b in n) {
        var g = n[b];
        g && !g.scope.$$destroyed && c.push(g)
      }
      n =
      {};
      d()
    }

    function e() {
      0 < g ? m(e, 300) : h.post("/realTime/watch/" + a, Object.keys(n) || []).then(function (a) {
        console.log(a.data);
        if ("timeout" == a.data || "destroyed" == a.data.message || 205 == a.status)f(); else {
          for (var b in a.data) {
            var c = n[b];
            if (c && !c.scope.$$destroyed) {
              var d = a.data[b];
              if (d)for (var g = 0; g < d.length; g++)c.callback(d[g])
            }
          }
          e()
        }
      }, function (a) {
        a && 0 !== a.status ? 205 == a.status ? f() : (console.log("ERRRORRR!!!!!!!!!!!!", a), m(e, 300)) : (console.log("ERRRORRR?????", a), m(f, 1E3))
      })
    }

    function b(a) {
      for (var c in n) {
        var d = n[c];
        d && !d.scope.$$destroyed && d.callback !== b && d.callback(a)
      }
      "COMPANY_ARCHIVED" !== a.action && "COMPANY_DEARCHIVED" !== a.action || k.$broadcast(a.action.toLowerCase(), a.data.id)
    }

    var a, c = [{url: "/global", scope: k, callback: b}], g = 0, n = {};
    d();
    var p = {
      subscribe: function (b, d, e) {
        a ? (g++, h.get("/realTime/subscribe/" + a + b).success(function (a) {
          g--;
          n[a.id] = {url: b, scope: d, callback: e};
          d.$on("$destroy", function () {
            delete n[a.id]
          })
        }).error(function (a, n, p, h) {
          g--;
          205 == n && (c.push({url: b, scope: d, callback: e}), f());
          console.error("Cannot subscribe on " +
            b, a, n, p, h)
        })) : c.push({url: b, scope: d, callback: e})
      }
    };
    return p
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ReceiptArchiveService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    return {
      getReceiptArchiveData: function (f, e) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        var b = d.customizeObj({list: [], companies: {}});
        h.get("/receiptArchive").then(function (a) {
          d.customizeArray(a.data, b.list);
          b.list.forEach(function (a) {
            var g = b.companies[a.companyId];
            g ? g.push(a) : d.defineReadOnlyProperty(b.companies, a.companyId, d.customizeArray([a]))
          });
          k.subscribe("/receiptArchive", f, function (a) {
            console.log(a);
            if ("RECEIPT_ARCHIVE_ADDED" === a.action) {
              for (var g = [], n = 0; n < a.data.length; n++) {
                var e = a.data[n], l;
                if (e.recurringInvoice) {
                  var f = d.findById(b.list, e.recurringInvoice.id);
                  f ? (d.defineReadOnlyProperty(f, "invoicesCount", f.invoicesCount + 1), d.defineReadOnlyProperty(f, "sum", f.sum + e.sum), e.date > f.date && (d.defineReadOnlyProperty(f, "date", e.date), d.defineReadOnlyProperty(f, "paidOn", e.paidOn))) : l = d.customizeObj({
                    id: e.recurringInvoice.id,
                    isRecurring: !0,
                    frequency: e.recurringInvoice.frequency,
                    number: e.recurringInvoice.number,
                    companyId: e.company.id,
                    date: e.date,
                    paidOn: e.paidOn,
                    sum: e.sum,
                    invoicesCount: 1
                  })
                } else l = d.customizeObj({
                  id: e.id,
                  isRecurring: !1,
                  frequency: null,
                  number: e.number,
                  companyId: e.company.id,
                  date: e.date,
                  paidOn: e.paidOn,
                  sum: e.sum,
                  invoicesCount: null
                });
                l && (b.list.push(l), (e = b.companies[l.companyId]) ? e.push(l) : d.defineReadOnlyProperty(b.companies, l.companyId, d.customizeArray([l])), 0 > g.indexOf(l.companyId) && g.push(l.companyId))
              }
              b.list.sort(d.getComparatorBy("number"));
              g.forEach(function (a) {
                b.companies[a].sort(d.getComparatorBy("number"))
              })
            } else if ("COMPANY_ARCHIVED" ===
              a.action) {
              for (n = 0; n < b.list.length; n++)b.list[n].companyId === a.data.id && (b.list.splice(n, 1), n--);
              delete b.companies[a.data.id]
            }
          });
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return b
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ReceivableService", ["$http", "$rootScope", "RealTimeService", "CompaniesService", "Utils", "$filter", function (h, m, k, d, f) {
    function e(b, a) {
      if (!b)throw"invoiceIds is required!";
      var c = h({url: "/receivable/resend", method: "POST", data: b});
      f.handleCallback(c, a)
    }

    return {
      getReceivedPaymentsSumByCompany: function (b, a, c) {
        if (!b)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var d = f.customizeObj({});
        h.get("/receivable/paymentSum/" +
          b).then(function (e) {
          f.customizeObj(e.data, d);
          k.subscribe("/companyPaymentReceived?targetId=" + b, a, function (a) {
            console.log(a);
            "COMPANY_PAYMENT_RECEIVED" === a.action ? f.defineReadOnlyProperty(d, "value", d.value + a.data) : "RECEIVED_PAYMENTS_SUM" === a.action && f.defineReadOnlyProperty(d, "value", a.data)
          });
          c && c(e.data)
        }, function (a) {
          c && c(a.data)
        });
        return d
      }, getReceivableGraphData: function (b, a) {
        var c = f.customizeArray([]);
        h.get("/receivable/chart/lastDays").then(function (g) {
          f.customizeArray(g.data, c);
          k.subscribe("/todayReceivableChartPoint?targetId=" +
            d.getCurrentCompany().id, b, function (a) {
            console.log(a);
            if ("TODAY_RECEIVABLE_CHART_POINT" === a.action) {
              var b = c[c.length - 1], d = new Date(b.date), g = new Date(a.data.date);
              d.getFullYear() === g.getFullYear() && d.getMonth() === g.getMonth() && d.getDate() + 1 === g.getDate() ? (c.push(f.customizeObj(a.data)), c.splice(0, 1)) : f.customizeObj(a.data, b)
            }
          });
          a && a(g.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getReceivableInvoicesData: function (b, a) {
        if (!b || !b.$id)throw"First argument must be Angularjs scope!";
        var c = f.customizeObj({
          list: [],
          companies: {}
        });
        h.get("/receivable").then(function (d) {
          for (var e = f.customizeArray([]), p = 0; p < d.data.length; p++) {
            var l = f.customizeObj(d.data[p]);
            if (l.recurringInvoice) {
              var h = f.findById(e, l.recurringInvoice.id);
              h || (h = l.recurringInvoice, f.defineReadOnlyProperty(h, "isRecurring", !0), f.defineReadOnlyProperty(h, "company", l.company), f.defineReadOnlyProperty(h, "invoices", f.customizeArray([])), e.push(h));
              h.invoices.push(l)
            } else e.push(l)
          }
          e.sort(f.getComparatorBy("number"));
          for (p = 0; p < e.length; p++)l = e[p], c.companies[l.company.id] ||
          f.defineReadOnlyProperty(c.companies, l.company.id, f.customizeArray([])), c.companies[l.company.id].push(l);
          f.defineReadOnlyProperty(c, "list", e);
          k.subscribe("/receivableInvoice", b, function (a) {
            console.log(a);
            if ("INVOICE_SAVED" == a.action) {
              var b = a.data, d;
              if (b.recurringInvoice) {
                var g = f.findById(c.list, b.recurringInvoice.id);
                g || (g = b.recurringInvoice, g.isRecurring = !0, g.company = b.company, g.invoices = [], d = g);
                g.invoices.push(b)
              } else d = b;
              d && (c.list.push(d), c.companies[d.company.id] || (c.companies[d.company.id] =
                []), c.companies[d.company.id].push(b))
            } else if ("INVOICE_STATUS" === a.action)a.data.recurringInvoice ? ((b = f.findById(c.list, a.data.recurringInvoice.id)) || console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING RECURRING INVOICE-----!!!!!!!"), b = f.findById(b.invoices, a.data.id)) : b = f.findById(c.list, a.data.id), b ? f.defineReadOnlyProperty(b, "status", a.data.status) : console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING INVOICE-----!!!!!!!!"); else if ("PAYMENT_RECEIVED" === a.action)for (a = a.data,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        d = 0; d < a.length; d++) {
              for (var e = a[d], n = 0; n < c.list.length && !g; n++) {
                var l = c.list[n];
                if (l.isRecurring)for (var p = 0; p < l.invoices.length && !g; p++) {
                  var h = l.invoices[p];
                  e === h.id && (l.invoices.splice(p, 1), g = h.company.id, b = l.id, 0 === l.invoices.length && c.list.splice(n, 1))
                } else e === l.id && (c.list.splice(n, 1), g = l.company.id)
              }
              g && c.companies[g] && (n = c.companies[g], b ? (e = f.indexOfId(n, b), -1 < e && 0 === n[e].invoices.length && n.splice(e, 1)) : (e = f.indexOfId(n, e), -1 < e && n.splice(e, 1)), 0 === n.length && delete c.companies[g])
            } else if ("COMPANY_ARCHIVED" ==
              a.action)for (delete c.companies[a.data.id], d = 0; d < c.list.length; d++)c.list[d].company.id === a.data.id && (c.list.splice(d, 1), d--)
          });
          a && a(d.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, receivePayment: function (b, a, c) {
        if (!b)throw"paymentMethod is required!";
        if (!a || 0 === a.length)throw"invoiceIds is required!";
        b = h({url: "/receivable/receivePayment", method: "POST", params: {paymentMethod: b.toUpperCase()}, data: a});
        f.handleCallback(b, c)
      }, resendInvoice: function (b, a) {
        if (!b)throw"invoiceId is required!";
        e([b], a)
      }, resendInvoices: e,
      search: function (b) {
        if (!b)throw"Keyword is required!";
        return h.get("/receivable/search?keyword=" + b).then(function (a) {
          return a.data
        })
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("RecurringService", ["$http", "$rootScope", "RealTimeService", "CompaniesService", "Utils", "$filter", function (h, m, k, d, f) {
    function e(a, b, d, e) {
      if (!b)throw"recurringInvoiceId is required!";
      if (!d)throw"expense is required!";
      a = {url: "/recurringInvoice/" + b + "/" + a, data: d};
      d.id ? (a.method = "PUT", a.url = a.url + "/" + d.id) : a.method = "POST";
      d = h(a);
      f.handleCallback(d, e)
    }

    function b(a, b, d) {
      if (!a)throw"recurringInvoiceId is required!";
      if (!b)throw"expenseId is required!";
      a = h({url: "/recurringInvoice/" + a + "/expense/" + b, method: "DELETE"});
      f.handleCallback(a, d)
    }

    return {
      getRecurringGraphData: function (a, b) {
        var d = ["WEEKLY", "MONTHLY", "YEARLY"], e = f.customizeArray([]);
        h.get("/recurringInvoice/billed/lastDays").then(function (p) {
          f.customizeArray(p.data, e);
          k.subscribe("/recurringChart", a, function (a) {
            console.log(a);
            if ("RECURRING_CHART" === a.action) {
              for (var b = new Date(a.data.date), c = 0; c < e.length; c++) {
                var p = e[c], h = new Date(p[p.length - 1].date);
                h.getFullYear() === b.getFullYear() && h.getMonth() ===
                b.getMonth() && h.getDate() + 1 === b.getDate() && (p.push(f.customizeObj({
                  date: f.formatDate(b),
                  sum: 0
                })), p.splice(0, 1))
              }
              b = d.indexOf(a.data.type);
              b = e[b];
              f.defineReadOnlyProperty(b[b.length - 1], "sum", a.data.sum)
            }
          });
          b && b(p.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, getRecurringCompanies: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var d = [];
        h({url: "/recurringInvoice/total", method: "GET"}).then(function (e) {
          f.customizeArray(e.data, d);
          k.subscribe("/recurringTotal", a, function (a) {
            console.log(a);
            if ("CLIENT_RECURRING_TOTAL" === a.action) {
              var b = f.indexOfId(d, a.data.id);
              0 === a.data.total ? -1 < b && d.splice(b, 1) : -1 < b ? f.customizeObj(a.data, d[b]) : d.push(f.customizeObj(a.data))
            } else if ("COMPANY_ARCHIVED" == a.action)for (b = 0; b < d.length; b++)d[b].company.id === a.data.id && (d.splice(b, 1), b--)
          });
          b && b(e.data)
        }, function (a) {
          b && b(a.data)
        });
        return d
      }, getCompanyRecurringInvoices: function (a, b, d) {
        if (!a)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var e = [];
        h.get("/recurringInvoice?companyId=" +
          a).then(function (p) {
          f.customizeArray(p.data, e);
          k.subscribe("/recurring?targetId=" + a, b, function (a) {
            console.log(a);
            if ("RECURRING_SAVED" == a.action) {
              var b = f.findById(e, a.data.id);
              b ? f.customizeObj(a.data, b) : e.push(f.customizeObj(a.data))
            } else"RECURRING_DELETE" == a.action && (a = f.indexOfId(e, a.data.id), -1 < a && e.splice(a, 1))
          });
          d && d(p.data)
        }, function (a) {
          d && d(a.data)
        });
        return e
      }, createRecurringInvoice: function (a, b, d) {
        if (!a)throw"recurringInvoice is required!";
        if (!b)throw"companyId is required!";
        a.company = {id: b};
        a = h({url: "/recurringInvoice", method: "POST", data: a});
        f.handleCallback(a, d)
      }, deleteRecurringInvoice: function (a, b) {
        if (!a)throw"recurringInvoiceId is required!";
        var d = h({url: "/recurringInvoice/" + a, method: "DELETE"});
        f.handleCallback(d, b)
      }, deleteAllRecurringInvoicesByCompany: function (a, b, d) {
        if (!a)throw"companyId is required!";
        var e = h({url: "/recurringInvoice/company/" + a, method: "DELETE"});
        d(function () {
          if (b)for (var d = 0; d < b.length; d++)b[d].company.id === a && (b.splice(d, 1), d--)
        });
        f.handleCallback(e, d)
      }, saveRecInvProductExpense: function (a,
                                             b, d) {
        e("productExpense", a, b, d)
      }, saveRecInvServiceExpense: function (a, b, d) {
        e("serviceExpense", a, b, d)
      }, deleteProductExpenseFromRecInv: function (a, d, e) {
        b(a, d, e)
      }, deleteServiceExpenseFromRecInv: function (a, d, e) {
        b(a, d, e)
      }, search: function (a) {
        if (!a)throw"Keyword is required!";
        return h.get("/recurringInvoice/search?keyword=" + a).then(function (a) {
          return a.data
        })
      }, addCompany: function (a, b) {
        if (!a)throw"recurring is required!";
        if (!b)throw"companyId is required!";
        a.push({company: d.getOneById(b)})
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("RightPanelService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", "UsersService", "DevicesService", function (h, m, k, d, f, e, b) {
    function a() {
      g.groupedData.splice(0, g.groupedData.length);
      for (var a = f.getClientCompanies(), d = 0; d < a.length; d++) {
        var c = a[d];
        g.groupedData.push({company: c, users: e.getAllByCompanyId(c.id), devices: b.getAllByCompanyId(c.id)})
      }
    }

    function c(a, b) {
      if (!a || !a.$id)throw"First argument must be Angularjs scope!";
      var c =
        g.activitiesLists[a.$id];
      if (!c)throw"There is no activities list for scope " + a.$id;
      if (c.loadingInProcess)console.log("Loading activities already in process"); else {
        var e = {keyword: c.keyword};
        0 < c.list.length && (e.lastId = c.list[c.list.length - 1].id);
        c.loadingInProcess = !0;
        h({method: "GET", url: "/activities", params: e}).then(function (a) {
          d.customizeArray(a.data, c.list);
          if (3 > g.recentActivities.length)for (var e = 0; e < c.list.length && 3 > e; e++)g.recentActivities.push(c.list[e]);
          c.loadingInProcess = !1;
          b && b(a.data)
        }, function (a) {
          c.loadingInProcess = !1;
          b && b(a.data)
        })
      }
    }

    m = m.$new();
    var g = {recentActivities: [], activitiesLists: {}, groupedData: []};
    d.customizeObj(g);
    k.subscribe("/activity", m, function (a) {
      if ("ACTIVITY_SAVED" == a.action) {
        a = d.customizeObj(a.data);
        g.recentActivities.unshift(a);
        g.recentActivities.splice(3, g.recentActivities.length);
        for (var b in g.activitiesLists)if ("staticCopy" !== b) {
          var e = g.activitiesLists[b];
          e.keyword && 0 > a.description.indexOf(e.keyword) || e.list.unshift(a)
        }
      } else if ("COMPANY_ARCHIVED" == a.action)for (b in g.recentActivities.splice(0,
        g.recentActivities.length), g.activitiesLists)if ("staticCopy" !== b) {
        for (var e = g.activitiesLists[b], f = 0; f < e.list.length; f++)e.list[f].company.id === a.data.id && (e.list.splice(f, 1), f--);
        e.list.length < v.layLoadingPageSize && c({$id: b})
      }
    });
    f._addAmountChangeListener(a);
    return {
      getActivities: function (a, b, d) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var e = [];
        g.activitiesLists[a.$id] = {keyword: b, list: e};
        c(a, d);
        a.$on("$destroy", function () {
          delete g.activitiesLists[a.$id]
        });
        return e
      }, loadMoreActivities: c,
      getRecentActivities: function () {
        3 > g.recentActivities.length && h({method: "GET", url: "/activities"}).then(function (a) {
          d.customizeArray(a.data, g.recentActivities);
          g.recentActivities.splice(3, g.recentActivities.length)
        });
        return g.recentActivities
      }, getClientCompaniesGroupedData: function () {
        0 == g.groupedData.length && a();
        return g.groupedData
      }, getOneCompanyGroupedData: function (a) {
        return {company: f.getOneById(a), users: e.getAllByCompanyId(a), devices: b.getAllByCompanyId(a)}
      }, getCurrentUserInfo: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/userInfo").then(function (a) {
          d.customizeObj(a.data, c);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        k.subscribe("/rightBarUserInfo", a, function (a) {
          console.log(a);
          "RB_USER_INFO" == a.action && d.customizeObj(a.data, c)
        });
        return c
      }, getClientCompanyInfo: function (a, b, c) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        if (!b)throw"companyId is required!";
        var e = d.customizeObj({});
        h.get("/companyInfo/" + b).then(function (a) {
          d.customizeObj(a.data,
            e);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        k.subscribe("/rightBarCompanyInfo?targetId=" + b, a, function (a) {
          console.log(a);
          "RB_COMPANY_INFO" == a.action && d.customizeObj(a.data, e)
        });
        return e
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ServicesService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, m, k, d, f) {
    function e(b, a) {
      var c = a.company.id;
      c === f.getCurrentCompany().id && (c = "default");
      b[c] || d.defineReadOnlyProperty(b, c, []);
      var e = d.findById(b[c], a.id);
      e ? d.customizeObj(a, e) : b[c].push(d.customizeObj(a))
    }

    return {
      search: function (b) {
        if (!b)throw"Keyword is required!";
        return h.get("/services/search?keyword=" + b).then(function (a) {
          return a.data
        })
      }, getAllByCompany: function (b,
                                    a, c) {
        if (!b || !b.$id)throw"First argument must be Angularjs scope!";
        if (!a || "[object Function]" === Object.prototype.toString.call(a))throw"companyId is required argument!";
        return d.getListByUrl("/services/" + a, c, function (a) {
        })
      }, getServicesData: function (b, a) {
        function c(a) {
          var b;
          a:{
            b = g;
            var c = a.versionedId.id, f;
            for (f in b)if ("staticCopy" != f) {
              var h = d.findById(b[f], c);
              if (h) {
                b = h;
                break a
              }
            }
            b = void 0
          }
          b ? d.customizeObj(a, b) : e(g, a)
        }

        if (!b || !b.$id)throw"First argument must be Angularjs scope!";
        var g = d.customizeObj({});
        h.get("/services").then(function (b) {
          for (var d = 0; d < b.data.length; d++)e(g, b.data[d]);
          a && a(b.data)
        }, function (b) {
          a && a(b.data)
        });
        k.subscribe("/service", b, function (a) {
          console.log(a);
          if ("SERVICE_SAVED" == a.action)c(a.data); else if ("SERVICE_LIST_SAVED" == a.action)for (var b = 0; b < a.data.length; b++)c(a.data[b]); else if ("SERVICES_MOVED" == a.action)for (b = 0; b < a.data.length; b++)e(g, a.data[b]); else if ("COMPANY_SERVICES_DELETED" == a.action)delete g[a.data.id]; else if ("SERVICES_DELETED" == a.action)for (b = 0; b < a.data.length; b++) {
            var f =
              a.data[b].versionedId.id, h = g, k = void 0;
            for (k in h) {
              var q = d.indexOfId(h[k], f);
              -1 < q && h[k].splice(q, 1)
            }
          } else"COMPANY_ARCHIVED" == a.action && delete g[a.data.id]
        });
        return g
      }, save: function (b, a) {
        if (!b)throw"service is required!";
        var c = "/services", e = "POST";
        b.id && (e = "PUT", c = c + "/" + b.id);
        c = h({url: c, method: e, data: b});
        d.handleCallback(c, a)
      }, addCompanyToServiceData: function (b, a) {
        if (!b)throw"data argument is required";
        if (!a)throw"companyId argument is required";
        b[a] || d.defineReadOnlyProperty(b, a, [])
      }, deleteCompanyFromServiceData: function (b,
                                                 a) {
        if (0 < b[a].length)throw"This action cannot be performed on company that has not empty services list! Use deleteCompany() method.";
        delete b[a]
      }, deleteService: function (b, a) {
        if (!b)throw"serviceId is required argument!";
        var c = h({url: "/services/" + b, method: "DELETE"});
        d.handleCallback(c, a)
      }, deleteCompany: function (b, a) {
        if (!b)throw"companyId is required argument!";
        var c = h({url: "/services/company/" + b, method: "DELETE"});
        d.handleCallback(c, a)
      }, move: function (b, a) {
        if (!b)throw"mapping is required argument!";
        var c =
          h({url: "/services/move", method: "POST", data: b});
        d.handleCallback(c, a)
      }, getActualMapping: function (b) {
        var a = {}, d;
        for (d in b)if ("default" != d && "staticCopy" != d) {
          for (var e = [], f = b[d], h = 0; h < f.length; h++)e.push(f[h].originService.versionedId.id);
          a[d] = e
        }
        return a
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("StatisticsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, m, k, d, f) {
    return {
      getResolvedTicketsCountByCompany: function (e, b, a) {
        if (!e)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/tickets/resolvedCount/" + e).then(function (g) {
          d.customizeObj(g.data, c);
          k.subscribe("/resolvedTicketsCount?targetId=" + e, b, function (a) {
            console.log(a);
            "RESOLVED_TICKETS_COUNT" === a.action && d.defineReadOnlyProperty(c, "value", a.data)
          });
          a && a(g.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getTicketsResolutionTimeChartDataByCompany: function (e, b, a) {
        if (!e)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/tickets/resolutionTime/" + e).then(function (g) {
          d.customizeObj(g.data, c);
          k.subscribe("/ticketsResolutionTimeChart?targetId=" + e, b, function (a) {
            console.log(a);
            "TICKETS_RESOLUTION_TIME_CHART" ===
            a.action && d.customizeObj(a.data, c)
          });
          a && a(g.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getTimeBilledByCompany: function (e, b, a) {
        if (!e)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/billed/time/" + e).then(function (g) {
          d.customizeObj(g.data, c);
          k.subscribe("/billedTimeStatistic?targetId=" + e, b, function (a) {
            console.log(a);
            "BILLED_TIME_STATISTIC" === a.action && d.defineReadOnlyProperty(c, "value", a.data)
          });
          a && a(g.data)
        }, function (b) {
          a &&
          a(b.data)
        });
        return c
      }, getReceivableAmountByCompany: function (e, b, a) {
        if (!e)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/companies/receivable/" + e).then(function (g) {
          d.customizeObj(g.data, c);
          k.subscribe("/todayReceivableChartPoint?targetId=" + e, b, function (a) {
            console.log(a);
            "TODAY_RECEIVABLE_CHART_POINT" === a.action && d.defineReadOnlyProperty(c, "value", a.data.receivableLeft)
          });
          a && a(g.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getContributedToEarningTopCompanies: function (e, b, a) {
        if (!e)throw"topAmount is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/companies/paymentSum/top/" + e).then(function (e) {
          function f(a) {
            k.subscribe("/companyPaymentReceived?targetId=" + a, b, function (b) {
              console.log(b);
              "COMPANY_PAYMENT_RECEIVED" === b.action && d.defineReadOnlyProperty(c, a, (c[a] ? c[a] : 0) + b.data)
            })
          }

          for (var h in e.data)f(h);
          d.customizeObj(e.data, c);
          a && a(e.data)
        }, function (b) {
          a &&
          a(b.data)
        });
        return c
      }, getTopCompaniesByResolvedTickets: function (e, b, a) {
        if (!e)throw"topAmount is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/companies/resolvedTicket/top/" + e).then(function (e) {
          function f(a) {
            k.subscribe("/resolvedTicketsCount?targetId=" + a, b, function (b) {
              console.log(b);
              "RESOLVED_TICKETS_COUNT" === b.action && d.defineReadOnlyProperty(c, a, b.data)
            })
          }

          for (var h in e.data)f(h);
          d.customizeObj(e.data, c);
          a && a(e.data)
        }, function (b) {
          a &&
          a(b.data)
        });
        return c
      }, getTotalEarningsByDays: function (e, b, a, c, g) {
        if (!e)throw"companyId is required!";
        if (!b)throw"from date is required!";
        if (!a)throw"to date is required!";
        if (b.getTime() > a.getTime())throw"from date should be less that to date!";
        if (!c || !c.$id)throw"Angularjs scope is required!";
        var f = d.customizeObj({});
        h.get("/statistic/companies/paymentSum/receivedInterval/" + e + "?from=" + d.formatDate(b) + "&to=" + d.formatDate(a)).then(function (a) {
          var b, h;
          for (h in a.data)b ? (new Date(h)).getTime() > (new Date(b)).getTime() &&
          (b = h) : b = h;
          var m = new Date(b);
          d.customizeObj(a.data, f);
          k.subscribe("/companyPaymentReceived?targetId=" + e, c, function (a) {
            console.log(a);
            if ("COMPANY_PAYMENT_RECEIVED" === a.action) {
              var c = new Date;
              m.getFullYear() === c.getFullYear() && m.getMonth() === c.getMonth() && m.getDate() === c.getDate() && d.defineReadOnlyProperty(f, b, f[b] + a.data)
            }
          });
          g && g(a.data)
        }, function (a) {
          g && g(a.data)
        });
        return f
      }, getTotalReceivableByDays: function (e, b, a, c, g) {
        if (!e)throw"companyId is required!";
        if (!b)throw"from date is required!";
        if (!a)throw"to date is required!";
        if (b.getTime() > a.getTime())throw"from date should be less that to date!";
        if (!c || !c.$id)throw"Angularjs scope is required!";
        var f = d.customizeObj({});
        h.get("/statistic/companies/receivable/totalInterval/" + e + "?from=" + d.formatDate(b) + "&to=" + d.formatDate(a)).then(function (a) {
          function b(a) {
            var d = new Date;
            if (a.getFullYear() === d.getFullYear() && a.getMonth() === d.getMonth() && a.getDate() === d.getDate())return !0
          }

          var h, m;
          for (m in a.data)h ? (new Date(m)).getTime() > (new Date(h)).getTime() && (h = m) : h = m;
          d.customizeObj(a.data,
            f);
          b(new Date(h)) && k.subscribe("/todayReceivableChartPoint?targetId=" + e, c, function (a) {
            console.log(a);
            "TODAY_RECEIVABLE_CHART_POINT" === a.action && b(new Date(a.data.date)) && d.defineReadOnlyProperty(f, h, a.data.total)
          });
          g && g(a.data)
        }, function (a) {
          g && g(a.data)
        });
        return f
      }, getTicketsClosedByDays: function (e, b, a, c, g) {
        if (!e)throw"companyId is required!";
        if (!b)throw"from date is required!";
        if (!a)throw"to date is required!";
        if (b.getTime() > a.getTime())throw"from date should be less that to date!";
        if (!c || !c.$id)throw"Angularjs scope is required!";
        var f = d.customizeObj({});
        h.get("/statistic/companies/resolvedTicket/interval/" + e + "?from=" + d.formatDate(b) + "&to=" + d.formatDate(a)).then(function (a) {
          function b(a) {
            var d, c;
            for (c in a)if ("staticCopy" != c) {
              d = c;
              break
            }
            if (d) {
              a = new Date(a[d]);
              for (var e in f)if ("staticCopy" !== e && (d = new Date(e), d.getFullYear() === a.getFullYear() && d.getMonth() === a.getMonth() && d.getDate() === a.getDate()))return e
            }
          }

          d.customizeObj(a.data, f);
          k.subscribe("/ticketResolution?targetId=" + e, c, function (a) {
            console.log(a);
            "TICKET_RESOLVED" ===
            a.action ? (a = b(a.data)) && d.defineReadOnlyProperty(f, a, f[a] + 1) : "TICKET_REOPENED" === a.action && (a = b(a.data)) && d.defineReadOnlyProperty(f, a, f[a] - 1)
          });
          g && g(a.data)
        }, function (a) {
          g && g(a.data)
        });
        return f
      }, getUserSubmittedTicketsByCompany: function (e, b, a) {
        if (!e)throw"companyId is required!";
        if (!b || !b.$id)throw"Angularjs scope is required!";
        var c = d.customizeObj({});
        h.get("/statistic/tickets/submittedTickets/" + e).then(function (f) {
          d.customizeObj(f.data, c);
          k.subscribe("/userSubmittedTicket?targetId=" + e, b, function (a) {
            console.log(a);
            "USER_SUBMITTED_TICKET" === a.action && d.defineReadOnlyProperty(c, a.data, (c[a.data] || 0) + 1)
          });
          a && a(f.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("SubscriptionsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, m, k, d, f) {
    function e(b, a, c, e, f) {
      var p = d.customizeObj({});
      h(b).then(function (b) {
        for (var h = 0; h < b.data.length; h++) {
          var m = b.data[h];
          d.defineReadOnlyProperty(p, m.user.id, d.customizeObj(m))
        }
        k.subscribe("/subscription?targetId=" + a, c, function (a) {
          console.log(a);
          "SUBSCRIPTION_SAVED" == a.action ? (!f || -1 < f.indexOf(a.data.user.id)) && d.defineReadOnlyProperty(p,
            a.data.user.id, d.customizeObj(a.data)) : "SUBSCRIPTION_DELETED" == a.action && delete p[a.data.user.id]
        });
        e && e(b.data)
      }, function (a) {
        e && e(a.data)
      });
      return p
    }

    return {
      saveUserSubscription: function (b, a) {
        if (!b)throw"userSubscription is required argument!";
        var c = "/subscription", e = "POST";
        b.id && (c += "/" + b.id, e = "PUT");
        c = h({url: c, method: e, data: b});
        d.handleCallback(c, a)
      }, deleteUserSubscription: function (b, a) {
        if (!b)throw"userSubscriptionId is required argument!";
        var c = h({url: "/subscription/" + b, method: "DELETE"});
        d.handleCallback(c,
          a)
      }, getUserSubscriptionsByCompanyId: function (b, a, d) {
        if (!b)throw"companyId is required argument!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        return e({url: "/subscription/company/users/" + b, method: "GET"}, b, a, d)
      }, getAllClientUserSubscriptions: function (b, a) {
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        return e({url: "/subscription/clientUsers", method: "GET"}, f.getCurrentCompany().id, b, a)
      }, getUserSubscriptionsByUserIds: function (b, a, d) {
        if (!b || 0 == b.length)throw"userIds is required argument!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        return e({url: "/subscription/users/", method: "POST", data: b}, f.getCurrentCompany().id, a, d, b)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("TaxRatesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    return {
      getAllByCompany: function (f, e, b) {
        if (!e || !e.$id)throw"First argument must be Angularjs scope!";
        if (!f || "[object Function]" === Object.prototype.toString.call(f))throw"companyId is required argument!";
        return d.getListByUrl("/taxRate/" + f, b, function (a) {
          k.subscribe("/taxRate?targetId=" + f, e, function (b) {
            console.log(b);
            if ("TAX_RATE_SAVE" == b.action) {
              var f =
                d.findById(a, b.data.versionedId.id);
              f ? d.customizeObj(b.data, f) : a.push(d.customizeObj(b.data))
            } else"TAX_RATE_DELETE" == b.action && (d.deleteById(a, b.data.versionedId.id), e.$broadcast("tax_rate_delete", b.data))
          })
        })
      }, save: function (f, e) {
        if (!f)throw"taxRate is required!";
        var b = "/taxRate", a = "POST";
        f.id && (a = "PUT", b = b + "/" + f.id);
        b = h({url: b, method: a, data: f});
        d.handleCallback(b, e)
      }, deleteTaxRate: function (f, e) {
        if (!f)throw"taxRateId is required argument!";
        var b = h({url: "/taxRate/" + f, method: "DELETE"});
        d.handleCallback(b,
          e)
      }, isUniqueInCompany: function (f, e, b, a) {
        if (!f)throw"taxRateCode is required!";
        if (!b)throw"companyId is required!";
        var c = d.customizeObj({});
        h.get("/taxRate/isUniqueInCompany?taxRateCode=" + f + "&id=" + e + "&companyId=" + b).then(function (b) {
          d.customizeObj(b.data, c);
          a && a(b.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("TicketsService", ["$http", "$rootScope", "RealTimeService", "Utils", "TicketTagsService", "CompaniesService", function (h, m, k, d, f, e) {
    function b(a) {
      a.filter && (a.filter = a.filter.toUpperCase());
      a.priority && (a.priority = a.priority.toUpperCase());
      a.status && (a.status = a.status.toUpperCase())
    }

    function a(a, b) {
      return a.createdAt - b.createdAt
    }

    function c(a, b) {
      if (!a || !a.$id)throw"First argument must be Angularjs scope!";
      var c = u.lists[a.$id];
      if (!c)throw"There is no ticket list for scope " +
      a.$id;
      c.loadingInProcess ? console.log("Loading tickets already in process") : (0 < c.list.length ? c.params.lastId = c.list[c.list.length - 1].id : delete c.params.lastId, c.loadingInProcess = !0, h({
        method: "GET",
        url: "/v2/tickets",
        params: c.params
      }).then(function (e) {
        if (e) {
          for (var g = 0; g < e.data.length; g++) {
            var h = e.data[g];
            h.number = "Tkt# " + h.number;
            h.tags && f._makeDynamic(h.tags, a)
          }
          d.customizeArray(e.data, c.list);
          c.loadingInProcess = !1;
          b && b(e.data)
        }
        c.loadingInProcess = !1
      }, function (a) {
        c.loadingInProcess = !1;
        b && b(a.data)
      }))
    }

    function g(a, b, c, e) {
      c = {value: c};
      "[object Array]" === Object.prototype.toString.call(b) ? (a = "/v2/tickets/" + a, c.ids = b) : a = "/v2/tickets/" + b + "/" + a;
      b = h.put(a, c);
      d.handleCallback(b, e)
    }

    function n(a, b) {
      for (var d in u.lists)for (var c = u.lists[d].list, e = 0; e < c.length; e++) {
        var f = c[e];
        if (f.id === a) {
          b(f);
          break
        }
      }
      for (d in u.tickets)c = u.tickets[d].ticket, c.id === a && b(c)
    }

    function p(a, b, d) {
      if ("USER" === d.filter) {
        if ("COMPLETED" === a.status && "COMPLETED" !== b.status)return 1;
        if ("COMPLETED" === b.status && "COMPLETED" !== a.status)return -1
      }
      return t[d.filter](b) -
        t[d.filter](a)
    }

    function l(a) {
      return a.assignedAt || a.createdAt
    }

    function w(a, b) {
      return "URGENT" == b.filter && ("HIGH" != a.priorityLevel || "COMPLETED" == a.status || "ADMIN" !== m.currentUser.role && !a.sharedToCurrentUserAt) || "UNASSIGNED" == b.filter && a.assignedUser && a.assignedUser.id || "USER" == b.filter && (!a.assignedUser || a.assignedUser.id != m.currentUser.id) || "OPEN" == b.filter && "COMPLETED" == a.status || "CLOSED" == b.filter && ("COMPLETED" != a.status || "ADMIN" !== m.currentUser.role && (!a.assignedUser || a.assignedUser.id != m.currentUser.id)) ||
      "SHARED" == b.filter && !a.sharedToCurrentUserAt || "SPAM" == b.filter && (!a.spamPerformer || !a.spamPerformer.id || "ADMIN" !== m.currentUser.role && a.spamPerformer.id != m.currentUser.id) || "TRASH" == b.filter && !a.trash || "SPAM" !== b.filter && "TRASH" !== b.filter && (a.spamPerformer && a.spamPerformer.id || a.trash) || b.companyId && b.companyId != a.company.id || b.status && b.status != a.status || b.priority && b.priority != a.priorityLevel ? !1 : !0
    }

    var r = "ASSIGNED_USER PRIORITY_CHANGED STATUS TRASH SPAM TICKET_INVOICED TICKET_SHARE".split(" "),
      q = 0, u = {lists: {}, tickets: {}, counts: {}}, x = m.$new();
    k.subscribe("/tickets", x, function (a) {
      console.log(a);
      a.data && a.data.number && (a.data.number = "Tkt# " + a.data.number);
      if ("CREATED_TICKET" === a.action) {
        var b = d.customizeObj(a.data, {}), e;
        for (e in u.lists) {
          var g = u.lists[e];
          w(a.data, g.params) && g.list.unshift(b)
        }
      } else if (-1 < r.indexOf(a.action)) {
        b = d.customizeObj(a.data, {});
        for (e in u.lists) {
          var g = u.lists[e], h = !1, l = d.indexOfId(g.list, b.id);
          if (-1 < l)w(a.data, g.params) ? (d.customizeObj(b, g.list[l]), h = !0) : g.list.splice(l,
            1); else if (w(a.data, g.params))if (0 === g.list.length)g.list.push(b); else if (l = g.list[g.list.length - 1], 15 > g.list.length || 0 >= p(b, l, g.params))g.list.push(b), h = !0;
          h && g.list.sort(function (a, b) {
            return p(a, b, g.params)
          })
        }
        for (e in u.tickets)h = u.tickets[e].ticket, h.id === b.id && d.customizeObj(b, h)
      } else if ("READ" === a.action)n(a.data.id, function (a) {
        d.defineReadOnlyProperty(a, "unread", !1)
      }); else if ("TICKET_COLLAPSED" === a.action || "TICKET_DELETED" === a.action) {
        for (e in u.lists)d.deleteById(u.lists[e].list, a.data.id);
        for (e in u.tickets)b = u.tickets[e], b.ticket.id === a.data.id && (delete u.tickets[e], b.scope.$broadcast("ticket_is_not_available_anymore"))
      } else if ("TAG_LINKED" === a.action)for (b in a.data)n(b, function (b) {
        f._merge(b.tags, a.data[b.id])
      }); else if ("COMPANY_ARCHIVED" === a.action) {
        for (e in u.lists) {
          h = u.lists[e].list;
          for (l = 0; l < h.length; l++)b = h[l], b.company.id === a.data.id && (h.splice(l, 1), l--);
          h.length < v.layLoadingPageSize && c(u.lists[e].scope)
        }
        for (e in u.tickets)h = u.tickets[e].ticket, h.company.id === a.data.id && delete u.tickets[e]
      } else"TICKET_BILLABLE" ===
      a.action && n(a.data.id, function (b) {
        d.defineReadOnlyProperty(b, "isBillable", a.data.isBillable)
      })
    });
    var t = {
      URGENT: l, UNASSIGNED: function (a) {
        return a.createdAt
      }, USER: function (a) {
        return a.closedAt || a.assignedAt
      }, OPEN: function (a) {
        return a.assignedAt
      }, CLOSED: function (a) {
        return a.closedAt
      }, SHARED: function (a) {
        return a.sharedToCurrentUserAt
      }, ALL: l, NOT_SPAM_OR_TRASH: l, SPAM: function (a) {
        return a.deletedAt
      }, TRASH: function (a) {
        return a.deletedAt
      }
    };
    return {
      getList: function (a, e, f) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        if (!e || !e.filter)throw"'filter' is mandatory parameter that must be counted in second argument";
        b(e);
        var g = d.customizeObj([]);
        u.lists[a.$id] = {params: e, scope: a, list: g};
        c(a, f);
        a.$on("$destroy", function () {
          delete u.lists[a.$id]
        });
        return g
      }, loadMore: c, search: function (a, d) {
        if (!a || !a.filter)throw"'filter' is mandatory parameter that must be counted in first argument";
        if (!a.keyword)throw"'keyword' is mandatory parameter that must be counted in first argument";
        if (3 > a.keyword.length)throw"minimal length of 'keyword' is 3 characters";
        a.view = "base";
        b(a);
        for (var c = {
          companies: [],
          tickets: []
        }, f = e._search(a.keyword, !1), g = 0; g < f.length; g++)c.companies.push(f[g].staticCopy());
        h({method: "GET", url: "/v2/tickets", params: a}).then(function (a) {
          c.tickets = a.data;
          for (a = 0; a < c.tickets.length; a++) {
            var b = c.tickets[a];
            b.number = "Tkt# " + b.number
          }
          d && d(c)
        }, function (a) {
          d && d(a.data)
        });
        return c
      }, getCounts: function (a, b) {
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var c = q++, e = d.customizeObj({});
        u.counts[c] = e;
        a.$on("$destroy", function () {
          delete u.counts[c]
        });
        h.get("/v2/tickets/counts").then(function (a) {
          d.customizeObj(a.data, e);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        k.subscribe("/ticketCounts", a, function (a) {
          console.log(a);
          "TICKETS_COUNT" == a.action && d.customizeObj(a.data, e)
        });
        return e
      }, getOne: function (b, c, e, g) {
        if (!b)throw"Id is mandatory argument!";
        if (!c || !c.$id)throw"Second argument must be Angularjs scope!";
        var l = q++, n = {id: b}, p = "/v2/tickets/" + b;
        e && (p += "?view=extended");
        u.tickets[l] = {ticket: n, scope: c};
        c.$on("$destroy", function () {
          delete u.tickets[l]
        });
        h.get(p).then(function (b) {
          b.data.number = "Tkt# " + b.data.number;
          d.customizeObj(b.data, n);
          n.tags && f._makeDynamic(n.tags, c);
          e && n.updates.sort(a);
          g && g(b.data)
        }, function (a) {
          g && g(a.data)
        });
        e && k.subscribe("/ticketUpdates?targetId=" + b, c, function (b) {
          console.log(b);
          if ("UPDATE_SAVED" == b.action || "UPDATE_CREATED" == b.action) {
            var c = d.findById(n.updates, b.data.id);
            c ? d.customizeObj(b.data, c) : (c = d.customizeObj(b.data), n.updates.push(c));
            n.updates.sort(a)
          } else"UPDATE_DELETED" == b.action && d.deleteById(n.updates, b.data.id)
        });
        return n
      }, changePriority: function (a, b, d) {
        if (!a || !b)throw"ticketId and priority is required arguments!";
        g("priority", a, b.toUpperCase(), d)
      }, assignTo: function (a, b, d) {
        if (!a || !b)throw"ticketId and userId is required arguments!";
        g("assign", a, b, d)
      }, changeStatus: function (a, b, d) {
        if (!a || !b)throw"ticketId and status is required arguments!";
        g("status", a, b.toUpperCase(), d)
      }, changeSpamFlag: function (a, b, d) {
        if (!a)throw"ticketId is required arguments!";
        g("spam", a, !!b, d)
      }, changeTrashFlag: function (a, b, d) {
        if (!a)throw"ticketId is required arguments!";
        g("trash", a, !!b, d)
      }, deleteForever: function (a, b) {
        if (!a)throw"ticketId is required arguments!";
        var c, e = {};
        "[object Array]" === Object.prototype.toString.call(a) ? (c = "/v2/tickets", e.ids = a) : c = "/v2/tickets/" + a;
        c = h({url: c, data: e, method: "DELETE"});
        d.handleCallback(c, b)
      }, claimUser: function (a) {
        h.get("/tickets/claimUser?ticketId=" + a)
      }, createTicket: function (a, b) {
        a.priorityLevel && (a.priorityLevel = a.priorityLevel.toUpperCase());
        var c = h.post("/v2/tickets", a);
        d.handleCallback(c, b)
      }, getActualNumber: function (a, b) {
        h.get("/data/actualNumber?type=TICKET").success(function (a) {
          b(a.number)
        });
        k.subscribe("/number?targetId=TICKET", a, function (a) {
          console.log(a);
          "NUMBER_CHANGED" === a.action && b(d.getFormattedNumber(a.data, !0))
        })
      }, saveTicketUpdate: function (a, b, c, e) {
        if (!a || !b)throw"ticketId and ticketUpdate is required arguments!";
        a = "/v2/tickets/" + a + "/updates";
        var f = "POST";
        b.id && (a += "/" + b.id, f = "PUT");
        b = h({url: a, method: f, params: {close: !!c}, data: b});
        d.handleCallback(b, e)
      }, deleteTicketUpdate: function (a, b, c) {
        a = h({url: "/v2/tickets/" + a + "/updates/" + b, method: "DELETE"});
        d.handleCallback(a, c)
      }, loadRemainingTicketUpdates: function (b,
                                               c) {
        if (!b.id || !b.updates)throw"You can load updates only for detailed ticket!";
        if (0 == b.updates.length)throw"There is no updates";
        for (var e = [], f = 0; f < b.updates.length; f++)e.push(b.updates[f].id);
        h({url: "/v2/tickets/" + b.id + "/updates/fetch", method: "POST", data: e}).then(function (e) {
          d.customizeArray(e.data, b.updates);
          d.defineReadOnlyProperty(b, "unloadedUpdates", 0);
          b.updates.sort(a);
          c && c(e.data)
        }, function (a) {
          c && c(a.data)
        })
      }, markUpdateAsRead: function (a, b, c) {
        if (!a || !b)throw"ticketId and updateId is required parameters";
        a = h({url: "/v2/tickets/" + a + "/updates/" + b + "/read", method: "POST"});
        d.handleCallback(a, c)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("TicketTagsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    function f(a, b) {
      return b.createdAt - a.createdAt
    }

    function e(a) {
      c = m.$new();
      g.tags = d.customizeArray([]);
      h.get("/tag").then(function (b) {
        d.customizeArray(b.data, g.tags);
        g.tags && (g.tags.sort(f), k.subscribe("/tags", c, function (a) {
          console.log(a);
          if (g.tags)if ("TAG_SAVED" == a.action) {
            var b = d.findById(g.tags, a.data.id);
            b ? d.customizeObj(a.data, b) : (g.tags.unshift(d.customizeObj(a.data)),
              g.tags.sort(f))
          } else if ("TAG_REMOVED" == a.action)for (b in d.deleteById(g.tags, a.data.id), g.dynamicLists)for (var c = g.dynamicLists[b], e = 0; e < c.length; e++)d.deleteById(c[e], a.data.id)
        }), a && a(b.data))
      }, function (b) {
        console.log("ERROR!!!!!", b);
        a && a(b.data)
      })
    }

    function b() {
      0 === g.watchers.length && r.isEmptyObject(g.dynamicLists) && (c.$destroy(), g.tags = t)
    }

    function a(b, c) {
      if (!c || !c.$id)throw"First argument must be Angularjs scope!";
      if (g.tags) {
        for (var f = 0; f < b.length; f++)b[f] = d.findById(g.tags, b[f].id);
        for (; -1 < (f =
          b.indexOf(t));)b.splice(f, 1);
        g.addDynamicList(b, c)
      } else e(function () {
        a(b, c)
      })
    }

    var c, g = {
      tags: t, watchers: [], dynamicLists: {}, addWatcher: function (a) {
        var d = this.watchers;
        0 > d.indexOf(a.$id) && (d.push(a.$id), a.$on("$destroy", function () {
          var c = d.indexOf(a.$id);
          d.splice(c, 1);
          b()
        }))
      }, addDynamicList: function (a, d) {
        var c = this.dynamicLists;
        c[d.$id] || (c[d.$id] = []);
        c[d.$id].push(a);
        d.$on("$destroy", function () {
          delete c[d.$id];
          b()
        })
      }
    };
    return {
      _makeDynamic: a, _merge: function (a, b) {
        a.splice(0, a.length);
        for (var c = 0; c < b.length; c++) {
          var e =
            d.findById(g.tags, b[c]);
          e && a.push(e)
        }
      }, getList: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        g.tags ? b && setTimeout(function () {
          b(g.tags.staticCopy())
        }, 100) : e(b);
        g.addWatcher(a);
        return g.tags
      }, save: function (a, b) {
        if (!a)throw"ticketTag is required argument!";
        var c = "/tag", e = "POST";
        a.id && (c += "/" + a.id, e = "PUT");
        c = h({url: c, method: e, data: a});
        d.handleCallback(c, b)
      }, deleteTag: function (a, b) {
        if (!a)throw"tagId is required argument!";
        var c = h({url: "/tag/" + a, method: "DELETE"});
        d.handleCallback(c,
          b)
      }, link: function (a, b) {
        if (!a)throw"linkMap is required argument!";
        var c = h({url: "/tag/link", method: "POST", data: a});
        d.handleCallback(c, b)
      }, getTicketsCounts: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/tag/counts").then(function (a) {
          d.customizeObj(a.data, c);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        k.subscribe("/tagCounts", a, function (a) {
          console.log(a);
          "TAG_COUNTS" == a.action && d.customizeObj(a.data, c)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("UsersService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, m, k, d, f) {
    function e() {
      f._isInitialized() || setTimeout(e, 300);
      t || (t = !0, h.get("/users").then(function (b) {
        d.customizeArray(b.data, q.users);
        for (b = 0; b < q.users.length; b++) {
          var c = q.users[b];
          a(c);
          q.usersByCompanies[c.company.id] || (q.usersByCompanies[c.company.id] = []);
          q.usersByCompanies[c.company.id].push(c);
          c.company.id !== f.getCurrentCompany().id && q.clientUsers.push(c)
        }
        r = !0;
        for (b = 0; b < l.length; b++)l[b]();
        l = []
      }, function (a) {
        console.error(a);
        throw"Cannot initialize CompaniesService!";
      }), k.subscribe("/user", p, function (a) {
        console.log(a);
        if (r)if ("USER_SAVED" == a.action)b(a.data); else if ("USER_DELETED" == a.action) {
          var c = d.findById(q.users, a.data.id);
          d.deleteById(q.users, a.data.id);
          d.deleteById(q.clientUsers, a.data.id);
          c && d.deleteById(q.usersByCompanies[c.company.id], a.data.id)
        } else if ("USER_ONLINE" == a.action)(c = d.findById(q.users, a.data.id)) && d.defineReadOnlyProperty(c, "online",
          !!a.data.online); else if ("COMPANY_ARCHIVED" == a.action) {
          for (c = 0; c < q.users.length; c++)q.users[c].company.id === a.data.id && (q.users.splice(c, 1), c--);
          for (c = 0; c < q.clientUsers.length; c++)q.clientUsers[c].company.id === a.data.id && (q.clientUsers.splice(c, 1), c--);
          delete q.usersByCompanies[a.data.id]
        } else"USERS_DEARCHIVED" == a.action && a.data.forEach(b)
      }))
    }

    function b(b) {
      var c = d.findById(q.users, b.id);
      c ? d.customizeObj(b, c) : (b = d.customizeObj(b), q.users.push(b), b.company.id !== f.getCurrentCompany().id && q.clientUsers.push(b),
        a(b), q.usersByCompanies[b.company.id] || (q.usersByCompanies[b.company.id] = []), q.usersByCompanies[b.company.id].push(b))
    }

    function a(a) {
      var b = [a.firstName, a.lastName].map(function (a) {
        return a.charAt(0).toUpperCase()
      }).join("");
      d.defineReadOnlyProperty(a, "initials", b)
    }

    function c() {
      return g(m.currentUser.id)
    }

    function g(a) {
      return d.findById(q.users, a)
    }

    function n(a, b, d) {
      if (!a)throw"Keyword is required!";
      var e = [];
      d = d ? q.usersByCompanies[d] || [] : q.users;
      for (var f = 0; f < d.length; f++) {
        var g = d[f];
        (b || c().company.id !==
        g.company.id) && -1 < (g.firstName + " " + g.lastName).toLowerCase().indexOf(a.toLowerCase()) && e.push(g)
      }
      return e
    }

    var p = m.$new(), l = [], r = !1, t = !1, q = {users: [], clientUsers: [], usersByCompanies: {}};
    d.customizeObj(q);
    e();
    return {
      _addInitListener: function (a) {
        if (!a)throw"callback is required!";
        r ? a() : l.push(a)
      }, getCurrentUser: c, getAllUsers: function () {
        return q.users
      }, getClientUsers: function () {
        return q.clientUsers
      }, getAllByCompanyId: function (a) {
        return q.usersByCompanies[a] || []
      }, getOneById: g, searchByAllUsers: function (a) {
        return n(a,
          !0)
      }, searchByClientUsers: function (a) {
        return n(a, !1)
      }, searchByUsersFromCompany: function (a, b) {
        return n(a, !1, b)
      }, changeUserRole: function (a, b, c) {
        if (!a)throw"userId is required!";
        if (!b)throw"roleName is required!";
        a = h({url: "/users/updateRole/" + a + "?role=" + b.toUpperCase(), method: "PUT"});
        d.handleCallback(a, c)
      }, save: function (a, b) {
        if (!a)throw"user is required!";
        var c = "/users", e = "POST";
        a.id && (e = "PUT", c = c + "/" + a.id);
        c = h({url: c, method: e, data: a});
        d.handleCallback(c, b)
      }, isEmailUnique: function (a, b, c) {
        if (!a)throw"email is required!";
        var e = d.customizeObj({});
        h.get("/users/isEmailUnique?email=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, e);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        return e
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("VendorsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, m, k, d) {
    return {
      save: function (f, e) {
        if (!f)throw"vendor is required!";
        var b = "POST";
        f.id && (b = "PUT");
        b = h({url: "/vendor", method: b, data: f});
        d.handleCallback(b, e)
      }, getAll: function (f, e) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/vendor", e, function (b) {
          k.subscribe("/vendor", f, function (a) {
            console.log(a);
            if ("VENDOR_SAVE" == a.action) {
              var c =
                d.findById(b, a.data.id);
              c ? d.customizeObj(a.data, c) : b.push(d.customizeObj(a.data))
            } else"VENDOR_ARCHIVED" == a.action ? (d.deleteById(b, a.data.id), f.$broadcast("vendor_archived", a.data)) : "VENDOR_DEARCHIVED" == a.action && (b.push(d.customizeObj(a.data)), f.$broadcast("vendor_dearchived", a.data))
          })
        })
      }, getAllInCompanyForAutocomplete: function (f, e) {
        if (!f)throw"companyId is required!";
        var b = d.customizeArray([]);
        h.get("/vendor/getAll/" + f).then(function (a) {
          d.customizeArray(a.data, b);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return b
      }, isWebsiteUnique: function (f, e, b) {
        if (!f)throw"website is required!";
        var a = d.customizeObj({});
        h.get("/vendor/isWebsiteUnique?website=" + f + "&id=" + e).then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }, isNameUnique: function (f, e, b) {
        if (!f)throw"name is required!";
        var a = d.customizeObj({});
        h.get("/vendor/isNameUnique?name=" + f + "&id=" + e).then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }, archive: function (f, e) {
        if (!f)throw"id is required!";
        var b = h.get("/vendor/archive/" + f);
        d.handleCallback(b, e)
      }, dearchive: function (f, e) {
        if (!f)throw"id is required!";
        var b = h.get("/vendor/dearchive/" + f);
        d.handleCallback(b, e)
      }
    }
  }])
})(window, jQuery);
