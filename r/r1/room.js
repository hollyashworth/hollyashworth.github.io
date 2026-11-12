/* Room 1: The Workshop behind Crane's Toys (crime scene). Nights 3, 4, 8, 17 and 23.
   Facts from book/BIBLE.md. Facing south: the yard window is on the back wall, the gate to Church Lane
   is on the left (east) side of the yard, the shop door is behind you (north). */
const ROOM = {
  code:'r1',
  title:'The Workshop',
  subtitle:'Crime scene 1 · Night 3',
  view:{ pos:[0.3, 1.6, 0.6], yaw:0.22, pitch:-0.12 },
  previews:[0.22, -1.1, 1.3, 2.9, -2.4],
  intro:{
    kicker:'Night 3 · Crime scene 1',
    heading:'The workshop behind the toy shop',
    paras:[
      'This is where Edmund Crane was found at 9:20 on the night of the lights. Constable Ambrose has left everything just as it was.',
      '<b>Your task:</b> search the workshop and find what does not belong. Come back on Nights 4, 8, 17 and 23 too: some things in here matter later in the case.',
    ],
    button:'Step into the workshop',
  },

  // ---------------------------------------------------------------- 3D
  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 7.6, DP = 6.6, H = 3.0, BZ = -DP / 2;
    const WIN = { u:-1.7, w:1.7, b:0.5, t:2.0 };
    const wallMat = K.M({ map:tex(256, 256, (g, w, h) => { g.fillStyle = '#8f8068'; g.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let c = 0; c < 5; c++){ const x = c * 52 + (r % 2 ? 26 : 0) - 26, y = r * 32, v = rnd(-12, 12); g.fillStyle = D.shade('#b4a283', v); g.fillRect(x + 2, y + 2, 48, 28); } }, [1, 1]), roughness:.95 });
    const boardMat = K.M({ map:tex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++){ g.fillStyle = D.shade('#6b4a2c', rnd(-12, 12)); g.fillRect(i * 32, 0, 32, h); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(i * 32, 0, 2, h); } }, [1, 1]), roughness:.8 });
    const floorMat = K.M({ map:tex(512, 512, (g, w, h) => { D.planks(g, w, h, '#6a4a2c', 8); for (let i = 0; i < 500; i++){ g.fillStyle = `rgba(230,200,140,${rnd(.2, .6)})`; g.fillRect(rnd(0, w), rnd(0, h), rnd(1, 4), rnd(1, 2)); } }, [3, 3]), roughness:.75 });
    K.shell({ w:W, d:DP, h:H, wallMat, panelMat:boardMat, floorMat, wallTile:[1.6, 1.0], panelTile:[1.0, 1.05], beams:1.3, ceilMat:K.M({ map:tex(256, 256, (g, w, h) => D.planks(g, w, h, '#4a3220', 8), [3, 3]), roughness:.9 }),
      open:{ back:[{ u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t }] } });

    // ---- the yard window (the left pane forced and left a little open) ----
    K.windowFrame({ side:'back', u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t, snow:true, open:0.2, openPane:0, bars:1 });
    // latch on the meeting rail
    box(0.05, 0.08, 0.04, mats.brass, WIN.u, 1.3, BZ + 0.06, false);
    // outside: the snowy yard, its walls, the gate to Church Lane, and the night beyond
    const snowMat = K.M({ map:tex(256, 256, (g, w, h) => D.snow(g, w, h), [4, 4]), roughness:1 });
    const yard = K.outsideGround('back', 0, 14, 9, snowMat, 0);
    const stone = col(0x6f6a64, .95), cap = mats.snow;
    const EX = -4.2, GZ = BZ - 3.6;                                          // east yard wall and the gate in it
    const wallSeg = (x, z0, z1) => { box(0.3, 1.4, z0 - z1, stone, x, 0.7, (z0 + z1) / 2, false); box(0.36, 0.08, z0 - z1, cap, x, 1.44, (z0 + z1) / 2, false); };
    wallSeg(EX, BZ - 0.05, GZ + 0.65); wallSeg(EX, GZ - 0.65, BZ - 6.2);
    box(10.5, 1.4, 0.3, stone, 0.8, 0.7, BZ - 6.2, false); box(10.5, 0.08, 0.36, cap, 0.8, 1.44, BZ - 6.2, false);
    for (const dz of [0.65, -0.65]){ box(0.4, 1.6, 0.4, col(0x5e5953, .95), EX, 0.8, GZ + dz, false); box(0.44, 0.08, 0.44, cap, EX, 1.64, GZ + dz, false); }
    const lan = grp(EX + 0.05, 1.68, GZ + 0.65); box(0.1, 0.14, 0.1, mats.iron, 0, 0.07, 0, false, lan); box(0.07, 0.1, 0.07, new T.MeshBasicMaterial({ color:0xffc870 }), 0, 0.07, 0, false, lan);
    const glowS = new T.Sprite(new T.SpriteMaterial({ map:tex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(255,210,130,.9)'); gr.addColorStop(1, 'rgba(255,210,130,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }), transparent:true, depthWrite:false, blending:T.AdditiveBlending })); glowS.scale.set(0.8, 0.8, 1); glowS.position.set(EX + 0.05, 1.76, GZ + 0.65); K.scene.add(glowS);
    const gate = grp(EX, 0, GZ); const gw = col(0x4a3a2a, .8);
    for (let i = 0; i < 6; i++) box(0.06, 1.25, 0.16, gw, 0, 0.7, -0.5 + i * 0.2, false, gate);
    box(0.08, 0.1, 1.1, gw, 0.02, 1.1, 0, false, gate); box(0.08, 0.1, 1.1, gw, 0.02, 0.35, 0, false, gate);
    // Track 4: big boots, from the gate to the window and back again (no snow inside them)
    const prT = tex(128, 256, (g, w, h) => { g.clearRect(0, 0, w, h); D.bootPrint(g, w / 2, h * .62, 1.05, 0, { fill:'rgba(60,80,118,.82)', tread:'rgba(35,50,80,.65)', nick:false }); });
    const prMat = new T.MeshStandardMaterial({ map:prT, transparent:true, depthWrite:false, roughness:.9 });
    const trail = (a, b, n, off) => { for (let i = 0; i < n; i++){ const t = (i + .5) / n; const x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t; const ang = Math.atan2(b[0] - a[0], b[1] - a[1]); const side = (i % 2 ? 1 : -1) * 0.07;
      const m = new T.Mesh(new T.PlaneGeometry(0.16, 0.32), prMat); m.rotation.x = -Math.PI / 2; m.rotation.z = ang + Math.PI; m.position.set(x + Math.cos(ang) * side + off, 0.012, z - Math.sin(ang) * side); K.scene.add(m); } };
    trail([EX + 0.2, GZ + 0.1], [WIN.u - 0.1, BZ - 0.3], 11, 0);
    trail([WIN.u + 0.2, BZ - 0.3], [EX + 0.2, GZ - 0.15], 11, 0.1);
    // Tracks 1 to 3: the cat's paws and Agnes's small shoes, part filled with snow
    const shoeT = (fillA) => tex(64, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = `rgba(95,115,150,${fillA})`; g.beginPath(); g.ellipse(w / 2, h * .36, w * .3, h * .26, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(w / 2, h * .8, w * .24, h * .13, 0, 0, Math.PI * 2); g.fill(); });
    const track = (a, b, n, texr, sz) => { const mt = new T.MeshStandardMaterial({ map:texr, transparent:true, depthWrite:false, roughness:.9 }); for (let i = 0; i < n; i++){ const t = (i + .5) / n; const ang = Math.atan2(b[0] - a[0], b[1] - a[1]); const side = (i % 2 ? 1 : -1) * sz[2];
      const m = new T.Mesh(new T.PlaneGeometry(sz[0], sz[1]), mt); m.rotation.x = -Math.PI / 2; m.rotation.z = ang + Math.PI; m.position.set(a[0] + (b[0] - a[0]) * t + Math.cos(ang) * side, 0.011, a[1] + (b[1] - a[1]) * t - Math.sin(ang) * side); K.scene.add(m); } };
    track([EX + 0.2, GZ - 0.3], [4.6, BZ - 0.6], 22, shoeT(.2), [0.1, 0.24, 0.06]);
    track([4.6, BZ - 0.8], [EX + 0.2, GZ - 0.5], 22, shoeT(.45), [0.1, 0.24, 0.06]);
    const pawT = tex(64, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(110,130,160,.25)'; g.beginPath(); g.arc(32, 40, 12, 0, Math.PI * 2); g.fill(); for (let i = 0; i < 4; i++){ g.beginPath(); g.arc(14 + i * 12, 20 - (i % 3 ? 4 : 0), 5, 0, Math.PI * 2); g.fill(); } });
    track([EX + 0.4, BZ - 5.85], [4.6, BZ - 5.85], 34, pawT, [0.07, 0.07, 0.04]);
    // the night: rooftops, the church tower of St Nicholas across the lane, stars
    K.backdrop('back', -0.5, 3.2, 12, 30, 10, (g, w, h) => {
      D.night(g, w, h, '#09111f', '#2c3a57');
      g.fillStyle = '#f2f4f8'; g.beginPath(); g.arc(w * .78, h * .16, 18, 0, Math.PI * 2); g.fill();
      // churchyard trees and the church on the left (east)
      g.fillStyle = '#101820'; for (let i = 0; i < 9; i++){ const x = w * (.05 + i * .05), s = rnd(30, 55); g.beginPath(); g.moveTo(x, h * .78 - s * 2.4); g.lineTo(x - s * .7, h * .8); g.lineTo(x + s * .7, h * .8); g.fill(); }
      g.fillStyle = '#1a2130'; g.fillRect(w * .16, h * .32, w * .07, h * .5); g.beginPath(); g.moveTo(w * .155, h * .32); g.lineTo(w * .195, h * .14); g.lineTo(w * .235, h * .32); g.fill(); g.fillRect(w * .23, h * .5, w * .16, h * .32);
      g.fillStyle = '#e9eef7'; g.beginPath(); g.moveTo(w * .15, h * .325); g.lineTo(w * .195, h * .15); g.lineTo(w * .2, h * .2); g.lineTo(w * .17, h * .33); g.fill(); g.fillRect(w * .225, h * .49, w * .17, 8);
      g.fillStyle = 'rgba(255,210,130,.95)'; g.fillRect(w * .19, h * .4, 10, 18); g.fillRect(w * .27, h * .6, 12, 20); g.fillRect(w * .33, h * .6, 12, 20);
      // village rooftops to the south
      for (let i = 0; i < 8; i++){ const x = w * (.42 + i * .075), bw = w * .07, top = h * rnd(.5, .6); g.fillStyle = '#1b2232'; g.fillRect(x, top, bw, h * .82 - top); g.fillStyle = '#e9eef7'; g.beginPath(); g.moveTo(x - 4, top + 2); g.lineTo(x + bw / 2, top - h * .07); g.lineTo(x + bw + 4, top + 2); g.fill(); if (i % 2){ g.fillStyle = 'rgba(255,210,130,.9)'; g.fillRect(x + bw * .35, top + h * .08, 10, 12); } }
      g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .8, w, h * .2);
    }, 1024, 400);
    const moon = new T.DirectionalLight(0xa9bcff, 0.55); moon.position.set(-3, 5, BZ - 8); moon.target.position.set(-2, 0, BZ - 3); K.scene.add(moon); K.scene.add(moon.target);

    // ---- the small clock, knocked off the sill: on the floor, stopped at 9:02 ----
    const ck = grp(WIN.u - 0.25, 0.0, BZ + 0.4, 0.5); ck.rotation.order = 'YXZ';
    const cbody = box(0.24, 0.07, 0.2, mats.brass, 0, 0.035, 0, true, ck);
    const cfTex = tex(128, 128, (g, w, h) => { g.fillStyle = '#b8892e'; g.fillRect(0, 0, w, h); D.clockFace(g, 64, 64, 56, 9, 2, { crack:true }); });
    const cface = plane(0.16, 0.16, K.M({ map:cfTex, roughness:.4 }), 0, 0.072, 0, -Math.PI / 2, 0, 0, ck);
    ck.rotation.x = 0.12;

    // ---- extra clues (room only): snow on the sill, a damp heel print, paint flakes, the calendar ----
    const lump = grp(-1.05, 0.512, -3.1); const lumpM = K.M({ color:0xf4f8fc, roughness:.35, emissive:0x223040, emissiveIntensity:.15 });
    sph(0.05, lumpM, 0, 0.012, 0, lump, 10).scale.set(1.3, 0.5, 1); sph(0.03, lumpM, 0.05, 0.004, 0.02, lump, 8).scale.set(1, 0.4, 1);
    plane(0.2, 0.12, new T.MeshStandardMaterial({ color:0x5a3a22, transparent:true, opacity:.45, roughness:.1, depthWrite:false }), 0.0, 0.0, 0.0, -Math.PI / 2, 0, 0.2, lump);
    const heelT = tex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(28,16,8,.62)'; g.beginPath(); g.moveTo(24, 30); g.lineTo(104, 30); g.quadraticCurveTo(112, 104, 64, 110); g.quadraticCurveTo(16, 104, 24, 30); g.fill(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.moveTo(54, 111); g.lineTo(64, 82); g.lineTo(74, 111); g.closePath(); g.fill(); g.globalCompositeOperation = 'source-over'; });
    plane(0.13, 0.13, new T.MeshStandardMaterial({ map:heelT, transparent:true, depthWrite:false, roughness:.25 }), -1.25, 0.011, -2.72, -Math.PI / 2, 0, 0.35);
    for (let i = 0; i < 9; i++){ const f = box(rnd(0.008, 0.018), 0.003, rnd(0.006, 0.014), K.M({ color:0xfafaf4, roughness:.6 }), 0.78 + rnd(-.1, .1), 0.006, 3.1 + rnd(-.07, .07), false); f.rotation.y = rnd(0, 3); }
    const calT = tex(128, 170, (g, w, h) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f4a2a'; g.fillRect(0, 0, w, 56); g.fillStyle = '#e9c45a'; g.fillRect(52, 12, 24, 34); g.fillStyle = '#b3241f'; g.fillRect(48, 8, 32, 8); g.strokeStyle = '#c9b48a'; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(6 + c * 16.5, 64 + r * 20, 16.5, 20); g.fillStyle = 'rgba(30,40,90,.8)'; g.fillRect(6 + 4 * 16.5 + 2, 64 + 2 * 20 + 7, 13, 2); g.fillRect(6 + 4 * 16.5 + 2, 64 + 2 * 20 + 12, 10, 2); });
    plane(0.3, 0.4, K.M({ map:calT, roughness:.9 }), 3.2, 1.55, DP / 2 - 0.012, 0, Math.PI, 0); sph(0.01, mats.red, 3.2, 1.76, DP / 2 - 0.02, null, 6);

    // ---- workbench along the back wall ----
    const bx = 1.7, bz = BZ + 0.42, top = 0.9;
    box(3.2, 0.08, 0.84, K.M({ map:tex(256, 128, (g, w, h) => { D.wood(g, w, h, '#8a6440', 40); for (let i = 0; i < 30; i++){ g.strokeStyle = 'rgba(40,20,5,.25)'; g.beginPath(); g.arc(rnd(0, w), rnd(0, h), rnd(2, 10), 0, Math.PI * 2); g.stroke(); } }), roughness:.7 }), bx, top - 0.04, bz);
    for (const x of [-1.5, 1.5]) for (const z of [-0.36, 0.36]) box(0.09, top - 0.08, 0.09, mats.dark, bx + x, (top - 0.08) / 2, bz + z);
    box(3.0, 0.05, 0.7, mats.dark, bx, 0.25, bz, false);
    // shavings on the bench
    for (let i = 0; i < 26; i++){ const s = sph(0.018, col(0xd9b47a, .8), bx + rnd(-1.4, 1.4), top + 0.005, bz + rnd(-0.3, 0.3), null, 5); s.scale.set(1.6, 0.4, 1); s.castShadow = false; }
    // the tray and the cocoa cup on its side, a little cocoa spilled
    box(0.5, 0.02, 0.36, K.M({ color:0xb7b2a6, roughness:.35, metalness:.6 }), 0.9, top + 0.01, bz + 0.08);
    const cup = grp(0.92, top + 0.065, bz + 0.1, 0.6); const cupM = K.M({ color:0xf3eee4, roughness:.35 });
    const cb = cyl(0.045, 0.038, 0.1, cupM, 0, 0, 0, 16, cup); cb.rotation.z = Math.PI / 2;
    const band = cyl(0.0465, 0.0465, 0.018, mats.red, 0.02, 0, 0, 16, cup); band.rotation.z = Math.PI / 2;
    const hdl = new T.Mesh(new T.TorusGeometry(0.028, 0.008, 6, 12), cupM); hdl.position.set(0, 0.0, -0.05); hdl.rotation.x = Math.PI / 2; cup.add(hdl);
    const spill = plane(0.2, 0.1, new T.MeshStandardMaterial({ map:tex(128, 64, (g, w, h) => { g.fillStyle = 'rgba(70,35,15,.85)'; g.beginPath(); g.ellipse(w * .45, h * .5, w * .42, h * .36, 0.1, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(w * .82, h * .6, w * .12, h * .18, 0, 0, Math.PI * 2); g.fill(); }), transparent:true, depthWrite:false, roughness:.2 }), 1.04, top + 0.022, bz + 0.12, -Math.PI / 2, 0, 0.6);
    cyl(0.07, 0.06, 0.012, cupM, 0.75, top + 0.026, bz + 0.0, 16);   // saucer
    // the Midnight Music Box
    const mb = grp(2.0, top, bz - 0.02, -0.25);
    const lidTex = tex(256, 192, (g, w, h) => { g.fillStyle = '#1d2a4f'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9c45a'; for (let i = 0; i < 26; i++) D.star(g, rnd(10, w - 10), rnd(10, h - 10), rnd(3, 7)); D.star(g, w / 2, h / 2, 28); g.strokeStyle = '#e9c45a'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.beginPath(); g.arc(w * .2, h * .3, 18, 0.6, 5.0); g.stroke(); });
    const mbM = K.M({ color:0x3b2414, roughness:.35 });
    box(0.42, 0.2, 0.3, mbM, 0, 0.1, 0, true, mb);
    box(0.44, 0.012, 0.32, mats.brass, 0, 0.2, 0, false, mb);
    const hinge = grp(0, 0.207, -0.155, 0, mb); K.lidHinge = hinge;
    const lid = box(0.43, 0.05, 0.31, [mbM, mbM, K.M({ map:lidTex, roughness:.4 }), K.M({ color:0x245a32, roughness:.9 }), mbM, mbM], 0, 0.025, 0.155, true, hinge);
    const tc = plane(0.2, 0.13, K.M({ map:tex(128, 84, (g, w, h) => { g.fillStyle = '#f7f1df'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(60,60,80,.35)'; g.lineWidth = 1; for (let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(10, 40 + i * 8); g.lineTo(w - 10, 40 + i * 8); g.stroke(); } g.fillStyle = 'rgba(40,40,70,.5)'; g.font = '12px Georgia'; g.fillText('E.C.', w - 34, 76); }), side:T.DoubleSide, roughness:.9 }), 0.0, -0.002, 0.16, Math.PI / 2, 0, 0.08, hinge);
    tc.visible = false; K.tuneCard = tc; K.keep = [hinge];
    for (const x of [-0.2, 0.2]) for (const z of [-0.14, 0.14]) box(0.03, 0.27, 0.03, mats.brass, x, 0.13, z, false, mb);
    const keyG = grp(0.24, 0.1, 0, 0, mb); cyl(0.01, 0.01, 0.05, mats.brass, 0.0, 0, 0, 8, keyG).rotation.z = Math.PI / 2; box(0.012, 0.07, 0.035, mats.brass, 0.03, 0, 0, false, keyG);
    K.musicKey = keyG;
    // the vice at the end of the bench
    const vg = grp(3.05, top, bz + 0.3); box(0.16, 0.12, 0.12, mats.iron, 0, 0.06, 0, true, vg); box(0.16, 0.12, 0.03, mats.iron, 0, 0.06, 0.1, true, vg); cyl(0.012, 0.012, 0.25, mats.iron, 0, 0.06, 0.2, 8, vg).rotation.x = Math.PI / 2; cyl(0.008, 0.008, 0.2, mats.iron, 0, 0.06, 0.32, 6, vg).rotation.z = Math.PI / 2;
    // bench lamp
    const lg = grp(2.65, top, bz - 0.2); cyl(0.07, 0.08, 0.03, mats.iron, 0, 0.015, 0, 14, lg); const arm = cyl(0.01, 0.01, 0.45, mats.iron, 0, 0.24, 0.05, 6, lg); arm.rotation.x = 0.35;
    const sh = cyl(0.04, 0.1, 0.12, K.M({ color:0x2e4a3a, roughness:.5, side:T.DoubleSide, emissive:0x2e4a3a, emissiveIntensity:.2 }), 0, 0.45, 0.16, 14, lg); sh.rotation.x = 0.5;
    K.point(0xffc27a, 1.1, 4.5, 2.65, top + 0.38, bz + 0.0);
    // small parts: wheels, a half-made train, a plane
    for (let i = 0; i < 5; i++) cyl(0.03, 0.03, 0.015, col(0xb3241f, .5), 1.4 + i * 0.07, top + 0.008, bz - 0.2, 12);
    box(0.18, 0.08, 0.08, col(0x2f5d8a, .5), 1.45, top + 0.04, bz + 0.15); box(0.06, 0.1, 0.07, col(0x2f5d8a, .5), 1.39, top + 0.1, bz + 0.15);
    box(0.22, 0.05, 0.06, mats.wood, 2.4, top + 0.025, bz + 0.2);
    // tool rack above the bench
    const rack = plane(2.6, 1.0, K.M({ map:tex(512, 200, (g, w, h) => { g.fillStyle = '#b08a5a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(60,40,20,.5)'; for (let x = 10; x < w; x += 16) for (let y = 10; y < h; y += 16) g.fillRect(x, y, 3, 3);
      g.fillStyle = '#2a2a2c'; const tools = [[30, 'saw'], [110, 'ham'], [150, 'ham'], [200, 'chis'], [225, 'chis'], [250, 'chis'], [275, 'chis'], [320, 'file'], [340, 'file'], [360, 'file'], [400, 'sq'], [460, 'pli']];
      tools.forEach(([x, t]) => { g.save(); g.translate(x, 20); if (t === 'saw'){ g.fillStyle = '#9aa0a8'; g.beginPath(); g.moveTo(0, 30); g.lineTo(60, 20); g.lineTo(60, 60); g.lineTo(0, 150); g.fill(); g.fillStyle = '#6b3a1e'; g.fillRect(-6, 0, 22, 40); }
        else if (t === 'ham'){ g.fillStyle = '#6b3a1e'; g.fillRect(-3, 20, 7, 120); g.fillStyle = '#2a2a2c'; g.fillRect(-16, 10, 34, 18); }
        else if (t === 'chis'){ g.fillStyle = '#6b3a1e'; g.fillRect(-4, 10, 9, 60); g.fillStyle = '#9aa0a8'; g.fillRect(-3, 70, 6, 60); }
        else if (t === 'file'){ g.fillStyle = '#6b3a1e'; g.fillRect(-3, 10, 7, 40); g.fillStyle = '#5a5e66'; g.fillRect(-3, 50, 6, 90); }
        else if (t === 'sq'){ g.fillStyle = '#9aa0a8'; g.fillRect(0, 10, 8, 120); g.fillRect(0, 122, 60, 8); }
        else { g.fillStyle = '#b3241f'; g.fillRect(-8, 60, 6, 80); g.fillRect(4, 60, 6, 80); g.fillStyle = '#5a5e66'; g.fillRect(-6, 10, 14, 52); }
        g.restore(); }); }), roughness:.8 }), bx, 1.75, BZ + 0.02);

    // ---- right wall (west): toy shelves ----
    const sx = W / 2 - 0.24; const shelfM = col(0x5a3a22, .6);
    box(0.44, 2.3, 0.05, shelfM, sx, 1.15, -1.45); box(0.44, 2.3, 0.05, shelfM, sx, 1.15, 1.45); box(0.04, 2.3, 2.9, shelfM, W / 2 - 0.03, 1.15, 0);
    const toyCols = [0xb3241f, 0x2f5d8a, 0xd9a441, 0x1f5a33, 0xe9e1cf, 0x7a3a5a];
    for (let s = 0; s < 5; s++){ const y = 0.12 + s * 0.52; box(0.44, 0.04, 2.9, shelfM, sx, y, 0, false);
      for (let i = 0; i < 6; i++){ const z = -1.2 + i * 0.47 + rnd(-.05, .05), yy = y + 0.02, c = toyCols[(i + s) % 6], k = (i * 3 + s) % 6;
        if (k === 0){ cyl(0.05, 0.05, 0.2, col(c, .5), sx, yy + 0.1, z, 12); sph(0.04, col(0xf0c8a0, .6), sx, yy + 0.24, z); cyl(0.035, 0.04, 0.07, mats.black, sx, yy + 0.3, z, 10); }
        else if (k === 1){ sph(0.09, col(0x9a6a3a, .9), sx, yy + 0.09, z); sph(0.06, col(0x9a6a3a, .9), sx, yy + 0.22, z); sph(0.022, col(0x9a6a3a, .9), sx, yy + 0.28, z - 0.04); sph(0.022, col(0x9a6a3a, .9), sx, yy + 0.28, z + 0.04); }
        else if (k === 2){ cyl(0.09, 0.09, 0.12, col(c, .5), sx, yy + 0.06, z, 16); cyl(0.092, 0.092, 0.02, mats.white, sx, yy + 0.11, z, 16); }
        else if (k === 3){ box(0.12, 0.1, 0.28, col(c, .5), sx, yy + 0.05, z); box(0.1, 0.12, 0.1, col(c, .5), sx, yy + 0.16, z - 0.08); }
        else if (k === 4){ sph(0.08, col(c, .4), sx, yy + 0.08, z, null, 14); }
        else { for (let j = 0; j < 3; j++) box(0.08, 0.08, 0.08, col(toyCols[(j + i) % 6], .6), sx, yy + 0.04 + (j === 2 ? 0.08 : 0), z - 0.05 + (j % 2) * 0.1); }
      } }
    // on top of the shelves: a drum and a wooden soldier (the small gold star of The Hidden Case stands between them)
    cyl(0.1, 0.1, 0.14, col(0xb3241f, .5), sx - 0.06, 2.37, 0.72, 16); cyl(0.102, 0.102, 0.02, mats.white, sx - 0.06, 2.44, 0.72, 16);
    cyl(0.045, 0.045, 0.24, col(0x2f5d8a, .5), sx - 0.08, 2.42, 1.02, 12); sph(0.04, col(0xf0c8a0, .6), sx - 0.08, 2.58, 1.02);

    // ---- left wall (east): little tree, paint shelf, side-passage door, coat, stove ----
    const lx = -W / 2;
    K.tree(-3.15, BZ + 0.65, 0.55);
    box(0.36, 0.04, 1.0, shelfM, lx + 0.2, 0.95, -1.5); box(0.36, 0.04, 1.0, shelfM, lx + 0.2, 1.4, -1.5);
    const pc = [0xb3241f, 0x2f5d8a, 0xd9a441, 0x1f5a33, 0xe9e1cf, 0x111111];
    for (let i = 0; i < 6; i++){ cyl(0.05, 0.05, 0.09, mats.iron, lx + 0.2, 1.017, -1.88 + i * 0.15, 12); cyl(0.046, 0.046, 0.01, col(pc[i], .3), lx + 0.2, 1.066, -1.88 + i * 0.15, 12); }
    cyl(0.05, 0.04, 0.12, col(0x8a8a80, .5), lx + 0.2, 1.48, -1.8, 10); for (let i = 0; i < 4; i++){ const b = cyl(0.006, 0.006, 0.26, mats.wood, lx + 0.2 + rnd(-.02, .02), 1.6, -1.8 + rnd(-.02, .02), 5); b.rotation.z = rnd(-.2, .2); }
    for (let i = 0; i < 4; i++) box(0.08, 0.12, 0.1, col([0xd9b47a, 0x8a6440, 0xd9b47a, 0x6b4423][i], .7), lx + 0.2, 1.48, -1.45 + i * 0.13);
    const sd = K.door({ side:'left', u:0.3, w:0.9, h:2.05, mat:col(0x2f4a3a, .6), panel:0x34523f });
    // the bolt, shot across on the inside
    box(0.03, 0.05, 0.36, mats.iron, lx + 0.12, 1.25, 0.58, false); box(0.04, 0.09, 0.07, mats.iron, lx + 0.1, 1.25, 0.82, false); box(0.04, 0.06, 0.03, mats.iron, lx + 0.14, 1.29, 0.5, false);
    K.holly(lx + 0.11, 1.9, 0.3, 1.3);
    // coat and scarf on a hook
    box(0.06, 0.04, 0.3, mats.dark, lx + 0.05, 1.85, 1.35, false);
    const coatM = col(0x3a2e26, .95); const cg = grp(lx + 0.14, 0, 1.35); const cb2 = cyl(0.17, 0.27, 0.95, coatM, 0, 1.33, 0, 6, cg); cb2.scale.set(0.45, 1, 1); for (const z of [-0.2, 0.2]){ const sl = cyl(0.05, 0.065, 0.62, coatM, 0.03, 1.45, z, 6, cg); sl.rotation.x = z > 0 ? -0.12 : 0.12; } sph(0.07, coatM, 0, 1.8, 0, cg).scale.set(0.8, 0.6, 2.6); box(0.05, 0.62, 0.1, col(0xb3241f, .9), 0.11, 1.45, -0.06, false, cg); box(0.05, 0.5, 0.1, col(0xb3241f, .9), 0.11, 1.5, 0.08, false, cg); box(0.06, 0.08, 0.3, col(0xb3241f, .9), 0.1, 1.76, 0, false, cg);
    // iron stove with a glowing door, and its pipe
    const st = grp(lx + 0.5, 0, 2.5); const stM = mats.iron;
    box(0.56, 0.7, 0.56, stM, 0, 0.45, 0, true, st); box(0.62, 0.05, 0.62, stM, 0, 0.82, 0, true, st); for (const x of [-0.22, 0.22]) for (const z of [-0.22, 0.22]) box(0.05, 0.12, 0.05, stM, x, 0.06, z, false, st);
    const glow = plane(0.26, 0.18, new T.MeshBasicMaterial({ map:tex(64, 48, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h * .8, 2, w / 2, h / 2, w * .6); gr.addColorStop(0, '#fff1b0'); gr.addColorStop(.5, '#ff8a2a'); gr.addColorStop(1, '#5a1a05'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#222'; g.lineWidth = 4; for (let x = 8; x < w; x += 12){ g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } }) }), 0.285, 0.42, 0, 0, Math.PI / 2, 0, st);
    K.stoveGlow = glow;
    cyl(0.07, 0.07, H - 0.85, stM, 0, 0.85 + (H - 0.85) / 2, -0.05, 10, st);
    K.fire(lx + 0.8, 0.42, 2.5, 'z', 0, [0.2, 0]);
    // rocking horse
    const hg = grp(-1.6, 0, 1.2, 0.35); const hm = col(0xe9e1cf, .5), hd = col(0x2a1d14, .6);
    box(0.5, 0.2, 0.18, hm, 0, 0.5, 0, true, hg); box(0.1, 0.3, 0.14, hm, 0.27, 0.68, 0, true, hg); box(0.2, 0.1, 0.12, hm, 0.36, 0.82, 0, true, hg); box(0.18, 0.12, 0.04, col(0x8e1f1f, .7), 0.24, 0.78, 0, false, hg);
    box(0.1, 0.08, 0.19, col(0xb3241f, .6), -0.02, 0.62, 0, false, hg); box(0.04, 0.12, 0.05, hd, -0.28, 0.55, 0, false, hg);
    for (const x of [-0.18, 0.18]) for (const z of [-0.07, 0.07]){ const l = box(0.05, 0.32, 0.05, hm, x, 0.26, z, true, hg); l.rotation.z = x > 0 ? -0.25 : 0.25; }
    for (const z of [-0.09, 0.09]){ const rk = new T.Mesh(new T.TorusGeometry(0.9, 0.02, 6, 24, 0.75), hd); rk.rotation.z = -Math.PI / 2 - 0.375; rk.position.set(0, 0.92, z); rk.castShadow = true; hg.add(rk); }

    // ---- front wall (north): the shop door, the telephone table, offcuts, broom ----
    const FZ = DP / 2;
    K.door({ side:'front', u:1.5, w:1.0, h:2.1, mat:col(0x5a3a22, .5), panel:0x6b4423, hinge:'right',
      glass:(g, w, h) => { g.fillStyle = '#e9b66a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(120,60,20,.5)'; g.fillRect(0, h * .62, w, h * .38); g.fillStyle = '#8a5a2a'; g.fillRect(w * .1, h * .5, w * .5, h * .25); g.fillStyle = '#ffe9b0'; for (let i = 0; i < 12; i++) g.fillRect(rnd(0, w), rnd(0, h * .4), 3, 3); } });
    K.holly(1.5, 1.95, FZ - 0.12, 1.4);
    box(0.95, 0.04, 0.4, col(0x6b4423, .55), 2.85, 0.98, FZ - 0.22); for (const x of [-0.38, 0.38]){ const br = box(0.03, 0.28, 0.03, mats.dark, 2.85 + x, 0.85, FZ - 0.2, false); br.rotation.x = 0.7; }
    // telephone
    const ph = grp(3.05, 1.0, FZ - 0.18, Math.PI); const phM = mats.black;
    box(0.2, 0.09, 0.22, phM, 0, 0.045, 0, true, ph); cyl(0.06, 0.06, 0.01, mats.brass, 0, 0.095, 0.03, 18, ph); const hs = cyl(0.026, 0.026, 0.24, phM, 0, 0.13, -0.05, 10, ph); hs.rotation.z = Math.PI / 2;
    // the answering machine with a blinking light
    const am = grp(2.98, 1.0, FZ - 0.34, Math.PI); box(0.24, 0.06, 0.15, col(0x3a3530, .4), 0, 0.03, 0, true, am);
    K.amLight = sph(0.012, new T.MeshStandardMaterial({ color:0xff3030, emissive:0xff2020, emissiveIntensity:1.5 }), 0.08, 0.065, 0.04, am, 8);
    // the message pad
    const pad = box(0.15, 0.015, 0.2, K.M({ map:tex(128, 160, (g, w, h) => { g.fillStyle = '#f3f0e6'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,40,90,.7)'; g.lineWidth = 2; for (let y = 50; y < h - 20; y += 18){ g.beginPath(); g.moveTo(14, y); g.lineTo(rnd(60, w - 12), y + rnd(-2, 2)); g.stroke(); } }), roughness:.9 }), 2.58, 1.008, FZ - 0.24);
    pad.rotation.y = 0.2;
    box(0.05, 0.05, 0.06, mats.iron, 0.78, 1.66, FZ - 0.05, false);
    const roll = plane(0.36, 0.52, K.M({ map:tex(128, 192, (g, w, h) => { g.fillStyle = '#b9a47a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(80,60,30,.25)'; for (let i = 0; i < 300; i++) g.fillRect(Math.random() * w, Math.random() * h, 1, 1);
      for (let i = 0; i < 8; i++){ const x = 6 + i * 15; if (i !== 2){ g.fillStyle = i % 3 ? '#5a3a22' : '#6e6e74'; g.fillRect(x + 3, 14, 8, 70); } g.fillStyle = '#a8936a'; g.fillRect(x, 70, 14, 110); g.strokeStyle = 'rgba(60,40,20,.6)'; g.strokeRect(x, 70, 14, 110); } }), roughness:.95, side:T.DoubleSide }), 0.78, 1.36, FZ - 0.06, 0, Math.PI, 0);
    K.toolRoll = roll;
    const cab = grp(-0.25, 1.55, FZ - 0.11, Math.PI); const cabM = col(0x6b4423, .55);
    box(0.62, 0.46, 0.18, cabM, 0, 0, 0, true, cab);
    const drawT = tex(256, 192, (g, w, h) => { g.fillStyle = '#5a3a22'; g.fillRect(0, 0, w, h); const L = ['SPRINGS','PINS','WHEELS','KEYS','EYES','BUTTONS','BELLS','HOOKS','SCREWS','NAILS','GEARS','STRING'];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++){ const x = 8 + c * 61, y = 8 + r * 60; g.fillStyle = '#7a5634'; g.fillRect(x, y, 56, 54); g.fillStyle = '#f3ead2'; g.fillRect(x + 10, y + 10, 36, 12); g.fillStyle = '#c9993f'; g.beginPath(); g.arc(x + 28, y + 38, 4, 0, Math.PI * 2); g.fill(); g.fillStyle = '#22305a'; g.font = '8px Georgia'; g.textAlign = 'center'; g.fillText(L[r * 4 + c], x + 28, y + 19); } });
    plane(0.6, 0.44, K.M({ map:drawT, roughness:.7 }), 0, 0, 0.092, 0, 0, 0, cab);
    // offcuts crate and a broom
    const cr = grp(-1.0, 0, FZ - 0.35); const crM = col(0x8a6440, .8); box(0.6, 0.32, 0.04, crM, 0, 0.16, 0.2, true, cr); box(0.6, 0.32, 0.04, crM, 0, 0.16, -0.2, true, cr); box(0.04, 0.32, 0.4, crM, 0.3, 0.16, 0, true, cr); box(0.04, 0.32, 0.4, crM, -0.3, 0.16, 0, true, cr);
    for (let i = 0; i < 9; i++){ const b = box(rnd(.06, .1), rnd(.25, .4), rnd(.05, .09), col([0xd9b47a, 0x8a6440, 0xc8a070][i % 3], .8), rnd(-.2, .2), 0.3, rnd(-.12, .12), true, cr); b.rotation.set(rnd(-.3, .3), rnd(0, 3), rnd(-.3, .3)); }
    const br = grp(-2.3, 0, FZ - 0.15); const bh = cyl(0.015, 0.015, 1.3, mats.wood, 0, 0.75, 0, 6, br); bh.rotation.x = -0.18; box(0.3, 0.12, 0.08, col(0x8a6a3a, .9), 0, 0.08, 0.1, true, br);

    // ---- ceiling: a hanging lamp and paper chains ----
    cyl(0.006, 0.006, 0.5, mats.iron, 0.5, H - 0.25, -0.6, 4); cyl(0.08, 0.26, 0.16, K.M({ color:0x2e4a3a, side:T.DoubleSide, roughness:.5, emissive:0x2e4a3a, emissiveIntensity:.15 }), 0.5, H - 0.55, -0.6, 16);
    sph(0.05, new T.MeshBasicMaterial({ color:0xfff0c8 }), 0.5, H - 0.62, -0.6, null, 8).castShadow = false;
    K.point(0xffd7a8, 0.75, 9, 0.5, H - 0.75, -0.6);
    const chain = (a, b, n) => { for (let i = 0; i < n; i++){ const t = i / (n - 1); const r = new T.Mesh(new T.TorusGeometry(0.05, 0.012, 4, 8), col([0xb3241f, 0x1f5a33, 0xd9a441][i % 3], .7)); r.position.set(a[0] + (b[0] - a[0]) * t, a[1] - Math.sin(t * Math.PI) * 0.35, a[2] + (b[2] - a[2]) * t); r.rotation.y = i % 2 ? 0 : Math.PI / 2; r.rotation.x = Math.PI / 2 * (i % 2); K.scene.add(r); } };
    chain([-3.6, H - 0.06, -3.1], [-0.2, H - 0.06, -3.1], 24); chain([-0.2, H - 0.06, -3.1], [3.6, H - 0.06, -3.1], 24); chain([-3.6, H - 0.06, 3.1], [0.4, H - 0.06, 3.1], 26); chain([0.4, H - 0.06, 3.1], [3.6, H - 0.06, 3.1], 20);
    K.key([0.6, H - 0.15, 1.6], [0.8, 0.6, -2.2], 0.6, Math.PI / 3);
    K.scene.add(new T.HemisphereLight(0xffe2b8, 0x24160c, 0.3));
  },
  onFound(id, K){ if (id === 'musicbox' && K.lidHinge){ K.lidHinge.rotation.x = -1.75; K.tuneCard.visible = true; } },
  tick(t, K){ if (K.amLight) K.amLight.material.emissiveIntensity = Math.sin(t * 5) > 0 ? 1.8 : 0.1; if (K.stoveGlow) K.stoveGlow.material.color.setScalar(0.85 + Math.sin(t * 7) * 0.08 + Math.random() * 0.07); },

  // ---------------------------------------------------------------- clues (wording from the printed nights)
  clues:{
    cup:{ name:'The cocoa cup', at:[0.92, 0.97, -2.78], size:[0.34, 0.22, 0.34],
      look:'A cup lies on its side on a tray on the workbench. A little cocoa has spilled out.',
      prompt:'Look inside the cup. What do you notice?', hint:'Look at what is left in the bottom of the cup.', hot:[[0.34, 0.26, 0.64, 0.74]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#7a5634'); g.fillStyle = '#b9b4a8'; D.rr(g, 40, 250, 520, 130, 14); g.fill(); g.strokeStyle = '#8f8a7e'; g.lineWidth = 6; g.stroke();
        g.fillStyle = 'rgba(70,35,15,.9)'; g.beginPath(); g.ellipse(430, 318, 110, 34, 0.05, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(540, 336, 26, 12, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#eee8dc'; g.beginPath(); g.moveTo(150, 120); g.lineTo(300, 110); g.lineTo(300, 330); g.lineTo(150, 300); g.closePath(); g.fill(); g.fillStyle = '#b3241f'; g.fillRect(205, 113, 26, 205);
        g.strokeStyle = '#eee8dc'; g.lineWidth = 16; g.beginPath(); g.ellipse(160, 210, 26, 50, 0, Math.PI * .5, Math.PI * 1.5); g.stroke();
        g.fillStyle = '#f7f3ea'; g.beginPath(); g.ellipse(300, 220, 78, 112, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#5a3a24'; g.beginPath(); g.ellipse(304, 222, 64, 98, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#3a2012'; g.beginPath(); g.ellipse(310, 270, 46, 44, 0, 0, Math.PI * 2); g.fill();
        g.lineWidth = 7; g.strokeStyle = 'rgba(225,222,205,.8)'; g.beginPath(); g.ellipse(312, 268, 40, 14, 0.15, 0, Math.PI * 2); g.stroke();
        g.fillStyle = 'rgba(225,222,205,.55)'; for (let i = 0; i < 18; i++){ g.beginPath(); g.arc(290 + Math.random() * 44, 250 + Math.random() * 36, 2 + Math.random() * 2, 0, Math.PI * 2); g.fill(); } },
      kicker:'Clue',
      html:'<p>The cup is cold. A little cocoa is left in the bottom, with a pale, cloudy ring around it that is nothing like chocolate.</p><div class="observe">Under the cocoa there is a <b>bitter smell, like medicine</b>. Something was added to this cup.</div>',
      note:'The cocoa cup: a pale, cloudy ring in the bottom and a bitter smell like medicine. Something was added to the cocoa.' },

    clock:{ name:'The little clock on the floor', at:[-1.95, 0.1, -2.9], size:[0.42, 0.26, 0.42],
      look:'A small brass clock lies on the floorboards, just under the yard window.',
      prompt:'Look at the clock. What does it tell you?', hint:'Look at the hands and the glass.', hot:[[0.3, 0.12, 0.7, 0.88]],
      draw(g, w, h, K){ const D = K.D; D.planks(g, w, h, '#6a4a2c', 5); for (let i = 0; i < 160; i++){ g.fillStyle = `rgba(230,200,140,${Math.random() * .5})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 2); }
        g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(310, 215, 175, 170, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#b8892e'; D.rr(g, 130, 30, 340, 340, 26); g.fill(); g.strokeStyle = '#7a5a1a'; g.lineWidth = 6; g.stroke();
        D.clockFace(g, 300, 200, 140, 9, 2, { crack:true, rim:'#7a5a1a' }); },
      kicker:'Clue',
      html:'<p>This little brass clock always sat on the sill of the yard window. Now it lies on the floor, and its glass is cracked.</p><div class="observe">It stopped at <b>9:02</b>.</div>',
      note:'The little brass clock from the yard window sill was on the floor, glass cracked, stopped at 9:02.' },

    window:{ name:'The yard window', at:[-1.7, 1.5, -3.18], size:[1.8, 0.95, 0.35],
      look:"A low window looks out onto the little snowy yard. It is the workshop's only window. It is pulled shut, but it does not quite close.",
      prompt:'How was this window opened? Look closely at the frame.', hint:'Look at the latch in the middle of the frame.', hot:[[0.4, 0.36, 0.62, 0.62]],
      draw(g, w, h, K){ const D = K.D; D.night(g, w, h, '#0c1426', '#3a4a68'); g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .78, w, h * .22);
        g.fillStyle = '#f2eee6'; g.fillRect(0, 0, w * .1, h); g.fillRect(w * .9, 0, w * .1, h); g.fillRect(0, 0, w, h * .08); g.fillRect(0, h * .88, w, h * .12); g.fillRect(w * .46, 0, w * .1, h);
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(w * .555, 0, 6, h);
        g.fillStyle = '#b8892e'; D.rr(g, w * .43, h * .4, w * .16, h * .18, 6); g.fill(); g.fillStyle = '#d9a441'; D.rr(g, w * .45, h * .44, w * .19, h * .07, 4); g.fill(); g.fillStyle = '#7a5a1a'; g.beginPath(); g.arc(w * .47, h * .52, 6, 0, Math.PI * 2); g.fill();
        g.strokeStyle = 'rgba(255,250,230,.95)'; g.lineWidth = 2; for (let i = 0; i < 6; i++){ g.beginPath(); g.moveTo(w * .5 + i * 7, h * .435); g.lineTo(w * .51 + i * 7, h * .515); g.stroke(); }
        g.fillStyle = 'rgba(120,110,95,.75)'; g.fillRect(w * .545, h * .36, w * .022, h * .28); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1; for (let i = 0; i < 18; i++){ g.beginPath(); g.moveTo(w * .545, h * .37 + i * 6.2); g.lineTo(w * .567, h * .37 + i * 6.2); g.stroke(); }
        g.fillStyle = '#f4f7fb'; g.fillRect(w * .1, h * .86, w * .36, h * .03); g.fillRect(w * .56, h * .86, w * .34, h * .03); },
      kicker:'Clue',
      html:'<p>The window has been forced from outside. Beside the latch, something thin and hard was pushed in between the frames and worked up and down. Edmund painted this frame fresh white last summer.</p><div class="observe">A mark <b>6 mm</b> wide, with fine grooves <b>1 mm apart</b> and white paint pressed into them. The brass latch hook has the same grooves.</div>',
      note:'Yard window forced: a mark 6 mm wide beside the latch, fine grooves 1 mm apart, white paint pressed in. The brass latch hook has the same grooves.' },

    prints:{ name:'Prints in the snow', at:[-2.95, 0.1, -5.25], size:[1.5, 0.3, 2.6],
      look:'Out in the yard, several tracks cross the snow. One line of big boot prints runs between the gate and this window.',
      prompt:'Study one of the big boot prints. What can you see?', hint:'Look at the back of the heel.', hot:[[0.42, 0.66, 0.6, 0.9]],
      draw(g, w, h, K){ const D = K.D; D.snow(g, w, h);
        D.bootPrint(g, 290, 170, 2.35, 0.08, { fill:'rgba(110,130,165,.6)', tread:'rgba(60,78,110,.55)', nick:true, snow:'#eef3f8' });
        D.bootPrint(g, 470, 60, 1.6, 0.1, { fill:'rgba(110,130,165,.45)', tread:'rgba(60,78,110,.4)' });
        g.save(); g.translate(70, 240); g.rotate(-0.08); g.fillStyle = '#7a5a3a'; g.fillRect(28, 70, 8, 80); g.fillStyle = '#fbf5e6'; g.fillRect(0, 0, 150, 82); g.strokeStyle = '#b89f74'; g.strokeRect(0, 0, 150, 82);
        g.fillStyle = '#22305a'; g.font = '24px Caveat, cursive'; g.fillText('Track 4, left boot', 10, 26); g.fillText("man's boot, 30 cm", 10, 52); g.fillText('P.A.', 104, 74); g.restore(); },
      kicker:'Clue',
      html:'<p>Big boot prints lead from the yard gate to the window, and back to the gate again. There is <b>no snow at all</b> inside them. The other tracks in the yard (paw prints along the wall, and small shoes between the gate and the kitchen back door) have snow inside them.</p><div class="observe">A man\'s boot, <b>30 cm</b> long. The <b>left heel</b> has a <b>V-shaped nick</b>.</div>',
      note:'Track 4: big boot prints, gate to window and back, with no snow inside them. A man\'s boot, 30 cm long, with a V-shaped nick in the left heel.' },

    sidedoor:{ name:'The side door', at:[-3.72, 1.05, 0.3], size:[0.16, 2.1, 1.0],
      look:'A plain green door in the side wall. It leads out to the side passage off the High Street.',
      prompt:'Could anyone have come in this way? Look closely.', hint:'Look at the bolt.', hot:[[0.24, 0.36, 0.8, 0.64]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#2f4a3a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 7; i++){ g.fillStyle = D.shade('#34523f', (i % 2) * 8 - 4); g.fillRect(i * w / 7, 0, w / 7 - 3, h); }
        g.fillStyle = '#4a3a2a'; g.fillRect(w * .82, 0, w * .18, h);
        g.fillStyle = '#1e1e20'; D.rr(g, w * .26, h * .44, w * .44, h * .12, 6); g.fill(); g.fillStyle = '#3a3a3e'; g.fillRect(w * .28, h * .475, w * .62, h * .05); g.fillStyle = '#1e1e20'; D.rr(g, w * .8, h * .42, w * .1, h * .16, 5); g.fill(); g.fillStyle = '#2a2a2e'; g.fillRect(w * .4, h * .4, w * .04, h * .1); },
      kicker:'Clue',
      html:'<p>The heavy bolt is pushed right across, on the inside.</p><div class="observe">The side door was <b>bolted on the inside</b> all evening, and it was still bolted at 9:20.</div>',
      note:'The side door was bolted on the inside all evening, and still bolted at 9:20.' },

    shopdoor:{ name:'The door to the shop', at:[1.5, 1.05, 3.2], size:[1.0, 2.1, 0.16],
      look:'The workshop door, through to the toy shop. Warm light shows through its little window.',
      prompt:'Look through the little window. What is right outside this door?', hint:'Look at what stands just beside the door, in the shop.', hot:[[0.14, 0.38, 0.7, 0.8]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3a22'); g.fillStyle = '#2a1a0c'; g.fillRect(w * .08, h * .06, w * .84, h * .8);
        const gr = g.createLinearGradient(0, h * .06, 0, h * .86); gr.addColorStop(0, '#f0c47a'); gr.addColorStop(1, '#b57a3a'); g.fillStyle = gr; g.fillRect(w * .1, h * .08, w * .8, h * .76);
        g.fillStyle = '#7a4a22'; for (let s = 0; s < 3; s++) g.fillRect(w * .62, h * (.16 + s * .14), w * .26, 6);
        const tc = ['#b3241f', '#2f5d8a', '#1f5a33', '#d9a441']; for (let s = 0; s < 3; s++) for (let i = 0; i < 5; i++){ g.fillStyle = tc[(i + s) % 4]; g.fillRect(w * .63 + i * 26, h * (.1 + s * .14), 18, 22); }
        g.fillStyle = '#6b3a1a'; g.fillRect(w * .18, h * .52, w * .48, h * .26); g.fillStyle = '#8a5a2a'; g.fillRect(w * .16, h * .5, w * .52, h * .04);
        g.fillStyle = '#2a2a2c'; D.rr(g, w * .24, h * .4, w * .12, h * .1, 4); g.fill(); g.fillStyle = '#c9993f'; for (let i = 0; i < 6; i++) g.fillRect(w * .25 + (i % 3) * 22, h * .42 + Math.floor(i / 3) * 14, 14, 8);
        g.fillStyle = '#d9a441'; g.fillRect(w * .44, h * .44, w * .14, h * .06); g.fillStyle = '#5a3a22'; g.fillRect(w * .1, h * .44, w * .8, 6); g.fillRect(w * .495, h * .08, 6, h * .76); },
      kicker:'Clue',
      html:'<p>Through the little window you look straight into the toy shop. This door opens right by the counter.</p><div class="observe">From the counter, Nora can see the whole shop: the front door, the kitchen door and this workshop door. Edmund and customers were in the shop too.</div>',
      note:'The workshop door opens right by the shop counter. From the counter Nora can see the whole shop, this door included.' },

    pad:{ name:'The message pad', at:[2.58, 1.04, 3.04], size:[0.26, 0.12, 0.3],
      look:"Edmund's message pad lies on the shelf, beside the telephone.",
      prompt:'Read the pad. Which note is not like the others?', hint:'Look for the note with a time in it.', hot:[[0.04, 0.74, 0.96, 0.96]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#6b4423'); D.paper(g, w * .06, h * .04, w * .88, h * .93, '#f7f3e6', -0.01);
        g.strokeStyle = 'rgba(60,90,160,.25)'; g.lineWidth = 1; for (let y = 72; y < h * .95; y += 46){ g.beginPath(); g.moveTo(w * .08, y); g.lineTo(w * .92, y); g.stroke(); }
        D.text(g, ['A. 2 trays of pies for the stall, Saturday.', 'Mrs D. 2 loaves. Paid.', 'Rev. G. Roof money: NO. Told him twice.', 'N. Change for the till, Friday.', 'Mr Q. Slippers back Thursday.', 'Mr J. Coal, Tuesday.', 'J. tomorrow 9 am, bring the ledger. E.C.'], w * .1, 36, 46, '29px Caveat, cursive', '#1a2550'); },
      kicker:'Evidence',
      html:'<div class="doc hand" style="font-size:21px">A. 2 trays of pies for the stall, Saturday.<br>Mrs D. 2 loaves. Paid.<br>Rev. G. Roof money: NO. Told him twice.<br>N. Change for the till, Friday.<br>Mr Q. Slippers back Thursday.<br>Mr J. Coal, Tuesday.<br>J. tomorrow 9 am, bring the ledger. E.C.</div><div class="observe">The last note: <b>J. tomorrow 9 am, bring the ledger. E.C.</b></div>',
      note:'Message pad, Edmund\'s last note: "J. tomorrow 9 am, bring the ledger. E.C." Who is J., and what ledger?' },

    machine:{ name:'The answering machine', at:[2.98, 1.08, 3.0], size:[0.4, 0.24, 0.36],
      look:'A small answering machine sits on the shelf beside the telephone. Its little red light is blinking.',
      prompt:'Find a way to hear the message.', hint:'Machines like this have a play button.', hot:[[0.12, 0.6, 0.42, 0.86]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#6b4423'); g.fillStyle = '#2f2b27'; D.rr(g, 50, 60, 500, 290, 20); g.fill();
        g.fillStyle = '#1a1816'; D.rr(g, 300, 90, 220, 120, 10); g.fill(); for (const x of [360, 460]){ g.fillStyle = '#5a554e'; g.beginPath(); g.arc(x, 150, 30, 0, Math.PI * 2); g.fill(); g.fillStyle = '#2a2622'; g.beginPath(); g.arc(x, 150, 10, 0, Math.PI * 2); g.fill(); }
        g.fillStyle = '#ff3a30'; g.beginPath(); g.arc(110, 120, 12, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,80,60,.35)'; g.beginPath(); g.arc(110, 120, 22, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#e6d7b6'; g.font = '16px Georgia'; g.fillText('MESSAGES', 136, 126);
        const btn = (x, y, bw, label, big) => { g.fillStyle = big ? '#8e1f1f' : '#4a453f'; D.rr(g, x, y, bw, 70, 10); g.fill(); g.fillStyle = '#f3e7cf'; g.font = `${big ? 'bold 20' : '15'}px Georgia`; g.textAlign = 'center'; g.fillText(label, x + bw / 2, y + 42); g.textAlign = 'left'; };
        btn(80, 245, 160, 'PLAY', true); btn(260, 255, 110, 'BACK'); btn(390, 255, 110, 'STOP'); },
      kicker:'Listen', clip:'voicemail', playLabel:'Play the message',
      html:'<p>One message, left at <b>7:30 pm</b> on the night of the lights.</p>',
      note:'Answering machine, 7:30 pm, Felix Marlow: "Crane, it\'s Marlow. Whatever the boy told you, I paid for what I bought. We\'ll talk after the switch-on."' },

    musicbox:{ name:'The Midnight Music Box', at:[2.0, 1.05, -2.86], size:[0.56, 0.4, 0.46], reveal:true,
      look:"Edmund's famous music box sits on his workbench, its lid painted with gold stars. He carried it in from the shop window at about 8:50.",
      prompt:'How does it work? Look closely.', hint:'Try lifting the lid.', hot:[[0.15, 0.18, 0.9, 0.44]],
      draw(g, w, h, K, open){ const D = K.D; D.wood(g, w, h, '#7a5634'); g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(300, 340, 250, 36, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#3b2414'; g.fillRect(90, 190, 380, 145); g.fillStyle = '#2a1a0e'; g.beginPath(); g.moveTo(470, 190); g.lineTo(530, 140); g.lineTo(530, 285); g.lineTo(470, 335); g.closePath(); g.fill();
        g.fillStyle = '#c9993f'; g.fillRect(90, 190, 380, 8); g.fillRect(90, 327, 380, 8); g.fillRect(90, 190, 8, 145); g.fillRect(462, 190, 8, 145); g.fillStyle = '#e9c45a'; D.star(g, 280, 262, 28);
        g.fillStyle = '#c9993f'; g.fillRect(500, 220, 52, 14); g.fillRect(546, 196, 16, 62);
        if (!open){ g.fillStyle = '#4a2d19'; g.beginPath(); g.moveTo(90, 190); g.lineTo(150, 140); g.lineTo(530, 140); g.lineTo(470, 190); g.closePath(); g.fill();
          g.fillStyle = '#1d2a4f'; g.beginPath(); g.moveTo(104, 182); g.lineTo(156, 147); g.lineTo(514, 147); g.lineTo(462, 182); g.closePath(); g.fill();
          g.fillStyle = '#e9c45a'; for (let i = 0; i < 14; i++) D.star(g, 170 + Math.random() * 300, 152 + Math.random() * 24, 4); g.fillStyle = '#c9993f'; g.fillRect(270, 186, 30, 12); }
        else { g.fillStyle = '#1f4a2a'; g.fillRect(100, 150, 362, 42); g.fillStyle = '#4a2d19'; g.beginPath(); g.moveTo(90, 190); g.lineTo(150, 20); g.lineTo(530, 20); g.lineTo(470, 190); g.closePath(); g.fill();
          g.fillStyle = '#245a32'; g.beginPath(); g.moveTo(106, 184); g.lineTo(158, 32); g.lineTo(516, 32); g.lineTo(462, 184); g.closePath(); g.fill();
          g.save(); g.translate(310, 104); g.rotate(-0.02); g.fillStyle = '#f7f1df'; g.fillRect(-150, -58, 300, 116); g.fillStyle = '#1a2550'; g.font = '23px Caveat, cursive'; g.textAlign = 'center';
          g.fillText('The Midnight Tune.', 0, -30); g.fillText('25 bars. Each bar takes 4 seconds.', 0, -2); g.fillText('On a full wind the box plays', 0, 24); g.fillText('the tune 3 times over, then rests.', 0, 48); g.restore(); } },
      kicker:'Listen', clip:'musicbox', playLabel:'Wind it and listen',
      html:'<div class="doc hand">The Midnight Tune.<br>25 bars. Each bar takes 4 seconds.<br>On a full wind the box plays the tune 3 times over, then rests.</div><p>A card inside the lid, in Edmund\'s hand. The lid is lined with green velvet.</p><div class="observe">Nora: "The music box started the moment the lights came on at nine."<br>Agnes: "At 8:35 he said he\'d drink it when the music box had finished its song. He always did, the very moment the last note stopped."</div>',
      note:'Music box card: the Midnight Tune is 25 bars, 4 seconds a bar, played 3 times over on a full wind. It started at 9:00, and Edmund drank his cocoa the moment it stopped.' },

    toolroll:{ name:"Jasper's tool roll", at:[0.78, 1.36, 3.2], size:[0.42, 0.6, 0.16],
      look:'A canvas tool roll hangs on a hook by the shop door.',
      prompt:'Unroll it and look at the pockets. Is anything wrong?', hint:'Count the tools. Does every pocket have one?', hot:[[0.3, 0.14, 0.44, 0.9]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#5a3a22'); g.fillStyle = '#c4b088'; g.fillRect(30, 30, 540, 340); g.fillStyle = 'rgba(80,60,30,.2)'; for (let i = 0; i < 900; i++) g.fillRect(30 + Math.random() * 540, 30 + Math.random() * 340, 2, 1);
        const items = ['hammer', '4 mm', '6 mm', '8 mm', 'pliers', 'brush', 'pencil', 'rule'];
        items.forEach((t, i) => { const x = 50 + i * 64;
          if (i !== 2){ g.save(); g.translate(x + 26, 50);
            if (t.indexOf('mm') > 0){ g.fillStyle = '#6b3a1e'; g.fillRect(-7, 0, 14, 60); g.fillStyle = '#5a5e66'; g.fillRect(-5, 60, 10, 60); }
            else if (t === 'hammer'){ g.fillStyle = '#2a2a2c'; g.fillRect(-20, 0, 40, 18); g.fillStyle = '#6b3a1e'; g.fillRect(-5, 18, 10, 100); }
            else if (t === 'pliers'){ g.fillStyle = '#5a5e66'; g.fillRect(-8, 0, 7, 40); g.fillRect(1, 0, 7, 40); g.fillStyle = '#b3241f'; g.fillRect(-9, 40, 8, 80); g.fillRect(1, 40, 8, 80); }
            else if (t === 'brush'){ g.fillStyle = '#d9b47a'; g.fillRect(-6, 0, 12, 22); g.fillStyle = '#2f5d8a'; g.fillRect(-4, 22, 8, 96); }
            else if (t === 'pencil'){ g.fillStyle = '#d9a441'; g.fillRect(-4, 0, 8, 118); }
            else { g.fillStyle = '#e9d9a8'; g.fillRect(-9, 0, 18, 118); }
            g.restore(); }
          g.fillStyle = '#b39c70'; g.fillRect(x, 150, 52, 205); g.strokeStyle = 'rgba(60,40,20,.55)'; g.lineWidth = 3; g.strokeRect(x, 150, 52, 205);
          g.setLineDash([5, 5]); g.strokeStyle = 'rgba(60,40,20,.5)'; g.lineWidth = 1.5; g.strokeRect(x + 5, 155, 42, 195); g.setLineDash([]);
          if (t.indexOf('mm') > 0){ g.fillStyle = '#3a2a1a'; g.font = '17px Caveat, cursive'; g.textAlign = 'center'; g.fillText(t, x + 26, 340); g.textAlign = 'left'; } });
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(50 + 2 * 64 + 6, 150, 40, 30); },
      kicker:'Clue',
      html:'<p>Jasper\'s tool roll: canvas, with eight pockets. It hangs on its hook by the shop door, where anyone in the workshop could reach it.</p><div class="observe">One pocket is <b>empty</b>: the pocket for the <b>6 mm file</b>. Jasper says he lost a file about a week ago.</div>',
      note:'Jasper\'s tool roll, by the shop door: the 6 mm file pocket is empty. He says he lost a file a week ago. Anyone could reach the roll.' },

    toolboard:{ name:"Edmund's tool board", at:[1.7, 1.75, -3.2], size:[2.6, 1.0, 0.14],
      look:"Edmund's tools hang on the board above the bench: saws, hammers, chisels and files.",
      prompt:'Look along the board. Is anything missing?', hint:'Look for a hook with no tool on it.', hot:[[0.6, 0.08, 0.8, 0.92]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#b08a5a'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(60,40,20,.45)'; for (let x = 12; x < w; x += 20) for (let y = 12; y < h; y += 20) g.fillRect(x, y, 4, 4);
        const tool = (x, kind, lab) => { g.save(); g.translate(x, 40); g.fillStyle = '#333'; g.fillRect(-3, -14, 6, 14);
          if (kind === 'saw'){ g.fillStyle = '#9aa0a8'; g.beginPath(); g.moveTo(-10, 40); g.lineTo(40, 30); g.lineTo(40, 70); g.lineTo(-10, 300); g.fill(); g.fillStyle = '#6b3a1e'; g.fillRect(-18, 0, 30, 50); }
          else if (kind === 'ham'){ g.fillStyle = '#6b3a1e'; g.fillRect(-5, 26, 10, 240); g.fillStyle = '#2a2a2c'; g.fillRect(-28, 4, 56, 26); }
          else if (kind === 'chis'){ g.fillStyle = '#6b3a1e'; g.fillRect(-7, 0, 14, 120); g.fillStyle = '#9aa0a8'; g.fillRect(-5, 120, 10, 140); }
          else if (kind === 'file'){ g.fillStyle = '#6b3a1e'; g.fillRect(-6, 0, 12, 90); g.fillStyle = '#5a5e66'; g.fillRect(-5, 90, 10, 170); g.strokeStyle = 'rgba(255,255,255,.35)'; for (let y = 96; y < 255; y += 8){ g.beginPath(); g.moveTo(-5, y); g.lineTo(5, y + 3); g.stroke(); } }
          else if (kind === 'empty'){ g.strokeStyle = 'rgba(40,25,10,.6)'; g.setLineDash([6, 5]); g.lineWidth = 2; g.strokeRect(-8, 0, 16, 260); g.setLineDash([]); g.fillStyle = '#fbf5e6'; g.save(); g.rotate(0.05); g.fillRect(-52, 70, 104, 74); g.fillStyle = '#22305a'; g.font = '22px Caveat, cursive'; g.textAlign = 'center'; g.fillText('10 mm chisel', 0, 98); g.fillText('away being', 0, 118); g.fillText('sharpened', 0, 138); g.restore(); }
          if (lab){ g.fillStyle = '#2a1a0c'; g.font = '18px Caveat, cursive'; g.textAlign = 'center'; g.fillText(lab, 0, 300); }
          g.restore(); };
        tool(50, 'saw'); tool(150, 'ham'); tool(205, 'ham'); tool(260, 'chis', '6 mm'); tool(310, 'chis', '12 mm'); tool(420, 'empty'); tool(520, 'file', '6 mm'); tool(565, 'file', '10 mm'); },
      kicker:'Clue',
      html:'<p>Edmund\'s tool board. His 6 mm chisel (a smooth edge) and his 6 mm file (coarse teeth, ridges 2 mm apart) hang in their places.</p><div class="observe">One hook is empty. A card on it says: <b>10 mm chisel, away being sharpened</b>. Every tool here was checked under the lamp: not one has a speck of white paint on it.</div>',
      note:'Edmund\'s tool board: his 6 mm chisel (smooth) and 6 mm file (ridges 2 mm apart) are clean. His 10 mm chisel is away being sharpened.' },
  },

  // ---------------------------------------------------------------- decoys
  decoys:{
    vice:{ name:'The vice', at:[3.05, 0.98, -2.55], size:[0.3, 0.24, 0.42], look:'An iron vice is bolted to the end of the workbench.', close:'Its jaws are open and empty, with a little sawdust in them. Nothing out of place.' },
    lamp:{ name:'The bench lamp', at:[2.65, 1.2, -2.98], size:[0.28, 0.5, 0.3], look:'A green lamp leans over the workbench, still switched on.', close:'Warm to the touch. It has been on all evening. Nothing out of place.' },
    toys:{ name:'The toy shelves', at:[3.55, 1.15, 0], size:[0.46, 2.2, 2.9], look:'Shelves of finished toys: soldiers, teddies, drums, trains and bright wooden blocks.', close:'Each toy has a little paper tag, ready for Christmas. Nothing out of place.' },
    horse:{ name:'The rocking horse', at:[-1.6, 0.5, 1.2], size:[0.95, 0.95, 0.45], look:'A cream rocking horse with a red saddle, waiting for its last coat of paint.', close:'You give it a gentle push. It rocks, creaks and stops. Nothing out of place.' },
    paints:{ name:'The paint shelf', at:[-3.6, 1.2, -1.5], size:[0.4, 0.62, 1.04], look:'Tins of paint and a jar of brushes on a shelf by the window.', close:'The lids are on tight and the brushes are clean. Nothing out of place.' },
    stove:{ name:'The stove', at:[-3.3, 0.55, 2.5], size:[0.7, 1.1, 0.7], look:'A round-bellied iron stove keeps the workshop warm.', close:'A few logs glow inside. Only ash in the tray. Nothing out of place.' },
    coat:{ name:"Edmund's coat", at:[-3.62, 1.4, 1.35], size:[0.3, 1.0, 0.6], look:'A heavy coat and a red scarf hang on a hook by the side door.', close:'In the pockets: a pencil stub, a tape measure and a peppermint. Nothing out of place.' },
    offcuts:{ name:'The box of offcuts', at:[-1.0, 0.26, 2.95], size:[0.66, 0.5, 0.46], look:'A crate of wood offcuts by the wall, kept for kindling.', close:'Odd bits of pine and beech. Nothing out of place.' },
    tree:{ name:'The little tree', at:[-3.15, 0.8, -2.65], size:[1.0, 1.6, 1.0], look:'A little Christmas tree in the corner, hung with tiny wooden decorations Edmund made himself.', close:'Painted stars, robins and sleighs. You check every one. Nothing out of place.' },
    cabinet:{ name:'The parts cabinet', at:[-0.25, 1.55, 3.16], size:[0.66, 0.5, 0.26], look:"A small wooden cabinet of little drawers hangs on the wall by the shop door. Each drawer has a paper label in Edmund's writing.", close:'Springs, pins, wheels, keys, bells: every drawer holds just what its label says. Nothing out of place.' },
    broom:{ name:'The broom', at:[-2.3, 0.7, 3.12], size:[0.36, 1.4, 0.3], look:'A broom leans in the corner, beside a little heap of sawdust.', close:'Just sawdust and wood shavings. Nothing out of place.' },
  },

  // ---------------------------------------------------------------- extra clues (room only, never needed: one for each night)
  extras:{
    snow:{ night:3, name:'The inside of the window sill', at:[-1.05, 0.56, -3.08], size:[0.28, 0.16, 0.26],
      look:'The wide sill under the yard window, on the inside of the workshop.',
      prompt:'Look along the sill. Is anything there that should not be indoors?', hint:'Look at the right-hand end of the sill.', hot:[[0.58, 0.36, 0.86, 0.72]],
      draw(g, w, h, K){ const D = K.D; D.night(g, w, h * .45, '#0c1426', '#3a4a68'); g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .34, w, h * .11); g.fillStyle = '#f2eee6'; g.fillRect(0, 0, w * .06, h * .45); g.fillRect(w * .94, 0, w * .06, h * .45); g.fillRect(w * .47, 0, w * .06, h * .45);
        g.fillStyle = '#f2eee6'; g.fillRect(0, h * .45, w, h * .1); g.fillStyle = '#e4ddcf'; g.fillRect(0, h * .55, w, h * .2); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, h * .74, w, 6); D.wood(g, w, 0, '#6a4a2c'); g.fillStyle = '#5a3a22'; g.fillRect(0, h * .76, w, h * .24);
        g.fillStyle = 'rgba(90,60,30,.35)'; g.beginPath(); g.ellipse(w * .72, h * .66, 92, 22, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#f6f9fc'; g.beginPath(); g.ellipse(w * .71, h * .6, 62, 30, 0, Math.PI, 0); g.lineTo(w * .71 + 62, h * .63); g.lineTo(w * .71 - 62, h * .63); g.fill(); g.beginPath(); g.ellipse(w * .79, h * .615, 26, 14, 0, Math.PI, 0); g.fill();
        g.fillStyle = 'rgba(170,195,225,.6)'; g.beginPath(); g.ellipse(w * .69, h * .57, 26, 8, -0.2, 0, Math.PI * 2); g.fill();
        g.strokeStyle = 'rgba(200,220,240,.8)'; g.lineWidth = 3; for (let i = 0; i < 3; i++){ g.beginPath(); g.moveTo(w * (.66 + i * .05), h * .64); g.lineTo(w * (.66 + i * .05), h * (.7 + i * .02)); g.stroke(); } },
      text:'On the inside of the yard window sill, a small lump of melting snow. Snow came in only through this window.' },

    heel:{ night:4, name:'A mark on the floorboards', at:[-1.25, 0.05, -2.72], size:[0.3, 0.12, 0.3],
      look:'A small dark patch on the floorboards, just inside the yard window.',
      prompt:'Look closely at the damp patch. What shape is it?', hint:'Look at the back edge of the mark.', hot:[[0.4, 0.5, 0.62, 0.9]],
      draw(g, w, h, K){ const D = K.D; D.planks(g, w, h, '#6a4a2c', 5); for (let i = 0; i < 120; i++){ g.fillStyle = `rgba(230,200,140,${Math.random() * .4})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 2); }
        g.save(); g.translate(w * .5, h * .5); g.rotate(0.2); g.fillStyle = 'rgba(28,16,8,.7)'; g.beginPath(); g.moveTo(-95, -120); g.lineTo(95, -120); g.quadraticCurveTo(115, 140, 0, 150); g.quadraticCurveTo(-115, 140, -95, -120); g.fill();
        g.strokeStyle = 'rgba(10,6,2,.5)'; g.lineWidth = 5; for (let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(-70, -80 + i * 40); g.lineTo(70, -80 + i * 40); g.stroke(); }
        g.fillStyle = '#7a5634'; g.beginPath(); g.moveTo(-22, 152); g.lineTo(0, 92); g.lineTo(22, 152); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.ellipse(-30, -40, 40, 60, 0.3, 0, Math.PI * 2); g.fill(); g.restore(); },
      text:'On the workshop floor under the window, a damp print of a heel with a V-shaped nick, and no snow inside it.' },

    calendar:{ night:8, name:'The calendar by the telephone', at:[3.2, 1.55, 3.24], size:[0.34, 0.44, 0.1],
      look:'A Crane\'s Toys calendar hangs on the wall above the telephone, with notes written in some of the squares.',
      prompt:'Read the squares. Which note matters?', hint:'Look for the note that names a person and a time.', hot:[[0.48, 0.5, 0.86, 0.74]],
      draw(g, w, h, K){ const D = K.D; D.wood(g, w, h, '#8f8068'); D.paper(g, 110, 10, 380, 380, '#f7f1df'); g.fillStyle = '#1f4a2a'; g.fillRect(110, 10, 380, 90); g.fillStyle = '#e9c45a'; g.fillRect(278, 26, 44, 62); g.fillStyle = '#b3241f'; g.fillRect(270, 20, 60, 12); g.fillStyle = '#f0c8a0'; g.beginPath(); g.arc(300, 44, 0, 0, 1); g.fill();
        D.text(g, ["CRANE'S TOYS"], 300, 64, 20, 'bold 13px Georgia', '#f7f1df', 'center');
        g.strokeStyle = '#c9b48a'; g.lineWidth = 1.5; for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) g.strokeRect(122 + c * 51, 112 + r * 54, 51, 54);
        g.strokeStyle = 'rgba(30,40,90,.45)'; g.lineWidth = 2; [[1, 0], [3, 1], [0, 3], [5, 3], [2, 4]].forEach(([c, r]) => { g.beginPath(); g.moveTo(128 + c * 51, 140 + r * 54); g.lineTo(166 + c * 51, 138 + r * 54); g.stroke(); });
        g.fillStyle = '#fbf6e8'; g.fillRect(290, 214, 210, 82); g.strokeStyle = '#c9b48a'; g.strokeRect(290, 214, 210, 82);
        D.text(g, ['9 am: Jasper,', 'ledger.'], 300, 222, 34, '30px Caveat, cursive', '#1a2550'); },
      text:'On the calendar by the telephone, in Edmund\'s hand: "9 am: Jasper, ledger."' },

    paint:{ night:17, name:'The floor by the shop door', at:[0.78, 0.05, 3.08], size:[0.36, 0.12, 0.3],
      look:'The floorboards under the hook where Jasper\'s tool roll hangs.',
      prompt:'Look closely at the floor. Is anything lying there?', hint:'Look for something small and white.', hot:[[0.3, 0.34, 0.72, 0.7]],
      draw(g, w, h, K){ const D = K.D; D.planks(g, w, h, '#6a4a2c', 5); for (let i = 0; i < 90; i++){ g.fillStyle = `rgba(230,200,140,${Math.random() * .35})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 2); }
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, w, 40); g.fillStyle = '#a8936a'; g.fillRect(250, 0, 100, 34);
        for (let i = 0; i < 14; i++){ const x = 210 + Math.random() * 180, y = 150 + Math.random() * 110; g.save(); g.translate(x, y); g.rotate(Math.random() * 3); g.fillStyle = '#fbfbf6'; g.beginPath(); g.moveTo(-9, -5); g.lineTo(8, -7); g.lineTo(10, 4); g.lineTo(-6, 7); g.closePath(); g.fill(); g.strokeStyle = 'rgba(120,110,90,.5)'; g.lineWidth = 1; g.stroke(); g.restore(); } },
      text:'On the floor right under Jasper\'s tool roll, a few flakes of fresh white window paint.' },

    tunecard:{ night:23, requires:'musicbox', name:'The tune card in the lid', at:[2.05, 1.36, -3.08], size:[0.4, 0.22, 0.12],
      look:'With the lid of the music box open, Edmund\'s card of notes has slipped half out of the green velvet, face down.',
      prompt:'Look at the back of the card. Is anything written on it?', hint:'Look at the faint pencil near the bottom of the card.', hot:[[0.24, 0.52, 0.78, 0.78]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#245a32'; g.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++){ g.fillStyle = `rgba(10,40,20,${Math.random() * .3})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } g.fillStyle = '#4a2d19'; g.fillRect(0, 0, w, 24); g.fillRect(0, h - 24, w, 24);
        g.save(); g.translate(300, 210); g.rotate(-0.06); D.paper(g, -190, -120, 380, 240, '#f7f1df'); g.restore();
        D.text(g, ['For C.', 'Read the notes as letters.'], 310, 250, 38, '31px Caveat, cursive', 'rgba(40,40,70,.75)', 'center'); },
      text:'On the back of the tune card, in Edmund\'s hand: "For C. Read the notes as letters."' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[3.52, 2.365, 0.87], rot:[0, -Math.PI / 2, 0.12], seek:'Look high up, on top of the shelves of finished toys.' },

  // ---------------------------------------------------------------- sounds
  clips:{
    voicemail:{ kind:'phone', speaker:'Felix Marlow', voice:{ pitch:0.75, rate:1.0 },
      text:"Crane, it's Marlow. Whatever the boy told you, I paid for what I bought. We'll talk after the switch-on." },
    musicbox:{ kind:'music', text:'The music box plays the opening of the Midnight Tune, soft and tinkling.', beat:0.42,
      // the 17 notes on the tune card in the lid (Night 23), with a short rest after each word
      tune:[['G5',1],['F5',1],['R',1],['C5',1],['E5',1],['C5',1],['G5',1],['C5',1],['R',1],['F5',1],['B4',1],['R',1],['C5',1],['C5',1],['A4',1],['D5',1],['D5',1],['G5',1],['D5',1],['G5',2]] },
  },
  // Recorded voices (from the voice actor). Put the files in /audio/ at the site root.
  // If a file is there it is played; if not, the phone's own voice reads the words.
  AUDIO_FILES:{ voicemail:'r1_voicemail.mp3' },
};
CM.start(ROOM);
