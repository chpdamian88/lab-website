const $=(s,r=document)=>r.querySelector(s);
async function J(p){const r=await fetch(p);return r.json();}
function navActive(){document.querySelectorAll('.nav ul a').forEach(a=>{
  if(a.getAttribute('href')===location.pathname.split('/').pop()||(a.getAttribute('href')==='index.html'&&location.pathname.endsWith('/')))a.classList.add('active');});}
function pubLine(p){
  const d=p.doi?` <a class="doi" href="${p.doi}" target="_blank" rel="noopener">DOI</a>`:'';
  return `<li><span class="n">[${p.n}]</span> ${p.cite}.${d}</li>`;}
async function renderPubs(sel,limit){
  const ps=await J('data/publications.json');
  const box=$(sel); if(!box)return;
  const years=[...new Set(ps.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a);
  const list=limit?ps.slice(0,limit):ps;
  const f=$('#filters');
  if(f){f.innerHTML=`<button class="on" data-y="all">All (${ps.length})</button>`+
     years.map(y=>`<button data-y="${y}">${y}</button>`).join('');
    f.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
      f.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
      const y=b.dataset.y; const sel2=y==='all'?ps:ps.filter(p=>String(p.year)===y);
      box.innerHTML=sel2.map(pubLine).join('');});}
  box.innerHTML=list.map(pubLine).join('');
}
async function renderHighlights(sel){
  const hs=await J('data/highlights.json'); const b=$(sel); if(!b)return;
  b.innerHTML=hs.map(h=>`<article class="ga"><img src="${h.img}" alt="graphical abstract" loading="lazy">
   <div class="b"><span class="pill ${h.pillar==='DDS'?'dds':''}">${h.pillar==='DDS'?'Drug Delivery':'Formulation'}</span>
   <h4>${h.title}</h4><div class="v">${h.venue}</div>
   <div class="v"><a href="${h.doi}" target="_blank" rel="noopener">${h.doi.replace('https://','')}</a></div>
   <div class="c">${h.credit}</div></div></article>`).join('');
}
async function renderNews(sel,limit){
  const ns=await J('data/news.json'); const b=$(sel); if(!b)return;
  b.innerHTML=(limit?ns.slice(0,limit):ns).map(n=>`<div class="news"><div class="d">${n.date} · ${n.tag}</div>
   <h4>${n.title}</h4><p>${n.body}</p></div>`).join('');
}
async function renderMembers(cur,alu){
  const m=await J('data/members.json');
  if($(cur))$(cur).innerHTML=m.current.map(x=>`<div class="card"><span class="pill">${x.tag}</span>
   <h3>${x.name}</h3><p><b>${x.role}</b><br>${x.topic}</p></div>`).join('');
  if($(alu))$(alu).innerHTML=`<table><thead><tr><th>이름</th><th>구분</th><th>연구주제</th></tr></thead><tbody>`+
   m.alumni.map(x=>`<tr><td>${x.name}</td><td>${x.role}</td><td>${x.topic}</td></tr>`).join('')+`</tbody></table>`;
}
async function renderAch(){
  const a=await J('data/achievements.json');
  const put=(s,arr)=>{const b=$(s);if(b)b.innerHTML='<ol class="pubs">'+arr.map((x,i)=>`<li>${x}</li>`).join('')+'</ol>';};
  put('#reg',a.registered);put('#filed',a.filed);put('#proc',a.proceedings);
  const g=$('#grants'); if(g)g.innerHTML='<ol class="pubs">'+a.awards.map(x=>`<li>${x.replace(/\*\*/g,'')}</li>`).join('')+'</ol>';
}
document.addEventListener('DOMContentLoaded',navActive);
async function renderProjects(sel){
  const ps=await J('data/projects.json'); const b=document.querySelector(sel); if(!b)return;
  b.innerHTML=ps.map(p=>`<div class="card" style="margin-bottom:16px">
   <span class="pill">${p.role}</span>
   <h3>${p.name}</h3>
   <p style="color:var(--ink)"><b>${p.agency}</b> · ${p.program}<br><span style="color:var(--muted)">${p.period}</span></p>
   <p style="margin-top:10px;color:var(--ink)"><b>연구목표.</b> ${p.goal}</p>
   <ul style="color:var(--muted);font-size:13px;margin:8px 0 0;padding-left:18px">${p.content.map(c=>`<li>${c}</li>`).join('')}</ul>
  </div>`).join('');
}
