/* Crime scene engine, shared by every room of the main case (r1 to r9).
   Built from the approved sample room (The Study at Penrose House).
   Each room folder holds a small room.js that sets the room's data and calls CM.start(ROOM).

   ROOM fields used here:
     code, title, subtitle, loading, intro{kicker,heading,paras[],button,paper,sound}
     view{pos:[x,y,z], yaw, pitch}
     build(K)            makes the furniture with the kit K (boxes and canvas textures)
     tick(t, K)          optional per-frame animation
     clues{id:{name,look,prompt,hint,hot:[[x0,y0,x1,y1]],draw(g,w,h,K,open),kicker,title,html,note,at,size,reveal,clip,playLabel,requires}}
     extras{id:{night,name,look,prompt,hint,hot,draw,text,at,size,reveal,requires}}   one room-only clue per night, never needed
     decoys{id:{name,look,close,at,size}}
     star{at,rot,scale,size,seek}   the small gold star of The Hidden Case (clue text in assets/star.js)
     answer{at,size}                r9 only: the empty top of the great tree, where The Hidden Case is answered
     onSolved(K)                    r9 only: the ending in the room
     clips{id:{kind:'phone'|'radio'|'music'|'voice',speaker,text,say,voice{pitch,rate},tune}}
     AUDIO_FILES{clipId:'file.mp3'}  recorded voices in ../../audio/ (played if the file exists; else the device voice)
*/
(function(){
'use strict';
const CM = window.CM = window.CM || {};
const LS = CM.LS = {
  get(k, d){ try { const v = localStorage.getItem('cm.' + k); return v == null ? d : JSON.parse(v); } catch(e){ return d; } },
  set(k, v){ try { localStorage.setItem('cm.' + k, JSON.stringify(v)); } catch(e){} },
};
CM.start = function(R){ requestAnimationFrame(()=>setTimeout(()=>{ try { init(R); } catch(e){ fail(e); } }, 30)); };
function fail(e){
  console.error(e);
  const l = document.getElementById('loading');
  if (l){ l.style.display = 'flex'; l.innerHTML = 'This crime scene could not open in this browser.<br><br>Try another browser, or carry on in your book: the whole case works on paper.'; }
}
function rnd(a, b){ return a + Math.random() * (b - a); }

// ======================================================================
function init(R){
const T = THREE;
const CASE = window.CM_CASE || { suspects:[], rooms:[] };
const SUSPECTS = R.suspects || CASE.suspects;
const CLUES = R.clues, DECOYS = R.decoys || {}, EXTRAS = R.extras || {}, CLIPS = R.clips || {};
const STARS = window.CM_STAR || null;                       // The Hidden Case: The Missing Star (assets/star.js)
const STAR = (R.star && STARS) ? R.star : null, ANSWER = (R.answer && STARS) ? R.answer : null;
const clueIds = Object.keys(CLUES), extraIds = Object.keys(EXTRAS);
const found = new Set((LS.get('found.' + R.code, [])).filter(id => CLUES[id]));
const xfound = new Set((LS.get('extra.' + R.code, [])).filter(id => EXTRAS[id]));
const cleared = new Set(LS.get('cleared', []));
let starFound = !!LS.get('star.' + R.code, false);
let markersOn = false;
const nightName = n => (n === 0 ? 'the Practice Night' : 'Night ' + n);

// ---------- page ----------
const I = R.intro;
document.body.insertAdjacentHTML('beforeend', `
<div id="stage"></div>
<div class="bar"><a class="home" href="../../" aria-label="All crime scenes" title="All crime scenes">&#8962;</a><div class="title">${R.title}<small>${R.subtitle}</small></div><div class="count" id="count">Clues 0 / ${clueIds.length}</div></div>
<div class="hint" id="hint">Drag to look around · Tap anything to look at it</div>
<div class="label" id="label"></div>
<div class="tools">
  <button id="btnNotes">Case notes</button>
  <button id="btnSuspects">Suspects</button>
  <button id="btnMarkers">Show clue markers</button>
  ${STAR ? '<button id="btnStar" class="gold">Gold star?</button>' : ''}
</div>
<div class="modal intro open" id="intro"><div class="card">
  <div class="kicker">${I.kicker}</div>
  <h1>${I.heading}</h1>
  ${I.paras.map(p => `<p>${p}</p>`).join('')}
  <p style="font-size:13.5px"><b>${SUSPECTS.length} suspects. ${clueIds.length} clues hidden in this room.</b> Tap anything to look at it. If something seems wrong, <b>look closer</b> and find the detail that gives it away. Not everything is a clue.</p>
  ${extraIds.length === 1 ? '<p style="font-size:13px">There is also <b>one extra clue</b> that is only in this room. You never need it: you can solve the night without it.</p>' : ''}
  ${extraIds.length > 1 ? `<p style="font-size:13px">There are also <b>${extraIds.length} extra clues</b>, one for each night, that are only in this room. You never need them: you can solve every night without them.</p>` : ''}
  ${STAR ? '<p style="font-size:13px">A small <b>gold star</b> is hidden here too, for The Hidden Case at the back of your book.</p>' : ''}
  <div class="row" style="justify-content:center"><button class="primary" id="enter">${I.button}</button></div>
  <div class="paper">${I.paper || 'The whole mystery also works on paper: everything you need for the 24 nights is printed in your book. Only The Hidden Case needs the rooms.'}</div>
  <p style="font-size:12px;opacity:.7;margin-top:10px">${I.sound || 'Sound on: some clues are things you hear. The words are always shown too.'}</p>
</div></div>
<div class="modal" id="modal"><div class="card" id="modalCard"></div></div>`);

// ---------- renderer ----------
const stage = document.getElementById('stage');
const renderer = new T.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = T.sRGBEncoding;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = R.exposure || 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
const scene = new T.Scene();
scene.background = new T.Color(R.bg || 0x0b0806);
const camera = new T.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 80);
const V = R.view || {};
camera.position.set(...(V.pos || [0, 1.6, 0.5]));

// ---------- kit: textures, materials, shapes ----------
function canvasTex(w, h, draw, repeat){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4;
  if (repeat){ t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}
const M = o => new T.MeshStandardMaterial(o);
const colCache = {};
function col(hex, rough, metal){ const k = hex + '|' + rough + '|' + metal; return colCache[k] || (colCache[k] = M({ color:hex, roughness:rough === undefined ? .7 : rough, metalness:metal || 0 })); }
function box(w, h, d, mat, x, y, z, cast = true, parent){ const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; (parent || scene).add(m); return m; }
function cyl(rt, rb, h, mat, x, y, z, seg = 20, parent){ const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || scene).add(m); return m; }
function sph(r, mat, x, y, z, parent, seg = 12){ const m = new T.Mesh(new T.SphereGeometry(r, seg, Math.max(6, seg - 4)), mat); m.position.set(x, y, z); m.castShadow = true; (parent || scene).add(m); return m; }
function plane(w, h, mat, x, y, z, rx = 0, ry = 0, rz = 0, parent){ const m = new T.Mesh(new T.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.receiveShadow = true; (parent || scene).add(m); return m; }
function grp(x = 0, y = 0, z = 0, ry = 0, parent){ const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; (parent || scene).add(g); return g; }
function texMat(w, h, draw, opts){ return M(Object.assign({ map:canvasTex(w, h, draw), roughness:.85 }, opts || {})); }

// ---- 2D drawing helpers (used by textures and by the close-up drawings) ----
const D = {
  wood(g, w, h, base, n){ g.fillStyle = base || '#5a3620'; g.fillRect(0, 0, w, h); for (let i = 0; i < (n || 60); i++){ g.strokeStyle = `rgba(20,10,4,${rnd(.05, .2)})`; g.lineWidth = rnd(1, 3); g.beginPath(); const y = rnd(0, h); g.moveTo(0, y); g.bezierCurveTo(w * .3, y + rnd(-8, 8), w * .7, y + rnd(-8, 8), w, y + rnd(-6, 6)); g.stroke(); } },
  planks(g, w, h, base, n){ const k = n || 6; for (let i = 0; i < k; i++){ const y = i * h / k; const v = rnd(-14, 14); g.fillStyle = shade(base || '#6a4526', v); g.fillRect(0, y, w, h / k); for (let j = 0; j < 14; j++){ g.strokeStyle = `rgba(30,15,5,${rnd(.05, .16)})`; g.lineWidth = rnd(.6, 2); g.beginPath(); const yy = y + rnd(2, h / k - 2); g.moveTo(0, yy); g.bezierCurveTo(w * .3, yy + rnd(-3, 3), w * .6, yy + rnd(-3, 3), w, yy + rnd(-3, 3)); g.stroke(); } g.fillStyle = 'rgba(15,8,2,.55)'; g.fillRect(0, y, w, 2); } },
  paper(g, x, y, w, h, c, rot){ g.save(); if (rot){ g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-x - w / 2, -y - h / 2); } g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 18; g.fillStyle = c || '#f8f0dc'; g.fillRect(x, y, w, h); g.restore(); },
  text(g, lines, x, y, lh, font, color, align){ g.save(); g.font = font; g.fillStyle = color || '#202020'; g.textAlign = align || 'left'; g.textBaseline = 'top'; lines.forEach((t, i) => g.fillText(t, x, y + i * lh)); g.restore(); },
  rr(g, x, y, w, h, r){ g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); },
  star(g, cx, cy, r, inner){ g.beginPath(); for (let i = 0; i < 10; i++){ const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * (inner || .45) : r; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); },
  clockFace(g, cx, cy, R, hh, mm, o){
    o = o || {}; g.fillStyle = o.face || '#f3ead2'; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill(); g.strokeStyle = o.rim || '#c9993f'; g.lineWidth = Math.max(3, R * .07); g.stroke();
    g.fillStyle = '#2a1d14'; g.font = `bold ${Math.round(R * .2)}px Georgia`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const nums = o.arabic ? ['12','1','2','3','4','5','6','7','8','9','10','11'] : ['XII','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI'];
    for (let i = 0; i < 12; i++){ const a = i * Math.PI / 6 - Math.PI / 2; g.fillText(nums[i], cx + Math.cos(a) * R * .78, cy + Math.sin(a) * R * .78); }
    for (let i = 0; i < 60; i++){ if (i % 5 === 0) continue; const a = i * Math.PI / 30; g.fillRect(cx + Math.cos(a) * R * .93 - 1, cy + Math.sin(a) * R * .93 - 1, 2, 2); }
    const hand = (ang, len, wid) => { g.save(); g.translate(cx, cy); g.rotate(ang); g.fillStyle = '#1a120c'; g.fillRect(-wid / 2, -len, wid, len + wid); g.restore(); };
    hand((hh % 12 + mm / 60) / 12 * Math.PI * 2, R * .5, Math.max(3, R * .07)); hand(mm / 60 * Math.PI * 2, R * .74, Math.max(2, R * .04));
    g.fillStyle = '#1a120c'; g.beginPath(); g.arc(cx, cy, R * .05, 0, Math.PI * 2); g.fill();
    if (o.crack){ g.strokeStyle = 'rgba(70,70,70,.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - R * .7, cy - R * .45); g.lineTo(cx - R * .05, cy + R * .1); g.lineTo(cx + R * .25, cy + R * .75); g.moveTo(cx - R * .05, cy + R * .1); g.lineTo(cx + R * .7, cy - R * .15); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(cx - R * .35, cy - R * .4, R * .25, R * .12, -0.6, 0, Math.PI * 2); g.fill(); g.textAlign = 'left';
  },
  // a boot print seen from above; heel at +y. o.nick puts a V notch in the heel edge
  bootPrint(g, cx, cy, s, rot, o){
    o = o || {}; g.save(); g.translate(cx, cy); g.rotate(rot || 0); g.scale(s, s);
    g.fillStyle = o.fill || 'rgba(120,140,170,.55)';
    g.beginPath(); g.moveTo(-30, -40); g.quadraticCurveTo(-34, -100, 0, -104); g.quadraticCurveTo(36, -100, 32, -40); g.quadraticCurveTo(30, -10, 22, 4); g.lineTo(-20, 4); g.quadraticCurveTo(-30, -10, -30, -40); g.fill();
    g.beginPath(); g.moveTo(-22, 22); g.lineTo(22, 22); g.quadraticCurveTo(26, 62, 0, 66); g.quadraticCurveTo(-26, 62, -22, 22); g.fill();
    g.strokeStyle = o.tread || 'rgba(60,75,100,.55)'; g.lineWidth = 3;
    for (let i = 0; i < 6; i++){ g.beginPath(); g.moveTo(-24, -88 + i * 15); g.lineTo(24, -88 + i * 15); g.stroke(); }
    for (let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(-16, 32 + i * 10); g.lineTo(16, 32 + i * 10); g.stroke(); }
    if (o.nick){ g.fillStyle = o.snow || '#eef3f8'; g.beginPath(); g.moveTo(-8, 66.5); g.lineTo(0, 46); g.lineTo(8, 66.5); g.closePath(); g.fill(); }
    g.restore();
  },
  // the little gold star of The Hidden Case, drawn flat (cx, cy, radius)
  goldStar(g, cx, cy, r){ g.save(); const gr = g.createRadialGradient(cx - r * .3, cy - r * .35, r * .08, cx, cy, r); gr.addColorStop(0, '#fff4c2'); gr.addColorStop(.45, '#f0c247'); gr.addColorStop(1, '#8a5a10'); g.fillStyle = gr; D.star(g, cx, cy, r, .46); g.strokeStyle = 'rgba(110,70,10,.7)'; g.lineWidth = Math.max(1.5, r * .05); g.stroke(); g.restore(); },
  snow(g, w, h){ const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#dfe7f1'); gr.addColorStop(1, '#f4f7fb'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++){ g.fillStyle = `rgba(255,255,255,${rnd(.4, .9)})`; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); g.fillStyle = `rgba(160,180,205,${rnd(.08, .2)})`; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); } },
  night(g, w, h, top, bottom){ const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top || '#0c1426'); gr.addColorStop(1, bottom || '#33415e'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++){ g.fillStyle = `rgba(255,255,255,${rnd(.3, .9)})`; g.fillRect(rnd(0, w), rnd(0, h * .55), 1.5, 1.5); } },
};
function shade(hex, v){ const n = parseInt(hex.slice(1), 16); const r = Math.max(0, Math.min(255, (n >> 16) + v)), gg = Math.max(0, Math.min(255, ((n >> 8) & 255) + v)), b = Math.max(0, Math.min(255, (n & 255) + v)); return `rgb(${r|0},${gg|0},${b|0})`; }
D.shade = shade;

const woodTex = canvasTex(512, 512, (g, w, h) => D.planks(g, w, h, '#6a4526', 8), [3, 3]);
const mats = {
  floor: M({ map:woodTex, roughness:.65 }),
  dark: col(0x3b2414, .6), wood: col(0x6b4423, .55), brass: M({ color:0xc9993f, roughness:.35, metalness:.8 }),
  gold: M({ color:0xe2b33c, roughness:.22, metalness:.9, emissive:0x3a2600, emissiveIntensity:.35 }),
  paper: col(0xf2e8d0, .9), white: col(0xe9e1cf, .6), snow: col(0xffffff, .95), iron: M({ color:0x2a2a2c, roughness:.5, metalness:.6 }),
  glass: new T.MeshPhysicalMaterial({ color:0xbfd4ee, transparent:true, opacity:.16, roughness:.05, metalness:0 }),
  red: col(0xb3241f, .55), green: col(0x1f4a2a, .85), black: col(0x151515, .35),
};

// ---- room shell with wall openings (windows) ----
const SH = { W:8, D:7, H:3.2 };
const SIDES = () => ({ back:{ len:SH.W, x:0, z:-SH.D / 2, ry:0, s:1 }, front:{ len:SH.W, x:0, z:SH.D / 2, ry:Math.PI, s:-1 }, left:{ len:SH.D, x:-SH.W / 2, z:0, ry:Math.PI / 2, s:-1 }, right:{ len:SH.D, x:SH.W / 2, z:0, ry:-Math.PI / 2, s:1 } });
// position on a wall: u = world x (back/front) or world z (left/right); off = distance into the room
function wallGroup(side, u, off, parent){ const S = SIDES()[side]; const g = new T.Group(); g.rotation.y = S.ry; const lx = S.s * u; g.position.set(S.x, 0, S.z); g.translateX(lx); g.translateZ(off || 0); (parent || scene).add(g); return g; }
function wallPlane(x0, x1, y0, y1, mat, tileW, tileH, parent){
  const w = x1 - x0, h = y1 - y0; if (w <= 0.001 || h <= 0.001) return;
  const geo = new T.PlaneGeometry(w, h); const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++){ uv.setXY(i, (x0 + uv.getX(i) * w) / tileW, (y0 + uv.getY(i) * h) / tileH); }
  const m = new T.Mesh(geo, mat); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); m.receiveShadow = true; parent.add(m); return m;
}
function shell(s){
  SH.W = s.w; SH.D = s.d; SH.H = s.h; const H = s.h, dado = s.dado === undefined ? 1.05 : s.dado;
  const floorMat = s.floorMat || mats.floor;
  const fl = new T.Mesh(new T.PlaneGeometry(s.w, s.d), floorMat); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; scene.add(fl);
  if (s.ceil !== false){ const c = new T.Mesh(new T.PlaneGeometry(s.w, s.d), s.ceilMat || M({ color:0xd8cdb6, roughness:1 })); c.rotation.x = Math.PI / 2; c.position.y = H; scene.add(c);
    if (s.beams) for (let x = -s.w / 2 + s.beams; x < s.w / 2 - .2; x += s.beams) box(0.22, 0.2, s.d, s.beamMat || mats.dark, x, H - 0.1, 0, false); }
  const wallMat = s.wallMat, panelMat = s.panelMat || s.wallMat;
  const tw = s.wallTile || [1.3, 1.3], tp = s.panelTile || [1.6, dado];
  const sides = SIDES();
  for (const side of Object.keys(sides)){
    const S = sides[side]; if (s.skip && s.skip.includes(side)) continue;
    const g = new T.Group(); g.position.set(S.x, 0, S.z); g.rotation.y = S.ry; scene.add(g);
    const ops = ((s.open && s.open[side]) || []).map(o => { const c = S.s * o.u; return { x0:c - o.w / 2, x1:c + o.w / 2, b:o.b, t:o.t }; }).sort((a, b) => a.x0 - b.x0);
    const piece = (x0, x1, y0, y1) => {
      if (y0 < dado) wallPlane(x0, x1, y0, Math.min(y1, dado), panelMat, tp[0], tp[1], g);
      if (y1 > dado) wallPlane(x0, x1, Math.max(y0, dado), y1, wallMat, tw[0], tw[1], g);
    };
    let cur = -S.len / 2;
    for (const o of ops){ piece(cur, o.x0, 0, H); piece(o.x0, o.x1, 0, o.b); piece(o.x0, o.x1, o.t, H); cur = o.x1; }
    piece(cur, S.len / 2, 0, H);
    // dado rail and skirting, broken where a window crosses them
    const trim = s.trimMat || mats.dark;
    const segs = (yy) => { let a = -S.len / 2; const out = []; for (const o of ops){ if (yy > o.b && yy < o.t){ out.push([a, o.x0]); a = o.x1; } } out.push([a, S.len / 2]); return out; };
    if (s.rail !== false && dado > 0) for (const [a, b] of segs(dado)){ if (b - a > .02){ const r = new T.Mesh(new T.BoxGeometry(b - a, 0.06, 0.05), trim); r.position.set((a + b) / 2, dado + .01, 0.02); g.add(r); } }
    if (s.skirt !== false) for (const [a, b] of segs(0.07)){ if (b - a > .02){ const r = new T.Mesh(new T.BoxGeometry(b - a, 0.14, 0.04), trim); r.position.set((a + b) / 2, 0.07, 0.02); g.add(r); } }
  }
}
// window frame in a wall opening; o: {side,u,w,b,t, frame, sill, snow, open (radians), mullion}
function windowFrame(o){
  const g = wallGroup(o.side, o.u, 0); const fr = o.frame || mats.white; const w = o.w, b = o.b, t = o.t, hgt = t - b;
  box(w + 0.16, 0.08, 0.18, fr, 0, t, 0.02, false, g); box(w + 0.16, 0.08, 0.18, fr, 0, b, 0.02, false, g);
  box(0.08, hgt, 0.18, fr, -w / 2, (b + t) / 2, 0.02, false, g); box(0.08, hgt, 0.18, fr, w / 2, (b + t) / 2, 0.02, false, g);
  if (o.sill !== false) box(w + 0.3, 0.06, 0.32, fr, 0, b - 0.02, 0.12, false, g);
  if (o.snow) box(w * 0.92, 0.035, 0.16, mats.snow, 0, b + 0.02, -0.12, false, g);
  const panes = []; const n = o.panes || 2;
  for (let i = 0; i < n; i++){
    const pw = w / n; const hinge = new T.Group(); hinge.position.set(-w / 2 + i * pw + (i % 2 ? pw : 0), (b + t) / 2, 0.0); g.add(hinge);
    const dir = i % 2 ? -1 : 1;
    const glass = new T.Mesh(new T.PlaneGeometry(pw - 0.07, hgt - 0.08), mats.glass); glass.position.x = dir * pw / 2; hinge.add(glass);
    const bars = o.bars === undefined ? 1 : o.bars; for (let k = 1; k <= bars; k++){ const bar = new T.Mesh(new T.BoxGeometry(pw - 0.05, 0.035, 0.03), fr); bar.position.set(dir * pw / 2, -hgt / 2 + k * hgt / (bars + 1), 0); hinge.add(bar); }
    const side1 = new T.Mesh(new T.BoxGeometry(0.04, hgt - 0.04, 0.04), fr); side1.position.set(dir * (pw - 0.02), 0, 0); hinge.add(side1);
    if (o.open && i === (o.openPane || 0)) hinge.rotation.y = dir * o.open;
    panes.push(hinge);
  }
  if (o.mullion !== false && n === 2) box(0.05, hgt, 0.06, fr, 0, (b + t) / 2, 0.0, false, g);
  return { g, panes };
}
// a picture of the outside world, behind a wall: unlit canvas plane, dist metres behind the wall
function backdrop(side, u, y, dist, w, h, draw, tw, th){
  const g = wallGroup(side, u, -dist); const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map:canvasTex(tw || 1024, th || 512, draw), fog:false })); m.position.y = y; g.add(m); return m;
}
function outsideGround(side, u, w, depth, mat, y){ const g = wallGroup(side, u, 0); const m = new T.Mesh(new T.PlaneGeometry(w, depth), mat); m.rotation.x = -Math.PI / 2; m.position.set(0, y || 0, -depth / 2); m.receiveShadow = true; g.add(m); return g; }
// a simple door on a wall (no opening): returns the group
function door(o){
  const g = wallGroup(o.side, o.u, 0.03); const w = o.w || 1.0, h = o.h || 2.1; const dm = o.mat || col(0x3b2414, .5);
  box(w + 0.14, h + 0.08, 0.05, o.frame || mats.dark, 0, (h + 0.08) / 2, -0.01, false, g);
  box(w, h, 0.06, dm, 0, h / 2, 0.02, true, g);
  const pm = col(o.panel || 0x4a2d19, .5);
  if (o.glass){ const gl = new T.Mesh(new T.PlaneGeometry(w * .7, h * .32), new T.MeshBasicMaterial({ map:canvasTex(256, 160, o.glass), color:o.glassTint || 0x8a7a66 })); gl.position.set(0, h * .73, 0.056); g.add(gl); box(w * .78, 0.04, 0.03, dm, 0, h * .57, 0.06, false, g); }
  else box(w * .8, h * .38, 0.02, pm, 0, h * .73, 0.06, false, g);
  box(w * .8, h * .38, 0.02, pm, 0, h * .28, 0.06, false, g);
  const kx = (o.hinge === 'right' ? -1 : 1) * (w / 2 - 0.1);
  sph(0.04, mats.brass, kx, 1.0, 0.1, g);
  return g;
}
// lights
let shadowLight = null;
function key(pos, target, intensity, angle){
  if (shadowLight) throw new Error('only one shadow light per room');
  const l = new T.SpotLight(0xffc890, intensity || .55, 16, angle || Math.PI / 3.2, 0.6, 1.5); l.position.set(...pos); l.target.position.set(...target);
  l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.0015; scene.add(l); scene.add(l.target); shadowLight = l; return l;
}
function point(color, intensity, dist, x, y, z){ const l = new T.PointLight(color, intensity, dist, 2); l.position.set(x, y, z); scene.add(l); return l; }
const flick = [], twinkle = [];
// a fire: flame sprites along an axis plus a flickering light
let flameTex = null;
function fire(x, y, z, axis, n, light){
  flameTex = flameTex || canvasTex(64, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h * .72, 2, w / 2, h * .6, w * .55); gr.addColorStop(0, 'rgba(255,245,200,1)'); gr.addColorStop(.35, 'rgba(255,170,60,.9)'); gr.addColorStop(1, 'rgba(255,80,10,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(w / 2, 0); g.quadraticCurveTo(w, h * .6, w / 2, h); g.quadraticCurveTo(0, h * .6, w / 2, 0); g.fill(); });
  const fl = []; n = n || 5;
  for (let i = 0; i < n; i++){ const f = new T.Sprite(new T.SpriteMaterial({ map:flameTex, transparent:true, blending:T.AdditiveBlending, depthWrite:false })); f.scale.set(0.14, 0.3, 1); const k = (i - (n - 1) / 2) * 0.1; f.position.set(x + (axis === 'x' ? k : 0), y, z + (axis === 'z' ? k : 0)); scene.add(f); fl.push(f); }
  const l = light === false ? null : point(0xff8a3a, 2.0, 7, x + (light && light[0] || 0), y + 0.2, z + (light && light[1] || 0));
  flick.push({ fl, l, base:2.0 }); return l;
}
// a little Christmas tree with twinkling bulbs
function tree(x, z, s, parent){
  const g = grp(x, 0, z, 0, parent); g.scale.set(s, s, s); const needle = col(0x173f23, .85);
  for (let i = 0; i < 5; i++){ const c = new T.Mesh(new T.ConeGeometry(0.95 - i * 0.17, 0.75, 12), needle); c.position.y = 0.55 + i * 0.42; c.castShadow = true; g.add(c); }
  const tr = new T.Mesh(new T.CylinderGeometry(0.07, 0.09, 0.4, 8), col(0x3a2415)); tr.position.y = 0.2; g.add(tr);
  const st = new T.Mesh(new T.OctahedronGeometry(0.12), M({ color:0xffd36b, emissive:0xffb020, emissiveIntensity:1.4 })); st.position.y = 2.68; g.add(st);
  const cols = [0xff4040, 0xffd36b, 0x6bd3ff, 0xff8ad0, 0x9cff6b];
  for (let i = 0; i < 36; i++){ const t = i / 36; const y = 0.5 + t * 2.0; const r = (1 - t) * 0.85 + 0.08; const a = i * 2.4;
    const m = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), new T.MeshStandardMaterial({ color:cols[i % 5], emissive:cols[i % 5], emissiveIntensity:1.2 })); m.position.set(Math.cos(a) * r, y, Math.sin(a) * r); g.add(m); twinkle.push(m); }
  for (let i = 0; i < 12; i++){ const t = Math.random(); const y = 0.6 + t * 1.8; const r = (1 - t) * 0.8 + 0.1; const a = rnd(0, Math.PI * 2);
    const o = new T.Mesh(new T.SphereGeometry(0.06, 10, 8), M({ color:[0xb3241f, 0x2f5d8a, 0xe9e1cf][i % 3], roughness:.2, metalness:.7 })); o.position.set(Math.cos(a) * r, y, Math.sin(a) * r); g.add(o); }
  return g;
}
// a string of small coloured bulbs between two points
function lights(a, b, n, sag){ for (let i = 0; i <= n; i++){ const t = i / n; const x = a[0] + (b[0] - a[0]) * t, z = a[2] + (b[2] - a[2]) * t, y = a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * (sag || 0.15);
  const c = [0xff4040, 0xffd36b, 0x6bd3ff, 0x9cff6b][i % 4]; const m = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), new T.MeshStandardMaterial({ color:c, emissive:c, emissiveIntensity:1.2 })); m.position.set(x, y, z); scene.add(m); twinkle.push(m); } }
