/* Renders the inline sprites and stat pips in the page. Needs sprites.js first. */
(function(){
const {sprite}=window.AG;
/* --- inline sprites in the page --- */
document.querySelectorAll('canvas.spr').forEach(cv=>{ const s=sprite(cv.dataset.spr); const sc=+cv.dataset.scale||4; cv.width=s.width*sc; cv.height=s.height*sc; cv.style.width=cv.width+'px'; cv.style.height=cv.height+'px'; const x=cv.getContext('2d'); x.imageSmoothingEnabled=false; x.drawImage(s,0,0,cv.width,cv.height); });
document.querySelectorAll('.pips').forEach(p=>{ const n=+p.dataset.n; p.setAttribute('aria-label',n+' of 5'); for(let i=0;i<5;i++){ const d=document.createElement('i'); if(i<n) d.className='on'; p.appendChild(d);} });
})();
