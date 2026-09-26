self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode!=='navigate') return;
  const url=new URL(req.url);
  if(!/\/Finance-Verte-Etudiants\/(?:seance[1-6]|evaluation-finale)\//.test(url.pathname)) return;
  event.respondWith((async()=>{
    const res=await fetch(req);
    const type=res.headers.get('content-type')||'';
    if(!type.includes('text/html')) return res;
    let html=await res.text();
    const theme='<link rel="stylesheet" href="/Finance-Verte-Etudiants/course-theme.css">';
    const bar='<div class="course-topbar"><div class="brand"><span class="dot"></span><a href="/Finance-Verte-Etudiants/">Finance Verte — Badr ABOUFARASSE</a></div><div class="navlinks"><a href="/Finance-Verte-Etudiants/seance1/">Séance 1</a><a href="/Finance-Verte-Etudiants/seance2/">Séance 2</a><a href="/Finance-Verte-Etudiants/seance3/">Séance 3</a><a href="/Finance-Verte-Etudiants/seance4/">Séance 4</a><a href="/Finance-Verte-Etudiants/seance5/">Séance 5</a><a href="/Finance-Verte-Etudiants/seance6/">Séance 6</a><a href="/Finance-Verte-Etudiants/evaluation-finale/">Évaluation finale</a><a href="/Finance-Verte-Etudiants/">Accueil</a></div></div>';
    html=html.replace('</head>',theme+'</head>').replace(/<body([^>]*)>/i,'<body$1>'+bar);
    const headers=new Headers(res.headers);
    headers.delete('content-length');
    return new Response(html,{status:res.status,statusText:res.statusText,headers});
  })());
});