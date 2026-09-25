(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // <stdin>
  var require_stdin = __commonJS({
    "<stdin>"(exports) {
      window.throttle = (func, limit) => {
        let lastFunc, lastRan;
        return (...args) => {
          const context = exports;
          if (!lastRan || Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(
              () => {
                func.apply(context, args);
                lastRan = Date.now();
              },
              limit - (Date.now() - lastRan)
            );
          }
        };
      };
      (function() {
        [Element, Document, Window].forEach((target) => {
          target.prototype._addEventListener = target.prototype.addEventListener;
          target.prototype._removeEventListener = target.prototype.removeEventListener;
          target.prototype.addEventListener = target.prototype.on = function(name, listener, options) {
            this.__listeners__ = this.__listeners__ || {};
            this.__listeners__[name] = this.__listeners__[name] || [];
            for (let [l, o] of this.__listeners__[name]) {
              if (l === listener && JSON.stringify(o) === JSON.stringify(options)) {
                return this;
              }
            }
            this.__listeners__[name].push([listener, options]);
            this._addEventListener(name, listener, options);
            return this;
          };
          target.prototype.removeEventListener = target.prototype.off = function(name, listener, options) {
            if (!this.__listeners__ || !this.__listeners__[name]) {
              return this;
            }
            if (!listener) {
              this.__listeners__[name].forEach(([listener2, options2]) => {
                this.removeEventListener(name, listener2, options2);
              });
              delete this.__listeners__[name];
              return this;
            }
            this._removeEventListener(name, listener, options);
            this.__listeners__[name] = this.__listeners__[name].filter(
              ([l, o]) => l !== listener || JSON.stringify(o) !== JSON.stringify(options)
            );
            if (this.__listeners__[name].length === 0) {
              delete this.__listeners__[name];
            }
            return this;
          };
        });
        window._$ = (selector) => document.querySelector(selector);
        window._$$ = (selector) => document.querySelectorAll(selector);
        function setTheme() {
          document.documentElement.setAttribute("data-theme", "dark");
          document.documentElement.setAttribute("data-theme-mode", "true");
          document.body.dispatchEvent(
            new CustomEvent("reimu:theme-set", {
              detail: { isDark: true, mode: "true" }
            })
          );
        }
        setTheme();
        const mainNavToggle = _$("#main-nav-toggle");
        const mask = _$("#mask");
        if (mainNavToggle && mask) {
          mainNavToggle.addEventListener("click", () => {
            document.body.classList.toggle("mobile-nav-on");
            mask.classList.toggle("hide");
          });
          mask.addEventListener("click", () => {
            document.body.classList.remove("mobile-nav-on");
            mask.classList.add("hide");
          });
        }
        const tocBtn = _$(".sidebar-toc-btn");
        const commonBtn = _$(".sidebar-common-btn");
        const tocSidebar = _$(".sidebar-toc-sidebar");
        const commonSidebar = _$(".sidebar-common-sidebar");
        if (tocBtn && commonBtn && tocSidebar && commonSidebar) {
          tocBtn.addEventListener("click", () => {
            tocBtn.classList.add("current");
            commonBtn.classList.remove("current");
            tocSidebar.classList.remove("hidden");
            commonSidebar.classList.add("hidden");
          });
          commonBtn.addEventListener("click", () => {
            commonBtn.classList.add("current");
            tocBtn.classList.remove("current");
            commonSidebar.classList.remove("hidden");
            tocSidebar.classList.add("hidden");
          });
        }
        let oldScrollTop = 0;
        document.addEventListener("scroll", () => {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          const diffY = scrollTop - oldScrollTop;
          window.diffY = diffY;
          oldScrollTop = scrollTop;
          if (diffY < 0) {
            _$("#header-nav")?.classList.remove("header-nav-hidden");
          } else {
            _$("#header-nav")?.classList.add("header-nav-hidden");
          }
        }, { passive: true });
      })();
      window.safeImport = async (url, integrity) => {
        if (!integrity) {
          return import(url);
        }
        const response = await fetch(url);
        const moduleContent = await response.text();
        const actualHash = await crypto.subtle.digest(
          "SHA-384",
          new TextEncoder().encode(moduleContent)
        );
        const hashBase64 = "sha384-" + btoa(String.fromCharCode(...new Uint8Array(actualHash)));
        if (hashBase64 !== integrity) {
          throw new Error(`Integrity check failed for ${url}`);
        }
        const blob = new Blob([moduleContent], { type: "application/javascript" });
        const blobUrl = URL.createObjectURL(blob);
        const module2 = await import(blobUrl);
        URL.revokeObjectURL(blobUrl);
        return module2;
      };
    }
  });
  require_stdin();
})();
