/* Room 9: the green on Christmas Eve (crime scene 9). Night 24.
   From book/content/n24.py: lanterns on every stall, chestnuts roasting, the stage lit as on the night of the switch-on, the
   Midnight Music Box silent on a velvet cushion, the six suspects in a row below the stage (here: six name cards on the stage
   edge, no people), the brass band with its trumpets lowered. From hidden.py: the great tree is ready for midnight, but its gold
   star is missing; the empty top of the tree is where The Hidden Case is answered (the engine checks the answer by its hash).
   North is -z: the stage stands at the north end of the green, with the High Street and the Holly Bush Inn behind it. */
const P = window.CM_PRINTED;
const ROOM = {
  code:'r9',
  title:'The Green on Christmas Eve',
  subtitle:'Crime scene 9 · Night 24',
  bg:0x0b1322, exposure:1.08,
  view:{ pos:[0.0, 1.6, 4.0], yaw:-0.12, pitch:-0.16, fovPortrait:80 },
  previews:[-0.12, 0.8, -0.62, -1.5, 2.9],
  intro:{
    kicker:'Night 24 · Crime scene 9',
    heading:'The green on Christmas Eve',
    paras:[
      'The whole village has come out into the snow. Lanterns hang from every stall, and on the stage the Midnight Music Box sits silent on a velvet cushion. Six name cards mark where the six suspects stood.',
      '<b>Your task:</b> gather your case notes, then name the killer, with three proofs.',
      'Look up at the great tree too: its gold star is missing. Tap the empty top of the tree to answer The Hidden Case.',
    ],
    button:'Step onto the green',
    sound:'Sound on if you like: tonight the clues are all things you read.',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const S = K.scene; S.fog = new T.FogExp2(0x0b1322, 0.03);
    const snowMat = K.M({ map:tex(256, 256, (g, w, h) => { D.snow(g, w, h); for (let i = 0; i < 160; i++){ g.fillStyle = `rgba(120,135,160,${rnd(.04, .12)})`; g.beginPath(); g.ellipse(rnd(0, w), rnd(0, h), rnd(4, 10), rnd(2, 6), rnd(0, 3), 0, Math.PI * 2); g.fill(); } }, [26, 26]), roughness:1 });
    const ground = new T.Mesh(new T.PlaneGeometry(120, 120), snowMat); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; S.add(ground);
    // the sky all round (u 0 west, .25 south, .5 east, .75 north): stars, the church tower to the west, the village rooftops low on the horizon
    const sky = new T.Mesh(new T.SphereGeometry(58, 32, 16), new T.MeshBasicMaterial({ side:T.BackSide, fog:false, map:tex(2048, 1024, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h * .5); gr.addColorStop(0, '#03060d'); gr.addColorStop(.8, '#0e1a32'); gr.addColorStop(1, '#26344f'); g.fillStyle = gr; g.fillRect(0, 0, w, h * .5); g.fillStyle = '#0d1220'; g.fillRect(0, h * .5, w, h * .5);
      for (let i = 0; i < 600; i++){ g.fillStyle = `rgba(255,255,255,${rnd(.25, .85)})`; g.fillRect(rnd(0, w), rnd(0, h * .45), rnd(1, 2.2), rnd(1, 2.2)); }
      const house = (x, bw, hh) => { const y0 = h * .5, top = y0 - hh; g.fillStyle = '#141a28'; g.fillRect(x, top, bw, hh); g.beginPath(); g.moveTo(x - 3, top + 1); g.lineTo(x + bw / 2, top - hh * .45); g.lineTo(x + bw + 3, top + 1); g.fill(); g.fillStyle = '#c9d2e0'; g.beginPath(); g.moveTo(x - 3, top + 1); g.lineTo(x + bw / 2, top - hh * .45); g.lineTo(x + bw / 2, top - hh * .45 + 4); g.lineTo(x - 1, top + 4); g.fill(); if (Math.random() < .7){ g.fillStyle = 'rgba(255,205,125,.85)'; g.fillRect(x + bw * .3, top + hh * .35, 5, 6); } };
      for (let x = 0; x < w; x += rnd(36, 64)) house(x, rnd(26, 42), rnd(14, 26));
      const tx = w * .015; g.fillStyle = '#141a26'; g.fillRect(tx, h * .5 - 70, 26, 70); g.beginPath(); g.moveTo(tx - 2, h * .5 - 70); g.lineTo(tx + 13, h * .5 - 110); g.lineTo(tx + 28, h * .5 - 70); g.fill(); g.fillStyle = '#dfe6f0'; g.fillRect(tx - 2, h * .5 - 72, 30, 4);
      g.globalAlpha = 1; }) })); sky.position.y = 1.6; S.add(sky);
    const glowT = tex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(255,210,130,.9)'); gr.addColorStop(1, 'rgba(255,210,130,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    const glow = (x, y, z, s, c) => { const sp = new T.Sprite(new T.SpriteMaterial({ map:glowT, color:c || 0xffffff, transparent:true, depthWrite:false, blending:T.AdditiveBlending })); sp.scale.set(s, s, 1); sp.position.set(x, y, z); S.add(sp); return sp; };
    const lampM = new T.MeshBasicMaterial({ color:0xffd08a });

    // ---------------- the stage, with the music box on its velvet cushion and six name cards along the edge ----------------
    K.keep = [];
    const deck = K.M({ map:tex(256, 128, (g, w, h) => D.planks(g, w, h, '#6a4a2c', 6), [3, 2]), roughness:.75 });
    box(7.0, 1.0, 3.0, deck, 0, 0.5, -3.5);
    plane(7.0, 0.96, K.M({ map:tex(512, 64, (g, w, h) => { g.fillStyle = '#7a1520'; g.fillRect(0, 0, w, h); for (let i = 0; i < 32; i++){ g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(i * 16, 0, 3, h); } g.fillStyle = '#e9c45a'; g.fillRect(0, 4, w, 3); }), roughness:.8 }), 0, 0.5, -1.985);
    for (let i = 0; i < 3; i++) box(0.7, 0.33 * (i + 1), 0.4, deck, 4.0, 0.165 * (i + 1), -2.2 - i * 0.4);
    for (const x of [-3.35, 3.35]){ box(0.12, 3.4, 0.12, mats.dark, x, 2.7, -4.9); }
    box(6.82, 0.12, 0.12, mats.dark, 0, 4.4, -4.9);
    plane(3.6, 0.6, K.M({ map:tex(512, 90, (g, w, h) => { g.fillStyle = '#1f3a2c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e9c45a'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#f4ead4'; g.font = 'bold 40px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('A HAPPY CHRISTMAS', w / 2, h / 2 + 2); }), roughness:.8, side:T.DoubleSide }), 0, 3.95, -4.88);
    const bc = [0xff4040, 0xffd36b, 0x6bd3ff, 0xff8ad0, 0x9cff6b]; const bulbPts = [];
    for (const [y, sag] of [[4.3, 0.3], [3.4, 0.25]]) for (let i = 0; i <= 30; i++){ const t = i / 30; bulbPts.push([-3.35 + 6.7 * t, y - Math.sin(t * Math.PI) * sag, -4.85, i % 4, 0.45]); }
    K.garland([-3.5, 1.02, -2.0], [3.5, 1.02, -2.0], 26);
    for (const x of [-4.1, 4.6]){ cyl(0.05, 0.07, 3.2, mats.iron, x, 1.6, -1.7, 6); const lh = box(0.3, 0.22, 0.3, mats.iron, x, 3.25, -1.75, false); box(0.24, 0.12, 0.05, lampM, x, 3.2, -1.9, false); glow(x, 3.2, -1.95, 1.6); }
    K.point(0xffd8a8, 1.1, 9, 0, 3.2, -1.2);
    // the table, the velvet cushion and the Midnight Music Box (silent)
    const tb = grp(0, 1.0, -3.3); box(0.7, 0.05, 0.6, col(0x3b2414, .5), 0, 0.72, 0, true, tb); for (const x of [-0.3, 0.3]) for (const z of [-0.25, 0.25]) box(0.05, 0.7, 0.05, mats.dark, x, 0.35, z, true, tb);
    box(0.78, 0.04, 0.68, col(0x1f3a2c, .9), 0, 0.755, 0, false, tb);
    const cu = box(0.56, 0.09, 0.46, col(0x6a1222, .95), 0, 0.82, 0, true, tb); for (const [x, z] of [[-0.28, -0.23], [0.28, -0.23], [-0.28, 0.23], [0.28, 0.23]]) sph(0.02, mats.gold, x, 0.84, z, tb, 6);
    const mb = grp(0, 0.865, 0, -0.2, tb); const mbM = K.M({ color:0x3b2414, roughness:.35 });
    const lidTex = tex(256, 192, (g, w, h) => { g.fillStyle = '#1d2a4f'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9c45a'; for (let i = 0; i < 26; i++) D.star(g, rnd(10, w - 10), rnd(10, h - 10), rnd(3, 7)); D.star(g, w / 2, h / 2, 28); g.strokeStyle = '#e9c45a'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); });
    box(0.42, 0.2, 0.3, mbM, 0, 0.1, 0, true, mb); box(0.44, 0.012, 0.32, mats.brass, 0, 0.2, 0, false, mb); box(0.43, 0.05, 0.31, [mbM, mbM, K.M({ map:lidTex, roughness:.4 }), mbM, mbM, mbM], 0, 0.232, 0, true, mb);
    for (const x of [-0.2, 0.2]) for (const z of [-0.14, 0.14]) box(0.03, 0.27, 0.03, mats.brass, x, 0.13, z, false, mb);
    box(0.16, 0.05, 0.02, mats.brass, 0, 0.05, 0.155, false, mb);
    // six name cards, where the six suspects stood
    const names = ['Nora Crane', 'Felix Marlow', 'Agnes Pell', 'Reverend Greer', 'Clara Wren', 'Jasper Lowe'];
    names.forEach((n, i) => { const cg = grp(-2.5 + i, 1.0, -2.15); const ct = tex(160, 64, (g, w, h) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8e1f1f'; g.lineWidth = 3; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = '#1a2550'; g.font = '22px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n, w / 2, h / 2 + 1); });
      const f = plane(0.3, 0.12, K.M({ map:ct, roughness:.9 }), 0, 0.055, 0.03, -0.35, 0, 0, cg); const b = plane(0.3, 0.12, mats.paper, 0, 0.055, -0.03, 0.35, Math.PI, 0, cg); });
    // the black choir glove on the edge of the stage (extra clue)
    const gl = grp(3.15, 1.01, -2.2, 0.7); const gM = K.M({ color:0x121214, roughness:.6 });
    box(0.09, 0.02, 0.1, gM, 0, 0, 0, true, gl); for (let i = 0; i < 4; i++) box(0.018, 0.016, 0.065, gM, -0.033 + i * 0.022, 0, -0.08, true, gl);
    const th = box(0.02, 0.016, 0.05, gM, 0.058, 0, -0.02, true, gl); th.rotation.y = -0.6; box(0.016, 0.004, 0.02, col(0xf6f6f0, .5), 0.066, 0.01, -0.035, false, gl);

    // ---------------- your case notes, in a folder on the bench in front of the stage ----------------
    const bn = grp(0, 0, 1.6); const bm = col(0x5a3a22, .7); box(3.2, 0.06, 0.42, bm, 0, 0.45, 0, true, bn); for (const x of [-1.4, 1.4]) box(0.08, 0.45, 0.36, mats.dark, x, 0.225, 0, true, bn); box(3.24, 0.05, 0.44, mats.snow, 0, 0.485, 0.0, false, bn).scale.set(1, 1, 0.3);
    box(1.6, 0.012, 0.42, col(0x9a7a4a, .8), 0, 0.49, 0.0, true);
    for (const x of [-0.42, 0.42]) plane(0.3, 0.38, K.M({ map:tex(96, 128, (g, w, h) => { g.fillStyle = '#f6f2e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.fillRect(10, 8, 60, 6); g.fillStyle = 'rgba(30,30,30,.65)'; for (let y = 22; y < h - 8; y += 9){ g.fillRect(8, y, 3, 3); g.fillRect(14, y, rnd(40, w - 22), 2.5); } }), roughness:.9 }), x, 0.5, 1.6 + (x < 0 ? 0.01 : -0.01), -Math.PI / 2, 0, x < 0 ? 0.05 : -0.06);

    // ---------------- the great tree, ready for midnight: its top is empty ----------------
    const TX = 7.0, TZ = -7.5; const tg = grp(TX, 0, TZ); const needle = col(0x173f23, .9);
    cyl(0.3, 0.4, 1.4, col(0x3a2415, .9), 0, 0.7, 0, 8, tg);
    for (let i = 0; i < 6; i++){ const c = new T.Mesh(new T.ConeGeometry(2.7 - i * 0.42, 2.0, 12), needle); c.position.y = 1.7 + i * 1.12; c.castShadow = true; tg.add(c); const sn = new T.Mesh(new T.ConeGeometry(2.0 - i * 0.33, 0.5, 12), mats.snow); sn.position.y = 2.25 + i * 1.12; sn.scale.set(1, 0.5, 1); tg.add(sn); }
    cyl(0.012, 0.02, 0.5, mats.brass, 0, 8.55, 0, 6, tg);   // the bare spike where the star should be
    for (let i = 0; i < 44; i++){ const t = i / 44, y = 1.2 + t * 6.6, r = (1 - t) * 2.5 + 0.25, a = i * 2.4; bulbPts.push([TX + Math.cos(a) * r, y, TZ + Math.sin(a) * r, i % 5, 1]); }
    K.bulbMats = []; const bgeo = new T.SphereGeometry(0.07, 6, 4), m4 = new T.Matrix4();
    bc.forEach((c, ci) => { const list = bulbPts.filter(q => q[3] === ci); if (!list.length) return; const mat = new T.MeshStandardMaterial({ color:c, emissive:c, emissiveIntensity:1.2 });
      const im = new T.InstancedMesh(bgeo, mat, list.length); list.forEach((q, i) => { m4.makeScale(q[4], q[4], q[4]); m4.setPosition(q[0], q[1], q[2]); im.setMatrixAt(i, m4); }); im.instanceMatrix.needsUpdate = true; im.frustumCulled = false; S.add(im); K.bulbMats.push(mat); K.keep.push(im); });
    const baub = [col(0xb3241f, .25, .6), col(0x2f5d8a, .25, .6), col(0xe9e1cf, .25, .6), col(0xd9a441, .25, .6)];
    for (let i = 0; i < 26; i++){ const t = Math.random(), y = 1.4 + t * 6.0, r = (1 - t) * 2.35 + 0.3, a = rnd(0, Math.PI * 2); sph(0.13, baub[i % 4], TX + Math.cos(a) * r, y, TZ + Math.sin(a) * r, null, 10); }
    // the star, hidden until The Hidden Case is solved
    const shp = new T.Shape(); for (let i = 0; i < 10; i++){ const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 0.22 : 0.5; const x = Math.cos(a) * rr, y = Math.sin(a) * rr; if (i) shp.lineTo(x, y); else shp.moveTo(x, y); }
    const sgeo = new T.ExtrudeGeometry(shp, { depth:0.08, bevelEnabled:true, bevelThickness:0.03, bevelSize:0.03, bevelSegments:1 }); sgeo.center();
    K.bigStarMat = K.M({ color:0xf3c24a, roughness:.25, metalness:.5, emissive:0xffb020, emissiveIntensity:1.2 });
    K.bigStar = new T.Mesh(sgeo, K.bigStarMat); K.bigStar.position.set(TX, 9.05, TZ); K.bigStar.visible = false; S.add(K.bigStar);
    K.bigGlow = glow(TX, 9.05, TZ, 0.01); K.keep.push(K.bigStar); K.starLight = K.point(0xffcf70, 0.0, 14, TX, 8.8, TZ + 0.7);

    // ---------------- the stalls, with lanterns: mince pies, hot chestnuts, holly ----------------
    const stall = (x, z, ry, c, sign, extra) => { const s = grp(x, 0, z, ry); box(2.2, 1.0, 0.8, col(0x6b4423, .7), 0, 0.5, 0, true, s); box(2.3, 0.06, 0.9, col(0x8a6440, .6), 0, 1.03, 0, true, s); box(2.2, 2.4, 0.06, col(0x4a2d19, .7), 0, 1.2, -0.45, true, s);
      for (const px of [-1.05, 1.05]) box(0.08, 2.5, 0.08, mats.dark, px, 1.25, 0.4, true, s);
      const roof = box(2.5, 0.06, 1.3, K.M({ map:tex(128, 64, (g, w, h) => { for (let i = 0; i < 8; i++){ g.fillStyle = i % 2 ? '#f4ead4' : c; g.fillRect(i * 16, 0, 16, h); } }), roughness:.8 }), 0, 2.55, 0.0, true, s); roof.rotation.x = 0.25; box(2.5, 0.05, 1.3, mats.snow, 0, 2.6, -0.02, false, s).rotation.x = 0.25;
      plane(1.4, 0.32, K.M({ map:tex(256, 60, (g, w, h) => { g.fillStyle = '#f4ead4'; g.fillRect(0, 0, w, h); g.strokeStyle = c; g.lineWidth = 4; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = '#2a1d14'; g.font = 'bold 26px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sign, w / 2, h / 2 + 1); }), roughness:.8 }), 0, 2.1, -0.41, 0, 0, 0, s);
      for (const px of [-0.9, 0.9]){ box(0.12, 0.16, 0.12, lampM, px, 2.15, 0.45, false, s); }
      if (extra) extra(s); return s; };
    const lanternGlow = (s, px) => { const v = new T.Vector3(px, 2.15, 0.45); s.localToWorld(v); glow(v.x, v.y, v.z, 0.9); };
    const s1 = stall(-7.0, -1.5, Math.PI / 2, '#8e1f1f', 'MINCE PIES', (s) => { for (let i = 0; i < 8; i++){ const p = cyl(0.06, 0.05, 0.035, col(0xc88a4a, .8), -0.6 + (i % 4) * 0.18, 1.08, -0.1 + Math.floor(i / 4) * 0.18, 10, s); } cyl(0.14, 0.14, 0.4, col(0x9aa0a8, .3, .8), 0.7, 1.26, -0.1, 14, s); });
    const s2 = stall(-7.0, 2.2, Math.PI / 2, '#1f3a2c', 'HOT CHESTNUTS', (s) => { cyl(0.32, 0.22, 0.3, mats.iron, 0.3, 1.2, 0.0, 14, s); for (let i = 0; i < 12; i++) sph(0.03, new T.MeshBasicMaterial({ color:[0xff6a20, 0xffa040, 0x8a2a08][i % 3] }), 0.3 + rnd(-.2, .2), 1.36, rnd(-.2, .2), s, 5); });
    const s3 = stall(-5.6, -6.6, Math.PI / 3, '#2f4a6b', 'HOLLY AND MISTLETOE', (s) => { for (let i = 0; i < 7; i++){ const hx = -0.8 + i * 0.27; sph(0.09, mats.green, hx, 1.12, 0.0, s, 7).scale.set(1.3, 0.6, 1); sph(0.025, col(0xc21d1d, .3), hx + 0.03, 1.18, 0.05, s, 6); } });
    [s1, s2, s3].forEach(s => { s.updateMatrixWorld(true); lanternGlow(s, -0.9); lanternGlow(s, 0.9); });
    glow(-6.7, 1.45, 2.2, 1.0, 0xff8040);
    K.point(0xffb870, 1.0, 8, -5.4, 2.2, 0.4);
    // a lantern post near you
    cyl(0.04, 0.05, 2.1, mats.iron, -2.4, 1.05, 2.2, 6); box(0.18, 0.04, 0.18, mats.iron, -2.4, 2.12, 2.2, false); box(0.14, 0.2, 0.14, lampM, -2.4, 2.25, 2.2, false); box(0.2, 0.04, 0.2, mats.iron, -2.4, 2.37, 2.2, false); glow(-2.4, 2.25, 2.2, 0.9);
    for (let i = 0; i < 7; i++){ const x = -2.4 + i * 1.6, z = 2.2 - Math.sin(i / 6 * Math.PI) * 0.4; box(0.1, 0.13, 0.1, lampM, x, 2.6 - Math.sin(i / 6 * Math.PI) * 0.25, z - 4.5, false); }

    // ---------------- the brass band, with its trumpets laid down; the Gazette photographer's camera ----------------
    const bd = grp(4.8, 0, 0.6, -0.5);
    for (let i = 0; i < 4; i++){ const ch = grp(-0.75 + i * 0.5, 0, 0, 0, bd); box(0.36, 0.04, 0.36, col(0x4a2d19, .6), 0, 0.45, 0, true, ch); box(0.36, 0.4, 0.04, col(0x4a2d19, .6), 0, 0.67, -0.17, true, ch); for (const a of [[-.15, -.15], [-.15, .15], [.15, -.15], [.15, .15]]) box(0.03, 0.45, 0.03, mats.dark, a[0], 0.225, a[1], true, ch);
      const ms = grp(-0.75 + i * 0.5, 0, 0.45, 0, bd); cyl(0.01, 0.01, 1.0, mats.iron, 0, 0.5, 0, 4, ms); const pl = box(0.3, 0.22, 0.015, mats.iron, 0, 1.05, 0, false, ms); pl.rotation.x = -0.35; }
    for (let i = 0; i < 2; i++){ const tr = grp(-0.75 + i, 0.5, 0.02, 0.3, bd); cyl(0.012, 0.012, 0.36, mats.brass, 0, 0.0, 0, 8, tr).rotation.z = Math.PI / 2; const bell = cyl(0.06, 0.012, 0.12, mats.brass, 0.22, 0.0, 0, 12, tr); bell.rotation.z = Math.PI / 2; }
    const drum = cyl(0.32, 0.32, 0.26, col(0x8e1f1f, .5), 0.95, 0.4, -0.3, 18, bd); drum.rotation.x = Math.PI / 2; cyl(0.325, 0.325, 0.02, mats.white, 0.95, 0.4, -0.17, 18, bd).rotation.x = Math.PI / 2;
    const tp = grp(2.6, 0, 1.2, -0.6); for (let i = 0; i < 3; i++){ const lg = cyl(0.012, 0.012, 1.45, mats.dark, Math.cos(i * 2.1) * 0.18, 0.7, Math.sin(i * 2.1) * 0.18, 4, tp); lg.rotation.z = Math.cos(i * 2.1) * 0.25; lg.rotation.x = -Math.sin(i * 2.1) * 0.25; }
    box(0.22, 0.2, 0.24, mats.black, 0, 1.5, 0, true, tp); const lens = cyl(0.06, 0.07, 0.14, mats.black, 0, 1.5, 0.18, 12, tp); lens.rotation.x = Math.PI / 2; cyl(0.05, 0.05, 0.01, K.M({ color:0x6a8aaa, roughness:.1, metalness:.6 }), 0, 1.5, 0.255, 12, tp).rotation.x = Math.PI / 2;
    const fl = cyl(0.08, 0.04, 0.06, mats.white, 0.14, 1.72, 0.02, 10, tp); fl.rotation.x = Math.PI / 2;
    box(0.3, 0.22, 0.2, col(0x5a3a22, .6), 3.05, 0.11, 1.45, true); box(0.31, 0.03, 0.21, mats.brass, 3.05, 0.2, 1.45, false);

    // ---------------- the High Street behind the stage: the Holly Bush Inn, the Green bus stop, Mrs Pike's window ----------------
    const fronts = [[-9, 4.6, 0x3a2a22, 'inn'], [-3.2, 4.0, 0x2c3040, ''], [1.6, 4.4, 0x3a3024, 'pike'], [6.4, 4.2, 0x2a2e3a, ''], [11.0, 4.8, 0x3a2a22, '']];
    fronts.forEach(([x, hgt, c, k]) => { const wd = k === 'inn' ? 6.0 : 4.4; box(wd, hgt, 1.0, col(c, .95), x, hgt / 2, -16); const rf = box(wd + 0.3, 0.2, 2.0, col(0x22222a, .9), x, hgt + 0.5, -16.2); rf.rotation.x = -0.5; box(wd + 0.3, 0.06, 2.0, mats.snow, x, hgt + 0.62, -16.1, false).rotation.x = -0.5;
      for (let r = 0; r < 2; r++) for (let i = 0; i < (k === 'inn' ? 4 : 3); i++){ const wx = x - wd / 2 + 0.8 + i * (wd - 1.6) / ((k === 'inn' ? 4 : 3) - 1), wy = 1.2 + r * 1.8; const lit = (i + r + (k ? 1 : 0)) % 2 === 0 || k === 'inn' || (k === 'pike' && r === 0 && i === 1); plane(0.7, 0.9, lit ? lampM : new T.MeshBasicMaterial({ color:0x1a2030 }), wx, wy, -15.49); } });
    plane(2.6, 0.5, K.M({ map:tex(256, 50, (g, w, h) => { g.fillStyle = '#1f3a2c'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9c45a'; g.font = 'bold 26px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('THE HOLLY BUSH INN', w / 2, h / 2 + 1); }) }), -9, 3.9, -15.48);
    cyl(0.04, 0.04, 2.4, mats.iron, -4.8, 1.2, -14.6, 6); const bsT = tex(64, 64, (g, w, h) => { g.fillStyle = '#e9e1cf'; g.beginPath(); g.arc(32, 32, 30, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#8e1f1f'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#1a2550'; g.font = 'bold 13px Georgia'; g.textAlign = 'center'; g.fillText('BUS', 32, 28); g.fillText('STOP', 32, 44); });
    plane(0.5, 0.5, K.M({ map:bsT, side:T.DoubleSide }), -4.8, 2.5, -14.58);
    glow(1.6 - 2.2 + 0.8 + (4.4 - 1.6) / 2, 1.2, -15.4, 1.4);

    // ---------------- the south side of the green: little snowy firs, a gingerbread stall, the empty choir stand to the west ----------------
    for (const [x, z, sc] of [[-4.5, 9.5, 1.0], [-1.0, 10.5, 1.3], [2.8, 9.8, 0.9], [6.2, 10.6, 1.2], [9.0, 8.4, 1.0]]){ const fg = grp(x, 0, z); for (let i = 0; i < 3; i++){ const c = new T.Mesh(new T.ConeGeometry((1.0 - i * 0.25) * sc, 1.2 * sc, 9), needle); c.position.y = (0.8 + i * 0.6) * sc; c.castShadow = true; fg.add(c); const sn = new T.Mesh(new T.ConeGeometry((0.75 - i * 0.2) * sc, 0.3 * sc, 9), mats.snow); sn.position.y = (1.15 + i * 0.6) * sc; sn.scale.set(1, 0.5, 1); fg.add(sn); } cyl(0.1 * sc, 0.12 * sc, 0.5 * sc, col(0x3a2415, .9), 0, 0.25 * sc, 0, 6, fg); }
    stall(5.2, 6.5, -Math.PI * 0.8, '#7a5a22', 'GINGERBREAD', (s) => { for (let i = 0; i < 6; i++){ box(0.12, 0.02, 0.16, col(0xb0703a, .8), -0.5 + i * 0.2, 1.07, 0.0, true, s); } });
    const cs = grp(-9.5, 0, 6.0, Math.PI / 2); for (let k = 0; k < 3; k++){ box(4.0, 0.4 * (k + 1), 0.5, col(0x5a3a22, .7), 0, 0.2 * (k + 1), -k * 0.5, true, cs); box(4.02, 0.04, 0.52, mats.snow, 0, 0.4 * (k + 1) + 0.02, -k * 0.5, false, cs); }

    // ---------------- falling snow ----------------
    const N = 900, pos = new Float32Array(N * 3); for (let i = 0; i < N; i++){ pos[i * 3] = rnd(-14, 14); pos[i * 3 + 1] = rnd(0, 10); pos[i * 3 + 2] = rnd(-14, 8); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pos, 3));
    K.snow = new T.Points(sg, new T.PointsMaterial({ color:0xffffff, size:0.06, transparent:true, opacity:0.85, depthWrite:false })); S.add(K.snow);

    // ---------------- lights ----------------
    const key = K.key([2.5, 9, 7], [0.5, 0.6, -2.6], 0.85, Math.PI / 3.6); key.distance = 0; key.decay = 0; key.shadow.camera.far = 40;
    S.add(new T.HemisphereLight(0x9aa8d0, 0x2a2018, 0.5));
  },
  tick(t, K){
    if (K.bulbMats) K.bulbMats.forEach((m, i) => { m.emissiveIntensity = 0.6 + (Math.sin(t * 2 + i * 1.3) > 0.2 ? 1.0 : 0.15); });
    if (K.snow){ const p = K.snow.geometry.attributes.position; for (let i = 0; i < p.count; i++){ let y = p.getY(i) - 0.012 - (i % 7) * 0.0015; if (y < 0) y = 10; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(t * 0.7 + i) * 0.002); } p.needsUpdate = true; }
    if (K.solved && K.solvedAt == null) K.solvedAt = t;
    if (K.solved && K.bigStar){ K.bigStar.rotation.y = Math.sin(t * 0.8) * 0.5; K.bigStarMat.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.3; const s = Math.min(4.5, (t - K.solvedAt) * 3); K.bigGlow.scale.set(s, s, 1); }
  },
  onSolved(K){
    K.bigStar.visible = true; K.solved = true; K.solvedAt = null; K.starLight.intensity = 2.0;
    K.startClip('bells');
  },

  // ---------------------------------------------------------------- clues (printed evidence word for word, from assets/printed.js)
  clues:{
    notes1:{ name:'Your case notes, part 1', at:[-0.42, 0.52, 1.6], size:[0.38, 0.12, 0.4],
      look:'A folder lies open on the bench in front of the stage. Inside are your case notes, gathered for Christmas Eve. This is the first sheet.',
      prompt:'Read the first sheet. What do your notes say about the workshop clock?', hint:'Look at the line for Night 3.', hot:[[0.04, 0.2, 0.96, 0.275]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#9a7a4a'; g.fillRect(0, 0, w, h); D.paper(g, 40, 8, 520, 384, '#f6f2e6');
        D.text(g, ['Case notes, part 1'], 60, 18, 24, 'bold 18px Special Elite, monospace', '#111');
        D.text(g, ['Night 2: cocoa fine at 8:33; to Edmund at 8:35.', 'Night 3: only way in, the yard window. Clock: 9:02.', 'Night 4: prints made after the snow stopped, 8:50.', 'Night 6: Felix on the 9:05 bus at Mill Lane.', 'Night 7: Nora at the counter: 8:41 to 9:14.', 'Night 8: the pad, the ledger, and the voicemail.', 'Night 9: draught taken between 6:30 and 8:00.', 'Night 10: vicar on stage; Clara conducting.', 'Night 11: tenor line one voice short, 9:00 to 9:08.', 'Night 12: Clara is Edmund\'s daughter.', 'Jasper in the shop and workshop until 8:10.'], 60, 56, 30, '14.5px Special Elite, monospace', '#222'); },
      kicker:'Evidence', title:'Case notes, part 1',
      html:P.n24.a,
      note:'Case notes, part 1: Nights 2 to 12. The cocoa was fine at 8:33; the clock stopped at 9:02; the prints came after 8:50; Felix, Nora, the vicar and Clara were all seen elsewhere; a tenor was short from 9:00 to 9:08.' },

    notes2:{ name:'Your case notes, part 2', at:[0.42, 0.52, 1.6], size:[0.38, 0.12, 0.4],
      look:'The second sheet of your case notes lies beside the first in the folder.',
      prompt:'Read the second sheet. What do your notes say about the prints?', hint:'Look at the line for Night 13.', hot:[[0.04, 0.12, 0.96, 0.27]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#9a7a4a'; g.fillRect(0, 0, w, h); D.paper(g, 40, 8, 520, 384, '#f6f2e6');
        D.text(g, ['Case notes, part 2'], 60, 18, 24, 'bold 18px Special Elite, monospace', '#111');
        D.text(g, ['Night 13: prints size 9, V-nick in the left heel.', '   Only Jasper and the vicar own size 9.', 'Night 14: Jasper\'s diary: 600 from F.M.', 'Night 15: the ledger: Owl, Robin, Sleigh.', 'Night 16: Jasper lied about 9:00.', 'Night 17: window forced with the 6 mm file.', 'Night 18: Edmund died between 9:05 and 9:15.', 'Night 19: Agnes at the stall, 8:40 to 9:30.', 'Night 20: the empty bottle was in robe 7.', 'Night 21: the churchyard path, 3 and a half min.', 'Night 22: Jasper\'s heel nicked; vicar\'s smooth.', 'Night 23: the tune says TO CLARA MY DAUGHTER.'], 60, 52, 28, '14.5px Special Elite, monospace', '#222'); },
      kicker:'Evidence', title:'Case notes, part 2',
      html:P.n24.b,
      note:'Case notes, part 2: Nights 13 to 23. The size 9 prints with the V-nick; the 600 from F.M. and the ledger; the 6 mm file; the bottle in robe 7; the churchyard path, 3 and a half minutes each way; the nicked heel.' },
  },

  // ---------------------------------------------------------------- extra clue (room only, never needed)
  extras:{
    glove:{ night:24, name:'Something on the edge of the stage', at:[3.15, 1.06, -2.2], size:[0.36, 0.14, 0.32],
      look:'Something small and black lies on the very edge of the stage, a little way past the name cards.',
      prompt:'Pick it up. Is there anything on it?', hint:'Look at the thumb.', hot:[[0.5, 0.22, 0.8, 0.6]],
      draw(g, w, h, K){ const D = K.D; D.planks(g, w, h, '#6a4a2c', 5); g.fillStyle = '#7a1520'; g.fillRect(0, h * .86, w, h * .14);
        g.save(); g.translate(290, 210); g.rotate(-0.1); g.fillStyle = '#141416'; D.rr(g, -90, -60, 180, 160, 36); g.fill(); for (let i = 0; i < 4; i++){ D.rr(g, -86 + i * 44, -170, 38, 124, 16); g.fill(); }
        g.save(); g.translate(108, 0); g.rotate(-0.65); D.rr(g, -18, -76, 38, 100, 16); g.fill(); g.fillStyle = 'rgba(250,250,244,.92)'; g.beginPath(); g.ellipse(2, -50, 13, 22, 0.1, 0, Math.PI * 2); g.fill(); g.restore();
        g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.ellipse(-20, 0, 50, 30, -0.4, 0, Math.PI * 2); g.fill(); g.restore(); },
      text:'On the edge of the stage, a black choir glove with a smear of white window paint on the thumb.' },
  },

  // ---------------------------------------------------------------- the rest: things to look at
  decoys:{
    musicbox:{ name:'The Midnight Music Box', at:[0, 1.95, -3.3], size:[0.62, 0.42, 0.52], look:'On the stage, on a velvet cushion, sits the Midnight Music Box, silent.', close:'Its lid is painted with gold stars. The little drawer marked CHRISTMAS MORNING is still shut. Nothing out of place.' },
    cards:{ name:'The six name cards', at:[0, 1.06, -2.15], size:[5.7, 0.16, 0.26], look:'Six white cards stand in a row along the edge of the stage, one for each person who stood below it.', close:'Nora Crane. Felix Marlow. Agnes Pell. Reverend Greer. Clara Wren. Jasper Lowe. Nothing out of place.' },
    tree:{ name:'The great Christmas tree', at:[7.0, 2.7, -7.5], size:[4.2, 5.4, 4.2], look:'The great tree towers over the green, hung with lights and baubles, ready for midnight.', close:'Its lights will shine at midnight. But look up: the very top of the tree is empty. Nothing else out of place.' },
    pies:{ name:'Mrs Bramble\'s stall', at:[-7.0, 1.3, -1.5], size:[1.0, 1.4, 2.3], look:'Mrs Bramble\'s mince-pie stall, lit by lanterns, with trays of hot pies and a steaming tea urn.', close:'The pies smell wonderful. You do not eat one. Nothing out of place.' },
    chestnuts:{ name:'The chestnut stall', at:[-7.0, 1.3, 2.2], size:[1.0, 1.4, 2.3], look:'A brazier of roasting chestnuts glows red, and the smell drifts across the green.', close:'Paper twists of hot chestnuts, warm in your hands. Nothing out of place.' },
    lantern:{ name:'The lanterns', at:[-2.4, 2.25, 2.2], size:[0.4, 0.5, 0.4], look:'Lanterns hang from every stall and post around the green.', close:'Each one has a candle burning inside. Nothing out of place.' },
    band:{ name:'The brass band', at:[4.8, 0.65, 0.6], size:[2.4, 1.3, 1.4], look:'The brass band\'s chairs and music stands, with two trumpets laid down and the big drum resting.', close:'The band has stopped playing to listen to the Constable. Nothing out of place.' },
    camera:{ name:'The photographer\'s camera', at:[2.6, 1.0, 1.2], size:[0.5, 2.0, 0.5], look:'A big press camera stands on a tripod by the stage. The Gazette photographer has been taking pictures all evening.', close:'The photographer has stepped away for a mince pie. Nothing out of place.' },
    inn:{ name:'The Holly Bush Inn', at:[-9.0, 2.5, -15.4], size:[6.0, 4.6, 0.6], look:'Across the High Street, the windows of the Holly Bush Inn glow warm. The Green bus stop stands outside.', close:'Felix Marlow stayed in Room 3, up there. Nothing out of place.' },
    lamps:{ name:'The stage lights', at:[4.6, 3.2, -1.75], size:[0.5, 0.5, 0.5], look:'Two lamps on tall poles light the stage, as bright as on the night of the switch-on.', close:'Nothing out of place.' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star, and the answer at the top of the tree
  star:{ at:[-2.22, 0.045, 2.42], rot:[-1.0, 0.65, 0.3], size:[0.26, 0.2, 0.26], seek:'Look down in the snow, at the foot of the lantern post near you.' },
  answer:{ at:[7.0, 7.95, -7.5], size:[1.9, 2.3, 1.9] },

  clips:{
    bells:{ kind:'music', text:'Bells ring out over the green.', beat:0.3, tune:[['G5',1],['G5',1],['A5',.5],['G5',.5],['F5',.5],['E5',.5],['D5',2],['D5',1],['E5',1],['G5',1],['G5',1],['F5',1],['E5',1],['D5',2],['C5',3]] },
  },
  AUDIO_FILES:{},
};
CM.start(ROOM);
