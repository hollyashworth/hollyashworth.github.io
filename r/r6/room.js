/* Room 6: Jasper's attic room above Dobbs's Bakery. Nights 14 and 15.
   From n14: a narrow bed, a chair, a small stove with a coal scuttle, a small round window, a row of little wooden birds
   carved along the sill; diary scraps in the coal scuttle (scorched). From n15: under the loose board by the bed, a toffee tin
   with a few folded banknotes, and under them a small black notebook (the ledger). A carved bird box sits on top of the wardrobe.
   Kept fair: these are things to notice, never a confession to the crime. The round window looks south across the High Street. */
const ROOM = {
  code:'r6',
  title:"Jasper's Attic",
  subtitle:'Crime scene 6 · Night 14',
  view:{ pos:[0.1, 1.55, 0.7], yaw:0.15, pitch:-0.22 },
  previews:[0.15, 1.1, -1.2, 2.9, -2.4],
  intro:{
    kicker:'Night 14 · Crime scene 6',
    heading:"Jasper's room in the attic",
    paras:[
      "Jasper Lowe rents this little room at the top of Dobbs's Bakery. It is warm from the ovens below and smells of bread.",
      '<b>Your task:</b> search the attic carefully. Some things here have been hidden, and some have been thrown away. Come back on Night 15 too.',
    ],
    button:'Climb up to the attic',
  },

  build(K){
    const { T, box, cyl, sph, plane, grp, col, mats, D, tex, rnd } = K;
    const W = 5.6, DP = 5.0, H = 2.6, BZ = -DP / 2, FZ = DP / 2, LX = -W / 2, RX = W / 2;
    const WIN = { u:0.2, w:0.64, b:1.15, t:1.79 };
    const plaster = K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#d9cbb0'; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++){ g.fillStyle = `rgba(120,90,60,${rnd(.03, .09)})`; g.fillRect(rnd(0, w), rnd(0, h), 3, 3); } }, [1, 1]), roughness:.95 });
    const boards = K.M({ map:tex(256, 128, (g, w, h) => { for (let i = 0; i < 8; i++){ g.fillStyle = D.shade('#7a5a3a', rnd(-14, 14)); g.fillRect(i * 32, 0, 32, h); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(i * 32, 0, 2, h); } }, [1, 1]), roughness:.85 });
    K.shell({ w:W, d:DP, h:H, wallMat:plaster, panelMat:boards, wallTile:[1.0, 1.0], panelTile:[1.0, 0.7], dado:0.7, ceil:false, trimMat:col(0x4a3220, .6),
      floorMat:K.M({ map:tex(512, 512, (g, w, h) => D.planks(g, w, h, '#7a5634', 9), [2.5, 2.5]), roughness:.8 }),
      open:{ back:[{ u:WIN.u, w:WIN.w, b:WIN.b, t:WIN.t }] } });
    // the sloping roof, with rafters
    const roofMat = K.M({ map:tex(256, 256, (g, w, h) => D.planks(g, w, h, '#5a4028', 8), [2, 2]), roughness:.9, side:T.DoubleSide });
    const knee = 1.25, ridgeY = H, ridgeX = 0.85;
    for (const s of [-1, 1]){ const run = W / 2 - ridgeX, rise = ridgeY - knee, len = Math.hypot(run, rise); const ang = Math.atan2(rise, run);
      const g2 = grp(s * (ridgeX + run / 2), knee + rise / 2, 0); const p2 = plane(len, DP, roofMat, 0, 0, 0, Math.PI / 2, 0, 0, g2); g2.rotation.z = -s * ang;
      for (let z = BZ + 0.4; z < FZ; z += 0.9){ const rf = box(len, 0.1, 0.08, mats.dark, 0, -0.05, z, true, g2); }
    }
    plane(ridgeX * 2, DP, roofMat, 0, ridgeY, 0, Math.PI / 2, 0, 0);
    box(0.14, 0.14, DP, mats.dark, 0, ridgeY - 0.07, 0, false);
    // ---- back wall: the small round window, with carved birds along the sill ----
    const hole = plane(WIN.w + 0.02, WIN.t - WIN.b + 0.02, K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#d9cbb0'; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc(64, 64, 60, 0, Math.PI * 2); g.fill(); g.globalCompositeOperation = 'source-over'; }), transparent:true, alphaTest:0.5, roughness:.95 }), WIN.u, (WIN.b + WIN.t) / 2, BZ + 0.012);
    const ring = new T.Mesh(new T.TorusGeometry(0.31, 0.04, 8, 28), col(0x4a3220, .6)); ring.position.set(WIN.u, (WIN.b + WIN.t) / 2, BZ + 0.03); K.scene.add(ring);
    box(0.05, 0.6, 0.03, col(0x4a3220, .6), WIN.u, (WIN.b + WIN.t) / 2, BZ + 0.02, false); box(0.6, 0.05, 0.03, col(0x4a3220, .6), WIN.u, (WIN.b + WIN.t) / 2, BZ + 0.02, false);
    plane(0.6, 0.6, mats.glass, WIN.u, (WIN.b + WIN.t) / 2, BZ + 0.01);
    box(0.9, 0.05, 0.22, col(0x4a3220, .6), WIN.u, WIN.b - 0.05, BZ + 0.11, false);
    for (let i = 0; i < 6; i++){ const bx = WIN.u - 0.36 + i * 0.145, bg = grp(bx, WIN.b - 0.025, BZ + 0.13, rnd(-.4, .4)); const bm = col([0xc8a070, 0xb08a5a, 0xd9b47a][i % 3], .7); const bd = sph(0.03, bm, 0, 0.03, 0, bg, 8); bd.scale.set(1.5, 1, 1); sph(0.018, bm, 0.035, 0.055, 0, bg, 6); const tl = box(0.03, 0.008, 0.02, bm, -0.045, 0.04, 0, false, bg); tl.rotation.z = 0.4; }
    K.backdrop('back', WIN.u, 1.4, 7, 9, 5, (g, w, h) => { D.night(g, w, h, '#09111f', '#283553');
      g.fillStyle = '#e6ebf3'; g.fillRect(0, h * .72, w, h * .28);
      g.fillStyle = '#3a2a22'; g.fillRect(w * .18, h * .4, w * .44, h * .34); g.fillStyle = '#eef2f7'; g.beginPath(); g.moveTo(w * .16, h * .42); g.lineTo(w * .4, h * .26); g.lineTo(w * .64, h * .42); g.fill();
      g.fillStyle = 'rgba(255,214,140,.95)'; g.fillRect(w * .22, h * .58, w * .36, h * .1); g.fillStyle = 'rgba(255,214,140,.8)'; g.fillRect(w * .3, h * .46, w * .06, h * .06); g.fillRect(w * .44, h * .46, w * .06, h * .06);
      g.fillStyle = '#1a2130'; g.fillRect(w * .74, h * .2, w * .06, h * .54); g.beginPath(); g.moveTo(w * .735, h * .2); g.lineTo(w * .77, h * .05); g.lineTo(w * .805, h * .2); g.fill();
      for (let i = 0; i < 30; i++){ g.fillStyle = ['#ff6060', '#ffd36b', '#6bd3ff', '#9cff6b'][i % 4]; g.beginPath(); g.arc(i / 29 * w, h * .3 + Math.sin(i / 29 * Math.PI) * h * .06, 2.5, 0, Math.PI * 2); g.fill(); }
    }, 512, 300);
    K.point(0xbfd0ff, 0.25, 3, WIN.u, 1.5, BZ + 0.5);
    // ---- left side, under the slope: the narrow bed, and the loose board beside it ----
    const bz = 0.3, bx = LX + 0.5;
    box(0.8, 0.28, 1.9, col(0x6b4423, .6), bx, 0.22, bz); box(0.82, 0.5, 0.06, col(0x5a3622, .6), bx, 0.35, bz - 0.97);
    box(0.76, 0.12, 1.85, col(0xe9e1cf, .9), bx, 0.42, bz); box(0.8, 0.1, 1.3, K.M({ map:tex(128, 128, (g, w, h) => { g.fillStyle = '#3e5a46'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9a441'; g.lineWidth = 3; for (let i = 8; i < w; i += 16){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } }), roughness:.95 }), bx, 0.5, bz + 0.25);
    box(0.5, 0.1, 0.32, col(0xfbf7ee, .95), bx, 0.53, bz - 0.72);
    // the loose board (lifts when found), the hole under it, and the toffee tin
    const hx = LX + 1.15, hz = 0.55;
    box(0.2, 0.01, 0.86, col(0x1a1008, 1), hx, 0.003, hz, false);
    const lb = grp(hx, 0.012, hz - 0.45); const board = box(0.2, 0.025, 0.9, col(0x6e4e30, .8), 0, 0.0, 0.45, true, lb); lb.rotation.x = -0.04;
    const tin = grp(hx, 0.0, hz + 0.05); const tinM = K.M({ color:0x8e1f1f, roughness:.35, metalness:.5 });
    box(0.16, 0.07, 0.22, tinM, 0, 0.035, 0, true, tin); const tlid = box(0.165, 0.015, 0.225, mats.gold, 0, 0.075, 0, true, tin); tin.visible = false;
    const slip = plane(0.1, 0.08, K.M({ color:0xece2c6, roughness:.9, side:T.DoubleSide }), 0.03, 0.004, 0.16, -Math.PI / 2, 0, 0.35, tin);   // a scrap tucked under the tin (extra clue)
    // pencil marks on the wall by the bed (extra clue)
    plane(0.26, 0.12, K.M({ map:tex(128, 60, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(70,70,80,.55)'; g.font = '15px Georgia'; g.fillText('200.', 6, 26); g.fillText('400.', 46, 30); g.fillText('600.', 86, 24); g.strokeStyle = 'rgba(70,70,80,.4)'; g.beginPath(); g.moveTo(4, 40); g.lineTo(122, 44); g.stroke(); }), transparent:true, depthWrite:false, roughness:.95 }), LX + 0.012, 0.88, -0.25, 0, Math.PI / 2, 0);
    K.keep = [lb, tin]; K.board = lb; K.tin = tin; K.tinLid = tlid;
    // ---- back right: the small stove and the coal scuttle with scorched scraps ----
    const sx = 1.25, sz = BZ + 0.55;
    const st = grp(sx, 0, sz); box(0.42, 0.55, 0.4, mats.iron, 0, 0.33, 0, true, st); box(0.46, 0.04, 0.44, mats.iron, 0, 0.62, 0, true, st); cyl(0.05, 0.05, 1.6, mats.iron, 0, 1.42, -0.08, 8, st);
    plane(0.18, 0.1, new T.MeshBasicMaterial({ color:0x2a1408 }), 0, 0.32, 0.201, 0, 0, 0, st);
    const sc = grp(sx - 0.55, 0, sz + 0.15); const scM = K.M({ color:0x2e2e30, roughness:.5, metalness:.6 });
    const sb = new T.Mesh(new T.CylinderGeometry(0.16, 0.13, 0.3, 14, 1, true), scM); sb.position.y = 0.15; sb.castShadow = true; sb.material.side = T.DoubleSide; sc.add(sb); cyl(0.13, 0.13, 0.02, scM, 0, 0.01, 0, 14, sc);
    for (let i = 0; i < 6; i++) sph(0.04, col(0x111111, .6), rnd(-.07, .07), 0.2 + rnd(0, .04), rnd(-.07, .07), sc, 5);
    for (let i = 0; i < 5; i++){ const p = plane(0.07, 0.05, K.M({ color:0xe9dcbc, side:T.DoubleSide, roughness:.9 }), rnd(-.06, .06), 0.27, rnd(-.06, .06), -Math.PI / 2 + rnd(-.4, .4), 0, rnd(0, 3), sc); }
    const hd = cyl(0.008, 0.008, 0.2, mats.iron, 0, 0.32, 0, 5, sc); hd.rotation.x = Math.PI / 2;
    // the warm chimney breast from the bakery ovens
    box(0.7, H, 0.5, K.M({ map:tex(128, 256, (g, w, h) => { g.fillStyle = '#6a4a3a'; g.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let c = 0; c < 3; c++){ g.fillStyle = D.shade('#9a5a3a', rnd(-18, 18)); g.fillRect(c * 44 + (r % 2 ? 22 : 0) - 22 + 2, r * 16 + 2, 40, 12); } }), roughness:.95 }), RX - 0.35 - 0.35, H / 2, BZ + 0.25);
    // ---- the chair, with Jasper's choir music and a scarf ----
    const ch = grp(-0.45, 0, -1.45, 0.5); const cm = col(0x6b4423, .6); box(0.42, 0.04, 0.4, cm, 0, 0.45, 0, true, ch); box(0.42, 0.45, 0.04, cm, 0, 0.7, -0.19, true, ch); for (const a of [[-.18, -.17], [-.18, .17], [.18, -.17], [.18, .17]]) box(0.03, 0.45, 0.03, mats.dark, a[0], 0.225, a[1], true, ch);
    plane(0.28, 0.36, mats.paper, 0, 0.475, 0.02, -Math.PI / 2, 0, 0.2, ch); box(0.1, 0.4, 0.06, col(0x1f5a33, .9), 0.12, 0.72, -0.2, false, ch);
    // ---- front wall: the stair door, the wardrobe with the bird box, a candle and a few books ----
    K.door({ side:'front', u:-0.9, w:0.8, h:1.95, mat:col(0x5a3a22, .6), panel:0x6b4423 });
    const wd = grp(1.25, 0, FZ - 0.3); const wm = col(0x5a3622, .55);
    box(0.9, 1.9, 0.5, wm, 0, 0.95, 0, true, wd); box(0.02, 1.7, 0.02, mats.dark, 0, 0.95, -0.26, false, wd); for (const x of [-0.08, 0.08]) sph(0.02, mats.brass, x, 1.0, -0.26, wd, 6);
    const bbx = grp(1.2, 1.9, FZ - 0.3); const bbm = col(0xb08a5a, .7);   // the bird box (the gold star of The Hidden Case stands beside it) box(0.22, 0.24, 0.2, bbm, 0, 0.12, 0, true, bbx); const r1 = box(0.27, 0.025, 0.24, col(0x8a6440, .7), -0.07, 0.27, 0, true, bbx); r1.rotation.z = 0.55; const r2 = box(0.27, 0.025, 0.24, col(0x8a6440, .7), 0.07, 0.27, 0, true, bbx); r2.rotation.z = -0.55;
    plane(0.06, 0.06, K.M({ map:tex(32, 32, (g) => { g.fillStyle = '#b08a5a'; g.fillRect(0, 0, 32, 32); g.fillStyle = '#1a1008'; g.beginPath(); g.arc(16, 16, 13, 0, Math.PI * 2); g.fill(); }) }), 0, 0.14, -0.101, 0, Math.PI, 0, bbx);
    const sh = grp(LX + 0.4, 0, FZ - 0.4); box(0.5, 0.6, 0.35, col(0x6b4423, .6), 0, 0.3, 0, true, sh); K.books(-0.22, 0.2, 0.6, 0, 0, sh);
    cyl(0.04, 0.05, 0.03, mats.brass, 0.15, 0.615, 0.08, 10, sh); cyl(0.018, 0.018, 0.12, col(0xf4f1ea, .8), 0.15, 0.69, 0.08, 8, sh);
    const fl = new T.Sprite(new T.SpriteMaterial({ map:K.tex(32, 64, (g, w, h) => { const gr = g.createRadialGradient(16, 40, 1, 16, 34, 16); gr.addColorStop(0, 'rgba(255,245,200,1)'); gr.addColorStop(1, 'rgba(255,140,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), transparent:true, blending:T.AdditiveBlending, depthWrite:false })); fl.scale.set(0.05, 0.1, 1); fl.position.set(LX + 0.55, 0.79, FZ - 0.32); K.scene.add(fl);
    K.point(0xffb060, 0.7, 4, LX + 0.55, 0.95, FZ - 0.5);
    // a coat hook with a scarf, and a jug on a washstand
    box(0.04, 0.04, 0.2, mats.dark, RX - 0.05, 1.05, 1.2, false); box(0.08, 0.6, 0.18, col(0xb3241f, .9), RX - 0.1, 0.78, 1.2, false);
    const ws = grp(RX - 0.4, 0, 1.9); box(0.42, 0.7, 0.4, col(0x6b4423, .6), 0, 0.35, 0, true, ws); cyl(0.14, 0.1, 0.07, col(0xf4f1ea, .3), 0, 0.74, 0, 14, ws); cyl(0.05, 0.065, 0.2, col(0xf4f1ea, .3), 0.08, 0.81, 0.06, 12, ws);
    // a hanging lamp from the ridge
    cyl(0.005, 0.005, 0.5, mats.iron, 0.1, H - 0.25, -0.2, 4); cyl(0.05, 0.12, 0.09, K.M({ color:0x8a6a3a, side:T.DoubleSide, roughness:.6, emissive:0x6a4a1a, emissiveIntensity:.25 }), 0.1, H - 0.52, -0.2, 12);
    K.point(0xffd0a0, 0.7, 7, 0.1, H - 0.7, -0.2);
    K.holly(0.2, WIN.t + 0.14, BZ + 0.05, 1.2);
    K.key([0.3, H - 0.2, 1.4], [-0.6, 0.0, -0.4], 0.5, Math.PI / 2.4);
    K.scene.add(new T.HemisphereLight(0xffe2b8, 0x24160c, 0.3));
  },
  onFound(id, K){
    if (id === 'board' && K.board){ K.board.rotation.x = -0.9; K.board.position.y = 0.03; K.tin.visible = true; }
    if (id === 'tin' && K.tinLid){ K.tinLid.position.set(0.2, 0.01, 0.05); K.tinLid.rotation.y = 0.4; }
  },

  clues:{
    scraps:{ name:'The coal scuttle', at:[0.7, 0.2, -1.8], size:[0.38, 0.4, 0.38],
      look:'A coal scuttle stands by the little stove. The stove has gone out.',
      prompt:'Look inside the scuttle. Is there anything besides coal?', hint:'Look for something pale among the coal.', hot:[[0.2, 0.2, 0.8, 0.8]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#1a1a1c'; g.fillRect(0, 0, w, h); for (let i = 0; i < 160; i++){ g.fillStyle = `rgba(${40 + Math.random() * 30},${40 + Math.random() * 30},${44 + Math.random() * 30},1)`; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 10 + Math.random() * 18, 0, Math.PI * 2); g.fill(); }
        const scrap = (x, y, r) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = '#e9dcbc'; g.beginPath(); g.moveTo(-60, -28); g.lineTo(55, -34); g.lineTo(64, 20); g.lineTo(10, 30); g.lineTo(-58, 26); g.closePath(); g.fill(); g.strokeStyle = 'rgba(60,30,10,.8)'; g.lineWidth = 5; g.stroke(); g.fillStyle = 'rgba(30,40,90,.6)'; for (let k = 0; k < 3; k++) g.fillRect(-46, -14 + k * 12, 80 + Math.random() * 10, 3); g.restore(); };
        scrap(210, 160, -0.2); scrap(360, 200, 0.25); scrap(290, 270, -0.05); scrap(400, 120, 0.1); scrap(180, 260, 0.35); scrap(320, 110, -0.3); },
      kicker:'Evidence',
      html:'<p>Torn pages from a diary, thrown in the coal scuttle. The stove went out, so they are only scorched at the edges. Six scraps, lettered as they came out:</p><div class="doc hand" style="font-size:19px"><b>A</b> F.M. wants more. Same price. I told him no, and then I told him<br><b>B</b> ...Dec. I will pay it all back after Christmas, every penny, and nobody need ever know.<br><b>C</b> F.M. paid me 200 at the bus shelter in Hartwell. 200 in the tin. Mum\'s rent is paid for the winter. So why can\'t I sleep?<br><b>D</b> yes. 400 in the tin now. It lives under the loose board by the bed.<br><b>E</b> ...Oct. Met F.M. at Hartwell market. Smart coat, smarter talk. He asked what Mr C. is working on.<br><b>F</b> Third time. 600 in the tin. That is the last. I promised myself.</div>',
      note:'Diary scraps in the coal scuttle: F.M. paid 200 three times, 600 in all, kept in a tin under the loose board by the bed. Who is F.M.?' },

    board:{ name:'The floorboards by the bed', at:[-1.65, 0.06, 0.18], size:[0.34, 0.2, 0.34], reveal:true,
      look:'Bare floorboards run along beside the narrow bed.',
      prompt:'Look closely at the boards. Is one of them different?', hint:'Look for a board that does not sit flat.', hot:[[0.42, 0.06, 0.58, 0.94]],
      draw(g, w, h, K, open){ const D = K.D; for (let i = 0; i < 8; i++){ const x = i * 75; g.fillStyle = D.shade('#7a5634', (i * 7) % 20 - 10); g.fillRect(x, 0, 75, h); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x, 0, 3, h); for (let k = 0; k < 10; k++){ g.strokeStyle = 'rgba(40,20,5,.15)'; g.beginPath(); const xx = x + 8 + Math.random() * 60; g.moveTo(xx, 0); g.lineTo(xx + Math.random() * 6 - 3, h); g.stroke(); } g.fillStyle = '#2a2a2c'; g.fillRect(x + 34, 30, 6, 6); g.fillRect(x + 34, h - 36, 6, 6); }
        if (!open){ g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(297, 0, 6, h); g.fillRect(372, 0, 5, h); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(300, 0, 75, 16); }
        else { g.fillStyle = '#120a04'; g.fillRect(300, 20, 75, h - 40); g.fillStyle = '#8e1f1f'; D.rr(g, 305, 120, 64, 110, 6); g.fill(); g.fillStyle = '#e2b33c'; g.fillRect(305, 120, 64, 10); g.fillStyle = '#6e4e30'; g.save(); g.translate(420, 200); g.rotate(0.25); g.fillRect(-36, -190, 72, 380); g.restore(); } },
      kicker:'Clue',
      html:'<p>One board by the bed is loose. It lifts with a creak.</p><div class="observe">Underneath it sits a <b>toffee tin</b>.</div>',
      note:'A loose board by the bed. Under it: a toffee tin.' },

    tin:{ name:'The toffee tin', requires:'board', at:[-1.65, 0.07, 0.6], size:[0.3, 0.2, 0.34], reveal:true,
      look:'The toffee tin sits in the hole under the loose board.',
      prompt:'Open the tin and look inside.', hint:'Lift the lid.', hot:[[0.2, 0.2, 0.8, 0.8]],
      draw(g, w, h, K, open){ const D = K.D; g.fillStyle = '#120a04'; g.fillRect(0, 0, w, h); g.fillStyle = '#8e1f1f'; D.rr(g, 120, 60, 360, 280, 18); g.fill(); g.strokeStyle = '#e2b33c'; g.lineWidth = 8; g.stroke();
        if (!open){ g.fillStyle = '#e2b33c'; for (let i = 0; i < 8; i++) D.star(g, 160 + (i % 4) * 92, 120 + Math.floor(i / 4) * 150, 14); g.fillStyle = '#b8892e'; D.rr(g, 240, 170, 120, 60, 10); g.fill(); }
        else { g.fillStyle = '#5a1010'; D.rr(g, 136, 76, 328, 248, 12); g.fill(); g.fillStyle = '#151515'; g.fillRect(170, 110, 230, 190); g.fillStyle = '#9fae8a'; g.save(); g.translate(330, 150); g.rotate(0.2); g.fillRect(-80, -30, 160, 60); g.fillStyle = '#7a8a6a'; g.fillRect(-80, -30, 160, 10); g.restore(); g.fillStyle = '#b6c2a0'; g.save(); g.translate(260, 250); g.rotate(-0.1); g.fillRect(-70, -26, 140, 52); g.restore(); } },
      kicker:'Evidence',
      html:'<p>Inside the toffee tin: a few folded banknotes, and under them a small black notebook. One page is written in numbers:</p><div class="doc type" style="font-size:13.5px"><b>p4</b><br><br>Paid by: 6.9 1.3<br>Paid to: 8.6 4.7<br><br>3.6 2.1 5.4 .......... 200<br>4.5 7.1 3.2 2.5 8.5 .......... 200<br>6.1 3.8 7.8 6.8 3.10 1.7 .......... 200<br><br>Nothing else is written in the book.</div>',
      note:'In the toffee tin: a few banknotes and a small black notebook, the ledger, written in a number code: "p4", "Paid by", "Paid to", and three lines of 200.' },
  },

  decoys:{
    bed:{ name:'The narrow bed', at:[-2.3, 0.35, -0.1], size:[0.84, 0.6, 1.2], look:'A narrow bed under the sloping roof, with a green blanket.', close:'Nothing under the pillow or the mattress. Nothing out of place.' },
    birds:{ name:'The carved birds', at:[0.2, 1.15, -2.37], size:[0.9, 0.16, 0.24], look:'A row of little wooden birds stands along the window sill. Someone has carved them with great care.', close:'A robin, a wren, a sparrow, a blackbird, a finch and a thrush. Nothing out of place.' },
    window:{ name:'The round window', at:[0.2, 1.5, -2.46], size:[0.66, 0.5, 0.1], look:'A small round window looks across the High Street to the toy shop and the church tower.', close:'Nothing out of place.' },
    stove:{ name:'The little stove', at:[1.25, 0.35, -1.95], size:[0.46, 0.7, 0.44], look:'A small iron stove. It has gone out, and the room is cooling.', close:'Cold ash inside. Nothing out of place.' },
    chimney:{ name:'The chimney breast', at:[2.1, 1.5, -2.25], size:[0.72, 1.4, 0.5], look:'Warm bricks from the bakery ovens below.', close:'They smell faintly of fresh bread. Nothing out of place.' },
    chair:{ name:'The chair', at:[-0.45, 0.55, -1.45], size:[0.5, 0.95, 0.5], look:'A plain chair with a sheet of music on the seat and a green scarf on its back.', close:'The music is the tenor part of Silent Night. Nothing out of place.' },
    wardrobe:{ name:'The wardrobe', at:[1.25, 0.9, 2.2], size:[0.92, 1.78, 0.52], look:'A small wardrobe against the end wall.', close:'Two shirts and a Sunday jacket. Nothing out of place.' },
    shelf:{ name:'The book shelf', at:[-2.4, 0.7, 2.1], size:[0.54, 0.4, 0.4], look:'A low shelf with a few books and a candle.', close:'Books about carving, and an old atlas. Nothing out of place.' },
    washstand:{ name:'The wash stand', at:[2.4, 0.55, 1.9], size:[0.46, 0.75, 0.44], look:'A wash stand with a jug and basin.', close:'Cold water and a cake of soap. Nothing out of place.' },
    birdbox:{ name:'The bird box', at:[1.2, 2.06, 2.2], size:[0.3, 0.34, 0.28], look:'A carved wooden bird box sits on top of the wardrobe.', close:'Beautifully made, with a little round door. Empty inside. Nothing out of place.' },
    door:{ name:'The stair door', at:[-0.9, 0.98, 2.46], size:[0.82, 1.95, 0.12], look:'The door to the steep stair down to the bakery.', close:'Nothing out of place.' },
  },

  // ---------------------------------------------------------------- extra clues (room only, never needed: one for each night)
  extras:{
    wall:{ night:14, name:'The wall by the bed', at:[-2.74, 0.88, -0.25], size:[0.1, 0.24, 0.4],
      look:'The bare wall beside the narrow bed, low under the slope of the roof.',
      prompt:'Look closely at the wall. Has anyone written on it?', hint:'Look for faint pencil near the pillow.', hot:[[0.2, 0.34, 0.86, 0.64]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#d9cbb0'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++){ g.fillStyle = `rgba(120,90,60,${Math.random() * .08})`; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } g.fillStyle = '#fbf7ee'; g.fillRect(0, h * .78, w * .5, h * .22); g.fillStyle = '#3e5a46'; g.fillRect(w * .5, h * .8, w * .5, h * .2);
        g.save(); g.translate(300, 200); g.rotate(-0.04); g.fillStyle = 'rgba(70,70,80,.72)'; g.font = '44px Georgia'; g.fillText('200.', -170, 0); g.fillText('400.', -40, 10); g.fillText('600.', 90, -4); g.strokeStyle = 'rgba(70,70,80,.45)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-180, 26); g.lineTo(200, 34); g.stroke(); g.restore(); },
      text:'Scratched on the wall by the bed, a running total in pencil: "200. 400. 600."' },

    slip:{ night:15, requires:'board', name:'A scrap under the tin', at:[-1.62, 0.05, 0.85], size:[0.22, 0.12, 0.2],
      look:'A corner of paper pokes out from under the toffee tin.',
      prompt:'Slide the scrap out and read it.', hint:'Look at the writing on the paper.', hot:[[0.2, 0.3, 0.8, 0.72]],
      draw(g, w, h, K){ const D = K.D; g.fillStyle = '#120a04'; g.fillRect(0, 0, w, h); g.save(); g.translate(300, 200); g.rotate(0.05); g.fillStyle = '#ece2c6'; g.beginPath(); g.moveTo(-200, -90); g.lineTo(190, -100); g.lineTo(205, 86); g.lineTo(-40, 96); g.lineTo(-196, 80); g.closePath(); g.fill(); g.restore();
        D.text(g, ['Owl. Robin. Sleigh.', 'F.M. pays on delivery.'], 300, 150, 44, '34px Caveat, cursive', '#1a2550', 'center'); },
      text:'Tucked under the toffee tin, a scrap in Jasper\'s writing: "Owl. Robin. Sleigh. F.M. pays on delivery."' },
  },

  // ---------------------------------------------------------------- The Hidden Case: the small gold star (clue in assets/star.js)
  star:{ at:[1.5, 1.965, 2.02], rot:[0, Math.PI, -0.15], size:[0.22, 0.2, 0.2], seek:'Look high up, on top of the wardrobe.' },

  clips:{
  },
  // Recorded voices go in /audio/ at the site root; if a file is missing, the phone's own voice reads the words.
  AUDIO_FILES:{  },
};
CM.start(ROOM);
