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
  b.innerHTML=(limit?ns.slice(0,limit):ns).map(n=>`<div class="news"><div class="d">${n.date}<span class="tg tg-${n.tag}">${n.tag}</span></div>
   <h4>${n.title}</h4><p>${n.body}</p></div>`).join('');
}

function initials(name){
  const kr=(name.match(/[가-힣]+/)||[])[0];
  if(kr) return kr.length>2?kr.slice(1):kr;           // 성 제외한 이름
  const parts=name.replace(/\(.*?\)/g,'').trim().split(/\s+/);
  return (parts[0][0]+(parts[1]?parts[1][0]:'')).toUpperCase();
}
function avatar(x,size){
  const s=size||88;
  if(x.photo) return `<img class="avatar" src="${x.photo}" alt="${x.name}" width="${s}" height="${s}" loading="lazy">`;
  return `<span class="avatar ph" style="width:${s}px;height:${s}px;font-size:${Math.round(s*0.34)}px">${initials(x.name)}</span>`;
}

async function renderMembers(cur,alu,place){
  const m=await J('data/members.json');
  if($(cur))$(cur).innerHTML=m.current.map(x=>`<div class="card pcard"><span class="pill">${x.tag}</span>
   <div class="phead">${avatar(x,96)}<div class="pmeta"><h3>${x.name}</h3><b>${x.role}</b></div></div>
   <p>${x.topic}</p></div>`).join('');
  if($(alu))$(alu).innerHTML=m.alumni.map(x=>`<div class="card pcard alum">
   <div class="phead">${avatar(x,76)}<div class="pmeta"><h3>${x.name}</h3><b>${x.role}</b></div></div>
   <p>${x.topic}</p>${x.now?`<p class="now">현재 <b>${x.now}</b>${x.nowEn?` <span class="bi">${x.nowEn}</span>`:''}</p>`:''}</div>`).join('');
  if($(place)&&m.placements&&m.placements.length){
    $(place).innerHTML=m.placements.map(c=>`<div class="plc">
      ${c.logo?`<img src="${c.logo}" alt="${c.name}" loading="lazy">`:`<span class="plc-txt">${c.name}</span>`}
      <span class="plc-nm">${c.logo?c.name+(c.nameEn?' · '+c.nameEn:''):(c.nameEn||'')}</span></div>`).join('');
  }
}
async function renderAch(){
  const a=await J('data/achievements.json');
  const put=(s,arr)=>{const b=$(s);if(b)b.innerHTML='<ol class="pubs">'+arr.map((x,i)=>`<li>${x}</li>`).join('')+'</ol>';};
  put('#reg',a.registered);put('#filed',a.filed);put('#proc',a.proceedings);
  const g=$('#grants'); if(g)g.innerHTML='<ol class="pubs">'+a.awards.map(x=>`<li>${x.replace(/\*\*/g,'')}</li>`).join('')+'</ol>';
}
document.addEventListener('DOMContentLoaded',navActive);
const AGENCY={
 mist :{ko:"과학기술정보통신부",  ab:"과기정통부", en:"MSIT · NRF"},
 mfds :{ko:"식품의약품안전처",    ab:"식약처",     en:"MFDS · NIFDS"},
 motie:{ko:"산업통상자원부",      ab:"산업부",     en:"MOTIE"},
 mss  :{ko:"중소벤처기업부",      ab:"중기부",     en:"MSS · TIPA"},
 add  :{ko:"국방과학연구소",      ab:"국방과학연구소", en:"ADD"},
 corp :{ko:"기업 수탁",           ab:"기업",       en:"Industry"}};
const ROLE={
 lead:{ko:"연구책임자 (주관)",       en:"Principal Investigator"},
 co  :{ko:"공동연구개발기관 책임",   en:"Co-PI (JNU)"},
 part:{ko:"참여연구원",              en:"Participating researcher"}};

