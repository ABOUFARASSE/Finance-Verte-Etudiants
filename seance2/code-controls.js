(function () {
  function install() {
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
