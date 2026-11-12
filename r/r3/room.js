/* Room 3: Nora's flat above Crane's Toys. Night 7.
   The street window looks across the High Street (bakery, Quill's Boots, the inn). A little inside window looks down onto the shop counter.
   Wording from book/content/n07.py (receipts, wrapping sign). The flat has paper chains, a cat basket and jars of humbugs (n07). */
const ROOM = {
  code:'r3',
  title:"Nora's Flat",
  subtitle:'Crime scene 3 · Night 7',
  view:{ pos:[0.1, 1.6, 0.3], yaw:-0.2, pitch:-0.1 },
  previews:[-0.2, 1.2, -1.4, 2.9, -2.5],
  intro:{
    kicker:'Night 7 · Crime scene 3',
    heading:"Nora's flat above the toy shop",
    paras:[
      "Nora Crane lives in the little flat over Crane's Toys, up a steep stair behind the counter. It is warm, cosy and full of Christmas.",
      '<b>Your task:</b> search the flat. Where was Nora at 9:02, and can anyone say so?',
    ],
    button:"Climb up to Nora's flat",
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 6.0, DP = 5.0, H = 2.6, BZ = -DP / 2, FZ = DP / 2, LX = -W / 2, RX = W / 2;
    const WIN = { u:0.6, w:1.4, b:0.85, t:2.05 }, IN = { u:-0.3, w:1.0, b:0.35, t:1.15 };
    const paper = K.M({ map:tex(256, 256, (g, w, h) => { g.fillStyle = '#e9cfc4'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 64) for (let x = (y / 64 % 2) * 32; x < w; x += 64){ g.fillStyle = 'rgba(160,50,60,.45)'; for (let k = 0; k < 5; k++){ g.beginPath(); g.ellipse(x + 16 + Math.cos(k * 1.26) * 6, y + 20 + Math.sin(k * 1.26) * 6, 4, 4, 0, 0, Math.PI * 2); g.fill(); } g.fillStyle = 'rgba(70,110,70,.45)'; g.beginPath(); g.ellipse(x + 26, y + 32, 6, 2.5, 0.6, 0, Math.PI * 2); g.fill(); } g.strokeStyle = 'rgba(255,255,255,.25)'; for (let x = 0; x < w; x += 32){ g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } }, [1, 1]), roughness:.9 });
    const panel = K.M({ map:tex(256, 128, (g, w, h) => { g.fillStyle = '#e3dccb'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++){ g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(i * 32, 0, 2, h); } }, [1, 1]), roughness:.7 });
    K.shell({ w:W, d:DP, h:H, wallMat:paper, panelMat:panel, wallTile:[1.0, 1.0], panelTile:[1.0, 0.9], dado:0.9, trimMat:col(0xf0ebe0, .5),
      floorMat:K.M({ map:tex(512, 512, (g, w, h) => D.planks(g, w, h, '#7a5234', 8), [3, 3]), roughness:.6 }),
      open:{ back:[{ u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t }], left:[{ u:IN.u, w:IN.w, b:IN.b, t:IN.t }] } });
    plane(2.8, 2.0, K.M({ map:tex(256, 192, (g, w, h) => { g.fillStyle = '#7a1d2a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e9d9a8'; g.lineWidth = 6; g.strokeRect(12, 12, w - 24, h - 24); g.fillStyle = 'rgba(233,217,168,.5)'; for (let x = 40; x < w - 30; x += 30) for (let y = 40; y < h - 30; y += 30){ g.beginPath(); g.arc(x, y, 5, 0, Math.PI * 2); g.fill(); } }), roughness:1 }), 0.2, 0.006, 0.1, -Math.PI / 2);

    // ---- street window across the High Street ----
    K.windowFrame({ side:'back', u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t, snow:true, bars:2 });
    const curt = K.M({ color:0x3f6b4a, roughness:.85, side:T.DoubleSide });
    for (const s of [-1, 1]){ const geo = new T.PlaneGeometry(0.45, H - 0.25, 10, 1); const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 24) * 0.035); geo.computeVertexNormals(); const c = new T.Mesh(geo, curt); c.position.set(WIN.u + s * (WIN.w / 2 + 0.18), (H - 0.25) / 2 + 0.05, BZ + 0.14); c.castShadow = true; K.scene.add(c); }
    K.backdrop('back', WIN.u, 1.7, 8, 14, 6, (g, w, h) => {
      D.night(g, w, h, '#0a1222', '#26324e');
      const shop = (x, bw, top, c, att) => { g.fillStyle = c; g.fillRect(x, top, bw, h * .82 - top); g.fillStyle = '#eef2f7'; g.beginPath(); g.moveTo(x - 8, top + 4); g.lineTo(x + bw / 2, top - h * .1); g.lineTo(x + bw + 8, top + 4); g.fill();
        g.fillStyle = 'rgba(255,214,140,.95)'; g.fillRect(x + bw * .12, h * .62, bw * .76, h * .13); g.fillStyle = 'rgba(80,50,30,.6)'; g.fillRect(x + bw * .12, h * .62, bw * .76, 5);
        for (let i = 0; i < 2; i++){ g.fillStyle = (att && i === 1) ? 'rgba(255,214,140,.9)' : 'rgba(60,70,90,.9)'; g.fillRect(x + bw * (.2 + i * .4), top + h * .06, bw * .2, h * .1); } };
      shop(w * .02, w * .3, h * .36, '#3a2a22', true); shop(w * .36, w * .24, h * .4, '#2c3040'); shop(w * .64, w * .34, h * .3, '#3a3024');
      g.fillStyle = '#d8dee8'; g.fillRect(0, h * .82, w, h * .18);
      for (let k = 0; k < 2; k++) for (let i = 0; i < 40; i++){ const x = i / 39 * w, y = h * (.25 + k * .06) + Math.sin(i / 39 * Math.PI) * h * .05; g.fillStyle = ['#ff6060', '#ffd36b', '#6bd3ff', '#9cff6b'][i % 4]; g.beginPath(); g.arc(x, y, 2.5, 0, Math.PI * 2); g.fill(); }
    }, 1024, 448);
    // ---- the little inside window, looking down on the shop counter ----
    K.windowFrame({ side:'left', u:IN.u, w:IN.w, b:IN.b, t:IN.t, sill:true, panes:1, bars:0 });
    K.backdrop('left', IN.u, 0.2, 1.6, 3.4, 2.4, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#a8743e'); gr.addColorStop(1, '#6a4422'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7a4a22'; for (let y = 0; y < h; y += 40) g.fillRect(0, y, w, 3);
      g.fillStyle = '#5a3218'; g.fillRect(w * .18, h * .38, w * .64, h * .2); g.fillStyle = '#8a5a2a'; g.fillRect(w * .16, h * .34, w * .68, h * .06);
      g.fillStyle = '#2a2a2c'; g.fillRect(w * .28, h * .25, w * .12, h * .1); g.fillStyle = '#f3ead2'; g.fillRect(w * .5, h * .22, w * .18, h * .1);
      g.fillStyle = '#c9a26a'; for (let i = 0; i < 4; i++) g.fillRect(w * (.2 + i * .15), h * .7, w * .1, h * .08);
      const tc = ['#b3241f', '#2f5d8a', '#1f5a33', '#d9a441']; for (let i = 0; i < 18; i++){ g.fillStyle = tc[i % 4]; g.fillRect(rnd(0, w), rnd(h * .62, h), 14, 14); } }, 512, 384);
    K.point(0xffcf8a, 0.5, 3, LX - 0.6, 0.0, IN.u);

    // ---- right wall: fireplace with stockings, garland, armchair, knitting, standard lamp ----
    const fz = -0.3;
    box(0.34, 1.2, 1.5, col(0x9a8a76, .9), RX - 0.17, 0.6, fz); box(0.05, 0.62, 0.76, col(0x0a0604, 1), RX - 0.35, 0.33, fz, false);
    box(0.48, 0.08, 1.7, col(0xf0ebe0, .5), RX - 0.24, 1.24, fz);
    for (let i = 0; i < 3; i++){ const l = cyl(0.04, 0.04, 0.45, col(0x3a2415, 1), RX - 0.34, 0.1, fz - 0.1 + i * 0.1, 6); l.rotation.x = Math.PI / 2; }
    K.fire(RX - 0.45, 0.24, fz, 'z', 4, [-0.2, 0]);
    K.garland([RX - 0.3, 1.32, fz - 0.8], [RX - 0.3, 1.32, fz + 0.8], 10);
    // two stockings: Nora's old one with her name, and a plain new one (the gold star of The Hidden Case lies by the cat basket)
    const stk = (z, c, cuff) => { box(0.05, 0.34, 0.15, col(c, .9), RX - 0.5, 1.0, z, false); box(0.055, 0.08, 0.17, col(cuff, 1), RX - 0.5, 1.15, z, false); box(0.05, 0.1, 0.14, col(c, .9), RX - 0.5, 0.86, z - 0.07, false); };
    stk(fz - 0.3, 0xb3241f, 0xf4f1ea); stk(fz + 0.3, 0x1f5a33, 0xf4f1ea);
    for (const z of [fz - 0.5, fz + 0.5]) cyl(0.04, 0.05, 0.16, col(0xf0e6c8, .8), RX - 0.25, 1.36, z, 10);
    plane(0.22, 0.28, K.M({ map:tex(64, 80, (g, w, h) => { g.fillStyle = '#b08a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#c9b48a'; g.fillRect(6, 6, w - 12, h - 12); g.fillStyle = '#6a5a4a'; g.beginPath(); g.ellipse(w / 2, h * .42, 10, 13, 0, 0, Math.PI * 2); g.fill(); g.fillRect(w / 2 - 14, h * .6, 28, 20); }) }), RX - 0.25, 1.42, fz + 0.1, 0, -Math.PI / 2, 0);
    const ac = grp(RX - 1.0, 0, 1.0, -Math.PI / 2 - 0.4); const acM = col(0x3f6b4a, .85);
    box(0.8, 0.4, 0.75, acM, 0, 0.2, 0, true, ac); box(0.8, 0.7, 0.16, acM, 0, 0.72, -0.32, true, ac); box(0.14, 0.32, 0.75, acM, -0.36, 0.52, 0, true, ac); box(0.14, 0.32, 0.75, acM, 0.36, 0.52, 0, true, ac);
    box(0.5, 0.05, 0.4, col(0xf0d0d8, .9), 0, 0.43, 0.1, false, ac);
    const kb = grp(1.2, 0, 1.55); cyl(0.17, 0.14, 0.26, col(0x9a7a4a, .9), 0, 0.13, 0, 12, kb); sph(0.08, col(0xb3241f, .9), -0.05, 0.27, 0, kb); sph(0.07, col(0xe9e1cf, .9), 0.07, 0.27, 0.03, kb); const kn = cyl(0.005, 0.005, 0.35, mats.wood, 0.02, 0.34, 0, 5, kb); kn.rotation.z = 0.5;
    const sl = grp(2.6, 0, 2.1); cyl(0.15, 0.17, 0.04, mats.brass, 0, 0.02, 0, 14, sl); cyl(0.015, 0.015, 1.55, mats.brass, 0, 0.8, 0, 6, sl); cyl(0.14, 0.24, 0.26, K.M({ color:0xf0d8a8, side:T.DoubleSide, roughness:.6, emissive:0xa0703a, emissiveIntensity:.45 }), 0, 1.62, 0, 14, sl);
    K.point(0xffc890, 0.95, 6, 2.6, 1.5, 2.0);

    // ---- back left corner: the little tree; left: the cat basket ----
    K.tree(-2.35, -1.85, 0.6);
    const cb = grp(-2.3, 0, 1.25); const cbm = new T.Mesh(new T.CylinderGeometry(0.3, 0.26, 0.16, 16, 1, true), col(0x9a7a4a, .9)); cbm.position.y = 0.08; cbm.castShadow = true; cb.add(cbm); cyl(0.26, 0.26, 0.02, col(0x8e1f1f, .9), 0, 0.02, 0, 16, cb);
    const cat = sph(0.17, col(0xc8782a, .9), 0, 0.12, 0, cb, 14); cat.scale.set(1.2, 0.55, 0.9); sph(0.08, col(0xc8782a, .9), 0.13, 0.15, 0.07, cb, 10);
    for (const z of [0.03, 0.11]){ const ear = new T.Mesh(new T.ConeGeometry(0.025, 0.05, 6), col(0xc8782a, .9)); ear.position.set(0.15, 0.23, z); cb.add(ear); }

    // ---- front wall: door, calendar, sideboard with the biscuit tin, the card and the humbugs ----
    K.door({ side:'front', u:-1.6, w:0.9, h:2.0, mat:col(0x6b4423, .5), panel:0x7a5634 });
    K.holly(-1.6, 2.12, FZ - 0.1, 1.4);
    plane(0.34, 0.46, K.M({ map:tex(128, 170, (g, w, h) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, w, h); g.fillStyle = '#8e1f1f'; g.fillRect(0, 0, w, 60); g.fillStyle = '#e9e1cf'; for (let i = 0; i < 6; i++) D.star(g, 20 + i * 18, 30, 6); g.strokeStyle = '#bbb'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(6 + c * 16.5, 70 + r * 19, 16.5, 19); g.strokeStyle = '#b3241f'; g.lineWidth = 2; g.beginPath(); g.arc(6 + 3 * 16.5 + 8, 70 + 4 * 19 + 9, 9, 0, Math.PI * 2); g.stroke(); }), roughness:.9 }), -0.4, 1.5, FZ - 0.012, 0, Math.PI, 0);
    const sbx = 0.75, sbz = FZ - 0.25;
    box(1.5, 0.84, 0.45, col(0x5a3622, .5), sbx, 0.42, sbz); box(1.54, 0.04, 0.48, col(0x6b4423, .45), sbx, 0.86, sbz);
    for (const x of [-0.37, 0.37]) box(0.68, 0.6, 0.02, col(0x4a2d19, .5), sbx + x, 0.42, sbz - 0.23, false);
    // biscuit tin (lid off) with the receipts
    const tin = grp(0.35, 0.88, sbz); cyl(0.13, 0.13, 0.1, K.M({ color:0x2f5d8a, roughness:.35, metalness:.6 }), 0, 0.05, 0, 18, tin); cyl(0.135, 0.135, 0.015, mats.gold, 0, 0.1, 0, 18, tin);
    const lid = cyl(0.14, 0.14, 0.02, K.M({ color:0x2f5d8a, roughness:.35, metalness:.6 }), 0.0, 0.18, -0.05, 18, tin); lid.rotation.x = -1.2;
    for (let i = 0; i < 4; i++){ const r = box(0.05, 0.002, 0.11, col(0xf6f1df, .95), -0.05 + i * 0.035, 0.105, rnd(-.03, .03), false, tin); r.rotation.y = rnd(-.3, .3); }
    // the card from Mrs Crisp
    const cd = grp(0.82, 0.88, sbz + 0.02, 0.15); const c1 = plane(0.14, 0.19, K.M({ map:tex(64, 90, (g, w, h) => { g.fillStyle = '#1f4a2a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9e1cf'; D.star(g, w / 2, h * .3, 12); g.fillStyle = '#b3241f'; g.beginPath(); g.arc(w * .3, h * .7, 6, 0, Math.PI * 2); g.arc(w * .7, h * .7, 6, 0, Math.PI * 2); g.fill(); }), side:T.DoubleSide }), 0, 0.095, 0.03, -0.25, Math.PI, 0, cd);
    plane(0.14, 0.19, K.M({ color:0xf6f1df, side:T.DoubleSide }), 0, 0.095, -0.03, 0.25, Math.PI, 0, cd);
    // jars of humbugs
    for (let i = 0; i < 2; i++){ const jx = 1.15 + i * 0.2; cyl(0.07, 0.07, 0.2, new T.MeshPhysicalMaterial({ color:0xddeeff, transparent:true, opacity:.35, roughness:.05 }), jx, 0.98, sbz, 14); cyl(0.072, 0.072, 0.03, mats.brass, jx, 1.09, sbz, 14);
      for (let k = 0; k < 9; k++) sph(0.02, col(k % 2 ? 0x5a3218 : 0xf4f1ea, .4), jx + rnd(-.04, .04), 0.9 + k * 0.016, sbz + rnd(-.04, .04), null, 6).castShadow = false; }

    // ---- paper chains across the ceiling (n07) ----
    const chain = (a, b, n) => { for (let i = 0; i < n; i++){ const t = i / (n - 1); const r = new T.Mesh(new T.TorusGeometry(0.045, 0.012, 4, 8), col([0xb3241f, 0x1f5a33, 0xd9a441, 0x2f5d8a][i % 4], .7)); r.position.set(a[0] + (b[0] - a[0]) * t, a[1] - Math.sin(t * Math.PI) * 0.3, a[2] + (b[2] - a[2]) * t); r.rotation.y = i % 2 ? 0 : Math.PI / 2; r.rotation.x = Math.PI / 2 * (i % 2); K.scene.add(r); } };
    chain([LX + 0.1, H - 0.04, BZ + 0.1], [0, H - 0.04, BZ + 0.1], 22); chain([0, H - 0.04, BZ + 0.1], [RX - 0.1, H - 0.04, BZ + 0.1], 22);
    chain([LX + 0.1, H - 0.04, FZ - 0.1], [RX - 0.1, H - 0.04, FZ - 0.1], 40);
    K.key([0.0, H - 0.12, 1.4], [0.5, 0.5, -1.2], 0.55, Math.PI / 2.6);
    K.scene.add(new T.HemisphereLight(0xffe2c8, 0x2a160c, 0.34));
  },

  clues:{
    tin:{ name:'The biscuit tin', at:[0.35, 1.0, 2.25], size:[0.36, 0.26, 0.34],
      look:'A blue biscuit tin with its lid off sits on the sideboard. It is full of little slips of paper.',
      prompt:'Look at the slips of paper in the tin. What are they?', hint:'Look at the times printed at the top of each slip.', hot:[[0.04, 0.2, 0.96, 0.85]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3622'); g.fillStyle = '#2f5d8a'; g.beginPath(); g.ellipse(300, 380, 290, 60, 0, 0, Math.PI * 2); g.fill();
        const R = [['8:41 pm', 'Spinning top 12', 'Tin whistle 6', 'TOTAL 18 pence'], ['8:52 pm', 'Marbles, 3 bags', 'at 10 = 30', 'Wrapping 6', 'TOTAL 36 pence'], ['9:01 pm', 'Tin soldiers,', '6 at 8 = 48', 'Wrapping ~~~', 'TOTAL 60 pence'], ['9:14 pm', 'Sugar mice,', '4 at 3 = 12', 'TOTAL 12 pence']];
        R.forEach((r, i) => { const x = 22 + i * 145; g.save(); g.translate(x + 64, 200); g.rotate((i - 1.5) * 0.04); g.translate(-64, -160); D.paper(g, 0, 0, 128, 320, '#fbf8ee');
          D.text(g, ["CRANE'S TOYS"], 64, 14, 20, 'bold 13px Special Elite, monospace', '#222', 'center'); D.text(g, [r[0]], 64, 40, 20, 'bold 18px Special Elite, monospace', '#111', 'center');
          D.text(g, r.slice(1), 10, 82, 30, '13px Special Elite, monospace', '#222');
          if (i === 2){ g.fillStyle = 'rgba(70,70,90,.55)'; g.beginPath(); g.ellipse(80, 180, 40, 13, 0.1, 0, Math.PI * 2); g.fill(); }
          g.restore(); }); },
      kicker:'Evidence',
      html:'<p>Nora keeps her old till receipts in this biscuit tin. Here are the four from the night of the lights:</p><div class="doc type" style="font-size:13px">CRANE\'S TOYS <b>8:41 pm</b><br>Spinning top 12<br>Tin whistle 6<br>TOTAL 18 pence<br><br>CRANE\'S TOYS <b>8:52 pm</b><br>Marbles, 3 bags at 10 = 30<br>Wrapping 6<br>TOTAL 36 pence<br><br>CRANE\'S TOYS <b>9:01 pm</b><br>Tin soldiers, 6 at 8 = 48<br>Wrapping (smudged)<br>TOTAL 60 pence<br><br>CRANE\'S TOYS <b>9:14 pm</b><br>Sugar mice, 4 at 3 = 12<br>TOTAL 12 pence</div><p class="small">The till prints the time when a sale is rung up.</p>',
      note:'Four till receipts: 8:41 (18 pence), 8:52 (36 pence), 9:01 (tin soldiers, 60 pence, the wrapping line smudged) and 9:14 (12 pence).' },

    counter:{ name:'The little inside window', at:[-2.92, 0.78, -0.3], size:[0.22, 0.9, 1.06],
      look:'A little window low in the wall looks straight down into the toy shop.',
      prompt:'Look down into the shop. What can you see by the counter?', hint:'Look for something written, next to the till.', hot:[[0.46, 0.14, 0.76, 0.4]],
      draw(g, w, h, K){ const D = K.D; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#b07a42'); gr.addColorStop(1, '#6a4422'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.fillStyle = '#7a4a22'; for (let y = 0; y < h; y += 40) g.fillRect(0, y, w, 3);
        g.fillStyle = '#5a3218'; g.fillRect(60, 170, 480, 120); g.fillStyle = '#8a5a2a'; g.fillRect(50, 150, 500, 30);
        g.fillStyle = '#2a2a2c'; D.rr(g, 110, 80, 130, 80, 8); g.fill(); g.fillStyle = '#c9993f'; for (let i = 0; i < 8; i++) g.fillRect(122 + (i % 4) * 28, 92 + Math.floor(i / 4) * 24, 20, 14);
        g.fillStyle = '#f6f1df'; g.fillRect(285, 58, 160, 96); g.strokeStyle = '#8a6a3a'; g.lineWidth = 3; g.strokeRect(285, 58, 160, 96);
        D.text(g, ['GIFT WRAPPING', 'WHILE YOU WAIT', '2 pence a parcel.', 'Each parcel takes', 'me one minute.  Nora'], 365, 64, 17, '15px Caveat, cursive', '#1a2550', 'center');
        for (let i = 0; i < 4; i++){ g.fillStyle = ['#b3241f', '#1f5a33', '#d9a441', '#2f5d8a'][i]; g.fillRect(470 + (i % 2) * 34, 100 - Math.floor(i / 2) * 30, 30, 26); g.fillStyle = '#f4f1ea'; g.fillRect(483 + (i % 2) * 34, 100 - Math.floor(i / 2) * 30, 4, 26); }
        const tc = ['#b3241f', '#2f5d8a', '#1f5a33', '#d9a441']; for (let i = 0; i < 20; i++){ g.fillStyle = tc[i % 4]; g.fillRect(30 + (i % 10) * 56, 320 + Math.floor(i / 10) * 40, 30, 24); } },
      kicker:'Clue',
      html:'<p>From up here you look straight down onto the counter and the till. Beside the till stands Nora\'s little sign:</p><div class="doc hand">GIFT WRAPPING WHILE YOU WAIT<br>2 pence a parcel.<br>Each parcel takes me one minute.<br>&nbsp;&nbsp;&nbsp;&nbsp;Nora</div><div class="observe">Nora rings up a sale on the till first, then wraps.</div>',
      note:'Nora\'s sign at the counter: gift wrapping while you wait, 2 pence a parcel, one minute a parcel. She rings up first, then wraps.' },

  },

  decoys:{
    humbugs:{ name:'The jars of humbugs', at:[1.25, 1.0, 2.25], size:[0.44, 0.3, 0.3], look:'Two tall jars of striped humbugs on the sideboard. Nora does love her sweets.', close:'One jar is nearly empty. Just humbugs. Nothing out of place.' },
    mantel:{ name:'The mantelpiece', at:[2.76, 1.44, -0.3], size:[0.42, 0.3, 1.5], look:'Candles, a garland and a little framed photograph of Nora as a girl, standing with her uncle.', close:'You look behind the photograph. Only dust. Nothing out of place.' },
    cat:{ name:'The cat basket', at:[-2.3, 0.18, 1.25], size:[0.64, 0.36, 0.64], look:'Pudding, Edmund\'s old ginger cat, is curled up asleep in a basket.', close:'Pudding opens one eye, decides you are not interesting, and goes back to sleep. Nothing out of place.' },
    armchair:{ name:'The armchair', at:[2.0, 0.5, 1.0], size:[0.92, 1.0, 0.92], look:'A green armchair by the fire, with a pink cushion.', close:'Down the side of the cushion: a hairpin and a humbug wrapper. Nothing out of place.' },
    knitting:{ name:'The knitting basket', at:[1.2, 0.2, 1.55], size:[0.42, 0.36, 0.42], look:'A basket of red and cream wool with a half-knitted scarf.', close:'Just wool and needles. Nothing out of place.' },
    lamp:{ name:'The standard lamp', at:[2.6, 0.9, 2.1], size:[0.44, 1.8, 0.44], look:'A tall brass lamp with a fringed shade, glowing warmly.', close:'Nothing out of place.' },
    tree:{ name:'The little tree', at:[-2.35, 0.85, -1.85], size:[1.1, 1.7, 1.1], look:'A little tree in the corner, hung with baubles and twinkling lights.', close:'You check every branch. Nothing out of place.' },
    calendar:{ name:'The calendar', at:[-0.4, 1.5, 2.46], size:[0.38, 0.5, 0.1], look:'A Christmas calendar from Crane\'s Toys hangs on the wall.', close:'One day is circled in red: the day the shop reopens after Christmas. Nothing out of place.' },
    stockings:{ name:'The stockings', at:[2.72, 1.0, -0.3], size:[0.24, 0.5, 0.95], look:'Two stockings hang from the mantelpiece: an old red one with NORA stitched on it, and a new green one.', close:'Both are empty, waiting for Christmas morning. Nothing out of place.' },
    window:{ name:'The street window', at:[0.6, 1.45, -2.45], size:[1.4, 1.2, 0.2], look:'Across the High Street: the bakery, the boot shop and the Holly Bush Inn, all under snow.', close:'Nothing out of place.' },
    door:{ name:'The door', at:[-1.6, 1.0, 2.45], size:[0.95, 2.0, 0.12], look:'The door to the stair, which leads down behind the shop counter.', close:'Nothing out of place.' },
  },

  // ---------------------------------------------------------------- extra clue (room only, never needed)
  extras:{
    card:{ night:7, name:'A Christmas card', at:[0.82, 1.0, 2.27], size:[0.26, 0.26, 0.24],
      look:'A Christmas card stands on the sideboard, next to the biscuit tin.',
      prompt:'Open the card. Who is it from?', hint:'Read the message inside.', hot:[[0.44, 0.1, 0.94, 0.9]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3622'); g.fillStyle = '#1f4a2a'; g.fillRect(20, 30, 240, 340); g.fillStyle = '#e9e1cf'; D.star(g, 140, 140, 50); g.fillStyle = '#b3241f'; g.beginPath(); g.arc(100, 270, 18, 0, Math.PI * 2); g.arc(180, 270, 18, 0, Math.PI * 2); g.fill();
        D.paper(g, 260, 30, 300, 340, '#f8f3e4');
        D.text(g, ['Dear Nora,', 'thank you for wrapping', 'all six soldiers one', 'by one. Six whole', 'minutes of patience', 'at your counter!', '      Hilda Crisp'], 278, 52, 43, '28px Caveat, cursive', '#1a2550'); },
      text:'Mrs Crisp\'s thank-you card: "Dear Nora, thank you for wrapping all six soldiers one by one. Six whole minutes of patience at your counter! Hilda Crisp."' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[-1.86, 0.04, 1.56], rot:[-1.9, 0.35, 0.5], size:[0.26, 0.18, 0.26], seek:'Look low down, beside the basket where Pudding sleeps.' },

  clips:{
  },
  // Recorded voices go in /audio/ at the site root; if a file is missing, the phone's own voice reads the words.
  AUDIO_FILES:{  },
};
CM.start(ROOM);