function garland(a, b, n){ for (let i = 0; i <= n; i++){ const t = i / n; const m = sph(0.055, mats.green, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * 0.12, a[2] + (b[2] - a[2]) * t, null, 7); m.castShadow = false; if (i % 3 === 0) sph(0.022, col(0xc21d1d, .3), m.position.x, m.position.y - 0.04, m.position.z, null, 6).castShadow = false; } }
function holly(x, y, z, s){ const g = grp(x, y, z); for (let i = 0; i < 3; i++){ const l = new T.Mesh(new T.SphereGeometry(0.05 * (s || 1), 6, 4), mats.green); l.scale.set(1.6, 0.35, 0.8); l.rotation.y = i * 2.1; l.position.set(Math.cos(i * 2.1) * 0.05, 0, Math.sin(i * 2.1) * 0.05); g.add(l); } for (let i = 0; i < 3; i++) sph(0.018 * (s || 1), col(0xc21d1d, .3), (i - 1) * 0.02, 0.02, 0, g, 6); return g; }
// rows of book spines on a shelf (from x0 to x1 along x at depth z, facing +z unless ry given)
const spine = ['#6e1f1f', '#1f3a2c', '#2f4a6b', '#5a3a1a', '#3d2b4f', '#7a5a22', '#2a2a2a', '#4f2a2a'];
function books(x0, x1, y, z, ry, parent){ const g = grp(0, 0, 0, 0, parent); let x = x0; while (x < x1 - 0.05){ const w = rnd(0.035, 0.07), h = rnd(0.2, 0.3); const b = new T.Mesh(new T.BoxGeometry(w, h, 0.18), col(parseInt(spine[(Math.random() * spine.length) | 0].slice(1), 16), .7)); b.position.set(x + w / 2, y + h / 2, z); b.castShadow = true; g.add(b); x += w + 0.004; } if (ry) g.rotation.y = ry; return g; }

