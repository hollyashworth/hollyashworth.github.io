/* Room 4: the kitchen of Edmund's house, where Agnes Pell works. Nights 9 and 19.
   The kitchen window and the back door look onto the yard (n03). Wording from book/content/n02.py (recipe card),
   n09.py (top shelf and cupboard book) and n19.py (stall roster). */
const ROOM = {
  code:'r4',
  title:'The Kitchen',
  subtitle:'Crime scene 4 · Night 9',
  view:{ pos:[0.0, 1.6, 0.5], yaw:0.9, pitch:-0.1 },
  previews:[0.9, 0.0, -1.3, 2.6, -2.5],
  intro:{
    kicker:'Night 9 · Crime scene 4',
    heading:"Agnes's kitchen",
    paras:[
      "The kitchen of Edmund's house, behind the shop. This is where Agnes Pell made Edmund's cocoa every night for thirty years.",
      '<b>Your task:</b> search the kitchen. When did the sleeping draught go missing? Come back on Night 19 too: something pinned up in here matters then.',
    ],
    button:'Step into the kitchen',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 6.6, DP = 5.6, H = 2.8, BZ = -DP / 2, FZ = DP / 2, LX = -W / 2, RX = W / 2;
    const WIN = { u:-0.8, w:1.3, b:1.05, t:2.05 };
    const wallMat = K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#e3d6b4'; g.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++){ g.fillStyle = `rgba(150,120,80,${rnd(.02, .08)})`; g.fillRect(rnd(0, w), rnd(0, h), 3, 3); } }, [1, 1]), roughness:.95 });
    const tiles = K.M({ map:tex(256, 256, (g, w, h) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++){ g.fillStyle = (r + c) % 2 ? '#f1ece0' : '#e4dccb'; g.fillRect(c * 32, r * 32, 32, 32); } g.strokeStyle = 'rgba(80,70,60,.35)'; for (let i = 0; i <= 8; i++){ g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } g.fillStyle = '#2f5d8a'; for (let r = 0; r < 8; r += 2) for (let c = 0; c < 8; c += 2) D.star(g, c * 32 + 16, r * 32 + 16, 5); }, [1, 1]), roughness:.35 });
    const flags = K.M({ map:tex(512, 512, (g, w, h) => { g.fillStyle = '#6e6458'; g.fillRect(0, 0, w, h); for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++){ g.fillStyle = D.shade('#9a8e7c', rnd(-18, 18)); g.fillRect(c * 86 + 3 + (r % 2) * 20, r * 86 + 3, 80, 80); } g.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 600; i++) g.fillRect(rnd(0, w), rnd(0, h), 2, 2); }, [2.5, 2.5]), roughness:.85 });
    K.shell({ w:W, d:DP, h:H, wallMat, panelMat:tiles, floorMat:flags, wallTile:[1.0, 1.0], panelTile:[0.8, 0.8], dado:1.0, beams:1.3, trimMat:col(0x6b4423, .5),
      open:{ back:[{ u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t }] } });

    // ---- back wall: the window onto the yard, the stone sink, the back door ----
    K.windowFrame({ side:'back', u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t, snow:true, bars:1 });
    K.backdrop('back', WIN.u, 1.5, 6, 10, 5, (g, w, h) => { D.night(g, w, h, '#0a1222', '#2c3a57');
      g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .55, w, h * .45);
      g.fillStyle = '#5e5953'; g.fillRect(0, h * .42, w, h * .14); g.fillStyle = '#eef2f7'; g.fillRect(0, h * .41, w, 8);
      g.fillStyle = '#3a2e26'; g.fillRect(w * .62, h * .12, w * .38, h * .5); g.fillStyle = '#eef2f7'; g.beginPath(); g.moveTo(w * .6, h * .14); g.lineTo(w * .82, h * .02); g.lineTo(w, h * .1); g.lineTo(w, h * .15); g.fill();
      g.fillStyle = '#e9e1cf'; g.fillRect(w * .7, h * .32, w * .14, h * .2); g.fillStyle = '#20283a'; g.fillRect(w * .71, h * .33, w * .12, h * .18);
      g.fillStyle = '#4a3a2a'; g.fillRect(w * .26, h * .34, w * .1, h * .22);
      g.fillStyle = 'rgba(90,110,145,.45)'; for (let i = 0; i < 22; i++){ g.beginPath(); g.ellipse(w * (.3 + i * .02), h * (.62 + Math.sin(i) * .02), 5, 3, 0, 0, Math.PI * 2); g.fill(); }
    }, 1024, 512);
    const sk = grp(WIN.u, 0, BZ + 0.32); box(1.1, 0.24, 0.55, col(0xd8d2c4, .6), 0, 0.85, 0, true, sk); box(0.96, 0.05, 0.42, col(0x8a8478, .5), 0, 0.95, 0, false, sk);
    for (const x of [-0.45, 0.45]) box(0.12, 0.73, 0.5, col(0x9a8e7c, .9), x, 0.36, 0, true, sk);
    cyl(0.015, 0.015, 0.3, mats.brass, 0, 1.12, -0.18, 6, sk); const tap = cyl(0.012, 0.012, 0.12, mats.brass, 0, 1.25, -0.12, 6, sk); tap.rotation.x = Math.PI / 2;
    K.door({ side:'back', u:1.7, w:0.9, h:2.0, mat:col(0x2f4a3a, .6), panel:0x34523f });
    // ---- right wall: the range, the pans, the copper jelly mould ----
    const rz = -0.7;
    box(0.5, 1.5, 1.6, col(0x8a7a66, .9), RX - 0.25, 0.75, rz); box(0.5, H - 1.5, 1.4, wallMat, RX - 0.25, 1.5 + (H - 1.5) / 2, rz, false);
    const rg = grp(RX - 0.55, 0, rz); const iron = mats.iron;
    box(0.6, 0.85, 1.3, iron, 0, 0.425, 0, true, rg); box(0.64, 0.05, 1.36, col(0x3a3a3e, .4, .5), 0, 0.875, 0, true, rg);
    for (const z of [-0.35, 0.3]){ box(0.02, 0.34, 0.42, col(0x2a2a2e, .4, .6), -0.31, 0.45, z, false, rg); cyl(0.02, 0.02, 0.06, mats.brass, -0.34, 0.6, z + 0.15, 6, rg).rotation.z = Math.PI / 2; }
    const glow = plane(0.22, 0.1, new T.MeshBasicMaterial({ color:0xff8a2a }), -0.31, 0.2, 0.0, 0, -Math.PI / 2, 0, rg); K.keep = [glow];
    cyl(0.12, 0.12, 0.04, col(0x1a1a1c, .5), 0, 0.92, -0.35, 16, rg); cyl(0.12, 0.12, 0.04, col(0x1a1a1c, .5), 0, 0.92, 0.3, 16, rg);
    // kettle on one plate, the small milk pan on the other
    cyl(0.1, 0.13, 0.18, col(0x9aa0a8, .3, .8), 0, 1.03, -0.35, 16, rg); sph(0.03, mats.black, 0, 1.14, -0.35, rg); const sp = cyl(0.015, 0.025, 0.14, col(0x9aa0a8, .3, .8), -0.12, 1.06, -0.35, 6, rg); sp.rotation.z = 0.9;
    cyl(0.1, 0.09, 0.08, col(0xb06a3a, .35, .7), 0, 0.98, 0.3, 16, rg); const ph = cyl(0.012, 0.012, 0.22, mats.dark, -0.14, 1.0, 0.3, 6, rg); ph.rotation.z = Math.PI / 2;
    K.point(0xff9a4a, 0.7, 3.5, RX - 0.95, 0.4, rz);
    // rail of hanging pans and the jelly mould (the gold star of The Hidden Case sits on the end of the rail)
    box(0.04, 0.04, 1.3, mats.brass, RX - 0.55, 1.85, rz, false); for (const z of [-0.6, 0.6]) box(0.05, 0.05, 0.05, mats.brass, RX - 0.52, 1.85, rz + z, false);
    for (let i = 0; i < 3; i++){ const z = rz - 0.5 + i * 0.32; cyl(0.004, 0.004, 0.1, mats.iron, RX - 0.57, 1.8, z, 4); const pn = cyl(0.12 - i * 0.015, 0.1 - i * 0.015, 0.06, col(0xb06a3a, .35, .7), RX - 0.6, 1.62, z, 16); pn.rotation.z = Math.PI / 2; }
    const jm = grp(RX - 0.6, 1.68, rz + 0.5); cyl(0.004, 0.004, 0.1, mats.iron, 0.04, 0.12, 0, 4, jm);
    const mould = new T.Mesh(new T.CylinderGeometry(0.07, 0.11, 0.12, 12, 1, true), M2(0xc8743a)); mould.rotation.z = Math.PI / 2 + 0.2; mould.material.side = T.DoubleSide; mould.castShadow = true; jm.add(mould);
    function M2(c){ return K.M({ color:c, roughness:.3, metalness:.85 }); }
    K.holly(RX - 0.1, 2.05, rz, 1.3);

    // ---- left wall: the tall kitchen cupboard (doors open), the dresser ----
    const cz = -1.25, cx = LX + 0.24;
    const cupM = col(0xd9cfb4, .7);
    box(0.46, 2.2, 0.04, cupM, cx, 1.1, cz - 0.5); box(0.46, 2.2, 0.04, cupM, cx, 1.1, cz + 0.5); box(0.04, 2.2, 1.0, cupM, LX + 0.03, 1.1, cz); box(0.46, 0.04, 1.0, cupM, cx, 2.2, cz); box(0.46, 0.04, 1.0, cupM, cx, 0.02, cz);
    for (const y of [0.55, 1.05, 1.5, 1.92]) box(0.42, 0.03, 0.96, cupM, cx, y, cz, false);
    // doors swung open
    for (const s of [-1, 1]){ const hg = grp(cx + 0.23, 0, cz + s * 0.5, 0); const dd = box(0.03, 2.1, 0.48, col(0x6b8a6a, .6), 0, 1.1, -s * 0.24, true, hg); hg.rotation.y = -s * 1.9; if (s === -1) K.bookDoor = hg; }
    // the cupboard book, on a nail inside the right-hand door
    const bkT = tex(96, 128, (g, w, h) => { g.fillStyle = '#f3ecd6'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,40,90,.6)'; g.lineWidth = 1.5; for (let y = 22; y < h - 8; y += 10){ g.beginPath(); g.moveTo(8, y); g.lineTo(8 + rnd(40, 80), y); g.stroke(); } g.fillStyle = '#333'; g.fillRect(8, 8, 60, 6); });
    plane(0.14, 0.19, K.M({ map:bkT, side:T.DoubleSide }), -0.02, 1.4, 0.24, 0, -Math.PI / 2, 0, K.bookDoor); box(0.01, 0.01, 0.03, mats.iron, -0.02, 1.5, 0.24, false, K.bookDoor);
    const tsy = 1.95;
    const shelfItems = [[cz - 0.38, 'tin'], [cz - 0.22, 'jar'], [cz - 0.08, 'jar2'], [cz + 0.04, 'small'], [cz + 0.13, 'small'], [cz + 0.22, 'small'], [cz + 0.34, 'bottle']];
    shelfItems.forEach(([z, k], i) => { if (k === 'tin') cyl(0.06, 0.06, 0.13, col(0x8e1f1f, .4, .5), cx - 0.05, tsy + 0.065, z, 12); else if (k === 'jar') cyl(0.05, 0.05, 0.14, new T.MeshPhysicalMaterial({ color:0xf4f1ea, transparent:true, opacity:.6, roughness:.1 }), cx - 0.05, tsy + 0.07, z, 12); else if (k === 'jar2') cyl(0.045, 0.045, 0.13, new T.MeshPhysicalMaterial({ color:0xe0f0e0, transparent:true, opacity:.6, roughness:.1 }), cx - 0.05, tsy + 0.065, z, 12); else if (k === 'small') cyl(0.028, 0.028, 0.08, col([0x6b4423, 0x3a2414, 0x8a6a3a][i % 3], .5), cx - 0.05, tsy + 0.04, z, 8); else cyl(0.03, 0.035, 0.15, col(0x5a1a2a, .3), cx - 0.05, tsy + 0.075, z, 10); });
    for (let s = 0; s < 3; s++){ const y = [0.57, 1.07, 1.52][s]; for (let i = 0; i < 5; i++) cyl(0.045, 0.045, 0.12, col([0xb3241f, 0xe9e1cf, 0x6b4423, 0x2f5d8a, 0xd9a441][(i + s) % 5], .5), cx - 0.05, y + 0.07, cz - 0.36 + i * 0.18, 10); }
    // the dresser with plates
    const dz2 = 1.15; box(0.48, 0.9, 1.4, col(0x6b4423, .55), LX + 0.25, 0.45, dz2); box(0.5, 0.04, 1.44, col(0x7a5634, .5), LX + 0.25, 0.92, dz2); box(0.06, 1.1, 1.4, col(0x6b4423, .55), LX + 0.04, 1.5, dz2);
    for (const y of [1.3, 1.7]){ box(0.22, 0.03, 1.36, col(0x6b4423, .55), LX + 0.15, y, dz2, false); for (let i = 0; i < 6; i++){ const pl = cyl(0.11, 0.11, 0.015, col(i % 2 ? 0xf4f1ea : 0x2f5d8a, .3), LX + 0.12, y + 0.12, dz2 - 0.55 + i * 0.22, 18); pl.rotation.z = Math.PI / 2 - 0.15; } }
    for (let i = 0; i < 4; i++){ cyl(0.04, 0.035, 0.08, col(0xf4f1ea, .3), LX + 0.3, 0.98, dz2 - 0.5 + i * 0.33, 10); }

    // ---- centre: the kitchen table with the recipe card and a tray of mince pies ----
    const tx = -0.2, tz = -0.5;
    box(1.5, 0.06, 0.9, K.M({ map:tex(256, 128, (g, w, h) => D.wood(g, w, h, '#c8a878', 40)), roughness:.75 }), tx, 0.78, tz); for (const x of [-0.65, 0.65]) for (const z of [-0.36, 0.36]) box(0.07, 0.75, 0.07, col(0x8a6a4a, .6), tx + x, 0.375, tz + z);
    const card = plane(0.16, 0.11, K.M({ map:tex(128, 88, (g, w, h) => { g.fillStyle = '#fbf6e6'; g.fillRect(0, 0, w, h); g.fillStyle = '#b3241f'; g.fillRect(0, 0, w, 10); g.strokeStyle = 'rgba(30,40,90,.6)'; g.lineWidth = 1.5; for (let y = 22; y < h - 6; y += 10){ g.beginPath(); g.moveTo(8, y); g.lineTo(8 + rnd(50, 105), y); g.stroke(); } }), roughness:.9 }), tx + 0.35, 0.812, tz + 0.15, -Math.PI / 2, 0, 0.3);
    box(0.5, 0.02, 0.34, col(0xb7b2a6, .35, .6), tx - 0.35, 0.82, tz - 0.05);
    for (let i = 0; i < 12; i++){ const p = cyl(0.035, 0.03, 0.025, col(0xc88a4a, .8), tx - 0.53 + (i % 4) * 0.12, 0.845, tz - 0.15 + Math.floor(i / 4) * 0.1, 10); sph(0.006, col(0xf4f1ea, 1), p.position.x, 0.86, p.position.z, null, 4).castShadow = false; }
    const tp = grp(tx + 0.05, 0.81, tz - 0.2); sph(0.08, col(0x8e1f1f, .3), 0, 0.07, 0, tp, 14); const tsp = cyl(0.01, 0.02, 0.1, col(0x8e1f1f, .3), 0.09, 0.08, 0, 6, tp); tsp.rotation.z = -0.9;
    for (const [x, z] of [[-0.75, 0.0], [0.6, 0.15]]){ const ch = grp(tx + x, 0, tz + z); box(0.42, 0.04, 0.42, col(0x8a6a4a, .6), 0, 0.45, 0, true, ch); for (const a of [[-.18, -.18], [-.18, .18], [.18, -.18], [.18, .18]]) box(0.035, 0.45, 0.035, col(0x6b4423, .6), a[0], 0.225, a[1], true, ch); box(0.04, 0.45, 0.42, col(0x8a6a4a, .6), x < 0 ? -0.2 : 0.2, 0.7, 0, true, ch); }
    // rocking chair by the range
    const rc = grp(1.9, 0, 0.9, -0.9); box(0.46, 0.05, 0.44, col(0x6b4423, .6), 0, 0.45, 0, true, rc); box(0.46, 0.7, 0.05, col(0x6b4423, .6), 0, 0.82, -0.22, true, rc); box(0.4, 0.06, 0.4, col(0xb3241f, .9), 0, 0.5, 0.02, false, rc);
    for (const x of [-0.2, 0.2]){ const rk = new T.Mesh(new T.TorusGeometry(0.6, 0.015, 5, 16, 0.9), col(0x5a3622, .6)); rk.rotation.y = Math.PI / 2; rk.rotation.x = 0; rk.rotation.z = -Math.PI / 2 - 0.45; rk.position.set(x, 0.62, 0); rc.add(rk); for (const z of [-0.18, 0.18]) box(0.03, 0.42, 0.03, col(0x5a3622, .6), x, 0.22, z, true, rc); }
    // bread bin and herbs
    const bb = grp(0.9, 0.0, FZ - 0.4); box(0.9, 0.85, 0.5, col(0x6b4423, .55), 0, 0.425, 0, true, bb); box(0.92, 0.04, 0.52, col(0x7a5634, .5), 0, 0.87, 0, true, bb);
    box(0.36, 0.2, 0.26, col(0xd8d2c4, .4), -0.2, 0.99, 0, true, bb); cyl(0.13, 0.13, 0.26, col(0xd8d2c4, .4), -0.2, 1.09, 0, 12, bb).rotation.x = Math.PI / 2;
    for (let i = 0; i < 5; i++){ const hb = grp(-1.6 + i * 0.28, H - 0.35, 0.6); cyl(0.003, 0.003, 0.25, col(0x6b5a3a, 1), 0, 0.12, 0, 4, hb); const bn = new T.Mesh(new T.ConeGeometry(0.06, 0.25, 6), col([0x5a7a3a, 0x7a8a4a, 0x6b6a3a][i % 3], .9)); bn.position.y = -0.1; bn.rotation.x = Math.PI; hb.add(bn); }
    box(1.7, 0.03, 0.03, mats.dark, -1.05, H - 0.22, 0.6, false);
    // ---- front wall: the kitchen door to the shop, the cork board with the stall roster ----
    K.door({ side:'front', u:-1.4, w:0.9, h:2.0, mat:col(0x6b4423, .5), panel:0x7a5634 });
    box(0.7, 0.55, 0.03, col(0xb08a5a, .9), 0.0, 1.5, FZ - 0.02, false);
    const rT = tex(128, 96, (g, w, h) => { g.fillStyle = '#f4efe0'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.fillRect(8, 6, 90, 6); g.fillStyle = 'rgba(40,60,120,.5)'; for (let y = 22; y < 70; y += 12) g.fillRect(50, y, 60, 8); g.strokeStyle = '#555'; for (let y = 20; y < 72; y += 12){ g.beginPath(); g.moveTo(6, y); g.lineTo(w - 6, y); g.stroke(); } g.fillStyle = '#444'; g.fillRect(8, 80, 100, 3); });
    plane(0.3, 0.22, K.M({ map:rT }), -0.08, 1.55, FZ - 0.04, 0, Math.PI, 0); sph(0.01, mats.red, -0.08, 1.65, FZ - 0.045, null, 6);
    plane(0.16, 0.2, mats.paper, 0.22, 1.45, FZ - 0.04, 0, Math.PI, 0.1);
    // the kitchen calendar by the cork board, and a wire cooling rack with a tin tray from the stall (extra clues)
    const kcT = tex(128, 170, (g, w, h) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, w, h); g.fillStyle = '#8e1f1f'; g.fillRect(0, 0, w, 54); g.fillStyle = '#f4f1ea'; for (let i = 0; i < 5; i++) D.star(g, 20 + i * 22, 27, 7); g.strokeStyle = '#c9b48a'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(6 + c * 16.5, 62 + r * 20, 16.5, 20); g.fillStyle = 'rgba(30,40,90,.8)'; for (let k = 0; k < 3; k++) g.fillRect(6 + 16.5 + 2, 62 + 7 + k * 4, 12 - k * 2, 2); });
    plane(0.3, 0.4, K.M({ map:kcT, roughness:.9 }), 0.75, 1.62, FZ - 0.012, 0, Math.PI, 0); sph(0.01, mats.red, 0.75, 1.83, FZ - 0.02, null, 6);
    const rk = grp(1.13, 0.89, FZ - 0.42, 0.1); for (let i = 0; i < 7; i++) box(0.36, 0.006, 0.006, mats.iron, 0, 0.03, -0.13 + i * 0.043, false, rk); for (const x of [-0.17, 0.17]) box(0.008, 0.03, 0.3, mats.iron, x, 0.015, 0, false, rk);
    box(0.32, 0.012, 0.24, col(0xa8a8a0, .35, .7), 0, 0.04, 0, true, rk);
    for (let i = 0; i < 4; i++){ cyl(0.033, 0.028, 0.022, col(0xc88a4a, .8), -0.09 + (i % 2) * 0.12, 0.057, -0.05 + Math.floor(i / 2) * 0.1, 10, rk); }
    K.lights([LX + 0.2, H - 0.05, FZ - 0.1], [RX - 0.2, H - 0.05, FZ - 0.1], 26, 0.22);
    K.point(0xffd7a8, 0.75, 9, -0.2, H - 0.5, -0.3);
    cyl(0.2, 0.3, 0.16, K.M({ color:0xe9e1cf, side:T.DoubleSide, roughness:.6, emissive:0x8a6a3a, emissiveIntensity:.35 }), -0.2, H - 0.42, -0.3, 14); cyl(0.006, 0.006, 0.3, mats.iron, -0.2, H - 0.18, -0.3, 4);
    K.key([0.2, H - 0.12, 1.6], [-0.4, 0.6, -1.2], 0.55, Math.PI / 2.6);
    K.scene.add(new T.HemisphereLight(0xffe8c8, 0x2a1a0c, 0.28));
    const moon = new T.DirectionalLight(0x9fb6ff, 0.25); moon.position.set(WIN.u, 4, BZ - 6); moon.target.position.set(WIN.u, 0, BZ + 1); K.scene.add(moon); K.scene.add(moon.target);
  },
  tick(t, K){ if (K.keep && K.keep[0]) K.keep[0].material.color.setRGB(1, 0.5 + Math.sin(t * 6) * 0.06 + Math.random() * 0.05, 0.15); },

  clues:{
    shelf:{ name:'The top shelf of the tall cupboard', at:[-3.06, 2.0, -1.25], size:[0.46, 0.3, 0.96],
      look:'The tall kitchen cupboard stands open. Jars and tins stand along the top shelf.',
      prompt:'Look along the top shelf. Is anything missing?', hint:'Look behind the cocoa tin.', hot:[[0.1, 0.3, 0.3, 0.85]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#d9cfb4'; g.fillRect(0, 0, w, h); g.fillStyle = '#c4b998'; g.fillRect(0, 300, w, 30); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 330, w, 70);
        const item = (x, wd, ht, c, lab, glass) => { g.fillStyle = c; if (glass) g.globalAlpha = .75; D.rr(g, x, 300 - ht, wd, ht, 8); g.fill(); g.globalAlpha = 1; if (lab){ g.fillStyle = '#f8f3e4'; g.fillRect(x + 6, 300 - ht * .6, wd - 12, 26); g.fillStyle = '#22305a'; g.font = '18px Caveat, cursive'; g.textAlign = 'center'; g.fillText(lab, x + wd / 2, 300 - ht * .6 + 19); g.textAlign = 'left'; } };
        item(30, 92, 140, '#8e1f1f', 'Cocoa');
        g.strokeStyle = 'rgba(60,40,20,.25)'; g.setLineDash([5, 6]); g.lineWidth = 2; g.strokeRect(96, 192, 48, 106); g.setLineDash([]);
        item(160, 70, 150, '#e9e4d6', 'Sugar', true); item(240, 62, 130, '#cfe3cf', 'Peppermints', true);
        item(312, 40, 80, '#6b4423', 'Nutmeg'); item(358, 40, 80, '#3a2414', 'Cloves'); item(404, 40, 80, '#8a6a3a', 'Vanilla'); item(452, 54, 120, '#5a1a2a', 'Cough');
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, w, 18); },
      kicker:'Clue',
      html:'<p>Agnes keeps her sleeping draught on this top shelf, in a little brown bottle behind the cocoa tin. She calls it her "sleeping drops".</p><div class="observe">The place behind the cocoa tin is <b>empty</b>. The bottle has gone.</div><div class="doc type" style="font-size:13px">CONSTABLE AMBROSE, 9:40 pm.<br>The list on the cupboard door, the 9 things kept on the top shelf: cocoa tin, sugar jar, peppermint jar, nutmeg, cinnamon, cloves, vanilla, cough syrup, sleeping draught.<br>On the top shelf now, 7 things: cocoa tin, sugar jar, peppermint jar, nutmeg, cloves, vanilla, cough syrup.<br>AGNES: "The cinnamon? I used every bit glazing pies at the stall."</div>',
      note:'Top shelf of the tall cupboard: the sleeping draught has gone from behind the cocoa tin. 7 of the 9 things are left (the cinnamon was used up at the stall).' },

    book:{ name:"Agnes's cupboard book", at:[-2.6, 1.4, -1.82], size:[0.3, 0.36, 0.3],
      look:'A little notebook hangs on a nail inside the open cupboard door.',
      prompt:'Read the cupboard book.', hint:'Agnes writes a time, what went in or out, and how many things she saw left.', hot:[[0.06, 0.16, 0.94, 0.96]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#6b8a6a'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a3a3e'; g.beginPath(); g.arc(300, 14, 6, 0, Math.PI * 2); g.fill(); D.paper(g, 40, 22, 520, 372, '#f6efd8');
        D.text(g, ['TOP SHELF. What goes in or out, and how many things are left.'], 300, 34, 24, '19px Caveat, cursive', '#1a2550', 'center');
        D.text(g, ['Morning: dusted. Left 9.', '12:30 out: nutmeg, lent to Martha. Left 8.', '4:00 in: nutmeg, back from Martha. Left 9.', '6:30 out: cinnamon and cloves, for the stall. Left 7.', '8:00 in: cloves. Left 7.', '8:15 out: cocoa tin and sugar jar. Left 5.', '8:40 in: cocoa tin and sugar jar. Left 7.'], 64, 74, 44, '27px Caveat, cursive', '#1a2550'); },
      kicker:'Evidence',
      html:'<div class="doc hand" style="font-size:20px">TOP SHELF. What goes in or out, and how many things are left.<br>Morning: dusted. Left 9.<br>12:30 out: nutmeg, lent to Martha. Left 8.<br>4:00 in: nutmeg, back from Martha. Left 9.<br>6:30 out: cinnamon and cloves, for the stall. Left 7.<br>8:00 in: cloves. Left 7.<br>8:15 out: cocoa tin and sugar jar. Left 5.<br>8:40 in: cocoa tin and sugar jar. Left 7.</div><p class="small">Agnes writes down the number she sees, without doing any sums.</p>',
      note:'Agnes\'s cupboard book: every time something went in or out of the top shelf that day, and the number she saw left. She never does sums.' },

    recipe:{ name:'The recipe card', at:[0.15, 0.84, -0.35], size:[0.3, 0.1, 0.26],
      look:'A small card with a red edge lies on the kitchen table.',
      prompt:'Read the card. Which part tells you about time?', hint:'Look at the minutes in the steps.', hot:[[0.06, 0.22, 0.94, 0.94]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#c8a878'); D.paper(g, 40, 20, 520, 360, '#fbf6e6', -0.01); g.fillStyle = '#b3241f'; g.fillRect(40, 20, 520, 14);
        D.text(g, ["Mr Crane's Cocoa"], 300, 48, 30, 'bold 34px Caveat, cursive', '#1a2550', 'center');
        D.text(g, ['1. Milk in the small pan on a low flame. Warm it', '    gently for 10 minutes. Never let it boil!', '2. Whisk in the cocoa and two sugars.', '3. Let it stand 10 minutes to thicken, then carry', '    it through on the tray, hot.'], 64, 108, 50, '27px Caveat, cursive', '#1a2550'); },
      kicker:'Evidence',
      html:'<div class="doc hand"><b>Mr Crane\'s Cocoa</b><br>1. Milk in the small pan on a low flame. Warm it gently for 10 minutes. Never let it boil!<br>2. Whisk in the cocoa and two sugars.<br>3. Let it stand 10 minutes to thicken, then carry it through on the tray, hot.</div>',
      note:'Agnes\'s recipe card: warm the milk 10 minutes, whisk in the cocoa and two sugars, let it stand 10 minutes, then carry it through hot.' },

    roster:{ name:'The card on the cork board', at:[-0.05, 1.52, 2.74], size:[0.4, 0.34, 0.1],
      look:'A card with blotchy ink is pinned to the cork board by the door. It looks as if it has been dropped in the snow.',
      prompt:'Read the card. What can still be read?', hint:'Look at the pencil at the bottom.', hot:[[0.06, 0.74, 0.94, 0.97]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#b08a5a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 500; i++){ g.fillStyle = `rgba(60,40,20,${Math.random() * .2})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } D.paper(g, 30, 12, 540, 376, '#f6f1e0');
        D.text(g, ['MINCE-PIE STALL ROSTER', 'Switch-on night, second shift', 'Two helpers at the stall at all times. No exceptions.  E.B.'], 300, 22, 26, 'bold 18px Special Elite, monospace', '#111', 'center');
        const slots = ['8:40 to 9:00', '9:00 to 9:10', '9:10 to 9:20', '9:20 to 9:30'];
        slots.forEach((s, i) => { const y = 118 + i * 42; g.strokeStyle = '#777'; g.beginPath(); g.moveTo(50, y + 34); g.lineTo(550, y + 34); g.stroke(); D.text(g, [s], 60, y + 8, 20, '17px Special Elite, monospace', '#111');
          g.fillStyle = 'rgba(50,70,140,.35)'; for (let k = 0; k < 4; k++){ g.beginPath(); g.ellipse(310 + k * 50, y + 18, 36, 12, Math.random(), 0, Math.PI * 2); g.fill(); } });
        D.text(g, ['Edith: 1 slot,  Walter: 2 slots,  Lucy: 1 slot.', 'Agnes:'], 60, 304, 30, '26px Caveat, cursive', '#333');
        g.fillStyle = 'rgba(50,70,140,.3)'; g.beginPath(); g.ellipse(200, 350, 60, 14, 0, 0, Math.PI * 2); g.fill(); },
      kicker:'Evidence',
      html:'<div class="doc type" style="font-size:13px"><b>MINCE-PIE STALL ROSTER</b><br>Switch-on night, second shift<br>Two helpers at the stall at all times. No exceptions. E.B.<br><br>8:40 to 9:00 (ink run by snow)<br>9:00 to 9:10 (ink run by snow)<br>9:10 to 9:20 (ink run by snow)<br>9:20 to 9:30 (ink run by snow)<br><br>Pencil tally at the bottom, still clear:<br>Edith: 1 slot, Walter: 2 slots, Lucy: 1 slot.<br>Agnes: (the snow has taken it)</div>',
      note:'Stall roster, second shift: four slots from 8:40 to 9:30, two helpers at all times. Pencil tally: Edith 1 slot, Walter 2, Lucy 1. Agnes\'s tally is lost in the snow.' },
  },

  decoys:{
    range:{ name:'The range', at:[2.75, 0.55, -0.7], size:[0.66, 1.1, 1.36], look:'The big iron range keeps the kitchen warm. A kettle and the small milk pan stand on top.', close:'The small milk pan Agnes uses for the cocoa stands on the hob. The fire glows inside. Nothing out of place.' },
    sink:{ name:'The stone sink', at:[-0.8, 0.9, -2.48], size:[1.1, 0.3, 0.56], look:'A deep stone sink under the window, with a brass tap.', close:'A dishcloth and a scrubbing brush. Nothing out of place.' },
    backdoor:{ name:'The back door', at:[1.7, 1.0, -2.75], size:[0.92, 2.0, 0.12], look:'The back door opens onto the yard.', close:'There is no key in it. Agnes says this door is never locked. Nothing else to see.' },
    dresser:{ name:'The dresser', at:[-3.05, 1.1, 1.15], size:[0.5, 1.2, 1.44], look:'A dresser full of blue and white plates.', close:'Plates, cups and a gravy boat, all dusted. Nothing out of place.' },
    pies:{ name:'The tray of mince pies', at:[-0.55, 0.86, -0.55], size:[0.52, 0.1, 0.36], look:'A tray of mince pies, fresh from the oven, dusted with sugar.', close:'They smell wonderful. You do not eat one. Nothing out of place.' },
    teapot:{ name:'The teapot', at:[-0.15, 0.89, -0.7], size:[0.24, 0.2, 0.22], look:'A round red teapot on the table.', close:'Cold tea. Nothing out of place.' },
    rocker:{ name:'The rocking chair', at:[1.9, 0.6, 0.9], size:[0.6, 1.2, 0.6], look:'A rocking chair with a red cushion, close to the warm range.', close:"Agnes's knitting bag hangs on the back. Nothing out of place." },
    herbs:{ name:'The drying herbs', at:[-1.05, 2.4, 0.6], size:[1.6, 0.4, 0.2], look:'Bunches of herbs hang drying from a rail.', close:'Sage, thyme and bay. Nothing out of place.' },
    breadbin:{ name:'The bread bin', at:[0.7, 1.05, 2.4], size:[0.42, 0.32, 0.3], look:'A cream bread bin on the side.', close:'Half a loaf, wrapped in a cloth. Nothing out of place.' },
    mould:{ name:'The jelly mould', at:[2.68, 1.68, -0.2], size:[0.26, 0.3, 0.3], look:'A copper jelly mould hangs on a hook above the range, shining in the firelight.', close:'Polished and empty, ready for the Christmas jelly. Nothing out of place.' },
    door:{ name:'The kitchen door', at:[-1.4, 1.0, 2.74], size:[0.92, 2.0, 0.12], look:'The kitchen door opens into the toy shop.', close:'Nothing out of place.' },
  },

  // ---------------------------------------------------------------- extra clues (room only, never needed: one for each night)
  extras:{
    calendar:{ night:9, name:'The kitchen calendar', at:[0.75, 1.62, 2.74], size:[0.34, 0.44, 0.1],
      look:'A calendar hangs on the wall beside the cork board, with notes in Agnes\'s neat hand.',
      prompt:'Find the night of the lights. What did Agnes write there?', hint:'Look for the square with the most writing in it.', hot:[[0.24, 0.36, 0.62, 0.62]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#e3d6b4'; g.fillRect(0, 0, w, h); D.paper(g, 110, 10, 380, 380, '#f7f1df'); g.fillStyle = '#8e1f1f'; g.fillRect(110, 10, 380, 86); g.fillStyle = '#f4f1ea'; for (let i = 0; i < 5; i++) D.star(g, 170 + i * 65, 52, 16);
        g.strokeStyle = '#c9b48a'; g.lineWidth = 1.5; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(122 + c * 51, 108 + r * 54, 51, 54);
        g.strokeStyle = 'rgba(30,40,90,.4)'; g.lineWidth = 2; [[4, 0], [2, 2], [5, 3], [0, 4], [6, 1]].forEach(([c, r]) => { g.beginPath(); g.moveTo(128 + c * 51, 136 + r * 54); g.lineTo(164 + c * 51, 134 + r * 54); g.stroke(); });
        g.fillStyle = '#fbf6e8'; g.fillRect(150, 160, 210, 84); g.strokeStyle = '#8e1f1f'; g.lineWidth = 2; g.strokeRect(150, 160, 210, 84);
        D.text(g, ['Stall, first shift,', '6:30 to 8.', 'Kitchen empty.'], 160, 164, 26, '25px Caveat, cursive', '#1a2550'); },
      text:'On the kitchen calendar for the night of the lights, in Agnes\'s hand: "Stall, first shift, 6:30 to 8. Kitchen empty."' },

    tray:{ night:19, name:'The cooling rack', at:[1.13, 0.95, 2.36], size:[0.4, 0.14, 0.34],
      look:'A wire cooling rack on the side, with an old tin tray from the mince-pie stall on it.',
      prompt:'Look closely at the tray. Is anything written on the tin?', hint:'Look at the scratches in the corner of the tray.', hot:[[0.56, 0.62, 0.92, 0.9]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#7a5634'); g.strokeStyle = '#3a3a3e'; g.lineWidth = 4; for (let i = 0; i < 9; i++){ g.beginPath(); g.moveTo(40, 40 + i * 40); g.lineTo(560, 40 + i * 40); g.stroke(); }
        const gr = g.createLinearGradient(0, 60, 0, 360); gr.addColorStop(0, '#c9c9c0'); gr.addColorStop(1, '#8a8a82'); g.fillStyle = gr; D.rr(g, 70, 60, 460, 300, 16); g.fill(); g.strokeStyle = '#6a6a64'; g.lineWidth = 6; g.stroke();
        for (let i = 0; i < 6; i++){ const x = 140 + (i % 3) * 110, y = 120 + Math.floor(i / 3) * 90; g.fillStyle = '#c88a4a'; g.beginPath(); g.arc(x, y, 36, 0, Math.PI * 2); g.fill(); g.fillStyle = '#a86a32'; g.beginPath(); g.arc(x, y, 24, 0, Math.PI * 2); g.fill(); g.fillStyle = '#f4f1ea'; D.star(g, x, y, 10); }
        g.save(); g.translate(430, 312); g.rotate(-0.05); g.strokeStyle = 'rgba(40,40,40,.75)'; g.lineWidth = 2; g.font = '27px Caveat, cursive'; g.fillStyle = 'rgba(40,40,45,.8)'; g.fillText('Agnes: 4 slots.', -86, 6); g.restore(); },
      text:'On a mince-pie tray on the cooling rack, Mrs Bramble\'s pencil tally scratched on the tin: "Agnes: 4 slots."' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[2.75, 1.93, -1.25], rot:[0, -Math.PI / 2, -0.1], seek:'Look up above the range, along the rail where the copper pans hang.' },

  clips:{
  },
  // Recorded voices go in /audio/ at the site root; if a file is missing, the phone's own voice reads the words.
  AUDIO_FILES:{  },
};
CM.start(ROOM);
