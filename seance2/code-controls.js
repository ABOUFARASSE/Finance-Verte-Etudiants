(function () {
  const ROOT = '/Finance-Verte-Etudiants/';

  function force(el, prop, value) {
    if (el) el.style.setProperty(prop, value, 'important');
  }

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach(b => { binary += String.fromCharCode(b); });
    return btoa(binary);
  }

  function base64ToUtf8(b64) {
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function patchWebRCells() {
    document.querySelectorAll('script[type^="webr-"][type$="-contents"]').forEach(script => {
      try {
        const raw = script.textContent.trim();
        if (!raw) return;
        const payload = JSON.parse(base64ToUtf8(raw));
        if (typeof payload.code !== 'string') return;
        if (!payload.code.includes('options(width = 220')) {
          payload.code = 'options(width = 220, scipen = 999)\n' + payload.code;
          script.textContent = utf8ToBase64(JSON.stringify(payload));
        }
      } catch (e) {
        console.warn('Patch WebR ignoré pour une cellule :', e);
      }
    });
  }

  patchWebRCells();

  function injectStyle() {
    if (document.getElementById('student-v2-style')) return;
    const style = document.createElement('style');
    style.id = 'student-v2-style';
    style.textContent = `
      html, body { max-width:none!important; width:100%!important; }
      body { background:#f4f7fa!important; }
      #quarto-content.page-columns {
        display:grid!important;
        grid-template-columns:270px minmax(0,1fr)!important;
        gap:32px!important;
        width:min(98vw,1900px)!important;
        max-width:none!important;
        margin:0 auto!important;
        padding:0 18px!important;
      }
      #quarto-sidebar-toc-left {
        grid-column:1!important;
        width:270px!important;
        max-width:270px!important;
        margin:0!important;
      }
      main.content, #quarto-document-content {
        grid-column:2!important;
        width:100%!important;
        max-width:1500px!important;
        margin:0!important;
        padding:0 24px 80px 0!important;
      }
      #quarto-margin-sidebar, .margin-sidebar { display:none!important; }
      #quarto-document-content > p,
      #quarto-document-content > section > p,
      #quarto-document-content > ul,
      #quarto-document-content > ol,
      #quarto-document-content > section > ul,
      #quarto-document-content > section > ol { max-width:92ch; }
      #quarto-document-content table,
      #quarto-document-content figure,
      #quarto-document-content .cell,
      #quarto-document-content .cell-output,
      #quarto-document-content .cell-output-display,
      #quarto-document-content div.sourceCode,
      #quarto-document-content details { max-width:100%!important; }
      h1.title, h1 { font-size:clamp(2.15rem,3.1vw,3.25rem)!important; line-height:1.02!important; }
      h2 { margin-top:2.6rem!important; }
      h3 { margin-top:1.65rem!important; }
      p, li { line-height:1.65; }
      .course-nav {
        display:flex; gap:.55rem; align-items:center; flex-wrap:wrap;
        margin:0 0 1.15rem 0; padding:.55rem .7rem;
        border:1px solid #d8e2ec; border-radius:10px; background:#fff;
        position:sticky; top:.35rem; z-index:30; box-shadow:0 3px 12px rgba(15,23,42,.06);
      }
      .course-nav a { text-decoration:none!important; color:#12385f!important; font-weight:700; padding:.32rem .58rem; border-radius:7px; }
      .course-nav a:hover, .course-nav a.active { background:#eaf3ff; }
      #TOC { font-size:.82rem!important; line-height:1.22!important; }
      #TOC > ul > li { margin:.26rem 0!important; }
      #TOC > ul > li > a { font-weight:700!important; }
      #student-toc-controls { display:flex; gap:.4rem; margin:.35rem 0 .7rem; }
      #student-toc-controls button { flex:1; border:1px solid #cad7e6; background:#f7faff; color:#12385f; border-radius:7px; padding:.3rem .45rem; font-size:.76rem; font-weight:700; cursor:pointer; }
      .student-toc-collapsed { display:none!important; }
      .code-toolbar { padding:.45rem!important; gap:.4rem!important; }
      .code-toolbar button { font-size:.82rem!important; padding:.36rem .58rem!important; }

      /* Sorties Quarto Live/WebR : règle exacte du runtime */
      div.exercise-cell-output.cell-output,
      div.exercise-cell-output.cell-output-stdout,
      div.exercise-cell-output.cell-output-stderr {
        display:block!important;
        width:100%!important;
        max-width:100%!important;
        min-width:0!important;
        overflow-x:auto!important;
        overflow-y:visible!important;
        background:#fff!important;
        color:#111827!important;
        border:1px solid #d8e2ec!important;
        border-radius:10px!important;
        padding:.8rem 1rem!important;
        box-sizing:border-box!important;
      }
      div.exercise-cell-output.cell-output pre,
      div.exercise-cell-output.cell-output-stdout pre,
      div.exercise-cell-output.cell-output-stderr pre {
        display:block!important;
        width:max-content!important;
        min-width:100%!important;
        max-width:none!important;
        margin:0!important;
        padding:0!important;
        overflow:visible!important;
        background:transparent!important;
        color:#111827!important;
      }
      div.exercise-cell-output.cell-output pre code,
      div.exercise-cell-output.cell-output-stdout pre code,
      div.exercise-cell-output.cell-output-stderr pre code {
        display:block!important;
        width:max-content!important;
        min-width:100%!important;
        max-width:none!important;
        white-space:pre!important;
        word-wrap:normal!important;
        overflow-wrap:normal!important;
        word-break:normal!important;
        background:transparent!important;
        color:#111827!important;
        font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace!important;
        font-size:.95rem!important;
        line-height:1.45!important;
      }
      div.exercise-cell-output.cell-output-stderr pre code { color:#a61b1b!important; }

      .student-r-output { max-width:100%!important; overflow-x:auto!important; }
      .student-r-output pre { white-space:pre!important; }
      .student-r-output code { white-space:pre!important; word-wrap:normal!important; overflow-wrap:normal!important; }

      .download-support-card {
        margin:3rem 0 1rem;
        padding:1.15rem 1.25rem;
        background:#ffffff;
        border:1px solid #d8e2ec;
        border-radius:14px;
        box-shadow:0 6px 20px rgba(15,23,42,.06);
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:1rem;
        flex-wrap:wrap;
      }
      .download-support-copy { display:flex; flex-direction:column; gap:.2rem; }
      .download-support-copy strong { color:#12385f; font-size:1.02rem; }
      .download-support-copy span { color:#64748b; font-size:.9rem; }
      .download-support-btn {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:.45rem;
        padding:.72rem 1rem;
        border-radius:9px;
        background:#12385f;
        color:#fff!important;
        font-weight:700;
        text-decoration:none!important;
        border:1px solid #12385f;
      }
      .download-support-btn:hover {
        background:#0b2a49;
        border-color:#0b2a49;
      }

      @media (max-width:1099px) {
        #quarto-content.page-columns { display:block!important; width:100%!important; padding:0 12px!important; }
        #quarto-sidebar-toc-left { width:100%!important; max-width:none!important; }
        main.content, #quarto-document-content { width:100%!important; max-width:none!important; padding:0 10px 60px!important; }
        .course-nav { position:static; }
      }
    `;
    document.head.appendChild(style);
  }

  function installNav() {
    const main = document.querySelector('main.content') || document.getElementById('quarto-document-content');
    if (!main || document.getElementById('course-nav')) return;
    const nav = document.createElement('nav');
    nav.id = 'course-nav';
    nav.className = 'course-nav';
    const here = location.pathname;
    nav.innerHTML = `
      <a href="${ROOT}">← Accueil</a>
      <a href="${ROOT}seance1/" class="${here.includes('/seance1/') ? 'active' : ''}">Séance 1</a>
      <a href="${ROOT}seance2/" class="${here.includes('/seance2/') ? 'active' : ''}">Séance 2</a>
      <a href="${ROOT}seance3/" class="${here.includes('/seance3/') ? 'active' : ''}">Séance 3</a>
      <a href="${ROOT}seance4/" class="${here.includes('/seance4/') ? 'active' : ''}">Séance 4</a>
      <a href="${ROOT}seance5/" class="${here.includes('/seance5/') ? 'active' : ''}">Séance 5</a>
      <a href="${ROOT}seance6/" class="${here.includes('/seance6/') ? 'active' : ''}">Séance 6</a>`;
    main.insertBefore(nav, main.firstChild);
  }

  function installTocControls() {
    const toc = document.getElementById('TOC');
    if (!toc || document.getElementById('student-toc-controls')) return;
    const controls = document.createElement('div');
    controls.id = 'student-toc-controls';
    const collapse = document.createElement('button');
    collapse.textContent = 'Réduire';
    const expand = document.createElement('button');
    expand.textContent = 'Tout afficher';
    controls.append(collapse, expand);
    const title = toc.querySelector('#toc-title');
    if (title) title.insertAdjacentElement('afterend', controls); else toc.prepend(controls);

    const nested = Array.from(toc.querySelectorAll(':scope > ul > li > ul'));
    function reduce() {
      nested.forEach(ul => ul.classList.add('student-toc-collapsed'));
      const active = toc.querySelector('a.active, a[aria-current="true"]');
      const parent = active && active.closest(':scope > ul > li');
      if (parent) {
        const ul = parent.querySelector(':scope > ul');
        if (ul) ul.classList.remove('student-toc-collapsed');
      }
    }
    collapse.addEventListener('click', reduce);
    expand.addEventListener('click', () => nested.forEach(ul => ul.classList.remove('student-toc-collapsed')));
    reduce();
  }

  function isSourceCode(el) {
    return !!el.closest('.sourceCode, .cm-editor, .cell-code, details.r-code, details.code-fold, details.cell-code');
  }

  function styleOutputBox(box) {
    if (!box || isSourceCode(box)) return;
    box.classList.add('student-r-output');
    force(box, 'background', '#ffffff');
    force(box, 'background-color', '#ffffff');
    force(box, 'color', '#111827');
    force(box, 'width', '100%');
    force(box, 'max-width', '100%');
    force(box, 'overflow-x', 'auto');
  }

  function fixROutputs() {
    document.querySelectorAll('div.exercise-cell-output, .qwebr-output, .quarto-live-output, .cell-output, .cell-output-display').forEach(styleOutputBox);
  }

  function installToolbar() {
    const anchor = document.getElementById('code-toolbar-anchor');
    if (!anchor || document.getElementById('code-toolbar')) return;
    const toolbar = document.createElement('div');
    toolbar.id = 'code-toolbar';
    toolbar.className = 'code-toolbar';
    const expand = document.createElement('button');
    expand.type = 'button'; expand.textContent = 'Afficher tout le code R';
    const collapse = document.createElement('button');
    collapse.type = 'button'; collapse.textContent = 'Masquer tout le code R';
    const details = () => document.querySelectorAll('details.r-code, details.code-fold, details.cell-code');
    expand.addEventListener('click', () => details().forEach(x => x.open = true));
    collapse.addEventListener('click', () => details().forEach(x => x.open = false));
    toolbar.append(expand, collapse);
    anchor.appendChild(toolbar);
  }

  function installDownloadSupport() {
    if (document.getElementById('download-support-wrap')) return;
    const m = location.pathname.match(/\/seance([1-6])\//);
    if (!m) return;
    const n = m[1];
    const main = document.querySelector('main.content') || document.getElementById('quarto-document-content');
    if (!main) return;

    const wrap = document.createElement('div');
    wrap.id = 'download-support-wrap';
    wrap.innerHTML = `
      <div class="download-support-card">
        <div class="download-support-copy">
          <strong>Support de la séance</strong>
          <span>Version polycopié académique au format PDF.</span>
        </div>
        <a class="download-support-btn"
           href="${ROOT}pdf/Polycopie_Seance${n}_Finance_Verte_Academique.pdf"
           download>
          📄 Télécharger le support
        </a>
      </div>`;
    main.appendChild(wrap);
  }

  function install() {
    injectStyle();
    installNav();
    installTocControls();
    installToolbar();
    installDownloadSupport();
    fixROutputs();
    const observer = new MutationObserver(() => requestAnimationFrame(fixROutputs));
    observer.observe(document.body, { childList:true, subtree:true });
    setTimeout(fixROutputs, 500);
    setTimeout(fixROutputs, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
