(function (t, r, q) {
  t.layLoadingPageSize = 15;
  r = angular.module("main.services", []);
  r.config(["$provide", "$httpProvider", function (h, l) {
    h.factory("myHttpInterceptor", [function () {
      return {
        request: function (h) {
          h.url && (h.params || (h.params = {}), h.url.endsWith(".html") || (h.params.t = (new Date).getTime()));
          return h
        }, response: function (h) {
          if ("unauthorized" === h.data.errorMessage || "unauthorized" === h.data.authMessage)t.location.pathname = "/login"; else if (h.data.showMessage)return alert(h.data.showMessage), {};
          return h
        }
      }
    }]);
    l.interceptors.push("myHttpInterceptor")
  }]);
  r.run(["$http", "$rootScope", function (h, l) {
    h.get("/users/current").success(function (h) {
      l.currentUser = h
    });
    l.numberCounterDelimiter = "-"
  }]);
  r.service("Downloader", function () {
    function h(g) {
      if (/(iP)/g.test(navigator.userAgent))return alert("Your device does not support files downloading. Please try again in desktop browser."), !1;
      if (l || k || d) {
        var f = document.createElement("a");
        f.href = g;
        if (f.download !== q) {
          var b = g.substring(g.lastIndexOf("/") + 1, g.length);
          f.download =
            b
        }
        if (document.createEvent)return g = document.createEvent("MouseEvents"), g.initEvent("click", !0, !0), f.dispatchEvent(g), !0
      }
      t.open(g, "_self");
      return !0
    }

    var l = -1 < navigator.userAgent.toLowerCase().indexOf("chrome"), k = -1 < navigator.userAgent.toLowerCase().indexOf("safari"), d = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
    return {
      downloadByUrl: h, downloadTicketAttachments: function (d) {
        h("/v2/tickets/" + d + "/downloadAttachments")
      }, downloadFile: function (d) {
        h("/file" + d)
      }
    }
  });
  r.service("Utils", ["$http", function (h) {
    function l(b) {
      var a =
        b;
      !a && this.staticCopy && (a = this);
      if ("[object Array]" === Object.prototype.toString.call(a)) {
        b = [];
        for (var c = 0; c < a.length; c++)b.push(l(a[c]))
      } else if ("[object Object]" === Object.prototype.toString.call(a))for (c in b = {}, a)"staticCopy" !== c && "$$hashKey" != c && (b[c] = l(a[c])); else return a;
      return b
    }

    function k(b, a) {
      if ("[object String]" === Object.prototype.toString.call(b))return b;
      a = a || b;
      for (var c in b) {
        var e = b[c];
        "[object Array]" === Object.prototype.toString.call(e) ? d(e) : "[object Object]" === Object.prototype.toString.call(e) &&
        k(e);
        g(a, c, e)
      }
      g(a, "staticCopy", l);
      return a
    }

    function d(b, a) {
      if (a) {
        for (var c = 0; c < b.length; c++)a.push(k(b[c]));
        g(a, "staticCopy", l);
        return a
      }
      for (c = 0; c < b.length; c++)b[c] = k(b[c]);
      g(b, "staticCopy", l);
      return b
    }

    function g(b, a, c) {
      Object.defineProperty(b, a, {value: c, writable: !1, enumerable: !0, configurable: !0})
    }

    function f(b, a) {
      for (var c = 0; c < b.length; c++) {
        var e = b[c];
        if (e && (e = e.versionedId ? e.versionedId.id : e.id, e === a))return c
      }
      return -1
    }

    return {
      customizeObj: k, customizeArray: d, defineReadOnlyProperty: g, findById: function (b,
                                                                                         a) {
        for (var c = 0; c < b.length; c++) {
          var e = b[c];
          if ((e.versionedId ? e.versionedId.id : e.id) === a)return e
        }
      }, indexOfId: f, handleCallback: function (b, a) {
        a && b.then(function (c) {
          a(c.data)
        }, function (c) {
          a(c.data)
        })
      }, deleteById: function (b, a) {
        var c = f(b, a);
        -1 < c && b.splice(c, 1)
      }, getListByUrl: function (b, a, c) {
        var e = [];
        c && (e = d(e));
        h.get(b).then(function (b) {
          if (c)d(b.data, e), c(e); else for (var v = 0; v < b.data.length; v++)e.push(b.data[v]);
          a && a(e)
        }, function (e) {
          a && a(e.data)
        });
        return e
      }, getFormattedNumber: function (b, a) {
        var c;
        if (a)for (c =
                     "" + (parseInt(b.numPart) + 1); c.length < b.numPart.length;)c = "0" + c; else c = b.numPart;
        return b.charPart ? b.charPart + $rootScope.numberCounterDelimiter + c : c
      }, getComparatorBy: function (b, a) {
        return function (c, e) {
          return a ? e[b] - c[b] : c[b] - e[b]
        }
      }, formatDate: function (b) {
        return b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate()
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("AddressesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    return {
      getAllLocales: function (g) {
        var f = d.customizeObj({});
        h.get("/addresses/getAllLocales").then(function (b) {
          d.customizeObj(b.data, f);
          g && g(b.data)
        }, function (b) {
          g && g(b.data)
        });
        return f
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("BillableService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    return {
      getTotalBilledAmount: function (g, f) {
        var b = d.customizeObj({});
        h.get("/billable/totalBilled").then(function (a) {
          d.customizeObj(a.data, b);
          k.subscribe("/billedTicketsSumAdded", g, function (a) {
            console.log(a);
            "BILLED_TICKETS_SUM_ADDED" === a.action && d.defineReadOnlyProperty(b, "value", b.value + a.data)
          });
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return b
      }, getBillableChartData: function (g,
                                         f) {
        var b = d.customizeArray([]);
        h.get("/billable/billed/lastDays").then(function (a) {
          d.customizeArray(a.data, b);
          k.subscribe("/billedTicketsSumAdded", g, function (a) {
            console.log(a);
            if ("BILLED_TICKETS_SUM_ADDED" === a.action) {
              var e = b[b.length - 1];
              d.defineReadOnlyProperty(e, "sum", e.sum + a.data)
            }
          });
          f && f(b)
        }, function (a) {
          f && f(a.data)
        });
        return b
      }, getBillableCompanies: function (g, f) {
        if (!g || !g.$id)throw"First argument must be Angularjs scope!";
        var b = d.customizeArray([]);
        h({url: "/billable/total", method: "GET"}).then(function (a) {
          d.customizeArray(a.data,
            b);
          k.subscribe("/billableTotal", g, function (a) {
            console.log(a);
            if ("CLIENT_BILLABLE_TOTAL" == a.action)if (0 < a.data.ticketsCount) {
              var e = d.findById(b, a.data.id);
              e || (e = {}, b.push(e));
              d.customizeObj(a.data, e)
            } else a = d.indexOfId(b, a.data.id), -1 < a && (d.defineReadOnlyProperty(b[a], "total", 0), d.defineReadOnlyProperty(b[a], "ticketsCount", 0), b.splice(a, 1)); else if ("COMPANY_ARCHIVED" == a.action)for (e = 0; e < b.length; e++)b[e].company.id === a.data.id && (b.splice(e, 1), e--)
          });
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return b
      },
      getCompanyBillableTickets: function (g, f, b) {
        if (!g)throw"companyId is required!";
        if (!f || !f.$id)throw"Second argument must be Angularjs scope!";
        var a = [];
        h.get("/billable/expenses/" + g).then(function (c) {
          d.customizeArray(c.data, a);
          k.subscribe("/billableExpense?targetId=" + g, f, function (e) {
            console.log(e);
            if ("BILLABLE_EXPENSE_ADDED" == e.action) {
              var b = d.findById(a, e.data.id);
              b || (b = {}, a.push(b));
              d.customizeObj(e.data, b)
            } else"BILLABLE_EXPENSE_REMOVED" == e.action && (e = d.indexOfId(a, e.data), -1 < e && a.splice(e, 1))
          });
          b &&
          b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }, createInvoice: function (g, f) {
        if (!g)throw"invoice is required!";
        var b = h({url: "/billable/invoice", method: "POST", data: g});
        d.handleCallback(b, f)
      }, getActualInvoiceNumber: function (g, f) {
        h.get("/data/actualNumber?type=INVOICE").success(function (b) {
          f(b.number)
        });
        k.subscribe("/number?targetId=INVOICE", g, function (b) {
          console.log(b);
          "NUMBER_CHANGED" === b.action && f(d.getFormattedNumber(b.data, !0))
        })
      }, search: function (d) {
        if (!d)throw"Keyword is required!";
        return h.get("/billable/search?keyword=" +
          d).then(function (d) {
          return d.data
        })
      }, getLockedTicketIds: function (g, f) {
        if (!g || !g.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/billable/invoice/lock", f, function (b) {
          k.subscribe("/ticketResolution", g, function (a) {
            console.log(a);
            if ("TICKET_LOCKED" == a.action)for (var c = 0; c < a.data.length; c++)b.push(a.data[c]); else if ("TICKET_UNLOCKED" == a.action)for (c = 0; c < b.length; c++)for (var e = 0; e < a.data.length; e++)b[c] == a.data[e] && b.splice(c, 1)
          })
        })
      }, lockTicketIds: function (g, f) {
        if (!g)throw"ticketIds is required!";
        var b = d.customizeObj({});
        h({url: "/billable/invoice/lock", method: "POST", data: g}).then(function (a) {
          d.customizeObj(a.data, b);
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return b
      }, unlockTicketIds: function (g, f) {
        if (!g)throw"lockId is required!";
        var b = h.get("/billable/invoice/unlock/" + g);
        d.handleCallback(b, f)
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("CompaniesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    function g(b, c) {
      if (!b)throw"Keyword is required!";
      for (var d = [], m = 0; m < a.companies.length; m++) {
        var f = a.companies[m];
        (c || a.currentCompany.id !== f.id) && -1 < f.name.indexOf(b) && d.push(f)
      }
      return d
    }

    l = l.$new();
    var f = !1, b = [], a = {companies: [], clientCompanies: [], currentCompany: {}};
    d.customizeObj(a);
    h.get("/company/clients").then(function (b) {
      d.customizeArray(b.data,
        a.clientCompanies);
      for (b = 0; b < a.clientCompanies.length; b++)a.companies.push(a.clientCompanies[b]);
      c++;
      2 === c && (f = !0)
    }, function (a) {
      console.error(a);
      throw"Cannot initialize CompaniesService!";
    });
    h.get("/company/current").then(function (b) {
      d.customizeObj(b.data, a.currentCompany);
      a.companies.push(a.currentCompany);
      c++;
      2 === c && (f = !0)
    }, function (a) {
      console.error(a);
      throw"Cannot initialize CompaniesService!";
    });
    var c = 0;
    k.subscribe("/company", l, function (e) {
      console.log(e);
      if (f)if ("COMPANY_SAVED" == e.action) {
        var c =
          d.findById(a.companies, e.data.id);
        if (c)d.customizeObj(e.data, c); else for (e = d.customizeObj(e.data), a.companies.push(e), a.clientCompanies.push(e), e = 0; e < b.length; e++)b[e]()
      } else if ("COMPANY_ARCHIVED" == e.action)for (d.deleteById(a.companies, e.data.id), d.deleteById(a.clientCompanies, e.data.id), e = 0; e < b.length; e++)b[e](); else if ("COMPANY_DEARCHIVED" == e.action)for (c = d.customizeObj(e.data), a.clientCompanies.push(c), a.companies.push(c), e = 0; e < b.length; e++)b[e]()
    });
    return {
      _addAmountChangeListener: function (a) {
        b.push(a)
      },
      _search: g, _isInitialized: function () {
        return f
      }, getCurrentCompany: function () {
        return a.currentCompany
      }, getClientCompanies: function () {
        return a.clientCompanies
      }, getAllCompanies: function () {
        return a.companies
      }, getOneById: function (b) {
        return d.findById(a.companies, b)
      }, searchByAllCompanies: function (a) {
        return g(a, !0)
      }, searchByClientCompanies: function (a) {
        return g(a, !1)
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
        var m = d.customizeObj({});
        h.get("/company/" + a + "/info").then(function (a) {
          d.customizeObj(a.data,
            m);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        k.subscribe("/clientCompaniesInfo", b, function (b) {
          console.log(b);
          if ("CLIENT_COMPANY_INFO" == b.action) {
            b = JSON.parse(b.data);
            for (var c in b)c === a && d.customizeObj(b[a], m)
          }
        });
        return m
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
          for (var e in a.data)c[e] = a.data[e];
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        return c
      }, isNameUnique: function (a, b, c) {
        if (!a)throw"name is required!";
        var m = d.customizeObj({});
        h.get("/company/isCompanyNameUnique?name=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, m);
          c && c(a.data)
        }, function (a) {
          c &&
          c(a.data)
        });
        return m
      }, isDomainUnique: function (a, b, c) {
        if (!a)throw"domain is required!";
        var m = d.customizeObj({});
        h.get("/company/isCompanyDomainUnique?domain=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, m);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        return m
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("ContactsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, l, k, d) {
    return {
      isEmailUnique: function (g, f, b) {
        if (!g)throw"email is required!";
        var a = d.customizeObj({});
        h.get("/contacts/isEmailUnique?email=" + g + "&id=" + f).then(function (c) {
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
(function (t, r, q) {
  angular.module("main.services").factory("DevicesService", ["$http", "$rootScope", "RealTimeService", "Utils", "UsersService", function (h, l, k, d, g) {
    l = l.$new();
    var f = {devices: [], devicesByCompanies: {}};
    d.customizeObj(f);
    h.get("/devices").then(function (b) {
      d.customizeObj(b.data, f.devicesByCompanies);
      for (var a in f.devicesByCompanies)if ("staticCopy" !== a)for (b = 0; b < f.devicesByCompanies[a].length; b++)f.devices.push(f.devicesByCompanies[a][b]);
      g._addInitListener(function () {
        for (var a = 0; a < f.devices.length; a++)for (var b =
          0; b < f.devices[a].users.length; b++) {
          var d = g.getOneById(f.devices[a].users[b].id);
          f.devices[a].users[b] = d
        }
      })
    }, function (b) {
      console.error(b);
      throw"Cannot initialize CompaniesService!";
    });
    k.subscribe("/device", l, function (b) {
      console.log(b)
    });
    return {
      getAllDevices: function () {
        return f.devices
      }, getAllByCompanyId: function (b) {
        return f.devicesByCompanies[b] || []
      }, getOneById: function (b) {
        return d.findById(f.devices, b)
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("FilesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    return {
      create: function (d, f, b, a, c) {
        if (!d)throw"file is required!";
        var e = {}, n = new FormData;
        n.append("file", d);
        d = new XMLHttpRequest;
        d.upload.addEventListener("progress", f, !1);
        d.addEventListener("load", function (a) {
          a = angular.fromJson(a.currentTarget.responseText);
          for (var c in a)e[c] = a[c];
          b && b(e)
        }, !1);
        d.addEventListener("error", a, !1);
        d.open("POST", "/file?isAvatar=" + !!c);
        d.send(n);
        return e
      }, createImageFromBase64Url: function (d, f) {
        if (!d)throw"base64Url is required!";
        var b = {};
        h({url: "/base64image", method: "POST", data: d.substring(22, d.length)}).then(function (a) {
          for (var c in a.data)b[c] = a.data[c];
          f && f(b)
        });
        return b
      }, getMetadata: function (d, f) {
        if (!d)throw"fileId is required!";
        var b = {id: d};
        h.get("/file/" + d + "/meta").then(function (a) {
          for (var c in a.data)b[c] = a.data[c];
          f && f(b)
        }, function (a) {
          f && f(a.data)
        });
        return b
      }, remove: function (d, f) {
        if (!d)throw"fileId is required!";
        h({
          url: "/file/" +
          d, method: "DELETE"
        }).then(function (b) {
          f && f(b.data)
        }, function (b) {
          f && f(b.data)
        })
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("ProductsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, l, k, d, g) {
    return {
      search: function (d) {
        if (!d)throw"Keyword is required!";
        return h.get("/products/search?keyword=" + d).then(function (b) {
          return b.data
        })
      }, getCategories: function (f, b) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/products/categories", b, function (a) {
          k.subscribe("/productCategory", f, function (b) {
            console.log(b);
            if ("PRODUCT_CATEGORY_SAVED" == b.action) {
              var e = d.findById(a, b.data.id);
              e ? d.customizeObj(b.data, e) : a.push(d.customizeObj(b.data))
            } else"PRODUCT_CATEGORY_DELETED" == b.action && (d.deleteById(a, b.data.id), f.$broadcast("product_category_deleted", b.data))
          })
        })
      }, saveCategory: function (f, b) {
        if (!f)throw"category is required!";
        var a = "/products/categories", c = "POST";
        f.id && (a += "/" + f.id, c = "PUT");
        a = h({url: a, method: c, data: f});
        d.handleCallback(a, b)
      }, deleteCategory: function (f, b) {
        if (!f)throw"categoryId is required argument!";
        var a = h({url: "/products/categories/" + f, method: "DELETE"});
        d.handleCallback(a, b)
      }, getAllByCategory: function (f, b, a, c) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        if (!b)throw"categoryId is required argument!";
        var e = "/products?categoryId=" + b;
        c && (e = "/products/full?categoryId=" + b);
        return d.getListByUrl(e, a, function (a) {
          k.subscribe("/product?targetId=" + b, f, function (b) {
            console.log(b);
            if ("PRODUCT_SAVED" == b.action) {
              var c = d.findById(a, b.data.versionedId.id);
              c ? d.customizeObj(b.data, c) : a.push(d.customizeObj(b.data))
            } else"PRODUCT_DELETED" ==
            b.action && (d.deleteById(a, b.data.versionedId.id), f.$broadcast("product_deleted", b.data))
          })
        })
      }, saveProduct: function (f, b) {
        if (!f)throw"product is required!";
        var a = "POST";
        f.id && (a = "PUT");
        a = h({url: "/products", method: a, data: f});
        d.handleCallback(a, b)
      }, deleteProduct: function (f, b) {
        if (!f)throw"productId is required argument!";
        var a = h({url: "/products/" + f, method: "DELETE"});
        d.handleCallback(a, b)
      }, isProductNameUnique: function (f, b, a, c) {
        if (!f)throw"name is required!";
        if (!a)throw"vendorId is required!";
        var e = d.customizeObj({});
        h.get("/products/isProductNameUnique?name=" + f + "&id=" + b + "&vendorId=" + a).then(function (a) {
          d.customizeObj(a.data, e);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        return e
      }, getActualCode: function (f, b) {
        if (!f || !f.$id)throw"Second argument must be Angularjs scope!";
        var a = d.customizeObj({});
        h.get("/products/actualCode").then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        k.subscribe("/productCode", f, function (b) {
          console.log(b);
          "PRODUCT_CODE_CHANGED" === b.action && d.defineReadOnlyProperty(a,
            "value", b.data)
        });
        return a
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("RealTimeService", ["$http", "$timeout", "$rootScope", function (h, l, k) {
    function d() {
      h.post("/realTime/createWatcher").success(function (b) {
        a = b.id;
        if (0 < c.length) {
          for (b = 0; b < c.length; b++) {
            var e = c[b];
            v.subscribe(e.url, e.scope, e.callback)
          }
          c = []
        }
        f()
      }).error(function (a, b, c, e) {
        console.error("Cannot receive watcher Id !!!", a, b, c, e);
        throw"Cannot initialize RealTimeService";
      })
    }

    function g() {
      a = q;
      for (var b in n) {
        var e = n[b];
        e && !e.scope.$$destroyed && c.push(e)
      }
      n =
      {};
      d()
    }

    function f() {
      0 < e ? l(f, 300) : h.post("/realTime/watch/" + a, Object.keys(n) || []).then(function (a) {
        console.log(a.data);
        if ("timeout" == a.data || "destroyed" == a.data.message || 205 == a.status)g(); else {
          for (var b in a.data) {
            var c = n[b];
            if (c && !c.scope.$$destroyed) {
              var e = a.data[b];
              if (e)for (var d = 0; d < e.length; d++)c.callback(e[d])
            }
          }
          f()
        }
      }, function (a) {
        a && 0 !== a.status ? 205 == a.status ? g() : (console.log("ERRRORRR!!!!!!!!!!!!", a), l(f, 300)) : (console.log("ERRRORRR?????", a), l(g, 1E3))
      })
    }

    function b(a) {
      for (var c in n) {
        var e = n[c];
        e && !e.scope.$$destroyed && e.callback !== b && e.callback(a)
      }
      "COMPANY_ARCHIVED" !== a.action && "COMPANY_DEARCHIVED" !== a.action || k.$broadcast(a.action.toLowerCase(), a.data.id)
    }

    var a, c = [{url: "/global", scope: k, callback: b}], e = 0, n = {};
    d();
    var v = {
      subscribe: function (b, d, f) {
        a ? (e++, h.get("/realTime/subscribe/" + a + b).success(function (a) {
          e--;
          n[a.id] = {url: b, scope: d, callback: f};
          d.$on("$destroy", function () {
            delete n[a.id]
          })
        }).error(function (a, n, v, h) {
          e--;
          205 == n && (c.push({url: b, scope: d, callback: f}), g());
          console.error("Cannot subscribe on " +
            b, a, n, v, h)
        })) : c.push({url: b, scope: d, callback: f})
      }
    };
    return v
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("ReceiptArchiveService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    return {
      getReceiptArchiveData: function (g, f) {
        if (!g || !g.$id)throw"First argument must be Angularjs scope!";
        var b = d.customizeObj({list: [], companies: {}});
        h.get("/receiptArchive").then(function (a) {
          d.customizeArray(a.data, b.list);
          b.list.forEach(function (a) {
            var e = b.companies[a.companyId];
            e ? e.push(a) : d.defineReadOnlyProperty(b.companies, a.companyId, d.customizeArray([a]))
          });
          k.subscribe("/receiptArchive", g, function (a) {
            console.log(a);
            if ("RECEIPT_ARCHIVE_ADDED" === a.action) {
              for (var e = [], n = 0; n < a.data.length; n++) {
                var f = a.data[n], m;
                if (f.recurringInvoice) {
                  var g = d.findById(b.list, f.recurringInvoice.id);
                  g ? (d.defineReadOnlyProperty(g, "invoicesCount", g.invoicesCount + 1), d.defineReadOnlyProperty(g, "sum", g.sum + f.sum), f.date > g.date && (d.defineReadOnlyProperty(g, "date", f.date), d.defineReadOnlyProperty(g, "paidOn", f.paidOn))) : m = d.customizeObj({
                    id: f.recurringInvoice.id,
                    isRecurring: !0,
                    frequency: f.recurringInvoice.frequency,
                    number: f.recurringInvoice.number,
                    companyId: f.company.id,
                    date: f.date,
                    paidOn: f.paidOn,
                    sum: f.sum,
                    invoicesCount: 1
                  })
                } else m = d.customizeObj({
                  id: f.id,
                  isRecurring: !1,
                  frequency: null,
                  number: f.number,
                  companyId: f.company.id,
                  date: f.date,
                  paidOn: f.paidOn,
                  sum: f.sum,
                  invoicesCount: null
                });
                m && (b.list.push(m), (f = b.companies[m.companyId]) ? f.push(m) : d.defineReadOnlyProperty(b.companies, m.companyId, d.customizeArray([m])), 0 > e.indexOf(m.companyId) && e.push(m.companyId))
              }
              b.list.sort(d.getComparatorBy("number"));
              e.forEach(function (a) {
                b.companies[a].sort(d.getComparatorBy("number"))
              })
            } else if ("COMPANY_ARCHIVED" ===
              a.action) {
              for (n = 0; n < b.list.length; n++)b.list[n].companyId === a.data.id && (b.list.splice(n, 1), n--);
              delete b.companies[a.data.id]
            }
          });
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return b
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("ReceivableService", ["$http", "$rootScope", "RealTimeService", "CompaniesService", "Utils", "$filter", function (h, l, k, d, g) {
    function f(b, a) {
      if (!b)throw"invoiceIds is required!";
      var c = h({url: "/receivable/resend", method: "POST", data: b});
      g.handleCallback(c, a)
    }

    return {
      getReceivedPaymentsSumByCompany: function (b, a, c) {
        if (!b)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = g.customizeObj({});
        h.get("/receivable/paymentSum/" +
          b).then(function (d) {
          g.customizeObj(d.data, e);
          k.subscribe("/companyPaymentReceived?targetId=" + b, a, function (a) {
            console.log(a);
            "COMPANY_PAYMENT_RECEIVED" === a.action ? g.defineReadOnlyProperty(e, "value", e.value + a.data) : "RECEIVED_PAYMENTS_SUM" === a.action && g.defineReadOnlyProperty(e, "value", a.data)
          });
          c && c(d.data)
        }, function (a) {
          c && c(a.data)
        });
        return e
      }, getReceivableGraphData: function (b, a) {
        var c = g.customizeArray([]);
        h.get("/receivable/chart/lastDays").then(function (e) {
          g.customizeArray(e.data, c);
          k.subscribe("/todayReceivableChartPoint?targetId=" +
            d.getCurrentCompany().id, b, function (a) {
            console.log(a);
            if ("TODAY_RECEIVABLE_CHART_POINT" === a.action) {
              var b = c[c.length - 1], e = new Date(b.date), d = new Date(a.data.date);
              e.getFullYear() === d.getFullYear() && e.getMonth() === d.getMonth() && e.getDate() + 1 === d.getDate() ? (c.push(g.customizeObj(a.data)), c.splice(0, 1)) : g.customizeObj(a.data, b)
            }
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getReceivableInvoicesData: function (b, a) {
        if (!b || !b.$id)throw"First argument must be Angularjs scope!";
        var c = g.customizeObj({
          list: [],
          companies: {}
        });
        h.get("/receivable").then(function (e) {
          for (var d = g.customizeArray([]), f = 0; f < e.data.length; f++) {
            var m = g.customizeObj(e.data[f]);
            if (m.recurringInvoice) {
              var h = g.findById(d, m.recurringInvoice.id);
              h || (h = m.recurringInvoice, g.defineReadOnlyProperty(h, "isRecurring", !0), g.defineReadOnlyProperty(h, "company", m.company), g.defineReadOnlyProperty(h, "invoices", g.customizeArray([])), d.push(h));
              h.invoices.push(m)
            } else d.push(m)
          }
          d.sort(g.getComparatorBy("number"));
          for (f = 0; f < d.length; f++)m = d[f], c.companies[m.company.id] ||
          g.defineReadOnlyProperty(c.companies, m.company.id, g.customizeArray([])), c.companies[m.company.id].push(m);
          g.defineReadOnlyProperty(c, "list", d);
          k.subscribe("/receivableInvoice", b, function (a) {
            console.log(a);
            if ("INVOICE_SAVED" == a.action) {
              var b = a.data, e;
              if (b.recurringInvoice) {
                var d = g.findById(c.list, b.recurringInvoice.id);
                d || (d = b.recurringInvoice, d.isRecurring = !0, d.company = b.company, d.invoices = [], e = d);
                d.invoices.push(b)
              } else e = b;
              e && (c.list.push(e), c.companies[e.company.id] || (c.companies[e.company.id] =
                []), c.companies[e.company.id].push(b))
            } else if ("INVOICE_STATUS" === a.action)a.data.recurringInvoice ? ((b = g.findById(c.list, a.data.recurringInvoice.id)) || console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING RECURRING INVOICE-----!!!!!!!"), b = g.findById(b.invoices, a.data.id)) : b = g.findById(c.list, a.data.id), b ? g.defineReadOnlyProperty(b, "status", a.data.status) : console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING INVOICE-----!!!!!!!!"); else if ("PAYMENT_RECEIVED" === a.action)for (a = a.data,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        e = 0; e < a.length; e++) {
              for (var f = a[e], n = 0; n < c.list.length && !d; n++) {
                var m = c.list[n];
                if (m.isRecurring)for (var v = 0; v < m.invoices.length && !d; v++) {
                  var h = m.invoices[v];
                  f === h.id && (m.invoices.splice(v, 1), d = h.company.id, b = m.id, 0 === m.invoices.length && c.list.splice(n, 1))
                } else f === m.id && (c.list.splice(n, 1), d = m.company.id)
              }
              d && c.companies[d] && (n = c.companies[d], b ? (f = g.indexOfId(n, b), -1 < f && 0 === n[f].invoices.length && n.splice(f, 1)) : (f = g.indexOfId(n, f), -1 < f && n.splice(f, 1)), 0 === n.length && delete c.companies[d])
            } else if ("COMPANY_ARCHIVED" ==
              a.action)for (delete c.companies[a.data.id], e = 0; e < c.list.length; e++)c.list[e].company.id === a.data.id && (c.list.splice(e, 1), e--)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, receivePayment: function (b, a, c) {
        if (!b)throw"paymentMethod is required!";
        if (!a || 0 === a.length)throw"invoiceIds is required!";
        b = h({url: "/receivable/receivePayment", method: "POST", params: {paymentMethod: b.toUpperCase()}, data: a});
        g.handleCallback(b, c)
      }, resendInvoice: function (b, a) {
        if (!b)throw"invoiceId is required!";
        f([b], a)
      }, resendInvoices: f,
      search: function (b) {
        if (!b)throw"Keyword is required!";
        return h.get("/receivable/search?keyword=" + b).then(function (a) {
          return a.data
        })
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("RecurringService", ["$http", "$rootScope", "RealTimeService", "CompaniesService", "Utils", "$filter", function (h, l, k, d, g) {
    function f(a, b, e, d) {
      if (!b)throw"recurringInvoiceId is required!";
      if (!e)throw"expense is required!";
      a = {url: "/recurringInvoice/" + b + "/" + a, data: e};
      e.id ? (a.method = "PUT", a.url = a.url + "/" + e.id) : a.method = "POST";
      e = h(a);
      g.handleCallback(e, d)
    }

    function b(a, b, e) {
      if (!a)throw"recurringInvoiceId is required!";
      if (!b)throw"expenseId is required!";
      a = h({url: "/recurringInvoice/" + a + "/expense/" + b, method: "DELETE"});
      g.handleCallback(a, e)
    }

    return {
      getRecurringGraphData: function (a, b) {
        var e = ["WEEKLY", "MONTHLY", "YEARLY"], d = g.customizeArray([]);
        h.get("/recurringInvoice/billed/lastDays").then(function (f) {
          g.customizeArray(f.data, d);
          k.subscribe("/recurringChart", a, function (a) {
            console.log(a);
            if ("RECURRING_CHART" === a.action) {
              for (var b = new Date(a.data.date), c = 0; c < d.length; c++) {
                var f = d[c], v = new Date(f[f.length - 1].date);
                v.getFullYear() === b.getFullYear() && v.getMonth() ===
                b.getMonth() && v.getDate() + 1 === b.getDate() && (f.push(g.customizeObj({
                  date: g.formatDate(b),
                  sum: 0
                })), f.splice(0, 1))
              }
              b = e.indexOf(a.data.type);
              b = d[b];
              g.defineReadOnlyProperty(b[b.length - 1], "sum", a.data.sum)
            }
          });
          b && b(f.data)
        }, function (a) {
          b && b(a.data)
        });
        return d
      }, getRecurringCompanies: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var e = [];
        h({url: "/recurringInvoice/total", method: "GET"}).then(function (d) {
          g.customizeArray(d.data, e);
          k.subscribe("/recurringTotal", a, function (a) {
            console.log(a);
            if ("CLIENT_RECURRING_TOTAL" === a.action) {
              var b = g.indexOfId(e, a.data.id);
              if (0 === a.data.total)-1 < b && e.splice(b, 1); else if (-1 < b)g.customizeObj(a.data, e[b]); else {
                for (var b = !0, d = 0; d < e.length; d++)e[d].company.id === a.data.company.id && (e[d].id = a.data.id, e[d].total = a.data.total, e[d].invoicesCount = a.data.invoicesCount, b = !1);
                b && e.push(g.customizeObj(a.data))
              }
            } else if ("COMPANY_ARCHIVED" == a.action)for (b = 0; b < e.length; b++)e[b].company.id === a.data.id && (e.splice(b, 1), b--)
          });
          b && b(d.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, getCompanyRecurringInvoices: function (a, b, d) {
        if (!a)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var f = [];
        h.get("/recurringInvoice?companyId=" + a).then(function (h) {
          g.customizeArray(h.data, f);
          k.subscribe("/recurring?targetId=" + a, b, function (a) {
            console.log(a);
            if ("RECURRING_SAVED" == a.action) {
              var b = g.findById(f, a.data.id);
              b ? g.customizeObj(a.data, b) : f.push(g.customizeObj(a.data))
            } else"RECURRING_DELETE" == a.action && (a = g.indexOfId(f, a.data.id), -1 < a && f.splice(a,
              1))
          });
          d && d(h.data)
        }, function (a) {
          d && d(a.data)
        });
        return f
      }, createRecurringInvoice: function (a, b, d) {
        if (!a)throw"recurringInvoice is required!";
        if (!b)throw"companyId is required!";
        a.company = {id: b};
        a = h({url: "/recurringInvoice", method: "POST", data: a});
        g.handleCallback(a, d)
      }, deleteRecurringInvoice: function (a, b) {
        if (!a)throw"recurringInvoiceId is required!";
        var d = h({url: "/recurringInvoice/" + a, method: "DELETE"});
        g.handleCallback(d, b)
      }, deleteAllRecurringInvoicesByCompany: function (a, b, d) {
        if (!a)throw"companyId is required!";
        var f = h({url: "/recurringInvoice/company/" + a, method: "DELETE"});
        g.handleCallback(f, function (f) {
          if (b)for (var n = 0; n < b.length; n++)b[n].company.id === a && (b.splice(n, 1), n--);
          d && d(f.data)
        })
      }, saveRecInvProductExpense: function (a, b, d) {
        f("productExpense", a, b, d)
      }, saveRecInvServiceExpense: function (a, b, d) {
        f("serviceExpense", a, b, d)
      }, deleteProductExpenseFromRecInv: function (a, d, e) {
        b(a, d, e)
      }, deleteServiceExpenseFromRecInv: function (a, d, e) {
        b(a, d, e)
      }, search: function (a) {
        if (!a)throw"Keyword is required!";
        return h.get("/recurringInvoice/search?keyword=" +
          a).then(function (a) {
          return a.data
        })
      }, addCompany: function (a, b) {
        if (!a)throw"recurring is required!";
        if (!b)throw"companyId is required!";
        for (var e = 0; e < a.length; e++)if (a[e].company.id === b)return;
        a.push({company: d.getOneById(b), total: 0, ticketsCount: 0})
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("RightPanelService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", "UsersService", "DevicesService", function (h, l, k, d, g, f, b) {
    function a() {
      e.groupedData.splice(0, e.groupedData.length);
      for (var a = g.getClientCompanies(), d = 0; d < a.length; d++) {
        var c = a[d];
        e.groupedData.push({company: c, users: f.getAllByCompanyId(c.id), devices: b.getAllByCompanyId(c.id)})
      }
    }

    function c(a, b) {
      if (!a || !a.$id)throw"First argument must be Angularjs scope!";
      var c =
        e.activitiesLists[a.$id];
      if (!c)throw"There is no activities list for scope " + a.$id;
      if (c.loadingInProcess)console.log("Loading activities already in process"); else {
        var f = {keyword: c.keyword};
        0 < c.list.length && (f.lastId = c.list[c.list.length - 1].id);
        c.loadingInProcess = !0;
        h({method: "GET", url: "/activities", params: f}).then(function (a) {
          d.customizeArray(a.data, c.list);
          if (3 > e.recentActivities.length)for (var f = 0; f < c.list.length && 3 > f; f++)e.recentActivities.push(c.list[f]);
          c.loadingInProcess = !1;
          b && b(a.data)
        }, function (a) {
          c.loadingInProcess = !1;
          b && b(a.data)
        })
      }
    }

    l = l.$new();
    var e = {recentActivities: [], activitiesLists: {}, groupedData: []};
    d.customizeObj(e);
    k.subscribe("/activity", l, function (a) {
      if ("ACTIVITY_SAVED" == a.action) {
        a = d.customizeObj(a.data);
        e.recentActivities.unshift(a);
        e.recentActivities.splice(3, e.recentActivities.length);
        for (var b in e.activitiesLists)if ("staticCopy" !== b) {
          var f = e.activitiesLists[b];
          f.keyword && 0 > a.description.indexOf(f.keyword) || f.list.unshift(a)
        }
      } else if ("COMPANY_ARCHIVED" == a.action)for (b in e.recentActivities.splice(0,
        e.recentActivities.length), e.activitiesLists)if ("staticCopy" !== b) {
        for (var f = e.activitiesLists[b], g = 0; g < f.list.length; g++)f.list[g].company.id === a.data.id && (f.list.splice(g, 1), g--);
        f.list.length < t.layLoadingPageSize && c({$id: b})
      }
    });
    g._addAmountChangeListener(a);
    return {
      getActivities: function (a, b, d) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var f = [];
        e.activitiesLists[a.$id] = {keyword: b, list: f};
        c(a, d);
        a.$on("$destroy", function () {
          delete e.activitiesLists[a.$id]
        });
        return f
      }, loadMoreActivities: c,
      getRecentActivities: function () {
        3 > e.recentActivities.length && h({method: "GET", url: "/activities"}).then(function (a) {
          d.customizeArray(a.data, e.recentActivities);
          e.recentActivities.splice(3, e.recentActivities.length)
        });
        return e.recentActivities
      }, getClientCompaniesGroupedData: function () {
        0 == e.groupedData.length && a();
        return e.groupedData
      }, getOneCompanyGroupedData: function (a) {
        return {company: g.getOneById(a), users: f.getAllByCompanyId(a), devices: b.getAllByCompanyId(a)}
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
(function (t, r, q) {
  angular.module("main.services").factory("ServicesService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, l, k, d, g) {
    function f(b, a) {
      var c = a.company.id;
      c === g.getCurrentCompany().id && (c = "default");
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
            b = e;
            var c = a.versionedId.id, g;
            for (g in b)if ("staticCopy" != g) {
              var h = d.findById(b[g], c);
              if (h) {
                b = h;
                break a
              }
            }
            b = void 0
          }
          b ? d.customizeObj(a, b) : f(e, a)
        }

        if (!b || !b.$id)throw"First argument must be Angularjs scope!";
        var e = d.customizeObj({});
        h.get("/services").then(function (b) {
          for (var d = 0; d < b.data.length; d++)f(e, b.data[d]);
          a && a(b.data)
        }, function (b) {
          a && a(b.data)
        });
        k.subscribe("/service", b, function (a) {
          console.log(a);
          if ("SERVICE_SAVED" == a.action)c(a.data); else if ("SERVICE_LIST_SAVED" == a.action)for (var b = 0; b < a.data.length; b++)c(a.data[b]); else if ("SERVICES_MOVED" == a.action)for (b = 0; b < a.data.length; b++)f(e, a.data[b]); else if ("COMPANY_SERVICES_DELETED" == a.action)delete e[a.data.id]; else if ("SERVICES_DELETED" == a.action)for (b = 0; b < a.data.length; b++) {
            var g =
              a.data[b].versionedId.id, h = e, k = void 0;
            for (k in h) {
              var p = d.indexOfId(h[k], g);
              -1 < p && h[k].splice(p, 1)
            }
          } else"COMPANY_ARCHIVED" == a.action && delete e[a.data.id]
        });
        return e
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
          for (var e = [], f = b[d], g = 0; g < f.length; g++)e.push(f[g].originService.versionedId.id);
          a[d] = e
        }
        return a
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("StatisticsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, l, k, d, g) {
    return {
      getResolvedTicketsCountByCompany: function (f, b, a) {
        if (!f)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/tickets/resolvedCount/" + f).then(function (e) {
          d.customizeObj(e.data, c);
          k.subscribe("/resolvedTicketsCount?targetId=" + f, b, function (a) {
            console.log(a);
            "RESOLVED_TICKETS_COUNT" === a.action && d.defineReadOnlyProperty(c, "value", a.data)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getTicketsResolutionTimeChartDataByCompany: function (f, b, a) {
        if (!f)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/tickets/resolutionTime/" + f).then(function (e) {
          d.customizeObj(e.data, c);
          k.subscribe("/ticketsResolutionTimeChart?targetId=" + f, b, function (a) {
            console.log(a);
            "TICKETS_RESOLUTION_TIME_CHART" ===
            a.action && d.customizeObj(a.data, c)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getTimeBilledByCompany: function (f, b, a) {
        if (!f)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/billed/time/" + f).then(function (e) {
          d.customizeObj(e.data, c);
          k.subscribe("/billedTimeStatistic?targetId=" + f, b, function (a) {
            console.log(a);
            "BILLED_TIME_STATISTIC" === a.action && d.defineReadOnlyProperty(c, "value", a.data)
          });
          a && a(e.data)
        }, function (b) {
          a &&
          a(b.data)
        });
        return c
      }, getReceivableAmountByCompany: function (f, b, a) {
        if (!f)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/companies/receivable/" + f).then(function (e) {
          d.customizeObj(e.data, c);
          k.subscribe("/todayReceivableChartPoint?targetId=" + f, b, function (a) {
            console.log(a);
            "TODAY_RECEIVABLE_CHART_POINT" === a.action && d.defineReadOnlyProperty(c, "value", a.data.receivableLeft)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }, getContributedToEarningTopCompanies: function (f, b, a) {
        if (!f)throw"topAmount is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/companies/paymentSum/top/" + f).then(function (e) {
          function f(a) {
            k.subscribe("/companyPaymentReceived?targetId=" + a, b, function (b) {
              console.log(b);
              "COMPANY_PAYMENT_RECEIVED" === b.action && d.defineReadOnlyProperty(c, a, (c[a] ? c[a] : 0) + b.data)
            })
          }

          for (var g in e.data)f(g);
          d.customizeObj(e.data, c);
          a && a(e.data)
        }, function (b) {
          a &&
          a(b.data)
        });
        return c
      }, getTopCompaniesByResolvedTickets: function (f, b, a) {
        if (!f)throw"topAmount is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = d.customizeObj({});
        h.get("/statistic/companies/resolvedTicket/top/" + f).then(function (e) {
          function f(a) {
            k.subscribe("/resolvedTicketsCount?targetId=" + a, b, function (b) {
              console.log(b);
              "RESOLVED_TICKETS_COUNT" === b.action && d.defineReadOnlyProperty(c, a, b.data)
            })
          }

          for (var g in e.data)f(g);
          d.customizeObj(e.data, c);
          a && a(e.data)
        }, function (b) {
          a &&
          a(b.data)
        });
        return c
      }, getTotalEarningsByDays: function (f, b, a, c, e) {
        if (!f)throw"companyId is required!";
        if (!b)throw"from date is required!";
        if (!a)throw"to date is required!";
        if (b.getTime() > a.getTime())throw"from date should be less that to date!";
        if (!c || !c.$id)throw"Angularjs scope is required!";
        var g = d.customizeObj({});
        h.get("/statistic/companies/paymentSum/receivedInterval/" + f + "?from=" + d.formatDate(b) + "&to=" + d.formatDate(a)).then(function (a) {
          var b, h;
          for (h in a.data)b ? (new Date(h)).getTime() > (new Date(b)).getTime() &&
          (b = h) : b = h;
          var l = new Date(b);
          d.customizeObj(a.data, g);
          k.subscribe("/companyPaymentReceived?targetId=" + f, c, function (a) {
            console.log(a);
            if ("COMPANY_PAYMENT_RECEIVED" === a.action) {
              var c = new Date;
              l.getFullYear() === c.getFullYear() && l.getMonth() === c.getMonth() && l.getDate() === c.getDate() && d.defineReadOnlyProperty(g, b, g[b] + a.data)
            }
          });
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return g
      }, getTotalReceivableByDays: function (f, b, a, c, e) {
        if (!f)throw"companyId is required!";
        if (!b)throw"from date is required!";
        if (!a)throw"to date is required!";
        if (b.getTime() > a.getTime())throw"from date should be less that to date!";
        if (!c || !c.$id)throw"Angularjs scope is required!";
        var g = d.customizeObj({});
        h.get("/statistic/companies/receivable/totalInterval/" + f + "?from=" + d.formatDate(b) + "&to=" + d.formatDate(a)).then(function (a) {
          function b(a) {
            var d = new Date;
            if (a.getFullYear() === d.getFullYear() && a.getMonth() === d.getMonth() && a.getDate() === d.getDate())return !0
          }

          var h, l;
          for (l in a.data)h ? (new Date(l)).getTime() > (new Date(h)).getTime() && (h = l) : h = l;
          d.customizeObj(a.data,
            g);
          b(new Date(h)) && k.subscribe("/todayReceivableChartPoint?targetId=" + f, c, function (a) {
            console.log(a);
            "TODAY_RECEIVABLE_CHART_POINT" === a.action && b(new Date(a.data.date)) && d.defineReadOnlyProperty(g, h, a.data.total)
          });
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return g
      }, getTicketsClosedByDays: function (f, b, a, c, e) {
        if (!f)throw"companyId is required!";
        if (!b)throw"from date is required!";
        if (!a)throw"to date is required!";
        if (b.getTime() > a.getTime())throw"from date should be less that to date!";
        if (!c || !c.$id)throw"Angularjs scope is required!";
        var g = d.customizeObj({});
        h.get("/statistic/companies/resolvedTicket/interval/" + f + "?from=" + d.formatDate(b) + "&to=" + d.formatDate(a)).then(function (a) {
          function b(a) {
            var d, c;
            for (c in a)if ("staticCopy" != c) {
              d = c;
              break
            }
            if (d) {
              a = new Date(a[d]);
              for (var e in g)if ("staticCopy" !== e && (d = new Date(e), d.getFullYear() === a.getFullYear() && d.getMonth() === a.getMonth() && d.getDate() === a.getDate()))return e
            }
          }

          d.customizeObj(a.data, g);
          k.subscribe("/ticketResolution?targetId=" + f, c, function (a) {
            console.log(a);
            "TICKET_RESOLVED" ===
            a.action ? (a = b(a.data)) && d.defineReadOnlyProperty(g, a, g[a] + 1) : "TICKET_REOPENED" === a.action && (a = b(a.data)) && d.defineReadOnlyProperty(g, a, g[a] - 1)
          });
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return g
      }, getUserSubmittedTicketsByCompany: function (f, b, a) {
        if (!f)throw"companyId is required!";
        if (!b || !b.$id)throw"Angularjs scope is required!";
        var c = d.customizeObj({});
        h.get("/statistic/tickets/submittedTickets/" + f).then(function (e) {
          d.customizeObj(e.data, c);
          k.subscribe("/userSubmittedTicket?targetId=" + f, b, function (a) {
            console.log(a);
            "USER_SUBMITTED_TICKET" === a.action && d.defineReadOnlyProperty(c, a.data, (c[a.data] || 0) + 1)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("SubscriptionsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, l, k, d, g) {
    function f(b, a, c, e, f) {
      var g = d.customizeObj({});
      h(b).then(function (b) {
        for (var h = 0; h < b.data.length; h++) {
          var l = b.data[h];
          d.defineReadOnlyProperty(g, l.user.id, d.customizeObj(l))
        }
        k.subscribe("/subscription?targetId=" + a, c, function (a) {
          console.log(a);
          "SUBSCRIPTION_SAVED" == a.action ? (!f || -1 < f.indexOf(a.data.user.id)) && d.defineReadOnlyProperty(g,
            a.data.user.id, d.customizeObj(a.data)) : "SUBSCRIPTION_DELETED" == a.action && delete g[a.data.user.id]
        });
        e && e(b.data)
      }, function (a) {
        e && e(a.data)
      });
      return g
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
        return f({url: "/subscription/company/users/" + b, method: "GET"}, b, a, d)
      }, getAllClientUserSubscriptions: function (b, a) {
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        return f({url: "/subscription/clientUsers", method: "GET"}, g.getCurrentCompany().id, b, a)
      }, getUserSubscriptionsByUserIds: function (b, a, d) {
        if (!b || 0 == b.length)throw"userIds is required argument!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        return f({url: "/subscription/users/", method: "POST", data: b}, g.getCurrentCompany().id, a, d, b)
      }
    }
  }])
})(window, jQuery);
(function (t, r, q) {
  angular.module("main.services").factory("TaxRatesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    return {
      getAllByCompany: function (g, f, b) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        if (!g || "[object Function]" === Object.prototype.toString.call(g))throw"companyId is required argument!";
        return d.getListByUrl("/taxRate/" + g, b, function (a) {
          k.subscribe("/taxRate?targetId=" + g, f, function (b) {
            console.log(b);
            if ("TAX_RATE_SAVE" == b.action) {
              var e =
                d.findById(a, b.data.versionedId.id);
              e ? d.customizeObj(b.data, e) : a.push(d.customizeObj(b.data))
            } else"TAX_RATE_DELETE" == b.action && (d.deleteById(a, b.data.versionedId.id), f.$broadcast("tax_rate_delete", b.data))
          })
        })
      }, save: function (g, f) {
        if (!g)throw"taxRate is required!";
        var b = "/taxRate", a = "POST";
        g.id && (a = "PUT", b = b + "/" + g.id);
        b = h({url: b, method: a, data: g});
        d.handleCallback(b, f)
      }, deleteTaxRate: function (g, f) {
        if (!g)throw"taxRateId is required argument!";
        var b = h({url: "/taxRate/" + g, method: "DELETE"});
        d.handleCallback(b,
          f)
      }, isUniqueInCompany: function (g, f, b, a) {
        if (!g)throw"taxRateCode is required!";
        if (!b)throw"companyId is required!";
        var c = d.customizeObj({});
        h.get("/taxRate/isUniqueInCompany?taxRateCode=" + g + "&id=" + f + "&companyId=" + b).then(function (b) {
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
(function (t, r, q) {
  angular.module("main.services").factory("TicketsService", ["$http", "$rootScope", "RealTimeService", "Utils", "TicketTagsService", "CompaniesService", function (h, l, k, d, g, f) {
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
          for (var f = 0; f < e.data.length; f++) {
            var h = e.data[f];
            h.number = "Tkt# " + h.number;
            h.tags && g._makeDynamic(h.tags, a)
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

    function e(a, b, c, e) {
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

    function v(a, b, d) {
      if ("USER" === d.filter) {
        if ("COMPLETED" === a.status && "COMPLETED" !== b.status)return 1;
        if ("COMPLETED" === b.status && "COMPLETED" !== a.status)return -1
      }
      return q[d.filter](b) -
        q[d.filter](a)
    }

    function m(a) {
      return a.assignedAt || a.createdAt
    }

    function w(a, b) {
      return "URGENT" == b.filter && ("HIGH" != a.priorityLevel || "COMPLETED" == a.status || "ADMIN" !== l.currentUser.role && !a.sharedToCurrentUserAt) || "UNASSIGNED" == b.filter && a.assignedUser && a.assignedUser.id || "USER" == b.filter && (!a.assignedUser || a.assignedUser.id != l.currentUser.id) || "OPEN" == b.filter && "COMPLETED" == a.status || "CLOSED" == b.filter && ("COMPLETED" != a.status || "ADMIN" !== l.currentUser.role && (!a.assignedUser || a.assignedUser.id != l.currentUser.id)) ||
      "SHARED" == b.filter && !a.sharedToCurrentUserAt || "SPAM" == b.filter && (!a.spamPerformer || !a.spamPerformer.id || "ADMIN" !== l.currentUser.role && a.spamPerformer.id != l.currentUser.id) || "TRASH" == b.filter && !a.trash || "SPAM" !== b.filter && "TRASH" !== b.filter && (a.spamPerformer && a.spamPerformer.id || a.trash) || b.companyId && b.companyId != a.company.id || b.status && b.status != a.status || b.priority && b.priority != a.priorityLevel ? !1 : !0
    }

    var r = "ASSIGNED_USER PRIORITY_CHANGED STATUS TRASH SPAM TICKET_INVOICED TICKET_SHARE".split(" "),
      p = 0, u = {lists: {}, tickets: {}, counts: {}}, x = l.$new();
    k.subscribe("/tickets", x, function (a) {
      console.log(a);
      a.data && a.data.number && (a.data.number = "Tkt# " + a.data.number);
      if ("CREATED_TICKET" === a.action) {
        var b = d.customizeObj(a.data, {}), e;
        for (e in u.lists) {
          var f = u.lists[e];
          w(a.data, f.params) && f.list.unshift(b)
        }
      } else if (-1 < r.indexOf(a.action)) {
        b = d.customizeObj(a.data, {});
        for (e in u.lists) {
          var f = u.lists[e], h = !1, m = d.indexOfId(f.list, b.id);
          if (-1 < m)w(a.data, f.params) ? (d.customizeObj(b, f.list[m]), h = !0) : f.list.splice(m,
            1); else if (w(a.data, f.params))if (0 === f.list.length)f.list.push(b); else if (m = f.list[f.list.length - 1], 15 > f.list.length || 0 >= v(b, m, f.params))f.list.push(b), h = !0;
          h && f.list.sort(function (a, b) {
            return v(a, b, f.params)
          })
        }
        for (e in u.tickets)h = u.tickets[e].ticket, h.id === b.id && d.customizeObj(b, h)
      } else if ("READ" === a.action)n(a.data.id, function (a) {
        d.defineReadOnlyProperty(a, "unread", !1)
      }); else if ("TICKET_COLLAPSED" === a.action || "TICKET_DELETED" === a.action) {
        for (e in u.lists)d.deleteById(u.lists[e].list, a.data.id);
        for (e in u.tickets)b = u.tickets[e], b.ticket.id === a.data.id && (delete u.tickets[e], b.scope.$broadcast("ticket_is_not_available_anymore"))
      } else if ("TAG_LINKED" === a.action)for (b in a.data)n(b, function (b) {
        g._merge(b.tags, a.data[b.id])
      }); else if ("COMPANY_ARCHIVED" === a.action) {
        for (e in u.lists) {
          h = u.lists[e].list;
          for (m = 0; m < h.length; m++)b = h[m], b.company.id === a.data.id && (h.splice(m, 1), m--);
          h.length < t.layLoadingPageSize && c(u.lists[e].scope)
        }
        for (e in u.tickets)h = u.tickets[e].ticket, h.company.id === a.data.id && delete u.tickets[e]
      } else"TICKET_BILLABLE" ===
      a.action && n(a.data.id, function (b) {
        d.defineReadOnlyProperty(b, "isBillable", a.data.isBillable)
      })
    });
    var q = {
      URGENT: m, UNASSIGNED: function (a) {
        return a.createdAt
      }, USER: function (a) {
        return a.closedAt || a.assignedAt
      }, OPEN: function (a) {
        return a.assignedAt
      }, CLOSED: function (a) {
        return a.closedAt
      }, SHARED: function (a) {
        return a.sharedToCurrentUserAt
      }, ALL: m, NOT_SPAM_OR_TRASH: m, SPAM: function (a) {
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
        }, e = f._search(a.keyword, !1), g = 0; g < e.length; g++)c.companies.push(e[g].staticCopy());
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
        var c = p++, e = d.customizeObj({});
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
      }, getOne: function (b, c, e, f) {
        if (!b)throw"Id is mandatory argument!";
        if (!c || !c.$id)throw"Second argument must be Angularjs scope!";
        var m = p++, n = {id: b}, l = "/v2/tickets/" + b;
        e && (l += "?view=extended");
        u.tickets[m] = {ticket: n, scope: c};
        c.$on("$destroy", function () {
          delete u.tickets[m]
        });
        h.get(l).then(function (b) {
          b.data.number = "Tkt# " + b.data.number;
          d.customizeObj(b.data, n);
          n.tags && g._makeDynamic(n.tags, c);
          e && n.updates.sort(a);
          f && f(b.data)
        }, function (a) {
          f && f(a.data)
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
        e("priority", a, b.toUpperCase(), d)
      }, assignTo: function (a, b, d) {
        if (!a || !b)throw"ticketId and userId is required arguments!";
        e("assign", a, b, d)
      }, changeStatus: function (a, b, d) {
        if (!a || !b)throw"ticketId and status is required arguments!";
        e("status", a, b.toUpperCase(), d)
      }, changeSpamFlag: function (a, b, d) {
        if (!a)throw"ticketId is required arguments!";
        e("spam", a, !!b, d)
      }, changeTrashFlag: function (a, b, d) {
        if (!a)throw"ticketId is required arguments!";
        e("trash", a, !!b, d)
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
(function (t, r, q) {
  angular.module("main.services").factory("TicketTagsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    function g(a, b) {
      return b.createdAt - a.createdAt
    }

    function f(a) {
      c = l.$new();
      e.tags = d.customizeArray([]);
      h.get("/tag").then(function (b) {
        d.customizeArray(b.data, e.tags);
        e.tags && (e.tags.sort(g), k.subscribe("/tags", c, function (a) {
          console.log(a);
          if (e.tags)if ("TAG_SAVED" == a.action) {
            var b = d.findById(e.tags, a.data.id);
            b ? d.customizeObj(a.data, b) : (e.tags.unshift(d.customizeObj(a.data)),
              e.tags.sort(g))
          } else if ("TAG_REMOVED" == a.action)for (b in d.deleteById(e.tags, a.data.id), e.dynamicLists)for (var c = e.dynamicLists[b], f = 0; f < c.length; f++)d.deleteById(c[f], a.data.id)
        }), a && a(b.data))
      }, function (b) {
        console.log("ERROR!!!!!", b);
        a && a(b.data)
      })
    }

    function b() {
      0 === e.watchers.length && r.isEmptyObject(e.dynamicLists) && (c.$destroy(), e.tags = q)
    }

    function a(b, c) {
      if (!c || !c.$id)throw"First argument must be Angularjs scope!";
      if (e.tags) {
        for (var g = 0; g < b.length; g++)b[g] = d.findById(e.tags, b[g].id);
        for (; -1 < (g =
          b.indexOf(q));)b.splice(g, 1);
        e.addDynamicList(b, c)
      } else f(function () {
        a(b, c)
      })
    }

    var c, e = {
      tags: q, watchers: [], dynamicLists: {}, addWatcher: function (a) {
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
          var f =
            d.findById(e.tags, b[c]);
          f && a.push(f)
        }
      }, getList: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        e.tags ? b && setTimeout(function () {
          b(e.tags.staticCopy())
        }, 100) : f(b);
        e.addWatcher(a);
        return e.tags
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
(function (t, r, q) {
  angular.module("main.services").factory("UsersService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (h, l, k, d, g) {
    function f() {
      g._isInitialized() || setTimeout(f, 300);
      t || (t = !0, h.get("/users").then(function (b) {
        d.customizeArray(b.data, p.users);
        for (b = 0; b < p.users.length; b++) {
          var c = p.users[b];
          a(c);
          p.usersByCompanies[c.company.id] || (p.usersByCompanies[c.company.id] = []);
          p.usersByCompanies[c.company.id].push(c);
          c.company.id !== g.getCurrentCompany().id && p.clientUsers.push(c)
        }
        q = !0;
        for (b = 0; b < m.length; b++)m[b]();
        m = []
      }, function (a) {
        console.error(a);
        throw"Cannot initialize CompaniesService!";
      }), k.subscribe("/user", r, function (a) {
        console.log(a);
        if (q)if ("USER_SAVED" == a.action)b(a.data); else if ("USER_DELETED" == a.action) {
          var c = d.findById(p.users, a.data.id);
          d.deleteById(p.users, a.data.id);
          d.deleteById(p.clientUsers, a.data.id);
          c && d.deleteById(p.usersByCompanies[c.company.id], a.data.id)
        } else if ("USER_ONLINE" == a.action)(c = d.findById(p.users, a.data.id)) && d.defineReadOnlyProperty(c, "online",
          !!a.data.online); else if ("COMPANY_ARCHIVED" == a.action) {
          for (c = 0; c < p.users.length; c++)p.users[c].company.id === a.data.id && (p.users.splice(c, 1), c--);
          for (c = 0; c < p.clientUsers.length; c++)p.clientUsers[c].company.id === a.data.id && (p.clientUsers.splice(c, 1), c--);
          delete p.usersByCompanies[a.data.id]
        } else"USERS_DEARCHIVED" == a.action && a.data.forEach(b)
      }))
    }

    function b(b) {
      var c = d.findById(p.users, b.id);
      c ? d.customizeObj(b, c) : (b = d.customizeObj(b), p.users.push(b), b.company.id !== g.getCurrentCompany().id && p.clientUsers.push(b),
        a(b), p.usersByCompanies[b.company.id] || (p.usersByCompanies[b.company.id] = []), p.usersByCompanies[b.company.id].push(b))
    }

    function a(a) {
      var b = [a.firstName, a.lastName].map(function (a) {
        return a.charAt(0).toUpperCase()
      }).join("");
      d.defineReadOnlyProperty(a, "initials", b)
    }

    function c() {
      return e(l.currentUser.id)
    }

    function e(a) {
      return d.findById(p.users, a)
    }

    function n(a, b, d) {
      if (!a)throw"Keyword is required!";
      var e = [];
      d = d ? p.usersByCompanies[d] || [] : p.users;
      for (var f = 0; f < d.length; f++) {
        var g = d[f];
        (b || c().company.id !==
        g.company.id) && -1 < (g.firstName + " " + g.lastName).toLowerCase().indexOf(a.toLowerCase()) && e.push(g)
      }
      return e
    }

    var r = l.$new(), m = [], q = !1, t = !1, p = {users: [], clientUsers: [], usersByCompanies: {}};
    d.customizeObj(p);
    f();
    return {
      _addInitListener: function (a) {
        if (!a)throw"callback is required!";
        q ? a() : m.push(a)
      }, getCurrentUser: c, getAllUsers: function () {
        return p.users
      }, getClientUsers: function () {
        return p.clientUsers
      }, getAllByCompanyId: function (a) {
        return p.usersByCompanies[a] || []
      }, getOneById: e, searchByAllUsers: function (a) {
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
(function (t, r, q) {
  angular.module("main.services").factory("VendorsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (h, l, k, d) {
    return {
      save: function (g, f) {
        if (!g)throw"vendor is required!";
        var b = "POST";
        g.id && (b = "PUT");
        b = h({url: "/vendor", method: b, data: g});
        d.handleCallback(b, f)
      }, getAll: function (g, f) {
        if (!g || !g.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/vendor", f, function (b) {
          k.subscribe("/vendor", g, function (a) {
            console.log(a);
            if ("VENDOR_SAVE" == a.action) {
              var c =
                d.findById(b, a.data.id);
              c ? d.customizeObj(a.data, c) : b.push(d.customizeObj(a.data))
            } else"VENDOR_ARCHIVED" == a.action ? (d.deleteById(b, a.data.id), g.$broadcast("vendor_archived", a.data)) : "VENDOR_DEARCHIVED" == a.action && (b.push(d.customizeObj(a.data)), g.$broadcast("vendor_dearchived", a.data))
          })
        })
      }, getAllInCompanyForAutocomplete: function (g, f) {
        if (!g)throw"companyId is required!";
        var b = d.customizeArray([]);
        h.get("/vendor/getAll/" + g).then(function (a) {
          d.customizeArray(a.data, b);
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return b
      }, isWebsiteUnique: function (g, f, b) {
        if (!g)throw"website is required!";
        var a = d.customizeObj({});
        h.get("/vendor/isWebsiteUnique?website=" + g + "&id=" + f).then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }, isNameUnique: function (g, f, b) {
        if (!g)throw"name is required!";
        var a = d.customizeObj({});
        h.get("/vendor/isNameUnique?name=" + g + "&id=" + f).then(function (c) {
          d.customizeObj(c.data, a);
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return a
      }, archive: function (g, f) {
        if (!g)throw"id is required!";
        var b = h.get("/vendor/archive/" + g);
        d.handleCallback(b, f)
      }, dearchive: function (g, f) {
        if (!g)throw"id is required!";
        var b = h.get("/vendor/dearchive/" + g);
        d.handleCallback(b, f)
      }
    }
  }])
})(window, jQuery);
