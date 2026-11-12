/* Room 7: the vestry of St Nicholas (crime scene 7). Nights 10 and 20.
   From book/content/n10.py: the vicar polishes his new boots in here; the printed switch-on programme is pinned to the vestry door,
   with the parish clerk's notes on the back. From n20.py: the tin bucket under the roof leak, the soggy robe list beside the pegs,
   robes on open pegs numbered 1 to 8 (each number sewn inside the collar), Constable Ambrose's note and Martha's robe notes.
   hidden.py: the long church ladder is kept here, with its ladder book. Robe owners are never shown: Night 20 works them out on paper.
   The printed evidence comes word for word from assets/printed.js (made by site_build.py from the night files). */
const P = window.CM_PRINTED;
const ROOM = {
  code:'r7',
  title:'The Vestry',
  subtitle:'Crime scene 7 · Night 10',
  view:{ pos:[0.4, 1.6, 1.2], yaw:0.3, pitch:-0.14 },
  previews:[0.3, 1.25, -1.15, 2.9, -2.3],
  intro:{
    kicker:'Night 10 · Crime scene 7',
    heading:'The vestry of St Nicholas',
    paras:[
      'The little room at the side of the church, where the choir robes are kept. It smells of candle wax and damp hymn books, and the roof leaks.',
      '<b>Your task:</b> search the vestry. At 9:02, was the vicar still up on the stage, and was Clara still in her box? Come back on Night 20 too: the robes matter then.',
    ],
    button:'Step into the vestry',
    sound:'Sound on if you like: tonight the clues are all things you read.',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 6.4, DP = 5.6, H = 3.2, BZ = -DP / 2, FZ = DP / 2, LX = -W / 2, RX = W / 2;
    const WIN = { u:-0.6, w:1.0, b:1.25, t:2.75 };
    const stone = K.M({ map:tex(256, 256, (g, w, h) => { g.fillStyle = '#6e665a'; g.fillRect(0, 0, w, h); for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++){ const x = c * 72 + (r % 2 ? 36 : 0) - 36, y = r * 43, v = rnd(-14, 14); g.fillStyle = D.shade('#968c78', v); g.fillRect(x + 3, y + 3, 66, 37); g.fillStyle = 'rgba(0,0,0,.06)'; for (let k = 0; k < 6; k++) g.fillRect(x + rnd(5, 60), y + rnd(5, 33), rnd(3, 9), 2); } }, [1, 1]), roughness:.95 });
    const oak = K.M({ map:tex(256, 128, (g, w, h) => { g.fillStyle = '#3e2816'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++){ const x = i * 64 + 6; g.fillStyle = '#4a311c'; g.fillRect(x, 10, 52, h - 20); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 3; g.strokeRect(x, 10, 52, h - 20); } }, [1, 1]), roughness:.7 });
    const flags = K.M({ map:tex(512, 512, (g, w, h) => { g.fillStyle = '#4e4a44'; g.fillRect(0, 0, w, h); for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++){ g.fillStyle = D.shade('#8a8274', rnd(-16, 16)); g.fillRect(c * 103 + 3 + (r % 2) * 30, r * 103 + 3, 97, 97); } for (let i = 0; i < 500; i++){ g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(rnd(0, w), rnd(0, h), 2, 2); } }, [2.5, 2.5]), roughness:.85 });
    K.shell({ w:W, d:DP, h:H, wallMat:stone, panelMat:oak, floorMat:flags, wallTile:[1.2, 0.9], panelTile:[1.0, 1.1], dado:1.1, beams:1.2, trimMat:col(0x2e1d10, .6),
      ceilMat:K.M({ map:tex(256, 256, (g, w, h) => { D.planks(g, w, h, '#4a3422', 8); const gr = g.createRadialGradient(w * .14, h * .22, 4, w * .14, h * .22, 50); gr.addColorStop(0, 'rgba(70,45,20,.85)'); gr.addColorStop(1, 'rgba(70,45,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), roughness:.9 }),
      open:{ back:[{ u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t }] } });

    // ---- back wall: the arched window onto the churchyard ----
    K.windowFrame({ side:'back', u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t, snow:true, bars:3, frame:col(0x3a3a3a, .5), panes:2 });
    for (const s of [-1, 1]){ const sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(s * WIN.w / 2, 0); sh.lineTo(s * WIN.w / 2, -0.5); sh.closePath();   // stone corners make the top a pointed arch
      const m = new T.Mesh(new T.ShapeGeometry(sh), stone); m.position.set(WIN.u, WIN.t, BZ + 0.015); K.scene.add(m); }
    K.backdrop('back', WIN.u, 1.9, 7, 12, 6, (g, w, h) => { D.night(g, w, h, '#09111f', '#283553');
      g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .62, w, h * .38); g.fillStyle = '#f2f4f8'; g.beginPath(); g.arc(w * .7, h * .18, 14, 0, Math.PI * 2); g.fill();
      for (let i = 0; i < 12; i++){ const x = w * (.05 + i * .08) + rnd(-10, 10), y = h * rnd(.62, .72); g.fillStyle = '#5a5e66'; g.fillRect(x, y - 34, 22, 34); g.beginPath(); g.arc(x + 11, y - 34, 11, Math.PI, 0); g.fill(); g.fillStyle = '#eef2f7'; g.fillRect(x - 1, y - 47, 24, 6); }
      g.fillStyle = '#101820'; g.beginPath(); g.moveTo(w * .3, h * .1); g.lineTo(w * .18, h * .64); g.lineTo(w * .42, h * .64); g.fill(); }, 1024, 512);
    K.point(0xbfd0ff, 0.25, 3, WIN.u, 1.9, BZ + 0.4);

    // ---- the leak in the roof, the tin bucket under it, and the soggy robe list beside the pegs ----
    const bk = grp(LX + 0.7, 0, -2.0); const tinM = K.M({ color:0x9aa0a6, roughness:.35, metalness:.75 });
    const bu = new T.Mesh(new T.CylinderGeometry(0.17, 0.13, 0.3, 18, 1, true), tinM); bu.position.y = 0.15; bu.castShadow = true; bu.material.side = T.DoubleSide; bk.add(bu);
    cyl(0.13, 0.13, 0.01, tinM, 0, 0.005, 0, 16, bk); const water = cyl(0.16, 0.16, 0.005, K.M({ color:0x3a4a5a, roughness:.05, metalness:.3 }), 0, 0.26, 0, 18, bk);
    const handle = new T.Mesh(new T.TorusGeometry(0.17, 0.006, 4, 16, Math.PI), mats.iron); handle.position.y = 0.3; handle.rotation.y = 0.4; bk.add(handle);
    K.drop = sph(0.012, K.M({ color:0xbfd8f0, roughness:.05, emissive:0x223344, emissiveIntensity:.3 }), LX + 0.7, H - 0.05, -2.0, null, 6); K.dropY = H - 0.05; K.keep = [K.drop];
    plane(0.4, 0.5, K.M({ map:tex(128, 160, (g, w, h) => { g.fillStyle = '#b8b2a4'; g.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++){ g.fillStyle = `rgba(60,62,70,${rnd(.05, .2)})`; g.fillRect(rnd(0, w), rnd(0, h * .6), rnd(20, 70), rnd(2, 6)); } const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(70,70,80,.0)'); gr.addColorStop(1, 'rgba(70,70,80,.45)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++){ g.fillStyle = 'rgba(80,80,90,.35)'; g.fillRect(rnd(10, w - 10), rnd(h * .4, h), 3, rnd(10, 40)); } }), roughness:.95 }), LX + 0.012, 1.62, -2.15, 0, Math.PI / 2, 0.04);
    sph(0.012, mats.brass, LX + 0.02, 1.85, -2.15, null, 6);

    // ---- left wall: the robe pegs 1 to 8, seven robes hanging (robe 7 is over the chair) ----
    box(0.05, 0.12, 3.5, col(0x2e1d10, .5), LX + 0.03, 1.9, 0.0, false);
    const robeM = col(0x7a1a22, .85), collarM = col(0xf1ece0, .8);
    for (let i = 0; i < 8; i++){ const z = -1.5 + i * 0.43; cyl(0.015, 0.015, 0.12, mats.brass, LX + 0.1, 1.86, z, 6).rotation.z = Math.PI / 2;
      plane(0.1, 0.08, K.M({ map:tex(32, 26, (g, w, h) => { g.fillStyle = '#f3ead2'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = 'bold 18px Georgia'; g.textAlign = 'center'; g.fillText(String(i + 1), 16, 20); }) }), LX + 0.065, 2.02, z, 0, Math.PI / 2, 0);
      if (i < 7){ const rb = cyl(0.11, 0.2, 1.3, robeM, LX + 0.22, 1.2, z + rnd(-.02, .02), 8); rb.scale.set(0.55, 1, 1); rb.rotation.z = rnd(-.03, .03);
        const cl = cyl(0.09, 0.11, 0.06, collarM, LX + 0.21, 1.84, z, 10); cl.scale.set(0.6, 1, 1); } }

    // ---- the vestry table: the Constable's note, the bundle in a handkerchief, the clerk's stopwatch card, hymn books ----
    const tx = -0.6, tz = -0.6, tt = 0.78;
    box(1.6, 0.07, 0.9, K.M({ map:tex(256, 128, (g, w, h) => D.wood(g, w, h, '#5a3a20', 40)), roughness:.6 }), tx, tt - 0.035, tz);
    for (const x of [-0.72, 0.72]) for (const z of [-0.37, 0.37]) box(0.08, tt - 0.07, 0.08, mats.dark, tx + x, (tt - 0.07) / 2, tz + z);
    // Ambrose's typed note
    const nt = plane(0.21, 0.28, K.M({ map:tex(128, 170, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.fillRect(10, 10, 80, 6); g.fillStyle = 'rgba(30,30,30,.7)'; for (let y = 26; y < h - 10; y += 9) g.fillRect(10, y, rnd(60, w - 20), 2.5); }), roughness:.9 }), -0.85, tt + 0.003, -0.48, -Math.PI / 2, 0, 0.15);
    // the bottle wrapped in a white handkerchief
    const hk = grp(-0.42, tt, -0.72, 0.4); const hkM = col(0xf4f1ea, .9);
    const h1 = sph(0.08, hkM, 0, 0.04, 0, hk, 10); h1.scale.set(1.3, 0.55, 1); const h2 = box(0.2, 0.004, 0.2, hkM, 0, 0.003, 0, false, hk); h2.rotation.y = 0.5;
    cyl(0.012, 0.012, 0.03, col(0x3a2410, .4), 0.08, 0.07, 0, 8, hk);
    // the parish clerk's stopwatch on a small card (extra clue for Night 10)
    plane(0.13, 0.09, K.M({ map:tex(96, 64, (g, w, h) => { g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(60,60,70,.6)'; g.lineWidth = 1.5; for (let y = 22; y < h - 8; y += 12){ g.beginPath(); g.moveTo(8, y); g.lineTo(rnd(50, 88), y); g.stroke(); } }), roughness:.9 }), -0.02, tt + 0.003, -0.4, -Math.PI / 2, 0, -0.2);
    const sw = grp(0.02, tt + 0.012, -0.44); cyl(0.032, 0.032, 0.016, K.M({ color:0xc9c9c0, roughness:.3, metalness:.8 }), 0, 0, 0, 16, sw); plane(0.05, 0.05, K.M({ map:tex(64, 64, (g) => D.clockFace(g, 32, 32, 28, 0, 10, { arabic:true, rim:'#9a9a90' })) }), 0, 0.009, 0, -Math.PI / 2, 0, 0, sw); cyl(0.006, 0.006, 0.02, mats.iron, 0, 0, -0.038, 6, sw).rotation.x = Math.PI / 2;
    const pc = cyl(0.004, 0.004, 0.14, col(0xd9a441, .5), 0.12, tt + 0.005, -0.42, 6); pc.rotation.z = Math.PI / 2; pc.rotation.y = 0.6;
    // hymn books
    for (let i = 0; i < 5; i++){ const hb = box(0.16, 0.035, 0.22, col([0x6e1f1f, 0x1f3a2c, 0x6e1f1f, 0x2f4a6b, 0x5a3a1a][i], .7), -1.18 + rnd(-.02, .02), tt + 0.018 + i * 0.036, -0.86, true); hb.rotation.y = rnd(-.15, .15); }
    // two chairs; robe 7 is laid over the back of one, with the Constable's brown label tied on
    const chair = (x, z, ry) => { const c = grp(x, 0, z, ry); const cm = col(0x4a2d19, .6); box(0.44, 0.045, 0.42, cm, 0, 0.47, 0, true, c); box(0.44, 0.55, 0.045, cm, 0, 0.77, -0.2, true, c); for (const a of [[-.19, -.18], [-.19, .18], [.19, -.18], [.19, .18]]) box(0.04, 0.47, 0.04, mats.dark, a[0], 0.235, a[1], true, c); return c; };
    chair(-1.0, 0.05, Math.PI);
    chair(0.55, -0.5, -Math.PI / 2);
    const r7 = grp(0.78, 0.0, -0.5, Math.PI / 2); box(0.46, 0.5, 0.06, robeM, 0, 0.82, 0.0, true, r7); box(0.42, 0.45, 0.05, robeM, 0, 0.62, -0.06, true, r7); box(0.46, 0.08, 0.1, collarM, 0, 1.08, -0.01, false, r7);
    box(0.4, 0.42, 0.04, robeM, 0, 0.58, 0.07, true, r7);
    plane(0.07, 0.045, K.M({ map:tex(64, 40, (g, w, h) => { g.fillStyle = '#b8935a'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a1d14'; g.font = 'bold 15px Georgia'; g.textAlign = 'center'; g.fillText('ROBE 7', 32, 26); }), side:T.DoubleSide }), 0.16, 0.92, -0.1, 0, Math.PI, -0.3, r7);
    // ---- Martha's mending basket on a stool in the corner ----
    const st = grp(LX + 0.7, 0, 2.05); box(0.4, 0.04, 0.4, col(0x5a3622, .6), 0, 0.42, 0, true, st); for (const a of [[-.16, -.16], [-.16, .16], [.16, -.16], [.16, .16]]) box(0.035, 0.42, 0.035, mats.dark, a[0], 0.21, a[1], true, st);
    const bs = new T.Mesh(new T.CylinderGeometry(0.17, 0.14, 0.13, 14, 1, true), col(0x9a7a4a, .9)); bs.position.y = 0.5; bs.material.side = T.DoubleSide; bs.castShadow = true; st.add(bs); cyl(0.14, 0.14, 0.01, col(0x9a7a4a, .9), 0, 0.445, 0, 14, st);
    sph(0.05, col(0xf1ece0, .9), -0.06, 0.54, 0.04, st, 8); sph(0.04, robeM, 0.07, 0.53, -0.05, st, 8);
    plane(0.18, 0.13, K.M({ map:tex(96, 70, (g, w, h) => { g.fillStyle = '#f3eedf'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,40,90,.6)'; g.lineWidth = 1.5; for (let y = 14; y < h - 6; y += 10){ g.beginPath(); g.moveTo(8, y); g.lineTo(rnd(50, 88), y); g.stroke(); } }), side:T.DoubleSide, roughness:.9 }), 0.0, 0.575, 0.02, -Math.PI / 2 + 0.3, 0, 0.3, st);

    // ---- back wall right: the robe cupboard; a side table with two tall candles ----
    const cb = grp(2.45, 0, BZ + 0.3); box(1.0, 2.2, 0.55, col(0x3e2816, .55), 0, 1.1, 0, true, cb); box(0.02, 1.9, 0.02, mats.dark, 0, 1.1, 0.28, false, cb); for (const x of [-0.06, 0.06]) sph(0.02, mats.brass, x, 1.1, 0.29, cb, 6);
    box(0.42, 1.6, 0.02, col(0x4a311c, .55), -0.24, 1.1, 0.28, false, cb); box(0.42, 1.6, 0.02, col(0x4a311c, .55), 0.24, 1.1, 0.28, false, cb);
    const sd = grp(0.85, 0, BZ + 0.3); box(0.6, 0.05, 0.38, col(0x4a2d19, .55), 0, 0.82, 0, true, sd); for (const x of [-0.26, 0.26]) for (const z of [-0.15, 0.15]) box(0.04, 0.8, 0.04, mats.dark, x, 0.4, z, true, sd);
    K.flames = [];
    for (const x of [-0.15, 0.15]){ cyl(0.045, 0.06, 0.03, mats.brass, x, 0.86, 0, 12, sd); cyl(0.012, 0.012, 0.22, mats.brass, x, 0.97, 0, 6, sd); cyl(0.04, 0.03, 0.03, mats.brass, x, 1.09, 0, 12, sd); cyl(0.022, 0.022, 0.3, col(0xf4ecd0, .8), x, 1.25, 0, 10, sd);
      const f = new T.Sprite(new T.SpriteMaterial({ map:tex(32, 64, (g, w, h) => { const gr = g.createRadialGradient(16, 40, 1, 16, 34, 16); gr.addColorStop(0, 'rgba(255,245,200,1)'); gr.addColorStop(1, 'rgba(255,140,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), transparent:true, blending:T.AdditiveBlending, depthWrite:false })); f.scale.set(0.05, 0.1, 1); f.position.set(0.85 + x, 1.44, BZ + 0.3); K.scene.add(f); K.flames.push(f); }
    K.candle = K.point(0xffb060, 0.9, 5, 0.85, 1.5, BZ + 0.5);

    // ---- right wall: the vestry door with the programme pinned on it, the vicar's cloak, the long ladder and its book ----
    K.door({ side:'right', u:0.2, w:1.0, h:2.2, mat:col(0x3e2816, .55), panel:0x4a311c });
    const prg = plane(0.3, 0.42, K.M({ map:tex(128, 180, (g, w, h) => { g.fillStyle = '#f6f1e0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#222'; g.lineWidth = 3; g.strokeRect(4, 4, w - 8, h - 8); g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#222'; g.fillRect(16, 16, w - 32, 8); g.fillRect(26, 28, w - 52, 5); g.fillStyle = 'rgba(30,30,30,.7)'; for (let y = 44; y < h - 18; y += 11) g.fillRect(16, y, rnd(60, w - 32), 3); g.fillStyle = '#e4dcc4'; g.beginPath(); g.moveTo(w - 4, h - 30); g.lineTo(w - 4, h - 4); g.lineTo(w - 30, h - 4); g.fill(); }), roughness:.9 }), RX - 0.122, 1.5, 0.2, 0, -Math.PI / 2, 0.02);
    sph(0.01, mats.red, RX - 0.125, 1.69, 0.2, null, 6);
    box(0.04, 0.04, 0.22, mats.dark, RX - 0.03, 1.85, 1.1, false);
    const ck = grp(RX - 0.14, 0, 1.1); const ckM = col(0x16161a, .9); const cv = cyl(0.13, 0.25, 1.2, ckM, 0, 1.22, 0, 7, ck); cv.scale.set(0.5, 1, 1); box(0.06, 0.9, 0.08, col(0x7a1a22, .9), 0.06, 1.3, 0.1, false, ck);
    // the long church ladder, leaning on the wall, and its ladder book on a nail
    const ld = grp(RX - 0.35, 0, 2.15); const lw = col(0x8a6a44, .75); const ang = Math.atan2(0.62, 2.95);
    for (const z of [-0.2, 0.2]){ const rl = box(0.06, 3.02, 0.05, lw, 0.0, 1.5, z, true, ld); rl.rotation.z = -ang; }
    for (let i = 1; i < 10; i++){ const y = i * 0.3; const rg = box(0.035, 0.035, 0.4, lw, -0.31 + y * Math.tan(ang) + 0.31 - 0.31, y, 0, true, ld); rg.position.x = (y - 1.5) * Math.tan(ang); }
    box(0.01, 0.01, 0.03, mats.iron, RX - 0.01, 1.62, 1.6, false);
    const lb = plane(0.1, 0.14, K.M({ map:tex(48, 64, (g, w, h) => { g.fillStyle = '#4a2d19'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9dcbc'; g.fillRect(8, 16, 32, 20); g.fillStyle = '#2a1d14'; g.fillRect(12, 22, 24, 3); g.fillRect(12, 28, 18, 3); }), side:T.DoubleSide }), RX - 0.012, 1.48, 1.6, 0, -Math.PI / 2, 0.05);
    cyl(0.002, 0.002, 0.12, col(0xd9c49a, 1), RX - 0.012, 1.57, 1.6, 4);

    // ---- front wall: the little stove, the vicar's chair with his polished boots ----
    const sv = grp(-1.9, 0, FZ - 0.4); box(0.46, 0.6, 0.42, mats.iron, 0, 0.36, 0, true, sv); box(0.5, 0.04, 0.46, mats.iron, 0, 0.68, 0, true, sv); cyl(0.05, 0.05, H - 0.7, mats.iron, 0, 0.7 + (H - 0.7) / 2, 0.05, 8, sv);
    plane(0.18, 0.1, new T.MeshBasicMaterial({ color:0xff8a2a }), 0, 0.34, -0.212, 0, Math.PI, 0, sv);
    K.fire(-1.9, 0.3, FZ - 0.4, 'x', 0, [0, -0.45]);
    chair(-0.9, FZ - 0.75, 0.3);
    plane(0.6, 0.45, K.M({ map:tex(128, 96, (g, w, h) => { g.fillStyle = '#e9e3d2'; g.fillRect(0, 0, w, h); g.fillStyle = '#333'; g.fillRect(8, 6, w - 16, 9); for (let c = 0; c < 3; c++) for (let y = 22; y < h - 6; y += 6) g.fillRect(8 + c * 40, y, 34, 2); }), roughness:.95 }), -0.35, 0.004, FZ - 0.85, -Math.PI / 2, 0, 0.3);
    const bootM = K.M({ color:0x0e0e10, roughness:.18, metalness:.1 });
    for (const dz of [-0.07, 0.08]){ const bt = grp(-0.38 + dz, 0, FZ - 0.85 + dz * 1.4, 0.3); box(0.1, 0.06, 0.28, bootM, 0, 0.03, 0.02, true, bt); box(0.09, 0.2, 0.11, bootM, 0, 0.14, -0.06, true, bt); }
    cyl(0.04, 0.04, 0.025, col(0x222226, .4, .5), -0.12, 0.0125, FZ - 0.7, 12); box(0.06, 0.04, 0.12, col(0x6b4423, .7), -0.16, 0.02, FZ - 0.98, true);

    // the hymn board and an old photograph of the choir on the front wall
    const hbd = grp(0.9, 1.75, FZ - 0.04, Math.PI); box(0.5, 0.8, 0.04, col(0x3e2816, .55), 0, 0, 0, false, hbd);
    plane(0.4, 0.66, K.M({ map:tex(96, 160, (g, w, h) => { g.fillStyle = '#2a1a0e'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9e1cf'; g.font = 'bold 26px Georgia'; g.textAlign = 'center'; ['34', '17', '112', '86'].forEach((n, i) => { g.fillRect(12, 14 + i * 36, 72, 28); g.fillStyle = '#2a1a0e'; g.fillText(n, 48, 37 + i * 36); g.fillStyle = '#e9e1cf'; }); }) }), 0, 0, 0.022, 0, 0, 0, hbd);
    const ph = grp(-0.4, 1.7, FZ - 0.03, Math.PI); box(0.62, 0.46, 0.03, col(0x6b4a2a, .4), 0, 0, 0, false, ph);
    plane(0.54, 0.38, K.M({ map:tex(128, 90, (g, w, h) => { g.fillStyle = '#b8a888'; g.fillRect(0, 0, w, h); g.fillStyle = '#6a5a44'; for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++){ g.beginPath(); g.arc(22 + i * 28 + r * 12, 34 + r * 24, 7, 0, Math.PI * 2); g.fill(); g.fillRect(14 + i * 28 + r * 12, 40 + r * 24, 16, 18); } g.fillStyle = '#4a3a2a'; g.fillRect(0, 80, w, 10); }), roughness:.7 }), 0, 0, 0.017, 0, 0, 0, ph);
    // ---- lights: candles, a hanging lantern, the key light ----
    cyl(0.006, 0.006, 0.5, mats.iron, 0.0, H - 0.25, 0.2, 4); box(0.16, 0.22, 0.16, K.M({ color:0x2a2a2a, roughness:.5, metalness:.5 }), 0.0, H - 0.6, 0.2, false);
    box(0.12, 0.16, 0.12, new T.MeshBasicMaterial({ color:0xffd8a0 }), 0.0, H - 0.6, 0.2, false).castShadow = false;
    K.point(0xffd2a0, 0.75, 9, 0.0, H - 0.8, 0.2);
    K.holly(RX - 0.08, 2.4, 0.2, 1.4);
    K.key([0.6, H - 0.15, 1.5], [-0.6, 0.6, -0.8], 0.6, Math.PI / 2.8);
    K.scene.add(new T.HemisphereLight(0xffe2c0, 0x1e140c, 0.3));
  },
  tick(t, K){
    if (K.drop){ const k = (t * 0.7) % 1; K.drop.position.y = K.dropY - k * k * (K.dropY - 0.27); K.drop.visible = k < 0.97; }
    if (K.flames) K.flames.forEach((f, i) => { f.scale.y = 0.09 + Math.sin(t * 11 + i * 2) * 0.012 + Math.random() * 0.008; });
    if (K.candle) K.candle.intensity = 0.85 + Math.sin(t * 9) * 0.08 + Math.random() * 0.06;
  },

  // ---------------------------------------------------------------- clues (printed evidence word for word, from assets/printed.js)
  clues:{
    programme:{ name:'The programme on the door', at:[3.05, 1.5, 0.2], size:[0.1, 0.46, 0.36], reveal:true,
      look:'The printed programme for the switch-on is pinned to the vestry door with a single drawing pin.',
      prompt:'Read the programme. Is there anything more to it?', hint:'Lift the bottom corner and look at the back.', hot:[[0.7, 0.72, 0.98, 0.98]],
      draw(g, w, h, K, open){ const D = K.D; D.wood(g, w, h, '#3e2816'); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, 0, w, h);
        if (!open){ D.paper(g, 120, 12, 360, 376, '#f6f1e0'); g.strokeStyle = '#222'; g.lineWidth = 4; g.strokeRect(132, 24, 336, 352); g.lineWidth = 1.5; g.strokeRect(140, 32, 320, 336);
          D.text(g, ['THIMBLEBY GREEN', 'SWITCHING ON THE', 'CHRISTMAS LIGHTS'], 300, 44, 22, 'bold 19px Georgia', '#111', 'center');
          D.text(g, ['A quarter to nine: the choir.', 'Carol: Hark the Herald.', 'A welcome from the Reverend.', 'THE LIGHTS!', 'Carol: Silent Night.', 'Carol: Ding Dong Merrily.', 'More carols. Mince pies!'], 158, 130, 30, '15px Georgia', '#222');
          g.fillStyle = '#e2d8bc'; g.beginPath(); g.moveTo(480, 330); g.lineTo(480, 388); g.lineTo(420, 388); g.closePath(); g.fill(); g.fillStyle = '#cfc4a6'; g.beginPath(); g.moveTo(480, 330); g.quadraticCurveTo(452, 352, 420, 388); g.lineTo(446, 362); g.closePath(); g.fill();
          g.fillStyle = 'rgba(30,40,90,.5)'; g.font = '16px Caveat, cursive'; g.fillText('How it r...', 430, 382); }
        else { D.paper(g, 120, 12, 360, 376, '#efe8d4');
          D.text(g, ['How it really went:', 'Hark the Herald ended two minutes', 'before the lights came on.', 'The Reverend climbed onto the stage', 'just as his welcome began, and came', 'down five minutes after the lights.', 'Ding Dong began one minute after', 'Silent Night ended.', 'Miss Wren stepped into the box at', 'a quarter to nine and never stepped', 'out until half past nine.'], 138, 30, 32, '22px Caveat, cursive', '#1a2550'); } },
      kicker:'Evidence', title:'The Switch-on Programme',
      html:'<p>The printed programme, pinned to the vestry door:</p>' + P.n10.a + '<p>On the back, the parish clerk has scribbled notes about how the evening really ran:</p>' + P.n10.b,
      note:'Switch-on programme: Hark the Herald (8 minutes); the Reverend\'s welcome (5 minutes), followed at once by the lights at nine; Silent Night (8 minutes), begun as the lights came on; Ding Dong Merrily (7 minutes). The clerk\'s notes: Hark the Herald ended two minutes before the lights; the Reverend went up as his welcome began and came down five minutes after the lights; Ding Dong began one minute after Silent Night ended; Miss Wren was in her box from a quarter to nine until half past nine.' },

    ambrose:{ name:'A typed note on the table', at:[-0.85, 0.82, -0.48], size:[0.3, 0.1, 0.34],
      look:'A typed note lies on the vestry table, signed by Constable Ambrose.',
      prompt:'Read the note. What does the vicar remember?', hint:'Look at the two lines at the bottom.', hot:[[0.08, 0.66, 0.92, 0.94]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3a20'); D.paper(g, 60, 10, 480, 380, '#f6f2e6');
        D.text(g, ['Constable Ambrose: vestry note'], 80, 26, 24, 'bold 17px Special Elite, monospace', '#111');
        D.text(g, ['Brown bottle, empty. Label:', '"A. Pell. One spoon at bedtime."', 'Found by Martha Dobbs in the', 'right-hand pocket of robe 7.', 'The robes hang on open pegs.'], 80, 62, 27, '16px Special Elite, monospace', '#222');
        D.text(g, ['What the vicar remembers:', '- The bass wears the highest number.', '- June Quill is four less than Hector.'], 80, 284, 28, '16px Special Elite, monospace', '#222'); },
      kicker:'Evidence', title:'Constable Ambrose\'s vestry note',
      html:P.n20.a,
      note:'Constable Ambrose: the empty bottle, "A. Pell. One spoon at bedtime.", was in the right-hand pocket of robe 7. The robes hang on open pegs. The vicar remembers: the bass always wears the highest number; June Quill\'s number is exactly four less than Hector Quill\'s.' },

    martha:{ name:'Martha\'s mending basket', at:[-2.5, 0.58, 2.05], size:[0.4, 0.22, 0.4],
      look:'A mending basket sits on a stool in the corner, with white thread, a needle and a folded sheet of notes on top.',
      prompt:'Read Martha\'s notes. What does she remember?', hint:'Read every line of her list.', hot:[[0.08, 0.2, 0.94, 0.9]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#9a7a4a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++){ g.strokeStyle = 'rgba(70,50,20,.4)'; g.beginPath(); g.moveTo(0, i * 10); g.lineTo(w, i * 10 + 6); g.stroke(); } D.paper(g, 50, 16, 500, 368, '#f3eedf', -0.01);
        D.text(g, ['Martha Dobbs: what I remember', 'about the robes'], 70, 30, 30, 'bold 25px Caveat, cursive', '#1a2550');
        D.text(g, ['The conductor always wears robe 1.', 'The two tenors wear numbers next to', 'each other. They like to stand together.', 'Albert\'s number is one more than', 'Rose Ambrose\'s.', 'My own number is lower than Ivy Tully\'s.'], 80, 112, 42, '25px Caveat, cursive', '#1a2550'); },
      kicker:'Evidence', title:'Martha\'s robe notes',
      html:P.n20.b,
      note:'Martha remembers: the conductor always wears robe 1; the two tenors wear numbers next to each other; Albert\'s number is one more than Rose Ambrose\'s; her own number is lower than Ivy Tully\'s.' },

    bottle:{ name:'A bundle in a handkerchief', at:[-0.42, 0.84, -0.72], size:[0.28, 0.14, 0.28], reveal:true,
      look:'Something small is wrapped in a white handkerchief on the table.',
      prompt:'Unwrap it carefully. What is inside?', hint:'Tap the middle of the bundle.', hot:[[0.3, 0.26, 0.72, 0.78]],
      draw(g, w, h, K, open){ const D = K.D; D.wood(g, w, h, '#5a3a20'); g.fillStyle = '#f4f1ea';
        if (!open){ g.beginPath(); g.ellipse(300, 210, 170, 110, 0.2, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(150,140,120,.6)'; g.lineWidth = 3; for (let i = 0; i < 5; i++){ g.beginPath(); g.moveTo(170 + i * 50, 140); g.quadraticCurveTo(220 + i * 40, 210, 190 + i * 55, 290); g.stroke(); } }
        else { g.beginPath(); g.moveTo(60, 90); g.lineTo(520, 40); g.lineTo(560, 340); g.lineTo(90, 380); g.closePath(); g.fill(); g.save(); g.translate(300, 210); g.rotate(-0.25); g.fillStyle = '#5a2e10'; D.rr(g, -120, -55, 240, 110, 30); g.fill(); g.fillRect(120, -22, 50, 44); g.fillStyle = '#2a1508'; g.fillRect(166, -26, 26, 52); g.fillStyle = '#f3ead2'; g.fillRect(-80, -40, 160, 80); D.text(g, ['A. Pell.', 'One spoon at', 'bedtime.'], 0, -34, 24, '21px Caveat, cursive', '#1a2550', 'center'); g.restore(); } },
      kicker:'Clue', title:'The brown bottle',
      html:'<p>Inside the handkerchief is a small brown bottle. It is <b>empty</b>.</p><div class="doc hand">A. Pell. One spoon at bedtime.</div><div class="observe">Martha found it in the right-hand pocket of robe 7 when she took the robes down for washing.</div>',
      note:'The brown bottle, empty: "A. Pell. One spoon at bedtime." Martha found it in the right-hand pocket of robe 7.' },
  },

  // ---------------------------------------------------------------- extra clues (room only, never needed: one for each night)
  extras:{
    stopwatch:{ night:10, name:'A card under a stopwatch', at:[0.0, 0.82, -0.42], size:[0.28, 0.1, 0.24],
      look:'A stopwatch lies on a small card at the end of the table, beside a pencil.',
      prompt:'Lift the stopwatch and read the card. What did someone time?', hint:'Read the pencil lines on the card.', hot:[[0.1, 0.36, 0.9, 0.82]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3a20'); D.paper(g, 70, 60, 460, 300, '#efe6cf', 0.02); g.save(); g.translate(500, 60); D.clockFace(g, 0, 0, 52, 0, 10, { arabic:true, rim:'#9a9a90' }); g.restore();
        D.text(g, ['Reverend up 8:55, down 9:05.', 'Miss Wren in her box', 'throughout.'], 100, 170, 46, '32px Caveat, cursive', 'rgba(50,50,60,.85)'); },
      text:'The parish clerk\'s stopwatch card on the vestry table: "Reverend up 8:55, down 9:05. Miss Wren in her box throughout."' },

    robe7:{ night:20, name:'The robe over the chair', at:[0.8, 0.85, -0.5], size:[0.2, 0.5, 0.5],
      look:'One choir robe has been taken down and laid over the back of a chair, with a brown label tied on: ROBE 7.',
      prompt:'Look inside the collar. Is anything written there?', hint:'Look just under the sewn number.', hot:[[0.36, 0.56, 0.66, 0.8]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#7a1a22'; g.fillRect(0, 0, w, h); for (let i = 0; i < 30; i++){ g.strokeStyle = 'rgba(40,5,10,.3)'; g.lineWidth = 3; g.beginPath(); g.moveTo(i * 22, 0); g.quadraticCurveTo(i * 22 + 10, h / 2, i * 22 - 6, h); g.stroke(); }
        g.fillStyle = '#f1ece0'; g.beginPath(); g.ellipse(300, 200, 230, 150, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#e6dfcf'; g.beginPath(); g.ellipse(300, 200, 190, 115, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#f8f4ea'; g.fillRect(250, 150, 100, 60); g.strokeStyle = '#8a7a5a'; g.lineWidth = 2; g.strokeRect(250, 150, 100, 60); D.text(g, ['7'], 300, 152, 50, 'bold 48px Georgia', '#7a1a22', 'center');
        D.text(g, ['J.L.'], 300, 238, 30, '26px Caveat, cursive', 'rgba(80,80,90,.45)', 'center'); },
      text:'Inside the collar of robe 7, under the number, faint pencil initials: "J.L."' },
  },

  // ---------------------------------------------------------------- the rest: things to look at
  decoys:{
    pegs:{ name:'The robe pegs', at:[-3.0, 1.25, -0.0], size:[0.4, 1.5, 3.4], look:'Eight pegs in a row, numbered 1 to 8. Seven choir robes hang on them.', close:'After the carols the choir hang their robes on any peg, so the peg numbers tell you nothing. Each robe has its own number sewn inside the collar. Nothing out of place.' },
    robelist:{ name:'The robe list', at:[-3.15, 1.62, -2.15], size:[0.1, 0.56, 0.46], look:'A sheet of paper is pinned to the wall beside the pegs.', close:'It was the list of who wears which robe. The leak has turned it into a soggy grey smear, and not one name can be read. Nothing more to find here.' },
    bucket:{ name:'The tin bucket', at:[-2.5, 0.17, -2.0], size:[0.4, 0.36, 0.4], look:'A tin bucket stands on the flagstones under a brown stain in the ceiling. Drip. Drip. Drip.', close:'Nearly full of cold rainwater from the leaking roof. Nothing out of place.' },
    boots:{ name:'The vicar\'s boots', at:[-0.36, 0.12, 1.95], size:[0.42, 0.26, 0.42], look:'A pair of smart new black boots stands on a sheet of newspaper, with a tin of polish and a brush.', close:'Polished until they shine: the same smart boots the choir bought. The vicar is very proud of them. Nothing out of place.' },
    hymns:{ name:'The hymn books', at:[-1.18, 0.88, -0.86], size:[0.26, 0.22, 0.3], look:'A pile of hymn books on the corner of the table.', close:'Damp and well thumbed. They smell of the old vestry. Nothing out of place.' },
    candles:{ name:'The candles', at:[0.85, 1.1, -2.5], size:[0.6, 0.6, 0.4], look:'Two tall candles burn in brass candlesticks on a little side table.', close:'Beeswax, burning low. The whole vestry smells of candle wax. Nothing out of place.' },
    ladder:{ name:'The long church ladder', at:[2.95, 0.95, 1.95], size:[0.5, 1.8, 0.95], look:'A very long wooden ladder leans against the wall, with a little book hanging on a nail beside it.', close:'It is the only ladder in the village long enough to reach the top of the great tree on the green. Whoever borrows it signs the ladder book. Nothing out of place.' },
    cupboard:{ name:'The robe cupboard', at:[2.45, 1.1, -2.5], size:[1.0, 2.2, 0.6], look:'A tall oak cupboard stands against the wall.', close:'Spare candles, a box of matches, clean white collars and the Christmas service sheets. Nothing out of place.' },
    window:{ name:'The vestry window', at:[-0.6, 2.0, -2.75], size:[1.1, 1.5, 0.2], look:'A narrow arched window looks out over the snowy churchyard.', close:'The old gravestones wear caps of snow. The toy shop yard is only a short walk across the churchyard from here. Nothing out of place.' },
    cloak:{ name:'The vicar\'s cloak', at:[3.06, 1.25, 1.1], size:[0.3, 1.2, 0.5], look:'A heavy black cloak and a red scarf hang on a hook by the door.', close:'In the pocket: a packet of mints and the hymn numbers for Sunday. Nothing out of place.' },
    stove:{ name:'The stove', at:[-1.9, 0.4, 2.4], size:[0.56, 0.8, 0.52], look:'A small iron stove takes the chill off the vestry.', close:'A few coals glow inside. Nothing out of place.' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[2.96, 2.175, 2.12], rot:[0, -Math.PI / 2, 0.2], seek:'Look up the long ladder that leans against the wall.' },

  clips:{},
  AUDIO_FILES:{},
};
CM.start(ROOM);
