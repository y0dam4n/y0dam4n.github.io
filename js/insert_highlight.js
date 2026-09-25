(() => {
  // <stdin>
  (() => {
    const codeFigcaption = `
  <div class="code-figcaption">
    <div class="code-left-wrap">
      <div class="code-decoration"></div>
      <div class="code-lang"></div>
    </div>
    <div class="code-right-wrap">
      <div class="code-copy icon-copy"></div>
      <div class="code-expand"></div>
    </div>
  </div>
  <div class="code-figcaption-bottom">
    <span class="code-name"></span>
    <a class="code-link"></a>
  </div>`;
    const reimuConfig = window.siteConfig?.code_block || {};
    const expandThreshold = reimuConfig.expand;
    _$$("div.highlight").forEach((element) => {
      if (!element.querySelector(".code-figcaption")) {
        element.insertAdjacentHTML("afterbegin", codeFigcaption);
      }
      if (expandThreshold !== void 0) {
        if (expandThreshold === false || typeof expandThreshold === "number" && element.querySelectorAll("code[data-lang] .line").length > expandThreshold) {
          element.classList.add("code-closed");
          element.style.display = "none";
          void element.offsetWidth;
          element.style.display = "";
        }
      }
      const codeFigcaptionBottom = element.querySelector(
        ".code-figcaption-bottom"
      );
      const fileName = element.getAttribute("name");
      const codeName = element.querySelector(".code-name");
      if (fileName) {
        codeName.innerText = fileName;
      } else {
        codeName.innerText = "";
      }
      const url = element.getAttribute("url");
      const linkText = element.getAttribute("link_text");
      const codeLink = element.querySelector(".code-link");
      if (url) {
        codeLink.setAttribute("href", url);
        codeLink.innerText = linkText || url;
        codeFigcaptionBottom.classList.add("has-link");
      } else {
        codeLink.setAttribute("href", "");
        codeLink.innerText = "";
        codeFigcaptionBottom.classList.remove("has-link");
      }
      if (fileName || url) {
        codeFigcaptionBottom.style.marginBottom = "12px";
      } else {
        codeFigcaptionBottom.style.marginBottom = "0";
      }
    });
    _$$(".code-expand").forEach((element) => {
      element.off("click").on("click", () => {
        element.closest("div.highlight")?.classList.toggle("code-closed");
      });
    });
    _$$("div.highlight").forEach((element) => {
      let code;
      if (element.querySelector("table")) {
        code = element.querySelector("tr td:last-of-type code");
      } else {
        code = element.querySelector("code");
      }
      if (!code) {
        return;
      }
      const codeLanguage = code.dataset.lang;
      if (!codeLanguage) {
        return;
      }
      const langName = codeLanguage.replace("line-numbers", "").replace("language-", "").trim().toUpperCase();
      const wrapper = code.closest(".highlight");
      if (wrapper) {
        const lang = wrapper.querySelector(".code-lang");
        if (lang) {
          lang.innerText = langName;
        }
      }
    });
    if (!window.ClipboardJS) {
      return;
    }
    const getLocalizedText = (config, defaultText) => {
      if (typeof config === "string") return config;
      if (typeof config === "object") {
        const lang = document.documentElement.lang.toLowerCase();
        const key = Object.keys(config).find((k) => k.toLowerCase() === lang);
        if (key && config[key]) return config[key];
      }
      return defaultText;
    };
    const clipboard = new ClipboardJS(".code-copy", {
      text: (trigger) => {
        const container = trigger.closest("div.highlight");
        if (!container) return "";
        const codeTable = container.querySelector("td.lntd:last-child code");
        if (codeTable) return codeTable.innerText || codeTable.textContent || "";
        const codeStandard = container.querySelector("code");
        if (codeStandard) return codeStandard.innerText || codeStandard.textContent || "";
        const pre = container.querySelector("pre");
        return pre ? pre.innerText || pre.textContent || "" : "";
      }
    });
    clipboard.on("success", (e) => {
      e.trigger.classList.add("icon-check");
      e.trigger.classList.remove("icon-copy");
      const successConfig = window.siteConfig.clipboard.success;
      const successText = getLocalizedText(
        successConfig,
        "Copy successfully (*^\u25BD^*)"
      );
      const tooltip = _$("#copy-tooltip");
      if (tooltip) {
        tooltip.innerText = successText;
        tooltip.style.opacity = "1";
      }
      setTimeout(() => {
        if (tooltip) tooltip.style.opacity = "0";
        e.trigger.classList.add("icon-copy");
        e.trigger.classList.remove("icon-check");
      }, 1e3);
      e.clearSelection();
    });
    clipboard.on("error", (e) => {
      e.trigger.classList.add("icon-times");
      e.trigger.classList.remove("icon-copy");
      const failConfig = window.siteConfig.clipboard.fail;
      const failText = getLocalizedText(
        failConfig,
        "Copy failed (\uFF9F\u22BF\uFF9F)\uFF82"
      );
      const tooltip = _$("#copy-tooltip");
      if (tooltip) {
        tooltip.innerText = failText;
        tooltip.style.opacity = "1";
      }
      setTimeout(() => {
        if (tooltip) tooltip.style.opacity = "0";
        e.trigger.classList.add("icon-copy");
        e.trigger.classList.remove("icon-times");
      }, 1e3);
    });
    window.AOS?.refresh();
  })();
})();
