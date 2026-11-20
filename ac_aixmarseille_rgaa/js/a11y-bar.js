/* Barre d'accessibilite RGAA - theme ac_aixmarseille_rgaa.
   A inclure via un module HTML CMS ou le parametre d'injection JS de PMB :
   <script src="./styles/ac_aixmarseille_rgaa/js/a11y-bar.js"><\/script> */
/* ============================================================================
   BARRE D'OUTILS ACCESSIBILITÉ — RGAA 4.1
   Réglages persistés (localStorage), appliqués sur <html>, panneau accessible
   au clavier (focus-trap + Échap), boutons à état aria-pressed.
   ========================================================================== */
(function () {
  'use strict';

  var ROOT = document.documentElement;
  var STORE_KEY = 'pmb_a11y';
  var FAB_SVG = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M3 8h18M12 8v6m0 0l-3 6m3-6l3 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  // Réglages par défaut
  var defaults = { fontSize: '100', theme: 'light', contrast: 'normal', dys: 'off', spacing: 'normal' };
  var settings = load();

  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); }
    catch (e) { return Object.assign({}, defaults); }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch (e) {}
  }

  function apply() {
    ROOT.style.setProperty('--fs-root', settings.fontSize + '%');
    if (settings.theme === 'dark') ROOT.setAttribute('data-theme', 'dark'); else ROOT.removeAttribute('data-theme');
    if (settings.contrast === 'aaa') ROOT.setAttribute('data-contrast', 'aaa'); else ROOT.removeAttribute('data-contrast');
    if (settings.dys === 'on') ROOT.setAttribute('data-dys', 'on'); else ROOT.removeAttribute('data-dys');
    if (settings.spacing === 'large') ROOT.setAttribute('data-spacing', 'large'); else ROOT.removeAttribute('data-spacing');
    syncButtons();
  }

  // Appliquer AVANT le rendu pour éviter le flash
  apply();

  var PANEL_HTML =
    '<div class="a11y-overlay" data-a11y-overlay></div>' +
    '<aside class="a11y-panel" data-a11y-panel role="dialog" aria-modal="true" aria-labelledby="a11y-title" tabindex="-1" hidden>' +
      '<div class="a11y-panel__head">' +
        '<h2 id="a11y-title">Accessibilité</h2>' +
        '<button type="button" class="a11y-close" data-a11y-close aria-label="Fermer le panneau d\'accessibilité">✕</button>' +
      '</div>' +

      '<fieldset class="a11y-group" data-setting="fontSize">' +
        '<legend>Taille du texte</legend>' +
        '<div class="a11y-options">' +
          '<button type="button" class="a11y-option" data-value="90"  aria-pressed="false">A−</button>' +
          '<button type="button" class="a11y-option" data-value="100" aria-pressed="false">A</button>' +
          '<button type="button" class="a11y-option" data-value="112" aria-pressed="false" style="font-size:1.1em">A+</button>' +
          '<button type="button" class="a11y-option" data-value="125" aria-pressed="false" style="font-size:1.25em">A++</button>' +
        '</div>' +
      '</fieldset>' +

      '<fieldset class="a11y-group" data-setting="contrast">' +
        '<legend>Contraste</legend>' +
        '<div class="a11y-options">' +
          '<button type="button" class="a11y-option" data-value="normal" aria-pressed="false">Standard</button>' +
          '<button type="button" class="a11y-option" data-value="aaa" aria-pressed="false">Renforcé (AAA)</button>' +
        '</div>' +
      '</fieldset>' +

      '<fieldset class="a11y-group" data-setting="theme">' +
        '<legend>Thème</legend>' +
        '<div class="a11y-options">' +
          '<button type="button" class="a11y-option" data-value="light" aria-pressed="false">Clair</button>' +
          '<button type="button" class="a11y-option" data-value="dark" aria-pressed="false">Sombre</button>' +
        '</div>' +
      '</fieldset>' +

      '<fieldset class="a11y-group" data-setting="dys">' +
        '<legend>Aide à la lecture</legend>' +
        '<div class="a11y-options">' +
          '<button type="button" class="a11y-option" data-value="off" aria-pressed="false">Standard</button>' +
          '<button type="button" class="a11y-option" data-value="on" aria-pressed="false">Police adaptée</button>' +
        '</div>' +
      '</fieldset>' +

      '<fieldset class="a11y-group" data-setting="spacing">' +
        '<legend>Espacement du texte</legend>' +
        '<div class="a11y-options">' +
          '<button type="button" class="a11y-option" data-value="normal" aria-pressed="false">Normal</button>' +
          '<button type="button" class="a11y-option" data-value="large" aria-pressed="false">Augmenté</button>' +
        '</div>' +
      '</fieldset>' +

      '<button type="button" class="a11y-reset" data-a11y-reset>↺ Réinitialiser les réglages</button>' +
    '</aside>';

  var panel, overlay, toggleBtn, lastFocused;

  function init() {
    var wrap = document.createElement('div');
    wrap.innerHTML = PANEL_HTML;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    panel = document.querySelector('[data-a11y-panel]');
    overlay = document.querySelector('[data-a11y-overlay]');
    toggleBtn = document.querySelector('[data-a11y-toggle]');
    // PMB : creer un bouton flottant si la page n'en fournit pas
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'a11y-fab';
      toggleBtn.setAttribute('data-a11y-toggle', '');
      toggleBtn.setAttribute('aria-haspopup', 'dialog');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = FAB_SVG + ' Accessibilit\u00e9';
      document.body.appendChild(toggleBtn);
    }

    if (toggleBtn) toggleBtn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    panel.querySelector('[data-a11y-close]').addEventListener('click', close);
    panel.querySelector('[data-a11y-reset]').addEventListener('click', reset);

    panel.querySelectorAll('.a11y-group').forEach(function (group) {
      var key = group.getAttribute('data-setting');
      group.querySelectorAll('.a11y-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          settings[key] = btn.getAttribute('data-value');
          save(); apply();
        });
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') close();
      if (e.key === 'Tab' && panel.getAttribute('data-open') === 'true') trap(e);
    });

    syncButtons();
  }

  function syncButtons() {
    if (!panel) return;
    panel.querySelectorAll('.a11y-group').forEach(function (group) {
      var key = group.getAttribute('data-setting');
      group.querySelectorAll('.a11y-option').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-value') === settings[key]));
      });
    });
  }

  function open() {
    lastFocused = document.activeElement;
    panel.hidden = false;
    setTimeout(function () {
      panel.setAttribute('data-open', 'true');
      overlay.setAttribute('data-open', 'true');
    }, 20);
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    panel.focus();
  }

  function close() {
    panel.setAttribute('data-open', 'false');
    overlay.setAttribute('data-open', 'false');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    setTimeout(function () { panel.hidden = true; }, 280);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function reset() {
    settings = Object.assign({}, defaults);
    save(); apply();
  }

  function trap(e) {
    var f = panel.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
