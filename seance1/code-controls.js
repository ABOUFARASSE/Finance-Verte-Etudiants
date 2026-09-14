(function () {
  function installLayoutFix() {
    if (document.getElementById('course-layout-fix')) return;
    const style = document.createElement('style');
    style.id = 'course-layout-fix';
    style.textContent = `
      @media (min-width: 1100px) {
        #quarto-content.page-columns {
          display: grid !important;
          grid-template-columns: minmax(220px, 260px) minmax(0, 1fr) !important;
          column-gap: 2.25rem !important;
          width: min(96vw, 1680px) !important;
          max-width: none !important;
          margin: 0 auto !important;
          padding: 0 1.25rem !important;
        }
        #quarto-sidebar-toc-left {
          grid-column: 1 !important;
          width: 100% !important;
          max-width: 260px !important;
          margin: 0 !important;
        }
        main.content,
        #quarto-document-content,
        .page-columns .content {
          grid-column: 2 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding-left: 0 !important;
          padding-right: 1rem !important;
        }
        .margin-sidebar,
        #quarto-margin-sidebar,
        .sidebar.margin-sidebar {
          display: none !important;
        }
      }
      @media (min-width: 1500px) {
        #quarto-content.page-columns {
          grid-template-columns: 250px minmax(0, 1fr) !important;
          width: min(97vw, 1780px) !important;
          column-gap: 2.6rem !important;
        }
        #quarto-sidebar-toc-left { max-width: 250px !important; }
      }
      @media (max-width: 1099px) {
        main.content,
        #quarto-document-content,
        .page-columns .content {
          width: 100% !important;
          max-width: none !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function install() {
    installLayoutFix();
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
