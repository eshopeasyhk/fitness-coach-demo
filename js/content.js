(function () {
  "use strict";

  var BASE = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || "";
      var m = src.match(/^(.*\/)js\/content\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    return "./";
  })();

  function waUrl(digits, text) {
    var d = String(digits || "").replace(/\D/g, "");
    if (d.length === 8) d = "852" + d;
    var q = text ? "?text=" + encodeURIComponent(text) : "";
    return "https://wa.me/" + d + q;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function setText(sel, text) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (text != null) el.textContent = text;
    });
  }

  function setHtml(sel, html) {
    var el = document.querySelector(sel);
    if (el && html != null) el.innerHTML = html;
  }

  function iconSvg(name) {
    var icons = {
      dumbbell:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M8 20h4v8H8v-3H5v-2h3v-3zm32 0v3h3v2h-3v3h-4v-8h4zM14 18h4v12h-4V18zm16 0h4v12h-4V18zm-10 2h8v8h-8v-8z"/></svg>',
      group:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 22a6 6 0 1 0-6-6 6 6 0 0 0 6 6zm-10 4a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm20 0a5 5 0 1 0-5-5 5 5 0 0 0 5 5zM24 24c5.2 0 12 2.6 12 7.8V36H12v-4.2C12 26.6 18.8 24 24 24zm-12.5.5c2.1 0 4 .5 5.5 1.4-3.3 1.5-5.5 3.9-5.5 6.9V36H6v-3.2c0-3.4 3.2-6.8 5.5-8.3zm25 0c2.3 1.5 5.5 4.9 5.5 8.3V36h-5.5v-3.2c0-3-2.2-5.4-5.5-6.9 1.5-.9 3.4-1.4 5.5-1.4z"/></svg>',
      glove:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M30 8c-2 0-3.5 1-4.5 2.5C24.2 9 22.5 8 20.5 8 16 8 13 12 13 17v7c0 5 3 9 8 10v3h10v-3c5-1 8-5 8-10v-5c0-6-3.5-11-9-11zm-1 26H19v-2.2c.8.1 1.6.2 2.5.2h5c.9 0 1.7-.1 2.5-.2V34z"/></svg>',
      fire:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 6c2 6-2 8-2 12 0 2.5 1.8 4 4 4 4 0 7-4 7-9 5 4 7 8 7 13a12 12 0 0 1-24 0c0-6 4-11 8-14 0 3 1 5 3 6-1-5 0-9 4-12z"/></svg>',
      leaf:
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M38 8c-12 2-20 8-24 16-2 4-3 8-3 12 4 0 8-1 12-3 8-4 14-12 16-24-4 2-8 4-11 8 4-1 7-3 10-9zM14 34c2-6 6-11 12-15-5 6-8 12-8 18-2-1-3-2-4-3z"/></svg>'
    };
    return icons[name] || icons.dumbbell;
  }

  function applyTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var map = {
      bg: "--bg",
      surface: "--surface",
      surface2: "--surface-2",
      ink: "--ink",
      muted: "--muted",
      lime: "--lime",
      limeDark: "--lime-dark",
      teal: "--teal",
      whatsapp: "--wa",
      line: "--line"
    };
    Object.keys(map).forEach(function (k) {
      if (theme[k]) root.style.setProperty(map[k], theme[k]);
    });
    if (theme.bg) {
      var tc = document.querySelector('meta[name="theme-color"]');
      if (tc) tc.setAttribute("content", theme.bg);
    }
  }

  function applyMeta(meta) {
    if (!meta) return;
    if (meta.title) {
      document.title = meta.title;
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt) ogt.setAttribute("content", meta.title);
    }
    if (meta.description) {
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", meta.description);
      var ogd = document.querySelector('meta[property="og:description"]');
      if (ogd) ogd.setAttribute("content", meta.description);
    }
  }

  function applyWaLinks(contact) {
    if (!contact || !contact.phoneDigits) return;
    document.querySelectorAll("a[data-cms-wa]").forEach(function (a) {
      var text = a.getAttribute("data-cms-wa-text") || contact.waDefaultText || "";
      a.href = waUrl(contact.phoneDigits, text);
    });
    setText("[data-cms='phoneDisplay']", contact.phoneDisplay || contact.phoneDigits);
    setText("[data-cms='demoNote']", contact.demoNote || "");
    setText("[data-cms='hours']", contact.hours || "");
    setText("[data-cms='area']", contact.area || "");
    setText("[data-cms='contactTitle']", contact.title || "");
    setText("[data-cms='contactTagline']", contact.tagline || "");
  }

  function renderTiers(tiers) {
    return (
      '<ul class="tier-list">' +
      (tiers || [])
        .map(function (t) {
          return (
            "<li><span class=\"tier-label\">" +
            escapeHtml(t.label || "") +
            '</span><span class="tier-price"><span class="currency">HK$</span>' +
            escapeHtml(t.price || "") +
            "</span>" +
            (t.note
              ? '<span class="tier-note">' + escapeHtml(t.note) + "</span>"
              : '<span class="tier-note"></span>') +
            "</li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function packageCardHtml(p, digits, opts) {
    opts = opts || {};
    var featured = p.featured ? " featured" : "";
    var badge = p.badge
      ? '<span class="card-badge">' + escapeHtml(p.badge) + "</span>"
      : "";
    var bullets = (p.bullets || [])
      .map(function (b) {
        return "<li>" + escapeHtml(b) + "</li>";
      })
      .join("");
    var href = waUrl(digits, p.waText || "");
    var extraNote = opts.extraNote
      ? '<p class="card-extra">' + escapeHtml(opts.extraNote) + "</p>"
      : "";
    return (
      '<article class="pkg-card' +
      featured +
      '" id="pkg-' +
      escapeAttr(p.id || "") +
      '">' +
      '<div class="pkg-card-top">' +
      '<div class="pkg-icon">' +
      iconSvg(p.icon || "dumbbell") +
      "</div>" +
      badge +
      "</div>" +
      '<p class="pkg-cat">' +
      escapeHtml(p.category || p.nameEn || "") +
      "</p>" +
      "<h3>" +
      escapeHtml(p.nameZh || "") +
      "</h3>" +
      '<p class="pkg-summary">' +
      escapeHtml(p.summary || "") +
      "</p>" +
      renderTiers(p.tiers) +
      extraNote +
      "<ul class=\"pkg-bullets\">" +
      bullets +
      "</ul>" +
      '<a class="btn btn-wa" href="' +
      href +
      '" target="_blank" rel="noopener" data-cms-wa data-cms-wa-text="' +
      escapeAttr(p.waText || "") +
      '">查詢此套餐</a>' +
      "</article>"
    );
  }

  function renderFeatured(packages, featuredIds, contact) {
    var el = document.querySelector("[data-cms='featured']");
    if (!el || !packages) return;
    var digits = (contact && contact.phoneDigits) || "85291234567";
    var ids = featuredIds || [];
    var list = packages.filter(function (p) {
      return ids.indexOf(p.id) !== -1 || p.featured;
    });
    if (!list.length) list = packages.slice(0, 3);
    el.innerHTML = list
      .map(function (p) {
        return packageCardHtml(p, digits);
      })
      .join("");
  }

  function renderPackages(packages, contact) {
    var el = document.querySelector("[data-cms='packages']");
    if (!el || !packages) return;
    var digits = (contact && contact.phoneDigits) || "85291234567";
    el.innerHTML = packages
      .map(function (p) {
        return packageCardHtml(p, digits);
      })
      .join("");
  }

  function renderNutrition(nutrition, contact) {
    var el = document.querySelector("[data-cms='nutrition']");
    if (!el || !nutrition) return;
    var digits = (contact && contact.phoneDigits) || "85291234567";
    var label = nutrition.sectionLabel || "營養顧問加購／可獨立報名";
    setText("[data-cms='nutritionLabel']", label);
    var p = Object.assign({}, nutrition, {
      category: label,
      icon: "leaf",
      featured: true,
      badge: nutrition.badge || "加購／可獨立報名"
    });
    el.innerHTML = packageCardHtml(p, digits, {
      extraNote: nutrition.note || "任何訓練套餐可加購，亦可獨立報名營養跟進"
    });
  }

  function renderTrust(trust) {
    var el = document.querySelector("[data-cms='trust']");
    if (!el || !trust) return;
    el.innerHTML = trust
      .map(function (t) {
        return (
          '<li><strong>' +
          escapeHtml(t.title || "") +
          "</strong><span>" +
          escapeHtml(t.body || "") +
          "</span></li>"
        );
      })
      .join("");
  }

  function renderCerts(certs) {
    var el = document.querySelector("[data-cms='certs']");
    if (!el || !certs) return;
    el.innerHTML = certs
      .map(function (c) {
        return (
          '<li class="cert-badge"><span class="cert-code">' +
          escapeHtml(c.code || "") +
          '</span><span class="cert-label">' +
          escapeHtml(c.label || "") +
          "</span></li>"
        );
      })
      .join("");
  }

  function renderHighlights(items) {
    var el = document.querySelector("[data-cms='coachHighlights']");
    if (!el || !items) return;
    el.innerHTML = items
      .map(function (h) {
        return "<li>" + escapeHtml(h) + "</li>";
      })
      .join("");
  }

  function renderChips(chips) {
    var el = document.querySelector("[data-cms='heroChips']");
    if (!el || !chips) return;
    el.innerHTML = chips
      .map(function (c) {
        return "<li>" + escapeHtml(c) + "</li>";
      })
      .join("");
  }


  function renderResults(results) {
    var el = document.querySelector("[data-cms='results']");
    if (!el || !results || !results.items) return;
    setText("[data-cms='resultsKicker']", results.kicker || "");
    setText("[data-cms='resultsHeading']", results.heading || "");
    setText("[data-cms='resultsLede']", results.lede || "");
    setText("[data-cms='resultsDisclaimer']", results.disclaimer || "");
    el.innerHTML = results.items
      .map(function (item) {
        return (
          '<article class="result-card">' +
          '<p class="result-demo-tag">' + escapeHtml(item.demoTag || "虛構示範案例") + '</p>' +
          '<div class="ba-split" aria-hidden="true">' +
          '<div class="ba-side ba-before">' +
          '<div class="ba-silhouette ba-sil-before"></div>' +
          '<span>' + escapeHtml(item.beforeLabel || "前") + "</span>" +
          "</div>" +
          '<div class="ba-divider"><span>→</span></div>' +
          '<div class="ba-side ba-after">' +
          '<div class="ba-silhouette ba-sil-after"></div>' +
          '<span>' + escapeHtml(item.afterLabel || "後") + "</span>" +
          "</div>" +
          "</div>" +
          '<div class="result-meta">' +
          '<p class="result-initials">' + escapeHtml(item.initials || "") + "</p>" +
          '<p class="result-stats"><strong>−' +
          escapeHtml(item.kgLost || "") +
          " kg</strong><span>" +
          escapeHtml(item.weeks || "") +
          " 週</span></p>" +
          '<p class="result-focus">' +
          escapeHtml(item.focus || "") +
          "</p>" +
          '<blockquote>「' +
          escapeHtml(item.quote || "") +
          "」</blockquote>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function apply(data) {
    applyTheme(data.theme);
    applyMeta(data.meta);
    applyWaLinks(data.contact);

    if (data.brand) {
      setText("[data-cms='brandZh']", data.brand.zh);
      setText("[data-cms='brandEn']", data.brand.en);
      setText("[data-cms='brandTagline']", data.brand.tagline);
    }
    if (data.hero) {
      setText("[data-cms='heroEyebrow']", data.hero.eyebrow);
      setText("[data-cms='heroTitle']", data.hero.title);
      setText("[data-cms='heroLede']", data.hero.lede);
      renderChips(data.hero.chips);
    }
    renderTrust(data.trust);
    renderFeatured(data.packages, data.featuredIds, data.contact);
    renderPackages(data.packages, data.contact);
    renderNutrition(data.nutrition, data.contact);
    setText("[data-cms='pricingFootnote']", data.pricingFootnote);

    if (data.coach) {
      setText("[data-cms='coachKicker']", data.coach.kicker);
      setText("[data-cms='coachName']", data.coach.name);
      setText("[data-cms='coachRole']", data.coach.role);
      setText("[data-cms='coachBio']", data.coach.bio);
      setText("[data-cms='coachBio2']", data.coach.bio2);
      renderCerts(data.coach.certs);
      renderHighlights(data.coach.highlights);
    }
    if (data.results) {
      renderResults(data.results);
    }
    if (data.contactSection) {
      setText("[data-cms='contactHeading']", data.contactSection.heading);
      setText("[data-cms='contactBody']", data.contactSection.body);
    }
    setText("[data-cms='footerTag']", data.footerTag);
    setText("[data-cms='templateNote']", data.templateNote || "");

    document.documentElement.classList.add("cms-ready");
  }

  window.FitForgeContent = { apply: apply, waUrl: waUrl, base: BASE };

  fetch(BASE + "data/site.json?_=" + Date.now())
    .then(function (r) {
      if (!r.ok) throw new Error("site.json " + r.status);
      return r.json();
    })
    .then(apply)
    .catch(function (err) {
      console.warn("[content.js]", err);
    });
})();
