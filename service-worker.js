self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode!=='navigate') return;
  const url=new URL(req.url);
  if(!/\/Finance-Verte-Etudiants\/(?:seance[1-6]|evaluation-finale)\//.test(url.pathname)) return;
  event.respondWith((async()=>{
    const res=await fetch(req,{cache:'no-store'});
    const type=res.headers.get('content-type')||'';
    if(!type.includes('text/html')) return res;
    let html=await res.text();
    const theme='<link rel="stylesheet" href="/Finance-Verte-Etudiants/course-theme.css">';
    const bar='<div class="course-topbar"><div class="brand"><span class="dot"></span><a href="/Finance-Verte-Etudiants/">Finance Verte — Badr ABOUFARASSE</a></div><div class="navlinks"><a href="/Finance-Verte-Etudiants/seance1/">Séance 1</a><a href="/Finance-Verte-Etudiants/seance2/">Séance 2</a><a href="/Finance-Verte-Etudiants/seance3/">Séance 3</a><a href="/Finance-Verte-Etudiants/seance4/">Séance 4</a><a href="/Finance-Verte-Etudiants/seance5/">Séance 5</a><a href="/Finance-Verte-Etudiants/seance6/">Séance 6</a><a href="/Finance-Verte-Etudiants/evaluation-finale/">Évaluation finale</a><a href="/Finance-Verte-Etudiants/">Accueil</a></div></div>';
    html=html.replace('</head>',theme+'</head>').replace(/<body([^>]*)>/i,'<body$1>'+bar);

    if(url.pathname==='/Finance-Verte-Etudiants/seance5/' || url.pathname==='/Finance-Verte-Etudiants/seance5/index.html'){
      const tocTarget='<li><a href="#synthèse-de-la-séance" id="toc-synthèse-de-la-séance" class="nav-link" data-scroll-target="#synthèse-de-la-séance">11. Synthèse de la séance</a>';
      const tocInsert='<li><a href="#comite-aquasmart" id="toc-comite-aquasmart" class="nav-link" data-scroll-target="#comite-aquasmart">11. Application — Comité AquaSmart</a></li>\n  '+tocTarget;
      if(!html.includes('toc-comite-aquasmart')) html=html.replace(tocTarget,tocInsert);

      const sectionTarget='<section id="synthèse-de-la-séance" class="level1">';
      const appSection='<section id="comite-aquasmart" class="level1">\n<h1>11. Application — Comité d’investissement AquaSmart</h1>\n<p>Cette application autonome met les participants en situation de comité d’investissement. À partir d’un projet de recyclage et de pilotage intelligent de l’eau, ils doivent comparer la décision immédiate à une stratégie d’apprentissage par pilote, calculer et interpréter l’EVPI, l’EVSI et l’ENBS, appliquer une règle conditionnelle après signal et formaliser une résolution de comité.</p>\n<div class="callout callout-style-default callout-note callout-titled"><div class="callout-header d-flex align-content-center"><div class="callout-icon-container"><i class="callout-icon"></i></div><div class="callout-title-container flex-fill">Organisation proposée</div></div><div class="callout-body-container callout-body"><p><strong>Groupes de 2 à 3 · 60 à 75 minutes.</strong> Répartissez les rôles entre présidence, responsable financier et responsable risques/ESG. L’application guide les calculs, la simulation d’un signal, la délibération et la rédaction d’une note de décision.</p></div></div>\n<p><a href="/Finance-Verte-Etudiants/seance5/comite-aquasmart/?v=20261003" target="_blank" class="btn btn-primary" role="button">Ouvrir l’application en plein écran</a></p>\n<div style="margin:1.2rem 0 2rem;border:1px solid #d8e0e8;border-radius:14px;overflow:hidden;background:#fff;"><iframe src="/Finance-Verte-Etudiants/seance5/comite-aquasmart/?v=20261003" title="Comité d’investissement AquaSmart" style="width:100%;height:1320px;border:0;display:block;" loading="lazy"></iframe></div>\n</section>\n';
      if(!html.includes('id="comite-aquasmart"')) html=html.replace(sectionTarget,appSection+sectionTarget);

      html=html.replace('<h1>11. Synthèse de la séance</h1>','<h1>12. Synthèse de la séance</h1>');
      html=html.replace('>11. Synthèse de la séance</a>','>12. Synthèse de la séance</a>');
      html=html.replace('<h1>12. Transition vers la séance 6</h1>','<h1>13. Transition vers la séance 6</h1>');
      html=html.replace('>12. Transition vers la séance 6</a>','>13. Transition vers la séance 6</a>');
    }

    const headers=new Headers(res.headers);
    headers.delete('content-length');
    headers.set('cache-control','no-store, no-cache, must-revalidate');
    return new Response(html,{status:res.status,statusText:res.statusText,headers});
  })());
});