const K = { T, THREE:T, scene, camera, rnd, tex:canvasTex, texMat, M, col, box, cyl, sph, plane, grp, mats, D, shell, wallGroup, windowFrame, backdrop, outsideGround, door, key, point, fire, tree, lights, garland, holly, books, flick, twinkle, SH, LS };
CM.K = K;

// ---------- build the room ----------
document.fonts && document.fonts.load && ['30px Caveat', '20px "Special Elite"', '16px "Libre Baskerville"'].forEach(f => document.fonts.load(f).catch(() => {}));
R.build(K);
if (!shadowLight) key([0.5, SH.H - 0.2, 1.8], [-0.2, 0, -1.2]);

// ---------- merge still meshes that share a material (far fewer draw calls on phones) ----------
(function mergeStatic(){
  scene.updateMatrixWorld(true);
  scene.traverse(o => { if (o.isMesh && o.material && o.material.side === T.DoubleSide && o.material.emissiveIntensity > 0) o.castShadow = false; });   // lamp shades: no dark blobs on the walls
  const keep = new Set(); (K.keep || []).forEach(o => o && o.traverse(c => keep.add(c))); twinkle.forEach(m => keep.add(m));
  const groups = new Map();
  scene.traverse(o => { if (!o.isMesh || keep.has(o) || Array.isArray(o.material)) return; const key = o.material.uuid + (o.castShadow ? 'c' : 'n') + (o.receiveShadow ? 'r' : 'n'); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(o); });
  for (const list of groups.values()){
    if (list.length < 2) continue;
    const parts = list.map(m => { const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); g.applyMatrix4(m.matrixWorld); return g; });
    let n = 0; parts.forEach(g => n += g.attributes.position.count);
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let o3 = 0, o2 = 0;
    parts.forEach(g => { const c = g.attributes.position.count; pos.set(g.attributes.position.array, o3); if (g.attributes.normal) nor.set(g.attributes.normal.array, o3); if (g.attributes.uv) uv.set(g.attributes.uv.array, o2); o3 += c * 3; o2 += c * 2; g.dispose(); });
    const mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(pos, 3)); mg.setAttribute('normal', new T.BufferAttribute(nor, 3)); mg.setAttribute('uv', new T.BufferAttribute(uv, 2)); mg.computeBoundingSphere();
    const mm = new T.Mesh(mg, list[0].material); mm.castShadow = list[0].castShadow; mm.receiveShadow = list[0].receiveShadow; mm.renderOrder = list[0].renderOrder; scene.add(mm);
    list.forEach(m => { m.parent.remove(m); m.geometry.dispose(); });
  }
})();

