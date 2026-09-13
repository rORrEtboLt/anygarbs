/* AnyGarbs pixel-art palette, sprite grids and renderer. Shared by page.js and scene.js. */
const PAL={k:'#1a1c2c',t:'#3ec6b6',T:'#1f7f76',y:'#ffcd38',Y:'#d9931c',w:'#fff4d6',W:'#ffffff',g:'#9aa5b1',G:'#5d6873',r:'#d9534f',b:'#4a90d9',B:'#2b5fa8',n:'#8b5a2b',N:'#5a3a1b',l:'#6abe30',L:'#3f8f3a',p:'#e77fd0',o:'#f28c28',s:'#cfd8e0',v:'#8e6cd9',d:'#3b3f52',c:'#6fb0dc'};
const SPR={
bot:['....kk....','....ky....','..kkkkkk..','.kttttttk.','.ktyttytk.','.kttttttk.','.ktkkkktk.','..kkkkkk..','.kkttttkk.','.k.tyyt.k.','..kttttk..','..kk..kk..'],
bot2:['....kk....','....ky....','..kkkkkk..','.kttttttk.','.ktyttytk.','.kttttttk.','.ktkkkktk.','..kkkkkk..','.kkttttkk.','.k.tyyt.k.','..kttttk..','.kk....kk.'],
hauler:['..kkkkkkkk..','..kttyttyk..','.kkttttttkk.','.kkkkkkkkkk.','kGgGgGgGgGGk','kgGgGgGgGgGk','kGgGgGgGgGGk','.kkkkkkkkkk.'],
hauler2:['..kkkkkkkk..','..kttyttyk..','.kkttttttkk.','.kkkkkkkkkk.','kgGgGgGgGgGk','kGgGgGgGgGGk','kgGgGgGgGgGk','.kkkkkkkkkk.'],
drone:['kk.....kk','.kkkkkkk.','.kttyttk.','..kkkkk..','...k.k...'],
drone2:['.k.....k.','kkkkkkkkk','.kttyttk.','..kkkkk..','...k.k...'],
refiner:['..kk........','..kgk.......','..kgk.......','kkkkkkkkkkkk','kttttttttttk','ktkkkkkkkktk','ktkyyyyyyktk','ktkkkkkkkktk','kttrtttttttk','kkkkkkkkkkkk','.kk......kk.'],
trader:['kkkkkkkkkk','kddddddddk','kdtdtddddk','kddtdtdddk','kdtdtddddk','kddddddddk','kkkkkkkkkk','...kkkk...','..kkkkkk..','.kkkkkkkk.'],
bottle:['...kk...','...kbk..','..kbbbk.','..kbbbk.','..kbBbk.','..kbbbk.','..kbbbk.','...kkk..'],
can:['..kkkk..','.kssssk.','.ksrrsk.','.krrrrk.','.krrrrk.','.ksrrsk.','.kssssk.','..kkkk..'],
banana:['........','.kk.....','.kyk....','..kyk...','..kyyk..','...kyyk.','....kyyk','.....kkk'],
paper:['.kkkkk..','.kwwwkk.','.kwgwwk.','.kwwwwk.','.kwgwwk.','.kwwwwk.','.kkkkkk.','........'],
phone:['..kkkk..','..kddk..','..kbbk..','..kbbk..','..kbbk..','..kddk..','..kkkk..','........'],
compost:['....l...','...klk..','..kkkkk.','.knnnnnk','.knNnnnk','.knnnNnk','.knnnnnk','..kkkkk.'],
gas:['...ro...','...oy...','..kkkk..','..kttk..','..kTtk..','..kttk..','..kttk..','..kkkk..'],
pellet:['........','.kk..kk.','kppkkppk','kppkkppk','.kk..kk.','...kk...','..kppk..','...kk...'],
pulp:['........','.kkkkkk.','.kwwwwk.','.kkkkkk.','.kggggk.','.kkkkkk.','.kwwwwk.','.kkkkkk.'],
ingot:['........','........','..kkkk..','.ksWssk.','kssssssk','kkkkkkkk','........','........'],
gold:['........','........','..kkkk..','.kyWyyk.','kyyyyYyk','kkkkkkkk','........','........'],
copper:['........','.kkkkkk.','kooooook','kokkkkok','kokoooko','kokkkkok','kooooook','.kkkkkk.'],
rare:['...kk...','..kvvk..','..kvWk..','.kvvvvk.','.kvvvvk.','..kvvk..','...kk...','........'],
silver:['..kkkk..','.kssssk.','ksWssssk','ksssgssk','kssgsssk','kssssssk','.kssssk.','..kkkk..'],
coin:['.kkkk.','kyyYyk','kyWyYk','kyyyYk','kyYYYk','.kkkk.'],
cloud:['.....cccc.......','...ccWWWWcc.....','.ccWWWWWWWWccc..','cWWWWWWWWWWWWWc.','cWWWWWWWWWWWWWWc','.cccccccccccccc.'],
tree:['....kkkk....','...kLllLk...','..kLllllLk..','.kLlllllllk.','.klllLllllk.','.kLlllllLlk.','..kllLlllk..','...kkkkkk...','....kNnk....','....kNnk....','....kNnk....','....kNnk....','...kkNnkk...','....kkkk....'],
crate:['kkkkkkkkkkkk','knnnnnnnnnnk','knNnnnnnnNnk','knnNnnnnNnnk','knnnNnnNnnnk','knnnnNNnnnnk','knnnNnnNnnnk','knnNnnnnNnnk','knNnnnnnnNnk','kkkkkkkkkkkk'],
sun:['...YYY...','..YyyyY..','.YyyyyyY.','YyyyWyyyY','YyyWWWyyY','YyyyWyyyY','.YyyyyyY.','..YyyyY..','...YYY...']
};
const cache={};

function sprite(name){ if(cache[name]) return cache[name]; const rows=SPR[name]; const c=document.createElement('canvas'); c.width=rows[0].length; c.height=rows.length; const x=c.getContext('2d'); rows.forEach((r,j)=>{ for(let i=0;i<r.length;i++){ const ch=r[i]; if(ch==='.') continue; x.fillStyle=PAL[ch]; x.fillRect(i,j,1,1);} }); cache[name]=c; return c; }

window.AG={PAL,SPR,sprite};
