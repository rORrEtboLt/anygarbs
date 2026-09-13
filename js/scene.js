/* The hero game screen: drones, hauler, sorter machine, belts and crates. Needs sprites.js first. */
(function(){
const {sprite}=window.AG;
const cv=document.getElementById('scene'); const ctx=cv.getContext('2d');
const H=176; let W=384, scale=1, mx=192, cx=314, belt2Tree=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function rnd(seed){ let s=seed>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
const dots=[]; { const r=rnd(7); for(let i=0;i<260;i++) dots.push([Math.floor(r()*900),122+Math.floor(r()*54)]); }
const KINDS=['bottle','can','banana','paper','phone'];
const MAT={bottle:'pellet',can:'ingot',banana:'compost',paper:'pulp'}; const EWASTE=['gold','copper','rare','silver']; let eIdx=0;
function pileTop(x){ const u=(x-52)/46; if(Math.abs(u)>=1) return 122; return 122-34*Math.sqrt(1-u*u); }
const pileItems=[]; { const r=rnd(3); for(let i=0;i<18;i++){ const x=14+Math.floor(r()*66); const top=pileTop(x+4); const y=Math.floor(top+1+r()*Math.max(1,(114-top-8))); pileItems.push([KINDS[Math.floor(r()*5)],x,y]); } }
let items=[], outs=[], queue=[], falling=[], puffs=[], stock=['ingot','compost','pellet','gold'], spawnT=0, puffT=0, flash=0, t=0, last=0;
const drones=[{i:0,off:0,prev:0},{i:1,off:0.37,prev:0},{i:2,off:0.71,prev:0}];

function layout(){ const box=cv.parentElement.clientWidth||384; scale=Math.max(1,Math.floor(box/360)); W=Math.max(320,Math.floor(box/scale)); cv.width=W; cv.height=H; cv.style.width=(W*scale)+'px'; cv.style.height=(H*scale)+'px'; ctx.imageSmoothingEnabled=false; mx=Math.round(W*0.5); cx=W-70; belt2Tree=(cx-6)-(mx+44)>=64; items=[]; outs=[]; queue=[]; }
function rect(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
function put(name,x,y,flip){ const s=sprite(name); x=Math.round(x); y=Math.round(y); if(flip){ ctx.save(); ctx.translate(x+s.width,y); ctx.scale(-1,1); ctx.drawImage(s,0,0); ctx.restore(); } else ctx.drawImage(s,x,y); }
function mound(cx0,cy,rx,ry,c){ for(let dy=-ry;dy<=0;dy++){ const hw=Math.round(rx*Math.sqrt(1-(dy*dy)/(ry*ry))); rect(cx0-hw,cy+dy,hw*2,1,c);} }

function step(dt){
  t+=dt; spawnT+=dt; puffT+=dt; flash=Math.max(0,flash-dt);
  if(spawnT>1.7){ spawnT=0; items.push({kind:KINDS[Math.floor(Math.random()*5)],x:94,y:108}); }
  for(const it of items) it.x+=22*dt;
  items=items.filter(it=>{ if(it.x>=mx-6){ queue.push({kind:it.kind,t:t}); return false;} return true; });
  if(queue.length && t-queue[0].t>=0.9){ const q=queue.shift(); let m=MAT[q.kind]; if(!m){ m=EWASTE[eIdx++%4]; } outs.push({mat:m,x:mx+44,y:108,fall:false}); }
  for(const o of outs){ if(!o.fall){ o.x+=22*dt; if(o.x>=cx-12) o.fall=true; } else { o.y+=36*dt; } }
  outs=outs.filter(o=>{ if(o.fall&&o.y>=112){ stock.push(o.mat); if(stock.length>9) stock.shift(); flash=0.35; return false;} return true; });
  for(const d of drones){ const p=((t*0.09)+d.off)%1; if(d.prev<0.5&&p>=0.5){ falling.push({kind:KINDS[d.i%5],x:46,y:36+d.i*9+6}); } d.prev=p; }
  for(const f of falling) f.y+=40*dt;
  falling=falling.filter(f=>f.y<pileTop(f.x+4)-4);
  if(puffT>0.55){ puffT=0; puffs.push({x:mx+35,y:78,life:0}); }
  for(const p of puffs){ p.life+=dt; p.y-=9*dt; p.x+=2.5*dt; }
  puffs=puffs.filter(p=>p.life<2.2);
}

function draw(){
  rect(0,0,W,40,'#6fb6e6'); rect(0,40,W,40,'#8fcbef'); rect(0,80,W,32,'#b3ddf5'); rect(0,112,W,10,'#cfeaf8');
  put('sun',W-42,12);
  const cl=[[10,14],[150,30],[270,18]]; cl.forEach((c,i)=>{ const x=((c[0]+t*(4+i))%(W+40))-20; put('cloud',x,c[1]); });
  mound(W*0.28,122,96,20,'#5fae48'); mound(W*0.72,122,120,16,'#5fae48'); mound(W*0.5,122,60,24,'#4f9a3f');
  rect(0,122,W,H-122,'#6abe30'); rect(0,122,W,2,'#8ad64a');
  ctx.fillStyle='#54a324'; for(const d of dots){ if(d[0]<W) ctx.fillRect(d[0],d[1],2,1); }
  rect(96,124,cx-96+40,3,'#8b5a2b');
  put('tree',W-24,108); if(belt2Tree) put('tree',mx+58,108);
  /* pile */
  mound(52,122,46,34,'#5c5d69'); mound(52,122,43,31,'#767786'); mound(52,122,38,26,'#8a8b99');
  for(const it of pileItems) put(it[0],it[1],it[2]);
  rect(52,76,1,12,'#1a1c2c'); rect(53,76,6,3,'#d9534f'); rect(53,79,4,1,'#d9534f');
  /* belts */
  const belt=(x0,x1)=>{ rect(x0,116,x1-x0,8,'#1a1c2c'); rect(x0+1,117,x1-x0-2,6,'#5d6873'); ctx.fillStyle='#9aa5b1'; const off=(t*22)%6; for(let sx=x0+2+off;sx<x1-3;sx+=6) ctx.fillRect(Math.round(sx),118,2,4); };
  belt(96,mx); belt(mx+44,cx-6);
  /* machine */
  rect(mx,92,44,32,'#1a1c2c'); rect(mx+2,94,40,28,'#3ec6b6'); rect(mx+2,94,40,3,'#1f7f76');
  rect(mx-1,110,6,10,'#1a1c2c'); rect(mx+39,110,6,10,'#1a1c2c');
  rect(mx+5,101,34,8,'#1a1c2c'); const gp=queue.length?Math.min(1,(t-queue[0].t)/0.9):0; rect(mx+7,103,Math.round(30*gp),4,'#ffcd38');
  const lit=Math.floor(t*4)%3; [['#d9534f',mx+8],['#ffcd38',mx+14],['#6abe30',mx+20]].forEach((l,i)=>{ rect(l[1],96,4,4,'#1a1c2c'); rect(l[1]+1,97,2,2,lit===i?l[0]:'#3b3f52'); });
  rect(mx+30,96,10,5,'#1a1c2c'); rect(mx+31,97,8,3,'#fff4d6');
  rect(mx+33,78,6,15,'#1a1c2c'); rect(mx+34,79,4,13,'#5d6873');
  for(const p of puffs){ const s=p.life<0.8?2:3; rect(p.x,p.y,s,s,p.life<1.4?'#cfd8e0':'#e6ecf0'); }
  put(Math.sin(t*3)>0?'bot':'bot2',mx+4,80+Math.round(Math.sin(t*2.5)));
  /* hauler */
  const hx=78+9*(0.5+0.5*Math.sin(t*1.4)); const hdir=Math.cos(t*1.4)>=0; put((Math.floor(t*8)%2)?'hauler':'hauler2',hx,114,!hdir);
  for(const it of items) put(it.kind,it.x,it.y);
  for(const o of outs) put(o.mat,o.x,o.y);
  for(const f of falling) put(f.kind,f.x,f.y);
  /* crates + stock */
  put('crate',cx,112); put('crate',cx+16,112);
  stock.forEach((m,i)=>{ put(m,cx+(i%3)*9+2,102-Math.floor(i/3)*8); });
  rect(cx+38,102,2,20,'#1a1c2c'); rect(cx+32,92,14,11,'#1a1c2c'); rect(cx+33,93,12,9,flash>0?'#ffcd38':'#fff4d6'); put('coin',cx+36,94);
  /* drones */
  for(const d of drones){ const p=((t*0.09)+d.off)%1; let x,y; if(p<0.5){ x=-12+(p/0.5)*58; y=36+d.i*9+Math.round(Math.sin(t*4+d.i)); put(KINDS[d.i%5],x,y+5); } else { x=46-((p-0.5)/0.5)*58; y=26+d.i*9+Math.round(Math.sin(t*4+d.i)); } put((Math.floor(t*14)%2)?'drone':'drone2',x,y); }
}

function frame(now){ const dt=Math.min(0.05,(now-last)/1000||0.016); last=now; step(dt); draw(); requestAnimationFrame(frame); }
layout(); addEventListener('resize',()=>{ layout(); draw(); });
for(let i=0;i<300;i++) step(1/30);
if(reduced){ draw(); } else { requestAnimationFrame(now=>{ last=now; frame(now); }); }
})();