// ---------- clickable proxies ----------
const clickables = [];
function proxy(id, at, size){ const p = new T.Mesh(new T.BoxGeometry(size[0], size[1], size[2]), new T.MeshBasicMaterial({ visible:false })); p.userData.clue = id; const it = CLUES[id] || EXTRAS[id]; if (it && it.requires) p.userData.req = it.requires; p.position.set(at[0], at[1], at[2]); scene.add(p); clickables.push(p); return p; }
for (const id of clueIds) proxy(id, CLUES[id].at, CLUES[id].size);
for (const id of extraIds) proxy(id, EXTRAS[id].at, EXTRAS[id].size);
for (const id of Object.keys(DECOYS)) proxy(id, DECOYS[id].at, DECOYS[id].size);
if (ANSWER) proxy('__answer', ANSWER.at, ANSWER.size || [0.8, 0.8, 0.8]);
if (STAR) proxy('__star', STAR.at, STAR.size || [0.26, 0.26, 0.26]);
// the small gold star itself (about a palm across), with a glint that comes and goes
let starMat = null, starGlint = null;
if (STAR){
  const shp = new T.Shape(); for (let i = 0; i < 10; i++){ const a2 = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 0.026 : 0.058; const x = Math.cos(a2) * rr, y = Math.sin(a2) * rr; if (i) shp.lineTo(x, y); else shp.moveTo(x, y); } shp.closePath();
  const sgeo = new T.ExtrudeGeometry(shp, { depth:0.012, bevelEnabled:true, bevelThickness:0.006, bevelSize:0.005, bevelSegments:1 }); sgeo.center();
  starMat = M({ color:0xf3c24a, roughness:.25, metalness:.55, emissive:0x9a6400, emissiveIntensity:.5 });
  const sg = grp(STAR.at[0], STAR.at[1], STAR.at[2]); const sm = new T.Mesh(sgeo, starMat); sm.castShadow = true; sg.add(sm);
  const rt = STAR.rot || [0, 0, 0]; sg.rotation.set(rt[0], rt[1], rt[2]); const sc = STAR.scale || 1; sg.scale.set(sc, sc, sc);
  starGlint = new T.Sprite(new T.SpriteMaterial({ map:canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 1, 32, 32, 30); gr.addColorStop(0, 'rgba(255,248,210,1)'); gr.addColorStop(.25, 'rgba(255,220,120,.6)'); gr.addColorStop(1, 'rgba(255,200,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); g.fillStyle = 'rgba(255,250,225,.9)'; g.fillRect(30, 2, 4, 60); g.fillRect(2, 30, 60, 4); }), transparent:true, depthWrite:false, blending:T.AdditiveBlending, opacity:0 }));
  starGlint.scale.set(0.16 * sc, 0.16 * sc, 1); starGlint.position.set(STAR.at[0], STAR.at[1], STAR.at[2]); scene.add(starGlint);
  K.star = sg;
}

// markers for everything that can be looked at (the gold star is left for the reader to find)
const markerTex = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 10, 64, 64, 60); gr.addColorStop(0, 'rgba(255,215,120,0)'); gr.addColorStop(.55, 'rgba(255,215,120,.9)'); gr.addColorStop(.7, 'rgba(255,215,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
const markers = clickables.filter(c => c.userData.clue !== '__star').map(c => { const s = new T.Sprite(new T.SpriteMaterial({ map:markerTex, depthTest:false, transparent:true })); s.scale.set(0.35, 0.35, 1); s.position.copy(c.position); s.position.y += 0.05; s.visible = false; s.userData.clue = c.userData.clue; s.userData.req = c.userData.req; scene.add(s); return s; });
const usable = c => !c.userData.req || found.has(c.userData.req) || xfound.has(c.userData.req);
function showMarkers(){ markers.forEach(m => m.visible = markersOn && usable(m)); }

// ---------- look controls ----------
let yaw = V.yaw || 0, pitch = V.pitch || -0.08;
let targetFov = (window.innerWidth < window.innerHeight) ? (V.fovPortrait || 82) : (V.fov || 70);
camera.fov = targetFov; camera.updateProjectionMatrix();
let dragging = false, moved = 0, lx = 0, ly = 0;
const el = renderer.domElement;
function setLook(){ camera.rotation.order = 'YXZ'; camera.rotation.y = yaw; camera.rotation.x = pitch; }
setLook();
const labelEl = document.getElementById('label');
el.addEventListener('pointerdown', e => { labelEl.style.opacity = 0; dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; try { el.setPointerCapture(e.pointerId); } catch(_){} });
el.addEventListener('pointermove', e => {
  if (dragging){ const dx = e.clientX - lx, dy = e.clientY - ly; moved += Math.abs(dx) + Math.abs(dy); yaw += dx * 0.0045; pitch += dy * 0.0035; pitch = Math.max(-1.1, Math.min(0.9, pitch)); lx = e.clientX; ly = e.clientY; setLook(); }
  else hover(e);
});
el.addEventListener('pointerup', e => { dragging = false; if (moved < 8) pick(e); });
el.addEventListener('pointercancel', () => { dragging = false; });
el.addEventListener('wheel', e => { targetFov = Math.max(35, Math.min(84, targetFov + e.deltaY * 0.03)); }, { passive:true });
let pinchD = 0;
el.addEventListener('touchmove', e => { if (e.touches.length === 2){ const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinchD) targetFov = Math.max(35, Math.min(84, targetFov - (d - pinchD) * 0.08)); pinchD = d; moved = 99; } }, { passive:true });
el.addEventListener('touchend', () => { pinchD = 0; });
const ray = new T.Raycaster(); const ndc = new T.Vector2();
function hitAt(e){ ndc.x = (e.clientX / window.innerWidth) * 2 - 1; ndc.y = -(e.clientY / window.innerHeight) * 2 + 1; ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(clickables.filter(usable), false); return h.length ? h[0].object : null; }
function hover(e){ const h = hitAt(e); if (h){ el.style.cursor = 'pointer'; const id = h.userData.clue; labelEl.textContent = found.has(id) ? CLUES[id].name + ' (in your notes)' : xfound.has(id) ? EXTRAS[id].name + ' (in your notes)' : (id === '__star' && starFound) ? 'Gold star (found)' : 'Look'; labelEl.style.left = e.clientX + 'px'; labelEl.style.top = (e.clientY - 14) + 'px'; labelEl.style.opacity = 1; } else { el.style.cursor = 'grab'; labelEl.style.opacity = 0; } }
let glide = null, baseFov = targetFov, pendingOpen = false;
function pick(e){ if (glide || pendingOpen || modal.classList.contains('open')) return; const h = hitAt(e); if (!h) return; pendingOpen = true;
  const p = h.position, c = camera.position; const dx = p.x - c.x, dz = p.z - c.z, dy = p.y - c.y;
  glide = { y0:yaw, p0:pitch, y1:Math.atan2(-dx, -dz), p1:Math.atan2(dy, Math.hypot(dx, dz)), t:0 };
  let d = glide.y1 - glide.y0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; glide.y1 = glide.y0 + d;
  baseFov = targetFov; targetFov = 38; setTimeout(() => { pendingOpen = false; openLook(h.userData.clue); }, 650); }

// ---------- cards ----------
const modal = document.getElementById('modal'), card = document.getElementById('modalCard');
function openModal(html){ stopAudio(); card.innerHTML = '<button class="close" aria-label="Close">&times;</button>' + html; modal.classList.add('open'); card.scrollTop = 0; card.querySelector('.close').onclick = closeModal; }
function closeModal(){ modal.classList.remove('open'); stopAudio(); if (targetFov < 45) targetFov = baseFov; }
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
function $(id){ return document.getElementById(id); }
function updateCount(){ $('count').textContent = `Clues ${found.size} / ${clueIds.length}`; markers.forEach(m => m.material.color.set(found.has(m.userData.clue) || xfound.has(m.userData.clue) ? 0x88ff88 : 0xffffff)); showMarkers(); LS.set('found.' + R.code, [...found]); LS.set('extra.' + R.code, [...xfound]); }
function itemFor(id){ return CLUES[id] || EXTRAS[id]; }
function openLook(id){
  if (id === '__star') return openStar(!starFound);
  if (id === '__answer') return openAnswer();
  const d = DECOYS[id], L = itemFor(id);
  if (CLUES[id] && found.has(id)) return openFound(id, false);
  if (EXTRAS[id] && xfound.has(id)) return openExtra(id, false);
  const name = d ? d.name : L.name, look = d ? d.look : L.look;
  openModal(`<div class="lookcard"><div class="kicker">You look</div><h2>${name}</h2><p>${look}</p><div class="row"><button class="primary" id="closer">Look closer</button><button id="moveon">Move on</button></div></div>`);
  $('moveon').onclick = closeModal;
  $('closer').onclick = () => {
    if (d){ openModal(`<div class="kicker">You look closer</div><h2>${d.name}</h2><p>${d.close}</p><div class="row"><button class="primary" id="ok">Keep searching</button></div>`); $('ok').onclick = closeModal; }
    else openExamine(id);
  };
}
function openExamine(id){
  const L = itemFor(id); let misses = 0, done = false; const cw = 600, ch = L.ch || 400; const isX = !!EXTRAS[id];
  openModal(`<div class="kicker">You look closer</div><h2>${L.name}</h2><p>${L.prompt}</p><canvas class="closeup" id="cu" width="${cw}" height="${ch}"></canvas><div class="miss" id="miss"></div>`);
  const cv = $('cu'); const g = cv.getContext('2d');
  L.draw(g, cw, ch, K, false);
  cv.onclick = (e) => { if (done) return; const r = cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const hit = L.hot.some(h => x >= h[0] && x <= h[2] && y >= h[1] && y <= h[3]);
    if (hit){ done = true;
      const show = () => { if (isX) openExtra(id, true); else { openFound(id, true); if (L.clip) startClip(L.clip); } };
      if (L.reveal){ L.draw(g, cw, ch, K, true); $('miss').textContent = ''; setTimeout(show, 900); }
      else show();
    } else { misses++; $('miss').textContent = misses >= 3 ? 'Hint: ' + L.hint : 'Nothing unusual there. Keep looking.'; }
  };
}
function speakerHTML(clipId, label){
  const c = CLIPS[clipId]; if (!c) return '';
  const words = c.kind === 'music' ? `<p class="small">${c.text}</p>` : `<div class="doc type" id="transcript">${c.speaker ? '<b>' + c.speaker + ':</b> ' : ''}"${c.text}"</div><p class="small">The words are printed here too, so the case works without sound.</p>`;
  return `<div class="speaker"><button class="primary" id="play" data-clip="${clipId}">${label || 'Play'}</button><div class="wave" id="wave">${'<i></i>'.repeat(26)}</div></div>${words}`;
}
function wirePlay(label){ const b = $('play'); if (!b) return; b.onclick = () => { if (b.dataset.on){ stopAudio(); } else startClip(b.dataset.clip); }; b.dataset.label = label || b.textContent; }
function openFound(id, isNew){
  const c = CLUES[id]; if (isNew){ found.add(id); updateCount(); if (R.onFound) R.onFound(id, K); }
  openModal(`<div class="kicker">${c.kicker || 'Clue'}${isNew ? ' · added to your case notes' : ' · already in your notes'}</div><h2>${c.title || c.name}</h2>${c.html}${c.clip ? speakerHTML(c.clip, c.playLabel) : ''}<div class="row"><button class="primary" id="ok">Keep searching</button></div>`);
  $('ok').onclick = closeModal; if (c.clip) wirePlay(c.playLabel);
}
// ---------- extra clues: one per night, only in the rooms, never needed ----------
function openExtra(id, isNew){
  const X = EXTRAS[id]; if (isNew){ xfound.add(id); updateCount(); if (R.onFound) R.onFound(id, K); }
  const nn = nightName(X.night), Nn = nn.charAt(0).toUpperCase() + nn.slice(1);
  openModal(`<div class="kicker">Extra clue${isNew ? ' · added to your case notes' : ' · already in your notes'}</div><div class="extracard"><div class="tag">Only in this room · not needed</div><h2>Extra clue for ${nn}</h2><p>${X.text}</p><p class="never">You can solve ${nn} without this clue.</p></div><div class="row"><button class="primary" id="ok">Keep searching</button></div>`);
  $('ok').onclick = closeModal;
}
// ---------- The Hidden Case: The Missing Star ----------
function dec(b64){ try { const k = STARS.k, bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i) ^ k.charCodeAt(i % k.length); return new TextDecoder().decode(u); } catch(e){ return ''; } }
function starCount(){ return STARS ? STARS.rooms.filter(c => LS.get('star.' + c, false)).length : 0; }
const STAR_SVG = '<svg viewBox="0 0 40 40" width="22" height="22" aria-hidden="true"><path d="M20 2l5.3 11.6 12.7 1.4-9.5 8.6 2.7 12.5L20 29.7 8.8 36.1l2.7-12.5L2 15l12.7-1.4z" fill="currentColor"/></svg>';
function starListHTML(){ return STARS ? `<div class="starlist">${STARS.rooms.map((c, i) => `<span class="${LS.get('star.' + c, false) ? 'got' : ''}${c === R.code ? ' here' : ''}">${STAR_SVG}<small>${i + 1}</small></span>`).join('')}</div><p class="small" style="text-align:center">Gold stars found on this phone: <b>${starCount()} of ${STARS.rooms.length}</b>. The numbers are the crime scenes.</p>` : ''; }
function starButton(){ const b = $('btnStar'); if (!b) return; b.textContent = starFound ? 'Gold star: found' : 'Gold star?'; b.classList.toggle('done', starFound); }
function openStar(isNew){
  if (isNew){ starFound = true; LS.set('star.' + R.code, true); starButton(); }
  const c = STARS.clues[R.code] || ['', ''];
  openModal(`<div class="kicker">The Missing Star · ${isNew ? 'gold star found' : 'already found'}</div><h2>Hidden Case clue</h2><div class="starcard"><div class="si">${STAR_SVG}</div><h3>${dec(c[0])}</h3><div class="doc">${dec(c[1])}</div></div><p class="small">Tucked inside the little gold star is this clue for The Hidden Case at the back of your book. Tick this room there.</p>${starListHTML()}<div class="row"><button class="primary" id="ok">Keep searching</button></div>`);
  $('ok').onclick = closeModal;
}
if (STAR) $('btnStar').onclick = () => {
  if (starFound) return openStar(false);
  openModal(`<div class="kicker">The Hidden Case · The Missing Star</div><h2>Have you found the gold star?</h2><p>${dec(STARS.intro)}</p><p><b>Not found in this room yet.</b> It is small, so look at everything, high and low.</p>${starListHTML()}<div class="row"><button class="primary" id="seek">Give me a hint</button><button id="ok">Keep searching</button></div><p class="observe" id="seektext" style="display:none">${STAR.seek}</p>`);
  $('ok').onclick = closeModal; $('seek').onclick = () => { $('seektext').style.display = 'block'; $('seek').style.display = 'none'; };
};
// SHA-256 of "who|where", so the answer is never in the page as plain text (crypto.subtle, with a small fallback)
function sha256js(str){
  const K2 = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes = Array.from(new TextEncoder().encode(str)); const bl = bytes.length * 8; bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bl >>> (i * 8)) & 255);
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]; const w = new Array(64); const rr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < bytes.length; o += 64){
    for (let i = 0; i < 16; i++) w[i] = (bytes[o + i * 4] << 24) | (bytes[o + i * 4 + 1] << 16) | (bytes[o + i * 4 + 2] << 8) | bytes[o + i * 4 + 3];
    for (let i = 16; i < 64; i++){ const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++){ const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25), chv = (e & f) ^ (~e & g), t1 = (hh + S1 + chv + K2[i] + w[i]) | 0, S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0; hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0; }
    h = h.map((v, i) => (v + [a, b, c, d, e, f, g, hh][i]) | 0);
  }
  return h.map(v => (v >>> 0).toString(16).padStart(8, '0')).join('');
}
async function sha256(str){ try { if (window.crypto && crypto.subtle && window.isSecureContext){ const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)); return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join(''); } } catch(e){} return sha256js(str); }
CM.sha256js = sha256js;
function openAnswer(){
  const S = STARS;
  openModal(`<div class="kicker">The Hidden Case · The Missing Star</div><h2>Who took the star, and where is it?</h2><p>The top of the great tree is empty. Choose one person and one place.</p><div class="pick"><b>Who took it?</b>${S.suspects.map((p, i) => `<label><input type="radio" name="who" value="${i}"> <span>${p}</span></label>`).join('')}</div><div class="pick"><b>Where is it hidden?</b>${S.places.map((p, i) => `<label><input type="radio" name="where" value="${i}"> <span>${p}</span></label>`).join('')}</div><div class="row"><button class="primary" id="answer">Give my answer</button><button id="ok">Not yet</button></div><div class="result" id="result"></div>${starListHTML()}`);
  $('ok').onclick = closeModal;
  $('answer').onclick = async () => {
    const w = card.querySelector('input[name=who]:checked'), p = card.querySelector('input[name=where]:checked'), r = $('result');
    if (!w || !p){ r.className = 'result bad'; r.textContent = 'Choose one person and one place.'; return; }
    const h = await sha256(S.suspects[+w.value] + '|' + S.places[+p.value]);
    if (h === S.h){
      LS.set('starSolved', true);
      openModal(`<div class="kicker">The Hidden Case · solved</div><h2>The Missing Star</h2><div class="doc ending">${dec(S.e)}</div><div class="row"><button class="primary" id="ok">Back to the green</button></div>`);
      $('ok').onclick = closeModal; if (R.onSolved) R.onSolved(K);
    } else { r.className = 'result bad'; r.textContent = dec(S.wrong); }
  };
}

