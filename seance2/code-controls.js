(function () {
  function force(el, prop, value) {
    if (el) el.style.setProperty(prop, value, 'important');
  }

  function applyLayout() {
    const qc = document.getElementById('quarto-content');
    const sidebar = document.getElementById('quarto-sidebar-toc-left');
    const main = document.querySelector('main.content') || document.getElementById('quarto-document-content');
    const margin = document.getElementById('quarto-margin-sidebar') || document.querySelector('.margin-sidebar');

    if (window.innerWidth >= 1100) {
      force(document.documentElement, 'max-width', 'none');
      force(document.body, 'max-width', 'none');
      force(document.body, 'width', '100%');

      if (qc) {
        force(qc, 'display', 'grid');
        force(qc, 'grid-template-columns', '260px minmax(0, 1fr)');
        force(qc, 'column-gap', '28px');
        force(qc, 'width', 'calc(100vw - 32px)');
        force(qc, 'max-width', 'none');
        force(qc, 'margin-left', '16px');
        force(qc, 'margin-right', '16px');
        force(qc, 'padding-left', '0');
        force(qc, 'padding-right', '0');
      }

      if (sidebar) {
        force(sidebar, 'grid-column', '1');
        force(sidebar, 'width', '260px');
        force(sidebar, 'max-width', '260px');
        force(sidebar, 'margin', '0');
      }

      if (main) {
        force(main, 'grid-column', '2');
        force(main, 'width', '100%');
        force(main, 'max-width', 'none');
        force(main, 'margin', '0');
        force(main, 'padding-left', '0');
        force(main, 'padding-right', '24px');
      }

      if (margin) force(margin, 'display', 'none');

      document.querySelectorAll('.page-columns .content, #quarto-document-content, .page-layout-full main').forEach(function (el) {
        force(el, 'width', '100%');
        force(el, 'max-width', 'none');
      });
    } else if (main) {
      force(main, 'width', '100%');
      force(main, 'max-width', 'none');
      force(main, 'padding-left', '16px');
      force(main, 'padding-right', '16px');
    }
  }

  function fixROutputs() {
    const selectors = [
      '.qwebr-output-code-area',
      '.qwebr-output-code-stdout',
      '.qwebr-output-code-stderr',
      '.qwebr-output',
      '.quarto-live-output',
      '.cell-output',
      '.cell-output-display',
      '[class*="output-code"]',
      '[class*="output-stdout"]',
      '[class*="output-stderr"]'
    ];

    document.querySelectorAll(selectors.join(',')).forEach(function (box) {
      force(box, 'background', '#ffffff');
      force(box, 'background-color', '#ffffff');
      force(box, 'color', '#111827');
      force(box, 'border-color', '#d7dee8');
      box.querySelectorAll('pre, code, span, div').forEach(function (child) {
        force(child, 'color', '#111827');
        if (child.tagName === 'PRE' || child.tagName === 'CODE') {
          force(child, 'background', 'transparent');
          force(child, 'background-color', 'transparent');
        }
      });
    });
  }

  function installToolbar() {
    const anchor = document.getElementById('code-toolbar-anchor');
    if (!anchor || document.getElementById('code-toolbar')) return;
    const toolbar = document.createElement('div');
    toolbar.id = 'code-toolbar';
    toolbar.className = 'code-toolbar';
    toolbar.setAttribute('role', 'group');
    toolbar.setAttribute('aria-label', 'Commandes d’affichage du code R');

    const expand = document.createElement('button');
    expand.type = 'button';
    expand.textContent = 'Développer tout le code R';

    const collapse = document.createElement('button');
    collapse.type = 'button';
    collapse.textContent = 'Réduire tout le code R';

    function codeDetails() {
      return document.querySelectorAll('details.r-code, details.code-fold, details.cell-code');
    }

    expand.addEventListener('click', function () {
      codeDetails().forEach(function (item) { item.open = true; });
    });
    collapse.addEventListener('click', function () {
      codeDetails().forEach(function (item) { item.open = false; });
    });

    toolbar.appendChild(expand);
    toolbar.appendChild(collapse);
    anchor.appendChild(toolbar);
  }

  function install() {
    applyLayout();
    fixROutputs();
    installToolbar();

    const observer = new MutationObserver(function () {
      applyLayout();
      fixROutputs();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', applyLayout);
    setTimeout(fixROutputs, 600);
    setTimeout(fixROutputs, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
