(function (v, r, t) {
  v.layLoadingPageSize = 15;
  r = angular.module("main.services", []);
  r.config(["$provide", "$httpProvider", function (g, m) {
    g.factory("myHttpInterceptor", [function () {
      function g(d) {
        if ("unauthorized" === d.data.errorMessage || "unauthorized" === d.data.authMessage)v.location.pathname = "/login"; else if (d.data.showMessage)return alert(d.data.showMessage), {};
        return d
      }

      return {
        request: function (d) {
          d.url && (d.params || (d.params = {}), d.url.endsWith(".html") || (d.params.t = (new Date).getTime()));
          return d
        }, response: g,
        responseError: g
      }
    }]);
    m.interceptors.push("myHttpInterceptor")
  }]);
  r.run(["$http", "$rootScope", function (g, m) {
    g.get("/users/current").success(function (g) {
      m.currentUser = g
    });
    m.numberCounterDelimiter = "-"
  }]);
  r.service("Downloader", function () {
    function g(f) {
      if (/(iP)/g.test(navigator.userAgent))return alert("Your device does not support files downloading. Please try again in desktop browser."), !1;
      if (m || l || d) {
        var c = document.createElement("a");
        c.href = f;
        if (c.download !== t) {
          var a = f.substring(f.lastIndexOf("/") + 1,
            f.length);
          c.download = a
        }
        if (document.createEvent)return f = document.createEvent("MouseEvents"), f.initEvent("click", !0, !0), c.dispatchEvent(f), !0
      }
      v.open(f, "_self");
      return !0
    }

    var m = -1 < navigator.userAgent.toLowerCase().indexOf("chrome"), l = -1 < navigator.userAgent.toLowerCase().indexOf("safari"), d = -1 < navigator.userAgent.toLowerCase().indexOf("firefox");
    return {
      downloadByUrl: g, downloadTicketAttachments: function (d) {
        g("/v2/tickets/" + d + "/downloadAttachments")
      }, downloadFile: function (d) {
        g("/file/" + d)
      }
    }
  });
  r.service("Utils",
    ["$http", "$rootScope", function (g, m) {
      function l(b) {
        var e = b;
        !e && this.staticCopy && (e = this);
        if ("[object Array]" === Object.prototype.toString.call(e)) {
          b = [];
          for (var a = 0; a < e.length; a++)b.push(l(e[a]))
        } else if ("[object Object]" === Object.prototype.toString.call(e))for (a in b = {}, e)"staticCopy" !== a && "$$hashKey" != a && (b[a] = l(e[a])); else return e;
        return b
      }

      function d(b, e) {
        if ("[object String]" === Object.prototype.toString.call(b))return b;
        e = e || b;
        for (var a in b) {
          var h = b[a];
          "[object Array]" === Object.prototype.toString.call(h) ?
            f(h) : "[object Object]" === Object.prototype.toString.call(h) && d(h);
          c(e, a, h)
        }
        c(e, "staticCopy", l);
        return e
      }

      function f(b, e) {
        if (e) {
          for (var a = 0; a < b.length; a++)e.push(d(b[a]));
          c(e, "staticCopy", l);
          return e
        }
        for (a = 0; a < b.length; a++)b[a] = d(b[a]);
        c(b, "staticCopy", l);
        return b
      }

      function c(b, e, a) {
        Object.defineProperty(b, e, {value: a, writable: !1, enumerable: !0, configurable: !0})
      }

      function a(b, e) {
        for (var a = 0; a < b.length; a++) {
          var d = b[a];
          if (d && (d = d.versionedId ? d.versionedId.id : d.id, d === e))return a
        }
        return -1
      }

      return {
        customizeObj: d,
        customizeArray: f, defineReadOnlyProperty: c, findById: function (b, e) {
          for (var a = 0; a < b.length; a++) {
            var d = b[a];
            if ((d.versionedId ? d.versionedId.id : d.id) === e)return d
          }
        }, indexOfId: a, handleCallback: function (b, a) {
          a && b.then(function (b) {
            a(b.data)
          }, function (b) {
            a(b.data)
          })
        }, deleteById: function (b, e) {
          var d = a(b, e);
          -1 < d && b.splice(d, 1)
        }, getListByUrl: function (b, a, d) {
          var h = [];
          d && (h = f(h));
          g.get(b).then(function (b) {
            if (d)f(b.data, h), d(h); else for (var p = 0; p < b.data.length; p++)h.push(b.data[p]);
            a && a(h)
          }, function (b) {
            a && a(b.data)
          });
          return h
        }, getFormattedNumber: function (b, a) {
          var d;
          if (a)for (d = "" + (parseInt(b.numPart) + 1); d.length < b.numPart.length;)d = "0" + d; else d = b.numPart;
          return b.charPart ? b.charPart + m.numberCounterDelimiter + d : d
        }, getComparatorBy: function (b, a) {
          return function (d, h) {
            return a ? h[b] - d[b] : d[b] - h[b]
          }
        }, formatDate: function (b) {
          return b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate()
        }
      }
    }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("AddressesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    return {
      getAllLocales: function (f) {
        var c = d.customizeArray([]);
        g.get("/addresses/getAllLocales").then(function (a) {
          d.customizeArray(a.data, c);
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("AssociationService", ["$http", "$rootScope", "Utils", "$filter", function (g, m, l) {
    return {
      deleteAssociation: function (d, f) {
        if (!d)throw"id is required!";
        var c = g({url: "/association/" + d, method: "DELETE"});
        l.handleCallback(c, f)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("BillableService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d, f) {
    return {
      getTotalBilledAmount: function (c, a) {
        var b = d.customizeObj({});
        g.get("/billable/totalBilled").then(function (e) {
          d.customizeObj(e.data, b);
          l.subscribe("/billedTicketsSumAdded", c, function (a) {
            console.log(a);
            "BILLED_TICKETS_SUM_ADDED" === a.action && d.defineReadOnlyProperty(b, "value", b.value + a.data)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, getBillableChartData: function (c, a) {
        var b = d.customizeArray([]);
        g.get("/billable/billed/lastDays").then(function (e) {
          d.customizeArray(e.data, b);
          l.subscribe("/billedTicketsSumAdded", c, function (a) {
            console.log(a);
            if ("BILLED_TICKETS_SUM_ADDED" === a.action) {
              var e = b[b.length - 1];
              d.defineReadOnlyProperty(e, "sum", e.sum + a.data)
            }
          });
          a && a(b)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, getBillableCompanies: function (c, a) {
        if (!c || !c.$id)throw"First argument must be Angularjs scope!";
        var b = d.customizeArray([]);
        g({
          url: "/billable/total",
          method: "GET"
        }).then(function (e) {
          d.customizeArray(e.data, b);
          l.subscribe("/billableTotal", c, function (a) {
            console.log(a);
            if ("CLIENT_BILLABLE_TOTAL" == a.action)if (0 < a.data.ticketsCount) {
              var e = d.findById(b, a.data.id);
              e || (e = {}, b.push(e));
              d.customizeObj(a.data, e)
            } else a = d.indexOfId(b, a.data.id), -1 < a && (d.defineReadOnlyProperty(b[a], "total", 0), d.defineReadOnlyProperty(b[a], "ticketsCount", 0), b.splice(a, 1)); else if ("COMPANY_ARCHIVED" == a.action)for (e = 0; e < b.length; e++)b[e].company.id === a.data.id && (b.splice(e, 1),
              e--)
          });
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, getCompanyBillableTickets: function (c, a, b) {
        if (!c)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = [];
        g.get("/billable/expenses/" + c).then(function (k) {
          d.customizeArray(k.data, e);
          l.subscribe("/billableExpense?targetId=" + c, a, function (b) {
            console.log(b);
            if ("BILLABLE_EXPENSE_ADDED" == b.action) {
              var a = d.findById(e, b.data.id);
              a || (a = {}, e.push(a));
              d.customizeObj(b.data, a)
            } else"BILLABLE_EXPENSE_REMOVED" == b.action &&
            (b = d.indexOfId(e, b.data), -1 < b && e.splice(b, 1))
          });
          b && b(k.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, createInvoice: function (c, a) {
        if (!c)throw"lockId is required!";
        var b = g.get("/invoice/create/" + c);
        d.handleCallback(b, a)
      }, getActualInvoiceNumber: function (c, a) {
        g.get("/data/actualNumber?type=INVOICE").success(function (b) {
          a(b.number)
        });
        l.subscribe("/number?targetId=INVOICE", c, function (b) {
          console.log(b);
          "NUMBER_CHANGED" === b.action && a(d.getFormattedNumber(b.data, !0))
        })
      }, search: function (d) {
        if (!d)throw"Keyword is required!";
        return g.get("/billable/search?keyword=" + d).then(function (a) {
          return a.data
        })
      }, getLockedTicketIds: function (c, a) {
        if (!c || !c.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/invoice/lock", a, function (b) {
          l.subscribe("/ticketResolution?targetId=" + f.getCurrentCompany().id, c, function (a) {
            console.log(a);
            if ("TICKET_LOCKED" == a.action)for (var d = 0; d < a.data.length; d++)b.push(a.data[d]); else if ("TICKET_UNLOCKED" == a.action)for (d = 0; d < b.length; d++)for (var h = 0; h < a.data.length; h++)b[d] == a.data[h] &&
            b.splice(d, 1)
          })
        })
      }, lockTicketIds: function (c, a) {
        if (!c)throw"ticketIds is required!";
        var b = d.customizeObj({});
        g({url: "/invoice/lock", method: "POST", data: c}).then(function (e) {
          d.customizeObj(e.data, b);
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, unlockTicketIds: function (c, a) {
        if (!c)throw"lockId is required!";
        var b = g.get("/invoice/unlock/" + c);
        d.handleCallback(b, a)
      }, getExistTimeByLockId: function (c, a) {
        if (!c)throw"lockId is required!";
        var b = g.get("/invoice/lock/timeToUnlock/" + c);
        d.handleCallback(b, a)
      },
      lockTicketsByCompany: function (c, a) {
        if (!c)throw"companyId is required!";
        var b = g.get("/invoice/lock/lockByCompany/" + c);
        d.handleCallback(b, a)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("CompaniesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    function f() {
      q++;
      if (2 === q) {
        b = !0;
        for (var a = 0; a < e.length; a++)e[a]()
      }
    }

    function c(b, a) {
      if (!b)throw"Keyword is required!";
      for (var d = [], e = 0; e < h.companies.length; e++) {
        var c = h.companies[e];
        (a || h.currentCompany.id !== c.id) && -1 < c.name.indexOf(b) && d.push(c)
      }
      return d
    }

    function a(a) {
      a && (b ? a() : e.push(a))
    }

    m = m.$new();
    var b = !1, e = [], k = [], h = {
      companies: [], clientCompanies: [],
      currentCompany: {}
    };
    d.customizeObj(h);
    g.get("/company/clients").then(function (b) {
      d.customizeArray(b.data, h.clientCompanies);
      for (b = 0; b < h.clientCompanies.length; b++)h.companies.push(h.clientCompanies[b]);
      f()
    }, function (b) {
      console.error(b);
      throw"Cannot initialize CompaniesService!";
    });
    g.get("/company/current").then(function (b) {
      d.customizeObj(b.data, h.currentCompany);
      h.companies.push(h.currentCompany);
      f()
    }, function (b) {
      console.error(b);
      throw"Cannot initialize CompaniesService!";
    });
    var q = 0;
    l.subscribe("/company",
      m, function (a) {
        console.log(a);
        if (b)if ("COMPANY_SAVED" == a.action) {
          var e = d.findById(h.companies, a.data.id);
          if (e)d.customizeObj(a.data, e); else for (a = d.customizeObj(a.data), h.companies.push(a), h.clientCompanies.push(a), a = 0; a < k.length; a++)k[a]()
        } else if ("COMPANY_ARCHIVED" == a.action)for (d.deleteById(h.companies, a.data.id), d.deleteById(h.clientCompanies, a.data.id), a = 0; a < k.length; a++)k[a](); else if ("COMPANY_DEARCHIVED" == a.action)for (e = d.customizeObj(a.data), h.clientCompanies.push(e), h.companies.push(e), a =
          0; a < k.length; a++)k[a]()
      });
    return {
      _addInitListener: a, _addAmountChangeListener: function (a) {
        k.push(a)
      }, _search: c, _isInitialized: function () {
        return b
      }, getCurrentCompany: function () {
        return h.currentCompany
      }, getClientCompanies: function (b) {
        a(b);
        return h.clientCompanies
      }, getAllCompanies: function () {
        return h.companies
      }, getOneById: function (a) {
        return d.findById(h.companies, a)
      }, searchByAllCompanies: function (a) {
        return c(a, !0)
      }, searchByClientCompanies: function (a) {
        return c(a, !1)
      }, getClientCompaniesInfo: function (a,
                                           b) {
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/company/clients/info").then(function (a) {
          d.customizeObj(a.data, e);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        l.subscribe("/clientCompaniesInfo", a, function (a) {
          console.log(a);
          if ("CLIENT_COMPANY_INFO" == a.action) {
            a = JSON.parse(a.data);
            for (var b in a)d.defineReadOnlyProperty(e, b, d.customizeObj(a[b]))
          } else"COMPANY_ARCHIVED" == a.action && delete e[a.data.id]
        });
        return e
      }, getCompanyInfo: function (a, b, e) {
        if (!a)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var h = d.customizeObj({});
        g.get("/company/" + a + "/info").then(function (a) {
          d.customizeObj(a.data, h);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        l.subscribe("/clientCompaniesInfo", b, function (b) {
          console.log(b);
          if ("CLIENT_COMPANY_INFO" == b.action) {
            b = JSON.parse(b.data);
            for (var e in b)e === a && d.customizeObj(b[a], h)
          }
        });
        return h
      }, archive: function (a, b) {
        if (!a)throw"companyId is required!";
        var e = g.get("/company/archive/" + a);
        d.handleCallback(e, b)
      }, dearchive: function (a,
                              b) {
        if (!a)throw"companyId is required!";
        var e = g.get("/company/dearchive/" + a);
        d.handleCallback(e, b)
      }, save: function (a, b) {
        if (!a)throw"company is required!";
        var e = "POST";
        a.id && (e = "PUT");
        e = g({url: "/company", method: e, data: a});
        d.handleCallback(e, b)
      }, saveForCompanyProfile: function (a, b, e) {
        if (!a)throw"data is required!";
        if (!b)throw"toUpdate is required!";
        b = "/settings/companyProfile/" + b.toLowerCase();
        a = g({url: b, method: "PUT", data: a});
        d.handleCallback(a, e)
      }, getCompanyForSettingPage: function (a) {
        var b = {};
        g.get("/settings/companyProfile/").then(function (e) {
          d.customizeObj(e.data,
            b);
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, getCompanyData: function (a, b, e) {
        if (!b)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var h = d.customizeObj({});
        g.get("/company/" + b + "/data").then(function (a) {
          d.customizeObj(a.data, h);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        l.subscribe("/companyDto?targetId=" + b, a, function (a) {
          console.log(a);
          if ("COMPANY_DTO_CHANGED" == a.action) {
            a = JSON.parse(a.data);
            for (var e in a)e === b && d.customizeObj(a[b], h)
          }
        });
        return h
      },
      isNameUnique: function (a, b, e) {
        if (!a)throw"name is required!";
        var h = d.customizeObj({});
        g.get("/company/isCompanyNameUnique?name=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, h);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return h
      }, isDomainUnique: function (a, b, e) {
        if (!a)throw"domain is required!";
        var h = d.customizeObj({});
        g.get("/company/isCompanyDomainUnique?domain=" + a + "&id=" + b).then(function (a) {
          d.customizeObj(a.data, h);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return h
      }, saveCover: function (a, b, e) {
        if (!a)throw"croppedImage is required!";
        if (!b)throw"companyId is required!";
        a = g({url: "/company/" + b + "/cover", method: "POST", data: a});
        d.handleCallback(a, e)
      }, deleteCover: function (a, b) {
        if (!a)throw"companyId is required!";
        var e = g({url: "/company/" + a + "/cover", method: "DELETE"});
        d.handleCallback(e, b)
      }, getCompanyContacts: function (a, b, e) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        if (!b)throw"Second argument must be companyId!";
        return d.getListByUrl("/company/" + b + "/contacts", e, function (b) {
          l.subscribe("/companyContact", a, function (a) {
            console.log(a);
            "COMPANY_CONTACT" == a.action && d.customizeArray(a.data, b)
          })
        })
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ContactsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d) {
    return {
      isEmailUnique: function (f, c, a) {
        if (!f)throw"email is required!";
        var b = d.customizeObj({});
        g.get("/contacts/isEmailUnique?email=" + f + "&id=" + c).then(function (e) {
          d.customizeObj(e.data, b);
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, getSubscribedContactsOnTicket: function (f) {
        var c = d.customizeArray([]);
        g.get("/contacts/getSubscribedContactsOnTicket/").then(function (a) {
          d.customizeArray(a.data,
            c);
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return c
      }, getSubscribedContacts: function (f) {
        var c = d.customizeArray([]);
        g.get("/contacts/getSubscribedContacts/").then(function (a) {
          d.customizeArray(a.data, c);
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("DevicesService", ["$http", "$rootScope", "RealTimeService", "Utils", "UsersService", function (g, m, l, d, f) {
    m = m.$new();
    var c = {devices: [], devicesByCompanies: {}};
    d.customizeObj(c);
    g.get("/devices").then(function (a) {
      d.customizeObj(a.data, c.devicesByCompanies);
      for (var b in c.devicesByCompanies)if ("staticCopy" !== b)for (a = 0; a < c.devicesByCompanies[b].length; a++)c.devices.push(c.devicesByCompanies[b][a]);
      f._addInitListener(function () {
        for (var a = 0; a < c.devices.length; a++)for (var b =
          0; b < c.devices[a].users.length; b++) {
          var d = f.getOneById(c.devices[a].users[b].id);
          c.devices[a].users[b] = d
        }
      })
    }, function (a) {
      console.error(a);
      throw"Cannot initialize CompaniesService!";
    });
    l.subscribe("/device", m, function (a) {
      console.log(a)
    });
    return {
      getAllDevices: function () {
        return c.devices
      }, getAllByCompanyId: function (a) {
        return c.devicesByCompanies[a] || []
      }, getOneById: function (a) {
        return d.findById(c.devices, a)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("EmailSettingsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    return {
      saveNumberForm: function (f, c, a) {
        if (!f)throw"data is required!";
        if (!c)throw"type is required!";
        f.type = c;
        f = g({url: "/settings/emailPages/updateNumberForm", method: "PUT", data: f});
        d.handleCallback(f, a)
      }, getCompanyEmailNotification: function (f) {
        var c = {};
        g.get("/settings/emailPages/emailNotifications").then(function (a) {
          d.customizeObj(a.data, c);
          f &&
          f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return c
      }, getEmailSettingPageDto: function (f, c) {
        if (!f)throw"scope is required!";
        var a = d.customizeObj({});
        g.get("/settings/emailPages/").then(function (b) {
          d.customizeObj(b.data, a);
          c && c(b.data)
        }, function (a) {
          c && c(a.data)
        });
        l.subscribe("/companyEmailNotification", f, function (b) {
          console.log(b);
          "COMPANY_EMAIL_NOTIFICATION" == b.action && d.customizeObj(b.data, a.activeAndNotDefault)
        });
        return a
      }, getTermsAndConditions: function (f) {
        var c = {};
        g.get("/settings/emailPages/termsAndConditions").then(function (a) {
          d.customizeObj(a.data,
            c);
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return c
      }, setToDefaultTemplate: function (f, c) {
        if (!f)throw"type is required!";
        var a = g({url: "/settings/emailPages/toDefaultTemplate/" + f, method: "POST"});
        d.handleCallback(a, c)
      }, getTemplate: function (f, c) {
        if (!f)throw"type is required!";
        var a = {};
        g.get("/settings/emailPages/byType/" + f).then(function (b) {
          d.customizeObj(b.data, a);
          c && c(b.data)
        }, function (a) {
          c && c(a.data)
        });
        return a
      }, saveEmailTemplate: function (f, c, a) {
        if (!f)throw"data is required!";
        if (!f.subject)throw"data.subject is required!";
        if (!f.body)throw"data.body is required!";
        if (!c)throw"type is required!";
        f = g({url: "/settings/emailPages/updateTemplate/" + c, method: "PUT", data: f});
        d.handleCallback(f, a)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("FilesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    return {
      create: function (d, c, a, b, e) {
        if (!d)throw"file is required!";
        var k = {}, h = new FormData;
        h.append("file", d);
        d = new XMLHttpRequest;
        d.upload.addEventListener("progress", c, !1);
        d.addEventListener("load", function (b) {
          b = angular.fromJson(b.currentTarget.responseText);
          for (var e in b)k[e] = b[e];
          a && a(k)
        }, !1);
        d.addEventListener("error", b, !1);
        d.open("POST", "/file?isAvatar=" + !!e);
        d.send(h);
        return k
      }, createImageFromBase64Url: function (d, c) {
        if (!d)throw"base64Url is required!";
        var a = {};
        g({url: "/base64image", method: "POST", data: d.substring(22, d.length)}).then(function (b) {
          for (var e in b.data)a[e] = b.data[e];
          c && c(a)
        });
        return a
      }, getMetadata: function (d, c) {
        if (!d)throw"fileId is required!";
        var a = {id: d};
        g.get("/file/" + d + "/meta").then(function (b) {
          for (var e in b.data)a[e] = b.data[e];
          c && c(a)
        }, function (a) {
          c && c(a.data)
        });
        return a
      }, remove: function (d, c) {
        if (!d)throw"fileId is required!";
        g({
          url: "/file/" +
          d, method: "DELETE"
        }).then(function (a) {
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        })
      }, cropAvatar: function (d, c) {
        if (!d)throw"image is required!";
        g({url: "/file/cropImage", method: "POST", data: d}).then(function (a) {
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        })
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ProductsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d, f) {
    return {
      search: function (d) {
        if (!d)throw"Keyword is required!";
        return g.get("/products/search?keyword=" + d).then(function (a) {
          return a.data
        })
      }, getCategories: function (c, a) {
        if (!c || !c.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/products/categories", a, function (a) {
          l.subscribe("/productCategory", c, function (e) {
            console.log(e);
            if ("PRODUCT_CATEGORY_SAVED" == e.action) {
              var k = d.findById(a, e.data.id);
              k ? d.customizeObj(e.data, k) : a.push(d.customizeObj(e.data))
            } else"PRODUCT_CATEGORY_DELETED" == e.action && (d.deleteById(a, e.data.id), c.$broadcast("product_category_deleted", e.data))
          })
        })
      }, saveCategory: function (c, a) {
        if (!c)throw"category is required!";
        var b = "/products/categories", e = "POST";
        c.id && (b += "/" + c.id, e = "PUT");
        b = g({url: b, method: e, data: c});
        d.handleCallback(b, a)
      }, deleteCategory: function (c, a) {
        if (!c)throw"categoryId is required argument!";
        var b = g({url: "/products/categories/" + c, method: "DELETE"});
        d.handleCallback(b, a)
      }, getAllByCategory: function (c, a, b, e) {
        if (!c || !c.$id)throw"First argument must be Angularjs scope!";
        if (!a)throw"categoryId is required argument!";
        var k = "/products?categoryId=" + a;
        e && (k = "/products/full?categoryId=" + a);
        return d.getListByUrl(k, b, function (b) {
          l.subscribe("/product?targetId=" + a, c, function (a) {
            console.log(a);
            if ("PRODUCT_SAVED" == a.action) {
              var e = d.findById(b, a.data.versionedId.id);
              e ? d.customizeObj(a.data, e) : b.push(d.customizeObj(a.data))
            } else"PRODUCT_DELETED" ==
            a.action && (d.deleteById(b, a.data.versionedId.id), c.$broadcast("product_deleted", a.data))
          })
        })
      }, saveProduct: function (c, a) {
        if (!c)throw"product is required!";
        var b = "POST";
        c.id && (b = "PUT");
        b = g({url: "/products", method: b, data: c});
        d.handleCallback(b, a)
      }, deleteProduct: function (c, a) {
        if (!c)throw"productId is required argument!";
        var b = g({url: "/products/" + c, method: "DELETE"});
        d.handleCallback(b, a)
      }, isProductNameUnique: function (c, a, b, e) {
        if (!c)throw"name is required!";
        if (!b)throw"vendorId is required!";
        var k = d.customizeObj({});
        g.get("/products/isProductNameUnique?name=" + c + "&id=" + a + "&vendorId=" + b).then(function (a) {
          d.customizeObj(a.data, k);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        return k
      }, getActualCode: function (c, a) {
        if (!c || !c.$id)throw"Second argument must be Angularjs scope!";
        var b = d.customizeObj({});
        g.get("/products/actualCode").then(function (e) {
          d.customizeObj(e.data, b);
          a && a(e.data)
        }, function (b) {
          a && a(b.data)
        });
        l.subscribe("/productCode", c, function (a) {
          console.log(a);
          "PRODUCT_CODE_CHANGED" === a.action && d.defineReadOnlyProperty(b,
            "value", a.data)
        });
        return b
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("RealTimeService", ["$http", "$timeout", "$rootScope", function (g, m, l) {
    function d() {
      g.post("/realTime/createWatcher").success(function (a) {
        b = a.id;
        if (0 < e.length) {
          for (a = 0; a < e.length; a++) {
            var d = e[a];
            q.subscribe(d.url, d.scope, d.callback)
          }
          e = []
        }
        c()
      }).error(function (a, b, d, e) {
        console.error("Cannot receive watcher Id !!!", a, b, d, e);
        throw"Cannot initialize RealTimeService";
      })
    }

    function f() {
      b = t;
      for (var a in h) {
        var c = h[a];
        c && !c.scope.$$destroyed && e.push(c)
      }
      h =
      {};
      d()
    }

    function c() {
      0 < k ? m(c, 300) : g.post("/realTime/watch/" + b, Object.keys(h) || []).then(function (a) {
        console.log(a.data);
        if ("timeout" == a.data || "destroyed" == a.data.message || 205 == a.status)f(); else if ("unauthorized" === a.data.errorMessage || "unauthorized" === a.data.authMessage)v.location.pathname = "/login"; else {
          for (var b in a.data) {
            var d = h[b];
            if (d && !d.scope.$$destroyed) {
              var e = a.data[b];
              if (e)for (var k = 0; k < e.length; k++)d.callback(e[k])
            }
          }
          c()
        }
      }, function (a) {
        a && 0 !== a.status ? 205 == a.status ? f() : (console.log("ERRRORRR!!!!!!!!!!!!",
          a), m(c, 300)) : (console.log("ERRRORRR?????", a), m(f, 1E3))
      })
    }

    function a(b) {
      for (var d in h) {
        var e = h[d];
        e && !e.scope.$$destroyed && e.callback !== a && e.callback(b)
      }
      "COMPANY_ARCHIVED" !== b.action && "COMPANY_DEARCHIVED" !== b.action || l.$broadcast(b.action.toLowerCase(), b.data.id)
    }

    var b, e = [{url: "/global", scope: l, callback: a}], k = 0, h = {};
    d();
    var q = {
      subscribe: function (a, d, c) {
        b ? (k++, g.get("/realTime/subscribe/" + b + a).success(function (b) {
          k--;
          h[b.id] = {url: a, scope: d, callback: c};
          d.$on("$destroy", function () {
            delete h[b.id]
          })
        }).error(function (b,
                           h, q, y) {
          k--;
          205 == h && (e.push({url: a, scope: d, callback: c}), f());
          console.error("Cannot subscribe on " + a, b, h, q, y)
        })) : e.push({url: a, scope: d, callback: c})
      }
    };
    return q
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ReceiptArchiveService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    return {
      getReceiptArchiveData: function (f, c) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        var a = d.customizeObj({list: [], companies: {}});
        g.get("/receiptArchive").then(function (b) {
          d.customizeArray(b.data, a.list);
          a.list.forEach(function (b) {
            var c = a.companies[b.companyId];
            c ? c.push(b) : d.defineReadOnlyProperty(a.companies, b.companyId, d.customizeArray([b]))
          });
          l.subscribe("/receiptArchive", f, function (b) {
            console.log(b);
            if ("RECEIPT_ARCHIVE_ADDED" === b.action) {
              for (var c = [], h = 0; h < b.data.length; h++) {
                var f = b.data[h], p;
                if (f.recurringInvoice) {
                  var g = d.findById(a.list, f.recurringInvoice.id);
                  g ? (d.defineReadOnlyProperty(g, "invoicesCount", g.invoicesCount + 1), d.defineReadOnlyProperty(g, "sum", g.sum + f.sum), f.date > g.date && (d.defineReadOnlyProperty(g, "date", f.date), d.defineReadOnlyProperty(g, "paidOn", f.paidOn))) : p = d.customizeObj({
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
                } else p = d.customizeObj({
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
                p && (a.list.push(p), (f = a.companies[p.companyId]) ? f.push(p) : d.defineReadOnlyProperty(a.companies, p.companyId, d.customizeArray([p])), 0 > c.indexOf(p.companyId) && c.push(p.companyId))
              }
              a.list.sort(d.getComparatorBy("number"));
              c.forEach(function (b) {
                a.companies[b].sort(d.getComparatorBy("number"))
              })
            } else if ("COMPANY_ARCHIVED" ===
              b.action) {
              for (h = 0; h < a.list.length; h++)a.list[h].companyId === b.data.id && (a.list.splice(h, 1), h--);
              delete a.companies[b.data.id]
            }
          });
          c && c(b.data)
        }, function (a) {
          c && c(a.data)
        });
        return a
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ReceivableService", ["$http", "$rootScope", "RealTimeService", "CompaniesService", "Utils", "$filter", function (g, m, l, d, f) {
    function c(a, b) {
      if (!a)throw"invoiceIds is required!";
      var d = g({url: "/receivable/resend", method: "POST", data: a});
      f.handleCallback(d, b)
    }

    return {
      getReceivedPaymentsSumByCompany: function (a, b, d) {
        if (!a)throw"companyId is required!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        var c = f.customizeObj({});
        g.get("/receivable/paymentSum/" +
          a).then(function (h) {
          f.customizeObj(h.data, c);
          l.subscribe("/companyPaymentReceived?targetId=" + a, b, function (a) {
            console.log(a);
            "COMPANY_PAYMENT_RECEIVED" === a.action ? f.defineReadOnlyProperty(c, "value", c.value + a.data) : "RECEIVED_PAYMENTS_SUM" === a.action && f.defineReadOnlyProperty(c, "value", a.data)
          });
          d && d(h.data)
        }, function (a) {
          d && d(a.data)
        });
        return c
      }, getReceivableGraphData: function (a, b) {
        var e = f.customizeArray([]);
        g.get("/receivable/chart/lastDays").then(function (c) {
          f.customizeArray(c.data, e);
          l.subscribe("/todayReceivableChartPoint?targetId=" +
            d.getCurrentCompany().id, a, function (a) {
            console.log(a);
            if ("TODAY_RECEIVABLE_CHART_POINT" === a.action) {
              var b = e[e.length - 1], d = new Date(b.date), c = new Date(a.data.date);
              d.getFullYear() === c.getFullYear() && d.getMonth() === c.getMonth() && d.getDate() + 1 === c.getDate() ? (e.push(f.customizeObj(a.data)), e.splice(0, 1)) : f.customizeObj(a.data, b)
            }
          });
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, getReceivableInvoicesData: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var d = f.customizeObj({
          list: [],
          companies: {}
        });
        g.get("/receivable").then(function (c) {
          for (var h = f.customizeArray([]), g = 0; g < c.data.length; g++) {
            var p = f.customizeObj(c.data[g]);
            if (p.recurringInvoice) {
              var x = f.findById(h, p.recurringInvoice.id);
              x || (x = p.recurringInvoice, f.defineReadOnlyProperty(x, "isRecurring", !0), f.defineReadOnlyProperty(x, "company", p.company), f.defineReadOnlyProperty(x, "invoices", f.customizeArray([])), h.push(x));
              f.defineReadOnlyProperty(p, "recurringInvoice", {id: x.id, frequency: x.frequency});
              x.invoices.push(p)
            } else h.push(p)
          }
          h.sort(f.getComparatorBy("number"));
          for (g = 0; g < h.length; g++)p = h[g], d.companies[p.company.id] || f.defineReadOnlyProperty(d.companies, p.company.id, f.customizeArray([])), d.companies[p.company.id].push(p);
          f.defineReadOnlyProperty(d, "list", h);
          l.subscribe("/receivableInvoice", a, function (a) {
            console.log(a);
            if ("INVOICE_SAVED" == a.action) {
              var b = a.data, c;
              b.recurringInvoice ? (a = f.findById(d.list, b.recurringInvoice.id), a || (a = b.recurringInvoice, a.isRecurring = !0, a.company = b.company, a.invoices = [], c = a), b.recurringInvoice = {
                id: a.id,
                frequency: a.frequency
              },
                a.invoices.push(b)) : c = b;
              c && (c = f.customizeObj(c), d.companies[c.company.id] || f.defineReadOnlyProperty(d.companies, c.company.id, []), d.companies[c.company.id].push(c), d.list.push(c))
            } else if ("INVOICE_STATUS" === a.action)a.data.recurringInvoice ? ((b = f.findById(d.list, a.data.recurringInvoice.id)) || console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING RECURRING INVOICE-----!!!!!!!"), b = f.findById(b.invoices, a.data.id)) : b = f.findById(d.list, a.data.id), b ? f.defineReadOnlyProperty(b, "status", a.data.status) :
              console.error("!!!!!!!----ATEMPT TO CHANGE STATUS OF UNEXISTING INVOICE-----!!!!!!!!"); else if ("PAYMENT_RECEIVED" === a.action)for (a = a.data, b = 0; b < a.length; b++) {
              var h = a[b], y = t;
              c = t;
              for (var k = 0; k < d.list.length && !c; k++) {
                var g = d.list[k];
                if (g.isRecurring)for (var p = 0; p < g.invoices.length && !c; p++) {
                  var q = g.invoices[p];
                  h === q.id && (g.invoices.splice(p, 1), c = q.company.id, y = g.id, 0 === g.invoices.length && d.list.splice(k, 1))
                } else h === g.id && (d.list.splice(k, 1), c = g.company.id)
              }
              c && d.companies[c] && (k = d.companies[c], y ? (y = f.indexOfId(k,
                y), -1 < y && (-1 < f.indexOfId(k[y].invoices, h) && k[y].invoices.splice(y, 1), 0 === k[y].invoices.length && k.splice(y, 1))) : (h = f.indexOfId(k, h), -1 < h && k.splice(h, 1)), 0 === k.length && delete d.companies[c])
            } else if ("COMPANY_ARCHIVED" == a.action)for (delete d.companies[a.data.id], b = 0; b < d.list.length; b++)d.list[b].company.id === a.data.id && (d.list.splice(b, 1), b--)
          });
          b && b(c.data)
        }, function (a) {
          b && b(a.data)
        });
        return d
      }, receivePayment: function (a, b, d) {
        if (!a)throw"paymentMethod is required!";
        if (!b || 0 === b.length)throw"invoiceIds is required!";
        a = g({
          url: "/receivable/receivePayment",
          method: "POST",
          params: {paymentMethod: a.toUpperCase()},
          data: b
        });
        f.handleCallback(a, d)
      }, resendInvoice: function (a, b) {
        if (!a)throw"invoiceId is required!";
        c([a], b)
      }, resendInvoices: c, search: function (a) {
        if (!a)throw"Keyword is required!";
        return g.get("/receivable/search?keyword=" + a).then(function (a) {
          return a.data
        })
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("RecurringService", ["$http", "$rootScope", "RealTimeService", "CompaniesService", "Utils", "$filter", function (g, m, l, d, f) {
    function c(a, d, c, h) {
      if (!d)throw"recurringInvoiceId is required!";
      if (!c)throw"expense is required!";
      a = {url: "/recurringInvoice/" + d + "/" + a, data: c};
      c.id ? (a.method = "PUT", a.url = a.url + "/" + c.id) : a.method = "POST";
      c = g(a);
      f.handleCallback(c, h)
    }

    function a(a, d, c) {
      if (!a)throw"recurringInvoiceId is required!";
      if (!d)throw"expenseId is required!";
      a = g({url: "/recurringInvoice/" + a + "/expense/" + d, method: "DELETE"});
      f.handleCallback(a, c)
    }

    return {
      getRecurringGraphData: function (a, d) {
        var c = ["WEEKLY", "MONTHLY", "YEARLY"], h = f.customizeArray([]);
        g.get("/recurringInvoice/billed/lastDays").then(function (g) {
          f.customizeArray(g.data, h);
          l.subscribe("/recurringChart", a, function (a) {
            console.log(a);
            if ("RECURRING_CHART" === a.action) {
              for (var b = new Date(a.data.date), d = 0; d < h.length; d++) {
                var e = h[d], g = new Date(e[e.length - 1].date);
                g.getFullYear() === b.getFullYear() && g.getMonth() ===
                b.getMonth() && g.getDate() + 1 === b.getDate() && (e.push(f.customizeObj({
                  date: f.formatDate(b),
                  sum: 0
                })), e.splice(0, 1))
              }
              b = c.indexOf(a.data.type);
              b = h[b];
              f.defineReadOnlyProperty(b[b.length - 1], "sum", a.data.sum)
            }
          });
          d && d(g.data)
        }, function (a) {
          d && d(a.data)
        });
        return h
      }, getRecurringCompanies: function (a, d) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var c = [];
        g({url: "/recurringInvoice/total", method: "GET"}).then(function (h) {
          f.customizeArray(h.data, c);
          l.subscribe("/recurringTotal", a, function (a) {
            console.log(a);
            if ("CLIENT_RECURRING_TOTAL" === a.action) {
              var b = f.indexOfId(c, a.data.id);
              if (0 === a.data.total)-1 < b && c.splice(b, 1); else if (-1 < b)f.customizeObj(a.data, c[b]); else {
                for (var b = !0, d = 0; d < c.length; d++)c[d].company.id === a.data.company.id && (c[d].id = a.data.id, c[d].total = a.data.total, c[d].invoicesCount = a.data.invoicesCount, b = !1);
                b && c.push(f.customizeObj(a.data))
              }
            } else if ("COMPANY_ARCHIVED" == a.action)for (b = 0; b < c.length; b++)c[b].company.id === a.data.id && (c.splice(b, 1), b--)
          });
          d && d(h.data)
        }, function (a) {
          d && d(a.data)
        });
        return c
      }, getCompanyRecurringInvoices: function (a, d, c) {
        if (!a)throw"companyId is required!";
        if (!d || !d.$id)throw"Second argument must be Angularjs scope!";
        var h = [];
        g.get("/recurringInvoice?companyId=" + a).then(function (g) {
          f.customizeArray(g.data, h);
          l.subscribe("/recurring?targetId=" + a, d, function (a) {
            console.log(a);
            if ("RECURRING_SAVED" == a.action) {
              var b = f.findById(h, a.data.id);
              b ? f.customizeObj(a.data, b) : h.push(f.customizeObj(a.data))
            } else"RECURRING_DELETE" == a.action && (a = f.indexOfId(h, a.data.id), -1 < a && h.splice(a,
              1))
          });
          c && c(g.data)
        }, function (a) {
          c && c(a.data)
        });
        return h
      }, createRecurringInvoice: function (a, d, c) {
        if (!a)throw"recurringInvoice is required!";
        if (!d)throw"companyId is required!";
        a.company = {id: d};
        a = g({url: "/recurringInvoice", method: "POST", data: a});
        f.handleCallback(a, c)
      }, deleteRecurringInvoice: function (a, d) {
        if (!a)throw"recurringInvoiceId is required!";
        var c = g({url: "/recurringInvoice/" + a, method: "DELETE"});
        f.handleCallback(c, d)
      }, deleteAllRecurringInvoicesByCompany: function (a, d, c) {
        if (!a)throw"companyId is required!";
        var h = g({url: "/recurringInvoice/company/" + a, method: "DELETE"});
        f.handleCallback(h, function (h) {
          if (d)for (var f = 0; f < d.length; f++)d[f].company.id === a && (d.splice(f, 1), f--);
          c && c(h.data)
        })
      }, saveRecInvProductExpense: function (a, d, f) {
        c("productExpense", a, d, f)
      }, saveRecInvServiceExpense: function (a, d, f) {
        c("serviceExpense", a, d, f)
      }, deleteProductExpenseFromRecInv: function (b, d, c) {
        a(b, d, c)
      }, deleteServiceExpenseFromRecInv: function (b, d, c) {
        a(b, d, c)
      }, search: function (a) {
        if (!a)throw"Keyword is required!";
        return g.get("/recurringInvoice/search?keyword=" +
          a).then(function (a) {
          return a.data
        })
      }, addCompany: function (a, c) {
        if (!a)throw"recurring is required!";
        if (!c)throw"companyId is required!";
        for (var f = 0; f < a.length; f++)if (a[f].company.id === c)return;
        a.push({company: d.getOneById(c), total: 0, ticketsCount: 0})
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("RightPanelService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", "UsersService", "DevicesService", function (g, m, l, d, f, c, a) {
    function b() {
      k.groupedData.splice(0, k.groupedData.length);
      for (var b = f.getClientCompanies(), d = 0; d < b.length; d++) {
        var e = b[d];
        k.groupedData.push({company: e, users: c.getAllByCompanyId(e.id), devices: a.getAllByCompanyId(e.id)})
      }
    }

    function e(a, b) {
      if (!a || !a.$id)throw"First argument must be Angularjs scope!";
      var c =
        k.lists[a.$id];
      if (!c)throw"There is no activities list for scope " + a.$id;
      c.loadingInProcess ? console.log("Loading tickets already in process") : (0 < c.list.length && (c.params.createdAt = c.list[c.list.length - 1].createdAt), c.loadingInProcess = !0, g({
        method: "GET",
        url: "/activity/",
        params: c.params
      }).then(function (a) {
        a && (d.customizeArray(a.data, c.list), c.loadingInProcess = !1, b && b(a.data));
        c.loadingInProcess = !1
      }, function (a) {
        c.loadingInProcess = !1;
        b && b(a.data)
      }))
    }

    m.$new();
    var k = {lists: {}, recentActivities: {}, groupedData: []};
    d.customizeObj(k);
    f._addAmountChangeListener(b);
    return {
      getActivities: function (a, b, c) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var f = d.customizeObj([]), g = !k.lists[a.$id];
        k.lists[a.$id] = {params: b, scope: a, list: f};
        e(a, function (b) {
          g && l.subscribe("/activity", a, function (b) {
            console.log(b);
            "ACTIVITY_CREATED" == b.action && k.lists[a.$id].list.unshift(d.customizeObj(b.data))
          });
          c && c(b)
        });
        a.$on("$destroy", function () {
          delete k.lists[a.$id]
        });
        return f
      }, getRecentActivities: function (a, b, c) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        b.keyword = "";
        var e = d.customizeObj([]);
        k.recentActivities[a.$id] = {params: b, scope: a, list: e};
        g({method: "GET", url: "/activity/", params: b}).then(function (a) {
          a && (d.customizeArray(a.data, e), c && c(a.data))
        }, function (a) {
          c && c(a.data)
        });
        l.subscribe("/activity", a, function (a) {
          console.log(a);
          "ACTIVITY_CREATED" == a.action && (e.unshift(d.customizeObj(a.data)), e.pop())
        });
        a.$on("$destroy", function () {
          delete k.lists[a.$id]
        });
        return e
      }, loadMoreActivities: e, getClientCompaniesGroupedData: function () {
        0 ==
        k.groupedData.length && b();
        return k.groupedData
      }, getOneCompanyGroupedData: function (b) {
        return {company: f.getOneById(b), users: c.getAllByCompanyId(b), devices: a.getAllByCompanyId(b)}
      }, getCurrentUserInfo: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var c = d.customizeObj({});
        g.get("/userInfo").then(function (a) {
          d.customizeObj(a.data, c);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        l.subscribe("/rightBarUserInfo", a, function (a) {
          console.log(a);
          "RB_USER_INFO" == a.action && d.customizeObj(a.data,
            c)
        });
        return c
      }, getClientCompanyInfo: function (a, b, c) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        if (!b)throw"companyId is required!";
        var e = d.customizeObj({});
        g.get("/companyInfo/" + b).then(function (a) {
          d.customizeObj(a.data, e);
          c && c(a.data)
        }, function (a) {
          c && c(a.data)
        });
        l.subscribe("/rightBarCompanyInfo?targetId=" + b, a, function (a) {
          console.log(a);
          "RB_COMPANY_INFO" == a.action && d.customizeObj(a.data, e)
        });
        return e
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("ServicesService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d, f) {
    function c(a, b) {
      var c = b.company.id;
      c === f.getCurrentCompany().id && (c = "default");
      a[c] || d.defineReadOnlyProperty(a, c, []);
      var g = d.findById(a[c], b.id);
      g ? d.customizeObj(b, g) : a[c].push(d.customizeObj(b))
    }

    return {
      search: function (a) {
        if (!a)throw"Keyword is required!";
        return g.get("/services/search?keyword=" + a).then(function (a) {
          return a.data
        })
      }, getAllByCompany: function (a,
                                    b, c) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        if (!b || "[object Function]" === Object.prototype.toString.call(b))throw"companyId is required argument!";
        return d.getListByUrl("/services/" + b, c, function (a) {
        })
      }, getServicesData: function (a, b) {
        function e(a) {
          var b;
          a:{
            b = f;
            var e = a.versionedId.id, g;
            for (g in b)if ("staticCopy" != g) {
              var l = d.findById(b[g], e);
              if (l) {
                b = l;
                break a
              }
            }
            b = void 0
          }
          b ? d.customizeObj(a, b) : c(f, a)
        }

        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var f = d.customizeObj({});
        g.get("/services").then(function (a) {
          for (var d = 0; d < a.data.length; d++)c(f, a.data[d]);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        l.subscribe("/service", a, function (a) {
          console.log(a);
          if ("SERVICE_SAVED" == a.action)e(a.data); else if ("SERVICE_LIST_SAVED" == a.action)for (var b = 0; b < a.data.length; b++)e(a.data[b]); else if ("SERVICES_MOVED" == a.action)for (b = 0; b < a.data.length; b++)c(f, a.data[b]); else if ("COMPANY_SERVICES_DELETED" == a.action)delete f[a.data.id]; else if ("SERVICES_DELETED" == a.action)for (b = 0; b < a.data.length; b++) {
            var g =
              a.data[b].versionedId.id, l = f, n = void 0;
            for (n in l) {
              var w = d.indexOfId(l[n], g);
              -1 < w && l[n].splice(w, 1)
            }
          } else"COMPANY_ARCHIVED" == a.action && delete f[a.data.id]
        });
        return f
      }, save: function (a, b) {
        if (!a)throw"service is required!";
        var c = "/services", f = "POST";
        a.id && (f = "PUT", c = c + "/" + a.id);
        c = g({url: c, method: f, data: a});
        d.handleCallback(c, b)
      }, addCompanyToServiceData: function (a, b) {
        if (!a)throw"data argument is required";
        if (!b)throw"companyId argument is required";
        a[b] || d.defineReadOnlyProperty(a, b, [])
      }, deleteCompanyFromServiceData: function (a,
                                                 b) {
        if (0 < a[b].length)throw"This action cannot be performed on company that has not empty services list! Use deleteCompany() method.";
        delete a[b]
      }, deleteService: function (a, b) {
        if (!a)throw"serviceId is required argument!";
        var c = g({url: "/services/" + a, method: "DELETE"});
        d.handleCallback(c, b)
      }, deleteCompany: function (a, b) {
        if (!a)throw"companyId is required argument!";
        var c = g({url: "/services/company/" + a, method: "DELETE"});
        d.handleCallback(c, b)
      }, move: function (a, b) {
        if (!a)throw"mapping is required argument!";
        var c =
          g({url: "/services/move", method: "POST", data: a});
        d.handleCallback(c, b)
      }, getActualMapping: function (a) {
        var b = {}, d;
        for (d in a)if ("default" != d && "staticCopy" != d) {
          for (var c = [], f = a[d], g = 0; g < f.length; g++)c.push(f[g].originService.versionedId.id);
          b[d] = c
        }
        return b
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("StatisticsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d, f) {
    return {
      getResolvedTicketsCountByCompany: function (c, a, b) {
        if (!c)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/statistic/tickets/resolvedCount/" + c).then(function (f) {
          d.customizeObj(f.data, e);
          l.subscribe("/resolvedTicketsCount?targetId=" + c, a, function (a) {
            console.log(a);
            "RESOLVED_TICKETS_COUNT" === a.action && d.defineReadOnlyProperty(e, "value", a.data)
          });
          b && b(f.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, getTicketsResolutionTimeChartDataByCompany: function (c, a, b) {
        if (!c)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/statistic/tickets/resolutionTime/" + c).then(function (f) {
          d.customizeObj(f.data, e);
          l.subscribe("/ticketsResolutionTimeChart?targetId=" + c, a, function (a) {
            console.log(a);
            "TICKETS_RESOLUTION_TIME_CHART" ===
            a.action && d.customizeObj(a.data, e)
          });
          b && b(f.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, getTimeBilledByCompany: function (c, a, b) {
        if (!c)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/statistic/billed/time/" + c).then(function (f) {
          d.customizeObj(f.data, e);
          l.subscribe("/billedTimeStatistic?targetId=" + c, a, function (a) {
            console.log(a);
            "BILLED_TIME_STATISTIC" === a.action && d.defineReadOnlyProperty(e, "value", a.data)
          });
          b && b(f.data)
        }, function (a) {
          b &&
          b(a.data)
        });
        return e
      }, getReceivableAmountByCompany: function (c, a, b) {
        if (!c)throw"companyId is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/statistic/companies/receivable/" + c).then(function (f) {
          d.customizeObj(f.data, e);
          l.subscribe("/todayReceivableChartPoint?targetId=" + c, a, function (a) {
            console.log(a);
            "TODAY_RECEIVABLE_CHART_POINT" === a.action && d.defineReadOnlyProperty(e, "value", a.data.receivableLeft)
          });
          b && b(f.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }, getContributedToEarningTopCompanies: function (c, a, b) {
        if (!c)throw"topAmount is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/statistic/companies/paymentSum/top/" + c).then(function (c) {
          function f(b) {
            l.subscribe("/companyPaymentReceived?targetId=" + b, a, function (a) {
              console.log(a);
              "COMPANY_PAYMENT_RECEIVED" === a.action && d.defineReadOnlyProperty(e, b, (e[b] ? e[b] : 0) + a.data)
            })
          }

          for (var g in c.data)f(g);
          d.customizeObj(c.data, e);
          b && b(c.data)
        }, function (a) {
          b &&
          b(a.data)
        });
        return e
      }, getTopCompaniesByResolvedTickets: function (c, a, b) {
        if (!c)throw"topAmount is required!";
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var e = d.customizeObj({});
        g.get("/statistic/companies/resolvedTicket/top/" + c).then(function (c) {
          function f(b) {
            l.subscribe("/resolvedTicketsCount?targetId=" + b, a, function (a) {
              console.log(a);
              "RESOLVED_TICKETS_COUNT" === a.action && d.defineReadOnlyProperty(e, b, a.data)
            })
          }

          for (var g in c.data)f(g);
          d.customizeObj(c.data, e);
          b && b(c.data)
        }, function (a) {
          b &&
          b(a.data)
        });
        return e
      }, getTotalEarningsByDays: function (c, a, b, e, f) {
        if (!c)throw"companyId is required!";
        if (!a)throw"from date is required!";
        if (!b)throw"to date is required!";
        if (a.getTime() > b.getTime())throw"from date should be less that to date!";
        if (!e || !e.$id)throw"Angularjs scope is required!";
        var h = d.customizeObj({});
        g.get("/statistic/companies/paymentSum/receivedInterval/" + c + "?from=" + d.formatDate(a) + "&to=" + d.formatDate(b)).then(function (a) {
          var b, g;
          for (g in a.data)b ? (new Date(g)).getTime() > (new Date(b)).getTime() &&
          (b = g) : b = g;
          var n = new Date(b);
          d.customizeObj(a.data, h);
          l.subscribe("/companyPaymentReceived?targetId=" + c, e, function (a) {
            console.log(a);
            if ("COMPANY_PAYMENT_RECEIVED" === a.action) {
              var c = new Date;
              n.getFullYear() === c.getFullYear() && n.getMonth() === c.getMonth() && n.getDate() === c.getDate() && d.defineReadOnlyProperty(h, b, h[b] + a.data)
            }
          });
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return h
      }, getTotalReceivableByDays: function (c, a, b, e, f) {
        if (!c)throw"companyId is required!";
        if (!a)throw"from date is required!";
        if (!b)throw"to date is required!";
        if (a.getTime() > b.getTime())throw"from date should be less that to date!";
        if (!e || !e.$id)throw"Angularjs scope is required!";
        var h = d.customizeObj({});
        g.get("/statistic/companies/receivable/totalInterval/" + c + "?from=" + d.formatDate(a) + "&to=" + d.formatDate(b)).then(function (a) {
          function b(a) {
            var d = new Date;
            if (a.getFullYear() === d.getFullYear() && a.getMonth() === d.getMonth() && a.getDate() === d.getDate())return !0
          }

          var g, n;
          for (n in a.data)g ? (new Date(n)).getTime() > (new Date(g)).getTime() && (g = n) : g = n;
          d.customizeObj(a.data,
            h);
          b(new Date(g)) && l.subscribe("/todayReceivableChartPoint?targetId=" + c, e, function (a) {
            console.log(a);
            "TODAY_RECEIVABLE_CHART_POINT" === a.action && b(new Date(a.data.date)) && d.defineReadOnlyProperty(h, g, a.data.total)
          });
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return h
      }, getTicketsClosedByDays: function (c, a, b, e, f) {
        if (!c)throw"companyId is required!";
        if (!a)throw"from date is required!";
        if (!b)throw"to date is required!";
        if (a.getTime() > b.getTime())throw"from date should be less that to date!";
        if (!e || !e.$id)throw"Angularjs scope is required!";
        var h = d.customizeObj({});
        g.get("/statistic/companies/resolvedTicket/interval/" + c + "?from=" + d.formatDate(a) + "&to=" + d.formatDate(b)).then(function (a) {
          function b(a) {
            var d, c;
            for (c in a)if ("staticCopy" != c) {
              d = c;
              break
            }
            if (d) {
              a = new Date(a[d]);
              for (var e in h)if ("staticCopy" !== e && (d = new Date(e), d.getFullYear() === a.getFullYear() && d.getMonth() === a.getMonth() && d.getDate() === a.getDate()))return e
            }
          }

          d.customizeObj(a.data, h);
          l.subscribe("/ticketResolution?targetId=" + c, e, function (a) {
            console.log(a);
            "TICKET_RESOLVED" ===
            a.action ? (a = b(a.data)) && d.defineReadOnlyProperty(h, a, h[a] + 1) : "TICKET_REOPENED" === a.action && (a = b(a.data)) && d.defineReadOnlyProperty(h, a, h[a] - 1)
          });
          f && f(a.data)
        }, function (a) {
          f && f(a.data)
        });
        return h
      }, getUserSubmittedTicketsByCompany: function (c, a, b) {
        if (!c)throw"companyId is required!";
        if (!a || !a.$id)throw"Angularjs scope is required!";
        var e = d.customizeObj({});
        g.get("/statistic/tickets/submittedTickets/" + c).then(function (f) {
          d.customizeObj(f.data, e);
          l.subscribe("/userSubmittedTicket?targetId=" + c, a, function (a) {
            console.log(a);
            "USER_SUBMITTED_TICKET" === a.action && d.defineReadOnlyProperty(e, a.data, (e[a.data] || 0) + 1)
          });
          b && b(f.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("SubscriptionsService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d, f) {
    function c(a, b, c, f, h) {
      var q = d.customizeObj({});
      g(a).then(function (a) {
        for (var g = 0; g < a.data.length; g++) {
          var m = a.data[g];
          d.defineReadOnlyProperty(q, m.user.id, d.customizeObj(m))
        }
        l.subscribe("/subscription?targetId=" + b, c, function (a) {
          console.log(a);
          "SUBSCRIPTION_SAVED" == a.action ? a.data.user && (!h || -1 < h.indexOf(a.data.user.id)) && d.defineReadOnlyProperty(q,
            a.data.user.id, d.customizeObj(a.data)) : "SUBSCRIPTION_DELETED" == a.action && delete q[a.data.user.id]
        });
        f && f(a.data)
      }, function (a) {
        f && f(a.data)
      });
      return q
    }

    return {
      saveUserSubscription: function (a, b) {
        if (!a)throw"userSubscription is required argument!";
        var c = "/subscription", f = "POST";
        a.id && (c += "/" + a.id, f = "PUT");
        c = g({url: c, method: f, data: a});
        d.handleCallback(c, b)
      }, deleteUserSubscription: function (a, b) {
        if (!a)throw"userSubscriptionId is required argument!";
        var c = g({url: "/subscription/" + a, method: "DELETE"});
        d.handleCallback(c,
          b)
      }, getUserSubscriptionsByCompanyId: function (a, b, d) {
        if (!a)throw"companyId is required argument!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        return c({url: "/subscription/company/users/" + a, method: "GET"}, a, b, d)
      }, getAllClientUserSubscriptions: function (a, b) {
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        return c({url: "/subscription/clientUsers", method: "GET"}, f.getCurrentCompany().id, a, b)
      }, getUserSubscriptionsByUserIds: function (a, b, d) {
        if (!a || 0 == a.length)throw"userIds is required argument!";
        if (!b || !b.$id)throw"Second argument must be Angularjs scope!";
        Array.isArray(a) || (a = [a]);
        return c({url: "/subscription/users/", method: "POST", data: a}, f.getCurrentCompany().id, b, d, a)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("TaxRatesService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    return {
      getAllByCompany: function (f, c, a) {
        if (!c || !c.$id)throw"First argument must be Angularjs scope!";
        if (!f || "[object Function]" === Object.prototype.toString.call(f))throw"companyId is required argument!";
        return d.getListByUrl("/taxRate/" + f, a, function (a) {
          l.subscribe("/taxRate?targetId=" + f, c, function (e) {
            console.log(e);
            if ("TAX_RATE_SAVE" == e.action) {
              var f =
                d.findById(a, e.data.versionedId.id);
              f ? d.customizeObj(e.data, f) : a.push(d.customizeObj(e.data))
            } else"TAX_RATE_DELETE" == e.action && (d.deleteById(a, e.data.versionedId.id), c.$broadcast("tax_rate_delete", e.data))
          })
        })
      }, save: function (f, c) {
        if (!f)throw"taxRate is required!";
        var a = "/taxRate", b = "POST";
        f.id && (b = "PUT", a = a + "/" + f.id);
        a = g({url: a, method: b, data: f});
        d.handleCallback(a, c)
      }, deleteTaxRate: function (f, c) {
        if (!f)throw"taxRateId is required argument!";
        var a = g({url: "/taxRate/" + f, method: "DELETE"});
        d.handleCallback(a,
          c)
      }, isUniqueInCompany: function (f, c, a, b) {
        if (!f)throw"taxRateCode is required!";
        if (!a)throw"companyId is required!";
        var e = d.customizeObj({});
        g.get("/taxRate/isUniqueInCompany?taxRateCode=" + f + "&id=" + c + "&companyId=" + a).then(function (a) {
          d.customizeObj(a.data, e);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        return e
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("TicketsService", ["$http", "$rootScope", "RealTimeService", "Utils", "TicketTagsService", "CompaniesService", function (g, m, l, d, f, c) {
    function a(a) {
      a = angular.extend({}, a);
      a.filter && (a.filter = a.filter.toUpperCase());
      a.priority && (a.priority = a.priority.toUpperCase());
      a.status && (a.status = a.status.toUpperCase());
      return a
    }

    function b(a, b) {
      return a.createdAt - b.createdAt
    }

    function e(a, b) {
      if (!a || !a.$id)throw"First argument must be Angularjs scope!";
      var c = u.lists[a.$id];
      if (!c)throw"There is no ticket list for scope " + a.$id;
      c.loadingInProcess ? console.log("Loading tickets already in process") : (0 < c.list.length ? c.params.lastId = c.list[c.list.length - 1].id : delete c.params.lastId, c.loadingInProcess = !0, g({
        method: "GET",
        url: "/v2/tickets",
        params: c.params
      }).then(function (e) {
        if (e) {
          for (var g = 0; g < e.data.length; g++) {
            var h = e.data[g];
            h.number = "Tkt# " + h.number;
            h.tags && f._makeDynamic(h.tags, a);
            var k = d.findById(c.list, h.id);
            k ? d.customizeObj(h, k) : c.list.push(d.customizeObj(h))
          }
          c.loadingInProcess = !1;
          b && b(e.data)
        }
        c.loadingInProcess = !1
      }, function (a) {
        c.loadingInProcess = !1;
        b && b(a.data)
      }))
    }

    function k(a, b, c, e) {
      c = {value: c};
      "[object Array]" === Object.prototype.toString.call(b) ? (a = "/v2/tickets/" + a, c.ids = b) : a = "/v2/tickets/" + b + "/" + a;
      b = g.put(a, c);
      d.handleCallback(b, e)
    }

    function h(a, b) {
      for (var d in u.lists)for (var c = u.lists[d].list, e = 0; e < c.length; e++) {
        var f = c[e];
        if (f.id === a) {
          b(f);
          break
        }
      }
      for (d in u.tickets)c = u.tickets[d].ticket, c.id === a && b(c)
    }

    function q(a, b, d) {
      if ("USER" === d.filter) {
        if ("COMPLETED" === a.status &&
          "COMPLETED" !== b.status)return 1;
        if ("COMPLETED" === b.status && "COMPLETED" !== a.status)return -1
      }
      return z[d.filter](b) - z[d.filter](a)
    }

    function p(a) {
      return a.assignedAt || a.createdAt
    }

    function x(a, b) {
      return "URGENT" == b.filter && ("HIGH" != a.priorityLevel || "COMPLETED" == a.status || "ADMIN" !== m.currentUser.role && !a.sharedToCurrentUserAt) || "UNASSIGNED" == b.filter && a.assignedUser && a.assignedUser.id || "USER" == b.filter && (!a.assignedUser || a.assignedUser.id != m.currentUser.id) || "OPEN" == b.filter && "COMPLETED" == a.status || "CLOSED" ==
      b.filter&&("COMPLETED"!=a.status||"ADMIN"!==m.currentUser.role&&"SUPER_TECH_ADMIN"!==m.currentUser.role&&(!a.assignedUser||a.assignedUser.id!=m.currentUser.id))||"SHARED"==b.filter&&!a.sharedToCurrentUserAt||!("USER_SPAM"!=b.filter||a.spamReporter&&a.spamReporter.id&&m.currentUser.id==a.spamReporter.id)||"ADMIN_REPORTED_AS_SPAM"==b.filter&&(!a.spamReporter||!a.spamReporter.id||a.spamMarker&&a.spamMarker.id)||!("ADMIN_MARKED_AS_SPAM"!=b.filter||a.spamMarker&&a.spamMarker.id)||"TRASH"==b.filter&&!a.trash||
      "USER_SPAM" !== b.filter && "ADMIN_REPORTED_AS_SPAM" !== b.filter && "ADMIN_MARKED_AS_SPAM" !== b.filter && "TRASH" !== b.filter && (a.spamMarker && a.spamMarker.id || a.spamReporter && a.spamReporter.id || a.trash) || b.companyId && b.companyId != a.company.id || b.status && b.status != a.status || b.priority && b.priority != a.priorityLevel ? !1 : !0
    }

    var n = "ASSIGNED_USER PRIORITY_CHANGED STATUS TRASH REPORT_AS_SPAM RESTORE_FROM_SPAM TICKET_INVOICED TICKET_SHARE".split(" "), w = 0, u = {
      lists: {},
      tickets: {},
      counts: {}
    };
    c = m.$new();
    l.subscribe("/tickets",
      c, function (a) {
        console.log(a);
        a.data && a.data.number && (a.data.number = "Tkt# " + a.data.number);
        if ("CREATED_TICKET" === a.action) {
          var b = d.customizeObj(a.data, {}), c;
          for (c in u.lists) {
            var g = u.lists[c];
            x(a.data, g.params) && g.list.unshift(b)
          }
        } else if ("MARKED_AS_SPAM" === a.action)for (c in u.lists) {
          var g = u.lists[c], k = d.indexOfId(g.list, a.data.id), b = -1 < k, w = x(a.data, g.params);
          b && w ? d.customizeObj(a.data, g.list[k]) : b && !w ? g.list.splice(k, 1) : !b && w && g.list.unshift(d.customizeObj(a.data))
        } else if (-1 < n.indexOf(a.action)) {
          b =
            d.customizeObj(a.data, {});
          for (c in u.lists) {
            g = u.lists[c];
            w = !1;
            k = d.indexOfId(g.list, b.id);
            if (-1 < k)x(a.data, g.params) ? (d.customizeObj(b, g.list[k]), w = !0) : (g.list.splice(k, 1), m.$broadcast("ticket_is_not_available_anymore", {
              ticketId: a.data.id,
              ticketType: g.params.filter
            })); else if (x(a.data, g.params))if (0 === g.list.length)g.list.push(b); else if (k = g.list[g.list.length - 1], 15 > g.list.length || 0 >= q(b, k, g.params))g.list.push(b), w = !0;
            w && g.list.sort(function (a, b) {
              return q(a, b, g.params)
            })
          }
          for (c in u.tickets)k = u.tickets[c].ticket,
          k.id === b.id && d.customizeObj(b, k)
        } else if ("READ" === a.action)h(a.data.id, function (a) {
          d.defineReadOnlyProperty(a, "unread", !1)
        }); else if ("TICKET_UPDATES_READ" === a.action)h(a.data.id, function (a) {
          d.defineReadOnlyProperty(a, "hasNewUpdates", !1)
        }); else if ("TICKET_COLLAPSED" === a.action || "TICKET_DELETED" === a.action) {
          for (c in u.lists)d.deleteById(u.lists[c].list, a.data.id);
          for (c in u.tickets)b = u.tickets[c], b.ticket.id === a.data.id && (delete u.tickets[c], b.scope.$broadcast("ticket_is_not_available_anymore", {ticketId: a.data.id}))
        } else if ("TAG_LINKED" ===
          a.action)for (b in a.data)h(b, function (b) {
          f._merge(b.tags, a.data[b.id])
        }); else if ("COMPANY_ARCHIVED" === a.action) {
          for (c in u.lists) {
            k = u.lists[c].list;
            for (w = 0; w < k.length; w++)b = k[w], b.company.id === a.data.id && (k.splice(w, 1), w--);
            k.length < v.layLoadingPageSize && e(u.lists[c].scope)
          }
          for (c in u.tickets)b = u.tickets[c], k = b.ticket, k.company.id === a.data.id && (delete u.tickets[c], b.scope.$broadcast("ticket_is_not_available_anymore", {ticketId: a.data.id}))
        } else"TICKET_BILLABLE" === a.action && h(a.data.id, function (b) {
          d.defineReadOnlyProperty(b,
            "isBillable",a.data.isBillable)})});var z={URGENT:p,UNASSIGNED:function(a){return a.createdAt},USER:function(a){return a.closedAt||a.assignedAt},OPEN:function(a){return a.assignedAt},CLOSED:function(a){return a.closedAt},SHARED:function(a){return a.sharedToCurrentUserAt},ALL:p,NOT_SPAM_OR_TRASH:p,USER_SPAM:function(a){return a.reportedAsSpamAt},ADMIN_REPORTED_AS_SPAM:function(a){return a.reportedAsSpamAt},ADMIN_MARKED_AS_SPAM:function(a){return a.markedAsSpamAt},TRASH:function(a){return a.deletedAt}};
    return {
      getList: function (b, c, f) {
        if (!b || !b.$id)throw"First argument must be Angularjs scope!";
        if (!c || !c.filter)throw"'filter' is mandatory parameter that must be counted in second argument";
        c = a(c);
        var g = d.customizeObj([]);
        u.lists[b.$id] = {params: c, scope: b, list: g};
        e(b, f);
        b.$on("$destroy", function () {
          delete u.lists[b.$id]
        });
        return g
      }, getCurrentlyWorkingWith: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/v2/tickets/currentlyWorkingWith", b, function (b) {
          l.subscribe("/tickets",
            a, function (a) {
              console.log(a);
              "CURRENTLY_WORKING_WITH" == a.action && d.customizeObj(a.data, b)
            })
        })
      }, loadMore: e, search: function (b, d) {
        if (!b || !b.filter)throw"'filter' is mandatory parameter that must be counted in first argument";
        if (!b.keyword)throw"'keyword' is mandatory parameter that must be counted in first argument";
        if (3 > b.keyword.length)throw"minimal length of 'keyword' is 3 characters";
        b = a(b);
        return g({method: "GET", url: "/v2/tickets/search", params: b}).then(function (a) {
          return a.data
        })
      }, getCount: function (b,
                             c, e) {
        if (!c || !c.$id)throw"Second argument must be Angularjs scope!";
        if (!b || !b.filter)throw"'filter' is mandatory parameter that must be counted in first argument";
        b = a(b);
        var f = d.customizeObj({});
        g({method: "GET", url: "/v2/tickets/countByType", params: b}).then(function (a) {
          d.customizeObj(a.data, f);
          e && e(a.data)
        }, function (a) {
          e && e(a.data)
        });
        l.subscribe("/ticketsCount", c, function (a) {
          console.log(a);
          "TICKETS_COUNT_CHANGED" == a.action && g({
            method: "GET",
            url: "/v2/tickets/countByType",
            params: b
          }).then(function (a) {
            d.customizeObj(a.data,
              f);
            e && e(a.data)
          }, function (a) {
            e && e(a.data)
          })
        });
        return f
      }, getCounts: function (a, b) {
        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        var c = w++, e = d.customizeObj({});
        u.counts[c] = e;
        a.$on("$destroy", function () {
          delete u.counts[c]
        });
        g.get("/data/getCounters").then(function (a) {
          d.customizeObj(a.data, e);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        l.subscribe("/leftPanelCounts", a, function (a) {
          console.log(a);
          "LEFT_PANEL_COUNTS" == a.action && d.customizeObj(a.data, e)
        });
        return e
      }, getCountsByTypesAndCompany: function (a,
                                               b, c, e) {
        function f() {
          g({url: "/v2/tickets/counts/", data: {companyId: b, types: c}, method: "POST"}).then(function (a) {
            d.customizeObj(a.data, h);
            e && e(a.data)
          }, function (a) {
            e && e(a.data)
          })
        }

        if (!a || !a.$id)throw"Second argument must be Angularjs scope!";
        if (!b)throw"companyId is required!";
        if (!c || 0 == c.length)throw"ticketTypes is required!";
        var h = d.customizeObj({});
        f();
        l.subscribe("/ticketsCount", a, function (a) {
          console.log(a);
          "TICKETS_COUNT_CHANGED" == a.action && f()
        });
        return h
      }, getOne: function (a, c, e, h, k) {
        if (!a)throw"Id is mandatory argument!";
        if (!c)throw"ticketsType is mandatory argument!";
        if (!e || !e.$id)throw"Second argument must be Angularjs scope!";
        var p = w++, q = {id: a};
        c = "SPAM" === c.toUpperCase() ? "" : c.toUpperCase();
        var n = "/v2/tickets/" + a + "?ticketsType=" + c;
        h && (n += "&view=extended");
        u.tickets[p] = {ticket: q, scope: e};
        e.$on("$destroy", function () {
          delete u.tickets[p]
        });
        g.get(n).then(function (a) {
          a.data.number = "Tkt# " + a.data.number;
          d.customizeObj(a.data, q);
          q.tags && f._makeDynamic(q.tags, e);
          h && q.updates.sort(b);
          k && k(a.data)
        }, function (a) {
          k && k(a.data)
        });
        h && l.subscribe("/ticketUpdates?targetId=" + a, e, function (a) {
          console.log(a);
          if ("UPDATE_SAVED" == a.action || "UPDATE_CREATED" == a.action) {
            var e = "SHARED" !== c.toUpperCase() || a.data.user.id === m.currentUser.id;
            if (!e)for (var f = 0; f < a.data.shares.length && !e; f++)e = (e = a.data.shares[f].user) && e.id === m.currentUser.id;
            e ? (f = d.findById(q.updates, a.data.id)) ? d.customizeObj(a.data, f) : (f = d.customizeObj(a.data), q.updates.push(f)) : d.deleteById(q.updates, a.data.id);
            q.updates.sort(b)
          } else"UPDATE_DELETED" == a.action && d.deleteById(q.updates,
            a.data.id)
        });
        return q
      }, changePriority: function (a, b, d) {
        if (!a || !b)throw"ticketId and priority is required arguments!";
        k("priority", a, b.toUpperCase(), d)
      }, assignTo: function (a, b, d) {
        if (!a || !b)throw"ticketId and userId is required arguments!";
        k("assign", a, b, d)
      }, changeStatus: function (a, b, d) {
        if (!a || !b)throw"ticketId and status is required arguments!";
        k("status", a, b.toUpperCase(), d)
      }, markAsSpam: function (a, b) {
        if (!a)throw"ticketId is required arguments!";
        k("markAsSpam", a, !1, b)
      }, reportAsSpam: function (a, b) {
        if (!a)throw"ticketId is required arguments!";
        k("reportAsSpam", a, !1, b)
      }, restoreFromSpam: function (a, b) {
        if (!a)throw"ticketId is required arguments!";
        k("restoreFromSpam", a, !1, b)
      }, changeTrashFlag: function (a, b, d) {
        if (!a)throw"ticketId is required arguments!";
        k("trash", a, !!b, d)
      }, deleteForever: function (a, b) {
        if (!a)throw"ticketId is required arguments!";
        var c = a;
        "[object Array]" !== Object.prototype.toString.call(a) && (c = [a]);
        c = g({url: "/v2/tickets/delete/", data: {ids: c}, method: "POST"});
        d.handleCallback(c, b)
      }, claimUser: function (a) {
        g.get("/tickets/claimUser?ticketId=" +
          a)
      }, createTicket: function (a, b) {
        a.priorityLevel && (a.priorityLevel = a.priorityLevel.toUpperCase());
        var c = g.post("/v2/tickets", a);
        d.handleCallback(c, b)
      }, getActualNumber: function (a, b) {
        g.get("/data/actualNumber?type=TICKET").success(function (a) {
          b(a.number)
        });
        l.subscribe("/number?targetId=TICKET", a, function (a) {
          console.log(a);
          "NUMBER_CHANGED" === a.action && b(d.getFormattedNumber(a.data, !0))
        })
      }, createTicketUpdate: function (a, b, c) {
        if (!a)throw"ticketUpdate is required arguments!";
        if (!a.ticket.id)throw"ticketUpdate.ticket.id is required!";
        if (a.id)throw"TicketUpdate must be new, without ticketUpdate.id!";
        if (!a.type)throw"ticketUpdate.type is required!";
        if (!a.note && !a.products && !a.services)throw"In TicketUpdate must be or note or products or services!";
        a = g({url: "/v2/tickets/updates", method: "POST", params: {close: !!b}, data: a});
        d.handleCallback(a, c)
      }, deleteTicketUpdate: function (a, b, c) {
        a = g({url: "/v2/tickets/" + a + "/updates/" + b, method: "DELETE"});
        d.handleCallback(a, c)
      }, loadRemainingTicketUpdates: function (a, c) {
        if (!a.id || !a.updates)throw"You can load updates only for detailed ticket!";
        if (0 == a.updates.length)throw"There is no updates";
        for (var e = [], f = 0; f < a.updates.length; f++)e.push(a.updates[f].id);
        g({url: "/v2/tickets/" + a.id + "/updates/fetch", method: "POST", data: e}).then(function (e) {
          d.customizeArray(e.data, a.updates);
          d.defineReadOnlyProperty(a, "unloadedUpdates", 0);
          a.updates.sort(b);
          c && c(e.data)
        }, function (a) {
          c && c(a.data)
        })
      }, markUpdateAsRead: function (a, b, c) {
        if (!a || !b)throw"ticketId and updateIds is required parameters";
        a = g({url: "/v2/tickets/" + a + "/updates/read", method: "POST", data: b});
        d.handleCallback(a, c)
      }, updateExpenseInTicketUpdate: function (a, b) {
        if (!a)throw"expense is required!";
        if (!a.ticketUpdateId)throw"ticketUpdateId is required!";
        if (!a.serviceExpense && !a.productExpense)throw"serviceExpense or productExpense is required!";
        var c = g({url: "/v2/tickets/ticketUpdate/updateExpense", method: "PUT", data: a});
        d.handleCallback(c, b)
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("TicketTagsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    function f(a, b) {
      return b.createdAt - a.createdAt
    }

    function c(a) {
      e = m.$new();
      k.tags = d.customizeArray([]);
      g.get("/tag").then(function (b) {
        d.customizeArray(b.data, k.tags);
        k.tags && (k.tags.sort(f), l.subscribe("/tags", e, function (a) {
          console.log(a);
          if (k.tags)if ("TAG_SAVED" == a.action) {
            var b = d.findById(k.tags, a.data.id);
            b ? d.customizeObj(a.data, b) : (k.tags.unshift(d.customizeObj(a.data)),
              k.tags.sort(f))
          } else if ("TAG_REMOVED" == a.action)for (b in d.deleteById(k.tags, a.data.id), k.dynamicLists)for (var c = k.dynamicLists[b], e = 0; e < c.length; e++)d.deleteById(c[e], a.data.id)
        }), a && a(b.data))
      }, function (b) {
        console.log("ERROR!!!!!", b);
        a && a(b.data)
      })
    }

    function a() {
      0 === k.watchers.length && r.isEmptyObject(k.dynamicLists) && (e.$destroy(), k.tags = t)
    }

    function b(a, e) {
      if (!e || !e.$id)throw"First argument must be Angularjs scope!";
      if (k.tags) {
        for (var f = 0; f < a.length; f++)a[f] = d.findById(k.tags, a[f].id);
        for (; -1 < (f =
          a.indexOf(t));)a.splice(f, 1);
        k.addDynamicList(a, e)
      } else c(function () {
        b(a, e)
      })
    }

    var e, k = {
      tags: t, watchers: [], dynamicLists: {}, addWatcher: function (b) {
        var d = this.watchers;
        0 > d.indexOf(b.$id) && (d.push(b.$id), b.$on("$destroy", function () {
          var c = d.indexOf(b.$id);
          d.splice(c, 1);
          a()
        }))
      }, addDynamicList: function (b, d) {
        var c = this.dynamicLists;
        c[d.$id] || (c[d.$id] = []);
        c[d.$id].push(b);
        d.$on("$destroy", function () {
          delete c[d.$id];
          a()
        })
      }
    };
    return {
      _makeDynamic: b, _merge: function (a, b) {
        a.splice(0, a.length);
        for (var c = 0; c < b.length; c++) {
          var e =
            d.findById(k.tags, b[c]);
          e && a.push(e)
        }
      }, getList: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        k.tags ? b && setTimeout(function () {
          b(k.tags.staticCopy())
        }, 100) : c(b);
        k.addWatcher(a);
        return k.tags
      }, save: function (a, b) {
        if (!a)throw"ticketTag is required argument!";
        var c = "/tag", e = "POST";
        a.id && (c += "/" + a.id, e = "PUT");
        c = g({url: c, method: e, data: a});
        d.handleCallback(c, b)
      }, deleteTag: function (a, b) {
        if (!a)throw"tagId is required argument!";
        var c = g({url: "/tag/" + a, method: "DELETE"});
        d.handleCallback(c,
          b)
      }, link: function (a, b) {
        if (!a)throw"linkMap is required argument!";
        var c = g({url: "/tag/link", method: "POST", data: a});
        d.handleCallback(c, b)
      }, getTicketsCounts: function (a, b) {
        if (!a || !a.$id)throw"First argument must be Angularjs scope!";
        var c = d.customizeObj({});
        g.get("/tag/counts").then(function (a) {
          d.customizeObj(a.data, c);
          b && b(a.data)
        }, function (a) {
          b && b(a.data)
        });
        l.subscribe("/tagCounts", a, function (a) {
          console.log(a);
          "TAG_COUNTS" == a.action && d.customizeObj(a.data, c)
        });
        return c
      }
    }
  }])
})(window, jQuery);
(function (v, r, t) {
  angular.module("main.services").factory("UsersService", ["$http", "$rootScope", "RealTimeService", "Utils", "CompaniesService", function (g, m, l, d, f) {
    function c(b) {
      var c = d.findById(n.users, b.id);
      c ? d.customizeObj(b, c) : (b = d.customizeObj(b), n.users.push(b), b.company.id !== f.getCurrentCompany().id && n.clientUsers.push(b), a(b), n.usersByCompanies[b.company.id] || (n.usersByCompanies[b.company.id] = []), n.usersByCompanies[b.company.id].push(b))
    }

    function a(a) {
      var b = [a.firstName, a.lastName].map(function (a) {
        return a.charAt(0).toUpperCase()
      }).join("");
      d.defineReadOnlyProperty(a, "initials", b)
    }

    function b() {
      return e(m.currentUser.id)
    }

    function e(a) {
      return d.findById(n.users, a)
    }

    function k(a, d, c) {
      if (!a)throw"Keyword is required!";
      var e = [];
      c = c ? n.usersByCompanies[c] || [] : n.users;
      for (var f = 0; f < c.length; f++) {
        var g = c[f];
        (d || b().company.id !== g.company.id) && -1 < (g.firstName + " " + g.lastName).toLowerCase().indexOf(a.toLowerCase()) && e.push(g)
      }
      return e
    }

    var h = m.$new(), q = [], p = !1, r = !1, n = {users: [], clientUsers: [], usersByCompanies: {}};
    d.customizeObj(n);
    f._addInitListener(function () {
      r ||
      (r = !0, g.get("/users").then(function (b) {
        d.customizeArray(b.data, n.users);
        for (b = 0; b < n.users.length; b++) {
          var c = n.users[b];
          a(c);
          n.usersByCompanies[c.company.id] || (n.usersByCompanies[c.company.id] = []);
          n.usersByCompanies[c.company.id].push(c);
          c.company.id !== f.getCurrentCompany().id && n.clientUsers.push(c)
        }
        p = !0;
        for (b = 0; b < q.length; b++)q[b]();
        q = []
      }, function (a) {
        console.error(a);
        throw"Cannot initialize CompaniesService!";
      }), l.subscribe("/user", h, function (a) {
        console.log(a);
        if (p)if ("USER_SAVED" == a.action)c(a.data);
        else if ("USER_DELETED" == a.action) {
          var b = d.findById(n.users, a.data.id);
          d.deleteById(n.users, a.data.id);
          d.deleteById(n.clientUsers, a.data.id);
          b && d.deleteById(n.usersByCompanies[b.company.id], a.data.id)
        } else if ("USER_ONLINE" == a.action)(b = d.findById(n.users, a.data.id)) && d.defineReadOnlyProperty(b, "online", !!a.data.online); else if ("COMPANY_ARCHIVED" == a.action) {
          for (b = 0; b < n.users.length; b++)n.users[b].company.id === a.data.id && (n.users.splice(b, 1), b--);
          for (b = 0; b < n.clientUsers.length; b++)n.clientUsers[b].company.id ===
          a.data.id && (n.clientUsers.splice(b, 1), b--);
          delete n.usersByCompanies[a.data.id]
        } else"USERS_DEARCHIVED" == a.action && a.data.forEach(c)
      }))
    });
    return {
      _addInitListener: function (a) {
        if (!a)throw"callback is required!";
        p ? a() : q.push(a)
      }, getCurrentUser: b, getAllUsers: function () {
        return n.users
      }, getClientUsers: function () {
        return n.clientUsers
      }, getAllByCompanyId: function (a) {
        return n.usersByCompanies[a] || []
      }, getOneById: e, getUserProfile: function (a) {
        var b = {};
        g.get("/settings/userProfile/").then(function (c) {
          d.customizeObj(c.data,
            b);
          a && a(c.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, searchByAllUsers: function (a) {
        return k(a, !0)
      }, searchByClientUsers: function (a) {
        return k(a, !1)
      }, searchByUsersFromCompany: function (a, b) {
        return k(a, !1, b)
      }, changeUserRole: function (a, b, c) {
        if (!a)throw"userId is required!";
        if (!b)throw"roleName is required!";
        a = g({url: "/users/updateRole/" + a + "?role=" + b.toUpperCase(), method: "PUT"});
        d.handleCallback(a, c)
      }, save: function (a, b) {
        if (!a)throw"user is required!";
        var c = "/users", e = "POST";
        a.id && (e = "PUT", c = c + "/" + a.id);
        c = g({url: c, method: e, data: a});
        d.handleCallback(c, b)
      }, saveForUserProfile: function (a, b, c) {
        if (!a)throw"data is required!";
        if (!b)throw"toUpdate is required!";
        b = "/settings/userProfile/" + b.toLowerCase();
        a = g({url: b, method: "PUT", data: a});
        d.handleCallback(a, c)
      }, deleteOrArchiveUser: function (a, b, c) {
        if (!a)throw"ids is required!";
        if (b === t)throw"isArchive is required!";
        Array.isArray(a) || (a = [a]);
        a = g({url: "/users/" + !!b, method: "POST", data: a});
        d.handleCallback(a, c)
      }, isEmailUnique: function (a, b, c) {
        if (!a)throw"email is required!";
        var e = d.customizeObj({});
        g.get("/users/isEmailUnique?email=" + a + "&id=" + b).then(function (a) {
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
  angular.module("main.services").factory("VendorsService", ["$http", "$rootScope", "RealTimeService", "Utils", "$filter", function (g, m, l, d) {
    return {
      save: function (f, c) {
        if (!f)throw"vendor is required!";
        var a = "POST";
        f.id && (a = "PUT");
        a = g({url: "/vendor", method: a, data: f});
        d.handleCallback(a, c)
      }, getAll: function (f, c) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/vendor", c, function (a) {
          l.subscribe("/vendor", f, function (b) {
            console.log(b);
            if ("VENDOR_SAVE" == b.action) {
              var c =
                d.findById(a, b.data.id);
              c ? d.customizeObj(b.data, c) : a.push(d.customizeObj(b.data))
            } else if ("VENDOR_ARCHIVED" == b.action)d.deleteById(a, b.data.id), f.$broadcast("vendor_archived", b.data); else if ("VENDOR_DEARCHIVED" == b.action)a.push(d.customizeObj(b.data)), f.$broadcast("vendor_dearchived", b.data); else if ("VENDOR_PRODUCT_SAVE" == b.action) {
              var c = d.findById(a, b.data.id), g = d.findById(c.products, b.data.products[0].versionedId.id);
              if (c && g)for (b = 0; c.products.length < b; b++); else c && (c.products[c.products.length] =
                b.data.products[0])
            } else"VENDOR_PRODUCT_DELETE" == b.action && (c = d.findById(a, b.data.id)) && d.deleteById(c.products, b.data.products[0].versionedId.id)
          })
        })
      }, getAllForCompanyProfile: function (f, c, a) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        if (!c)throw"companyId is required!";
        return d.getListByUrl("/vendor/companyProfile/" + c, a, function (a) {
          l.subscribe("/vendor", f, function (c) {
            console.log(c);
            if ("VENDOR_SAVE" == c.action) {
              var g = d.findById(a, c.data.id);
              g ? d.customizeObj(c.data, g) : a.push(d.customizeObj(c.data))
            } else if ("VENDOR_ARCHIVED" ==
              c.action)d.deleteById(a, c.data.id), f.$broadcast("vendor_archived", c.data); else if ("VENDOR_DEARCHIVED" == c.action)a.push(d.customizeObj(c.data)), f.$broadcast("vendor_dearchived", c.data); else if ("VENDOR_PRODUCT_SAVE" == c.action) {
              var g = d.findById(a, c.data.id), h = d.findById(g.products, c.data.products[0].versionedId.id);
              if (g && h)for (c = 0; g.products.length < c; c++); else g && (g.products[g.products.length] = c.data.products[0])
            } else"VENDOR_PRODUCT_DELETE" == c.action && (g = d.findById(a, c.data.id)) && d.deleteById(g.products,
              c.data.products[0].versionedId.id)
          })
        })
      }, getAllForAutocomplete: function (f, c) {
        if (!f || !f.$id)throw"First argument must be Angularjs scope!";
        return d.getListByUrl("/vendor/autocomplete/list", c, function (a) {
          l.subscribe("/vendor", f, function (b) {
            console.log(b);
            if ("VENDOR_SAVE" == b.action) {
              var c = d.findById(a, b.data.id);
              c ? d.customizeObj(b.data, c) : a.push(d.customizeObj(b.data))
            } else"VENDOR_ARCHIVED" == b.action ? (d.deleteById(a, b.data.id), f.$broadcast("vendor_archived", b.data)) : "VENDOR_DEARCHIVED" == b.action && (a.push(d.customizeObj(b.data)),
              f.$broadcast("vendor_dearchived", b.data))
          })
        })
      }, getAllInCompanyForAutocomplete: function (f, c) {
        if (!f)throw"companyId is required!";
        var a = d.customizeArray([]);
        g.get("/vendor/getAll/" + f).then(function (b) {
          d.customizeArray(b.data, a);
          c && c(b.data)
        }, function (a) {
          c && c(a.data)
        });
        return a
      }, isWebsiteUnique: function (f, c, a) {
        if (!f)throw"website is required!";
        var b = d.customizeObj({});
        g.get("/vendor/isWebsiteUnique?website=" + f + "&id=" + c).then(function (c) {
          d.customizeObj(c.data, b);
          a && a(c.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, isNameUnique: function (f, c, a) {
        if (!f)throw"name is required!";
        var b = d.customizeObj({});
        g.get("/vendor/isNameUnique?name=" + f + "&id=" + c).then(function (c) {
          d.customizeObj(c.data, b);
          a && a(c.data)
        }, function (b) {
          a && a(b.data)
        });
        return b
      }, archive: function (f, c) {
        if (!f)throw"id is required!";
        var a = g.get("/vendor/archive/" + f);
        d.handleCallback(a, c)
      }, dearchive: function (f, c) {
        if (!f)throw"id is required!";
        var a = g.get("/vendor/dearchive/" + f);
        d.handleCallback(a, c)
      }, getOneById: function (f, c) {
        if (!f)throw"vendorId is required!";
        var a = d.customizeObj({});
        g.get("/vendor/getOneById/" + f).then(function (b) {
          d.customizeObj(b.data, a);
          c && c(b.data)
        }, function (a) {
          c && c(a.data)
        });
        return a
      }, search: function (d) {
        if (!d)throw"Keyword is required!";
        return g.get("/vendor/search?keyword=" + d).then(function (c) {
          return c.data
        })
      }
    }
  }])
})(window, jQuery);