$('btnNotes').onclick = () => {
  const items = [...found].map(id => `<li>${CLUES[id].note}</li>`).join('') || '<li>Nothing yet. Look around the room and tap anything that seems out of place.</li>';
  const xs = [...xfound].map(id => `<li><b>${nightName(EXTRAS[id].night).replace('the ', '')}:</b> ${EXTRAS[id].text}</li>`).join('');
  openModal(`<div class="kicker">Case notes · ${R.title}</div><h2>What you have found</h2><ol class="notes">${items}</ol>${xs ? `<h3 class="xh">Extra clues (you never need these)</h3><ul class="notes extra">${xs}</ul>` : ''}<p class="small">${found.size} of ${clueIds.length} clues found.${extraIds.length ? ` Extra clues found: ${xfound.size} of ${extraIds.length}.` : ''} Your notes stay on this phone, so you can come back to this room on a later night.</p>${found.size || xfound.size ? '<div class="row"><button id="reset">Clear my notes for this room</button></div>' : ''}`);
  const rs = $('reset'); if (rs) rs.onclick = () => { found.clear(); xfound.clear(); updateCount(); $('btnNotes').onclick(); };
};
$('btnSuspects').onclick = () => {
  openModal(`<div class="kicker">The suspects</div><h2>${SUSPECTS.length} suspects</h2><p style="font-size:13px">Tap a suspect to mark them cleared when your book rules them out. Tap again to undo.</p>${SUSPECTS.map(s => `<div class="suspect${cleared.has(s.id) ? ' cleared' : ''}" data-id="${s.id}"><div class="face" style="background:${s.color}">${s.name.replace('Reverend ', '').split(' ').map(w => w[0]).join('').slice(0, 2)}</div><div><b>${s.name}</b><span><i>${s.role}.</i> ${s.fact}</span></div><div class="stamp">CLEARED</div></div>`).join('')}`);
  card.querySelectorAll('.suspect').forEach(s => s.onclick = () => { const id = s.dataset.id; if (cleared.has(id)) cleared.delete(id); else cleared.add(id); s.classList.toggle('cleared'); LS.set('cleared', [...cleared]); });
};
$('btnMarkers').onclick = (e) => { markersOn = !markersOn; showMarkers(); e.target.textContent = markersOn ? 'Hide clue markers' : 'Show clue markers'; if (markersOn){ const h = $('hint'); h.textContent = STAR ? 'Markers show everything you can look at, except the gold star' : 'Markers show everything you can look at, not only clues'; h.style.opacity = 1; clearTimeout(h._t); h._t = setTimeout(() => h.style.opacity = 0, 4000); } };
starButton(); updateCount(); if (R.onFound){ found.forEach(id => R.onFound(id, K)); xfound.forEach(id => R.onFound(id, K)); }