async function renderProjects(sel){
  const ps=await J('data/projects.json'); const b=document.querySelector(sel); if(!b)return;

  const used=[...new Set(ps.map(p=>p.ag))];
  const legend=`<div class="plegend">
    <div class="pl-row"><span class="pl-h">부처 · Funding agency</span>${
      used.map(a=>`<span class="ag-chip ag-${a}">${AGENCY[a].ab}<i>${AGENCY[a].en}</i></span>`).join('')}</div>
    <div class="pl-row"><span class="pl-h">역할 · Role</span>
      <span class="rl solid">책임 (주관·공동) </span>
      <span class="rl">참여</span></div></div>`;

  const filters=`<div class="pfilters" id="pfilt">
    <button class="on" data-f="all">전체 <span>${ps.length}</span></button>
    <button data-f="role:lead,co">책임과제 <span>${ps.filter(p=>p.role!=='part').length}</span></button>
    ${used.map(a=>`<button data-f="ag:${a}" class="fb-${a}">${AGENCY[a].ab} <span>${ps.filter(p=>p.ag===a).length}</span></button>`).join('')}
  </div>`;

  const card=p=>`<article class="pcard2 ag-${p.ag}" data-ag="${p.ag}" data-role="${p.role}">
    <div class="pc-bar"></div>
    <div class="pc-body">
      <div class="pc-tags">
        <span class="ag-chip ag-${p.ag}">${AGENCY[p.ag].ab}</span>
        <span class="rl ${p.role==='part'?'':'solid'} ag-${p.ag}">${p.roleLabel||ROLE[p.role].ko}</span>
        <span class="kind">${p.kind}</span>
        <span class="per">${p.period}</span>
      </div>
      <h3>${p.name}</h3>
      <p class="pc-ag"><b>${p.agency}</b> · ${p.program}</p>
      <p class="pc-goal"><b>연구목표.</b> ${p.goal}</p>
      <ul class="pc-list">${p.content.map(c=>`<li>${c}</li>`).join('')}</ul>
    </div></article>`;

  b.innerHTML=legend+filters+`<div id="plist">${ps.map(card).join('')}</div>`;

  const f=document.querySelector('#pfilt');
  f.addEventListener('click',e=>{
    const btn=e.target.closest('button'); if(!btn)return;
    f.querySelectorAll('button').forEach(x=>x.classList.remove('on')); btn.classList.add('on');
    const [k,v]=btn.dataset.f.split(':');
    document.querySelectorAll('#plist .pcard2').forEach(el=>{
      let show=true;
      if(k==='ag')   show = el.dataset.ag===v;
      if(k==='role') show = v.split(',').includes(el.dataset.role);
      el.style.display = show?'':'none';
    });
  });
}

/* ---------------- Gallery ---------------- */
let GAL=[], GIDX=0;
async function renderGallery(sel){
  const albums=await J('data/gallery.json'); const b=$(sel); if(!b)return;
  GAL=[]; albums.forEach(a=>a.items.forEach(it=>GAL.push({src:it.src,cap:a.title})));
  let k=0;
  b.innerHTML=albums.map(a=>{
    const cells=a.items.map(it=>{
      const i=k++;
      return `<button class="gcell" data-i="${i}" aria-label="${a.title}">
        <img src="${it.thumb}" alt="${a.title}" loading="lazy"></button>`;}).join('');
    return `<section class="galbum"><h3>${a.title} <span class="gn">${a.items.length}</span></h3>
      <div class="ggrid">${cells}</div></section>`;}).join('');
  b.addEventListener('click',e=>{const c=e.target.closest('.gcell'); if(c) openLB(+c.dataset.i);});
  const lb=$('#lb');
  if(lb){
    lb.querySelector('.lb-x').onclick=()=>{lb.hidden=true;document.body.style.overflow='';};
    lb.querySelector('.lb-p').onclick=e=>{e.stopPropagation();openLB(GIDX-1);};
    lb.querySelector('.lb-n').onclick=e=>{e.stopPropagation();openLB(GIDX+1);};
    lb.addEventListener('click',e=>{if(e.target===lb){lb.hidden=true;document.body.style.overflow='';}});
    document.addEventListener('keydown',e=>{
      if(lb.hidden)return;
      if(e.key==='Escape'){lb.hidden=true;document.body.style.overflow='';}
      if(e.key==='ArrowLeft')openLB(GIDX-1);
      if(e.key==='ArrowRight')openLB(GIDX+1);});
  }
}
function openLB(i){
  if(!GAL.length)return;
  GIDX=(i+GAL.length)%GAL.length;
  const lb=$('#lb'); if(!lb)return;
  $('#lbimg').src=GAL[GIDX].src;
  $('#lbcap').textContent=`${GAL[GIDX].cap}  ·  ${GIDX+1} / ${GAL.length}`;
  lb.hidden=false; document.body.style.overflow='hidden';
}
