/* Room 2: Felix Marlow's room (Room 3) at the Holly Bush Inn. Night 6.
   The inn is on the north side of the High Street: the window (back wall, south) looks across the street to the green.
   Wording from book/content/n05.py (Gazette advert) and n06.py (timetable and ticket). */
const ROOM = {
  code:'r2',
  title:"Felix's Room at the Inn",
  subtitle:'Crime scene 2 · Night 6',
  view:{ pos:[0.1, 1.6, 0.5], yaw:0.1, pitch:-0.1 },
  previews:[0.1, 1.2, -1.3, 2.9, -2.3],
  intro:{
    kicker:'Night 6 · Crime scene 2',
    heading:"Felix Marlow's room at the Holly Bush Inn",
    paras:[
      'Room 3 at the Holly Bush Inn looks across the High Street to the green. Felix Marlow, the toymaker from Hartwell, is staying here for the fair.',
      '<b>Your task:</b> search his room. Where was Felix at 9:02, when the workshop clock stopped?',
    ],
    button:'Step into Room 3',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 6.2, DP = 5.4, H = 2.7, BZ = -DP / 2, FZ = DP / 2, LX = -W / 2, RX = W / 2;
    const WIN = { u:0.5, w:1.3, b:0.9, t:2.15 };
    const paper = K.M({ map:tex(256, 256, (g, w, h) => { g.fillStyle = '#ddcfae'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(140,40,40,.32)'; for (let y = 16; y < h; y += 42) for (let x = (y / 42 % 2) * 21 + 10; x < w; x += 42){ g.beginPath(); g.ellipse(x, y, 3, 7, 0.5, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x + 5, y + 3, 3, 6, -0.6, 0, Math.PI * 2); g.fill(); } g.fillStyle = 'rgba(60,90,50,.35)'; for (let y = 30; y < h; y += 42) for (let x = 0; x < w; x += 42) g.fillRect(x, y, 2, 10); }, [1, 1]), roughness:.9 });
    const panel = K.M({ map:tex(256, 128, (g, w, h) => { g.fillStyle = '#3e5a46'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2; i++){ const x = i * 128 + 14; g.fillStyle = '#466552'; g.fillRect(x, 16, 100, h - 32); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3; g.strokeRect(x, 16, 100, h - 32); } }, [1, 1]), roughness:.7 });
    K.shell({ w:W, d:DP, h:H, wallMat:paper, panelMat:panel, wallTile:[1.0, 1.0], panelTile:[1.0, 0.95], dado:0.95, trimMat:col(0x5a3a22, .5), beams:1.4,
      open:{ back:[{ u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t }] } });
    // rug
    plane(2.6, 1.8, K.M({ map:tex(256, 192, (g, w, h) => { g.fillStyle = '#2f4a6b'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9a441'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); g.strokeStyle = '#8e1f1f'; g.lineWidth = 4; g.strokeRect(24, 24, w - 48, h - 48); g.fillStyle = 'rgba(217,164,65,.45)'; for (let x = 44; x < w - 30; x += 28) for (let y = 44; y < h - 30; y += 28) g.fillRect(x, y, 6, 6); }), roughness:1 }), 0.3, 0.006, 0.1, -Math.PI / 2);

    // ---- window across the High Street to the green ----
    K.windowFrame({ side:'back', u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t, snow:true, bars:2 });
    const curt = K.M({ color:0x7a1717, roughness:.85, side:T.DoubleSide });
    for (const s of [-1, 1]){ const geo = new T.PlaneGeometry(0.5, H - 0.25, 10, 1); const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * 22) * 0.04); geo.computeVertexNormals(); const c = new T.Mesh(geo, curt); c.position.set(WIN.u + s * (WIN.w / 2 + 0.2), (H - 0.25) / 2 + 0.05, BZ + 0.15); c.castShadow = true; K.scene.add(c); }
    box(WIN.w + 1.3, 0.04, 0.04, mats.brass, WIN.u, H - 0.16, BZ + 0.17, false);
    K.backdrop('back', WIN.u, 1.9, 9, 16, 7, (g, w, h) => {
      D.night(g, w, h, '#0a1222', '#2a3654');
      g.fillStyle = '#e8edf4'; g.fillRect(0, h * .62, w, h * .38);
      g.fillStyle = '#8a95a8'; g.fillRect(0, h * .62, w, h * .1);                    // the High Street, trodden snow
      g.fillStyle = 'rgba(70,90,120,.4)'; for (let i = 0; i < 40; i++) g.fillRect(rnd(0, w), h * rnd(.63, .71), rnd(6, 20), 3);
      // the green: stage with lights, stalls, the choir stand, a great tree
      g.fillStyle = '#2a1d14'; g.fillRect(w * .52, h * .48, w * .26, h * .12); g.fillStyle = '#3b2a1a'; g.fillRect(w * .5, h * .58, w * .3, h * .04);
      for (let i = 0; i < 26; i++){ g.fillStyle = ['#ff6060', '#ffd36b', '#6bd3ff', '#9cff6b'][i % 4]; g.beginPath(); g.arc(w * (.52 + i * .01), h * (.48 + Math.sin(i * .5) * .01), 3, 0, Math.PI * 2); g.fill(); }
      for (let i = 0; i < 5; i++){ const x = w * (.1 + i * .08); g.fillStyle = ['#8e1f1f', '#1f3a2c', '#8e1f1f', '#2f4a6b', '#7a5a22'][i]; g.beginPath(); g.moveTo(x - 30, h * .55); g.lineTo(x, h * .5); g.lineTo(x + 30, h * .55); g.fill(); g.fillStyle = '#3a2a1a'; g.fillRect(x - 26, h * .55, 52, h * .06); g.fillStyle = 'rgba(255,214,140,.9)'; g.fillRect(x - 18, h * .565, 36, 10); }
      g.fillStyle = '#163020'; g.beginPath(); g.moveTo(w * .88, h * .2); g.lineTo(w * .82, h * .6); g.lineTo(w * .94, h * .6); g.fill();
      for (let i = 0; i < 20; i++){ g.fillStyle = ['#ff6060', '#ffd36b', '#6bd3ff'][i % 3]; g.fillRect(w * (.84 + Math.random() * .08), h * (.3 + Math.random() * .28), 3, 3); }
      g.fillStyle = '#ffd36b'; D.star(g, w * .88, h * .2, 9);
      // strings of lights over the street
      for (let k = 0; k < 2; k++) for (let i = 0; i < 40; i++){ const x = i / 39 * w, y = h * (.32 + k * .08) + Math.sin(i / 39 * Math.PI) * h * .06; g.fillStyle = ['#ff6060', '#ffd36b', '#6bd3ff', '#9cff6b'][i % 4]; g.beginPath(); g.arc(x, y, 2.5, 0, Math.PI * 2); g.fill(); }
      // a bus shelter on the corner
      g.fillStyle = '#3a3a40'; g.fillRect(w * .02, h * .5, w * .08, h * .02); g.fillRect(w * .02, h * .5, 4, h * .14); g.fillRect(w * .1 - 4, h * .5, 4, h * .14); g.fillStyle = '#e8edf4'; g.fillRect(w * .02, h * .49, w * .08, 6);
    }, 1024, 448);

    // ---- writing desk under the window: the Gazette and the drawings ----
    const dx = WIN.u, dz = BZ + 0.36, dt = 0.76;
    box(1.35, 0.05, 0.6, col(0x5a3622, .5), dx, dt - 0.025, dz); for (const x of [-0.6, 0.6]) for (const z of [-0.25, 0.25]) box(0.05, dt - 0.05, 0.05, mats.dark, dx + x, (dt - 0.05) / 2, dz + z);
    box(0.4, 0.14, 0.5, col(0x5a3622, .5), dx - 0.42, dt - 0.12, dz, false);
    const gaz = plane(0.42, 0.32, K.M({ map:tex(256, 192, (g, w, h) => { g.fillStyle = '#e9e3d2'; g.fillRect(0, 0, w, h); g.fillStyle = '#333'; g.fillRect(14, 10, w - 28, 16); for (let c = 0; c < 3; c++) for (let y = 36; y < h - 10; y += 7) g.fillRect(14 + c * 78, y, 70 - (y % 21 === 0 ? 20 : 0), 2); g.strokeStyle = '#222'; g.lineWidth = 2; g.strokeRect(96, 90, 70, 70); }), roughness:.95 }), dx - 0.35, dt + 0.003, dz + 0.02, -Math.PI / 2, 0, 0.15);
    const skT = tex(256, 192, (g, w, h) => { g.fillStyle = '#f4efe2'; g.fillRect(0, 0, w, h); g.strokeStyle = '#444'; g.lineWidth = 2; g.beginPath(); g.ellipse(128, 104, 46, 58, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(110, 86, 12, 0, Math.PI * 2); g.arc(146, 86, 12, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(40, 170); g.lineTo(216, 170); g.stroke(); g.fillStyle = '#444'; g.fillRect(70, 14, 116, 6); });
    const sk1 = plane(0.36, 0.27, K.M({ map:skT, roughness:.95 }), dx + 0.32, dt + 0.004, dz + 0.04, -Math.PI / 2, 0, -0.12);
    plane(0.36, 0.27, mats.paper, dx + 0.36, dt + 0.002, dz - 0.02, -Math.PI / 2, 0, -0.3);
    cyl(0.03, 0.03, 0.05, mats.black, dx + 0.05, dt + 0.025, dz - 0.18, 10); const pen = cyl(0.005, 0.005, 0.16, col(0x2a1d14, .4), dx - 0.02, dt + 0.008, dz - 0.12, 6); pen.rotation.z = Math.PI / 2; pen.rotation.y = 0.5;
    // desk lamp
    cyl(0.06, 0.07, 0.03, mats.brass, dx + 0.55, dt + 0.015, dz - 0.18, 12); cyl(0.012, 0.012, 0.36, mats.brass, dx + 0.55, dt + 0.2, dz - 0.18, 6);
    cyl(0.07, 0.15, 0.15, K.M({ color:0xd9b36a, side:T.DoubleSide, roughness:.6, emissive:0x8a5a1a, emissiveIntensity:.45 }), dx + 0.55, dt + 0.42, dz - 0.18, 14);
    K.point(0xffc27a, 1.1, 5, dx + 0.55, dt + 0.36, dz - 0.05);
    // chair at the desk
    box(0.44, 0.05, 0.42, col(0x5a3622, .5), dx, 0.46, dz + 0.52); box(0.44, 0.5, 0.05, col(0x5a3622, .5), dx, 0.72, dz + 0.74); for (const a of [[-.19, -.18], [-.19, .18], [.19, -.18], [.19, .18]]) box(0.04, 0.44, 0.04, mats.dark, dx + a[0], 0.22, dz + 0.52 + a[1]);
    // the timetable pinned on the wall
    plane(0.42, 0.56, K.M({ map:tex(128, 170, (g, w, h) => { g.fillStyle = '#f1ecd9'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.fillRect(10, 10, w - 20, 12); for (let y = 34; y < h - 12; y += 11) g.fillRect(12, y, y % 33 === 1 ? 70 : w - 24, 3); g.strokeStyle = '#222'; g.lineWidth = 2; g.strokeRect(4, 4, w - 8, h - 8); }), roughness:.9 }), -1.0, 1.45, BZ + 0.012);
    sph(0.012, mats.red, -1.0, 1.71, BZ + 0.02, null, 6);

    // ---- left wall: bed, bedside table, painting, the cuckoo clock ----
    const bz = -0.55, bxc = LX + 1.05;
    box(2.0, 0.3, 1.05, col(0x5a3622, .5), bxc, 0.3, bz); box(0.08, 1.05, 1.1, col(0x4a2d19, .5), LX + 0.06, 0.6, bz); box(0.08, 0.6, 1.1, col(0x4a2d19, .5), LX + 2.04, 0.35, bz);
    box(1.9, 0.14, 1.0, col(0xf0ebe0, .9), bxc, 0.5, bz); box(1.4, 0.12, 1.04, K.M({ map:tex(128, 128, (g, w, h) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++){ g.fillStyle = ['#8e1f1f', '#e9e1cf', '#1f3a2c', '#d9a441'][(i + j) % 4]; g.fillRect(i * 32, j * 32, 32, 32); } g.strokeStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i <= 4; i++){ g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } }), roughness:.95 }), bxc + 0.25, 0.6, bz);
    const pil = box(0.4, 0.12, 0.7, col(0xfbf7ee, .95), LX + 0.3, 0.64, bz); pil.rotation.z = 0.15;
    box(0.45, 0.6, 0.42, col(0x5a3622, .5), LX + 0.27, 0.3, -1.55); cyl(0.05, 0.06, 0.03, mats.brass, LX + 0.27, 0.615, -1.55, 10); cyl(0.01, 0.01, 0.25, mats.brass, LX + 0.27, 0.74, -1.55, 6);
    cyl(0.06, 0.12, 0.12, K.M({ color:0xe9e1cf, side:T.DoubleSide, roughness:.7, emissive:0x8a6a3a, emissiveIntensity:.3 }), LX + 0.27, 0.9, -1.55, 12);
    const di = grp(LX + 0.4, 0.6, -1.4, 0.3); box(0.13, 0.026, 0.18, col(0x5a1a1a, .6), 0, 0.013, 0, true, di); box(0.118, 0.02, 0.17, col(0xf1ecd9, .9), 0.006, 0.014, 0, false, di); box(0.012, 0.002, 0.1, mats.red, 0.02, 0.027, 0.06, false, di);
    box(0.06, 0.62, 0.82, col(0xb08a3a, .35, .6), LX + 0.03, 1.72, bz, false);
    plane(0.7, 0.5, K.M({ map:tex(256, 180, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#5d7aa0'); gr.addColorStop(1, '#dfe6ef'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#5a6e4a'; g.beginPath(); g.moveTo(0, h * .7); g.quadraticCurveTo(w * .4, h * .5, w, h * .72); g.lineTo(w, h); g.lineTo(0, h); g.fill(); g.fillStyle = '#e9e1cf'; g.fillRect(w * .6, h * .55, 40, 26); g.fillStyle = '#8e1f1f'; g.beginPath(); g.moveTo(w * .6 - 4, h * .55); g.lineTo(w * .6 + 20, h * .45); g.lineTo(w * .6 + 44, h * .55); g.fill(); }), roughness:.8 }), LX + 0.065, 1.72, bz, 0, Math.PI / 2, 0);
    // cuckoo clock (Edmund mended it last spring); the small gold star of The Hidden Case sits on its roof
    const cc = grp(LX + 0.09, 1.82, -1.55, Math.PI / 2); const ccM = col(0x4a2d19, .6);
    box(0.3, 0.32, 0.14, ccM, 0, 0, 0, true, cc); const roof = box(0.38, 0.03, 0.18, col(0x3a2414, .6), -0.1, 0.2, 0, true, cc); roof.rotation.z = 0.5; const roof2 = box(0.38, 0.03, 0.18, col(0x3a2414, .6), 0.1, 0.2, 0, true, cc); roof2.rotation.z = -0.5;
    plane(0.16, 0.16, K.M({ map:tex(128, 128, (g) => D.clockFace(g, 64, 64, 58, 7, 20, { arabic:true })) }), 0, -0.04, 0.072, 0, 0, 0, cc);
    box(0.07, 0.07, 0.02, col(0x2a1a0c, .6), 0, 0.12, 0.075, false, cc);
    for (const x of [-0.05, 0.05]){ cyl(0.003, 0.003, 0.5, mats.brass, x, -0.42, 0.03, 4, cc); const pc = cyl(0.025, 0.025, 0.09, col(0x5a3218, .5), x, -0.7, 0.03, 8, cc); }
    // ---- right wall: fireplace, armchair, wash stand, mirror ----
    const fz = -0.55;
    box(0.36, 1.25, 1.4, col(0x8a7a66, .9), RX - 0.18, 0.625, fz); box(0.05, 0.6, 0.7, col(0x0a0604, 1), RX - 0.37, 0.35, fz, false);
    box(0.5, 0.08, 1.6, col(0x4a2d19, .5), RX - 0.25, 1.28, fz);
    for (let i = 0; i < 3; i++){ const l = cyl(0.04, 0.04, 0.45, col(0x3a2415, 1), RX - 0.36, 0.1, fz - 0.1 + i * 0.1, 6); l.rotation.x = Math.PI / 2; }
    K.fire(RX - 0.46, 0.24, fz, 'z', 4, [-0.2, 0]);
    K.garland([RX - 0.3, 1.36, fz - 0.75], [RX - 0.3, 1.36, fz + 0.75], 10);
    for (let i = 0; i < 2; i++){ cyl(0.03, 0.035, 0.18, col(0xf0e6c8, .8), RX - 0.25, 1.41, fz - 0.5 + i, 10); }
    const ac = grp(RX - 1.0, 0, 0.75, -Math.PI / 2 - 0.5); const acM = col(0x6b2a22, .85);
    box(0.8, 0.4, 0.75, acM, 0, 0.2, 0, true, ac); box(0.8, 0.7, 0.16, acM, 0, 0.72, -0.32, true, ac); box(0.14, 0.32, 0.75, acM, -0.36, 0.52, 0, true, ac); box(0.14, 0.32, 0.75, acM, 0.36, 0.52, 0, true, ac);
    box(0.5, 0.8, 0.45, col(0x5a3622, .5), RX - 0.3, 0.4, BZ + 0.55); box(0.52, 0.03, 0.47, col(0xe9e1cf, .3), RX - 0.3, 0.815, BZ + 0.55);
    cyl(0.16, 0.12, 0.08, col(0xf4f1ea, .3), RX - 0.3, 0.87, BZ + 0.55, 18); cyl(0.05, 0.07, 0.22, col(0xf4f1ea, .3), RX - 0.24, 0.98, BZ + 0.48, 14);
    box(0.04, 0.5, 0.38, col(0xb08a3a, .35, .6), RX - 0.03, 1.55, BZ + 0.55, false); plane(0.44, 0.32, K.M({ color:0x9aa8b8, roughness:.1, metalness:.9 }), RX - 0.055, 1.55, BZ + 0.55, 0, -Math.PI / 2, 0);

    // ---- front wall: the door with its number, coat stand with the smart coat, samples case ----
    const dr = K.door({ side:'front', u:-1.4, w:0.95, h:2.05, mat:col(0x4a2d19, .5), panel:0x5a3622 });
    box(0.12, 0.14, 0.02, mats.brass, -1.4, 1.65, FZ - 0.1, false);
    const cs = grp(-0.25, 0, FZ - 0.45); cyl(0.025, 0.03, 1.75, mats.dark, 0, 0.88, 0, 8, cs); cyl(0.2, 0.22, 0.04, mats.dark, 0, 0.02, 0, 12, cs);
    for (let i = 0; i < 4; i++){ const pg = cyl(0.01, 0.01, 0.18, mats.dark, Math.cos(i * 1.57) * 0.08, 1.68, Math.sin(i * 1.57) * 0.08, 5, cs); pg.rotation.z = Math.cos(i * 1.57) * 0.8; pg.rotation.x = -Math.sin(i * 1.57) * 0.8; }
    const coatM = col(0x2c2e36, .85); const cb = cyl(0.16, 0.26, 1.0, coatM, 0, 1.12, 0.06, 7, cs); cb.scale.set(1, 1, 0.55);
    for (const x of [-0.2, 0.2]){ const sl = cyl(0.05, 0.065, 0.65, coatM, x, 1.2, 0.06, 6, cs); sl.rotation.z = x > 0 ? 0.12 : -0.12; }
    box(0.34, 0.08, 0.2, col(0x1e2026, .8), 0, 1.6, 0.06, false, cs); box(0.1, 0.07, 0.02, col(0x1e2026, .8), 0.12, 0.95, 0.21, false, cs);
    box(0.03, 0.02, 0.005, col(0xf1ecd9, .9), 0.12, 1.0, 0.22, false, cs);
    cyl(0.09, 0.09, 0.12, mats.black, 0, 1.82, 0, 14, cs); cyl(0.16, 0.16, 0.012, mats.black, 0, 1.76, 0, 16, cs);
    const sc = grp(1.0, 0, FZ - 0.4, 0.15); box(0.75, 0.5, 0.32, col(0x6b4423, .55), 0, 0.27, 0, true, sc); box(0.77, 0.03, 0.34, mats.brass, 0, 0.36, 0, false, sc); box(0.14, 0.04, 0.03, mats.dark, 0, 0.56, 0, false, sc);
    for (const x of [-0.25, 0.25]) box(0.04, 0.5, 0.34, col(0x3a2414, .6), x, 0.27, 0, false, sc);
    box(0.5, 0.4, 0.05, col(0xb08a3a, .35, .6), 2.1, 1.55, FZ - 0.03, false);
    plane(0.42, 0.32, K.M({ map:tex(128, 100, (g, w, h) => { g.fillStyle = '#e8e0cc'; g.fillRect(0, 0, w, h); g.fillStyle = '#5a6e8a'; g.beginPath(); g.moveTo(0, h * .7); g.lineTo(w * .3, h * .35); g.lineTo(w * .55, h * .6); g.lineTo(w * .8, h * .3); g.lineTo(w, h * .65); g.lineTo(w, h); g.lineTo(0, h); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(w * .25, h * .42); g.lineTo(w * .3, h * .35); g.lineTo(w * .35, h * .42); g.fill(); }), roughness:.8 }), 2.1, 1.55, FZ - 0.06, 0, Math.PI, 0);
    box(0.36, 0.3, 0.36, col(0x8e1f1f, .7), 2.6, 0.15, FZ - 0.35); cyl(0.17, 0.17, 0.02, col(0x1f3a2c, .7), 2.6, 0.31, FZ - 0.35, 14);
    // holly over the door, lights along the mantel
    K.holly(-1.4, 2.2, FZ - 0.1, 1.5);
    K.lights([RX - 0.22, 1.42, fz - 0.78], [RX - 0.22, 1.42, fz + 0.78], 12, 0.08);
    K.key([0.3, H - 0.15, 1.5], [0.2, 0.6, -1.6], 0.55, Math.PI / 2.8);
    K.scene.add(new T.HemisphereLight(0xffe2b8, 0x24160c, 0.32));
    const moon = new T.DirectionalLight(0x9fb6ff, 0.3); moon.position.set(WIN.u, 4, BZ - 8); moon.target.position.set(WIN.u, 0, BZ + 1); K.scene.add(moon); K.scene.add(moon.target);
  },

  clues:{
    timetable:{ name:'The bus timetable', at:[-1.0, 1.45, -2.65], size:[0.5, 0.62, 0.1],
      look:'A printed bus timetable is pinned to the wall by the window.',
      prompt:'Read the timetable. Which part matters for the night of the lights?', hint:'Look at the times the buses leave.', hot:[[0.06, 0.3, 0.94, 0.5]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#4a3a2a', 20); g.fillStyle = '#e8dcc0'; g.fillRect(0, 0, w, h); D.paper(g, 40, 14, 520, 372, '#f6f1df');
        g.strokeStyle = '#222'; g.lineWidth = 3; g.strokeRect(52, 26, 496, 348);
        D.text(g, ['HARTWELL ROAD BUS: FAIR NIGHT TIMES'], w / 2, 40, 30, 'bold 22px Special Elite, monospace', '#111', 'center');
        D.text(g, ['The Green stop is closed for the fair.', 'All buses start from Mill Lane.'], w / 2, 76, 24, '17px Special Elite, monospace', '#222', 'center');
        D.text(g, ['Leaves Mill Lane   7:35   8:35   9:05 (last bus)'], w / 2, 140, 30, 'bold 19px Special Elite, monospace', '#111', 'center');
        D.text(g, ['Mill Lane to Thimbleby Cross: 6 minutes.', 'Thimbleby Cross to Hartwell Bridge: 19 minutes.', '', 'Fares to Hartwell Bridge', 'From Mill Lane: 6 pence', 'From Thimbleby Cross: 4 pence'], w / 2, 206, 26, '16px Special Elite, monospace', '#222', 'center'); },
      kicker:'Evidence',
      html:'<div class="doc type"><b>HARTWELL ROAD BUS: FAIR NIGHT TIMES</b><br>The Green stop is closed for the fair. All buses start from Mill Lane.<br><b>Leaves Mill Lane: 7:35, 8:35, 9:05 (last bus)</b><br>Mill Lane to Thimbleby Cross: 6 minutes.<br>Thimbleby Cross to Hartwell Bridge: 19 minutes.<br>Fares to Hartwell Bridge<br>From Mill Lane: 6 pence<br>From Thimbleby Cross: 4 pence</div>',
      note:'Fair night buses all start from Mill Lane: 7:35, 8:35 and 9:05 (the last bus). Mill Lane to Thimbleby Cross 6 minutes, then 19 minutes to Hartwell Bridge. Fares: 6 pence from Mill Lane, 4 pence from Thimbleby Cross.' },

    ticket:{ name:"Felix's smart coat", at:[-0.25, 1.3, 2.25], size:[0.55, 1.1, 0.5], reveal:true,
      look:'A smart grey coat hangs on the coat stand by the door, with a black hat on top.',
      prompt:'Felix wore this coat on the night of the lights. Check it carefully.', hint:'Look at the pockets.', hot:[[0.52, 0.5, 0.82, 0.8]],
      draw(g, w, h, K, open){ const D = K.D; g.fillStyle = '#2c2e36'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.04)'; for (let i = 0; i < 700; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 1);
        g.strokeStyle = '#1c1d22'; g.lineWidth = 6; g.beginPath(); g.moveTo(250, 0); g.lineTo(290, h); g.stroke();
        for (let i = 0; i < 3; i++){ g.fillStyle = '#15161a'; g.beginPath(); g.arc(230, 80 + i * 110, 13, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#25272e'; g.fillRect(330, 250, 170, 26); g.strokeStyle = '#18191e'; g.lineWidth = 3; g.strokeRect(330, 250, 170, 26); g.fillRect(70, 250, 130, 26);
        if (!open){ g.save(); g.translate(430, 248); g.rotate(-0.15); g.fillStyle = '#efe8cf'; g.fillRect(-24, -30, 48, 34); g.restore(); }
        else { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(150, 40, 330, 190); g.save(); g.translate(310, 130); g.rotate(-0.04); g.fillStyle = '#efe8cf'; g.fillRect(-165, -95, 330, 190);
          g.fillStyle = '#222'; g.textAlign = 'center'; g.font = 'bold 18px Special Elite, monospace'; g.fillText('HARTWELL ROAD BUS', 0, -66); g.font = '16px Special Elite, monospace'; g.fillText('SINGLE TICKET', 0, -44);
          g.textAlign = 'left'; g.fillText('To: Hartwell Bridge', -145, -14); g.fillText('Fare paid: 6 pence', -145, 10);
          g.fillText('Time box clipped:', -145, 40); g.strokeStyle = '#222'; g.lineWidth = 1.5; g.strokeRect(30, 22, 120, 30); g.fillText('9:00 to 9:15', 38, 43);
          g.fillStyle = '#2c2e36'; g.beginPath(); g.arc(90, 70, 9, 0, Math.PI * 2); g.fill(); g.restore(); } },
      kicker:'Evidence',
      html:'<p>In the pocket of Felix\'s smart coat:</p><div class="doc type"><b>HARTWELL ROAD BUS</b><br>SINGLE TICKET<br>To: Hartwell Bridge<br>Fare paid: 6 pence<br>Time box clipped: <b>9:00 to 9:15</b></div><p class="small">The conductor, Sid Tully, clips each ticket as the passenger gets on.</p>',
      note:'Felix\'s bus ticket, in his coat pocket: single to Hartwell Bridge, fare 6 pence, clipped in the 9:00 to 9:15 box.' },

    gazette:{ name:'The Gazette', at:[0.15, 0.82, -2.34], size:[0.46, 0.12, 0.4],
      look:'A copy of the Thimbleby Gazette, Christmas edition, lies folded open on the desk.',
      prompt:'Felix has folded it open at one page. What is on it?', hint:'Look for the advert with a secret line.', hot:[[0.06, 0.42, 0.94, 0.66]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3622'); D.paper(g, 22, 10, 556, 380, '#efe9d6');
        D.text(g, ["Marlow's Christmas Riddle"], w / 2, 24, 30, 'bold 26px Libre Baskerville, Georgia, serif', '#111', 'center');
        D.text(g, ['Toymakers of the valley, we have a secret for you! Crack our', 'secret line and win a tin soldier, painted by hand. Bring', "your answer to the shop before New Year's Day."], w / 2, 66, 22, '15px Libre Baskerville, Georgia, serif', '#222', 'center');
        D.text(g, ['OUR SECRET LINE:'], w / 2, 150, 24, 'bold 16px Libre Baskerville, Georgia, serif', '#111', 'center');
        D.text(g, ['OHYADLSS DPSS OLHY H ULD', 'TBZPJHS IVE PU QHUBHYF'], w / 2, 178, 32, 'bold 24px Special Elite, monospace', '#111', 'center');
        g.strokeStyle = '#333'; g.lineWidth = 1; g.beginPath(); g.moveTo(60, 262); g.lineTo(540, 262); g.stroke();
        D.text(g, ["MARLOW'S TOYS, Bridge Street, Hartwell.", 'Fine toys for fine children. Open every day but Sunday.'], w / 2, 276, 22, 'italic 15px Libre Baskerville, Georgia, serif', '#222', 'center');
        D.text(g, ['HOW TO PLAY. Every letter in our secret line has been moved the same', 'number of places along the alphabet. Our secret line begins', 'with the name of our town.'], w / 2, 328, 18, '12.5px Libre Baskerville, Georgia, serif', '#333', 'center'); },
      kicker:'Evidence',
      html:'<div class="doc"><b>Marlow\'s Christmas Riddle</b><br>Toymakers of the valley, we have a secret for you! Crack our secret line and win a tin soldier, painted by hand. Bring your answer to the shop before New Year\'s Day.<br><br><b>OUR SECRET LINE:</b><br><span class="type"><b>OHYADLSS DPSS OLHY H ULD TBZPJHS IVE PU QHUBHYF</b></span><br><br><i>HOW TO PLAY. Every letter in our secret line has been moved the same number of places along the alphabet. Our secret line begins with the name of our town.</i><br><br>MARLOW\'S TOYS, Bridge Street, Hartwell. Fine toys for fine children. Open every day but Sunday.</div><p>Felix\'s own copy, folded open at his advert.</p>',
      note:'Felix\'s copy of the Gazette, open at his Christmas Riddle. Its secret line (Night 5) announces a new musical box, in January.' },

    sketch:{ name:'The drawings on the desk', at:[0.85, 0.82, -2.3], size:[0.4, 0.12, 0.38],
      look:'Two sheets of drawing paper lie on the desk, covered in careful pencil lines.',
      prompt:'Look at the top drawing. What is it?', hint:'Read the words at the top of the sheet.', hot:[[0.18, 0.02, 0.82, 0.18]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3622'); D.paper(g, 40, 6, 520, 388, '#f5f0e2', 0.01);
        D.text(g, ['The Snow Owl'], w / 2, 22, 34, '36px Caveat, cursive', '#333', 'center');
        g.strokeStyle = '#555'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(300, 230, 95, 120, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(262, 190, 28, 0, Math.PI * 2); g.arc(338, 190, 28, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.arc(262, 190, 9, 0, Math.PI * 2); g.arc(338, 190, 9, 0, Math.PI * 2); g.fillStyle = '#555'; g.fill(); g.beginPath(); g.moveTo(300, 210); g.lineTo(290, 230); g.lineTo(310, 230); g.closePath(); g.stroke();
        g.beginPath(); g.moveTo(210, 210); g.quadraticCurveTo(170, 280, 215, 330); g.moveTo(390, 210); g.quadraticCurveTo(430, 280, 385, 330); g.stroke();
        for (let i = 0; i < 6; i++){ g.beginPath(); g.moveTo(250 + i * 20, 280); g.quadraticCurveTo(260 + i * 20, 292, 270 + i * 20, 280); g.stroke(); }
        g.setLineDash([6, 5]); g.strokeStyle = '#999'; g.beginPath(); g.moveTo(450, 110); g.lineTo(450, 350); g.moveTo(205, 375); g.lineTo(395, 375); g.stroke(); g.setLineDash([]);
        g.beginPath(); g.moveTo(170, 120); g.lineTo(225, 165); g.stroke(); D.text(g, ['glass eyes'], 110, 98, 20, '22px Caveat, cursive', '#555'); },
      kicker:'Clue',
      html:'<p>A careful drawing of a wooden toy owl, with every part measured out, ready to be made.</p><div class="observe">At the top: <b>The Snow Owl</b>.</div>',
      note:'On Felix\'s desk: a full drawing of a toy called the Snow Owl, ready to be made.' },
  },

  decoys:{
    bed:{ name:'The bed', at:[-2.05, 0.35, -0.5], size:[2.0, 0.7, 1.0], look:'A tall old bed with a patchwork quilt, neatly made.', close:'Nothing under the pillow and nothing under the bed but a pair of slippers. Nothing out of place.' },
    lamp:{ name:'The bedside table', at:[-2.86, 0.82, -1.6], size:[0.26, 0.5, 0.26], look:'A little table by the bed, with a lamp on it.', close:'In the drawer: a comb, a box of matches and a few coins. Nothing out of place.' },
    painting:{ name:'The painting', at:[-3.05, 1.72, -0.55], size:[0.1, 0.62, 0.84], look:'A painting of a farmhouse on a summer hill hangs above the bed.', close:'Only dust behind the frame. Nothing out of place.' },
    fireplace:{ name:'The fireplace', at:[2.88, 0.75, -0.55], size:[0.42, 1.4, 1.5], look:'A small fire crackles in the grate. Two candles and a garland stand on the mantel.', close:'Just coal and ash in the grate. Nothing out of place.' },
    armchair:{ name:'The armchair', at:[2.1, 0.5, 0.75], size:[0.95, 1.0, 0.95], look:'A red armchair turned towards the fire.', close:'You check down the sides of the cushion. Not even a crumb. Nothing out of place.' },
    washstand:{ name:'The wash stand', at:[2.8, 0.55, -2.15], size:[0.52, 0.9, 0.5], look:'A wash stand with a china jug and basin.', close:'Clean water and a folded towel. Nothing out of place.' },
    mirror:{ name:'The mirror', at:[3.05, 1.55, -2.15], size:[0.1, 0.52, 0.42], look:'A small mirror in a gold frame above the wash stand.', close:'You see yourself, looking very like a detective. Nothing out of place.' },
    case:{ name:'The samples case', at:[1.0, 0.3, 2.3], size:[0.82, 0.6, 0.42], look:'A big brown case with brass corners stands by the door.', close:"Felix's toy samples for the fair, brought from Hartwell: spinning tops, a jack-in-the-box and painted soldiers. Nothing out of place." },
    door:{ name:'The door', at:[-1.4, 1.05, 2.66], size:[1.0, 2.1, 0.12], look:'The door of Room 3, with a brass number on it and holly above.', close:'The door locks from inside with a heavy key. Nothing out of place.' },
    clock:{ name:'The cuckoo clock', at:[-3.0, 1.8, -1.55], size:[0.22, 0.52, 0.42], look:'An old cuckoo clock hangs on the wall by the bed. It ticks along happily.', close:'Edmund mended it last spring, and it keeps good time. Nothing out of place.' },
    window:{ name:'The window', at:[0.5, 1.55, -2.66], size:[1.3, 1.2, 0.2], look:'Across the snowy High Street lies the green, with the stage, the stalls and the great tree, all lit up.', close:'You can see the whole green from up here. Nothing out of place.' },
  },

  // ---------------------------------------------------------------- extra clue (room only, never needed)
  extras:{
    diary:{ night:6, name:'A small book on the bedside table', at:[-2.7, 0.66, -1.4], size:[0.26, 0.12, 0.24],
      look:'A small leather book lies beside the lamp, with a red ribbon marking a page.',
      prompt:'Open it at the ribbon. Which entry matters?', hint:'Look for the entry about the fair night.', hot:[[0.5, 0.46, 0.96, 0.92]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3622'); g.fillStyle = '#5a1a1a'; g.fillRect(20, 14, 560, 372); D.paper(g, 36, 24, 262, 352, '#f6f1e2'); D.paper(g, 302, 24, 262, 352, '#f6f1e2'); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(296, 24, 10, 352); g.fillStyle = '#b3241f'; g.fillRect(300, 0, 8, 120);
        g.strokeStyle = 'rgba(60,90,160,.18)'; for (let y = 60; y < 370; y += 30){ g.beginPath(); g.moveTo(44, y); g.lineTo(290, y); g.moveTo(310, y); g.lineTo(556, y); g.stroke(); }
        D.text(g, ['Hartwell. Sold two', 'tops at the market.', 'Cold again.', '', 'Thimbleby. Room 3 at', 'the Holly Bush. Fine', 'view of the green.'], 52, 38, 30, '25px Caveat, cursive', 'rgba(30,40,80,.55)');
        D.text(g, ['Fair night. Left the', 'shop window 8:48.', 'Mill Lane 8:58. Waited', 'in that freezing', 'shelter for the 9:05.'], 318, 206, 31, '26px Caveat, cursive', '#1a2550'); },
      text:'Felix\'s diary on the bedside table: "Fair night. Left the shop window 8:48. Mill Lane 8:58. Waited in that freezing shelter for the 9:05."' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[-3.03, 2.1, -1.55], rot:[0, Math.PI / 2, 0.1], seek:'Look high up on the wall by the bed.' },

  clips:{
  },
  // Recorded voices go in /audio/ at the site root; if a file is missing, the phone's own voice reads the words.
  AUDIO_FILES:{  },
};
CM.start(ROOM);