// ---------- sound ----------
// Recorded voices: if ../../audio/<file> exists it is played; otherwise the device voice reads the words.
const AUDIO_BASE = R.audioBase || '../../audio/';
const AF = R.AUDIO_FILES || {};
const fileOK = {};
if (/^https?:$/.test(location.protocol)) Object.keys(AF).forEach(id => { fetch(AUDIO_BASE + AF[id], { method:'HEAD', cache:'no-cache' }).then(r => { fileOK[id] = r.ok && !/text\/html/.test(r.headers.get('content-type') || ''); }).catch(() => { fileOK[id] = false; }); });
let actx = null, nodes = [], timers = [], waveTimer = null, audioEl = null, active = 0, gen = 0;
function ctx(){ try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch(e){} return actx; }
function partStart(){ active++; }
function partEnd(g){ if (g !== gen) return; active--; if (active <= 0) stopWave(); }
function stopAudio(){
  gen++; active = 0;
  try { window.speechSynthesis && speechSynthesis.cancel(); } catch(e){}
  nodes.forEach(n => { try { n.stop(); } catch(e){} }); nodes = []; timers.forEach(clearTimeout); timers = [];
  if (audioEl){ try { audioEl.pause(); } catch(e){} audioEl = null; }
  stopWave();
}
let voices = [];
function loadVoices(){ try { voices = speechSynthesis.getVoices() || []; } catch(e){} }
try { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; } catch(e){}
function speak(text, v, g){
  partStart();
  try { const u = new SpeechSynthesisUtterance(text); u.rate = (v && v.rate) || 0.95; u.pitch = (v && v.pitch) || 1; u.lang = 'en-GB';
    const vs = voices.length ? voices : speechSynthesis.getVoices(); const pk = vs.find(x => /en-GB/i.test(x.lang)) || vs.find(x => /^en/i.test(x.lang)); if (pk) u.voice = pk;
    u.onend = u.onerror = () => partEnd(g);
    speechSynthesis.speak(u); } catch(e){ partEnd(g); }
}
function stopWave(){ clearInterval(waveTimer); waveTimer = null; document.querySelectorAll('#wave i').forEach(b => b.style.height = '20%'); const b = $('play'); if (b && b.dataset.on){ delete b.dataset.on; b.textContent = b.dataset.label || 'Play'; } }
function startWave(){ const bars = [...document.querySelectorAll('#wave i')]; clearInterval(waveTimer); waveTimer = setInterval(() => bars.forEach(b => b.style.height = (15 + Math.random() * 85) + '%'), 120); const b = $('play'); if (b){ b.dataset.on = '1'; b.textContent = 'Stop'; } }
function later(ms, f, g){ partStart(); timers.push(setTimeout(() => { if (g !== gen) return; f(); partEnd(g); }, ms)); }
function buf(seconds, fill){ const a = ctx(); if (!a) return null; const len = Math.floor(a.sampleRate * seconds); const b = a.createBuffer(1, len, a.sampleRate); fill(b.getChannelData(0), a.sampleRate, len); return b; }
function playBuf(b, filter, g){ const a = ctx(); if (!a || !b) return; const s = a.createBufferSource(); s.buffer = b; let n = s; if (filter){ const f = a.createBiquadFilter(); f.type = filter.type; f.frequency.value = filter.f; f.Q.value = filter.q || 0.7; n.connect(f); n = f; } const gn = a.createGain(); gn.gain.value = 0.9; n.connect(gn).connect(a.destination); partStart(); s.onended = () => partEnd(g); s.start(); nodes.push(s); return s; }
const NOTE = { C4:261.6, D4:293.7, E4:329.6, F4:349.2, G4:392, A4:440, B4:493.9, C5:523.3, D5:587.3, E5:659.3, F5:698.5, G5:784, A5:880, B5:987.8, C6:1046.5 };
// a simple plucked-bell tone for each note; tune = [[note, beats], ...]
function tuneBuf(tune, beat, vol, decay, harm){ const len = tune.reduce((s, x) => s + x[1], 0) * beat + 1.6; return buf(len, (d, sr, n) => { let t0 = 0; tune.forEach(([nm, beats]) => { const f = typeof nm === 'number' ? nm : NOTE[nm]; if (f){ const s0 = Math.floor(t0 * sr); for (let i = 0; i < sr * 1.5 && s0 + i < n; i++){ const t = i / sr; const env = Math.exp(-t * decay) * Math.min(1, t * 400); d[s0 + i] += env * vol * (Math.sin(2 * Math.PI * f * t) + (harm || 0) * Math.sin(2 * Math.PI * f * 2.0 * t) + (harm || 0) * .4 * Math.sin(2 * Math.PI * f * 3.01 * t)); } } t0 += beats * beat; }); }); }
const SILENT_NIGHT = [['G4',1.5],['A4',.5],['G4',1],['E4',3],['G4',1.5],['A4',.5],['G4',1],['E4',3],['D5',2],['D5',1],['B4',3],['C5',2],['C5',1],['G4',3]];
function voicePart(id, c, delay, g){
  const say = c.say || c.text;
  const go = () => {
    if (AF[id] && fileOK[id] !== false){
      const a = new Audio(AUDIO_BASE + AF[id]); audioEl = a; let fell = false; partStart();
      const fallback = () => { if (fell || g !== gen) return; fell = true; fileOK[id] = false; if (audioEl === a) audioEl = null; speak(say, c.voice, g); partEnd(g); };
      a.addEventListener('error', fallback, { once:true }); a.addEventListener('ended', () => { if (audioEl === a) audioEl = null; partEnd(g); });
      const p = a.play(); if (p && p.catch) p.catch(fallback);
    } else speak(say, c.voice, g);
  };
  if (delay) later(delay, go, g); else go();
}
function startClip(id){
  stopAudio(); const c = CLIPS[id]; if (!c) return; const g = gen; startWave(); ctx();
  if (c.kind === 'radio'){
    // crackle and a carol under the presenter's voice
    playBuf(buf(14, (d, sr, n) => { for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.05 + (Math.random() < 0.0008 ? (Math.random() * 2 - 1) * 0.4 : 0);
      let t0 = 0; (c.tune || SILENT_NIGHT).forEach(([nm, b]) => { const f = NOTE[nm]; const s0 = Math.floor(t0); for (let i = 0; i < sr * 1.2 && s0 + i < n; i++){ const t = i / sr; d[s0 + i] += (Math.sin(2 * Math.PI * f * t) * 0.1 + Math.sin(Math.PI * f * t) * 0.05) * Math.exp(-t * 2.2); } t0 += b * 0.38 * sr; }); }), { type:'bandpass', f:1500, q:0.7 }, g);
    voicePart(id, c, 2400, g);
  } else if (c.kind === 'phone'){
    playBuf(buf(1.0, (d, sr, n) => { for (let i = 0; i < n; i++){ const t = i / sr; const on = (t < 0.18) || (t > 0.3 && t < 0.48); d[i] = (on ? Math.sin(2 * Math.PI * 950 * t) * 0.18 : 0) + (Math.random() * 2 - 1) * 0.015; } }), null, g);
    voicePart(id, c, 900, g);
  } else if (c.kind === 'music'){
    playBuf(tuneBuf(c.tune, c.beat || 0.42, 0.16, 2.6, 0.35), null, g);
  } else voicePart(id, c, 300, g);
}
K.startClip = startClip; K.stopAudio = stopAudio;

