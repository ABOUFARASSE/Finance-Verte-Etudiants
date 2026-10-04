self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode!=='navigate') return;
  const url=new URL(req.url);
  const coursePage=/\/Finance-Verte-Etudiants\/(?:seance[1-6]|evaluation-finale)\//.test(url.pathname);
  const homePage=url.pathname==='/Finance-Verte-Etudiants/' || url.pathname==='/Finance-Verte-Etudiants/index.html';
  const solariaPage=url.pathname==='/Finance-Verte-Etudiants/cas-solaria/' || url.pathname==='/Finance-Verte-Etudiants/cas-solaria/index.html';
  if(!coursePage && !homePage && !solariaPage) return;
  event.respondWith((async()=>{
    const res=await fetch(req,{cache:'no-store'});
    const type=res.headers.get('content-type')||'';
    if(!type.includes('text/html')) return res;
    let html=await res.text();

    if(coursePage){
      const theme='<link rel="stylesheet" href="/Finance-Verte-Etudiants/course-theme.css">';
      const bar='<div class="course-topbar"><div class="brand"><span class="dot"></span><a href="/Finance-Verte-Etudiants/">Finance Verte — Badr ABOUFARASSE</a></div><div class="navlinks"><a href="/Finance-Verte-Etudiants/seance1/">Séance 1</a><a href="/Finance-Verte-Etudiants/seance2/">Séance 2</a><a href="/Finance-Verte-Etudiants/seance3/">Séance 3</a><a href="/Finance-Verte-Etudiants/seance4/">Séance 4</a><a href="/Finance-Verte-Etudiants/seance5/">Séance 5</a><a href="/Finance-Verte-Etudiants/seance6/">Séance 6</a><a href="/Finance-Verte-Etudiants/evaluation-finale/">Évaluation finale</a><a href="/Finance-Verte-Etudiants/">Accueil</a></div></div>';
      html=html.replace('</head>',theme+'</head>').replace(/<body([^>]*)>/i,'<body$1>'+bar);
    }

    if(solariaPage){
      const dl='<div class="btnrow" style="margin-top:14px"><a class="btn green" href="/Finance-Verte-Etudiants/cas-solaria/download-aer.html?v=20261005-user-aer" target="solariaPdfDownload">Télécharger le PDF académique complet ↓</a></div><iframe name="solariaPdfDownload" title="Téléchargement PDF Solaria" style="display:none"></iframe>';
      const anchor='<div class="brief"><strong>Règle de l’exercice.</strong> Commencez par le Scoreboard. À chaque étape, formulez votre avis sur l’opération. Ne consultez les Conclusions officielles qu’après avoir pris votre propre décision de comité.</div>';
      if(!html.includes('target="solariaPdfDownload"')) html=html.replace(anchor,anchor+dl);
    }

    if(url.pathname==='/Finance-Verte-Etudiants/seance5/' || url.pathname==='/Finance-Verte-Etudiants/seance5/index.html'){
      const tocTarget='<li><a href="#synthèse-de-la-séance" id="toc-synthèse-de-la-séance" class="nav-link" data-scroll-target="#synthèse-de-la-séance">11. Synthèse de la séance</a>';
      const tocInsert='<li><a href="#comite-aquasmart" id="toc-comite-aquasmart" class="nav-link" data-scroll-target="#comite-aquasmart">11. Application — Comité AquaSmart</a></li>\n  '+tocTarget;
      if(!html.includes('toc-comite-aquasmart')) html=html.replace(tocTarget,tocInsert);
      const sectionTarget='<section id="synthèse-de-la-séance" class="level1">';
      const appSection='<section id="comite-aquasmart" class="level1">\n<h1>11. Application — Comité d’investissement AquaSmart</h1>\n<p>Cette application met les étudiants en situation de comité d’investissement autour d’un projet de recyclage intelligent de l’eau. L’objectif est de comprendre, en cinq étapes simples, comment passer de la décision actuelle à la valeur de l’information puis à une recommandation managériale.</p>\n<div class="callout callout-style-default callout-note callout-titled"><div class="callout-header d-flex align-content-center"><div class="callout-icon-container"><i class="callout-icon"></i></div><div class="callout-title-container flex-fill">Déroulé conseillé</div></div><div class="callout-body-container callout-body"><p><strong>20 à 30 minutes, en groupes de 2 à 3.</strong> Les étudiants suivent cinq étapes : décider aujourd’hui, comprendre l’EVPI, évaluer l’EVSI d’un pilote, vérifier l’ENBS, puis formuler une recommandation de comité. Un mini-test de sensibilité permet d’identifier le coût maximal acceptable du pilote.</p></div></div>\n<p><a href="/Finance-Verte-Etudiants/seance5/comite-aquasmart/?v=20261004-toggle" target="_blank" class="btn btn-primary" role="button">Ouvrir l’application en plein écran</a></p>\n<div style="margin:1.2rem 0 2rem;border:1px solid #d8e0e8;border-radius:14px;overflow:hidden;background:#fff;"><iframe src="/Finance-Verte-Etudiants/seance5/comite-aquasmart/?v=20261004-toggle" title="Comité d’investissement AquaSmart" style="width:100%;height:1120px;border:0;display:block;" loading="lazy"></iframe></div>\n</section>\n';
      if(!html.includes('id="comite-aquasmart"')) html=html.replace(sectionTarget,appSection+sectionTarget);
      html=html.replace('<h1>11. Synthèse de la séance</h1>','<h1>12. Synthèse de la séance</h1>');
      html=html.replace('>11. Synthèse de la séance</a>','>12. Synthèse de la séance</a>');
      html=html.replace('<h1>12. Transition vers la séance 6</h1>','<h1>13. Transition vers la séance 6</h1>');
      html=html.replace('>12. Transition vers la séance 6</a>','>13. Transition vers la séance 6</a>');
    }

    if(url.pathname.startsWith('/Finance-Verte-Etudiants/seance5/comite-aquasmart/')){
      const toggleScript=`<script>
      window.reveal=function(id){
        const panel=document.getElementById(id);
        if(!panel) return;
        const isOpen=panel.classList.toggle('show');
        const btn=[...document.querySelectorAll('button[onclick]')].find(b=>{
          const a=b.getAttribute('onclick')||'';
          return a.includes("reveal('"+id+"')") || a.includes('reveal("'+id+'")');
        });
        if(btn){
          btn.textContent=isOpen?'Masquer la correction':'Afficher la correction';
          btn.setAttribute('aria-expanded',isOpen?'true':'false');
        }
      };
      </script>`;
      html=html.replace('</body>',toggleScript+'</body>');
    }

    if(url.pathname==='/Finance-Verte-Etudiants/seance6/' || url.pathname==='/Finance-Verte-Etudiants/seance6/index.html'){
      const tocTarget6='<li><a href="#synthèse-de-la-séance-et-du-module" id="toc-synthèse-de-la-séance-et-du-module" class="nav-link" data-scroll-target="#synthèse-de-la-séance-et-du-module">11. Synthèse de la séance et du module</a>';
      const tocInsert6='<li><a href="#revue-investissement-12-mois" id="toc-revue-investissement-12-mois" class="nav-link" data-scroll-target="#revue-investissement-12-mois">11. Application — Revue d’investissement à 12 mois</a></li>\n  '+tocTarget6;
      if(!html.includes('toc-revue-investissement-12-mois')) html=html.replace(tocTarget6,tocInsert6);
      const sectionTarget6='<section id="synthèse-de-la-séance-et-du-module" class="level1">';
      const appSection6='<section id="revue-investissement-12-mois" class="level1">\n<h1>11. Application — Comité de revue à 12 mois</h1>\n<p>Cette application clôt la séance 6 par une revue ex post d’un projet vert déjà engagé. Les étudiants doivent distinguer constat, attribution des écarts, coûts irrécupérables, valeur future et règles de pilotage.</p>\n<div class="callout callout-style-default callout-note callout-titled"><div class="callout-header d-flex align-content-center"><div class="callout-icon-container"><i class="callout-icon"></i></div><div class="callout-title-container flex-fill">Objectif</div></div><div class="callout-body-container callout-body"><p><strong>20 à 25 minutes.</strong> Cinq étapes : constater la sous-performance, en identifier les causes, recalculer la valeur pertinente aujourd’hui, choisir entre continuer/corriger/arrêter, puis fixer des seuils de suivi.</p></div></div>\n<p><a href="/Finance-Verte-Etudiants/seance6/revue-12-mois/?v=20261004" target="_blank" class="btn btn-primary" role="button">Ouvrir l’application en plein écran</a></p>\n<div style="margin:1.2rem 0 2rem;border:1px solid #d8e0e8;border-radius:14px;overflow:hidden;background:#fff;"><iframe src="/Finance-Verte-Etudiants/seance6/revue-12-mois/?v=20261004" title="Comité de revue à 12 mois" style="width:100%;height:1180px;border:0;display:block;" loading="lazy"></iframe></div>\n</section>\n';
      if(!html.includes('id="revue-investissement-12-mois"')) html=html.replace(sectionTarget6,appSection6+sectionTarget6);
      html=html.replace('<h1>11. Synthèse de la séance et du module</h1>','<h1>12. Synthèse de la séance et du module</h1>');
      html=html.replace('>11. Synthèse de la séance et du module</a>','>12. Synthèse de la séance et du module</a>');
    }

    const headers=new Headers(res.headers);
    headers.delete('content-length');
    headers.set('cache-control','no-store, no-cache, must-revalidate');
    return new Response(html,{status:res.status,statusText:res.statusText,headers});
  })());
});