// ---------- intro ----------
{ const h = location.hash; if (h.indexOf('#preview') === 0){ $('intro').classList.remove('open'); const k = parseInt(h.slice(8)) || 0; const Y = R.previews || [yaw]; yaw = Y[k % Y.length]; setLook(); } }
$('enter').onclick = () => { $('intro').classList.remove('open'); ctx();
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch(e){}   // lets phones speak later
  setTimeout(() => { $('hint').style.opacity = 0; }, 7000); };

// ---------- animate ----------
const clock = new T.Clock(), clockT = new T.Clock();
function tick(){
  const t = clockT.getElapsedTime();
  flick.forEach((f, k) => { if (f.l) f.l.intensity = f.base + Math.sin(t * 9 + k) * 0.25 + Math.sin(t * 23) * 0.18 + Math.random() * 0.15; f.fl.forEach((s, i) => { s.scale.y = 0.27 + Math.sin(t * 10 + i * 1.7) * 0.06 + Math.random() * 0.04; s.scale.x = 0.13 + Math.sin(t * 7 + i) * 0.02; }); });
  twinkle.forEach((b, i) => { b.material.emissiveIntensity = 0.6 + (Math.sin(t * 2 + i * 1.3) > 0.2 ? 1.0 : 0.15); });
  if (R.tick) R.tick(t, K);
  markers.forEach((m, i) => { const s = 0.28 + Math.sin(t * 3 + i) * 0.06; m.scale.set(s, s, 1); });
  if (starMat){ const gl = Math.pow(Math.max(0, Math.sin(t * 1.3 + 0.7)), 24); starMat.emissiveIntensity = 0.45 + gl * 1.4; starGlint.material.opacity = gl * 0.95; starGlint.material.rotation = t * 0.4; }
  const dt = Math.min(0.1, clock.getDelta());
  if (glide){ glide.t = Math.min(1, glide.t + dt * 3.6); const k = glide.t * glide.t * (3 - 2 * glide.t); yaw = glide.y0 + (glide.y1 - glide.y0) * k; pitch = glide.p0 + (glide.p1 - glide.p0) * k; setLook(); if (glide.t >= 1) glide = null; }
  camera.fov += (targetFov - camera.fov) * (1 - Math.pow(0.88, dt * 60)); camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
$('loading').style.display = 'none';
tick();
window.__room = { R, clickables, camera, LOOK:Object.assign({}, CLUES, EXTRAS), CLUES, EXTRAS, DECOYS, openLook, openStar:() => openStar(!starFound), openAnswer, xfound, starFound:() => starFound, starCount, dec, isBusy:() => !!glide || pendingOpen, setYaw:(y, p) => { yaw = y; pitch = (p === undefined ? pitch : p); setLook(); }, found, fov:() => [camera.fov, targetFov], setFov:(f) => { targetFov = f; camera.fov = f; camera.updateProjectionMatrix(); }, markers, renderer, scene };
window.__ready = true;
}
})();
